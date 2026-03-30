import { test, expect } from '@playwright/test'

test.describe('Static pages visibility', () => {
  test('Home page keeps upload flow without sample shortcut buttons', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('upload-zone')).toBeVisible()
    await expect(page.getByTestId('choose-file-btn')).toBeVisible()
    await expect(page.getByTestId('header-feedback-link')).toHaveAttribute('href', 'https://docs.google.com/forms/d/e/1FAIpQLSdjw5_Q-QmCChechdq3bjsxoSzQ5kYgnyCZ7tpIMSND6CbniA/viewform?usp=header')
    await expect(page.getByTestId('header-feedback-link')).toHaveText(/Send feedback/i)
    await expect(page.getByRole('button', { name: /Open landscape sample/i })).toHaveCount(0)
    await expect(page.getByRole('button', { name: /Open pixel art sample/i })).toHaveCount(0)
  })

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
    await expect(page.getByTestId('contact-email-link')).toHaveAttribute('href', 'mailto:2296744453m@gmail.com')
    await expect(page.getByTestId('footer-email-link')).toHaveAttribute('href', 'mailto:2296744453m@gmail.com')
    await expect(page.locator('footer a[href="https://github.com/pixelartvillage/pixelartvillage"]')).toHaveCount(0)
  })
})
