import { test, expect } from '@playwright/test'

const headSelector = 'link[rel="canonical"],link[rel="alternate"][hreflang],meta[name="description"],meta[name="robots"],meta[name="googlebot"],meta[property^="og:"],meta[name^="twitter:"],script[type="application/ld+json"]'
const illustrator = '/ko/blog/export-from-illustrator-image-to-pixel-art/'
const pixelate = '/ko/blog/how-to-pixelate-an-image/'

async function readSnapshot(page, html) {
  return page.evaluate(({ html, selector }) => {
    const doc = html ? new DOMParser().parseFromString(html, 'text/html') : document
    return {
      title: doc.title,
      lang: doc.documentElement.lang,
      h1: [...doc.querySelectorAll('h1')].map(node => node.textContent.trim()),
      body: doc.querySelector('.blog-article-prose')?.textContent.replace(/\s+/g, '') || null,
      head: [...doc.head.querySelectorAll(selector)].map(node => ({
        tag: node.tagName,
        attributes: Object.fromEntries([...node.attributes].map(a => [a.name, a.value]).sort()),
        schema: node.tagName === 'SCRIPT' ? JSON.parse(node.textContent) : null,
      })),
    }
  }, { html, selector: headSelector })
}

async function expectedSnapshot(page, request, route) {
  const response = await request.get(route)
  expect(response.status()).toBe(200)
  return readSnapshot(page, await response.text())
}

async function expectSnapshot(page, expected) {
  await expect.poll(() => readSnapshot(page)).toEqual(expected)
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
}

async function rejectCookies(page, label) {
  if (process.env.EXPECT_CONSENT_BANNER === '1') {
    await page.getByRole('button', { name: label, exact: true }).click()
  }
}

const flows = [
  { lang: 'ko', first: 'export-from-illustrator-image-to-pixel-art', second: 'how-to-pixelate-an-image', reject: '필수적이지 않은 쿠키 거부' },
  { lang: 'de', first: 'pixel-art-tutorial-complete-guide-2025', second: 'best-pixel-art-converters-compared-2025', reject: 'Nicht unbedingt erforderliche Cookies ablehnen' },
  { lang: 'en', first: 'how-to-get-pixel-art-version-of-image', second: 'how-to-pixelate-an-image', reject: 'Reject non-essential cookies' },
]

for (const { lang, first, second, reject } of flows) {
  for (const width of [1440, 390]) {
    test(`${lang} ${width}px article navigation keeps content and complete prerendered SEO`, async ({ page, request }) => {
      await page.setViewportSize({ width, height: 900 })
      const prefix = lang === 'en' ? '' : `/${lang}`
      const index = `${prefix}/blog/`
      const firstRoute = `${index}${first}/`
      const secondRoute = `${index}${second}/`
      await page.goto(index)
      await rejectCookies(page, reject)
      const indexSnapshot = await expectedSnapshot(page, request, index)
      const firstSnapshot = await expectedSnapshot(page, request, firstRoute)
      const secondSnapshot = await expectedSnapshot(page, request, secondRoute)
      let documentRequests = 0
      page.on('request', r => { if (r.isNavigationRequest()) documentRequests += 1 })
      await page.locator(`a[href="${firstRoute}"]`).first().click()
      await expectSnapshot(page, firstSnapshot)
      await page.locator(`main a[href="${index}"]`).first().click()
      await expectSnapshot(page, indexSnapshot)
      await page.locator(`a[href="${secondRoute}"]`).first().click()
      await expectSnapshot(page, secondSnapshot)
      await page.locator(`main a[href="${index}"]`).first().click()
      await page.locator(`a[href="${firstRoute}"]`).first().click()
      await expectSnapshot(page, firstSnapshot)
      expect(documentRequests, 'The repair must keep client-side navigation').toBe(0)
      await test.info().attach(`${lang}-${width}-navigation`, { body: await page.screenshot(), contentType: 'image/png' })
      await page.reload()
      await expectSnapshot(page, firstSnapshot)
    })
  }
}

for (const failure of ['http', 'invalid-html', 'wrong-route']) {
  test(`head synchronization recovers after ${failure} without retaining old canonical`, async ({ page, request }) => {
    await page.goto('/ko/blog/')
    await rejectCookies(page, '필수적이지 않은 쿠키 거부')
    const expected = await expectedSnapshot(page, request, illustrator)
    const wrongRouteHtml = failure === 'wrong-route' ? await (await request.get('/ko/blog/')).text() : null
    const errors = []
    page.on('console', m => { if (m.type() === 'error' && m.text().includes('[Seo]')) errors.push(m.text()) })
    await page.route(`**${illustrator}`, route => {
      if (route.request().isNavigationRequest()) return route.continue()
      return route.fulfill({ status: failure === 'http' ? 503 : 200, contentType: 'text/html', body: wrongRouteHtml || '<html><head></head><body>Unavailable</body></html>' })
    })
    await page.locator(`a[href="${illustrator}"]`).first().click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(expected.h1[0])
    await expect.poll(() => errors.length).toBeGreaterThan(0)
    expect(errors.every(message => message.includes(illustrator))).toBe(true)
    if (failure === 'http') expect(errors.every(message => message.includes('(503)'))).toBe(true)
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0)
    await expect(page.locator('link[hreflang],meta[property^="og:"],script[type="application/ld+json"]')).toHaveCount(0)
    await page.unroute(`**${illustrator}`)
    await page.getByRole('banner').locator('a[href="/ko/blog/"]').click()
    await page.locator(`a[href="${illustrator}"]`).first().click()
    await expectSnapshot(page, expected)
  })
}

test('a cancelled old head request cannot replace the current article tags', async ({ page, request }) => {
  await page.goto(pixelate)
  await rejectCookies(page, '필수적이지 않은 쿠키 거부')
  const expected = await expectedSnapshot(page, request, pixelate)
  let release
  const blocked = new Promise(resolve => { release = resolve })
  let started = false
  await page.route(`**${illustrator}`, async route => {
    if (route.request().isNavigationRequest()) return route.continue()
    const response = await route.fetch()
    started = true
    await blocked
    await route.fulfill({ response })
  })
  await page.getByRole('banner').locator('a[href="/ko/blog/"]').click()
  await page.locator(`a[href="${illustrator}"]`).first().click()
  await expect.poll(() => started).toBe(true)
  await page.getByRole('banner').locator('a[href="/ko/blog/"]').click()
  await page.locator(`a[href="${pixelate}"]`).first().click()
  release()
  await expectSnapshot(page, expected)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org${pixelate}`)
})
