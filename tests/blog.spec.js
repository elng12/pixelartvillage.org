import { test, expect } from '@playwright/test'
import sharp from 'sharp'
import { readFileSync } from 'node:fs'

const russianTutorialRoute = '/ru/blog/pixel-art-tutorial-complete-guide-2025/'
const russianTutorialTitle = 'Пиксель-арт для начинающих: рисуем камень 32×32'
const russianTutorialSeoTitle = 'Пиксель-арт для начинающих: урок 32×32 | Pixel Art Village'
const russianTutorialDescription = 'Урок пиксель-арта для начинающих: нарисуйте камень 32×32 в Piskel, добавьте контур, пять цветов, тень и блики. Пошаговые изображения и PNG для скачивания.'
const russianTutorialImage = '/blog-og/ru/pixel-art-tutorial-complete-guide-2025.png'

for (const javaScriptEnabled of [false, true]) {
  test.describe(`Russian drawing tutorial ${javaScriptEnabled ? 'runtime' : 'initial HTML'}`, () => {
    test.use({ javaScriptEnabled })

    for (const width of [1440, 390, 320]) {
      test(`${width}px localized lesson, real artwork and page identity`, async ({ page, request }) => {
        await page.setViewportSize({ width, height: width <= 390 ? 844 : 900 })
        expect((await page.goto('/ru/blog/')).status()).toBe(200)
        if (javaScriptEnabled && process.env.EXPECT_CONSENT_BANNER === '1') {
          await page.getByRole('button', { name: 'Отказаться от необязательных куки', exact: true }).click()
        }
        const entry = page.getByRole('link', { name: russianTutorialTitle, exact: true })
        await expect(entry).toHaveAttribute('href', russianTutorialRoute)
        await entry.click()
        await page.reload()
        await expect(page).toHaveTitle(russianTutorialSeoTitle)
        await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(russianTutorialTitle)
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org${russianTutorialRoute}`)
        await expect(page.locator('link[rel="alternate"][hreflang="ru"]')).toHaveAttribute('href', `https://pixelartvillage.org${russianTutorialRoute}`)
        for (const key of ['description', 'og:description', 'twitter:description']) {
          await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', russianTutorialDescription)
        }
        for (const key of ['og:title', 'twitter:title']) {
          await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', russianTutorialSeoTitle)
        }
        for (const key of ['og:image', 'twitter:image']) {
          await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', `https://pixelartvillage.org${russianTutorialImage}`)
        }
        const main = page.locator('main')
        const article = page.locator('.blog-article-prose')
        await expect(main).toContainText('Обновлено: 2026-10-10')
        await expect(main).not.toContainText(/19\.99|Обычно 16x16|Обычно 128x128|Source image|Pixel art result|min read|Related Articles|Back to Blog|\[object Object\]/)
        await expect(article).toContainText('а не стандарт 8-bit или 16-bit')
        await expect(article).toContainText('Это техническая проверка, а не исследование с участием начинающих художников')
        await expect(article).toContainText('Он не заменяет инструменты рисования из этого урока')
        await expect(article).toContainText('Selected frame export')
        await expect(article).toContainText('Scale равным 1.0x')
        await expect(article.getByRole('heading', { level: 2 })).toHaveCount(9)
        await expect(page.locator('header a[rel="author"]')).toHaveAttribute('href', '/ru/about/')

        const figures = article.locator('figure')
        await expect(figures).toHaveCount(7)
        for (const image of await figures.locator('img').all()) {
          await image.scrollIntoViewIfNeeded()
          await expect.poll(() => image.evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true)
          expect(await image.getAttribute('alt')).toMatch(/[А-Яа-яЁё]/)
          const path = await image.getAttribute('src')
          const response = await request.get(path)
          expect(response.status(), path).toBe(200)
          const metadata = await sharp(await response.body()).metadata()
          expect(metadata.width).toBe(Number(await image.getAttribute('width')))
          expect(metadata.height).toBe(Number(await image.getAttribute('height')))
          const pixelated = /gem-/.test(path)
          expect(await image.evaluate(img => getComputedStyle(img).imageRendering)).toBe(pixelated ? 'pixelated' : 'auto')
        }
        await expect(figures.locator('a[download]')).toHaveCount(4)
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          figures.getByRole('link', { name: 'Скачать готовый камень PNG (32×32)', exact: true }).click(),
        ])
        const path = test.info().outputPath('gem-final.png')
        await download.saveAs(path)
        const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
        expect([info.width, info.height]).toEqual([32, 32])
        const colors = new Set()
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3]) colors.add([...data.subarray(i, i + 4)].join(','))
        }
        expect([...colors].sort()).toEqual(['41,50,65,255', '54,191,164,255', '32,117,103,255', '141,229,192,255', '244,255,232,255'].sort())
        expect([...data.subarray(0, 4)]).toEqual([0, 0, 0, 0])
        const source = await request.get('/tutorials/pixel-art-lernen/gem-final.png')
        expect(data.equals(await sharp(await source.body()).ensureAlpha().raw().toBuffer())).toBe(true)
        const social = await request.get(russianTutorialImage)
        expect(social.status()).toBe(200)
        const socialMeta = await sharp(await social.body()).metadata()
        expect([socialMeta.width, socialMeta.height]).toEqual([1200, 630])
        const expectedPreview = await sharp(await source.body()).flatten({ background: '#f8fafc' }).resize(441, 350, { fit: 'contain', kernel: 'nearest', background: '#f8fafc' }).ensureAlpha().raw().toBuffer()
        const actualPreview = await sharp(await social.body()).extract({ left: 660, top: 182, width: 441, height: 350 }).ensureAlpha().raw().toBuffer()
        expect(actualPreview.equals(expectedPreview)).toBe(true)

        const animation = article.getByRole('link', { name: 'русскому уроку покадровой анимации', exact: true })
        await expect(animation).toHaveAttribute('href', '/ru/blog/pixel-art-animation-tutorial-frame-by-frame/')
        await expect(article.getByRole('link', { name: 'конвертер Pixel Art Village', exact: true })).toHaveAttribute('href', '/ru/')
        for (const href of await article.locator('a').evaluateAll(links => links.map(link => link.getAttribute('href')).filter(href => href.startsWith('/')))) {
          expect((await request.get(href)).status(), href).toBe(200)
        }
        const schema = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.flatMap(node => JSON.parse(node.textContent)))
        expect(schema.find(item => item['@type'] === 'BlogPosting')).toMatchObject({
          headline: russianTutorialTitle, datePublished: '2025-10-28', dateModified: '2026-10-10', inLanguage: 'ru',
          image: `https://pixelartvillage.org${russianTutorialImage}`,
          author: { '@type': 'Organization', name: 'Pixel Art Village', url: 'https://pixelartvillage.org/ru/about/' },
        })
        const faq = schema.find(item => item['@type'] === 'FAQPage')
        expect(faq.mainEntity).toHaveLength(3)
        for (const question of faq.mainEntity) {
          await expect(article.getByRole('heading', { name: question.name, exact: true })).toBeVisible()
          await expect(article).toContainText(question.acceptedAnswer.text)
        }
        await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        await page.getByRole('heading', { level: 1 }).scrollIntoViewIfNeeded()
        await test.info().attach(`russian-tutorial-${width}-${javaScriptEnabled}`, { body: await page.screenshot(), contentType: 'image/png' })
        await animation.click()
        await expect(page).toHaveURL(/\/ru\/blog\/pixel-art-animation-tutorial-frame-by-frame\/$/)
        await page.reload()
        await expect(page.locator('html')).toHaveAttribute('lang', 'ru')
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://pixelartvillage.org/ru/blog/pixel-art-animation-tutorial-frame-by-frame/')
      })
    }
  })
}

for (const javaScriptEnabled of [false, true]) {
  test.describe(`Blog entry labels ${javaScriptEnabled ? 'runtime' : 'initial HTML'}`, () => {
    test.use({ javaScriptEnabled })

    for (const [route, label, count, rejectLabel] of [
      ['/blog/', 'Read more', null, 'Reject non-essential cookies'],
      ['/de/blog/', 'Weiterlesen', 2, 'Nicht unbedingt erforderliche Cookies ablehnen'],
      ['/ko/blog/', '글 읽기', 5, '필수적이지 않은 쿠키 거부'],
    ]) {
      test(`${route} uses article labels and retains the English fallback`, async ({ page }) => {
        expect((await page.goto(route)).status()).toBe(200)
        if (javaScriptEnabled && process.env.EXPECT_CONSENT_BANNER === '1') {
          await page.getByRole('button', { name: rejectLabel, exact: true }).click()
        }
        const cards = page.locator('main .blog-simple-card')
        await expect(cards.first()).toBeVisible()
        const total = await cards.count()
        const expected = count ?? total
        await expect(cards.getByRole('link', { name: label, exact: true })).toHaveCount(expected)
        if (label !== 'Read more') {
          await expect(cards.getByRole('link', { name: 'Read more', exact: true })).toHaveCount(total - expected)
        }
        const entry = cards.getByRole('link', { name: label, exact: true }).first()
        const target = await entry.getAttribute('href')
        expect(target).toMatch(new RegExp(`^${route}.+/$`))
        await Promise.all([page.waitForURL(url => url.pathname === target), entry.click()])
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
        await page.reload()
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org${target}`)
      })
    }
  })
}

const germanComparisonRoute = '/de/blog/best-pixel-art-converters-compared-2025/'
const germanComparisonTitle = 'Pixel-Art-Konverter im Vergleich: 4 Werkzeuge für Bilder und Sprites'
const germanComparisonSeoTitle = 'Pixel-Art-Konverter: 4 Tools im Vergleich | Pixel-Art-Dorf'
const germanComparisonDescription = 'Vier Pixel-Art-Werkzeuge im Vergleich: Bildkonvertierung, Pixelbearbeitung und Animation. Mit belegten Funktionen und einem echten Fotobeispiel.'
const germanComparisonImage = '/blog-og/de/best-pixel-art-converters-compared-2025.png'
const germanTutorialRoute = '/de/blog/pixel-art-tutorial-complete-guide-2025/'
const germanTutorialTitle = 'Pixel Art lernen: Schritt-für-Schritt für Anfänger'
const germanTutorialSeoTitle = 'Pixel Art lernen: Anleitung für Anfänger | Pixel-Art-Dorf'
const germanTutorialDescription = 'Pixel Art lernen mit einer eigenen 32×32-Übung in Piskel: Kontur, Farbpalette, Schatten und PNG-Export. Mit Schrittbildern und einer Vorlage für Anfänger.'
const germanTutorialImage = '/blog-og/de/pixel-art-tutorial-complete-guide-2025.png'

for (const javaScriptEnabled of [false, true]) {
  test.describe(`German drawing tutorial ${javaScriptEnabled ? 'runtime' : 'initial HTML'}`, () => {
    test.use({ javaScriptEnabled })

    for (const width of [1440, 390, 320]) {
      test(`${width}px lesson, metadata, original artwork and download`, async ({ page, request }) => {
        await page.setViewportSize({ width, height: width <= 390 ? 844 : 900 })
        expect((await page.goto('/de/blog/')).status()).toBe(200)
        if (javaScriptEnabled && process.env.EXPECT_CONSENT_BANNER === '1') {
          await page.getByRole('button', { name: 'Nicht unbedingt erforderliche Cookies ablehnen', exact: true }).click()
        }
        const entry = page.getByRole('link', { name: germanTutorialTitle, exact: true })
        await expect(entry).toHaveAttribute('href', germanTutorialRoute)
        await entry.click()
        await page.reload()
        await expect(page).toHaveTitle(germanTutorialSeoTitle)
        expect(germanTutorialSeoTitle.length).toBe(57)
        await expect(page.locator('html')).toHaveAttribute('lang', 'de')
        await expect(page.getByRole('heading', { level: 1 })).toHaveText(germanTutorialTitle)
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org${germanTutorialRoute}`)
        for (const key of ['description', 'og:description', 'twitter:description']) {
          await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', germanTutorialDescription)
        }
        for (const key of ['og:title', 'twitter:title']) {
          await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', germanTutorialSeoTitle)
        }
        for (const key of ['og:image', 'twitter:image']) {
          await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', `https://pixelartvillage.org${germanTutorialImage}`)
        }
        await expect(page.locator('link[rel="alternate"][hreflang="de"]')).toHaveAttribute('href', `https://pixelartvillage.org${germanTutorialRoute}`)
        await expect(page.locator('main')).toContainText('Aktualisiert: 2026-10-09')
        await expect(page.locator('main')).not.toContainText(/19\.99|Typischerweise|\[object Object\]|Source image|Pixel art result|min read|Related Articles|Back to Blog/)
        await expect(page.getByRole('heading', { name: 'Schritt 5: Das PNG richtig exportieren', exact: true })).toBeVisible()
        await expect(page.locator('main')).toContainText('Selected frame export')
        await expect(page.locator('main')).toContainText('Er ersetzt die Zeichenwerkzeuge dieser Anleitung nicht')
        await expect(page.locator('.blog-article-prose')).toContainText('automatisierte Bedienung im echten Browser')
        await expect(page.locator('.blog-article-prose')).toContainText('kein Test mit menschlichen Zeichenanfängern')
        const author = page.locator('header a[rel="author"]')
        await expect(author).toHaveText('Pixel Art Village')
        await expect(author).toHaveAttribute('href', '/de/about/')
        expect((await request.get('/de/about/')).status()).toBe(200)
        const figures = page.locator('.blog-article-prose figure')
        await expect(figures).toHaveCount(7)
        for (const [name, expectedSize] of [['resize', [281, 550]], ['color', [272, 195]], ['export', [328, 550]]]) {
          const screenshot = figures.locator(`img[src="/tutorials/pixel-art-lernen/piskel-${name}-panel.png"]`)
          await screenshot.scrollIntoViewIfNeeded()
          await expect.poll(() => screenshot.evaluate(img => [img.naturalWidth, img.naturalHeight])).toEqual(expectedSize)
          await expect(screenshot).toHaveAttribute('width', String(expectedSize[0]))
          await expect(screenshot).toHaveAttribute('height', String(expectedSize[1]))
          expect(await screenshot.evaluate(img => getComputedStyle(img).imageRendering)).toBe('auto')
          const screenshotResponse = await request.get(`/tutorials/pixel-art-lernen/piskel-${name}-panel.png`)
          expect(screenshotResponse.status()).toBe(200)
          const screenshotBytes = await screenshotResponse.body()
          expect(screenshotBytes.length).toBeLessThan(200000)
          const metadata = await sharp(screenshotBytes).metadata()
          expect([metadata.width, metadata.height]).toEqual(expectedSize)
          await expect(screenshot.locator('..').getByRole('link', { name: 'Bildschirmausschnitt in Originalgröße öffnen', exact: true })).toHaveAttribute('href', `/tutorials/pixel-art-lernen/piskel-${name}-panel.png`)
        }
        const coordinateGuide = page.getByRole('group', { name: 'Koordinatenhilfe zur Kontur: Spalten x und Zeilen y, jeweils von 0 bis 31', exact: true })
        await expect(coordinateGuide).toBeVisible()
        await expect(coordinateGuide).toContainText('Spalten (x)')
        const guidePositions = await coordinateGuide.evaluate(guide => {
          const image = guide.querySelector('img').getBoundingClientRect()
          const axes = [...guide.querySelectorAll('div[aria-hidden="true"]')]
          return axes.map((axis, dimension) => [...axis.querySelectorAll(':scope > span')].map(tick => {
            const box = tick.getBoundingClientRect()
            const actual = dimension === 0 ? box.x + box.width / 2 : box.y + box.height / 2
            const expected = dimension === 0 ? image.x + (Number(tick.textContent) + 0.5) / 32 * image.width : image.y + (Number(tick.textContent) + 0.5) / 32 * image.height
            return Math.abs(actual - expected)
          }))
        })
        expect(guidePositions.flat().length).toBe(10)
        expect(guidePositions.flat().every(error => error < 1)).toBe(true)
        expect(await coordinateGuide.evaluate(guide => {
          const bounds = guide.getBoundingClientRect()
          return [...guide.querySelectorAll('span')].every(tick => {
            const box = tick.getBoundingClientRect()
            return box.x >= bounds.x - 1 && box.right <= bounds.right + 1
          })
        })).toBe(true)
        const [fullSizePage] = await Promise.all([
          page.waitForEvent('popup'),
          figures.getByRole('link', { name: 'Bildschirmausschnitt in Originalgröße öffnen', exact: true }).last().click(),
        ])
        await fullSizePage.waitForLoadState('domcontentloaded')
        await expect(fullSizePage).toHaveURL(/\/tutorials\/pixel-art-lernen\/piskel-export-panel\.png$/)
        await expect.poll(() => fullSizePage.locator('img').evaluate(img => [img.naturalWidth, img.naturalHeight])).toEqual([328, 550])
        await fullSizePage.close()
        for (const stage of ['outline', 'base', 'shadow', 'final']) {
          const image = figures.locator(`img[src="/tutorials/pixel-art-lernen/gem-${stage}.png"]`)
          await image.scrollIntoViewIfNeeded()
          await expect.poll(() => image.evaluate(img => [img.naturalWidth, img.naturalHeight])).toEqual([32, 32])
          expect(await image.evaluate(img => getComputedStyle(img).imageRendering)).toBe('pixelated')
        }
        await expect(figures.locator('a[download]')).toHaveCount(4)
        await expect(figures.locator('a[download]').last()).toHaveAttribute('href', '/tutorials/pixel-art-lernen/gem-final.png')
        const [download] = await Promise.all([
          page.waitForEvent('download'),
          figures.locator('a[download]').last().click(),
        ])
        const image = sharp(await download.path())
        const { data, info } = await image.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
        expect([info.width, info.height]).toEqual([32, 32])
        const colors = new Set()
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3]) colors.add([...data.subarray(i, i + 4)].join(','))
        }
        expect([...colors].sort()).toEqual(['41,50,65,255', '54,191,164,255', '32,117,103,255', '141,229,192,255', '244,255,232,255'].sort())
        for (const [x, y, color] of [
          [0, 0, [0, 0, 0, 0]], [10, 6, [41, 50, 65, 255]],
          [16, 11, [54, 191, 164, 255]], [16, 12, [32, 117, 103, 255]],
          [10, 8, [141, 229, 192, 255]], [12, 9, [244, 255, 232, 255]],
        ]) {
          expect([...data.subarray((y * 32 + x) * 4, (y * 32 + x) * 4 + 4)]).toEqual(color)
        }
        const originalResponse = await request.get('/tutorials/pixel-art-lernen/gem-final.png')
        expect(originalResponse.status()).toBe(200)
        const serverPixels = await sharp(await originalResponse.body()).ensureAlpha().raw().toBuffer()
        expect(serverPixels.equals(data)).toBe(true)
        const socialResponse = await request.get(germanTutorialImage)
        expect(socialResponse.status()).toBe(200)
        const socialMeta = await sharp(await socialResponse.body()).metadata()
        expect([socialMeta.width, socialMeta.height]).toEqual([1200, 630])
        const expectedPreview = await sharp(await originalResponse.body()).flatten({ background: '#f8fafc' }).resize(441, 350, { fit: 'contain', kernel: 'nearest', background: '#f8fafc' }).ensureAlpha().raw().toBuffer()
        const actualPreview = await sharp(await socialResponse.body()).extract({ left: 660, top: 182, width: 441, height: 350 }).ensureAlpha().raw().toBuffer()
        expect(actualPreview.equals(expectedPreview)).toBe(true)
        const cover = page.getByRole('region', { name: 'Originale Pixel-Art-Übung: Kontur und fertiger Edelstein', exact: true })
        await expect(cover.locator('figcaption')).toHaveText(['Kontur: 32 × 32 Pixel', 'Fertiges PNG: 32 × 32 Pixel'])
        expect(await cover.locator('img').evaluateAll(images => images.every(img => getComputedStyle(img).imageRendering === 'pixelated'))).toBe(true)
        const schema = await page.locator('script[type="application/ld+json"]').evaluateAll(scripts => scripts.flatMap(script => JSON.parse(script.textContent)))
        expect(schema.find(item => item['@type'] === 'BlogPosting')).toMatchObject({ headline: germanTutorialTitle, datePublished: '2025-10-28', dateModified: '2026-10-09', inLanguage: 'de', image: `https://pixelartvillage.org${germanTutorialImage}`, author: { '@type': 'Organization', name: 'Pixel Art Village', url: 'https://pixelartvillage.org/de/about/' } })
        const faq = schema.find(item => item['@type'] === 'FAQPage')
        expect(faq.mainEntity).toHaveLength(3)
        for (const item of faq.mainEntity) {
          await expect(page.getByRole('heading', { level: 3, name: item.name, exact: true })).toBeVisible()
          await expect(page.getByText(item.acceptedAnswer.text, { exact: true })).toBeVisible()
        }
        await expect(page.getByRole('link', { name: 'Vergleich der Pixel-Art-Werkzeuge', exact: true })).toHaveAttribute('href', germanComparisonRoute)
        await expect(page.getByRole('link', { name: 'Pixel-Art-Konverter', exact: true })).toHaveAttribute('href', '/de/')
        await expect(page.getByRole('link', { name: 'Piskel-Browsereditor', exact: true })).toHaveAttribute('href', 'https://www.piskelapp.com/p/create/sprite/')
        await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
        await test.info().attach(`german-tutorial-${width}-${javaScriptEnabled}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' })
      })
    }
  })
}

test('Spanish beginner article retains its existing content and cover', async ({ page }) => {
  await page.goto('/es/blog/pixel-art-tutorial-complete-guide-2025/')
  await expect(page).toHaveTitle('Guía Completa de Arte Píxel para Principiantes (2025) - Desde Cero hasta Creación | Pixel Art Village')
  await expect(page.locator('.blog-article-prose figure')).toHaveCount(0)
  await expect(page.locator('header a[rel="author"]')).toHaveCount(0)
  await expect(page.locator('.blog-cover-grid img').first()).toHaveAttribute('src', '/showcase-before-w640.jpg')
  await expect(page.locator('.blog-cover-grid img').last()).toHaveAttribute('src', '/showcase-after-w640.jpg')
  await expect(page.locator('main')).not.toContainText('gem-final')
})

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

test('Korean article links to the localized beginner guide', async ({ page }) => {
  await page.goto('/ko/blog/how-to-get-pixel-art-version-of-image/')
  if (process.env.EXPECT_CONSENT_BANNER === '1') {
    await page.getByRole('button', { name: '필수적이지 않은 쿠키 거부', exact: true }).click()
  }

  const beginner = page.getByRole('link', { name: '이미지 픽셀화 안내', exact: true }).first()
  await expect(beginner).toHaveAttribute('href', '/ko/blog/how-to-pixelate-an-image/')
  await beginner.click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('이미지 픽셀화 방법: 사진 업로드부터 픽셀 크기 설정과 PNG 저장까지')
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
        await expect(page.locator('header a[rel="author"]')).toHaveCount(0)
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

const indonesianPosts = Object.values(JSON.parse(readFileSync(new URL('../src/content/blog-posts.id.json', import.meta.url), 'utf8')))
const indonesianCopy = JSON.parse(readFileSync(new URL('../public/locales/id/translation.json', import.meta.url), 'utf8'))
const indonesianPrimaryPhrases = [
  'Konverter pixel art', 'foto menjadi pixel art gaya SNES', 'Memperbaiki hasil pixel art',
  'Ekspor PNG Illustrator', 'Cara membuat gambar piksel',
]
const indonesianForbidden = /Village Optimizer|SNES Refiner|Village Export Hub|VillageExportHub|Palette Limiter Pro|We tested 10|No signup, no ads, no paywalls|Use the Resize slider|Village gallery integration|__PH_\d+__|\[object Object\]/

async function rejectIndonesianCookies(page) {
  if (process.env.EXPECT_CONSENT_BANNER === '1') {
    const banner = page.getByRole('region', { name: indonesianCopy.consent.bannerLabel, exact: true })
    await expect(banner).toContainText('Kami menggunakan cookie')
    await expect(banner).not.toContainText('We use cookies')
    await page.getByRole('button', { name: indonesianCopy.consent.rejectLabel, exact: true }).click()
    await expect(page.getByRole('button', { name: indonesianCopy.consent.rejectLabel, exact: true })).toHaveCount(0)
  }
}

for (const width of [1440, 320]) {
  for (const granted of [false, true]) {
    test(`Indonesian pilot consent ${width}px ${granted ? 'accept' : 'reject'} persists after reload`, async ({ page }) => {
      test.skip(process.env.EXPECT_CONSENT_BANNER !== '1', 'Requires a production-style build with the real consent banner')
      await page.setViewportSize({ width, height: 844 })
      const route = granted ? '/id/blog/export-from-illustrator-image-to-pixel-art/' : '/id/'
      expect((await page.goto(route)).status()).toBe(200)
      const banner = page.getByRole('region', { name: indonesianCopy.consent.bannerLabel, exact: true })
      await expect(banner).toBeVisible()
      await expect(banner).toContainText('Kami menggunakan cookie')
      await expect(banner).toContainText('jika diaktifkan')
      await expect(banner).toContainText('menerima atau menolak')
      await expect(banner).not.toContainText('We use cookies')
      await expect(banner.getByRole('link', { name: indonesianCopy.consent.privacy, exact: true })).toHaveAttribute('href', '/id/privacy/')
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      const label = granted ? indonesianCopy.consent.acceptLabel : indonesianCopy.consent.rejectLabel
      await banner.getByRole('button', { name: label, exact: true }).click()
      await expect(banner).toHaveCount(0)
      const choice = await page.evaluate(() => JSON.parse(localStorage.getItem('consent.choice.v1')))
      expect(choice.granted).toBe(granted)
      expect(choice.ts).toBeGreaterThan(0)
      await page.reload()
      await expect(page.locator('html')).toHaveAttribute('lang', 'id')
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await expect(banner).toHaveCount(0)
      expect(await page.evaluate(() => JSON.parse(localStorage.getItem('consent.choice.v1')).granted)).toBe(granted)
    })
  }
}

for (const javaScriptEnabled of [false, true]) {
  test.describe(`Indonesian pilot ${javaScriptEnabled ? 'runtime' : 'initial HTML'}`, () => {
    test.use({ javaScriptEnabled })
    for (const width of [1440, 390, 320]) {
      for (const [index, post] of indonesianPosts.entries()) {
        test(`${width}px ${post.slug}`, async ({ page, request }) => {
          await page.setViewportSize({ width, height: width <= 390 ? 844 : 1000 })
          expect((await page.goto('/id/blog/')).status()).toBe(200)
          if (javaScriptEnabled) await rejectIndonesianCookies(page)
          const route = `/id/blog/${post.slug}/`
          const title = `${post.seoTitle} | Pixel Art Village`
          const entry = page.getByRole('link', { name: post.title, exact: true })
          await expect(entry).toHaveAttribute('href', route)
          await entry.click()
          const assertArticle = async () => {
            expect([...title].length).toBeGreaterThanOrEqual(55)
            expect([...title].length).toBeLessThanOrEqual(60)
            expect(post.excerpt.length).toBeLessThanOrEqual(155)
            await expect(page).toHaveTitle(title)
            await expect(page.locator('html')).toHaveAttribute('lang', 'id')
            await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title)
            await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
            await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org${route}`)
            await expect(page.locator('link[hreflang="id"]')).toHaveAttribute('href', `https://pixelartvillage.org${route}`)
            await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0)
            for (const key of ['description', 'og:description', 'twitter:description']) {
              await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', post.excerpt)
            }
            for (const key of ['og:title', 'twitter:title']) {
              await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', title)
            }
            await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://pixelartvillage.org${route}`)
            for (const key of ['og:image', 'twitter:image']) {
              await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', `https://pixelartvillage.org${post.socialPreview.image}`)
              await expect(page.locator(`meta[name="${key}:alt"],meta[property="${key}:alt"]`)).toHaveAttribute('content', post.socialPreview.alt)
            }
            const main = page.locator('main')
            const article = page.locator('.blog-article-prose')
            await expect(article).not.toContainText(indonesianForbidden)
            await expect(main).not.toContainText(/min read|Related Articles|Back to Blog|Source image|Pixel art result/)
            await expect(main).toContainText('Diperbarui: 2026-10-11')
            await expect(main.getByRole('link', { name: 'Kembali ke blog', exact: true })).toHaveAttribute('href', '/id/blog/')
            await expect(article).toContainText(indonesianPrimaryPhrases[index])
            await expect(main.locator('a[rel="author"]')).toHaveAttribute('href', '/id/about/')
            const schema = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.flatMap(node => JSON.parse(node.textContent)))
            expect(schema.find(item => item['@type'] === 'BlogPosting')).toMatchObject({
              headline: post.title, description: post.excerpt, inLanguage: 'id', datePublished: post.date,
              dateModified: '2026-10-11', mainEntityOfPage: `https://pixelartvillage.org${route}`,
              author: { name: 'Pixel Art Village', url: 'https://pixelartvillage.org/id/about/' },
              image: `https://pixelartvillage.org${post.socialPreview.image}`,
            })
            const breadcrumbs = schema.find(item => item['@type'] === 'BreadcrumbList')
            expect(breadcrumbs.itemListElement.at(-1)).toMatchObject({ name: post.title, item: `https://pixelartvillage.org${route}` })
            const faq = schema.find(item => item['@type'] === 'FAQPage')
            expect(faq.mainEntity).toHaveLength(index === 3 ? 4 : 3)
            for (const question of faq.mainEntity) {
              await expect(article.getByRole('heading', { name: question.name, exact: true })).toBeVisible()
              await expect(article).toContainText(question.acceptedAnswer.text)
            }
            const headings = await article.locator('h2,h3,h4').evaluateAll(nodes => nodes.map(node => Number(node.tagName[1])))
            expect(headings[0]).toBe(2)
            expect(headings.every((level, i) => i === 0 || level <= headings[i - 1] + 1)).toBe(true)
            await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
          }
          await assertArticle()
          await page.reload()
          await assertArticle()
          const article = page.locator('.blog-article-prose')
          const figures = post.body.filter(block => block.type === 'figure')
          await expect(article.locator('figure')).toHaveCount(figures.length)
          for (const figure of figures) {
            const element = article.locator(`figure:has(img[src="${figure.src}"])`)
            const img = element.locator('img')
            await img.scrollIntoViewIfNeeded()
            await expect.poll(() => img.evaluate(node => [node.naturalWidth, node.naturalHeight])).toEqual([figure.width, figure.height])
            await expect(img).toHaveAttribute('alt', figure.alt)
            await expect(element.locator('figcaption')).toContainText(figure.caption)
            const response = await request.get(figure.src)
            expect(response.status()).toBe(200)
            const bytes = await response.body()
            const meta = await sharp(bytes).metadata()
            expect([meta.width, meta.height]).toEqual([figure.width, figure.height])
            const [download] = await Promise.all([
              page.waitForEvent('download'), element.getByRole('link', { name: figure.downloadLabel, exact: true }).click(),
            ])
            const path = test.info().outputPath(figure.src.split('/').pop())
            await download.saveAs(path)
            expect(readFileSync(path).equals(bytes)).toBe(true)
          }
          const cover = page.getByRole('region', { name: post.presentation.coverLabel, exact: true })
          await cover.scrollIntoViewIfNeeded()
          await expect.poll(() => cover.locator('img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0))).toBe(true)
          await expect(cover.locator('figcaption')).toHaveText([post.presentation.sourceLabel, post.presentation.resultLabel])
          if (javaScriptEnabled) {
            await test.info().attach(`indonesian-cover-${index}-${width}`, { body: await cover.screenshot(), contentType: 'image/png' })
            await test.info().attach(`indonesian-page-${index}-${width}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' })
          }
          for (const href of await article.locator('a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')).filter(href => href.startsWith('/')))) {
            expect(href, 'Pages stay Indonesian; file URLs retain their exact resource paths').toMatch(/^\/id\/|^\/(photo-|tutorials\/)/)
            expect((await request.get(href)).status(), href).toBe(200)
          }
          if (post.comparison) await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(4)
          if (index === 0) await expect(article).toContainText('kami tidak menguji kualitas atau kecepatan ketiganya dengan foto yang sama')
          if (index === 1) {
            await expect(article).toContainText('bukan mode perangkat keras')
            await expect(article).toContainText('120×95')
            await expect(article).toContainText('80×63')
            await expect(article).toContainText('penggeser jumlah warna mengatur palet yang dihasilkan', { ignoreCase: true })
            await expect(article).not.toContainText('kalimat lama yang tidak tepat')
          }
          if (index === 3) {
            await expect(article).toContainText('tidak menjalankan ekspor di aplikasi Illustrator')
            await expect(article).toContainText('dokumentasi resmi Adobe yang diperiksa pada 9 Oktober 2026')
            await expect(article).not.toContainText('HTTP 403')
            await expect(article).toContainText('hanya angka PPI')
            await expect(article).toContainText('bukan hasil konversi file pertama')
            expect(await article.locator('a[href^="https://helpx.adobe.com/"]').count()).toBe(3)
          }
          if (javaScriptEnabled) {
            const sibling = indonesianPosts.find(item => item.slug !== post.slug && post.body.some(block => typeof block === 'string' && block.includes(`/blog/${item.slug}/`)))
            await article.locator(`a[href="/id/blog/${sibling.slug}/"]`).first().click()
            await expect(page).toHaveTitle(`${sibling.seoTitle} | Pixel Art Village`)
            await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org/id/blog/${sibling.slug}/`)
            await page.goBack()
            await assertArticle()
          }
        })
      }
    }
  })
}

