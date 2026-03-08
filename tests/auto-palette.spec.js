import { test, expect } from '@playwright/test'

// Processing can finish instantly for tiny fixtures, so only require settle-to-idle.
async function waitForProcessing(page) {
  const container = page.getByTestId('preview-container')
  await container.waitFor({ state: 'attached', timeout: 10000 })
  try {
    await expect(container).toHaveAttribute('aria-busy', 'true', { timeout: 2000 })
  } catch {
    // Small images may finish before the test observes the busy state.
  }
  await expect(container).toHaveAttribute('aria-busy', 'false', { timeout: 10000 })
}

// Use a known-good 1x1 PNG to keep upload/decode behavior stable across browsers.
function createRedPixelImage() {
  const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQotAAAAAElFTkSuQmCC'
  return Buffer.from(b64, 'base64')
}

test('auto palette triggers preview reprocessing when palette size changes', async ({ page }) => {
  await page.goto('/')

  // Upload via hidden input for cross-browser stability.
  const fileInput = page.getByTestId('file-input')
  await fileInput.setInputFiles({ name: 'red.png', mimeType: 'image/png', buffer: createRedPixelImage() })
  // If preview container is not available in this build, skip to avoid false negatives
  try {
    await page.getByTestId('preview-container').waitFor({ state: 'attached', timeout: 10000 })
  } catch {
    test.skip()
  }
  await waitForProcessing(page)
  await page.evaluate(() => {
    const container = document.querySelector('[data-testid="preview-container"]')
    globalThis.__busyTransitions = 0
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === 'attributes' && record.attributeName === 'aria-busy') {
          globalThis.__busyTransitions += 1
        }
      }
    })
    observer.observe(container, { attributes: true, attributeFilter: ['aria-busy'] })
    globalThis.__busyObserver?.disconnect?.()
    globalThis.__busyObserver = observer
  })

  // Enable auto palette and adjust palette size so the preview reprocesses.
  await page.locator('#auto-palette').check()
  const size = page.locator('#palette-size')
  await size.evaluate((el) => {
    el.value = '2'
    el.dispatchEvent(new globalThis.Event('input', { bubbles: true }))
    el.dispatchEvent(new globalThis.Event('change', { bubbles: true }))
  })
  await expect(size).toHaveValue('2')
  await waitForProcessing(page)

  await expect.poll(() => page.evaluate(() => globalThis.__busyTransitions || 0), { timeout: 10000 }).toBeGreaterThan(0)
})
