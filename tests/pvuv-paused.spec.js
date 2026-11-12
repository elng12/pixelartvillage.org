import { test, expect } from '@playwright/test'

const PVUV_COOKIES = ['_pv_id', '_pv_sid', '_pv_ft', '_pv_v', '_pv_uid', '_pv_t']

test('paused PVUV clears old identifiers without resetting consent or unrelated storage', async ({ page, context, baseURL }) => {
  const origin = new URL(baseURL).origin
  const requests = []
  page.on('request', (request) => {
    if (/(^|\.)pvuv\.ai$/.test(new URL(request.url()).hostname)) requests.push(request.url())
  })
  // Do not send test visits to third-party analytics or depend on their availability.
  await context.route('https://**/*', (route) => route.abort())
  await context.addInitScript(({ origin }) => {
    if (location.origin !== origin) return
    localStorage.setItem('consent.choice.v1', JSON.stringify({ version: 2, analytics: true, advertising: false, granted: false }))
    localStorage.setItem('_pv_id', 'old-visitor')
    localStorage.setItem('editor-test-state', 'keep')
    sessionStorage.setItem('editor-test-state', 'keep')
  }, { origin })

  for (const pathname of ['/', '/turbo0.html', '/ai-dirs.html']) {
    await context.addCookies([
      ...PVUV_COOKIES.map((name) => ({ name, value: 'old-identifier', url: origin + '/' })),
      { name: 'editor_preference', value: 'keep', url: origin + '/' },
    ])
    const response = await page.goto(pathname)
    expect(response.status()).toBe(200)
    await expect.poll(() => page.evaluate(() => localStorage.getItem('_pv_id'))).toBeNull()
    const cookies = await context.cookies(origin)
    expect(cookies.filter((cookie) => PVUV_COOKIES.includes(cookie.name))).toEqual([])
    expect(cookies).toContainEqual(expect.objectContaining({ name: 'editor_preference', value: 'keep' }))
    expect(await page.evaluate(() => ({
      analytics: JSON.parse(localStorage.getItem('consent.choice.v1')).analytics,
      localState: localStorage.getItem('editor-test-state'),
      sessionState: sessionStorage.getItem('editor-test-state'),
    }))).toEqual({ analytics: true, localState: 'keep', sessionState: 'keep' })

    if (pathname === '/') {
      await page.locator('a[href="/converter/photo-to-pixel-art/"]').first().click()
      await expect(page.locator('h1')).toHaveText('Photo to Pixel Art Converter')
    }
  }
  expect(requests).toEqual([])
})
