import { test, expect } from '@playwright/test'

test.describe('Static pages visibility', () => {
  test('Privacy page renders content', async ({ page }) => {
    await page.goto('/privacy')
    await expect(page.getByRole('heading', { level: 1, name: /Privacy Policy/i })).toBeVisible()
    // basic content smoke
    await expect(page.locator('section#cookies-adsense')).toBeVisible()
  })

  test('Terms page renders content', async ({ page }) => {
    await page.goto('/terms')
    await expect(page.getByRole('heading', { level: 1, name: /Terms of Service/i })).toBeVisible()
    await expect(page.locator('section#acceptance')).toBeVisible()
  })

  test('About page renders content', async ({ page }) => {
    await page.goto('/about')
    await expect(page.getByRole('heading', { level: 1, name: /About/i })).toBeVisible()
  })

  test('Contact page renders content', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.getByRole('heading', { level: 1, name: /Contact/i })).toBeVisible()
    const main = page.getByRole('main')
    await expect(main.getByRole('link', { name: /blog/i })).toBeVisible()
  })
})