for (const post of indonesianPosts) {
  test(`Indonesian pilot sharing PNG ${post.slug}`, async ({ request }) => {
    const response = await request.get(post.socialPreview.image)
    expect(response.status()).toBe(200)
    const bytes = await response.body()
    const metadata = await sharp(bytes).metadata()
    expect([metadata.format, metadata.width, metadata.height]).toEqual(['png', 1200, 630])
    expect(bytes.length).toBeLessThan(1000000)
    const result = await request.get(post.cover.after)
    expect(result.status()).toBe(200)
    // Materialize resize before flattening: Sharp can apply flatten before resize in one pipeline.
    // Match the generator's resize-then-composite order, including partially transparent edges.
    const resized = await sharp(await result.body()).resize(441, 350, { fit: 'contain', kernel: 'nearest', background: '#f8fafc' }).png().toBuffer()
    const expected = await sharp(resized).flatten({ background: '#f8fafc' }).ensureAlpha().raw().toBuffer()
    const actual = await sharp(bytes).extract({ left: 660, top: 182, width: 441, height: 350 }).ensureAlpha().raw().toBuffer()
    expect(actual.equals(expected)).toBe(true)
    await test.info().attach('localized-sharing-image', { body: bytes, contentType: 'image/png' })
  })
}

async function waitForIndonesianResult(page, action) {
  const image = page.getByTestId('preview-container').locator('img')
  const previous = await image.getAttribute('src')
  await action()
  await expect(image).not.toHaveAttribute('src', previous)
  await expect(page.getByTestId('preview-container')).toHaveAttribute('aria-busy', 'false')
}

async function downloadIndonesianResult(page, filename, dimensions, maxColors, publishedBytes) {
  const [download] = await Promise.all([
    page.waitForEvent('download'), page.getByRole('button', { name: indonesianCopy.editor.downloadBtn, exact: true }).last().click(),
  ])
  const path = test.info().outputPath(filename)
  await download.saveAs(path)
  const bytes = readFileSync(path)
  const metadata = await sharp(bytes).metadata()
  expect([metadata.format, metadata.width, metadata.height]).toEqual(['png', ...dimensions])
  const matchesPreview = await page.evaluate(async ([downloadUrl, previewUrl]) => {
    const images = await Promise.all([downloadUrl, previewUrl].map(async src => {
      const image = new Image()
      image.src = src
      await image.decode()
      return image
    }))
    const pixels = image => {
      const canvas = document.createElement('canvas')
      canvas.width = images[1].naturalWidth
      canvas.height = images[1].naturalHeight
      const context = canvas.getContext('2d')
      context.imageSmoothingEnabled = false
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      return context.getImageData(0, 0, canvas.width, canvas.height).data
    }
    const expected = pixels(images[0])
    return pixels(images[1]).every((value, index) => value === expected[index])
  }, [`data:image/png;base64,${bytes.toString('base64')}`, await page.getByTestId('preview-container').locator('img').getAttribute('src')])
  expect(matchesPreview, 'Download recreates this session preview without smoothing').toBe(true)
  const raw = await sharp(bytes).ensureAlpha().raw().toBuffer()
  if (publishedBytes) expect(raw.equals(await sharp(publishedBytes).ensureAlpha().raw().toBuffer())).toBe(true)
  if (maxColors) {
    const colors = new Set()
    for (let i = 0; i < raw.length; i += 4) if (raw[i + 3]) colors.add([...raw.subarray(i, i + 3)].join(','))
    expect(colors.size).toBeLessThanOrEqual(maxColors)
    expect(colors.size).toBeGreaterThan(1)
  }
  return raw
}

for (const width of [1440, 390]) {
  test(`Indonesian pilot tool ${width}px size and palette workflow`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/id/')
    await rejectIndonesianCookies(page)
    const source = await request.get('/photo-sunflower-source.jpg')
    expect(source.status()).toBe(200)
    await page.getByTestId('file-input').setInputFiles({ name: 'sunflower.jpg', mimeType: 'image/jpeg', buffer: await source.body() })
    const image = page.getByTestId('preview-container').locator('img')
    await expect(image).toHaveAttribute('src', /^data:image\/png/)
    const paletteNote = page.getByText(indonesianCopy.adjustments.palette.note, { exact: true })
    await expect(paletteNote).toBeVisible()
    await expect(paletteNote).toContainText('Lost Century, Sunset 8, Twilight 5, dan Hollow memakai kumpulan warna tetap')
    await expect(paletteNote).toContainText('bukan palet tetap')
    await expect(paletteNote).not.toContainText('Nama lain tanpa warna palet internal')
    await page.locator('#palette-select').selectOption('none')
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    for (let size = 2; size <= 12; size++) {
      await waitForIndonesianResult(page, () => page.locator('#pixel-size-slider').press('ArrowRight'))
      if (size === 8 || size === 12) {
        const url = size === 8 ? '/tutorials/pixel-art-ko/sunflower-pixel8.png' : '/photo-sunflower-pixel12.png'
        const published = await request.get(url)
        expect(published.status()).toBe(200)
        await downloadIndonesianResult(page, `sunflower-pixel${size}.png`, size === 8 ? [120, 95] : [80, 63], null, await published.body())
      }
    }
    await waitForIndonesianResult(page, () => page.locator('#auto-palette').check())
    for (let colors = 17; colors <= 24; colors++) await waitForIndonesianResult(page, () => page.locator('#palette-size').press('ArrowRight'))
    const withoutDither = await downloadIndonesianResult(page, 'sunflower-colors24.png', [80, 63], 24)
    await waitForIndonesianResult(page, () => page.locator('#dither').check())
    const withDither = await downloadIndonesianResult(page, 'sunflower-colors24-dither.png', [80, 63], 24)
    expect(withDither.equals(withoutDither)).toBe(false)
  })

  test(`Indonesian pilot tool ${width}px transparent PNG import and conversion`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/id/')
    await rejectIndonesianCookies(page)
    const source = await request.get('/tutorials/illustrator-png-ko/size-512.png')
    expect(source.status()).toBe(200)
    await page.getByTestId('file-input').setInputFiles({ name: 'browser-demo.png', mimeType: 'image/png', buffer: await source.body() })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    await page.locator('#palette-select').selectOption('none')
    for (let size = 2; size <= 8; size++) await waitForIndonesianResult(page, () => page.locator('#pixel-size-slider').press('ArrowRight'))
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    await expect(page.locator('#transparent-bg')).toBeChecked()
    const published = await request.get('/tutorials/pixel-art-id/illustrator-pixel8.png')
    expect(published.status()).toBe(200)
    const raw = await downloadIndonesianResult(page, 'illustrator-pixel8.png', [64, 64], null, await published.body())
    const alpha = []
    for (let i = 3; i < raw.length; i += 4) alpha.push(raw[i])
    expect(alpha).toContain(0)
    expect(alpha).toContain(255)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })

  test(`Indonesian pilot tool ${width}px file limits, unsupported input and recovery`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/id/')
    await rejectIndonesianCookies(page)
    const input = page.getByTestId('file-input')
    await input.setInputFiles({ name: 'invalid.txt', mimeType: 'text/plain', buffer: Buffer.from('test input, not an image') })
    await expect(page.getByTestId('editor-controls')).toHaveCount(0)
    await expect(page.getByText(indonesianCopy.errors.onlyPngJpg, { exact: true })).toBeVisible()
    // Synthetic image and padded files exercise boundaries; they are not public case studies.
    const png = await sharp({ create: { width: 3000, height: 1500, channels: 3, background: '#d64769' } }).png().toBuffer()
    const maxBytes = 10 * 1024 * 1024
    const tooLarge = Buffer.alloc(maxBytes + 1)
    png.copy(tooLarge)
    await input.setInputFiles({ name: 'oversized.png', mimeType: 'image/png', buffer: tooLarge })
    await expect(page.getByText(indonesianCopy.errors.fileTooLarge10, { exact: true })).toBeVisible()
    await expect(page.getByTestId('editor-controls')).toHaveCount(0)
    const atLimit = Buffer.alloc(maxBytes)
    png.copy(atLimit)
    await input.setInputFiles({ name: 'at-limit.png', mimeType: 'image/png', buffer: atLimit })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    await expect(page.locator('#pixel-size-slider')).toHaveValue('1')
    await expect(page.getByText(indonesianCopy.errors.fileTooLarge10, { exact: true })).toHaveCount(0)
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    await downloadIndonesianResult(page, 'resized-boundary.png', [2200, 1100])
  })
}

test('Indonesian pilot language switch preserves the article task and returns to localized copy', async ({ page }) => {
  const post = indonesianPosts[4]
  await page.goto(`/id/blog/${post.slug}/`)
  await rejectIndonesianCookies(page)
  await page.locator('#language-switcher').selectOption('en')
  await expect.poll(() => new URL(page.url()).pathname.replace(/\/$/, '')).toBe(`/blog/${post.slug}`)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org/blog/${post.slug}/`)
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org/blog/${post.slug}/`)
  await page.goBack()
  await expect(page).toHaveTitle(`${post.seoTitle} | Pixel Art Village`)
  await expect(page.locator('html')).toHaveAttribute('lang', 'id')
})

const norwegianPosts = Object.values(JSON.parse(readFileSync(new URL('../src/content/blog-posts.nb.json', import.meta.url), 'utf8')))
const norwegianCopy = JSON.parse(readFileSync(new URL('../public/locales/nb/translation.json', import.meta.url), 'utf8'))
const norwegianPrimaryPhrases = ['Pikselkunstkonvertere', 'Foto til pikselkunst i SNES-stil', 'forbedre pikselkunst', 'eksportere PNG fra Illustrator', 'Slik pikselerer du et bilde']
const norwegianForbidden = /Village Optimizer|SNES Refiner|Village Export Hub|VillageExportHub|Palette Limiter Pro|We tested 10|No signup, no ads, no paywalls|Use the Resize slider|Village gallery integration|__PH_\d+__|\[object Object\]/

async function rejectNorwegianCookies(page) {
  if (process.env.EXPECT_CONSENT_BANNER === '1') {
    const banner = page.getByRole('region', { name: norwegianCopy.consent.bannerLabel, exact: true })
    await expect(banner).toContainText('Vi bruker informasjonskapsler')
    await page.getByRole('button', { name: norwegianCopy.consent.rejectLabel, exact: true }).click()
    await expect(banner).toHaveCount(0)
  }
}

