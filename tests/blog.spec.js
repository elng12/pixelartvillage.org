import { test, expect } from '@playwright/test'
import sharp from 'sharp'

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
