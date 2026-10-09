import { test, expect } from '@playwright/test'
import sharp from 'sharp'

const route = '/ko/blog/export-from-illustrator-image-to-pixel-art/'
const title = '일러스트레이터 PNG 내보내기: 픽셀 크기와 투명 배경 설정 가이드'
const seoTitle = `${title} | Pixel Art Village`
const image = '/blog-og/ko/export-from-illustrator-image-to-pixel-art.png'
const description = '일러스트레이터 PNG 내보내기에서 픽셀 크기, 아트보드 범위, 앤티 앨리어싱과 투명 배경을 확인하세요. Adobe 공식 문서에 따른 설정 안내와 내려받을 수 있는 크기 비교 예제를 제공합니다.'

for (const javaScriptEnabled of [false, true]) {
  test.describe(`Korean Illustrator ${javaScriptEnabled ? 'runtime' : 'initial HTML'}`, () => {
    test.use({ javaScriptEnabled })
    for (const width of [1440, 390, 320]) {
      test(`${width}px localized export guide and downloads`, async ({ page, request }) => {
        await page.setViewportSize({ width, height: width <= 390 ? 844 : 900 })
        expect((await page.goto('/ko/blog/')).status()).toBe(200)
        if (javaScriptEnabled && process.env.EXPECT_CONSENT_BANNER === '1') {
          await page.getByRole('button', { name: '필수적이지 않은 쿠키 거부', exact: true }).click()
        }
        await page.getByRole('link', { name: title, exact: true }).click()
        const assertArticle = async () => {
          await expect(page).toHaveTitle(seoTitle)
          expect([...seoTitle]).toHaveLength(57)
          await expect(page.locator('html')).toHaveAttribute('lang', 'ko')
          await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
          await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
          await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org${route}`)
          for (const key of ['description', 'og:description', 'twitter:description']) {
            await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', description)
          }
          for (const key of ['og:title', 'twitter:title']) {
            await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', seoTitle)
          }
          for (const key of ['og:image', 'twitter:image']) {
            await expect(page.locator(`meta[name="${key}"],meta[property="${key}"]`)).toHaveAttribute('content', `https://pixelartvillage.org${image}`)
          }
          await expect(page.locator('link[hreflang="ko"]')).toHaveAttribute('href', `https://pixelartvillage.org${route}`)
          await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0)
          const article = page.locator('.blog-article-prose')
          await expect(article).toContainText('Illustrator 앱에서 직접 내보내기를 실행한 검증은 하지 않았습니다')
          await expect(article).toContainText('앤티 앨리어싱 옵션별 Illustrator 결과를 비교한 실험은 아닙니다')
          await expect(article).toContainText('무조건 끄지 말고')
          await expect(article).not.toContainText(/Integrated Village Optimizer|Optimized PNG|batch exports|Canva|VillageExports|Resize slider|gallery integration/)
          await expect(page.locator('main')).not.toContainText(/min read|Related Articles|Source image|Pixel art result|\[object Object\]/)
          await expect(page.locator('main')).toContainText('수정: 2026-10-09')
          const author = page.locator('main a[rel="author"]')
          await expect(author).toHaveText('Pixel Art Village')
          await expect(author).toHaveAttribute('href', '/ko/about/')
          const schema = await page.locator('script[type="application/ld+json"]').evaluateAll(nodes => nodes.flatMap(node => JSON.parse(node.textContent)))
          const posting = schema.find(item => item['@type'] === 'BlogPosting')
          expect(posting.inLanguage).toBe('ko')
          expect(posting.datePublished).toBe('2025-10-09')
          expect(posting.dateModified).toBe('2026-10-09')
          expect(posting.author.url).toBe('https://pixelartvillage.org/ko/about/')
          const faq = schema.find(item => item['@type'] === 'FAQPage')
          expect(faq.mainEntity).toHaveLength(4)
          for (const question of faq.mainEntity) {
            await expect(article.getByRole('heading', { name: question.name, exact: true })).toBeVisible()
            await expect(article).toContainText(question.acceptedAnswer.text)
          }
        }
        await assertArticle()
        await page.reload()
        await assertArticle()
        const article = page.locator('.blog-article-prose')
        await expect(article.locator('figure')).toHaveCount(2)
        for (const size of [512, 64]) {
          const figure = article.locator(`figure:has(img[src="/tutorials/illustrator-png-ko/size-${size}.png"])`)
          const img = figure.locator('img')
          await img.scrollIntoViewIfNeeded()
          await expect.poll(() => img.evaluate(node => [node.naturalWidth, node.naturalHeight])).toEqual([size, size])
          await expect(img).toHaveAttribute('width', String(size))
          await expect(img).toHaveAttribute('height', String(size))
          const asset = await request.get(`/tutorials/illustrator-png-ko/size-${size}.png`)
          expect(asset.status()).toBe(200)
          const bytes = await asset.body()
          const metadata = await sharp(bytes).metadata()
          expect([metadata.format, metadata.width, metadata.height]).toEqual(['png', size, size])
          const [download] = await Promise.all([
            page.waitForEvent('download'),
            figure.getByRole('link', { name: `${size}×${size} 비교 PNG 내려받기`, exact: true }).click(),
          ])
          const downloaded = test.info().outputPath(`size-${size}.png`)
          await download.saveAs(downloaded)
          expect((await sharp(downloaded).raw().toBuffer()).equals(await sharp(bytes).raw().toBuffer())).toBe(true)
          const raw = await sharp(bytes).ensureAlpha().raw().toBuffer()
          expect(raw[3]).toBe(0)
        }
        for (const href of await article.locator('a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')).filter(href => href.startsWith('/')))) {
          expect((await request.get(href)).status(), href).toBe(200)
        }
        expect(await article.locator('a[href^="https://helpx.adobe.com/"]').count()).toBe(3)
        const headings = await article.locator('h2,h3,h4').evaluateAll(nodes => nodes.map(node => Number(node.tagName[1])))
        expect(headings[0]).toBe(2)
        expect(headings.every((level, index) => index === 0 || level <= headings[index - 1] + 1)).toBe(true)
        await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
      })
    }
  })
}

test('Korean Illustrator sharing image is a localized 1200x630 PNG', async ({ request }) => {
  const response = await request.get(image)
  expect(response.status()).toBe(200)
  const bytes = await response.body()
  expect(bytes.length).toBeLessThan(200000)
  const metadata = await sharp(bytes).metadata()
  expect([metadata.format, metadata.width, metadata.height]).toEqual(['png', 1200, 630])
})
