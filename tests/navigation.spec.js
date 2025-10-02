import { test, expect } from '@playwright/test'

async function isInViewport(locator) {
  return await locator.evaluate((el) => {
    const r = el.getBoundingClientRect()
    const vh = window.innerHeight || document.documentElement.clientHeight
    return r.top >= 0 && r.top < vh * 0.7 // top enters viewport
  })
}

test.describe('Navigation buttons scroll behavior', () => {
  test('desktop: header button scrolls to features and keeps focus', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    const btn = page.locator('nav[aria-label="Main navigation"] button[aria-controls="features"]')
    await expect(btn).toBeVisible()
    await btn.focus()
    await btn.click()

    const features = page.locator('#features')
    await expect(features).toBeVisible()
    await expect(await isInViewport(features)).toBeTruthy()

    // active element should be the clicked button
    const isFocused = await btn.evaluate((el) => el === document.activeElement)
    expect(isFocused).toBeTruthy()
  })

  test('mobile: footer CTA scrolls to tool', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    const cta = page.getByRole('button', { name: /Start now/i })
    await expect(cta).toBeVisible()
    await cta.click()
    const hero = page.locator('#tool')
    await expect(hero).toBeVisible()
    await expect(await isInViewport(hero)).toBeTruthy()
  })

  test('cross-page: from blog to features via header button', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/blog')
    const btn = page.locator('nav[aria-label="Main navigation"] button[aria-controls="features"]')
    await expect(btn).toBeVisible()
    await btn.click()
    await page.waitForURL('**/#features')
    const features = page.locator('#features')
    await expect(features).toBeVisible()
    await expect(await isInViewport(features)).toBeTruthy()
  })
})
