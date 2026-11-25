import sharp from 'sharp'
import { test, expect } from '@playwright/test'

for (const route of ['/converter/image-to-pixel-art/', '/converter/photo-to-sprite-converter/']) {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 1280, height: 800 }, { width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
    test(`${route} downloads remain clickable at ${viewport.width}x${viewport.height}`, async ({ page, request }) => {
      await page.setViewportSize(viewport)
      await page.goto(route)
      const input = page.getByTestId('file-input')
      await expect(input).toBeAttached()
      await page.waitForFunction(() => {
        const input = document.querySelector('[data-testid="file-input"]')
        return input && Object.keys(input).some((key) => key.startsWith('__reactProps$') && typeof input[key]?.onChange === 'function')
      })
      const reject = page.getByRole('button', { name: /Reject non/ })
      if (await reject.isVisible()) await reject.click()
      const source = await request.get('/photo-sunflower-source.jpg')
      expect(source.ok()).toBe(true)
      await input.setInputFiles({ name: 'sunflower.jpg', mimeType: 'image/jpeg', buffer: await source.body() })
      const preview = page.getByTestId('preview-container')
      await expect(preview).toHaveAttribute('aria-busy', 'false')
      await expect(preview.locator('img')).toHaveAttribute('src', /^data:image\/png/)
      const downloads = page.getByRole('button', { name: 'Download Pixel Art Image', exact: true })
      await expect(downloads).toHaveCount(2)
      const containment = await preview.evaluate((element) => {
        const box = element.getBoundingClientRect()
        const parent = element.parentElement.getBoundingClientRect()
        return box.bottom <= parent.bottom + 1
      })
      expect(containment, 'preview must not overflow its reserved layout height').toBe(true)
      for (let index = 0; index < 2; index += 1) {
        const button = downloads.nth(index)
        await expect(button).toBeEnabled()
        const pending = page.waitForEvent('download')
        await button.click()
        const download = await pending
        expect(await download.failure()).toBeNull()
        const image = await sharp(await download.path()).raw().toBuffer({ resolveWithObject: true })
        expect(image.info.width).toBe(960)
        expect(image.info.height).toBe(762)
        await page.screenshot({ path: test.info().outputPath(`download-${index + 1}.png`) })
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    })
  }
}