for (const width of [1440, 320]) {
  for (const granted of [false, true]) {
    test(`Norwegian batch consent ${width}px ${granted ? 'accept' : 'reject'} persists after reload`, async ({ page }) => {
      test.skip(process.env.EXPECT_CONSENT_BANNER !== '1', 'Requires the real production-style consent banner')
      await page.setViewportSize({ width, height: 844 })
      await page.goto('/nb/blog/export-from-illustrator-image-to-pixel-art/')
      const banner = page.getByRole('region', { name: norwegianCopy.consent.bannerLabel, exact: true })
      await expect(banner).toBeVisible()
      await expect(banner).toContainText('Vi bruker informasjonskapsler')
      await expect(banner.getByRole('link', { name: norwegianCopy.consent.privacy, exact: true })).toHaveAttribute('href', '/nb/privacy/')
      const label = granted ? norwegianCopy.consent.acceptLabel : norwegianCopy.consent.rejectLabel
      await banner.getByRole('button', { name: label, exact: true }).click()
      await expect(banner).toHaveCount(0)
      expect(await page.evaluate(() => JSON.parse(localStorage.getItem('consent.choice.v1')).granted)).toBe(granted)
      await page.reload()
      await expect(page.locator('html')).toHaveAttribute('lang', 'nb')
      await expect(banner).toHaveCount(0)
      expect(await page.evaluate(() => JSON.parse(localStorage.getItem('consent.choice.v1')).granted)).toBe(granted)
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    })
  }
}

for (const javaScriptEnabled of [false, true]) {
  test.describe(`Norwegian batch ${javaScriptEnabled ? 'runtime' : 'initial HTML'}`, () => {
    test.use({ javaScriptEnabled })
    for (const width of [1440, 390, 320]) {
      for (const [index, post] of norwegianPosts.entries()) {
        test(`${width}px ${post.slug}`, async ({ page, request }) => {
          await page.setViewportSize({ width, height: width <= 390 ? 844 : 1000 })
          expect((await page.goto('/nb/blog/')).status()).toBe(200)
          if (javaScriptEnabled) await rejectNorwegianCookies(page)
          const route = `/nb/blog/${post.slug}/`
          const title = `${post.seoTitle} | Pixel Art Village`
          await expect(page.locator('main .blog-simple-card').getByRole('link', { name: post.presentation.readMoreLabel, exact: true })).toHaveCount(5)
          const entry = page.getByRole('link', { name: post.title, exact: true })
          await expect(entry).toHaveAttribute('href', route)
          await entry.click()
          const assertArticle = async () => {
            expect([...title].length).toBeGreaterThanOrEqual(55)
            expect([...title].length).toBeLessThanOrEqual(60)
            expect([...post.excerpt].length).toBeLessThanOrEqual(155)
            await expect(page).toHaveTitle(title)
            await expect(page.locator('html')).toHaveAttribute('lang', 'nb')
            await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title)
            await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
            await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org${route}`)
            await expect(page.locator('link[hreflang="nb"]')).toHaveAttribute('href', `https://pixelartvillage.org${route}`)
            await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0)
            for (const key of ['description', 'og:description', 'twitter:description']) {
              await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', post.excerpt)
            }
            for (const key of ['og:title', 'twitter:title']) {
              await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', title)
            }
            await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://pixelartvillage.org${route}`)
            for (const key of ['og:image', 'twitter:image']) {
              await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', `https://pixelartvillage.org${post.socialPreview.image}`)
              await expect(page.locator(`meta[name="${key}:alt"],meta[property="${key}:alt"]`)).toHaveAttribute('content', post.socialPreview.alt)
            }
            const main = page.locator('main')
            const article = page.locator('.blog-article-prose')
            await expect(article).not.toContainText(norwegianForbidden)
            await expect(main).not.toContainText(/min read|Related Articles|Back to Blog|Source image|Pixel art result/)
            await expect(main).toContainText('Oppdatert: 2026-10-11')
            const backLinks = main.getByRole('link', { name: 'Tilbake til bloggen', exact: true })
            await expect(backLinks).toHaveCount(2)
            for (const link of await backLinks.all()) await expect(link).toHaveAttribute('href', '/nb/blog/')
            await expect(article).toContainText(norwegianPrimaryPhrases[index])
            await expect(main.locator('a[rel="author"]')).toHaveAttribute('href', '/nb/about/')
            const schema = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.flatMap(node => JSON.parse(node.textContent)))
            expect(schema.find(item => item['@type'] === 'BlogPosting')).toMatchObject({
              headline: post.title, description: post.excerpt, inLanguage: 'nb', datePublished: post.date,
              dateModified: '2026-10-11', mainEntityOfPage: `https://pixelartvillage.org${route}`,
              author: { name: 'Pixel Art Village', url: 'https://pixelartvillage.org/nb/about/' },
              image: `https://pixelartvillage.org${post.socialPreview.image}`,
            })
            expect(schema.find(item => item['@type'] === 'BreadcrumbList').itemListElement.at(-1)).toMatchObject({ name: post.title, item: `https://pixelartvillage.org${route}` })
            const faq = schema.find(item => item['@type'] === 'FAQPage')
            expect(faq.mainEntity).toHaveLength(index === 3 ? 4 : 3)
            for (const question of faq.mainEntity) {
              await expect(article.getByRole('heading', { name: question.name, exact: true })).toBeVisible()
              await expect(article).toContainText(question.acceptedAnswer.text)
            }
            const headings = await article.locator('h2,h3,h4').evaluateAll(nodes => nodes.map(node => Number(node.tagName[1])))
            expect(headings[0]).toBe(2)
            expect(headings.every((level, i) => i === 0 || level <= headings[i - 1] + 1)).toBe(true)
            await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
          }
          await assertArticle()
          await page.reload()
          await assertArticle()
          const article = page.locator('.blog-article-prose')
          const figures = post.body.filter(block => block.type === 'figure')
          await expect(article.locator('figure')).toHaveCount(figures.length)
          for (const figure of figures) {
            const element = article.locator(`figure:has(img[src="${figure.src}"])`)
            const img = element.locator('img')
            await img.scrollIntoViewIfNeeded()
            await img.evaluate(image => image.decode())
            await expect.poll(() => img.evaluate(image => [image.naturalWidth, image.naturalHeight])).toEqual([figure.width, figure.height])
            await expect(img).toHaveAttribute('alt', figure.alt)
            await expect(element.locator('figcaption')).toContainText(figure.caption)
            const response = await request.get(figure.src)
            expect(response.status()).toBe(200)
            const bytes = await response.body()
            const metadata = await sharp(bytes).metadata()
            expect([metadata.width, metadata.height]).toEqual([figure.width, figure.height])
            const [download] = await Promise.all([page.waitForEvent('download'), element.getByRole('link', { name: figure.downloadLabel, exact: true }).click()])
            const path = test.info().outputPath(figure.src.split('/').pop())
            await download.saveAs(path)
            expect(readFileSync(path).equals(bytes)).toBe(true)
          }
          const cover = page.getByRole('region', { name: post.presentation.coverLabel, exact: true })
          await cover.scrollIntoViewIfNeeded()
          await cover.locator('img').evaluateAll(async images => { for (const image of images) await image.decode() })
          await expect(cover.locator('figcaption')).toHaveText([post.presentation.sourceLabel, post.presentation.resultLabel])
          if (javaScriptEnabled) await test.info().attach(`norwegian-cover-${index}-${width}`, { body: await cover.screenshot(), contentType: 'image/png' })
          for (const href of await article.locator('a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')).filter(href => href.startsWith('/')))) {
            expect(href, 'Pages stay Norwegian; resource paths are not localized').toMatch(/^\/nb\/|^\/(photo-|tutorials\/)/)
            expect((await request.get(href)).status(), href).toBe(200)
          }
          if (post.comparison) await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(4)
          if (index === 0) await expect(article).toContainText('ikke testet kvaliteten eller hastigheten')
          await expect(article).not.toContainText(/Generate palette from image|Last ned Pixel Art Image|gammel, feil forklaring/)
          if ([1, 2, 4].includes(index)) await expect(article).toContainText('Generer palett fra bildet')
          if (index === 4) {
            await expect(article).toContainText('Antall palettfarger')
            await expect(article).toContainText('Last ned pikselbildet')
          }
          if (index === 1) {
            await expect(article).toContainText('ikke en maskinvaremodus')
            await expect(article).toContainText('120×95')
            await expect(article).toContainText('80×63')
            await expect(article).toContainText('den endrer ikke et fast fargesett')
            await expect(article).toContainText('Antall palettfarger')
          }
          if (index === 3) {
            await expect(article).toContainText('ikke utført eksport i Illustrator-appen')
            await expect(article).toContainText('ikke bare et PPI-tall')
            await expect(article).toContainText('ikke konvertert fra den første filen')
            expect(await article.locator('a[href^="https://helpx.adobe.com/"]').count()).toBe(3)
          }
          if (javaScriptEnabled) {
            const sibling = norwegianPosts.find(item => item.slug !== post.slug && post.body.some(block => typeof block === 'string' && block.includes(`/blog/${item.slug}/`)))
            await article.locator(`a[href="/nb/blog/${sibling.slug}/"]`).first().click()
            await expect(page).toHaveTitle(`${sibling.seoTitle} | Pixel Art Village`)
            await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org/nb/blog/${sibling.slug}/`)
            await page.goBack()
            await assertArticle()
          }
        })
      }
    }
  })
}

for (const post of norwegianPosts) {
  test(`Norwegian batch sharing PNG ${post.slug}`, async ({ request }) => {
    const response = await request.get(post.socialPreview.image)
    expect(response.status()).toBe(200)
    const bytes = await response.body()
    const metadata = await sharp(bytes).metadata()
    expect([metadata.format, metadata.width, metadata.height]).toEqual(['png', 1200, 630])
    expect(bytes.length).toBeLessThan(1000000)
    const result = await request.get(post.cover.after)
    expect(result.status()).toBe(200)
    // Follow the existing generator's resize-then-composite order for transparency.
    const resized = await sharp(await result.body()).resize(441, 350, { fit: 'contain', kernel: 'nearest', background: '#f8fafc' }).png().toBuffer()
    const expected = await sharp(resized).flatten({ background: '#f8fafc' }).ensureAlpha().raw().toBuffer()
    const actual = await sharp(bytes).extract({ left: 660, top: 182, width: 441, height: 350 }).ensureAlpha().raw().toBuffer()
    expect(actual.equals(expected)).toBe(true)
    await test.info().attach('norwegian-sharing-image', { body: bytes, contentType: 'image/png' })
  })
}

async function downloadNorwegianResult(page, filename, dimensions, maxColors, publishedBytes, downloadLabel = norwegianCopy.editor.downloadBtn) {
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: downloadLabel, exact: true }).last().click()])
  const path = test.info().outputPath(filename)
  await download.saveAs(path)
  const bytes = readFileSync(path)
  const metadata = await sharp(bytes).metadata()
  expect([metadata.format, metadata.width, metadata.height]).toEqual(['png', ...dimensions])
  const matchesPreview = await page.evaluate(async ([downloadUrl, previewUrl]) => {
    const images = await Promise.all([downloadUrl, previewUrl].map(async src => { const image = new Image(); image.src = src; await image.decode(); return image }))
    const pixels = image => {
      const canvas = document.createElement('canvas')
      canvas.width = images[1].naturalWidth
      canvas.height = images[1].naturalHeight
      const context = canvas.getContext('2d')
      context.imageSmoothingEnabled = false
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      return context.getImageData(0, 0, canvas.width, canvas.height).data
    }
    const expected = pixels(images[0])
    return pixels(images[1]).every((value, index) => value === expected[index])
  }, [`data:image/png;base64,${bytes.toString('base64')}`, await page.getByTestId('preview-container').locator('img').getAttribute('src')])
  expect(matchesPreview, 'Current-session preview matches this completed download without smoothing').toBe(true)
  const raw = await sharp(bytes).ensureAlpha().raw().toBuffer()
  if (publishedBytes) expect(raw.equals(await sharp(publishedBytes).ensureAlpha().raw().toBuffer())).toBe(true)
  if (maxColors) {
    const colors = new Set()
    for (let i = 0; i < raw.length; i += 4) if (raw[i + 3]) colors.add([...raw.subarray(i, i + 3)].join(','))
    expect(colors.size).toBeGreaterThan(1)
    expect(colors.size).toBeLessThanOrEqual(maxColors)
  }
  return raw
}

for (const width of [1440, 390]) {
  test(`Norwegian batch tool ${width}px size and palette workflow`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/nb/')
    await rejectNorwegianCookies(page)
    const source = await request.get('/photo-sunflower-source.jpg')
    expect(source.status()).toBe(200)
    await page.getByTestId('file-input').setInputFiles({ name: 'sunflower.jpg', mimeType: 'image/jpeg', buffer: await source.body() })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    const paletteNote = page.getByText(norwegianCopy.adjustments.palette.note, { exact: true })
    await expect(paletteNote).toBeVisible()
    await expect(paletteNote).toContainText('Hollow bruker faste fargesett')
    await expect(paletteNote).toContainText('ikke de faste fargesettene')
    await expect(paletteNote).not.toContainText('palettpalettfarger')
    await expect(page.getByLabel('Generer palett fra bildet', { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Last ned pikselbildet', exact: true }).last()).toBeVisible()
    await page.locator('#palette-select').selectOption('none')
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    for (let size = 2; size <= 12; size++) {
      await waitForIndonesianResult(page, () => page.locator('#pixel-size-slider').press('ArrowRight'))
      if (size === 8 || size === 12) {
        const published = await request.get(size === 8 ? '/tutorials/pixel-art-ko/sunflower-pixel8.png' : '/photo-sunflower-pixel12.png')
        expect(published.status()).toBe(200)
        await downloadNorwegianResult(page, `sunflower-pixel${size}.png`, size === 8 ? [120, 95] : [80, 63], null, await published.body())
      }
    }
    await waitForIndonesianResult(page, () => page.locator('#auto-palette').check())
    await expect(page.getByLabel('Antall palettfarger: 16', { exact: true })).toBeVisible()
    for (let colors = 17; colors <= 24; colors++) await waitForIndonesianResult(page, () => page.locator('#palette-size').press('ArrowRight'))
    const plain = await downloadNorwegianResult(page, 'sunflower-colors24.png', [80, 63], 24)
    await waitForIndonesianResult(page, () => page.locator('#dither').check())
    const dithered = await downloadNorwegianResult(page, 'sunflower-colors24-dither.png', [80, 63], 24)
    expect(dithered.equals(plain)).toBe(false)
  })

  test(`Norwegian batch tool ${width}px transparent import and download`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/nb/')
    await rejectNorwegianCookies(page)
    const source = await request.get('/tutorials/illustrator-png-ko/size-512.png')
    expect(source.status()).toBe(200)
    await page.getByTestId('file-input').setInputFiles({ name: 'browser-demo.png', mimeType: 'image/png', buffer: await source.body() })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    await page.locator('#palette-select').selectOption('none')
    for (let size = 2; size <= 8; size++) await waitForIndonesianResult(page, () => page.locator('#pixel-size-slider').press('ArrowRight'))
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    await expect(page.locator('#transparent-bg')).toBeChecked()
    const published = await request.get('/tutorials/pixel-art-id/illustrator-pixel8.png')
    expect(published.status()).toBe(200)
    const raw = await downloadNorwegianResult(page, 'converted-transparent.png', [64, 64], null, await published.body())
    const alpha = []
    for (let i = 3; i < raw.length; i += 4) alpha.push(raw[i])
    expect(alpha).toContain(0)
    expect(alpha).toContain(255)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })

  test(`Norwegian batch tool ${width}px invalid input, limits and recovery`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/nb/')
    await rejectNorwegianCookies(page)
    const input = page.getByTestId('file-input')
    await input.setInputFiles({ name: 'invalid.txt', mimeType: 'text/plain', buffer: Buffer.from('Test input, not a public case study') })
    await expect(page.getByText(norwegianCopy.errors.onlyPngJpg, { exact: true })).toBeVisible()
    await expect(page.getByTestId('editor-controls')).toHaveCount(0)
    // Synthetic image and padded PNGs exercise boundaries, not public examples.
    const png = await sharp({ create: { width: 3000, height: 1500, channels: 3, background: '#d64769' } }).png().toBuffer()
    const maxBytes = 10 * 1024 * 1024
    const overLimit = Buffer.alloc(maxBytes + 1)
    png.copy(overLimit)
    await input.setInputFiles({ name: 'oversized.png', mimeType: 'image/png', buffer: overLimit })
    await expect(page.getByText(norwegianCopy.errors.fileTooLarge10, { exact: true })).toBeVisible()
    await expect(page.getByTestId('editor-controls')).toHaveCount(0)
    const atLimit = Buffer.alloc(maxBytes)
    png.copy(atLimit)
    await input.setInputFiles({ name: 'at-limit.png', mimeType: 'image/png', buffer: atLimit })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    await expect(page.locator('#pixel-size-slider')).toHaveValue('1')
    await expect(page.getByText(norwegianCopy.errors.fileTooLarge10, { exact: true })).toHaveCount(0)
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    await downloadNorwegianResult(page, 'resized-boundary.png', [2200, 1100])
  })
}

test('Norwegian batch language switch retains the article and returns to Bokmål', async ({ page }) => {
  const post = norwegianPosts[4]
  await page.goto(`/nb/blog/${post.slug}/`)
  await rejectNorwegianCookies(page)
  await page.locator('#language-switcher').selectOption('en')
  await expect.poll(() => new URL(page.url()).pathname.replace(/\/$/, '')).toBe(`/blog/${post.slug}`)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org/blog/${post.slug}/`)
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org/blog/${post.slug}/`)
  await page.goBack()
  await expect(page).toHaveTitle(`${post.seoTitle} | Pixel Art Village`)
  await expect(page.locator('html')).toHaveAttribute('lang', 'nb')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org/nb/blog/${post.slug}/`)
})

const italianPosts = Object.values(JSON.parse(readFileSync(new URL('../src/content/blog-posts.it.json', import.meta.url), 'utf8')))
const italianCopy = JSON.parse(readFileSync(new URL('../public/locales/it/translation.json', import.meta.url), 'utf8'))
const italianPrimaryPhrases = ['convertitori pixel art', 'Trasformare foto in pixel art', 'Migliorare la pixel art', 'Esportare PNG da Illustrator', 'Come pixelare un’immagine']
const italianForbidden = /Village Optimizer|SNES Refiner|Village Export Hub|VillageExportHub|Palette Limiter Pro|We tested 10|No signup, no ads, no paywalls|Use the Resize slider|Village gallery integration|__PH_\d+__|\[object Object\]/

async function rejectItalianCookies(page) {
  if (process.env.EXPECT_CONSENT_BANNER === '1') {
    const banner = page.getByRole('region', { name: italianCopy.consent.bannerLabel, exact: true })
    await expect(banner).toContainText('Usiamo i cookie')
    await banner.getByRole('button', { name: italianCopy.consent.rejectLabel, exact: true }).click()
    await expect(banner).toHaveCount(0)
  }
}

async function downloadItalianResult(page, filename, dimensions, maxColors, publishedBytes) {
  return downloadNorwegianResult(page, filename, dimensions, maxColors, publishedBytes, italianCopy.editor.downloadBtn)
}

for (const width of [1440, 320]) {
  for (const granted of [false, true]) {
    test(`Italian batch consent ${width}px ${granted ? 'accept' : 'reject'} persists after reload`, async ({ page }) => {
      test.skip(process.env.EXPECT_CONSENT_BANNER !== '1', 'Requires the real production-style consent banner')
      await page.setViewportSize({ width, height: 844 })
      expect((await page.goto('/it/blog/export-from-illustrator-image-to-pixel-art/')).status()).toBe(200)
      const banner = page.getByRole('region', { name: italianCopy.consent.bannerLabel, exact: true })
      await expect(banner).toBeVisible()
      await expect(banner).toContainText('Usiamo i cookie')
      await expect(banner).toContainText('se abilitato')
      await expect(banner.getByRole('link', { name: italianCopy.consent.privacy, exact: true })).toHaveAttribute('href', '/it/privacy/')
      const label = granted ? italianCopy.consent.acceptLabel : italianCopy.consent.rejectLabel
      await banner.getByRole('button', { name: label, exact: true }).click()
      await expect(banner).toHaveCount(0)
      const choice = await page.evaluate(() => JSON.parse(localStorage.getItem('consent.choice.v1')))
      expect(choice.granted).toBe(granted)
      expect(choice.ts).toBeGreaterThan(0)
      await page.reload()
      await expect(page.locator('html')).toHaveAttribute('lang', 'it')
      await expect(banner).toHaveCount(0)
      expect(await page.evaluate(() => JSON.parse(localStorage.getItem('consent.choice.v1')).granted)).toBe(granted)
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    })
  }
}

