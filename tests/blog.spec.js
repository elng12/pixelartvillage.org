import { test, expect } from '@playwright/test'

test('blog tutorial renders structured headings and main converter link', async ({ page }) => {
  await page.goto('/blog/how-to-pixelate-an-image/')

  await expect(
    page.getByRole('heading', { level: 2, name: 'Before you start' })
  ).toBeVisible()

  const converterLink = page.getByRole('link', { name: 'Image to Pixel Art Converter' }).first()
  await expect(converterLink).toHaveAttribute('href', '/converter/image-to-pixel-art/')
  await expect(page.getByText('## Before you start')).toHaveCount(0)
})

test('comparison article keeps comparison intent and links to the main converter', async ({ page }) => {
  await page.goto('/blog/best-pixel-art-converters-compared-2025/')

  await expect(
    page.getByRole('heading', { level: 2, name: 'What we compared' })
  ).toBeVisible()

  await expect(
    page.getByRole('heading', { level: 3, name: '1. Pixel Art Village (.org)' })
  ).toBeVisible()

  await expect(
    page.getByRole('link', { name: 'Image to Pixel Art Converter' }).first()
  ).toHaveAttribute('href', '/converter/image-to-pixel-art/')
})
