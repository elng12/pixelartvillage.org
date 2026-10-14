import { test, expect } from '@playwright/test'

test('unknown path renders NotFound and sets robots noindex', async ({ page }) => {
  const response = await page.goto('/nonexistent-page', { waitUntil: 'domcontentloaded' })
  expect(response.status()).toBe(404)

  await expect(page.locator('#tool')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible()

  await expect
    .poll(() => page.evaluate(() => document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? null))
    .toBe('noindex')

  await page.getByRole('link', { name: /back to home/i }).click()
  await expect(page.locator('#tool')).toBeVisible()

  await expect
    .poll(() => page.evaluate(() => document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? null))
    .toBe(null)
})

const foreignPageHead = 'link[rel="canonical"],link[rel="alternate"][hreflang],meta[name="googlebot"],meta[property^="og:"],meta[name^="twitter:"],script[type="application/ld+json"]'

async function expectMissingArticle(page, heading) {
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex')
  await expect(page.locator(foreignPageHead)).toHaveCount(0)
  await expect(page.locator('#tool,.blog-article-prose')).toHaveCount(0)
}

test.describe('missing article without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('an untranslated article returns a readable404 instead of the homepage', async ({ page }) => {
    const response = await page.goto('/blog/pixel-art-animation-tutorial-frame-by-frame/')
    expect(response.status()).toBe(404)
    await expectMissingArticle(page, 'Post not found')
    await expect(page.locator('main a[href="/blog/"]')).toBeVisible()
  })
})

test('a missing Japanese article mounts cleanly and returns to the real blog index', async ({ page }) => {
  const runtimeErrors = []
  page.on('pageerror', error => runtimeErrors.push(error.message))
  page.on('console', message => {
    if (message.type() === 'error' && /Minified React|hydration|\[Seo\]/i.test(message.text())) {
      runtimeErrors.push(message.text())
    }
  })
  const response = await page.goto('/ja/blog/constructor/')
  expect(response.status()).toBe(404)
  await expectMissingArticle(page, '記事が見つかりません')
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja')
  await expect(page.locator('#language-switcher')).toBeDisabled()
  await page.locator('main a[href="/ja/blog/"]').click()
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://pixelartvillage.org/ja/blog/')
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0)
  await expect(page.locator('#language-switcher')).toBeEnabled()
  expect(runtimeErrors).toEqual([])
})

test('successive client-side missing routes retain noindex and restore the original homepage head', async ({ page }) => {
  await page.goto('/')
  const homeTitle = await page.title()
  for (const pathname of ['/blog/constructor/', '/blog/missing-shared404-regression/']) {
    await page.evaluate(path => {
      history.pushState(null, '', path)
      dispatchEvent(new PopStateEvent('popstate'))
    }, pathname)
    await expectMissingArticle(page, 'Post not found')
  }
  await page.getByRole('banner').locator('a[href="/"]').first().click()
  await expect(page.locator('#tool')).toBeVisible()
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://pixelartvillage.org/')
  await expect(page).toHaveTitle(homeTitle)
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://pixelartvillage.org/')
})

test('static gzip negotiation preserves readable 404s, binary assets and HEAD', async ({ request }) => {
  const pathname = '/ja/blog/constructor/'
  const identity = await request.get(pathname, { headers: { 'Accept-Encoding': 'identity' } })
  expect(identity.status()).toBe(404)
  expect(await identity.text()).toContain('content="noindex"')
  const expectedBody = await identity.body()

  const compressed = await request.get(pathname, { headers: { 'Accept-Encoding': 'br;q=1, GZip;Q=0.5' } })
  expect(compressed.status()).toBe(404)
  expect(compressed.headers()['content-encoding']).toBe('gzip')
  expect(compressed.headers().vary.toLowerCase().split(/\s*,\s*/)).toContain('accept-encoding')
  expect(await compressed.body()).toEqual(expectedBody)

  const excluded = await request.get(pathname, { headers: { 'Accept-Encoding': 'gzip;q=0, *;q=1' } })
  expect(excluded.status()).toBe(404)
  expect(excluded.headers()['content-encoding']).toBeUndefined()
  expect(excluded.headers().vary.toLowerCase().split(/\s*,\s*/)).toContain('accept-encoding')
  expect(await excluded.body()).toEqual(expectedBody)

  const image = await request.get('/sprite-mana-source.png', { headers: { 'Accept-Encoding': 'gzip' } })
  expect(image.status()).toBe(200)
  expect(image.headers()['content-type']).toBe('image/png')
  expect(image.headers()['content-encoding']).toBeUndefined()
  expect((await image.body()).subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))

  const head = await request.head(pathname, { headers: { 'Accept-Encoding': 'gzip' } })
  expect(head.status()).toBe(404)
  expect(head.headers()['content-encoding']).toBe('gzip')
  expect(await head.body()).toHaveLength(0)
})