for (const javaScriptEnabled of [false, true]) {
  test.describe(`Italian batch ${javaScriptEnabled ? 'runtime' : 'initial HTML'}`, () => {
    test.use({ javaScriptEnabled })
    for (const width of [1440, 390, 320]) {
      for (const [index, post] of italianPosts.entries()) {
        test(`${width}px ${post.slug}`, async ({ page, request }) => {
          await page.setViewportSize({ width, height: width <= 390 ? 844 : 1000 })
          expect((await page.goto('/it/blog/')).status()).toBe(200)
          if (javaScriptEnabled) await rejectItalianCookies(page)
          const route = `/it/blog/${post.slug}/`
          const title = `${post.seoTitle} | Pixel Art Village`
          await expect(page.locator('main .blog-simple-card').getByRole('link', { name: post.presentation.readMoreLabel, exact: true })).toHaveCount(5)
          const entry = page.getByRole('link', { name: post.title, exact: true })
          await expect(entry).toHaveAttribute('href', route)
          await entry.click()
          const assertArticle = async () => {
            expect([...title].length).toBeGreaterThanOrEqual(55)
            expect([...title].length).toBeLessThanOrEqual(60)
            expect([...post.excerpt].length).toBeLessThanOrEqual(155)
            await expect(page).toHaveTitle(title)
            await expect(page.locator('html')).toHaveAttribute('lang', 'it')
            await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title)
            await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
            await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org${route}`)
            await expect(page.locator('link[hreflang="it"]')).toHaveAttribute('href', `https://pixelartvillage.org${route}`)
            await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0)
            for (const key of ['description', 'og:description', 'twitter:description']) {
              await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', post.excerpt)
            }
            for (const key of ['og:title', 'twitter:title']) {
              await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', title)
            }
            await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://pixelartvillage.org${route}`)
            for (const key of ['og:image', 'twitter:image']) {
              await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', `https://pixelartvillage.org${post.socialPreview.image}`)
              await expect(page.locator(`meta[name="${key}:alt"],meta[property="${key}:alt"]`)).toHaveAttribute('content', post.socialPreview.alt)
            }
            const main = page.locator('main')
            const article = page.locator('.blog-article-prose')
            await expect(article).not.toContainText(italianForbidden)
            await expect(main).not.toContainText(/min read|Related Articles|Back to Blog|Source image|Pixel art result/)
            await expect(main).toContainText('Aggiornato: 2026-10-11')
            const backLinks = main.getByRole('link', { name: 'Torna al blog', exact: true })
            await expect(backLinks).toHaveCount(2)
            for (const link of await backLinks.all()) await expect(link).toHaveAttribute('href', '/it/blog/')
            await expect(article).toContainText(italianPrimaryPhrases[index])
            await expect(main.locator('a[rel="author"]')).toHaveAttribute('href', '/it/about/')
            const schema = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.flatMap(node => JSON.parse(node.textContent)))
            expect(schema.find(item => item['@type'] === 'BlogPosting')).toMatchObject({
              headline: post.title, description: post.excerpt, inLanguage: 'it', datePublished: post.date,
              dateModified: '2026-10-11', mainEntityOfPage: `https://pixelartvillage.org${route}`,
              author: { name: 'Pixel Art Village', url: 'https://pixelartvillage.org/it/about/' },
              image: `https://pixelartvillage.org${post.socialPreview.image}`,
            })
            expect(schema.find(item => item['@type'] === 'BreadcrumbList').itemListElement.at(-1)).toMatchObject({ name: post.title, item: `https://pixelartvillage.org${route}` })
            const faq = schema.find(item => item['@type'] === 'FAQPage')
            expect(faq.mainEntity).toHaveLength(index === 3 ? 4 : 3)
            for (const question of faq.mainEntity) {
              await expect(article.getByRole('heading', { name: question.name, exact: true })).toBeVisible()
              await expect(article).toContainText(question.acceptedAnswer.text)
            }
            const headings = await article.locator('h2,h3,h4').evaluateAll(nodes => nodes.map(node => Number(node.tagName[1])))
            expect(headings[0]).toBe(2)
            expect(headings.every((level, i) => i === 0 || level <= headings[i - 1] + 1)).toBe(true)
            await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
          }
          await assertArticle()
          await page.reload()
          await assertArticle()
          const article = page.locator('.blog-article-prose')
          const figures = post.body.filter(block => block.type === 'figure')
          await expect(article.locator('figure')).toHaveCount(figures.length)
          for (const figure of figures) {
            const element = article.locator(`figure:has(img[src="${figure.src}"])`)
            const img = element.locator('img')
            await img.scrollIntoViewIfNeeded()
            await img.evaluate(image => image.decode())
            await expect.poll(() => img.evaluate(image => [image.naturalWidth, image.naturalHeight])).toEqual([figure.width, figure.height])
            await expect(img).toHaveAttribute('alt', figure.alt)
            await expect(element.locator('figcaption')).toContainText(figure.caption)
            const response = await request.get(figure.src)
            expect(response.status()).toBe(200)
            const bytes = await response.body()
            const metadata = await sharp(bytes).metadata()
            expect([metadata.width, metadata.height]).toEqual([figure.width, figure.height])
            const [download] = await Promise.all([page.waitForEvent('download'), element.getByRole('link', { name: figure.downloadLabel, exact: true }).click()])
            const path = test.info().outputPath(figure.src.split('/').pop())
            await download.saveAs(path)
            expect(readFileSync(path).equals(bytes)).toBe(true)
          }
          const cover = page.getByRole('region', { name: post.presentation.coverLabel, exact: true })
          await cover.scrollIntoViewIfNeeded()
          await cover.locator('img').evaluateAll(async images => { for (const image of images) await image.decode() })
          await expect(cover.locator('figcaption')).toHaveText([post.presentation.sourceLabel, post.presentation.resultLabel])
          if (javaScriptEnabled) await test.info().attach(`italian-cover-${index}-${width}`, { body: await cover.screenshot(), contentType: 'image/png' })
          for (const href of await article.locator('a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')).filter(href => href.startsWith('/')))) {
            expect(href, 'Pages stay Italian; resource paths are not localized').toMatch(/^\/it\/|^\/(photo-|tutorials\/)/)
            expect((await request.get(href)).status(), href).toBe(200)
          }
          if (post.comparison) await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(4)
          if (index === 0) {
            await expect(article).toContainText('Non abbiamo testato qualità o velocità')
            await expect(article).toContainText('10 485 760 byte')
            await expect(article).toContainText('supera 2200 pixel')
          }
          if ([1, 2, 4].includes(index)) {
            await expect(article).toContainText('Genera palette da immagine')
            await expect(article).toContainText('Numero di colori')
          }
          await expect(article).not.toContainText(/Palette Palette|generano automaticamente palette per dimensione/)
          if (index === 1) {
            await expect(article).toContainText('non una modalità hardware')
            await expect(article).toContainText('120×95')
            await expect(article).toContainText('80×63')
            await expect(article).toContainText('non cambia una palette fissa')
            await expect(article).toContainText('al massimo 24 colori RGB opachi')
            await expect(article).toContainText('Il numero 24 non rappresenta un limite hardware')
          }
          if (index === 2) {
            await expect(article).toContainText('non ridisegna lettere')
            await expect(article).toContainText('è cambiato solo il dithering')
            await expect(article).toContainText('non ricrea una palette Pico-8 o Sunset 8')
          }
          if (index === 3) {
            await expect(article).toContainText('Non abbiamo eseguito l’esportazione nell’app Illustrator')
            await expect(article).toContainText('non solo un valore PPI')
            await expect(article).toContainText('non ottenuto convertendo il primo file')
            await expect(article).toContainText('non la prova di un’esportazione Illustrator')
            expect(await article.locator('a[href^="https://helpx.adobe.com/"]').count()).toBe(3)
          }
          if (index === 4) {
            await expect(article).toContainText(italianCopy.editor.downloadBtn)
            await expect(article).toContainText('aspetta che la nuova anteprima sia effettivamente visibile')
            await expect(article).toContainText('Il cursore non cambia le palette fisse')
            await expect(article).toContainText('10 485 760 byte')
          }
          if (javaScriptEnabled) {
            const sibling = italianPosts.find(item => item.slug !== post.slug && post.body.some(block => typeof block === 'string' && block.includes(`/blog/${item.slug}/`)))
            await article.locator(`a[href="/it/blog/${sibling.slug}/"]`).first().click()
            await expect(page).toHaveTitle(`${sibling.seoTitle} | Pixel Art Village`)
            await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org/it/blog/${sibling.slug}/`)
            await page.goBack()
            await assertArticle()
          }
        })
      }
    }
  })
}

for (const post of italianPosts) {
  test(`Italian batch sharing PNG ${post.slug}`, async ({ request }) => {
    const response = await request.get(post.socialPreview.image)
    expect(response.status()).toBe(200)
    const bytes = await response.body()
    const metadata = await sharp(bytes).metadata()
    expect([metadata.format, metadata.width, metadata.height]).toEqual(['png', 1200, 630])
    expect(bytes.length).toBeLessThan(1000000)
    const result = await request.get(post.cover.after)
    expect(result.status()).toBe(200)
    const resized = await sharp(await result.body()).resize(441, 350, { fit: 'contain', kernel: 'nearest', background: '#f8fafc' }).png().toBuffer()
    const expected = await sharp(resized).flatten({ background: '#f8fafc' }).ensureAlpha().raw().toBuffer()
    const actual = await sharp(bytes).extract({ left: 660, top: 182, width: 441, height: 350 }).ensureAlpha().raw().toBuffer()
    expect(actual.equals(expected)).toBe(true)
    await test.info().attach('italian-sharing-image', { body: bytes, contentType: 'image/png' })
  })
}

for (const width of [1440, 390]) {
  test(`Italian batch tool ${width}px size and palette workflow`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 1000 })
    expect((await page.goto('/it/')).status()).toBe(200)
    await rejectItalianCookies(page)
    const source = await request.get('/photo-sunflower-source.jpg')
    expect(source.status()).toBe(200)
    await page.getByTestId('file-input').setInputFiles({ name: 'sunflower.jpg', mimeType: 'image/jpeg', buffer: await source.body() })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    const paletteNote = page.getByText(italianCopy.adjustments.palette.note, { exact: true })
    await expect(paletteNote).toBeVisible()
    await expect(paletteNote).toContainText('Pico-8, Lost Century, Sunset 8, Twilight 5 e Hollow usano palette fisse')
    await expect(paletteNote).toContainText('non modifica le palette fisse')
    await expect(paletteNote).not.toContainText('generano automaticamente palette per dimensione')
    await expect(page.getByLabel(italianCopy.adjustments.autoPalette, { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: italianCopy.editor.downloadBtn, exact: true }).last()).toBeVisible()
    await page.locator('#palette-select').selectOption('none')
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    for (let size = 2; size <= 12; size++) {
      await waitForIndonesianResult(page, () => page.locator('#pixel-size-slider').press('ArrowRight'))
      if (size === 8 || size === 12) {
        const published = await request.get(size === 8 ? '/tutorials/pixel-art-ko/sunflower-pixel8.png' : '/photo-sunflower-pixel12.png')
        expect(published.status()).toBe(200)
        await downloadItalianResult(page, `sunflower-pixel${size}.png`, size === 8 ? [120, 95] : [80, 63], null, await published.body())
      }
    }
    await waitForIndonesianResult(page, () => page.locator('#auto-palette').check())
    await expect(page.locator('#palette-size')).toHaveValue('16')
    await expect(page.getByLabel('Numero di colori: 16', { exact: true })).toBeVisible()
    for (let colors = 17; colors <= 24; colors++) await waitForIndonesianResult(page, () => page.locator('#palette-size').press('ArrowRight'))
    await expect(page.getByLabel('Numero di colori: 24', { exact: true })).toBeVisible()
    const plain = await downloadItalianResult(page, 'sunflower-colors24.png', [80, 63], 24)
    await waitForIndonesianResult(page, () => page.locator('#dither').check())
    const dithered = await downloadItalianResult(page, 'sunflower-colors24-dither.png', [80, 63], 24)
    expect(dithered.equals(plain)).toBe(false)
  })

  test(`Italian batch tool ${width}px transparent import and download`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/it/')
    await rejectItalianCookies(page)
    const source = await request.get('/tutorials/illustrator-png-ko/size-512.png')
    expect(source.status()).toBe(200)
    await page.getByTestId('file-input').setInputFiles({ name: 'browser-demo.png', mimeType: 'image/png', buffer: await source.body() })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    await page.locator('#palette-select').selectOption('none')
    for (let size = 2; size <= 8; size++) await waitForIndonesianResult(page, () => page.locator('#pixel-size-slider').press('ArrowRight'))
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    await expect(page.locator('#transparent-bg')).toBeChecked()
    const published = await request.get('/tutorials/pixel-art-id/illustrator-pixel8.png')
    expect(published.status()).toBe(200)
    const raw = await downloadItalianResult(page, 'converted-transparent.png', [64, 64], null, await published.body())
    const alpha = []
    for (let i = 3; i < raw.length; i += 4) alpha.push(raw[i])
    expect(alpha).toContain(0)
    expect(alpha).toContain(255)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })

  test(`Italian batch tool ${width}px invalid input, limits and recovery`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/it/')
    await rejectItalianCookies(page)
    const input = page.getByTestId('file-input')
    await input.setInputFiles({ name: 'invalid.txt', mimeType: 'text/plain', buffer: Buffer.from('Test input, not a public case study') })
    await expect(page.getByText(italianCopy.errors.onlyPngJpg, { exact: true })).toBeVisible()
    await expect(page.getByTestId('editor-controls')).toHaveCount(0)
    // Synthetic image and padded PNGs exercise boundaries, not public examples.
    const png = await sharp({ create: { width: 3000, height: 1500, channels: 3, background: '#d64769' } }).png().toBuffer()
    const maxBytes = 10 * 1024 * 1024
    const overLimit = Buffer.alloc(maxBytes + 1)
    png.copy(overLimit)
    await input.setInputFiles({ name: 'oversized.png', mimeType: 'image/png', buffer: overLimit })
    await expect(page.getByText(italianCopy.errors.fileTooLarge10, { exact: true })).toBeVisible()
    await expect(page.getByTestId('editor-controls')).toHaveCount(0)
    const atLimit = Buffer.alloc(maxBytes)
    png.copy(atLimit)
    await input.setInputFiles({ name: 'at-limit.png', mimeType: 'image/png', buffer: atLimit })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    await expect(page.locator('#pixel-size-slider')).toHaveValue('1')
    await expect(page.getByText(italianCopy.errors.fileTooLarge10, { exact: true })).toHaveCount(0)
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    await downloadItalianResult(page, 'resized-boundary.png', [2200, 1100])
  })
}

test('Italian batch language switch retains the article and returns to Italian', async ({ page }) => {
  const post = italianPosts[4]
  await page.goto(`/it/blog/${post.slug}/`)
  await rejectItalianCookies(page)
  await page.locator('#language-switcher').selectOption('en')
  await expect.poll(() => new URL(page.url()).pathname.replace(/\/$/, '')).toBe(`/blog/${post.slug}`)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org/blog/${post.slug}/`)
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org/blog/${post.slug}/`)
  await page.goBack()
  await expect(page).toHaveTitle(`${post.seoTitle} | Pixel Art Village`)
  await expect(page.locator('html')).toHaveAttribute('lang', 'it')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org/it/blog/${post.slug}/`)
})

const arabicPosts = Object.values(JSON.parse(readFileSync(new URL('../src/content/blog-posts.ar.json', import.meta.url), 'utf8')))
const arabicCopy = JSON.parse(readFileSync(new URL('../public/locales/ar/translation.json', import.meta.url), 'utf8'))
const arabicFacts = [
  ['محولات فن البكسل', 'لم نختبر جودة البرامج الثلاثة', '10 485 760 بايت', 'تجاوز الضلع الأطول 2200'],
  ['تحويل الصور إلى فن بكسل', 'وليس وضعًا يطابق عتاد الجهاز', 'ولا يغير اللوحات الثابتة', 'العدد 24 ليس حدًا لعتاد SNES', 'جلسة المثال السابق نفسها', '24 لون RGB معتمًا', 'هل يبقى محيط الموضوع واضحًا', 'هل تميز كتل الضوء والظل', 'ترتيب كتل الألوان ورسم الحواف يدويًا'],
  ['تحسين فن البكسل', 'ولا يعيد رسم حروف', 'وتغير التنقيط اللوني فقط', 'شريط العدد لا يعيد إنشاء ألوان', 'التهيئة العشوائية', 'ثلاثة خطوط أفقية رفيعة', 'لا يستعيد تفاصيل من ملف'],
  ['تصدير PNG من Illustrator', 'لم ننفذ التصدير في تطبيق Illustrator', 'لا قيمة PPI وحدها', 'وليس ناتج تحويل الملف الأول', 'وليس إثباتًا لتصدير Illustrator', 'بوحدة px', '256×256', '512×512', '300×200', '600×400', 'المقياس مضاعف لأبعاد اللوح'],
  ['تحويل صورة إلى بكسل', arabicCopy.editor.downloadBtn, 'انتظر ظهور المعاينة الجديدة فعلًا', 'الشريط لا يغير ألوان اللوحات الثابتة', '10 485 760 بايت'],
]

async function rejectArabicCookies(page) {
  if (process.env.EXPECT_CONSENT_BANNER === '1') {
    const banner = page.getByRole('region', { name: arabicCopy.consent.bannerLabel, exact: true })
    await expect(banner).toContainText('نحن نستخدم ملفات تعريف الارتباط')
    await banner.getByRole('button', { name: arabicCopy.consent.rejectLabel, exact: true }).click()
    await expect(banner).toHaveCount(0)
  }
}

async function downloadArabicResult(page, filename, dimensions, maxColors, publishedBytes) {
  return downloadNorwegianResult(page, filename, dimensions, maxColors, publishedBytes, arabicCopy.editor.downloadBtn)
}

