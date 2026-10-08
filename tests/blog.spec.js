import { test, expect } from '@playwright/test'
import sharp from 'sharp'

const germanComparisonRoute = '/de/blog/best-pixel-art-converters-compared-2025/'
const germanComparisonTitle = 'Pixel-Art-Konverter im Vergleich: 4 Werkzeuge für Bilder und Sprites'
const germanComparisonSeoTitle = 'Pixel-Art-Konverter: 4 Tools im Vergleich | Pixel-Art-Dorf'
const germanComparisonDescription = 'Vier Pixel-Art-Werkzeuge im Vergleich: Bildkonvertierung, Pixelbearbeitung und Animation. Mit belegten Funktionen und einem echten Fotobeispiel.'
const germanComparisonImage = '/blog-og/de/best-pixel-art-converters-compared-2025.png'

test('blog tutorial renders structured headings and main converter link', async ({ page }) => {
  await page.goto('/blog/how-to-pixelate-an-image/')

  await expect(
    page.getByRole('heading', { level: 2, name: 'Before you start' })
  ).toBeVisible()

  const converterLink = page.getByRole('link', { name: 'Image to Pixel Art Converter' }).first()
  await expect(converterLink).toHaveAttribute('href', '/converter/image-to-pixel-art/')
  await expect(page.getByText('## Before you start')).toHaveCount(0)
})

test('comparison article keeps comparison intent and links to the main converter', async ({ page }) => {
  await page.goto('/blog/best-pixel-art-converters-compared-2025/')

  await expect(
    page.getByRole('heading', { level: 2, name: 'What we compared' })
  ).toBeVisible()

  await expect(
    page.getByRole('heading', { level: 3, name: '1. Pixel Art Village (.org)' })
  ).toBeVisible()

  await expect(
    page.getByRole('link', { name: 'Image to Pixel Art Converter' }).first()
  ).toHaveAttribute('href', '/converter/image-to-pixel-art/')
  await expect(page.locator('main table')).toHaveCount(0)
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://pixelartvillage.org/blog-og/best-pixel-art-converters-compared-2025.png')
})

test('localized blog article resolves first-post placeholder to the localized beginner guide', async ({ page }) => {
  await page.goto('/ko/blog/how-to-get-pixel-art-version-of-image/')

  await expect(
    page.getByRole('link', { name: /How to Pixelate an Image: Image to Pixel Art Beginner Guide/i }).first()
  ).toHaveAttribute('href', '/ko/blog/how-to-pixelate-an-image/')
})

