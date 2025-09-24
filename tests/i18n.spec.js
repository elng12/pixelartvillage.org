// Minimal i18n E2E checks (Playwright)
const { test, expect } = require('@playwright/test')

test.describe('i18n basic', () => {
  test('language switch updates UI without reload', async ({ page }) => {
    await page.goto('/')
    // Switch to Spanish via select
    const select = page.locator('select[aria-label="Language"]')
    await expect(select).toBeVisible()
    await select.selectOption('es')
    // Footer CTA should change quickly
    const cta = page.getByRole('link', { name: /Empezar ahora/ })
    await expect(cta).toBeVisible()
  })
})