for (const javaScriptEnabled of [false, true]) {
  test.describe(`Arabic batch ${javaScriptEnabled ? 'runtime' : 'initial HTML'}`, () => {
    test.use({ javaScriptEnabled })
    for (const width of [1440, 390, 320]) {
      for (const [index, post] of arabicPosts.entries()) {
        test(`${width}px ${post.slug}`, async ({ page, request }) => {
          await page.setViewportSize({ width, height: width <= 390 ? 844 : 1000 })
          expect((await page.goto('/ar/blog/')).status()).toBe(200)
          if (javaScriptEnabled) await rejectArabicCookies(page)
          await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
          await expect(page.locator('main')).toHaveCSS('direction', 'rtl')
          await expect(page.locator('main .blog-simple-card').getByRole('link', { name: 'اقرأ المقال', exact: true })).toHaveCount(5)
          const route = `/ar/blog/${post.slug}/`
          const title = `${post.seoTitle} | Pixel Art Village`
          const entry = page.getByRole('link', { name: post.title, exact: true })
          await expect(entry).toHaveAttribute('href', route)
          await entry.click()
          const assertArticle = async () => {
            expect([...title].length).toBeGreaterThanOrEqual(55)
            expect([...title].length).toBeLessThanOrEqual(60)
            expect([...post.excerpt].length).toBeLessThanOrEqual(155)
            await expect(page).toHaveTitle(title)
            await expect(page.locator('html')).toHaveAttribute('lang', 'ar')
            await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
            const article = page.locator('.blog-article-prose')
            await expect(article).toHaveCSS('direction', 'rtl')
            const reversedDimensions = await article.evaluate(node => {
              const wrong = []
              const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT)
              while (walker.nextNode()) {
                const text = walker.currentNode
                for (const match of text.textContent.matchAll(/\d+×\d+/g)) {
                  const range = document.createRange()
                  range.setStart(text, match.index)
                  range.setEnd(text, match.index + 1)
                  const first = range.getBoundingClientRect().x
                  range.setStart(text, match.index + match[0].length - 1)
                  range.setEnd(text, match.index + match[0].length)
                  if (first >= range.getBoundingClientRect().x) wrong.push(match[0])
                }
              }
              return wrong
            })
            expect(reversedDimensions, 'Width remains before height visually in Arabic paragraphs and captions').toEqual([])
            await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title)
            await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
            await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org${route}`)
            await expect(page.locator('link[hreflang="ar"]')).toHaveAttribute('href', `https://pixelartvillage.org${route}`)
            await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0)
            for (const key of ['description', 'og:description', 'twitter:description']) {
              await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', post.excerpt)
            }
            for (const key of ['og:title', 'twitter:title']) await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', title)
            await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://pixelartvillage.org${route}`)
            for (const key of ['og:image', 'twitter:image']) {
              await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', `https://pixelartvillage.org${post.socialPreview.image}`)
              await expect(page.locator(`meta[name="${key}:alt"],meta[property="${key}:alt"]`)).toHaveAttribute('content', post.socialPreview.alt)
            }
            await expect(article).not.toContainText(italianForbidden)
            await expect(page.locator('main')).not.toContainText(/min read|Related Articles|Back to Blog|Source image|Pixel art result/)
            await expect(page.locator('main')).toContainText('آخر تحديث: 2026-10-11')
            const backLinks = page.locator('main').getByRole('link', { name: 'العودة إلى المدونة', exact: true })
            await expect(backLinks).toHaveCount(2)
            for (const link of await backLinks.all()) await expect(link).toHaveAttribute('href', '/ar/blog/')
            await expect(page.locator('main a[rel="author"]')).toHaveAttribute('href', '/ar/about/')
            for (const fact of arabicFacts[index]) await expect(article).toContainText(fact)
            await expect(article.getByRole('heading', { name: 'الأسئلة الشائعة', exact: true })).toBeVisible()
            await expect(article).not.toContainText(/FAQ|لا أحد|تمكين التردد|بعض شرح اللوحات في الواجهة الحالية غير دقيق|خلافًا لبعض الشرح القديم/)
            if ([1, 2, 4].includes(index)) await expect(article).toContainText('تفعيل التنقيط اللوني (فلويد – شتاينبرغ)')
            if ([1, 2, 4].includes(index)) await expect(article).toContainText(arabicCopy.adjustments.autoPalette)
            if (index === 3) expect(await article.locator('a[href^="https://helpx.adobe.com/"]').count()).toBe(3)
            const schema = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.flatMap(node => JSON.parse(node.textContent)))
            expect(schema.find(item => item['@type'] === 'BlogPosting')).toMatchObject({
              headline: post.title, description: post.excerpt, inLanguage: 'ar', datePublished: post.date, dateModified: '2026-10-11',
              mainEntityOfPage: `https://pixelartvillage.org${route}`, author: { name: 'Pixel Art Village', url: 'https://pixelartvillage.org/ar/about/' }, image: `https://pixelartvillage.org${post.socialPreview.image}`,
            })
            expect(schema.find(item => item['@type'] === 'BreadcrumbList').itemListElement.at(-1)).toMatchObject({ name: post.title, item: `https://pixelartvillage.org${route}` })
            const faq = schema.find(item => item['@type'] === 'FAQPage')
            expect(faq.mainEntity).toHaveLength(index === 3 ? 4 : 3)
            for (const question of faq.mainEntity) {
              await expect(article.getByRole('heading', { name: question.name, exact: true })).toBeVisible()
              await expect(article).toContainText(question.acceptedAnswer.text)
            }
            const headings = await article.locator('h2,h3,h4').evaluateAll(nodes => nodes.map(node => Number(node.tagName[1])))
            expect(headings[0]).toBe(2)
            expect(headings.every((level, i) => i === 0 || level <= headings[i - 1] + 1)).toBe(true)
            await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
            if (post.comparison) {
              const table = page.getByRole('table')
              await expect(table).toHaveCSS('direction', 'rtl')
              await expect(table).toHaveCSS('text-align', 'right')
              await expect(table.locator('tbody tr')).toHaveCount(4)
              if (width === 1440) {
                const positions = await table.locator('thead th').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().x))
                expect(positions.every((x, i) => i === 0 || x < positions[i - 1])).toBe(true)
              }
            }
          }
          await assertArticle()
          await page.reload()
          await assertArticle()
          const article = page.locator('.blog-article-prose')
          const figures = post.body.filter(block => block.type === 'figure')
          await expect(article.locator('figure')).toHaveCount(figures.length)
          for (const figure of figures) {
            const element = article.locator(`figure:has(img[src="${figure.src}"])`)
            const img = element.locator('img')
            await img.scrollIntoViewIfNeeded()
            await img.evaluate(image => image.decode())
            expect(await img.evaluate(image => [image.naturalWidth, image.naturalHeight])).toEqual([figure.width, figure.height])
            await expect(img).toHaveAttribute('alt', figure.alt)
            await expect(element.locator('figcaption')).toContainText(figure.caption)
            const response = await request.get(figure.src)
            expect(response.status()).toBe(200)
            const bytes = await response.body()
            const metadata = await sharp(bytes).metadata()
            expect([metadata.width, metadata.height]).toEqual([figure.width, figure.height])
            const [download] = await Promise.all([page.waitForEvent('download'), element.getByRole('link', { name: figure.downloadLabel, exact: true }).click()])
            const path = test.info().outputPath(figure.src.split('/').pop())
            await download.saveAs(path)
            expect(readFileSync(path).equals(bytes)).toBe(true)
          }
          const cover = page.getByRole('region', { name: post.presentation.coverLabel, exact: true })
          await cover.scrollIntoViewIfNeeded()
          await cover.locator('img').evaluateAll(async images => { for (const image of images) await image.decode() })
          await expect(cover.locator('figcaption')).toHaveText([post.presentation.sourceLabel, post.presentation.resultLabel])
          const splitOrReversedCoverDimensions = await cover.locator('figcaption').evaluateAll(nodes => nodes.flatMap(node => {
            const wrong = []
            const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT)
            while (walker.nextNode()) {
              const text = walker.currentNode
              for (const match of text.textContent.matchAll(/\d+\s*×\s*\d+/g)) {
                const range = document.createRange()
                range.setStart(text, match.index)
                range.setEnd(text, match.index + 1)
                const first = range.getBoundingClientRect()
                range.setStart(text, match.index + match[0].length - 1)
                range.setEnd(text, match.index + match[0].length)
                const last = range.getBoundingClientRect()
                if (first.x >= last.x || first.y !== last.y) wrong.push(match[0])
              }
            }
            return wrong
          }))
          expect(splitOrReversedCoverDimensions, 'Cover width and height form one correctly ordered line').toEqual([])
          const panels = await cover.locator('figure').evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().x))
          expect(panels[0]).toBeGreaterThan(panels[1])
          if (javaScriptEnabled) await test.info().attach(`arabic-cover-${index}-${width}`, { body: await cover.screenshot(), contentType: 'image/png' })
          if (javaScriptEnabled) {
            for (const figure of figures.filter(block => block.src.startsWith('/tutorials/pixel-art-ar/'))) {
              const element = article.locator(`figure:has(img[src="${figure.src}"])`)
              await expect(element.locator('img')).toHaveCSS('image-rendering', 'pixelated')
              await test.info().attach(`arabic-lines-${figure.width}-${width}`, { body: await element.screenshot(), contentType: 'image/png' })
            }
          }
          for (const href of await article.locator('a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')).filter(href => href.startsWith('/')))) {
            expect(href, 'Pages stay Arabic; resources retain actual paths').toMatch(/^\/ar\/|^\/(photo-|tutorials\/)/)
            expect((await request.get(href)).status(), href).toBe(200)
          }
          if (javaScriptEnabled) {
            const sibling = arabicPosts.find(item => item.slug !== post.slug && post.body.some(block => typeof block === 'string' && block.includes(`/blog/${item.slug}/`)))
            await article.locator(`a[href="/ar/blog/${sibling.slug}/"]`).first().click()
            await expect(page).toHaveTitle(`${sibling.seoTitle} | Pixel Art Village`)
            await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org/ar/blog/${sibling.slug}/`)
            await page.goBack()
            await assertArticle()
          }
        })
      }
    }
  })
}

for (const post of arabicPosts) {
  test(`Arabic batch sharing PNG ${post.slug}`, async ({ request }) => {
    const response = await request.get(post.socialPreview.image)
    expect(response.status()).toBe(200)
    const bytes = await response.body()
    const metadata = await sharp(bytes).metadata()
    expect([metadata.format, metadata.width, metadata.height]).toEqual(['png', 1200, 630])
    expect(bytes.length).toBeLessThan(1000000)
    const result = await request.get(post.cover.after)
    expect(result.status()).toBe(200)
    const resized = await sharp(await result.body()).resize(441, 350, { fit: 'contain', kernel: 'nearest', background: '#f8fafc' }).png().toBuffer()
    const expected = await sharp(resized).flatten({ background: '#f8fafc' }).ensureAlpha().raw().toBuffer()
    const actual = await sharp(bytes).extract({ left: 660, top: 182, width: 441, height: 350 }).ensureAlpha().raw().toBuffer()
    expect(actual.equals(expected)).toBe(true)
    await test.info().attach('arabic-sharing-image', { body: bytes, contentType: 'image/png' })
  })
}

for (const width of [1440, 320]) {
  for (const granted of [false, true]) {
    test(`Arabic batch consent ${width}px ${granted ? 'accept' : 'reject'} persists after reload`, async ({ page }) => {
      test.skip(process.env.EXPECT_CONSENT_BANNER !== '1', 'Requires the real production-style consent banner')
      await page.setViewportSize({ width, height: 844 })
      expect((await page.goto('/ar/blog/export-from-illustrator-image-to-pixel-art/')).status()).toBe(200)
      const banner = page.getByRole('region', { name: arabicCopy.consent.bannerLabel, exact: true })
      await expect(banner).toContainText('نحن نستخدم ملفات تعريف الارتباط')
      await expect(banner).toContainText('في حالة تمكينها')
      await expect(banner.getByRole('link', { name: arabicCopy.consent.privacy, exact: true })).toHaveAttribute('href', '/ar/privacy/')
      await banner.getByRole('button', { name: granted ? arabicCopy.consent.acceptLabel : arabicCopy.consent.rejectLabel, exact: true }).click()
      await expect(banner).toHaveCount(0)
      const choice = await page.evaluate(() => JSON.parse(localStorage.getItem('consent.choice.v1')))
      expect(choice.granted).toBe(granted)
      expect(choice.ts).toBeGreaterThan(0)
      await page.reload()
      await expect(banner).toHaveCount(0)
      expect(await page.evaluate(() => JSON.parse(localStorage.getItem('consent.choice.v1')).granted)).toBe(granted)
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    })
  }
}

for (const width of [1440, 390]) {
  test(`Arabic batch tool ${width}px size and palette workflow`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/ar/')
    await rejectArabicCookies(page)
    const source = await request.get('/photo-sunflower-source.jpg')
    expect(source.status()).toBe(200)
    await page.getByTestId('file-input').setInputFiles({ name: 'sunflower.jpg', mimeType: 'image/jpeg', buffer: await source.body() })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    await expect(page.getByLabel(arabicCopy.adjustments.autoPalette, { exact: true })).toBeVisible()
    await expect(page.locator('#palette-select option[value="none"]')).toHaveText('بلا لوحة')
    const paletteNote = page.getByText(arabicCopy.adjustments.palette.note, { exact: true })
    await expect(paletteNote).toContainText('Hollow لوحات ثابتة')
    await expect(paletteNote).toContainText('يؤثر فقط عند تفعيل توليد لوحة من الصورة')
    await expect(paletteNote).not.toContainText(/تلقائيًا|Sunset 8 → 8/)
    await expect(page.getByLabel('تفعيل التنقيط اللوني (فلويد – شتاينبرغ)', { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: arabicCopy.editor.downloadBtn, exact: true }).last()).toBeVisible()
    await page.locator('#palette-select').selectOption('none')
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    for (let size = 2; size <= 12; size++) {
      // ArrowUp increases a native range in either LTR or RTL layouts.
      await waitForIndonesianResult(page, () => page.locator('#pixel-size-slider').press('ArrowUp'))
      await expect(page.locator('#pixel-size-slider')).toHaveValue(String(size))
      if (size === 8 || size === 12) {
        const published = await request.get(size === 8 ? '/tutorials/pixel-art-ko/sunflower-pixel8.png' : '/photo-sunflower-pixel12.png')
        expect(published.status()).toBe(200)
        await downloadArabicResult(page, `sunflower-pixel${size}.png`, size === 8 ? [120, 95] : [80, 63], null, await published.body())
      }
    }
    await waitForIndonesianResult(page, () => page.locator('#auto-palette').check())
    await expect(page.locator('#palette-size')).toHaveValue('16')
    for (let colors = 17; colors <= 24; colors++) await waitForIndonesianResult(page, () => page.locator('#palette-size').press('ArrowUp'))
    await expect(page.locator('#palette-size')).toHaveValue('24')
    await expect(page.getByLabel('الحد الأقصى لألوان اللوحة المولدة: 24', { exact: true })).toBeVisible()
    const plain = await downloadArabicResult(page, 'sunflower-colors24.png', [80, 63], 24)
    await waitForIndonesianResult(page, () => page.locator('#dither').check())
    const dithered = await downloadArabicResult(page, 'sunflower-colors24-dither.png', [80, 63], 24)
    expect(dithered.equals(plain)).toBe(false)
    await waitForIndonesianResult(page, () => page.locator('#auto-palette').uncheck())
    await waitForIndonesianResult(page, () => page.locator('#palette-select').selectOption('Sunset 8'))
    await expect(page.locator('#palette-size')).toHaveCount(0)
    await downloadArabicResult(page, 'sunflower-fixed-sunset8.png', [80, 63], 8)
  })

  test(`Arabic batch tool ${width}px thin-line reference downloads`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/ar/')
    await rejectArabicCookies(page)
    const source = await request.get('/tutorials/illustrator-png-ko/size-512.png')
    expect(source.status()).toBe(200)
    await page.getByTestId('file-input').setInputFiles({ name: 'lines-source.png', mimeType: 'image/png', buffer: await source.body() })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    await expect(page.locator('#pixel-size-slider')).toHaveValue('1')
    await expect(page.locator('#palette-select')).toHaveValue('none')
    await expect(page.locator('#auto-palette')).not.toBeChecked()
    await expect(page.locator('#dither')).not.toBeChecked()
    await expect(page.getByLabel(arabicCopy.export.transparent.label, { exact: true })).toBeChecked()
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    const references = []
    for (let size = 2; size <= 16; size++) {
      await waitForIndonesianResult(page, () => page.locator('#pixel-size-slider').press('ArrowUp'))
      if (![4, 16].includes(size)) continue
      const published = await request.get(`/tutorials/pixel-art-ar/lines-pixel${size}.png`)
      expect(published.status()).toBe(200)
      const dimension = 512 / size
      const raw = await downloadArabicResult(page, `lines-pixel${size}.png`, [dimension, dimension])
      references.push({ size, raw, published: await published.body() })
      // Count distinct dark row bands across the source's three thin lines.
      let bands = 0
      let inBand = false
      for (let y = Math.floor(365 / size); y < Math.ceil(420 / size); y++) {
        const dark = raw[(y * dimension + dimension / 2) * 4] < 220
        if (dark && !inBand) bands++
        inBand = dark
      }
      expect(bands, 'Pixel Size 4 preserves three separated lines; 16 retains one band').toBe(size === 4 ? 3 : 1)
    }
    for (const { size, raw, published } of references) {
      expect(raw.equals(await sharp(published).ensureAlpha().raw().toBuffer()), `Published Pixel Size ${size} matches the actual download`).toBe(true)
    }
  })

  test(`Arabic batch tool ${width}px transparent import and download`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/ar/')
    await rejectArabicCookies(page)
    const source = await request.get('/tutorials/illustrator-png-ko/size-512.png')
    expect(source.status()).toBe(200)
    await page.getByTestId('file-input').setInputFiles({ name: 'browser-demo.png', mimeType: 'image/png', buffer: await source.body() })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    await page.locator('#palette-select').selectOption('none')
    for (let size = 2; size <= 8; size++) await waitForIndonesianResult(page, () => page.locator('#pixel-size-slider').press('ArrowUp'))
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    await expect(page.locator('#transparent-bg')).toBeChecked()
    const published = await request.get('/tutorials/pixel-art-id/illustrator-pixel8.png')
    expect(published.status()).toBe(200)
    const raw = await downloadArabicResult(page, 'converted-transparent.png', [64, 64], null, await published.body())
    const alpha = []
    for (let i = 3; i < raw.length; i += 4) alpha.push(raw[i])
    expect(alpha).toContain(0)
    expect(alpha).toContain(255)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })

  test(`Arabic batch tool ${width}px invalid input, limits and recovery`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/ar/')
    await rejectArabicCookies(page)
    const input = page.getByTestId('file-input')
    await input.setInputFiles({ name: 'invalid.txt', mimeType: 'text/plain', buffer: Buffer.from('Synthetic test input, not a published case study') })
    await expect(page.getByText(arabicCopy.errors.onlyPngJpg, { exact: true })).toBeVisible()
    await expect(page.getByTestId('editor-controls')).toHaveCount(0)
    const png = await sharp({ create: { width: 3000, height: 1500, channels: 3, background: '#d64769' } }).png().toBuffer()
    const maxBytes = 10 * 1024 * 1024
    const oversized = Buffer.alloc(maxBytes + 1)
    png.copy(oversized)
    await input.setInputFiles({ name: 'oversized.png', mimeType: 'image/png', buffer: oversized })
    await expect(page.getByText(arabicCopy.errors.fileTooLarge10, { exact: true })).toBeVisible()
    await expect(page.getByTestId('editor-controls')).toHaveCount(0)
    const atLimit = Buffer.alloc(maxBytes)
    png.copy(atLimit)
    await input.setInputFiles({ name: 'at-limit.png', mimeType: 'image/png', buffer: atLimit })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    await expect(page.locator('#pixel-size-slider')).toHaveValue('1')
    await expect(page.getByText(arabicCopy.errors.fileTooLarge10, { exact: true })).toHaveCount(0)
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    await downloadArabicResult(page, 'resized-boundary.png', [2200, 1100])
  })
}

test('Arabic batch language switch retains article and restores reading direction', async ({ page }) => {
  const post = arabicPosts[4]
  await page.goto(`/ar/blog/${post.slug}/`)
  await rejectArabicCookies(page)
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await page.locator('#language-switcher').selectOption('en')
  await expect.poll(() => new URL(page.url()).pathname.replace(/\/$/, '')).toBe(`/blog/${post.slug}`)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org/blog/${post.slug}/`)
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org/blog/${post.slug}/`)
  await page.goBack()
  await expect(page).toHaveTitle(`${post.seoTitle} | Pixel Art Village`)
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar')
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org/ar/blog/${post.slug}/`)
})

const swedishPosts = Object.values(JSON.parse(readFileSync(new URL('../src/content/blog-posts.sv.json', import.meta.url), 'utf8')))
const swedishCopy = JSON.parse(readFileSync(new URL('../public/locales/sv/translation.json', import.meta.url), 'utf8'))
const swedishFacts = [
  ['Pixelkonstverktyg', 'inte av ett oberoende testinstitut', 'inte jämfört de fyra verktygens bildkvalitet', '10 485 760 byte', 'över 2200 pixlar'],
  ['Foto till pixelkonst i SNES-stil', 'inte ett maskinvaruläge', '120×95', '80×63', 'inte en färggräns för SNES', 'samma session', 'Syns motivets kontur?', 'manuellt ordnade färgblock'],
  ['förbättra pixelkonst', 'återställer inte förlorade detaljer', 'tre separata tunna horisontella linjer', 'ändrar inte färgerna i dessa fasta paletter', 'slumpmässig initialisering'],
  ['exportera PNG från Illustrator', 'inte utfört exporten i Illustrator', '256×256', '512×512', '300×200', '600×400', 'inte en konvertering av den stora', 'inte att Adobe exporterat källan'],
  ['pixelera en bild', '10 485 760 byte', 'inte ett Resize-reglage', swedishCopy.editor.downloadBtn, 'vänta tills den nya förhandsvisningen faktiskt visas'],
]

async function rejectSwedishCookies(page) {
  if (process.env.EXPECT_CONSENT_BANNER === '1') {
    const banner = page.getByRole('region', { name: swedishCopy.consent.bannerLabel, exact: true })
    await expect(banner).toContainText('Vi använder cookies')
    await banner.getByRole('button', { name: swedishCopy.consent.rejectLabel, exact: true }).click()
    await expect(banner).toHaveCount(0)
  }
}

async function downloadSwedishResult(page, filename, dimensions, maxColors, publishedBytes) {
  return downloadNorwegianResult(page, filename, dimensions, maxColors, publishedBytes, swedishCopy.editor.downloadBtn)
}

