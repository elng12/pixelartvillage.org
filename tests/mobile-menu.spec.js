import { test, expect } from '@playwright/test'

async function expectHeaderFitsViewport(page) {
  const metrics = await page.evaluate(() => {
    const header = document.querySelector('header[role="banner"]')
    if (!header) return null
    return {
      clientWidth: header.clientWidth,
      scrollWidth: header.scrollWidth,
      clientHeight: header.clientHeight,
      scrollHeight: header.scrollHeight,
    }
  })

  expect(metrics, 'Expected header[role="banner"] to exist').not.toBeNull()
  expect(metrics.scrollWidth, 'Header should not overflow horizontally').toBeLessThanOrEqual(
    metrics.clientWidth + 1
  )
  expect(metrics.scrollHeight, 'Header should not overflow vertically').toBeLessThanOrEqual(
    metrics.clientHeight + 1
  )
}

test('mobile: hamburger menu opens and navigates', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  await expect(page.locator('#language-switcher')).toBeVisible()
  await expectHeaderFitsViewport(page)

  const toggle = page.locator('button[aria-controls="mobile-nav"]')
  await expect(toggle).toBeVisible()
  await expect(toggle).toHaveAttribute('aria-expanded', 'false')

  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('#mobile-nav')).toBeVisible()

  await page.locator('#mobile-nav').getByRole('link', { name: /blog/i }).click()
  await expect(page).toHaveURL(/\/blog\/?$/)
  await expect(page.locator('#mobile-nav')).toHaveCount(0)
  await expect(page.locator('#main-content h1')).toBeVisible()
})

test('small mobile (iPhone SE): header stays within viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 })
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  await expect(page.locator('#language-switcher')).toBeVisible()
  await expect(page.locator('button[aria-controls="mobile-nav"]')).toBeVisible()

  await expectHeaderFitsViewport(page)
})

test('tablet: header stays within viewport', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 })
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  await expect(page.locator('#language-switcher')).toBeVisible()
  await expect(page.locator('button[aria-controls="mobile-nav"]')).toBeHidden()

  await expectHeaderFitsViewport(page)
})
