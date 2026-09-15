import sharp from 'sharp'
import { test, expect } from '@playwright/test'

const route = '/converter/photo-to-pixel-art/'
const title = 'Photo to Pixel Art Converter | Pixelate a Photo Online'

test('photo initial HTML keeps metadata, one intro, and the real example', async ({ page, request }) => {
  const response = await request.get(route)
  expect(response.status()).toBe(200)
  const html = await response.text()
  await page.goto(route)
  const audit = await page.evaluate((html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const schemas = [...doc.querySelectorAll('script[type="application/ld+json"]')].flatMap((el) => JSON.parse(el.textContent))
    return {
      title: doc.title,
      descriptions: ['description', 'og:description', 'twitter:description'].map((key) => doc.querySelector(`meta[property="${key}"],meta[name="${key}"]`).content),
      canonical: doc.querySelector('link[rel="canonical"]').href,
      social: ['og:title', 'twitter:title'].map((key) => doc.querySelector(`meta[property="${key}"],meta[name="${key}"]`).content),
      images: [...doc.querySelectorAll('[data-testid="photo-example"] img')].map((el) => el.getAttribute('src')),
      points: [...doc.querySelectorAll('span')].filter((el) => el.textContent === 'Photo-first controls').length,
      faq: schemas.find((entry) => entry['@type'] === 'FAQPage').mainEntity.map((entry) => entry.name),
      visibleFaq: [...doc.querySelectorAll('#faq h3')].map((el) => el.textContent),
      howTo: schemas.some((entry) => entry['@type'] === 'HowTo'),
    }
  }, html)
  expect(audit.title).toBe(title)
  expect(new Set(audit.descriptions).size).toBe(1)
  expect(audit.descriptions[0]).toBe('Convert a photo to pixel art online. Upload a portrait, pet photo, or camera shot, adjust pixel size and colors in your browser, then download a PNG.')
  expect(audit.canonical).toBe(`https://pixelartvillage.org${route}`)
  expect(audit.social).toEqual([title, title])
  expect(audit.images).toEqual(['/photo-sunflower-source.jpg', '/photo-sunflower-pixel12.png'])
  expect(audit.points).toBe(1)
  expect(audit.faq).toEqual(audit.visibleFaq)
  expect(audit.faq).toHaveLength(3)
  expect(audit.howTo).toBe(true)
  await expect(page.getByText('Photo-first controls', { exact: true })).toHaveCount(1)
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  const rankings = await page.locator('#main-content').evaluate((root) => {
    const words = root.innerText.toLowerCase().match(/[a-z0-9]+(?:['-][a-z0-9]+)*/g) || []
    return ['photo to pixel art', 'photo to pixel art converter'].map((target) => {
      const n = target.split(' ').length
      const counts = {}
      for (let i = 0; i <= words.length - n; i += 1) {
        const phrase = words.slice(i, i + n).join(' ')
        counts[phrase] = (counts[phrase] || 0) + 1
      }
      return { target, count: counts[target], otherMax: Math.max(...Object.entries(counts).filter(([key]) => key !== target).map(([, count]) => count)) }
    })
  })
  expect(rankings.map((item) => item.count)).toEqual([4, 3])
  for (const item of rankings) expect(item.count).toBeGreaterThan(item.otherMax)
  await expect(page.getByText('For PNG graphics with crisp edges or existing transparency.', { exact: true })).toBeVisible()
  await expect(page.getByText('For JPEG images with compression artifacts or softened detail.', { exact: true })).toBeVisible()
})

for (const width of [1440, 390]) {
  test(`photo ${width}px layout and actual export match the published example`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
    await page.goto(route)
    const upload = page.getByRole('button', { name: 'Upload photo', exact: true })
    await expect(upload).toBeVisible()
    const box = await upload.boundingBox()
    expect(box.y + box.height).toBeLessThan(page.viewportSize().height)
    const example = page.getByTestId('photo-example')
    await example.scrollIntoViewIfNeeded()
    await expect.poll(() => example.locator('img').evaluateAll((images) => images.every((img) => img.complete && img.naturalWidth > 0))).toBe(true)
    await expect(example.getByRole('link', { name: 'CC0', exact: true })).toHaveAttribute('href', 'https://creativecommons.org/publicdomain/zero/1.0/')
    await expect(page.locator('#faq h3')).toHaveCount(3)
    await expect(page.getByRole('heading', { name: 'Explore other converters', exact: true })).toBeVisible()
    await test.info().attach(`photo-page-${width}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' })
    const input = page.getByTestId('file-input')
    await input.setInputFiles({ name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('not an image') })
    await expect(page.getByTestId('editor-controls')).toHaveCount(0)
    const source = await request.get('/photo-sunflower-source.jpg')
    expect(source.status()).toBe(200)
    await input.setInputFiles({ name: 'sunflower.jpg', mimeType: 'image/jpeg', buffer: await source.body() })
    const preview = page.getByTestId('preview-container')
    await expect(preview.locator('img')).toHaveAttribute('src', /^data:image\/png/)
    const pixelSize = page.getByRole('slider', { name: /^Pixel Size:/ })
    await pixelSize.press('Home')
    await expect(pixelSize).toHaveValue('1')
    for (let value = 2; value <= 12; value += 1) {
      const previous = await preview.locator('img').getAttribute('src')
      await pixelSize.press('ArrowRight')
      await expect(pixelSize).toHaveValue(String(value))
      // Wait for the debounced conversion, not just the slider label or an idle flag.
      await expect(preview.locator('img')).not.toHaveAttribute('src', previous)
      await expect(preview).toHaveAttribute('aria-busy', 'false')
    }
    for (const name of ['Brightness', 'Contrast', 'Saturation']) {
      await expect(page.getByRole('slider', { name: new RegExp(`^${name}:`) })).toHaveValue('0')
    }
    await page.getByLabel('Palette', { exact: true }).selectOption('none')
    await expect(preview).toHaveAttribute('aria-busy', 'false')
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Pixel size', exact: true })).toHaveClass(/ring-blue-500/)
    const pending = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Download Pixel Art Image', exact: true }).last().click()
    const download = await pending
    await download.saveAs(test.info().outputPath('actual-photo-export.png'))
    const result = sharp(await download.path())
    const meta = await result.metadata()
    expect([meta.format, meta.width, meta.height]).toEqual(['png', 80, 63])
    const stored = await request.get('/photo-sunflower-pixel12.png')
    expect(stored.status()).toBe(200)
    expect((await result.raw().toBuffer()).equals(await sharp(await stored.body()).raw().toBuffer())).toBe(true)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await preview.scrollIntoViewIfNeeded()
    await test.info().attach(`photo-editor-${width}`, { body: await page.screenshot(), contentType: 'image/png' })
  })
}