for (const javaScriptEnabled of [false, true]) {
  test.describe(`Swedish batch ${javaScriptEnabled ? 'runtime' : 'initial HTML'}`, () => {
    test.use({ javaScriptEnabled })
    for (const width of [1440, 390, 320]) {
      for (const [index, post] of swedishPosts.entries()) {
        test(`${width}px ${post.slug}`, async ({ page, request }) => {
          await page.setViewportSize({ width, height: width <= 390 ? 844 : 1000 })
          expect((await page.goto('/sv/blog/')).status()).toBe(200)
          if (javaScriptEnabled) await rejectSwedishCookies(page)
          const route = `/sv/blog/${post.slug}/`
          const title = `${post.seoTitle} | Pixel Art Village`
          await expect(page.locator('main .blog-simple-card').getByRole('link', { name: 'Läs artikeln', exact: true })).toHaveCount(5)
          const entry = page.getByRole('link', { name: post.title, exact: true })
          await expect(entry).toHaveAttribute('href', route)
          await entry.click()
          const article = page.locator('.blog-article-prose')
          const assertArticle = async () => {
            expect([...title].length).toBeGreaterThanOrEqual(55)
            expect([...title].length).toBeLessThanOrEqual(60)
            expect([...post.excerpt].length).toBeLessThanOrEqual(155)
            await expect(page).toHaveTitle(title)
            await expect(page.locator('html')).toHaveAttribute('lang', 'sv')
            await expect(article).toHaveCSS('direction', 'ltr')
            await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title)
            await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
            await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org${route}`)
            await expect(page.locator('link[hreflang="sv"]')).toHaveAttribute('href', `https://pixelartvillage.org${route}`)
            await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0)
            for (const key of ['description', 'og:description', 'twitter:description']) {
              await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', post.excerpt)
            }
            for (const key of ['og:title', 'twitter:title']) await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', title)
            await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://pixelartvillage.org${route}`)
            for (const key of ['og:image', 'twitter:image']) {
              await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', `https://pixelartvillage.org${post.socialPreview.image}`)
              await expect(page.locator(`meta[name="${key}:alt"],meta[property="${key}:alt"]`)).toHaveAttribute('content', post.socialPreview.alt)
            }
            await expect(article).not.toContainText(italianForbidden)
            await expect(page.locator('main')).not.toContainText(/min read|Related Articles|Back to Blog|Source image|Pixel art result|## FAQ|__PH_\d+__|\[object Object\]/)
            await expect(page.locator('main')).toContainText('Uppdaterad: 2026-10-12')
            const backLinks = page.locator('main').getByRole('link', { name: 'Tillbaka till bloggen', exact: true })
            await expect(backLinks).toHaveCount(2)
            for (const link of await backLinks.all()) await expect(link).toHaveAttribute('href', '/sv/blog/')
            await expect(page.locator('main a[rel="author"]')).toHaveAttribute('href', '/sv/about/')
            for (const fact of swedishFacts[index]) await expect(article).toContainText(fact)
            if ([2, 4].includes(index)) {
              await expect(article).toContainText('Original size, 2× original eller 4× original kan linjer följa med i exporten')
              await expect(article).toContainText('minst 2 pixlar bred och hög')
              await expect(article).toContainText('Vid Pixel size är varje ruta 1×1 pixel och inga rutnätslinjer ritas')
              await expect(article).toContainText('Stäng av Visa rutnät före nedladdning')
              await expect(article).not.toContainText('lägger inte linjer i exportfilen')
              await expect(article).not.toContainText('rutnätet är en visningshjälp, inte bildinnehåll')
            }
            await expect(article.getByRole('heading', { name: 'Vanliga frågor', exact: true })).toBeVisible()
            if ([1, 2, 4].includes(index)) {
              await expect(article).toContainText(swedishCopy.adjustments.autoPalette)
              await expect(article).toContainText('Högsta antal färger i genererad palett')
              await expect(article).toContainText(swedishCopy.adjustments.dither)
            }
            if (index === 3) expect(await article.locator('a[href^="https://helpx.adobe.com/"]').count()).toBe(3)
            const schema = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.flatMap(node => JSON.parse(node.textContent)))
            expect(schema.find(item => item['@type'] === 'BlogPosting')).toMatchObject({
              headline: post.title, description: post.excerpt, inLanguage: 'sv', datePublished: post.date, dateModified: '2026-10-12',
              mainEntityOfPage: `https://pixelartvillage.org${route}`, author: { name: 'Pixel Art Village', url: 'https://pixelartvillage.org/sv/about/' }, image: `https://pixelartvillage.org${post.socialPreview.image}`,
            })
            expect(schema.find(item => item['@type'] === 'BreadcrumbList').itemListElement.at(-1)).toMatchObject({ name: post.title, item: `https://pixelartvillage.org${route}` })
            const faq = schema.find(item => item['@type'] === 'FAQPage')
            expect(faq.mainEntity).toHaveLength(index === 3 ? 4 : 3)
            for (const question of faq.mainEntity) {
              await expect(article.getByRole('heading', { name: question.name, exact: true })).toBeVisible()
              await expect(article).toContainText(question.acceptedAnswer.text)
            }
            const headings = await article.locator('h2,h3,h4').evaluateAll(nodes => nodes.map(node => Number(node.tagName[1])))
            expect(headings[0]).toBe(2)
            expect(headings.every((level, i) => i === 0 || level <= headings[i - 1] + 1)).toBe(true)
            await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
          }
          await assertArticle()
          await page.reload()
          await assertArticle()
          const figures = post.body.filter(block => block.type === 'figure')
          await expect(article.locator('figure')).toHaveCount(figures.length)
          let enlargedCaptured = false
          for (const figure of figures) {
            const element = article.locator(`figure:has(img[src="${figure.src}"])`)
            const img = element.locator('img')
            await img.scrollIntoViewIfNeeded()
            await img.evaluate(image => image.decode())
            await expect.poll(() => img.evaluate(image => [image.naturalWidth, image.naturalHeight])).toEqual([figure.width, figure.height])
            await expect(img).toHaveAttribute('alt', figure.alt)
            await expect(element.locator('figcaption')).toContainText(figure.caption)
            if (figure.width < 512) {
              expect(figure.pixelated, 'Small teaching examples must not regress to native-size thumbnails').toBe(true)
              await expect(img).toHaveCSS('image-rendering', 'pixelated')
              const displayWidth = await img.evaluate(image => image.getBoundingClientRect().width)
              const availableWidth = await element.evaluate(node => node.getBoundingClientRect().width)
              expect(displayWidth).toBeCloseTo(Math.min(384, availableWidth), 0)
              expect(displayWidth).toBeGreaterThan(figure.width)
              if (javaScriptEnabled && !enlargedCaptured) {
                await test.info().attach(`swedish-enlarged-${index}-${width}`, { body: await element.screenshot(), contentType: 'image/png' })
                enlargedCaptured = true
              }
            }
            const response = await request.get(figure.src)
            expect(response.status()).toBe(200)
            const bytes = await response.body()
            const metadata = await sharp(bytes).metadata()
            expect([metadata.width, metadata.height]).toEqual([figure.width, figure.height])
            const [download] = await Promise.all([page.waitForEvent('download'), element.getByRole('link', { name: figure.downloadLabel, exact: true }).click()])
            const path = test.info().outputPath(figure.src.split('/').pop())
            await download.saveAs(path)
            expect(readFileSync(path).equals(bytes)).toBe(true)
          }
          const cover = page.getByRole('region', { name: post.presentation.coverLabel, exact: true })
          await cover.scrollIntoViewIfNeeded()
          await cover.locator('img').evaluateAll(async images => { for (const image of images) await image.decode() })
          await expect(cover.locator('figcaption')).toHaveText([post.presentation.sourceLabel, post.presentation.resultLabel])
          if (post.comparison) {
            const table = page.getByRole('table')
            await expect(table.locator('tbody tr')).toHaveCount(4)
            await expect(table).toHaveCSS('text-align', 'left')
            for (const [rowIndex, row] of post.comparison.rows.entries()) {
              const tableRow = table.locator('tbody tr').nth(rowIndex)
              await expect(tableRow.locator('th')).toHaveText(row[0])
              await expect(tableRow.locator('td')).toHaveText(row.slice(1).map((cell, column) => `${post.comparison.columns[column + 1]}: ${cell}`))
            }
          }
          if (javaScriptEnabled) {
            await test.info().attach(`swedish-cover-${index}-${width}`, { body: await cover.screenshot(), contentType: 'image/png' })
            await test.info().attach(`swedish-page-${index}-${width}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' })
          }
          for (const href of await article.locator('a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')).filter(href => href.startsWith('/')))) {
            expect(href, 'Pages stay Swedish; resources retain actual paths').toMatch(/^\/sv\/|^\/(photo-|tutorials\/)/)
            expect((await request.get(href)).status(), href).toBe(200)
          }
          if (javaScriptEnabled) {
            const sibling = swedishPosts.find(item => item.slug !== post.slug && post.body.some(block => typeof block === 'string' && block.includes(`/blog/${item.slug}/`)))
            await article.locator(`a[href="/sv/blog/${sibling.slug}/"]`).first().click()
            await expect(page).toHaveTitle(`${sibling.seoTitle} | Pixel Art Village`)
            await page.goBack()
            await assertArticle()
          }
        })
      }
    }
  })
}

for (const post of swedishPosts) {
  test(`Swedish batch sharing PNG ${post.slug}`, async ({ request }) => {
    const response = await request.get(post.socialPreview.image)
    expect(response.status()).toBe(200)
    const bytes = await response.body()
    const metadata = await sharp(bytes).metadata()
    expect([metadata.format, metadata.width, metadata.height]).toEqual(['png', 1200, 630])
    expect(bytes.length).toBeLessThan(1000000)
    const result = await request.get(post.cover.after)
    expect(result.status()).toBe(200)
    const resized = await sharp(await result.body()).resize(441, 350, { fit: 'contain', kernel: 'nearest', background: '#f8fafc' }).png().toBuffer()
    const expected = await sharp(resized).flatten({ background: '#f8fafc' }).ensureAlpha().raw().toBuffer()
    const actual = await sharp(bytes).extract({ left: 660, top: 182, width: 441, height: 350 }).ensureAlpha().raw().toBuffer()
    expect(actual.equals(expected)).toBe(true)
    await test.info().attach('swedish-sharing-image', { body: bytes, contentType: 'image/png' })
  })
}

for (const width of [1440, 320]) {
  for (const granted of [false, true]) {
    test(`Swedish batch consent ${width}px ${granted ? 'accept' : 'reject'} persists after reload`, async ({ page }) => {
      test.skip(process.env.EXPECT_CONSENT_BANNER !== '1', 'Requires the real production-style consent banner')
      await page.setViewportSize({ width, height: 844 })
      await page.goto('/sv/blog/export-from-illustrator-image-to-pixel-art/')
      const banner = page.getByRole('region', { name: swedishCopy.consent.bannerLabel, exact: true })
      await expect(banner).toContainText('Vi använder cookies')
      await expect(banner.getByRole('link', { name: swedishCopy.consent.privacy, exact: true })).toHaveAttribute('href', '/sv/privacy/')
      await banner.getByRole('button', { name: granted ? swedishCopy.consent.acceptLabel : swedishCopy.consent.rejectLabel, exact: true }).click()
      await expect(banner).toHaveCount(0)
      expect(await page.evaluate(() => JSON.parse(localStorage.getItem('consent.choice.v1')).granted)).toBe(granted)
      await page.reload()
      await expect(banner).toHaveCount(0)
      await expect(page.locator('html')).toHaveAttribute('lang', 'sv')
      expect(await page.evaluate(() => JSON.parse(localStorage.getItem('consent.choice.v1')).granted)).toBe(granted)
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    })
  }
}

for (const width of [1440, 390]) {
  test(`Swedish batch tool ${width}px grid export and preview-only zoom`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/sv/')
    await rejectSwedishCookies(page)
    const source = await request.get('/tutorials/illustrator-png-ko/size-512.png')
    expect(source.status()).toBe(200)
    await page.getByTestId('file-input').setInputFiles({ name: 'grid-source.png', mimeType: 'image/png', buffer: await source.body() })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    for (let size = 2; size <= 8; size++) {
      await waitForIndonesianResult(page, () => page.locator('#pixel-size-slider').press('ArrowRight'))
    }
    await expect(page.locator('#grid-toggle')).not.toBeChecked()
    await expect(page.locator('#format-select')).toHaveValue('png')

    const captureExport = async (filename, dimensions) => {
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByRole('button', { name: swedishCopy.editor.downloadBtn, exact: true }).last().click(),
      ])
      const path = test.info().outputPath(filename)
      await download.saveAs(path)
      const { data, info } = await sharp(readFileSync(path)).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
      expect([info.width, info.height]).toEqual(dimensions)
      return data
    }
    const modes = [
      ['Pixel size', 64], ['Original size', 512], ['2× original', 1024], ['4× original', 2048],
    ]
    for (const [label, edge] of modes) {
      await page.getByRole('button', { name: label, exact: true }).click()
      await page.locator('#grid-toggle').uncheck()
      const plain = await captureExport(`${edge}-grid-off.png`, [edge, edge])
      if (label === 'Original size') {
        await page.locator('#zoom-slider').press('ArrowRight')
        const zoomed = await captureExport('source-zoomed.png', [edge, edge])
        expect(zoomed.equals(plain), 'Preview zoom must not alter exported pixels or dimensions').toBe(true)
      }
      await page.locator('#grid-toggle').check()
      const gridded = await captureExport(`${edge}-grid-on.png`, [edge, edge])
      if (label === 'Pixel size') {
        expect(gridded.equals(plain), 'One-pixel cells do not draw export grid lines').toBe(true)
      } else {
        expect(gridded.equals(plain), 'Expanded export must include enabled grid lines').toBe(false)
        const cell = edge / 64
        const pixelAt = (pixels, x, y) => [...pixels.subarray((y * edge + x) * 4, (y * edge + x + 1) * 4)]
        const middle = cell / 2
        expect(pixelAt(gridded, cell, middle), 'A grid boundary changes the downloaded image').not.toEqual(pixelAt(plain, cell, middle))
        expect(pixelAt(gridded, middle, middle), 'Grid lines do not alter the cell interior').toEqual(pixelAt(plain, middle, middle))
      }
    }
  })

  test(`Swedish batch tool ${width}px size and palette workflow`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/sv/')
    await rejectSwedishCookies(page)
    const source = await request.get('/photo-sunflower-source.jpg')
    expect(source.status()).toBe(200)
    await page.getByTestId('file-input').setInputFiles({ name: 'sunflower.jpg', mimeType: 'image/jpeg', buffer: await source.body() })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    const note = page.getByText(swedishCopy.adjustments.palette.note, { exact: true })
    await expect(note).toContainText('Sunset 8, Twilight 5 och Hollow är fasta paletter')
    await expect(note).not.toContainText('palettpalettfärger')
    await expect(page.getByLabel(swedishCopy.adjustments.autoPalette, { exact: true })).toBeVisible()
    await page.locator('#palette-select').selectOption('none')
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    for (let size = 2; size <= 12; size++) {
      await waitForIndonesianResult(page, () => page.locator('#pixel-size-slider').press('ArrowRight'))
      if ([8, 12].includes(size)) {
        const published = await request.get(size === 8 ? '/tutorials/pixel-art-ko/sunflower-pixel8.png' : '/photo-sunflower-pixel12.png')
        expect(published.status()).toBe(200)
        await downloadSwedishResult(page, `sunflower-pixel${size}.png`, size === 8 ? [120, 95] : [80, 63], null, await published.body())
      }
    }
    await waitForIndonesianResult(page, () => page.locator('#auto-palette').check())
    await expect(page.getByLabel('Högsta antal färger i genererad palett: 16', { exact: true })).toBeVisible()
    for (let colors = 17; colors <= 24; colors++) await waitForIndonesianResult(page, () => page.locator('#palette-size').press('ArrowRight'))
    const plain = await downloadSwedishResult(page, 'colors24.png', [80, 63], 24)
    await waitForIndonesianResult(page, () => page.locator('#dither').check())
    const dithered = await downloadSwedishResult(page, 'colors24-dither.png', [80, 63], 24)
    expect(dithered.equals(plain)).toBe(false)
    await waitForIndonesianResult(page, () => page.locator('#auto-palette').uncheck())
    await waitForIndonesianResult(page, () => page.locator('#palette-select').selectOption('Sunset 8'))
    await expect(page.locator('#palette-size')).toHaveCount(0)
    await downloadSwedishResult(page, 'fixed-sunset8.png', [80, 63], 8)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await test.info().attach(`swedish-controls-${width}`, { body: await page.getByTestId('editor-controls').screenshot(), contentType: 'image/png' })
  })

  test(`Swedish batch tool ${width}px thin-line reference downloads`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/sv/')
    await rejectSwedishCookies(page)
    const source = await request.get('/tutorials/illustrator-png-ko/size-512.png')
    expect(source.status()).toBe(200)
    await page.getByTestId('file-input').setInputFiles({ name: 'lines.png', mimeType: 'image/png', buffer: await source.body() })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    await expect(page.locator('#palette-select')).toHaveValue('none')
    await expect(page.locator('#auto-palette')).not.toBeChecked()
    await expect(page.locator('#dither')).not.toBeChecked()
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    for (let size = 2; size <= 16; size++) {
      await waitForIndonesianResult(page, () => page.locator('#pixel-size-slider').press('ArrowRight'))
      if (![4, 16].includes(size)) continue
      const published = await request.get(`/tutorials/pixel-art-ar/lines-pixel${size}.png`)
      expect(published.status()).toBe(200)
      const dimension = 512 / size
      const raw = await downloadSwedishResult(page, `lines-pixel${size}.png`, [dimension, dimension], null, await published.body())
      let bands = 0
      let inBand = false
      for (let y = Math.floor(365 / size); y < Math.ceil(420 / size); y++) {
        const dark = raw[(y * dimension + dimension / 2) * 4] < 220
        if (dark && !inBand) bands++
        inBand = dark
      }
      expect(bands).toBe(size === 4 ? 3 : 1)
    }
  })

  test(`Swedish batch tool ${width}px transparent import and download`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/sv/')
    await rejectSwedishCookies(page)
    const source = await request.get('/tutorials/illustrator-png-ko/size-512.png')
    expect(source.status()).toBe(200)
    await page.getByTestId('file-input').setInputFiles({ name: 'browser-demo.png', mimeType: 'image/png', buffer: await source.body() })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    await page.locator('#palette-select').selectOption('none')
    for (let size = 2; size <= 8; size++) await waitForIndonesianResult(page, () => page.locator('#pixel-size-slider').press('ArrowRight'))
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    await expect(page.getByLabel(swedishCopy.export.transparent.label, { exact: true })).toBeChecked()
    const published = await request.get('/tutorials/pixel-art-id/illustrator-pixel8.png')
    expect(published.status()).toBe(200)
    const raw = await downloadSwedishResult(page, 'converted-transparent.png', [64, 64], null, await published.body())
    const alpha = []
    for (let i = 3; i < raw.length; i += 4) alpha.push(raw[i])
    expect(alpha).toContain(0)
    expect(alpha).toContain(255)
    expect(alpha.some(value => value > 0 && value < 255)).toBe(true)
  })

  test(`Swedish batch tool ${width}px invalid input, limits and recovery`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/sv/')
    await rejectSwedishCookies(page)
    const input = page.getByTestId('file-input')
    await input.setInputFiles({ name: 'invalid.txt', mimeType: 'text/plain', buffer: Buffer.from('Test input, not a public case study') })
    await expect(page.getByText(swedishCopy.errors.onlyPngJpg, { exact: true })).toBeVisible()
    await expect(page.getByTestId('editor-controls')).toHaveCount(0)
    const png = await sharp({ create: { width: 3000, height: 1500, channels: 3, background: '#d64769' } }).png().toBuffer()
    const maxBytes = 10 * 1024 * 1024
    const overLimit = Buffer.alloc(maxBytes + 1)
    png.copy(overLimit)
    await input.setInputFiles({ name: 'oversized.png', mimeType: 'image/png', buffer: overLimit })
    await expect(page.getByText(swedishCopy.errors.fileTooLarge10, { exact: true })).toBeVisible()
    await expect(page.getByTestId('editor-controls')).toHaveCount(0)
    const atLimit = Buffer.alloc(maxBytes)
    png.copy(atLimit)
    await input.setInputFiles({ name: 'at-limit.png', mimeType: 'image/png', buffer: atLimit })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    await expect(page.locator('#pixel-size-slider')).toHaveValue('1')
    await expect(page.getByText(swedishCopy.errors.fileTooLarge10, { exact: true })).toHaveCount(0)
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    await downloadSwedishResult(page, 'resized-boundary.png', [2200, 1100])
  })
}

test('Swedish batch language switch retains article and returns to Swedish', async ({ page }) => {
  const post = swedishPosts[4]
  await page.goto(`/sv/blog/${post.slug}/`)
  await rejectSwedishCookies(page)
  await page.locator('#language-switcher').selectOption('en')
  await expect.poll(() => new URL(page.url()).pathname.replace(/\/$/, '')).toBe(`/blog/${post.slug}`)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org/blog/${post.slug}/`)
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await page.goBack()
  await expect(page).toHaveTitle(`${post.seoTitle} | Pixel Art Village`)
  await expect(page.locator('html')).toHaveAttribute('lang', 'sv')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org/sv/blog/${post.slug}/`)
})

const thaiPosts = Object.values(JSON.parse(readFileSync(new URL('../src/content/blog-posts.th.json', import.meta.url), 'utf8')))
const thaiCopy = JSON.parse(readFileSync(new URL('../public/locales/th/translation.json', import.meta.url), 'utf8'))
const thaiFacts = [
  ['เครื่องมือพิกเซลอาร์ต', 'ไม่ใช่สถาบันทดสอบอิสระ', 'ไม่ได้ทดสอบภาพเดียวกันในทั้งสี่เครื่องมือ', '10 485 760 ไบต์', 'เกิน 2200 พิกเซล'],
  ['แปลงภาพถ่ายเป็นพิกเซลอาร์ตสไตล์ SNES', 'ไม่ใช่โหมดฮาร์ดแวร์', '120×95', '80×63', 'เลข 24 ไม่ใช่ขีดจำกัดสี', 'รอบเดียวกัน', 'ยังเห็นขอบรูปทรงหรือไม่', 'จัดบล็อกสีด้วยมือ'],
  ['ปรับภาพพิกเซลอาร์ต', 'ไม่กู้รายละเอียดที่สูญหาย', 'เส้นแนวนอนบางสามเส้นแยกกัน', 'ตัวเลื่อนจำนวนสีไม่เปลี่ยนสีของจานสีคงที่', 'เริ่มต้นแบบสุ่ม'],
  ['ส่งออก PNG จาก Illustrator', 'เราไม่ได้ส่งออกจริงใน Illustrator', '256×256', '512×512', '300×200', '600×400', 'ไฟล์เล็กไม่ได้แปลงจากไฟล์ใหญ่', 'ไม่ได้ยืนยันว่า Adobe ส่งออกต้นฉบับ'],
  ['ทำภาพเป็นพิกเซลอาร์ต', '10 485 760 ไบต์', 'ไม่ใช่ตัวเลื่อน Resize', thaiCopy.editor.downloadBtn, 'รอภาพตัวอย่างใหม่จริง'],
]

async function rejectThaiCookies(page) {
  if (process.env.EXPECT_CONSENT_BANNER === '1') {
    const banner = page.getByRole('region', { name: thaiCopy.consent.bannerLabel, exact: true })
    await expect(banner).toContainText('เราใช้คุกกี้')
    await banner.getByRole('button', { name: thaiCopy.consent.rejectLabel, exact: true }).click()
    await expect(banner).toHaveCount(0)
  }
}

async function downloadThaiResult(page, filename, dimensions, maxColors, publishedBytes) {
  return downloadNorwegianResult(page, filename, dimensions, maxColors, publishedBytes, thaiCopy.editor.downloadBtn)
}

for (const javaScriptEnabled of [false, true]) {
  test.describe(`Thai batch ${javaScriptEnabled ? 'runtime' : 'initial HTML'}`, () => {
    test.use({ javaScriptEnabled })
    for (const width of [1440, 390, 320]) {
      for (const [index, post] of thaiPosts.entries()) {
        test(`${width}px ${post.slug}`, async ({ page, request }) => {
          await page.setViewportSize({ width, height: width <= 390 ? 844 : 1000 })
          expect((await page.goto('/th/blog/')).status()).toBe(200)
          if (javaScriptEnabled) await rejectThaiCookies(page)
          const route = `/th/blog/${post.slug}/`
          const title = `${post.seoTitle} | Pixel Art Village`
          await expect(page.locator('main .blog-simple-card').getByRole('link', { name: 'อ่านบทความ', exact: true })).toHaveCount(5)
          const entry = page.getByRole('link', { name: post.title, exact: true })
          await expect(entry).toHaveAttribute('href', route)
          await entry.click()
          const article = page.locator('.blog-article-prose')
          const assertArticle = async () => {
            expect([...title].length).toBeGreaterThanOrEqual(55)
            expect([...title].length).toBeLessThanOrEqual(60)
            expect([...post.excerpt].length).toBeLessThanOrEqual(155)
            await expect(page).toHaveTitle(title)
            await expect(page.locator('html')).toHaveAttribute('lang', 'th')
            await expect(article).toHaveCSS('direction', 'ltr')
            await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title)
            await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
            await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org${route}`)
            await expect(page.locator('link[hreflang="th"]')).toHaveAttribute('href', `https://pixelartvillage.org${route}`)
            await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0)
            for (const key of ['description', 'og:description', 'twitter:description']) {
              await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', post.excerpt)
            }
            for (const key of ['og:title', 'twitter:title']) await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', title)
            await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://pixelartvillage.org${route}`)
            for (const key of ['og:image', 'twitter:image']) {
              await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', `https://pixelartvillage.org${post.socialPreview.image}`)
              await expect(page.locator(`meta[name="${key}:alt"],meta[property="${key}:alt"]`)).toHaveAttribute('content', post.socialPreview.alt)
            }
            await expect(article).not.toContainText(italianForbidden)
            await expect(page.locator('main')).not.toContainText(/min read|Related Articles|Back to Blog|Source image|Pixel art result|## FAQ|__PH_\d+__|\[object Object\]/)
            await expect(page.locator('main')).toContainText('อัปเดต: 2026-10-12')
            const backLinks = page.locator('main').getByRole('link', { name: 'กลับไปที่บล็อก', exact: true })
            await expect(backLinks).toHaveCount(2)
            for (const link of await backLinks.all()) await expect(link).toHaveAttribute('href', '/th/blog/')
            await expect(page.locator('main a[rel="author"]')).toHaveAttribute('href', '/th/about/')
            for (const fact of thaiFacts[index]) await expect(article).toContainText(fact)
            if ([2, 4].includes(index)) {
              await expect(article).toContainText('Original size, 2× original หรือ 4× original เส้นตารางอาจติดไปกับไฟล์')
              await expect(article).toContainText('กว้างและสูงอย่างน้อย 2 พิกเซล')
              await expect(article).toContainText('เมื่อเลือก Pixel size แต่ละช่องมีขนาด 1×1 พิกเซล จึงไม่วาดเส้นตาราง')
              await expect(article).toContainText('ปิด แสดงตาราง ก่อนดาวน์โหลด')
              await expect(article).not.toContainText('เส้นตารางไม่มีทางติดไปกับไฟล์')
              await expect(article).not.toContainText('ตารางใช้แสดงผลเท่านั้น ไม่เป็นเนื้อหาภาพ')
            }
            await expect(article.getByRole('heading', { name: 'คำถามที่พบบ่อย', exact: true })).toBeVisible()
            if ([1, 2, 4].includes(index)) {
              await expect(article).toContainText(thaiCopy.adjustments.autoPalette)
              await expect(article).toContainText('จำนวนสีสูงสุดในจานสีที่สร้าง')
              await expect(article).toContainText(thaiCopy.adjustments.dither)
            }
            if (index === 3) expect(await article.locator('a[href^="https://helpx.adobe.com/"]').count()).toBe(3)
            const schema = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.flatMap(node => JSON.parse(node.textContent)))
            expect(schema.find(item => item['@type'] === 'BlogPosting')).toMatchObject({
              headline: post.title, description: post.excerpt, inLanguage: 'th', datePublished: post.date, dateModified: '2026-10-12',
              mainEntityOfPage: `https://pixelartvillage.org${route}`, author: { name: 'Pixel Art Village', url: 'https://pixelartvillage.org/th/about/' }, image: `https://pixelartvillage.org${post.socialPreview.image}`,
            })
            expect(schema.find(item => item['@type'] === 'BreadcrumbList').itemListElement.at(-1)).toMatchObject({ name: post.title, item: `https://pixelartvillage.org${route}` })
            const faq = schema.find(item => item['@type'] === 'FAQPage')
            expect(faq.mainEntity).toHaveLength(index === 3 ? 4 : 3)
            for (const question of faq.mainEntity) {
              await expect(article.getByRole('heading', { name: question.name, exact: true })).toBeVisible()
              await expect(article).toContainText(question.acceptedAnswer.text)
            }
            const headings = await article.locator('h2,h3,h4').evaluateAll(nodes => nodes.map(node => Number(node.tagName[1])))
            expect(headings[0]).toBe(2)
            expect(headings.every((level, i) => i === 0 || level <= headings[i - 1] + 1)).toBe(true)
            await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
          }
          await assertArticle()
          await page.reload()
          await assertArticle()
          const figures = post.body.filter(block => block.type === 'figure')
          await expect(article.locator('figure')).toHaveCount(figures.length)
          let enlargedCaptured = false
          for (const figure of figures) {
            const element = article.locator(`figure:has(img[src="${figure.src}"])`)
            const img = element.locator('img')
            await img.scrollIntoViewIfNeeded()
            await img.evaluate(image => image.decode())
            await expect.poll(() => img.evaluate(image => [image.naturalWidth, image.naturalHeight])).toEqual([figure.width, figure.height])
            await expect(img).toHaveAttribute('alt', figure.alt)
            await expect(element.locator('figcaption')).toContainText(figure.caption)
            if (figure.width < 512) {
              expect(figure.pixelated, 'Small teaching examples must not regress to native-size thumbnails').toBe(true)
              await expect(img).toHaveCSS('image-rendering', 'pixelated')
              const displayWidth = await img.evaluate(image => image.getBoundingClientRect().width)
              const availableWidth = await element.evaluate(node => node.getBoundingClientRect().width)
              expect(displayWidth).toBeCloseTo(Math.min(384, availableWidth), 0)
              expect(displayWidth).toBeGreaterThan(figure.width)
              if (javaScriptEnabled && !enlargedCaptured) {
                await test.info().attach(`thai-enlarged-${index}-${width}`, { body: await element.screenshot(), contentType: 'image/png' })
                enlargedCaptured = true
              }
            }
            const response = await request.get(figure.src)
            expect(response.status()).toBe(200)
            const bytes = await response.body()
            const metadata = await sharp(bytes).metadata()
            expect([metadata.width, metadata.height]).toEqual([figure.width, figure.height])
            const [download] = await Promise.all([page.waitForEvent('download'), element.getByRole('link', { name: figure.downloadLabel, exact: true }).click()])
            const path = test.info().outputPath(figure.src.split('/').pop())
            await download.saveAs(path)
            expect(readFileSync(path).equals(bytes)).toBe(true)
          }
          const cover = page.getByRole('region', { name: post.presentation.coverLabel, exact: true })
          await cover.scrollIntoViewIfNeeded()
          await cover.locator('img').evaluateAll(async images => { for (const image of images) await image.decode() })
          await expect(cover.locator('figcaption')).toHaveText([post.presentation.sourceLabel, post.presentation.resultLabel])
          if (post.comparison) {
            const table = page.getByRole('table')
            await expect(table.locator('tbody tr')).toHaveCount(4)
            await expect(table).toHaveCSS('text-align', 'left')
            for (const [rowIndex, row] of post.comparison.rows.entries()) {
              const tableRow = table.locator('tbody tr').nth(rowIndex)
              await expect(tableRow.locator('th')).toHaveText(row[0])
              await expect(tableRow.locator('td')).toHaveText(row.slice(1).map((cell, column) => `${post.comparison.columns[column + 1]}: ${cell}`))
            }
          }
          if (javaScriptEnabled) {
            await test.info().attach(`thai-cover-${index}-${width}`, { body: await cover.screenshot(), contentType: 'image/png' })
            await test.info().attach(`thai-page-${index}-${width}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' })
          }
          for (const href of await article.locator('a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')).filter(href => href.startsWith('/')))) {
            expect(href, 'Pages stay Thai; resources retain actual paths').toMatch(/^\/th\/|^\/(photo-|tutorials\/)/)
            expect((await request.get(href)).status(), href).toBe(200)
          }
          if (javaScriptEnabled) {
            const sibling = thaiPosts.find(item => item.slug !== post.slug && post.body.some(block => typeof block === 'string' && block.includes(`/blog/${item.slug}/`)))
            await article.locator(`a[href="/th/blog/${sibling.slug}/"]`).first().click()
            await expect(page).toHaveTitle(`${sibling.seoTitle} | Pixel Art Village`)
            await page.goBack()
            await assertArticle()
          }
        })
      }
    }
  })
}

for (const post of thaiPosts) {
  test(`Thai batch sharing PNG ${post.slug}`, async ({ request }) => {
    const response = await request.get(post.socialPreview.image)
    expect(response.status()).toBe(200)
    const bytes = await response.body()
    const metadata = await sharp(bytes).metadata()
    expect([metadata.format, metadata.width, metadata.height]).toEqual(['png', 1200, 630])
    expect(bytes.length).toBeLessThan(1000000)
    const result = await request.get(post.cover.after)
    expect(result.status()).toBe(200)
    const resized = await sharp(await result.body()).resize(441, 350, { fit: 'contain', kernel: 'nearest', background: '#f8fafc' }).png().toBuffer()
    const expected = await sharp(resized).flatten({ background: '#f8fafc' }).ensureAlpha().raw().toBuffer()
    const actual = await sharp(bytes).extract({ left: 660, top: 182, width: 441, height: 350 }).ensureAlpha().raw().toBuffer()
    expect(actual.equals(expected)).toBe(true)
    await test.info().attach('thai-sharing-image', { body: bytes, contentType: 'image/png' })
  })
}

for (const width of [1440, 320]) {
  for (const granted of [false, true]) {
    test(`Thai batch consent ${width}px ${granted ? 'accept' : 'reject'} persists after reload`, async ({ page }) => {
      test.skip(process.env.EXPECT_CONSENT_BANNER !== '1', 'Requires the real production-style consent banner')
      await page.setViewportSize({ width, height: 844 })
      await page.goto('/th/blog/export-from-illustrator-image-to-pixel-art/')
      const banner = page.getByRole('region', { name: thaiCopy.consent.bannerLabel, exact: true })
      await expect(banner).toContainText('เราใช้คุกกี้')
      await expect(banner.getByRole('link', { name: thaiCopy.consent.privacy, exact: true })).toHaveAttribute('href', '/th/privacy/')
      await banner.getByRole('button', { name: granted ? thaiCopy.consent.acceptLabel : thaiCopy.consent.rejectLabel, exact: true }).click()
      await expect(banner).toHaveCount(0)
      expect(await page.evaluate(() => JSON.parse(localStorage.getItem('consent.choice.v1')).granted)).toBe(granted)
      await page.reload()
      await expect(banner).toHaveCount(0)
      await expect(page.locator('html')).toHaveAttribute('lang', 'th')
      expect(await page.evaluate(() => JSON.parse(localStorage.getItem('consent.choice.v1')).granted)).toBe(granted)
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    })
  }
}

for (const width of [1440, 390]) {
  test(`Thai batch tool ${width}px grid export and preview-only zoom`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/th/')
    await rejectThaiCookies(page)
    const source = await request.get('/tutorials/illustrator-png-ko/size-512.png')
    expect(source.status()).toBe(200)
    await page.getByTestId('file-input').setInputFiles({ name: 'grid-source.png', mimeType: 'image/png', buffer: await source.body() })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    for (let size = 2; size <= 8; size++) {
      await waitForIndonesianResult(page, () => page.locator('#pixel-size-slider').press('ArrowRight'))
    }
    await expect(page.locator('#grid-toggle')).not.toBeChecked()
    await expect(page.locator('#format-select')).toHaveValue('png')

    const captureExport = async (filename, dimensions) => {
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByRole('button', { name: thaiCopy.editor.downloadBtn, exact: true }).last().click(),
      ])
      const path = test.info().outputPath(filename)
      await download.saveAs(path)
      const { data, info } = await sharp(readFileSync(path)).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
      expect([info.width, info.height]).toEqual(dimensions)
      return data
    }
    const modes = [
      ['Pixel size', 64], ['Original size', 512], ['2× original', 1024], ['4× original', 2048],
    ]
    for (const [label, edge] of modes) {
      await page.getByRole('button', { name: label, exact: true }).click()
      await page.locator('#grid-toggle').uncheck()
      const plain = await captureExport(`${edge}-grid-off.png`, [edge, edge])
      if (label === 'Original size') {
        await page.locator('#zoom-slider').press('ArrowRight')
        const zoomed = await captureExport('source-zoomed.png', [edge, edge])
        expect(zoomed.equals(plain), 'Preview zoom must not alter exported pixels or dimensions').toBe(true)
      }
      await page.locator('#grid-toggle').check()
      const gridded = await captureExport(`${edge}-grid-on.png`, [edge, edge])
      if (label === 'Pixel size') {
        expect(gridded.equals(plain), 'One-pixel cells do not draw export grid lines').toBe(true)
      } else {
        expect(gridded.equals(plain), 'Expanded export must include enabled grid lines').toBe(false)
        const cell = edge / 64
        const pixelAt = (pixels, x, y) => [...pixels.subarray((y * edge + x) * 4, (y * edge + x + 1) * 4)]
        const middle = cell / 2
        expect(pixelAt(gridded, cell, middle), 'A grid boundary changes the downloaded image').not.toEqual(pixelAt(plain, cell, middle))
        expect(pixelAt(gridded, middle, middle), 'Grid lines do not alter the cell interior').toEqual(pixelAt(plain, middle, middle))
      }
    }
  })

  test(`Thai batch tool ${width}px size and palette workflow`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/th/')
    await rejectThaiCookies(page)
    const source = await request.get('/photo-sunflower-source.jpg')
    expect(source.status()).toBe(200)
    await page.getByTestId('file-input').setInputFiles({ name: 'sunflower.jpg', mimeType: 'image/jpeg', buffer: await source.body() })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    const note = page.getByText(thaiCopy.adjustments.palette.note, { exact: true })
    await expect(note).toContainText('Sunset 8, Twilight 5 และ Hollow เป็นจานสีคงที่')
    await expect(note).not.toContainText('# จานสี จานสี')
    await expect(page.getByLabel(thaiCopy.adjustments.autoPalette, { exact: true })).toBeVisible()
    await page.locator('#palette-select').selectOption('none')
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    for (let size = 2; size <= 12; size++) {
      await waitForIndonesianResult(page, () => page.locator('#pixel-size-slider').press('ArrowRight'))
      if ([8, 12].includes(size)) {
        const published = await request.get(size === 8 ? '/tutorials/pixel-art-ko/sunflower-pixel8.png' : '/photo-sunflower-pixel12.png')
        expect(published.status()).toBe(200)
        await downloadThaiResult(page, `sunflower-pixel${size}.png`, size === 8 ? [120, 95] : [80, 63], null, await published.body())
      }
    }
    await waitForIndonesianResult(page, () => page.locator('#auto-palette').check())
    await expect(page.getByLabel('จำนวนสีสูงสุดในจานสีที่สร้าง: 16', { exact: true })).toBeVisible()
    for (let colors = 17; colors <= 24; colors++) await waitForIndonesianResult(page, () => page.locator('#palette-size').press('ArrowRight'))
    const plain = await downloadThaiResult(page, 'colors24.png', [80, 63], 24)
    await waitForIndonesianResult(page, () => page.locator('#dither').check())
    const dithered = await downloadThaiResult(page, 'colors24-dither.png', [80, 63], 24)
    expect(dithered.equals(plain)).toBe(false)
    await waitForIndonesianResult(page, () => page.locator('#auto-palette').uncheck())
    await waitForIndonesianResult(page, () => page.locator('#palette-select').selectOption('Sunset 8'))
    await expect(page.locator('#palette-size')).toHaveCount(0)
    await downloadThaiResult(page, 'fixed-sunset8.png', [80, 63], 8)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await test.info().attach(`thai-controls-${width}`, { body: await page.getByTestId('editor-controls').screenshot(), contentType: 'image/png' })
  })

  test(`Thai batch tool ${width}px thin-line reference downloads`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/th/')
    await rejectThaiCookies(page)
    const source = await request.get('/tutorials/illustrator-png-ko/size-512.png')
    expect(source.status()).toBe(200)
    await page.getByTestId('file-input').setInputFiles({ name: 'lines.png', mimeType: 'image/png', buffer: await source.body() })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    await expect(page.locator('#palette-select')).toHaveValue('none')
    await expect(page.locator('#auto-palette')).not.toBeChecked()
    await expect(page.locator('#dither')).not.toBeChecked()
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    for (let size = 2; size <= 16; size++) {
      await waitForIndonesianResult(page, () => page.locator('#pixel-size-slider').press('ArrowRight'))
      if (![4, 16].includes(size)) continue
      const published = await request.get(`/tutorials/pixel-art-ar/lines-pixel${size}.png`)
      expect(published.status()).toBe(200)
      const dimension = 512 / size
      const raw = await downloadThaiResult(page, `lines-pixel${size}.png`, [dimension, dimension], null, await published.body())
      let bands = 0
      let inBand = false
      for (let y = Math.floor(365 / size); y < Math.ceil(420 / size); y++) {
        const dark = raw[(y * dimension + dimension / 2) * 4] < 220
        if (dark && !inBand) bands++
        inBand = dark
      }
      expect(bands).toBe(size === 4 ? 3 : 1)
    }
  })

  test(`Thai batch tool ${width}px transparent import and download`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/th/')
    await rejectThaiCookies(page)
    const source = await request.get('/tutorials/illustrator-png-ko/size-512.png')
    expect(source.status()).toBe(200)
    await page.getByTestId('file-input').setInputFiles({ name: 'browser-demo.png', mimeType: 'image/png', buffer: await source.body() })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    await page.locator('#palette-select').selectOption('none')
    for (let size = 2; size <= 8; size++) await waitForIndonesianResult(page, () => page.locator('#pixel-size-slider').press('ArrowRight'))
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    await expect(page.getByLabel(thaiCopy.export.transparent.label, { exact: true })).toBeChecked()
    const published = await request.get('/tutorials/pixel-art-id/illustrator-pixel8.png')
    expect(published.status()).toBe(200)
    const raw = await downloadThaiResult(page, 'converted-transparent.png', [64, 64], null, await published.body())
    const alpha = []
    for (let i = 3; i < raw.length; i += 4) alpha.push(raw[i])
    expect(alpha).toContain(0)
    expect(alpha).toContain(255)
    expect(alpha.some(value => value > 0 && value < 255)).toBe(true)
  })

  test(`Thai batch tool ${width}px invalid input, limits and recovery`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/th/')
    await rejectThaiCookies(page)
    const input = page.getByTestId('file-input')
    await input.setInputFiles({ name: 'invalid.txt', mimeType: 'text/plain', buffer: Buffer.from('Test input, not a public case study') })
    await expect(page.getByText(thaiCopy.errors.onlyPngJpg, { exact: true })).toBeVisible()
    await expect(page.getByTestId('editor-controls')).toHaveCount(0)
    const png = await sharp({ create: { width: 3000, height: 1500, channels: 3, background: '#d64769' } }).png().toBuffer()
    const maxBytes = 10 * 1024 * 1024
    const overLimit = Buffer.alloc(maxBytes + 1)
    png.copy(overLimit)
    await input.setInputFiles({ name: 'oversized.png', mimeType: 'image/png', buffer: overLimit })
    await expect(page.getByText(thaiCopy.errors.fileTooLarge10, { exact: true })).toBeVisible()
    await expect(page.getByTestId('editor-controls')).toHaveCount(0)
    const atLimit = Buffer.alloc(maxBytes)
    png.copy(atLimit)
    await input.setInputFiles({ name: 'at-limit.png', mimeType: 'image/png', buffer: atLimit })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    await expect(page.locator('#pixel-size-slider')).toHaveValue('1')
    await expect(page.getByText(thaiCopy.errors.fileTooLarge10, { exact: true })).toHaveCount(0)
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    await downloadThaiResult(page, 'resized-boundary.png', [2200, 1100])
  })
}

test('Thai batch language switch retains article and returns to Thai', async ({ page }) => {
  const post = thaiPosts[4]
  await page.goto(`/th/blog/${post.slug}/`)
  await rejectThaiCookies(page)
  await page.locator('#language-switcher').selectOption('en')
  await expect.poll(() => new URL(page.url()).pathname.replace(/\/$/, '')).toBe(`/blog/${post.slug}`)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org/blog/${post.slug}/`)
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await page.goBack()
  await expect(page).toHaveTitle(`${post.seoTitle} | Pixel Art Village`)
  await expect(page.locator('html')).toHaveAttribute('lang', 'th')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org/th/blog/${post.slug}/`)
})

const vietnamesePosts = Object.values(JSON.parse(readFileSync(new URL('../src/content/blog-posts.vi.json', import.meta.url), 'utf8')))
const vietnameseCopy = JSON.parse(readFileSync(new URL('../public/locales/vi/translation.json', import.meta.url), 'utf8'))
const vietnameseFacts = [
  [
    "Công cụ pixel art",
    "không phải đơn vị kiểm thử độc lập",
    "chưa so sánh chất lượng ảnh của cả bốn công cụ",
    "10 485 760 byte",
    "trên 2200 pixel"
  ],
  [
    "Ảnh sang pixel art phong cách SNES",
    "không phải chế độ phần cứng SNES",
    "120×95",
    "80×63",
    "24 không phải giới hạn màu",
    "cùng phiên",
    "Đường viền chủ thể còn rõ không?",
    "sắp xếp khối màu thủ công"
  ],
  [
    "Cải thiện pixel art",
    "không khôi phục chi tiết đã mất",
    "ba nét ngang mảnh tách biệt",
    "không thay đổi các màu trong bảng màu cố định",
    "khởi tạo ngẫu nhiên"
  ],
  [
    "Xuất PNG từ Illustrator",
    "chưa thực hiện xuất trong Illustrator",
    "256×256",
    "512×512",
    "300×200",
    "600×400",
    "Tệp nhỏ không phải chuyển đổi từ tệp lớn",
    "không chứng minh Adobe đã xuất nguồn"
  ],
  [
    "Pixel hóa ảnh",
    "10 485 760 byte",
    "không phải thanh Resize",
    "Tải xuống hình ảnh pixel",
    "đợi bản xem trước mới thực sự hiển thị"
  ]
]

async function rejectVietnameseCookies(page) {
  if (process.env.EXPECT_CONSENT_BANNER === '1') {
    const banner = page.getByRole('region', { name: vietnameseCopy.consent.bannerLabel, exact: true })
    await expect(banner).toContainText('We use cookies')
    await banner.getByRole('button', { name: vietnameseCopy.consent.rejectLabel, exact: true }).click()
    await expect(banner).toHaveCount(0)
  }
}

async function downloadVietnameseResult(page, filename, dimensions, maxColors, publishedBytes) {
  return downloadNorwegianResult(page, filename, dimensions, maxColors, publishedBytes, vietnameseCopy.editor.downloadBtn)
}

for (const javaScriptEnabled of [false, true]) {
  test.describe(`Vietnamese batch ${javaScriptEnabled ? 'runtime' : 'initial HTML'}`, () => {
    test.use({ javaScriptEnabled })
    for (const width of [1440, 390, 320]) {
      for (const [index, post] of vietnamesePosts.entries()) {
        test(`${width}px ${post.slug}`, async ({ page, request }) => {
          await page.setViewportSize({ width, height: width <= 390 ? 844 : 1000 })
          expect((await page.goto('/vi/blog/')).status()).toBe(200)
          if (javaScriptEnabled) await rejectVietnameseCookies(page)
          await expect(page.getByRole('heading', { level: 1 })).toHaveText(`${vietnameseCopy.blog.title} — ${vietnameseCopy.blog.h1}`)
          await expect(page.locator('main')).toContainText(vietnameseCopy.blog.subtitle)
          await expect(page.locator('main')).not.toContainText('Articles and updates about pixel art')
          const route = `/vi/blog/${post.slug}/`
          const title = `${post.seoTitle} | Pixel Art Village`
          await expect(page.locator('main .blog-simple-card').getByRole('link', { name: 'Đọc bài viết', exact: true })).toHaveCount(5)
          const entry = page.getByRole('link', { name: post.title, exact: true })
          await expect(entry).toHaveAttribute('href', route)
          await entry.click()
          const article = page.locator('.blog-article-prose')
          const assertArticle = async () => {
            expect([...title].length).toBeGreaterThanOrEqual(55)
            expect([...title].length).toBeLessThanOrEqual(60)
            expect([...post.excerpt].length).toBeLessThanOrEqual(155)
            await expect(page).toHaveTitle(title)
            await expect(page.locator('html')).toHaveAttribute('lang', 'vi')
            await expect(article).toHaveCSS('direction', 'ltr')
            await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title)
            await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
            await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org${route}`)
            await expect(page.locator('link[hreflang="vi"]')).toHaveAttribute('href', `https://pixelartvillage.org${route}`)
            await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0)
            for (const key of ['description', 'og:description', 'twitter:description']) {
              await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', post.excerpt)
            }
            for (const key of ['og:title', 'twitter:title']) await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', title)
            await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `https://pixelartvillage.org${route}`)
            for (const key of ['og:image', 'twitter:image']) {
              await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', `https://pixelartvillage.org${post.socialPreview.image}`)
              await expect(page.locator(`meta[name="${key}:alt"],meta[property="${key}:alt"]`)).toHaveAttribute('content', post.socialPreview.alt)
            }
            await expect(article).not.toContainText(italianForbidden)
            await expect(page.locator('main')).not.toContainText(/min read|Related Articles|Back to Blog|Source image|Pixel art result|## FAQ|__PH_\d+__|\[object Object\]/)
            await expect(page.locator('main')).toContainText('Cập nhật: 2026-10-12')
            const backLinks = page.locator('main').getByRole('link', { name: 'Quay lại blog', exact: true })
            await expect(backLinks).toHaveCount(2)
            for (const link of await backLinks.all()) await expect(link).toHaveAttribute('href', '/vi/blog/')
            await expect(page.locator('main a[rel="author"]')).toHaveAttribute('href', '/vi/about/')
            for (const fact of vietnameseFacts[index]) await expect(article).toContainText(fact)
            if ([2, 4].includes(index)) {
              await expect(article).toContainText('Original size, 2× original hoặc 4× original có thể xuất kèm đường lưới')
              await expect(article).toContainText('rộng và cao ít nhất 2 pixel')
              await expect(article).toContainText('Ở Pixel size, mỗi ô là 1×1 pixel và không vẽ đường lưới')
              await expect(article).toContainText('Tắt Hiển thị lưới trước khi tải')
              await expect(article).not.toContainText('lưới không bao giờ được xuất')
              await expect(article).not.toContainText('lưới chỉ hiển thị, không có trong tệp')
            }
            await expect(article.getByRole('heading', { name: 'Câu hỏi thường gặp', exact: true })).toBeVisible()
            if ([1, 2, 4].includes(index)) {
              await expect(article).toContainText(vietnameseCopy.adjustments.autoPalette)
              await expect(article).toContainText('Số màu tối đa trong bảng màu tự tạo')
              await expect(article).toContainText(vietnameseCopy.adjustments.dither)
            }
            if (index === 3) expect(await article.locator('a[href^="https://helpx.adobe.com/"]').count()).toBe(3)
            const schema = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.flatMap(node => JSON.parse(node.textContent)))
            expect(schema.find(item => item['@type'] === 'BlogPosting')).toMatchObject({
              headline: post.title, description: post.excerpt, inLanguage: 'vi', datePublished: post.date, dateModified: '2026-10-12',
              mainEntityOfPage: `https://pixelartvillage.org${route}`, author: { name: 'Pixel Art Village', url: 'https://pixelartvillage.org/vi/about/' }, image: `https://pixelartvillage.org${post.socialPreview.image}`,
            })
            expect(schema.find(item => item['@type'] === 'BreadcrumbList').itemListElement.at(-1)).toMatchObject({ name: post.title, item: `https://pixelartvillage.org${route}` })
            const faq = schema.find(item => item['@type'] === 'FAQPage')
            expect(faq.mainEntity).toHaveLength(index === 3 ? 4 : 3)
            for (const question of faq.mainEntity) {
              await expect(article.getByRole('heading', { name: question.name, exact: true })).toBeVisible()
              await expect(article).toContainText(question.acceptedAnswer.text)
            }
            const headings = await article.locator('h2,h3,h4').evaluateAll(nodes => nodes.map(node => Number(node.tagName[1])))
            expect(headings[0]).toBe(2)
            expect(headings.every((level, i) => i === 0 || level <= headings[i - 1] + 1)).toBe(true)
            await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
          }
          await assertArticle()
          await page.reload()
          await assertArticle()
          const figures = post.body.filter(block => block.type === 'figure')
          await expect(article.locator('figure')).toHaveCount(figures.length)
          let enlargedCaptured = false
          for (const figure of figures) {
            const element = article.locator(`figure:has(img[src="${figure.src}"])`)
            const img = element.locator('img')
            await img.scrollIntoViewIfNeeded()
            await img.evaluate(image => image.decode())
            await expect.poll(() => img.evaluate(image => [image.naturalWidth, image.naturalHeight])).toEqual([figure.width, figure.height])
            await expect(img).toHaveAttribute('alt', figure.alt)
            await expect(element.locator('figcaption')).toContainText(figure.caption)
            if (figure.width < 512) {
              expect(figure.pixelated, 'Small teaching examples must not regress to native-size thumbnails').toBe(true)
              await expect(img).toHaveCSS('image-rendering', 'pixelated')
              const displayWidth = await img.evaluate(image => image.getBoundingClientRect().width)
              const availableWidth = await element.evaluate(node => node.getBoundingClientRect().width)
              expect(displayWidth).toBeCloseTo(Math.min(384, availableWidth), 0)
              expect(displayWidth).toBeGreaterThan(figure.width)
              if (javaScriptEnabled && !enlargedCaptured) {
                await test.info().attach(`vietnamese-enlarged-${index}-${width}`, { body: await element.screenshot(), contentType: 'image/png' })
                enlargedCaptured = true
              }
            }
            const response = await request.get(figure.src)
            expect(response.status()).toBe(200)
            const bytes = await response.body()
            const metadata = await sharp(bytes).metadata()
            expect([metadata.width, metadata.height]).toEqual([figure.width, figure.height])
            const [download] = await Promise.all([page.waitForEvent('download'), element.getByRole('link', { name: figure.downloadLabel, exact: true }).click()])
            const path = test.info().outputPath(figure.src.split('/').pop())
            await download.saveAs(path)
            expect(readFileSync(path).equals(bytes)).toBe(true)
          }
          const cover = page.getByRole('region', { name: post.presentation.coverLabel, exact: true })
          await cover.scrollIntoViewIfNeeded()
          await cover.locator('img').evaluateAll(async images => { for (const image of images) await image.decode() })
          await expect(cover.locator('figcaption')).toHaveText([post.presentation.sourceLabel, post.presentation.resultLabel])
          if (post.comparison) {
            const table = page.getByRole('table')
            await expect(table.locator('tbody tr')).toHaveCount(4)
            await expect(table).toHaveCSS('text-align', 'left')
            for (const [rowIndex, row] of post.comparison.rows.entries()) {
              const tableRow = table.locator('tbody tr').nth(rowIndex)
              await expect(tableRow.locator('th')).toHaveText(row[0])
              await expect(tableRow.locator('td')).toHaveText(row.slice(1).map((cell, column) => `${post.comparison.columns[column + 1]}: ${cell}`))
            }
          }
          if (javaScriptEnabled) {
            await test.info().attach(`vietnamese-cover-${index}-${width}`, { body: await cover.screenshot(), contentType: 'image/png' })
            await test.info().attach(`vietnamese-page-${index}-${width}`, { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' })
          }
          for (const href of await article.locator('a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')).filter(href => href.startsWith('/')))) {
            expect(href, 'Pages stay Vietnamese; resources retain actual paths').toMatch(/^\/vi\/|^\/(photo-|tutorials\/)/)
            expect((await request.get(href)).status(), href).toBe(200)
          }
          if (javaScriptEnabled) {
            const sibling = vietnamesePosts.find(item => item.slug !== post.slug && post.body.some(block => typeof block === 'string' && block.includes(`/blog/${item.slug}/`)))
            await article.locator(`a[href="/vi/blog/${sibling.slug}/"]`).first().click()
            await expect(page).toHaveTitle(`${sibling.seoTitle} | Pixel Art Village`)
            await page.goBack()
            await assertArticle()
          }
        })
      }
    }
  })
}

