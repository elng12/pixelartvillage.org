import sharp from 'sharp'
import { test, expect } from '@playwright/test'

async function waitForProcessing(page) {
  const container = page.getByTestId('preview-container')
  await container.waitFor({ state: 'attached', timeout: 10000 })
  try {
    await expect(container).toHaveAttribute('aria-busy', 'true', { timeout: 2000 })
  } catch {
    // Small or cached images can finish before the test observes the busy state.
  }
  await expect(container).toHaveAttribute('aria-busy', 'false', { timeout: 10000 })
}

async function openEditorWithFixture(page) {
  const buffer = await sharp({
    create: {
      width: 64,
      height: 64,
      channels: 4,
      background: { r: 214, g: 126, b: 44, alpha: 1 },
    },
  })
    .png()
    .toBuffer()

  await page.goto('/')
  await page.getByTestId('file-input').setInputFiles({
    name: 'export-fixture.png',
    mimeType: 'image/png',
    buffer,
  })
  await expect(page.getByRole('heading', { name: 'Online Pixel Art Maker' })).toBeVisible()
  await waitForProcessing(page)
}

async function setPixelSize(page, value) {
  const slider = page.getByRole('slider', { name: /^Pixel Size:/ })
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
  await expect(slider).toHaveValue(String(value))
}

async function downloadCurrentExport(page) {
  const downloadButton = page.getByRole('button', { name: 'Download Pixel Art Image', exact: true }).last()
  const downloadPromise = page.waitForEvent('download', { timeout: 30000 })
  await downloadButton.scrollIntoViewIfNeeded()
  await downloadButton.click({ force: true })
  const download = await downloadPromise
  const filePath = await download.path()
  return {
    metadata: await sharp(filePath).metadata(),
    raw: await sharp(filePath).raw().toBuffer(),
  }
}

test('demo image unlocks real export options and grid color controls', async ({ page }) => {
  await openEditorWithFixture(page)

  await expect(page.getByRole('button', { name: 'Pixel size', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Original size', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: '2× original', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: '4× original', exact: true })).toBeVisible()
  await expect(
    page.getByText('Pixel size exports the true pixel-grid dimensions. Original size scales the result back to your source image size.')
  ).toBeVisible()

  await setPixelSize(page, 8)
  await waitForProcessing(page)

  await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
  const pixelExport = await downloadCurrentExport(page)

  await page.getByRole('button', { name: 'Original size', exact: true }).click()
  const sourceExport = await downloadCurrentExport(page)

  await page.getByRole('button', { name: '2× original', exact: true }).click()
  const doubleExport = await downloadCurrentExport(page)

  await page.getByRole('button', { name: '4× original', exact: true }).click()
  const quadExport = await downloadCurrentExport(page)

  expect(pixelExport.metadata.width).toBe(Math.floor(sourceExport.metadata.width / 8))
  expect(pixelExport.metadata.height).toBe(Math.floor(sourceExport.metadata.height / 8))
  expect(doubleExport.metadata.width).toBe(sourceExport.metadata.width * 2)
  expect(doubleExport.metadata.height).toBe(sourceExport.metadata.height * 2)
  expect(quadExport.metadata.width).toBe(sourceExport.metadata.width * 4)
  expect(quadExport.metadata.height).toBe(sourceExport.metadata.height * 4)

  await page.getByRole('button', { name: 'Original size', exact: true }).click()
  const sourceWithoutGrid = await downloadCurrentExport(page)

  const gridToggle = page.locator('#grid-toggle')
  await gridToggle.check()
  await expect(page.locator('#grid-color')).toBeVisible()

  const sourceWithGrid = await downloadCurrentExport(page)

  expect(sourceWithGrid.metadata.width).toBe(sourceWithoutGrid.metadata.width)
  expect(sourceWithGrid.metadata.height).toBe(sourceWithoutGrid.metadata.height)
  expect(sourceWithGrid.raw.equals(sourceWithoutGrid.raw)).toBe(false)
})
