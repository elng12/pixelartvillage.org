import sharp from 'sharp'
import { test, expect } from '@playwright/test'

async function waitForProcessing(page) {
  const container = page.getByTestId('preview-container')
  await container.waitFor({ state: 'attached', timeout: 10000 })
  try {
    await expect(container).toHaveAttribute('aria-busy', 'true', { timeout: 2000 })
  } catch {
    // Large images can still finish before the busy state is observed.
  }
  await expect(container).toHaveAttribute('aria-busy', 'false', { timeout: 10000 })
}

async function openEditorWithLargeFixture(page) {
  const buffer = await sharp({
    create: {
      width: 1600,
      height: 900,
      channels: 4,
      background: { r: 214, g: 126, b: 44, alpha: 1 },
    },
  })
    .png()
    .toBuffer()

  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')
  await page.getByTestId('file-input').setInputFiles({
    name: 'zoom-fixture.png',
    mimeType: 'image/png',
    buffer,
  })
  await waitForProcessing(page)
}

async function setZoom(page, value) {
  const slider = page.locator('#zoom-slider')
  await slider.evaluate((element, nextValue) => {
    const input = element
    const prototype = Object.getPrototypeOf(input)
    const descriptor = Object.getOwnPropertyDescriptor(prototype, 'value')
    const previousValue = input.value

    descriptor.set.call(input, String(nextValue))

    const tracker = input._valueTracker
    if (tracker) {
      tracker.setValue(previousValue)
    }

    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }, value)
}

test('zoom label stays readable and manual zoom survives layout resize', async ({ page }) => {
  await openEditorWithLargeFixture(page)

  const zoomLabel = page.getByText(/^Zoom: /)
  await expect(zoomLabel).toHaveText(/^Zoom: \d+(?:\.\d{1,2})?x$/)

  await setZoom(page, 1.5)
  await expect(page.locator('#zoom-slider')).toHaveValue('1.5')
  await expect(zoomLabel).toHaveText('Zoom: 1.5x')

  await page.setViewportSize({ width: 980, height: 900 })
  await expect(page.locator('#zoom-slider')).toHaveValue('1.5')
  await expect(zoomLabel).toHaveText('Zoom: 1.5x')
})