for (const post of vietnamesePosts) {
  test(`Vietnamese batch sharing PNG ${post.slug}`, async ({ request }) => {
    const response = await request.get(post.socialPreview.image)
    expect(response.status()).toBe(200)
    const bytes = await response.body()
    const metadata = await sharp(bytes).metadata()
    expect([metadata.format, metadata.width, metadata.height]).toEqual(['png', 1200, 630])
    expect(bytes.length).toBeLessThan(1000000)
    const result = await request.get(post.cover.after)
    expect(result.status()).toBe(200)
    const resized = await sharp(await result.body()).resize(441, 350, { fit: 'contain', kernel: 'nearest', background: '#f8fafc' }).png().toBuffer()
    const expected = await sharp(resized).flatten({ background: '#f8fafc' }).ensureAlpha().raw().toBuffer()
    const actual = await sharp(bytes).extract({ left: 660, top: 182, width: 441, height: 350 }).ensureAlpha().raw().toBuffer()
    expect(actual.equals(expected)).toBe(true)
    await test.info().attach('vietnamese-sharing-image', { body: bytes, contentType: 'image/png' })
  })
}

for (const width of [1440, 320]) {
  for (const granted of [false, true]) {
    test(`Vietnamese batch consent ${width}px ${granted ? 'accept' : 'reject'} persists after reload`, async ({ page }) => {
      test.skip(process.env.EXPECT_CONSENT_BANNER !== '1', 'Requires the real production-style consent banner')
      await page.setViewportSize({ width, height: 844 })
      await page.goto('/vi/blog/export-from-illustrator-image-to-pixel-art/')
      const banner = page.getByRole('region', { name: vietnameseCopy.consent.bannerLabel, exact: true })
      await expect(banner).toContainText('We use cookies')
      await expect(banner.getByRole('link', { name: vietnameseCopy.consent.privacy, exact: true })).toHaveAttribute('href', '/vi/privacy/')
      await banner.getByRole('button', { name: granted ? vietnameseCopy.consent.acceptLabel : vietnameseCopy.consent.rejectLabel, exact: true }).click()
      await expect(banner).toHaveCount(0)
      expect(await page.evaluate(() => JSON.parse(localStorage.getItem('consent.choice.v1')).granted)).toBe(granted)
      await page.reload()
      await expect(banner).toHaveCount(0)
      await expect(page.locator('html')).toHaveAttribute('lang', 'vi')
      expect(await page.evaluate(() => JSON.parse(localStorage.getItem('consent.choice.v1')).granted)).toBe(granted)
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    })
  }
}

