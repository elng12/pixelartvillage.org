import { test, expect } from '@playwright/test'

// Minimal helper: wait for aria-busy flip on preview
async function waitForProcessing(page) {
  const container = page.getByTestId('preview-container')
  await container.waitFor({ state: 'attached', timeout: 10000 })
  await expect(container).toHaveAttribute('aria-busy', 'true', { timeout: 2000 })
  await expect(container).toHaveAttribute('aria-busy', 'false', { timeout: 10000 })
}

// 10x10 red PNG
function createRedPixelImage() {
  const header = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x0a, 0x08, 0x02, 0x00, 0x00, 0x00, 0x02, 0x50, 0x58, 0xea])
  const data = Buffer.from('x\xda\x63\x60\x18\x05\xa3\x60\x14\x8c\x80\x01\x00\x00\x0c\x00\x01', 'binary')
  const trailer = Buffer.from([0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82])
  const idatHeader = Buffer.alloc(4)
  idatHeader.writeUInt32BE(data.length, 0)
  return Buffer.concat([header, idatHeader, Buffer.from('IDAT'), data, trailer])
}

test('auto palette triggers kmeans worker and reprocesses', async ({ page }) => {
  await page.goto('/')

  // Upload small image to activate editor
  const uploadZone = page.getByTestId('upload-zone')
  const chooser = page.waitForEvent('filechooser')
  await uploadZone.click()
  const fc = await chooser
  await fc.setFiles({ name: 'red.png', mimeType: 'image/png', buffer: createRedPixelImage() })
  await expect(page.locator('h2:has-text("Online Pixel Art Maker")')).toBeVisible()

  // Listen to worker creation
  const workerSeen = new Promise((resolve) => {
    const to = setTimeout(() => resolve(false), 10000)
    page.on('worker', (w) => {
      const url = w.url() || ''
      if (url.includes('kmeansWorker')) { clearTimeout(to); resolve(true) }
    })
  })

  // Enable auto palette and set size to 2 (ensures KMeans path)
  await page.locator('#auto-palette').check()
  await waitForProcessing(page)
  const size = page.locator('#palette-size')
  // Move slider a bit to trigger processing reliably
  const bb = await size.boundingBox()
  await page.mouse.move(bb.x + 2, bb.y + bb.height / 2)
  await page.mouse.down(); await page.mouse.move(bb.x + bb.width / 3, bb.y + bb.height / 2); await page.mouse.up()
  await waitForProcessing(page)

  // Assert worker observed
  expect(await workerSeen).toBeTruthy()
})
