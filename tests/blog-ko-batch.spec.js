import { test, expect } from '@playwright/test'
import sharp from 'sharp'
import { readFileSync } from 'node:fs'

const content = JSON.parse(readFileSync(new URL('../src/content/blog-posts.ko.json', import.meta.url), 'utf8'))
const posts = ['0', '1', '2', '4'].map(key => content[key])
const forbidden = /Village Optimizer|SNES Refiner|Pixel Enhance|Palette Limiter Pro|VillageExportHub|Resize slider|Editor’s Choice|We tested 10/

for (const javaScriptEnabled of [false, true]) {
  test.describe(`Korean four-post batch ${javaScriptEnabled ? 'runtime' : 'initial HTML'}`, () => {
    test.use({ javaScriptEnabled })
    for (const width of [1440, 390, 320]) {
      for (const post of posts) {
        test(`${width}px ${post.slug}`, async ({ page, request }) => {
          await page.setViewportSize({ width, height: width <= 390 ? 844 : 1000 })
          expect((await page.goto('/ko/blog/')).status()).toBe(200)
          if (javaScriptEnabled && process.env.EXPECT_CONSENT_BANNER === '1') {
            await page.getByRole('button', { name: '필수적이지 않은 쿠키 거부', exact: true }).click()
          }
          const route = `/ko/blog/${post.slug}/`
          await page.getByRole('link', { name: post.title, exact: true }).click()
          const assertPage = async () => {
            const title = `${post.title} | Pixel Art Village`
            expect([...title].length).toBeGreaterThanOrEqual(55)
            expect([...title].length).toBeLessThanOrEqual(60)
            await expect(page).toHaveTitle(title)
            await expect(page.locator('html')).toHaveAttribute('lang', 'ko')
            await expect(page.getByRole('heading', { level: 1 })).toHaveText(post.title)
            await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
            await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org${route}`)
            await expect(page.locator('link[hreflang="ko"]')).toHaveAttribute('href', `https://pixelartvillage.org${route}`)
            await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0)
            for (const key of ['description', 'og:description', 'twitter:description']) {
              await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', post.excerpt)
            }
            for (const key of ['og:title', 'twitter:title']) {
              await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', title)
            }
            for (const key of ['og:image', 'twitter:image']) {
              await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', `https://pixelartvillage.org${post.socialPreview.image}`)
            }
            const article = page.locator('.blog-article-prose')
            await expect(article).not.toContainText(forbidden)
            await expect(page.locator('main')).not.toContainText(/min read|Related Articles|Back to Blog|\[object Object\]/)
            await expect(page.locator('main')).toContainText('수정: 2026-10-10')
            await expect(page.locator('a[rel="author"]')).toHaveAttribute('href', '/ko/about/')
            const schema = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.flatMap(node => JSON.parse(node.textContent)))
            const posting = schema.find(item => item['@type'] === 'BlogPosting')
            expect(posting.inLanguage).toBe('ko')
            expect(posting.datePublished).toBe(post.date)
            expect(posting.dateModified).toBe('2026-10-10')
            const faq = schema.find(item => item['@type'] === 'FAQPage')
            expect(faq.mainEntity).toHaveLength(3)
            for (const question of faq.mainEntity) {
              await expect(article.getByRole('heading', { name: question.name, exact: true })).toBeVisible()
              await expect(article).toContainText(question.acceptedAnswer.text)
            }
            await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
          }
          await assertPage()
          await page.reload()
          await assertPage()
          const article = page.locator('.blog-article-prose')
          for (const figure of post.body.filter(block => block.type === 'figure')) {
            const element = article.locator(`figure:has(img[src="${figure.src}"])`)
            const img = element.locator('img')
            await img.scrollIntoViewIfNeeded()
            await expect.poll(() => img.evaluate(node => [node.naturalWidth, node.naturalHeight])).toEqual([figure.width, figure.height])
            await expect(img).toHaveAttribute('width', String(figure.width))
            await expect(img).toHaveAttribute('height', String(figure.height))
            const asset = await request.get(figure.src)
            expect(asset.status()).toBe(200)
            const original = await asset.body()
            const [download] = await Promise.all([
              page.waitForEvent('download'), element.getByRole('link', { name: figure.downloadLabel, exact: true }).click(),
            ])
            const path = test.info().outputPath(figure.src.split('/').pop())
            await download.saveAs(path)
            expect(readFileSync(path).equals(original)).toBe(true)
          }
          for (const href of await article.locator('a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')).filter(href => href.startsWith('/')))) {
            expect(href, 'Internal link stays Korean or is an actual file').toMatch(/^\/ko\/|^\/(photo-|tutorials\/)/)
            expect((await request.get(href)).status(), href).toBe(200)
          }
          if (post.comparison) {
            await expect(page.getByRole('table').locator('tbody tr')).toHaveCount(4)
            await expect(article).toContainText('동일 사진으로 품질 순위를 매기지 않았습니다')
          }
          if (post.slug === 'how-to-get-pixel-art-version-of-image') {
            await expect(article).toContainText('SNES 전용 하드웨어 모드가 없으며')
            await expect(article).toContainText('120×95')
            await expect(article).toContainText('80×63')
          }
          if (javaScriptEnabled) {
            const sibling = posts.find(item => item.slug !== post.slug && post.body.some(block => typeof block === 'string' && block.includes(`/blog/${item.slug}/`)))
            await article.locator(`a[href="/ko/blog/${sibling.slug}/"]`).first().click()
            await expect(page).toHaveTitle(`${sibling.title} | Pixel Art Village`)
            await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org/ko/blog/${sibling.slug}/`)
            await page.goBack()
            await assertPage()
          }
        })
      }
    }
  })
}

for (const post of posts) {
  test(`Korean localized sharing PNG ${post.slug}`, async ({ request }) => {
    const response = await request.get(post.socialPreview.image)
    expect(response.status()).toBe(200)
    const bytes = await response.body()
    expect(bytes.length).toBeLessThan(1000000)
    const metadata = await sharp(bytes).metadata()
    expect([metadata.format, metadata.width, metadata.height]).toEqual(['png', 1200, 630])
  })
}

for (const width of [1440, 390]) {
  test(`Korean converter ${width}px reproduces published size and 24-color dithering examples`, async ({ page, request }) => {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('/ko/')
    if (process.env.EXPECT_CONSENT_BANNER === '1') {
      await page.getByRole('button', { name: '필수적이지 않은 쿠키 거부', exact: true }).click()
    }
    const input = page.getByTestId('file-input')
    await input.setInputFiles({ name: 'invalid.txt', mimeType: 'text/plain', buffer: Buffer.from('not an image') })
    await expect(page.getByTestId('editor-controls')).toHaveCount(0)
    const source = await request.get('/photo-sunflower-source.jpg')
    await input.setInputFiles({ name: 'sunflower.jpg', mimeType: 'image/jpeg', buffer: await source.body() })
    const preview = page.getByTestId('preview-container')
    const image = preview.locator('img')
    await expect(image).toHaveAttribute('src', /^data:image\/png/)
    await expect(page.getByTestId('editor-controls')).toContainText('Pico-8, Lost Century, Sunset 8, Twilight 5, Hollow는 내장된 고정 팔레트입니다.')
    await expect(page.getByTestId('editor-controls')).toContainText('색상 수 설정은 고정 팔레트의 색을 바꾸지 않습니다.')
    await expect(page.getByTestId('editor-controls')).not.toContainText(/__PH_0__|예: Sunset 8 →/)
    await page.locator('#palette-select').selectOption('none')
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    const change = async (selector, action) => {
      const previous = await image.getAttribute('src')
      await action(page.locator(selector))
      await expect(image).not.toHaveAttribute('src', previous)
      await expect(preview).toHaveAttribute('aria-busy', 'false')
    }
    const compare = async (filename, dimensions, maxColors) => {
      const [download] = await Promise.all([
        page.waitForEvent('download'), page.getByRole('button', { name: '픽셀 아트 이미지 다운로드', exact: true }).last().click(),
      ])
      const path = test.info().outputPath(filename)
      await download.saveAs(path)
      const png = sharp(path)
      const metadata = await png.metadata()
      expect([metadata.format, metadata.width, metadata.height]).toEqual(['png', ...dimensions])
      const published = await request.get(`/tutorials/pixel-art-ko/${filename}`)
      expect(published.status()).toBe(200)
      const actual = await png.raw().toBuffer()
      const matchesPreview = await page.evaluate(async ([downloadUrl, previewUrl]) => {
        const images = await Promise.all([downloadUrl, previewUrl].map(async src => {
          const image = new Image()
          image.src = src
          await image.decode()
          return image
        }))
        const [download, preview] = images
        const pixels = image => {
          const canvas = document.createElement('canvas')
          canvas.width = preview.naturalWidth
          canvas.height = preview.naturalHeight
          const context = canvas.getContext('2d')
          context.imageSmoothingEnabled = false
          context.drawImage(image, 0, 0, canvas.width, canvas.height)
          return context.getImageData(0, 0, canvas.width, canvas.height).data
        }
        const expected = pixels(download)
        return pixels(preview).every((value, index) => value === expected[index])
      }, [`data:image/png;base64,${readFileSync(path).toString('base64')}`, await image.getAttribute('src')])
      expect(matchesPreview, 'Downloaded grid recreates the newly displayed preview').toBe(true)
      // Automatic palette initialization is random; only unquantized output is reproducible pixel for pixel.
      if (!maxColors) expect(actual.equals(await sharp(await published.body()).raw().toBuffer())).toBe(true)
      if (maxColors) {
        const { data, info } = await png.removeAlpha().raw().toBuffer({ resolveWithObject: true })
        const colors = new Set()
        for (let i = 0; i < data.length; i += info.channels) colors.add(`${data[i]},${data[i + 1]},${data[i + 2]}`)
        expect(colors.size).toBeLessThanOrEqual(maxColors)
        expect(colors.size).toBeGreaterThan(1)
      }
      return actual
    }
    for (let size = 2; size <= 12; size++) {
      await change('#pixel-size-slider', locator => locator.press('ArrowRight'))
      if (size === 8) await compare('sunflower-pixel8.png', [120, 95])
    }
    await change('#auto-palette', locator => locator.check())
    for (let colors = 17; colors <= 24; colors++) await change('#palette-size', locator => locator.press('ArrowRight'))
    const withoutDither = await compare('sunflower-pixel12-colors24.png', [80, 63], 24)
    await change('#dither', locator => locator.check())
    const withDither = await compare('sunflower-pixel12-colors24-dither.png', [80, 63], 24)
    expect(withDither.equals(withoutDither)).toBe(false)
  })
}
