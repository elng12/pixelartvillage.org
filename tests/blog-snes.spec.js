import { test, expect } from '@playwright/test'
import sharp from 'sharp'

const route = '/blog/how-to-get-pixel-art-version-of-image/'
const title = 'How to Turn a Photo Into Pixel Art: SNES-Style Workflow'
const seoTitle = `${title} | Pixel Art Village`
const description = 'Turn a photo into pixel art with a practical SNES-style workflow that simplifies shapes, limits the palette, and keeps the final image readable.'

for (const javaScriptEnabled of [false, true]) {
  test.describe(`SNES tutorial ${javaScriptEnabled ? 'runtime' : 'initial HTML'}`, () => {
    test.use({ javaScriptEnabled })

    for (const width of [1440, 390, 320]) {
      test(`${width}px corrected instructions and unchanged page identity`, async ({ page, request }) => {
        await page.setViewportSize({ width, height: width <= 390 ? 844 : 900 })
        expect((await page.goto('/blog/')).status()).toBe(200)
        if (javaScriptEnabled && process.env.EXPECT_CONSENT_BANNER === '1') {
          await page.getByRole('button', { name: 'Reject non-essential cookies', exact: true }).click()
        }
        const entry = page.getByRole('link', { name: title, exact: true })
        await expect(entry).toHaveAttribute('href', route)
        await entry.click()
        await page.reload()
        await expect(page).toHaveTitle(seoTitle)
        await expect(page.locator('html')).toHaveAttribute('lang', 'en')
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org${route}`)
        for (const key of ['description', 'og:description', 'twitter:description']) {
          await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', description)
        }
        for (const key of ['og:title', 'twitter:title']) {
          await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', seoTitle)
        }
        const article = page.locator('.blog-article-prose')
        await expect(article).toContainText('Increase Pixel Size for larger blocks and fewer output pixels')
        await expect(article).toContainText('Decrease it when you need to preserve more detail')
        await expect(article).not.toContainText('Lower the pixel size until')
        await expect(article).toContainText('Generate palette from image')
        await expect(article).toContainText('not a console-ready asset or an exact hardware mode')
        await expect(article).toContainText('960×762')
        await expect(article).toContainText('120×95')
        await expect(article).toContainText('80×63')
        expect((await request.get('/photo-sunflower-source.jpg')).status()).toBe(200)
        await expect(article).toContainText('Choose PNG and Pixel size under Export size')
        await expect(article).toContainText('Wait for the preview to finish updating before downloading')
        await expect(article.getByRole('link', { name: 'Photo to Pixel Art example', exact: true })).toHaveAttribute('href', '/converter/photo-to-pixel-art/')
        await expect(article.getByRole('link', { name: 'Image to Pixel Art Converter', exact: true }).first()).toHaveAttribute('href', '/converter/image-to-pixel-art/')
        for (const href of await article.locator('a').evaluateAll(links => links.map(link => link.getAttribute('href')).filter(href => href.startsWith('/')))) {
          expect((await request.get(href)).status(), `Article link ${href}`).toBe(200)
        }
        const schema = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.flatMap(node => JSON.parse(node.textContent)))
        const posting = schema.find(item => item['@type'] === 'BlogPosting')
        expect(posting.datePublished).toBe('2025-10-14')
        expect(posting.dateModified).toBe('2026-10-09')
        const faq = schema.find(item => item['@type'] === 'FAQPage')
        expect(faq.mainEntity).toHaveLength(3)
        for (const question of faq.mainEntity) {
          await expect(article.getByRole('heading', { name: question.name, exact: true })).toBeVisible()
          await expect(article).toContainText(question.acceptedAnswer.text)
        }
        await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        await test.info().attach(`snes-article-${width}-${javaScriptEnabled}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' })
      })
    }
  })
}

for (const width of [1440, 390]) {
  test(`SNES ${width}px instructions match actual converter dimensions and palette controls`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
    expect((await page.goto('/converter/image-to-pixel-art/')).status()).toBe(200)
    if (process.env.EXPECT_CONSENT_BANNER === '1') {
      await page.getByRole('button', { name: 'Reject non-essential cookies', exact: true }).click()
    }
    const source = await request.get('/photo-sunflower-source.jpg')
    expect(source.status()).toBe(200)
    const input = page.getByTestId('file-input')
    await input.setInputFiles({ name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('not an image') })
    await expect(page.getByTestId('editor-controls')).toHaveCount(0)
    await input.setInputFiles({ name: 'sunflower.jpg', mimeType: 'image/jpeg', buffer: await source.body() })
    const preview = page.getByTestId('preview-container')
    await expect(preview.locator('img')).toHaveAttribute('src', /^data:image\/png/)
    const pixelSize = page.getByRole('slider', { name: /^Pixel Size:/ })
    await expect(pixelSize).toHaveValue('1')
    await page.getByLabel('Palette', { exact: true }).selectOption('none')
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()

    const downloadPng = async (filename, dimensions) => {
      await expect(preview).toHaveAttribute('aria-busy', 'false')
      const pending = page.waitForEvent('download')
      await page.getByRole('button', { name: 'Download Pixel Art Image', exact: true }).last().click()
      const download = await pending
      const path = test.info().outputPath(filename)
      await download.saveAs(path)
      const png = sharp(path)
      const metadata = await png.metadata()
      expect([metadata.format, metadata.width, metadata.height]).toEqual(['png', ...dimensions])
      return png
    }

    for (let value = 2; value <= 12; value += 1) {
      const previous = await preview.locator('img').getAttribute('src')
      await pixelSize.press('ArrowRight')
      await expect(pixelSize).toHaveValue(String(value))
      await expect(preview.locator('img')).not.toHaveAttribute('src', previous)
      if (value === 8) await downloadPng('pixel-size-8.png', [120, 95])
    }
    const pixel12 = await downloadPng('pixel-size-12.png', [80, 63])
    const published = await request.get('/photo-sunflower-pixel12.png')
    expect(published.status()).toBe(200)
    expect((await pixel12.raw().toBuffer()).equals(await sharp(await published.body()).raw().toBuffer())).toBe(true)

    let previous = await preview.locator('img').getAttribute('src')
    await page.getByLabel('Generate palette from image', { exact: true }).check()
    await expect(preview.locator('img')).not.toHaveAttribute('src', previous)
    const colors = page.getByRole('slider', { name: /^# Palette Palette Colors:/ })
    await expect(colors).toHaveValue('16')
    for (let value = 17; value <= 24; value += 1) {
      previous = await preview.locator('img').getAttribute('src')
      await colors.press('ArrowRight')
      await expect(colors).toHaveValue(String(value))
      await expect(preview.locator('img')).not.toHaveAttribute('src', previous)
    }
    const limited = await downloadPng('pixel-size-12-auto-24.png', [80, 63])
    const { data, info } = await limited.removeAlpha().raw().toBuffer({ resolveWithObject: true })
    const palette = new Set()
    for (let i = 0; i < data.length; i += info.channels) palette.add(`${data[i]},${data[i + 1]},${data[i + 2]}`)
    expect(palette.size).toBeLessThanOrEqual(24)
    expect(palette.size).toBeGreaterThan(1)
    await preview.scrollIntoViewIfNeeded()
    await test.info().attach(`snes-editor-${width}`, { body: await page.screenshot(), contentType: 'image/png' })
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}