for (const javaScriptEnabled of [false, true]) {
  test.describe(`German comparison ${javaScriptEnabled ? 'runtime' : 'initial HTML'}`, () => {
    test.use({ javaScriptEnabled })

    for (const width of [1440, 390]) {
      test(`${width}px content, metadata, example and blog entry`, async ({ page, request }) => {
        await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
        const response = await page.goto('/de/blog/')
        expect(response.status()).toBe(200)
        if (javaScriptEnabled && process.env.EXPECT_CONSENT_BANNER === '1') {
          await page.getByRole('button', { name: 'Nicht unbedingt erforderliche Cookies ablehnen', exact: true }).click()
        }
        const entry = page.getByRole('link', { name: germanComparisonTitle, exact: true })
        await expect(entry).toHaveAttribute('href', germanComparisonRoute)
        await entry.click()
        await expect(page).toHaveURL(new RegExp(`${germanComparisonRoute}$`))
        await page.reload()
        await expect(page).toHaveTitle(germanComparisonSeoTitle)
        expect(germanComparisonSeoTitle.length).toBeGreaterThanOrEqual(55)
        expect(germanComparisonSeoTitle.length).toBeLessThanOrEqual(60)
        await expect(page.locator('html')).toHaveAttribute('lang', 'de')
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(germanComparisonTitle)
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org${germanComparisonRoute}`)
        for (const key of ['description', 'og:description', 'twitter:description']) {
          await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', germanComparisonDescription)
        }
        for (const key of ['og:title', 'twitter:title']) {
          await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', germanComparisonSeoTitle)
        }
        for (const key of ['og:image', 'twitter:image']) {
          await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', `https://pixelartvillage.org${germanComparisonImage}`)
        }
        for (const key of ['og:image:alt', 'twitter:image:alt']) {
          await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', 'Vier Pixel-Art-Werkzeuge im Vergleich mit Originalfoto und PNG-Ergebnis von Pixel Art Village')
        }
        await expect(page.locator('link[rel="alternate"][hreflang="de"]')).toHaveAttribute('href', `https://pixelartvillage.org${germanComparisonRoute}`)
        await expect(page.locator('main')).toContainText('Aktualisiert: 2026-10-08')
        await expect(page.locator('main')).toContainText('Wir haben diese drei Alternativen nicht mit demselben Foto getestet')
        await expect(page.locator('main')).not.toContainText(/Gesamtbewertung|9\.2\/10|10 beliebte|min read|Source image|Pixel art result|Related Articles|Back to Blog/)

        const selection = page.locator('#schnellwahl')
        await expect(selection.getByRole('heading', { level: 2 })).toHaveText('Welches Werkzeug passt zu Ihrer Aufgabe?')
        await expect(selection.locator('tbody tr')).toHaveCount(4)
        await expect(selection.locator('th[scope="row"]')).toHaveText(['Pixel Art Village', 'Aseprite', 'Piskel', 'GIMP'])
        await expect(selection.locator('td')).toHaveCount(16)
        await expect(selection).toContainText('PNG, JPEG, WEBP')
        await expect(selection).toContainText('Manuelle Bearbeitung statt Ein-Klick-Fotokonvertierung')
        await expect(selection).toContainText('Funktionsvergleich, kein gemeinsamer Bildqualitätstest')
        await expect(page.locator('h2').filter({ hasText: /^Welches Werkzeug passt zu Ihrer Aufgabe\?$/ })).toHaveCount(1)
        const selectionOrder = await selection.evaluate((el) => ({
          top: el.getBoundingClientRect().top + scrollY,
          beforeMethod: Boolean(el.compareDocumentPosition(document.querySelector('#grundlage')) & Node.DOCUMENT_POSITION_FOLLOWING),
          beforeNavigation: Boolean(el.compareDocumentPosition(el.parentElement.querySelector('nav')) & Node.DOCUMENT_POSITION_FOLLOWING),
        }))
        expect(selectionOrder.beforeMethod).toBe(true)
        expect(selectionOrder.beforeNavigation).toBe(true)
        expect(selectionOrder.top).toBeLessThan(1500)
        await selection.scrollIntoViewIfNeeded()
        await test.info().attach(`german-comparison-selection-${width}-${javaScriptEnabled}`, { body: await page.screenshot(), contentType: 'image/png' })

        const socialResponse = await request.get(germanComparisonImage)
        expect(socialResponse.status()).toBe(200)
        const socialImage = sharp(await socialResponse.body())
        const socialMeta = await socialImage.metadata()
        expect([socialMeta.format, socialMeta.width, socialMeta.height]).toEqual(['png', 1200, 630])
        const resultResponse = await request.get('/photo-sunflower-pixel12.png')
        expect(resultResponse.status()).toBe(200)
        const expectedPixels = await sharp(await resultResponse.body()).resize(441, 350, { fit: 'contain', kernel: 'nearest', background: '#f8fafc' }).ensureAlpha().raw().toBuffer()
        const previewPixels = await socialImage.extract({ left: 660, top: 182, width: 441, height: 350 }).ensureAlpha().raw().toBuffer()
        expect(previewPixels.equals(expectedPixels)).toBe(true)

        const cover = page.getByRole('region', { name: 'Fotobeispiel mit Pixel Art Village', exact: true })
        await cover.scrollIntoViewIfNeeded()
        await expect(cover).toBeVisible()
        await expect(cover.locator('figcaption')).toHaveText(['Originalfoto: 960 x 762 Pixel', 'PNG-Ergebnis: 80 x 63 Pixel'])
        await expect.poll(() => cover.locator('img').evaluateAll((images) => images.map((img) => [img.naturalWidth, img.naturalHeight]))).toEqual([[960, 762], [80, 63]])
        const pictures = await cover.locator('img').evaluateAll((images) => images.map((img) => ({ objectFit: getComputedStyle(img).objectFit, rendering: getComputedStyle(img).imageRendering })))
        expect(pictures.every((img) => img.objectFit === 'contain')).toBe(true)
        expect(pictures[1].rendering).toBe('pixelated')
        await test.info().attach(`german-comparison-cover-${width}-${javaScriptEnabled}`, { body: await page.screenshot(), contentType: 'image/png' })

        for (const [name, href] of [
          ['Aseprite', 'https://www.aseprite.org/'],
          ['Piskel', 'https://www.piskelapp.com/'],
          ['Verpixeln', 'https://docs.gimp.org/3.0/de/gimp-filter-pixelize.html'],
          ['CC0', 'https://creativecommons.org/publicdomain/zero/1.0/'],
          ['Pixel-Art-Konverter', '/de/'],
          ['deutschen Pixel-Art-Leitfaden', '/de/blog/pixel-art-tutorial-complete-guide-2025/'],
        ]) {
          await expect(page.getByRole('link', { name, exact: true }).first()).toHaveAttribute('href', href)
        }
        const schema = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) => scripts.flatMap((script) => JSON.parse(script.textContent)))
        const article = schema.find((item) => item['@type'] === 'BlogPosting')
        expect(article).toMatchObject({ headline: germanComparisonTitle, description: germanComparisonDescription, datePublished: '2025-11-01', dateModified: '2026-10-08', inLanguage: 'de', articleSection: 'Vergleich', image: `https://pixelartvillage.org${germanComparisonImage}` })
        const faq = schema.find((item) => item['@type'] === 'FAQPage')
        expect(faq.mainEntity).toHaveLength(3)
        const visibleFaq = await page.locator('h3').filter({ hasText: /Welches Werkzeug sollte|Kann Pixel Art Village|Bleibt meine ursprüngliche/ }).allTextContents()
        expect(faq.mainEntity.map((item) => item.name)).toEqual(visibleFaq)
        for (const item of faq.mainEntity) {
          await expect(page.getByText(item.acceptedAnswer.text, { exact: true })).toBeVisible()
        }
        await expect(page.getByRole('heading', { name: 'Weitere Artikel', exact: true })).toBeVisible()
        await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        await test.info().attach(`german-comparison-page-${width}-${javaScriptEnabled}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' })
      })
    }
  })
}
