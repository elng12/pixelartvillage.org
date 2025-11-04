import { test, expect } from '@playwright/test'

// Ignore CSP errors emitted for these known third-party hosts in tests
const KNOWN_CSP_VIOLATIONS = /(pagead2\.googlesyndication|adsbygoogle|securepubads|adtrafficquality|doubleclick|googletagmanager|clarity\.ms|gtag)/i

test.describe('CSP verification', () => {
  test('root has CSP meta and no console CSP violations', async ({ page }) => {
    const logs = []
    page.on('console', (msg) => {
      const text = msg.text()
      if (KNOWN_CSP_VIOLATIONS.test(text)) {
        return
      }
      logs.push({ type: msg.type(), text })
    })

    await page.goto('/')

    // meta CSP exists
    const cspMeta = page.locator('meta[http-equiv="Content-Security-Policy"]')
    await expect(cspMeta).toHaveCount(1)
    const cspText = await cspMeta.getAttribute('content')
    expect(cspText).toBeTruthy()
    expect(cspText).toContain("default-src 'self'")

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
    await page.goto('/blog')
    const violations = logs.filter((l) =>
      /content security policy|violat(es|ed) the following|refused to (load|connect|execute)/i.test(l.text) &&
      !KNOWN_CSP_VIOLATIONS.test(l.text)
    )
    expect(violations, JSON.stringify(violations, null, 2)).toHaveLength(0)
  })
})
