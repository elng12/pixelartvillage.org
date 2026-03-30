// E2E: verify hreflang & canonical on localized prerendered pages.
// These assertions are meant to run against the production build preview (`vite preview`).

import { test, expect } from '@playwright/test'

test.describe('SEO hreflang and canonical', () => {
  test('homepage /es/ has hreflang alternates and canonical', async ({ page }) => {
    await page.goto('/es/')

    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveCount(1)
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveCount(1)
    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveCount(1)
    await expect(canonical).toHaveAttribute('href', /\/es\/?$/)
  })

  test('about /es/about/ has localized canonical', async ({ page }) => {
    await page.goto('/es/about/')

    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveCount(1)
    await expect(canonical).toHaveAttribute('href', /\/es\/about\/?$/)
  })
})

