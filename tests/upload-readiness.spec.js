import { test, expect } from '@playwright/test'
import sharp from 'sharp'

const routes = [
  '/',
  '/converter/png-to-pixel-art/',
  '/converter/image-to-pixel-art/',
  '/converter/photo-to-sprite-converter/',
  '/converter/16x16-pixel-art/',
  '/ru/',
]
const viewports = [{ width: 1440, height: 900 }, { width: 390, height: 844 }]

async function uploadFixture() {
  return {
    name: 'ready-upload.png',
    mimeType: 'image/png',
    buffer: await sharp({ create: { width: 64, height: 48, channels: 4, background: { r: 30, g: 120, b: 210, alpha: 0.5 } } }).png().toBuffer(),
  }
}

async function expectProcessedImage(page) {
  const preview = page.getByTestId('preview-container')
  await expect(preview.locator('img')).toHaveAttribute('src', /^data:image\/png/)
  await expect(preview).toHaveAttribute('aria-busy', 'false')
  await expect.poll(() => preview.locator('img').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true)
}

test.beforeEach(async ({ page }) => {
  await page.route(/googletagmanager|google-analytics|clarity\.ms|googlesyndication|doubleclick/, route => route.abort())
})

for (const viewport of viewports) {
  for (const route of routes) {
    test(`SSR upload stays disabled until handlers are ready: ${route} ${viewport.width}`, async ({ page }) => {
      await page.setViewportSize(viewport)
      let releaseScripts
      const gate = new Promise(resolve => { releaseScripts = resolve })
      await page.route('**/assets/**', async intercepted => {
        if (intercepted.request().resourceType() === 'script') await gate
        await intercepted.continue()
      })
      let chooserCount = 0
      page.on('filechooser', () => { chooserCount++ })
      try {
        const response = await page.goto(route, { waitUntil: 'commit' })
        expect(response.status()).toBe(200)
        const button = page.getByTestId('choose-file-btn')
        const input = page.getByTestId('file-input')
        const zone = page.getByTestId('upload-zone')
        await expect(button).toBeVisible()
        await expect(button).toBeDisabled()
        await expect(input).toBeDisabled()
        await expect(zone).toHaveAttribute('aria-busy', 'true')
        await expect(zone).toHaveAttribute('aria-disabled', 'true')
        expect(chooserCount).toBe(0)
        releaseScripts()
        // One ordinary click must wait for enabled state, not need a second attempt.
        const [chooser] = await Promise.all([
          page.waitForEvent('filechooser'),
          button.click(),
        ])
        expect(chooserCount).toBe(1)
        await expect(input).toBeEnabled()
        await chooser.setFiles(await uploadFixture())
        await expectProcessedImage(page)
        expect(chooserCount).toBe(1)
        expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false)
        await page.screenshot({ path: test.info().outputPath('processed.png') })
      } finally {
        releaseScripts()
        await page.unrouteAll({ behavior: 'wait' })
      }
    })
  }
  for (const slow of [false, true]) {
    test(`first normal file-picker click works on cold PNG page: ${viewport.width} ${slow ? 'slow' : 'normal'}`, async ({ page, context, browserName }) => {
      test.skip(slow && browserName !== 'chromium', 'Network emulation requires Chromium CDP')
      await page.setViewportSize(viewport)
      if (browserName === 'chromium') {
        const cdp = await context.newCDPSession(page)
        await cdp.send('Network.enable')
        await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
        if (slow) await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750 })
      }
      const errors = []
      let chooserCount = 0
      page.on('pageerror', error => errors.push(error.message))
      page.on('filechooser', () => { chooserCount++ })
      await page.goto('/converter/png-to-pixel-art/', { waitUntil: 'commit' })
      const [chooser] = await Promise.all([
        page.waitForEvent('filechooser'),
        page.getByTestId('choose-file-btn').click(),
      ])
      await chooser.setFiles(await uploadFixture())
      await expectProcessedImage(page)
      expect(chooserCount).toBe(1)
      expect(errors).toEqual([])
    })
  }
}

test('ready upload reports repeated invalid input and then accepts a valid image', async ({ page }) => {
  await page.goto('/converter/png-to-pixel-art/')
  const button = page.getByTestId('choose-file-btn')
  for (let selection = 0; selection < 2; selection++) {
    const [chooser] = await Promise.all([page.waitForEvent('filechooser'), button.click()])
    await chooser.setFiles({ name: 'not-an-image.txt', mimeType: 'text/plain', buffer: Buffer.from('not an image') })
    await expect(page.getByRole('alert')).toBeVisible()
    await expect(button).toBeEnabled()
    await expect(page.getByTestId('file-input')).toHaveValue('')
  }
  const [chooser] = await Promise.all([page.waitForEvent('filechooser'), button.click()])
  await chooser.setFiles(await uploadFixture())
  await expectProcessedImage(page)
})