for (const width of [1440, 390]) {
  test(`Vietnamese batch tool ${width}px grid export and preview-only zoom`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/vi/')
    await rejectVietnameseCookies(page)
    const source = await request.get('/tutorials/illustrator-png-ko/size-512.png')
    expect(source.status()).toBe(200)
    await page.getByTestId('file-input').setInputFiles({ name: 'grid-source.png', mimeType: 'image/png', buffer: await source.body() })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    for (let size = 2; size <= 8; size++) {
      await waitForIndonesianResult(page, () => page.locator('#pixel-size-slider').press('ArrowRight'))
    }
    await expect(page.locator('#grid-toggle')).not.toBeChecked()
    await expect(page.locator('#format-select')).toHaveValue('png')

    const captureExport = async (filename, dimensions) => {
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByRole('button', { name: vietnameseCopy.editor.downloadBtn, exact: true }).last().click(),
      ])
      const path = test.info().outputPath(filename)
      await download.saveAs(path)
      const { data, info } = await sharp(readFileSync(path)).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
      expect([info.width, info.height]).toEqual(dimensions)
      return data
    }
    const modes = [
      ['Pixel size', 64], ['Original size', 512], ['2× original', 1024], ['4× original', 2048],
    ]
    for (const [label, edge] of modes) {
      await page.getByRole('button', { name: label, exact: true }).click()
      await page.locator('#grid-toggle').uncheck()
      const plain = await captureExport(`${edge}-grid-off.png`, [edge, edge])
      if (label === 'Original size') {
        await page.locator('#zoom-slider').press('ArrowRight')
        const zoomed = await captureExport('source-zoomed.png', [edge, edge])
        expect(zoomed.equals(plain), 'Preview zoom must not alter exported pixels or dimensions').toBe(true)
      }
      await page.locator('#grid-toggle').check()
      const gridded = await captureExport(`${edge}-grid-on.png`, [edge, edge])
      if (label === 'Pixel size') {
        expect(gridded.equals(plain), 'One-pixel cells do not draw export grid lines').toBe(true)
      } else {
        expect(gridded.equals(plain), 'Expanded export must include enabled grid lines').toBe(false)
        const cell = edge / 64
        const pixelAt = (pixels, x, y) => [...pixels.subarray((y * edge + x) * 4, (y * edge + x + 1) * 4)]
        const middle = cell / 2
        expect(pixelAt(gridded, cell, middle), 'A grid boundary changes the downloaded image').not.toEqual(pixelAt(plain, cell, middle))
        expect(pixelAt(gridded, middle, middle), 'Grid lines do not alter the cell interior').toEqual(pixelAt(plain, middle, middle))
      }
    }
  })

  test(`Vietnamese batch tool ${width}px size and palette workflow`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/vi/')
    await rejectVietnameseCookies(page)
    const source = await request.get('/photo-sunflower-source.jpg')
    expect(source.status()).toBe(200)
    await page.getByTestId('file-input').setInputFiles({ name: 'sunflower.jpg', mimeType: 'image/jpeg', buffer: await source.body() })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    const note = page.getByText(vietnameseCopy.adjustments.palette.note, { exact: true })
    await expect(note).toContainText('Sunset 8, Twilight 5 và Hollow là bảng màu cố định')
    await expect(note).not.toContainText('# Bảng màu Bảng màu')
    await expect(page.getByLabel(vietnameseCopy.adjustments.autoPalette, { exact: true })).toBeVisible()
    await page.locator('#palette-select').selectOption('none')
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    for (let size = 2; size <= 12; size++) {
      await waitForIndonesianResult(page, () => page.locator('#pixel-size-slider').press('ArrowRight'))
      if ([8, 12].includes(size)) {
        const published = await request.get(size === 8 ? '/tutorials/pixel-art-ko/sunflower-pixel8.png' : '/photo-sunflower-pixel12.png')
        expect(published.status()).toBe(200)
        await downloadVietnameseResult(page, `sunflower-pixel${size}.png`, size === 8 ? [120, 95] : [80, 63], null, await published.body())
      }
    }
    await waitForIndonesianResult(page, () => page.locator('#auto-palette').check())
    await expect(page.getByLabel('Số màu tối đa trong bảng màu tự tạo: 16', { exact: true })).toBeVisible()
    for (let colors = 17; colors <= 24; colors++) await waitForIndonesianResult(page, () => page.locator('#palette-size').press('ArrowRight'))
    const plain = await downloadVietnameseResult(page, 'colors24.png', [80, 63], 24)
    await waitForIndonesianResult(page, () => page.locator('#dither').check())
    const dithered = await downloadVietnameseResult(page, 'colors24-dither.png', [80, 63], 24)
    expect(dithered.equals(plain)).toBe(false)
    await waitForIndonesianResult(page, () => page.locator('#auto-palette').uncheck())
    await waitForIndonesianResult(page, () => page.locator('#palette-select').selectOption('Sunset 8'))
    await expect(page.locator('#palette-size')).toHaveCount(0)
    await downloadVietnameseResult(page, 'fixed-sunset8.png', [80, 63], 8)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await test.info().attach(`vietnamese-controls-${width}`, { body: await page.getByTestId('editor-controls').screenshot(), contentType: 'image/png' })
  })

  test(`Vietnamese batch tool ${width}px thin-line reference downloads`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/vi/')
    await rejectVietnameseCookies(page)
    const source = await request.get('/tutorials/illustrator-png-ko/size-512.png')
    expect(source.status()).toBe(200)
    await page.getByTestId('file-input').setInputFiles({ name: 'lines.png', mimeType: 'image/png', buffer: await source.body() })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    await expect(page.locator('#palette-select')).toHaveValue('none')
    await expect(page.locator('#auto-palette')).not.toBeChecked()
    await expect(page.locator('#dither')).not.toBeChecked()
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    for (let size = 2; size <= 16; size++) {
      await waitForIndonesianResult(page, () => page.locator('#pixel-size-slider').press('ArrowRight'))
      if (![4, 16].includes(size)) continue
      const published = await request.get(`/tutorials/pixel-art-ar/lines-pixel${size}.png`)
      expect(published.status()).toBe(200)
      const dimension = 512 / size
      const raw = await downloadVietnameseResult(page, `lines-pixel${size}.png`, [dimension, dimension], null, await published.body())
      let bands = 0
      let inBand = false
      for (let y = Math.floor(365 / size); y < Math.ceil(420 / size); y++) {
        const dark = raw[(y * dimension + dimension / 2) * 4] < 220
        if (dark && !inBand) bands++
        inBand = dark
      }
      expect(bands).toBe(size === 4 ? 3 : 1)
    }
  })

  test(`Vietnamese batch tool ${width}px transparent import and download`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/vi/')
    await rejectVietnameseCookies(page)
    const source = await request.get('/tutorials/illustrator-png-ko/size-512.png')
    expect(source.status()).toBe(200)
    await page.getByTestId('file-input').setInputFiles({ name: 'browser-demo.png', mimeType: 'image/png', buffer: await source.body() })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    await page.locator('#palette-select').selectOption('none')
    for (let size = 2; size <= 8; size++) await waitForIndonesianResult(page, () => page.locator('#pixel-size-slider').press('ArrowRight'))
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    await expect(page.getByLabel(vietnameseCopy.export.transparent.label, { exact: true })).toBeChecked()
    const published = await request.get('/tutorials/pixel-art-id/illustrator-pixel8.png')
    expect(published.status()).toBe(200)
    const raw = await downloadVietnameseResult(page, 'converted-transparent.png', [64, 64], null, await published.body())
    const alpha = []
    for (let i = 3; i < raw.length; i += 4) alpha.push(raw[i])
    expect(alpha).toContain(0)
    expect(alpha).toContain(255)
    expect(alpha.some(value => value > 0 && value < 255)).toBe(true)
  })

  test(`Vietnamese batch tool ${width}px invalid input, limits and recovery`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/vi/')
    await rejectVietnameseCookies(page)
    const input = page.getByTestId('file-input')
    await input.setInputFiles({ name: 'invalid.txt', mimeType: 'text/plain', buffer: Buffer.from('Test input, not a public case study') })
    await expect(page.getByText(vietnameseCopy.errors.onlyPngJpg, { exact: true })).toBeVisible()
    await expect(page.getByTestId('editor-controls')).toHaveCount(0)
    const png = await sharp({ create: { width: 3000, height: 1500, channels: 3, background: '#d64769' } }).png().toBuffer()
    const maxBytes = 10 * 1024 * 1024
    const overLimit = Buffer.alloc(maxBytes + 1)
    png.copy(overLimit)
    await input.setInputFiles({ name: 'oversized.png', mimeType: 'image/png', buffer: overLimit })
    await expect(page.getByText(vietnameseCopy.errors.fileTooLarge10, { exact: true })).toBeVisible()
    await expect(page.getByTestId('editor-controls')).toHaveCount(0)
    const atLimit = Buffer.alloc(maxBytes)
    png.copy(atLimit)
    await input.setInputFiles({ name: 'at-limit.png', mimeType: 'image/png', buffer: atLimit })
    await expect(page.getByTestId('preview-container').locator('img')).toHaveAttribute('src', /^data:image\/png/)
    await expect(page.locator('#pixel-size-slider')).toHaveValue('1')
    await expect(page.getByText(vietnameseCopy.errors.fileTooLarge10, { exact: true })).toHaveCount(0)
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    await downloadVietnameseResult(page, 'resized-boundary.png', [2200, 1100])
  })
}

test('Vietnamese batch language switch retains article and returns to Vietnamese', async ({ page }) => {
  const post = vietnamesePosts[4]
  await page.goto(`/vi/blog/${post.slug}/`)
  await rejectVietnameseCookies(page)
  await page.locator('#language-switcher').selectOption('en')
  await expect.poll(() => new URL(page.url()).pathname.replace(/\/$/, '')).toBe(`/blog/${post.slug}`)
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org/blog/${post.slug}/`)
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await page.goBack()
  await expect(page).toHaveTitle(`${post.seoTitle} | Pixel Art Village`)
  await expect(page.locator('html')).toHaveAttribute('lang', 'vi')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org/vi/blog/${post.slug}/`)
})
