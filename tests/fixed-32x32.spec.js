import sharp from 'sharp'
import { test, expect } from '@playwright/test'

async function waitForProcessing(page) {
  const container = page.getByTestId('preview-container')
  await container.waitFor({ state: 'attached', timeout: 10000 })
  try {
    await expect(container).toHaveAttribute('aria-busy', 'true', { timeout: 2000 })
  } catch {
    // Small images can finish before the busy state is observed.
  }
  await expect(container).toHaveAttribute('aria-busy', 'false', { timeout: 10000 })
}

async function downloadImage(page) {
  const downloadButton = page.getByRole('button', { name: 'Download Pixel Art Image', exact: true }).last()
  const downloadPromise = page.waitForEvent('download', { timeout: 30000 })
  await downloadButton.click({ force: true })
  const download = await downloadPromise
  const filePath = await download.path()
  const pipeline = sharp(filePath)
  return {
    metadata: await pipeline.metadata(),
    raw: await sharp(filePath).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
  }
}

test('32x32 converter processes and exports a true fixed-size image', async ({ page }) => {
  const buffer = await sharp({
    create: {
      width: 80,
      height: 40,
      channels: 4,
      background: { r: 220, g: 42, b: 54, alpha: 1 },
    },
  }).png().toBuffer()

  await page.goto('/converter/32x32-pixel-art/')
  const pageHeading = page.getByRole('heading', { level: 1, name: 'Image to Pixel Art 32x32 Converter' })
  await expect(pageHeading).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  await expect(page.getByText('Upload an image for a true 32x32 conversion', { exact: true })).toHaveCount(0)
  const desktopUploadBox = await page.getByTestId('upload-zone').boundingBox()
  const desktopHeadingBox = await pageHeading.boundingBox()
  expect(desktopUploadBox?.y).toBeLessThan(360)
  expect(desktopUploadBox?.y).toBeGreaterThan((desktopHeadingBox?.y || 0) + (desktopHeadingBox?.height || 0))
  expect(Math.abs(
    ((desktopUploadBox?.x || 0) + (desktopUploadBox?.width || 0) / 2)
    - ((desktopHeadingBox?.x || 0) + (desktopHeadingBox?.width || 0) / 2),
  )).toBeLessThan(4)
  await page.getByTestId('file-input').setInputFiles({
    name: 'wide-source.png',
    mimeType: 'image/png',
    buffer,
  })
  await waitForProcessing(page)

  await expect(page.getByTestId('fixed-output-controls')).toContainText('32 x 32 px')
  await expect(page.getByRole('slider', { name: /^Pixel Size:/ })).toHaveCount(0)
  await expect(page.getByRole('button', { name: '32 x 32', exact: true })).toHaveAttribute('aria-pressed', 'true')

  const cropped = await downloadImage(page)
  expect(cropped.metadata.width).toBe(32)
  expect(cropped.metadata.height).toBe(32)
  expect(cropped.raw.data[3]).toBe(255)

  await page.getByRole('button', { name: 'Fit entire image', exact: true }).click()
  await waitForProcessing(page)
  const contained = await downloadImage(page)
  expect(contained.metadata.width).toBe(32)
  expect(contained.metadata.height).toBe(32)
  expect(contained.raw.data[3]).toBe(0)
  const centerPixelAlpha = contained.raw.data[((16 * 32 + 16) * 4) + 3]
  expect(centerPixelAlpha).toBe(255)

  await page.getByRole('button', { name: '64 x 64', exact: true }).click()
  const enlarged = await downloadImage(page)
  expect(enlarged.metadata.width).toBe(64)
  expect(enlarged.metadata.height).toBe(64)

  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.getByTestId('fixed-output-controls')).toBeVisible()
  const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  expect(hasHorizontalOverflow).toBe(false)
})
