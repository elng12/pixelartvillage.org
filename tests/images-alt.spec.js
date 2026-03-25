import { test, expect } from '@playwright/test'

async function expectRenderedImagesToHaveAlt(page, pathname) {
  await page.goto(pathname)
  await page.waitForLoadState('networkidle')

  const showcase = page.locator('#showcase')
  if (await showcase.count()) {
    await showcase.scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)
  }

  const footer = page.locator('footer')
  if (await footer.count()) {
    await footer.scrollIntoViewIfNeeded()
    await page.waitForTimeout(300)
  }

  const missingAltImages = await page.evaluate(() =>
    Array.from(document.images)
      .map((img, index) => ({
        index,
        src: img.currentSrc || img.src,
        alt: img.getAttribute('alt'),
      }))
      .filter((img) => typeof img.alt !== 'string' || img.alt.trim() === '')
  )

  expect(
    missingAltImages,
    `expected all rendered images on ${pathname} to have non-empty alt text`
  ).toEqual([])
}

test.describe('image alt text', () => {
  test('critical routes expose non-empty alt text for rendered images', async ({ page }) => {
    await expectRenderedImagesToHaveAlt(page, '/')
    await expectRenderedImagesToHaveAlt(page, '/ar/')
  })
})
