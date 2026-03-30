import { test, expect } from '@playwright/test'

// Ignore CSP errors emitted for these known third-party hosts in tests
const KNOWN_CSP_VIOLATIONS = /(pagead2\.googlesyndication|adsbygoogle|securepubads|adtrafficquality|doubleclick|googletagmanager|clarity\.ms|gtag)/i

test.describe('CSP verification', () => {
  test('root has CSP header and no console CSP violations', async ({ page }) => {
    const logs = []
    page.on('console', (msg) => {
      const text = msg.text()
      if (KNOWN_CSP_VIOLATIONS.test(text)) {
        return
      }
      logs.push({ type: msg.type(), text })
    })

    const response = await page.goto('/')
    expect(response).toBeTruthy()

    const cspText = response.headers()['content-security-policy']
    expect(cspText).toBeTruthy()
    expect(cspText).toContain("default-src 'self'")
    expect(cspText).toContain("frame-ancestors 'none'")

    // CSP should be managed via headers (meta does not support frame-ancestors)
    await expect(page.locator('meta[http-equiv="Content-Security-Policy"]')).toHaveCount(0)

    // no CSP violation messages in console
    const violations = logs.filter((l) =>
      /content security policy|violat(es|ed) the following|refused to (load|connect|execute)/i.test(l.text) &&
      !KNOWN_CSP_VIOLATIONS.test(l.text)
    )
    expect(violations, JSON.stringify(violations, null, 2)).toHaveLength(0)
  })

  test('blog route loads without CSP violations', async ({ page }) => {
    const logs = []
    page.on('console', (msg) => {
      const text = msg.text()
      if (KNOWN_CSP_VIOLATIONS.test(text)) {
        return
      }
      logs.push({ type: msg.type(), text })
    })
    const response = await page.goto('/blog')
    expect(response).toBeTruthy()
    expect(response.headers()['content-security-policy']).toBeTruthy()
    const violations = logs.filter((l) =>
      /content security policy|violat(es|ed) the following|refused to (load|connect|execute)/i.test(l.text) &&
      !KNOWN_CSP_VIOLATIONS.test(l.text)
    )
    expect(violations, JSON.stringify(violations, null, 2)).toHaveLength(0)
  })
})
