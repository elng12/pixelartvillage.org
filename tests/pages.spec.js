import { test, expect } from '@playwright/test'

test.describe('Static pages visibility', () => {
  test('Privacy page renders content', async ({ page }) => {
    await page.goto('/privacy')
    await expect(page.locator('h1:text("Privacy Policy")')).toBeVisible()
    // basic content smoke
    await expect(page.locator('section#cookies-adsense')).toBeVisible()
  })

  test('Terms page renders content', async ({ page }) => {
    await page.goto('/terms')
    await expect(page.locator('h1:text("Terms of Service")')).toBeVisible()
    await expect(page.locator('section#acceptance')).toBeVisible()
  })

  test('About page renders content', async ({ page }) => {
    await page.goto('/about')
    await expect(page.locator('h1:text("About Pixel Art Village")')).toBeVisible()
  })

  test('Contact page renders content and email link', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.locator('h1:text("Contact")')).toBeVisible()
    const email = page.locator('a[href="mailto:2296744453m@gmail.com"]')
    await expect(email).toBeVisible()
  })
})

