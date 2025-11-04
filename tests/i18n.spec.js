// Minimal i18n E2E checks (Playwright) — ESM style
import { test, expect } from '@playwright/test'

test.describe('i18n basic', () => {
  test('language switch updates UI without reload', async ({ page }) => {
    await page.goto('/')
    // Switch to Spanish via select
    const select = page.locator('#language-switcher, select[aria-label="Language"]')
    await expect(select).toBeVisible()
    await select.selectOption('es')
    // URL and <html lang> should reflect Spanish
    await expect(page).toHaveURL(/\/es\//)
    const html = page.locator('html')
    await expect(html).toHaveAttribute('lang', /es/i)
  })
})
