import { test, expect } from '@playwright/test'

test('format page keeps two clear routes back to the main converter', async ({ page }) => {
  await page.goto('/converter/png-to-pixel-art/')

  await expect(page.getByTestId('primary-converter-callout-top')).toBeVisible()
  await expect(page.getByTestId('primary-converter-callout-bottom')).toBeVisible()

  const converterLinks = page.locator('a[href="/converter/image-to-pixel-art/"]')
  await expect.poll(async () => converterLinks.count()).toBeGreaterThanOrEqual(2)

  await expect(
    page.getByRole('heading', { level: 2, name: 'Upload a PNG and tune the pixel conversion' })
  ).toBeVisible()

  await expect(
    page.getByRole('heading', { level: 2, name: 'Need the full image to pixel art workflow?' })
  ).toBeVisible()
})
