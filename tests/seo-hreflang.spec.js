// E2E: verify hreflang & canonical on localized prerendered pages
// Note: These assertions are intended for `npm run preview` (vite preview, default port 4173)
// In dev (vite dev, ports 5173+), hreflang alternates are injected only at build time, so we skip.

import { test, expect } from '@playwright/test'

const isPreviewHost = (url) => {
  const u = new URL(url)
  return /:\\d+$/.test(u.host) && (u.port === '4173' || u.port === '5173')
}

test.describe('SEO hreflang and canonical', () => {
  test('homepage /es/ has hreflang alternates and canonical', async ({ page }) => {
    await page.goto('/es/')
    if (!isPreviewHost(page.url())) test.skip()

    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveCount(1)
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1)
    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveCount(1)
    await expect(canonical).toHaveAttribute('href', /\/es\/?$/)
  })

  test('about /es/about/ has localized canonical', async ({ page }) => {
    await page.goto('/es/about/')
    if (!isPreviewHost(page.url())) test.skip()

    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveCount(1)
    await expect(canonical).toHaveAttribute('href', /\/es\/about\/?$/)
  })
})


