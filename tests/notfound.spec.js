import { test, expect } from '@playwright/test'

test('unknown path renders NotFound and sets robots noindex', async ({ page }) => {
  await page.goto('/nonexistent-page', { waitUntil: 'domcontentloaded' })

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
