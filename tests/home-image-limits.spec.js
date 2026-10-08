import fs from 'node:fs/promises'
import sharp from 'sharp'
import { test, expect } from '@playwright/test'

const title = 'Image to Pixel Art Converter | Pixel Art Village'
const limitsTitle = 'Image Upload Limits'
const limitsDescription = 'Upload images up to 10 MiB. Images larger than 2200 px on their longest edge are resized before conversion.'

async function openHome(page) {
  await page.goto('/')
  if (process.env.EXPECT_CONSENT_BANNER === '1') {
    await page.getByRole('button', { name: 'Reject non-essential cookies', exact: true }).click()
  }
}

test('English homepage initial HTML states actual limits without changing SEO tags', async ({ page, request }) => {
  const response = await request.get('/')
  expect(response.status()).toBe(200)
  const html = await response.text()
  await openHome(page)
  const audit = await page.evaluate((html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const schemas = [...doc.querySelectorAll('script[type="application/ld+json"]')].flatMap((el) => JSON.parse(el.textContent))
    return {
      title: doc.title,
      h1: [...doc.querySelectorAll('h1')].map((el) => el.textContent),
      canonical: doc.querySelector('link[rel="canonical"]').href,
      description: doc.querySelector('meta[name="description"]').content,
      social: ['og:title', 'twitter:title'].map((key) => doc.querySelector(`meta[property="${key}"],meta[name="${key}"]`).content),
      features: doc.querySelector('#wplace-features').textContent,
      schemaTypes: schemas.map((entry) => entry['@type']),
      softwareDescription: schemas.find((entry) => entry['@type'] === 'SoftwareApplication').description,
      visibleFaq: [...doc.querySelectorAll('#faq h3')].map((el) => el.textContent),
    }
  }, html)
  expect(audit.title).toBe(title)
  expect(audit.h1).toEqual(['Image to Pixel Art Converter'])
  expect(audit.canonical).toBe('https://pixelartvillage.org/')
  expect(audit.description).toBe('Turn images into pixel art online with live preview, palette controls, dithering, and private browser-based processing for PNG, JPG, GIF, and WEBP files.')
  expect(audit.social).toEqual([title, title])
  expect(audit.features).toContain(limitsDescription)
  expect(audit.features).not.toContain('No Dimension Limits')
  const english = JSON.parse(await fs.readFile(new URL('../public/locales/en/translation.json', import.meta.url), 'utf8'))
  expect(audit.visibleFaq).toEqual(english.faq.items.map((item) => item.question))
  expect(audit.schemaTypes).toEqual(['SoftwareApplication', 'BreadcrumbList', 'WebSite'])
  expect(audit.softwareDescription).toBe(audit.description)
  for (const route of ['/es/', '/de/', '/converter/photo-to-pixel-art/']) {
    const other = await request.get(route)
    expect(other.status()).toBe(200)
    const visibleCopy = await page.evaluate((html) => {
      const doc = new DOMParser().parseFromString(html, 'text/html')
      doc.querySelectorAll('script').forEach((el) => el.remove())
      return doc.body.textContent
    }, await other.text())
    expect(visibleCopy).not.toContain(limitsTitle)
  }
  for (const route of ['/es/', '/de/']) {
    await page.goto(route)
    await expect(page.locator('#wplace-features')).toBeAttached()
    await expect(page.getByRole('heading', { name: limitsTitle, exact: true })).toHaveCount(0)
  }
  await page.goto('/')
  await expect(page.getByRole('heading', { name: limitsTitle, exact: true })).toHaveCount(1)
})

for (const width of [1440, 390]) {
  test(`English homepage limits and tool render at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 })
    await openHome(page)
    await expect(page.getByTestId('upload-zone')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Image to Pixel Art Converter')
    await page.screenshot({ path: test.info().outputPath(`home-entry-${width}.png`) })
    const feature = page.locator('#wplace-features')
    await feature.scrollIntoViewIfNeeded()
    await expect(feature.getByRole('heading', { name: limitsTitle, exact: true })).toBeVisible()
    await expect(feature.getByText(limitsDescription, { exact: true })).toBeVisible()
    await expect(feature.locator(`[title="${limitsTitle}"]`)).toHaveCount(1)
    await expect(feature).not.toContainText('No Dimension Limits')
    await expect(feature.locator('[title="No Size Limits"]')).toHaveCount(0)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    await page.screenshot({ path: test.info().outputPath(`home-limits-${width}.png`), fullPage: true })
    await feature.screenshot({ path: test.info().outputPath(`home-feature-${width}.png`) })
  })
}

test('homepage accepts the 10 MiB boundary, rejects larger files, and resizes oversized images', async ({ page }) => {
  await openHome(page)
  const input = page.getByTestId('file-input')
  const detail = await sharp({ create: { width: 99, height: 73, channels: 3, background: '#168abd' } }).png().toBuffer()
  const source = await sharp({ create: { width: 3000, height: 1500, channels: 3, background: '#d64769' } })
    .composite([{ input: detail, left: 101, top: 89 }]).png().toBuffer()
  const maxBytes = 10 * 1024 * 1024
  const tooLarge = Buffer.alloc(maxBytes + 1)
  source.copy(tooLarge)
  await input.setInputFiles({ name: 'too-large.png', mimeType: 'image/png', buffer: tooLarge })
  await expect(page.getByText('File is too large. Please upload an image smaller than 10MB.', { exact: true })).toBeVisible()
  await expect(page.getByTestId('editor-controls')).toHaveCount(0)
  const atLimit = Buffer.alloc(maxBytes)
  source.copy(atLimit)
  await input.setInputFiles({ name: 'at-limit.png', mimeType: 'image/png', buffer: atLimit })
  const preview = page.getByTestId('preview-container')
  await expect(preview.locator('img')).toHaveAttribute('src', /^data:image\/png/)
  await expect(page.getByText('File is too large. Please upload an image smaller than 10MB.', { exact: true })).toHaveCount(0)
  const pixelSize = page.getByRole('slider', { name: /^Pixel Size:/ })
  await expect(pixelSize).toHaveValue('1')
  const original = await preview.locator('img').getAttribute('src')
  await pixelSize.press('ArrowRight')
  await expect(pixelSize).toHaveValue('2')
  await expect.poll(async () => (await preview.locator('img').getAttribute('src')) !== original).toBe(true)
  await expect(preview).toHaveAttribute('aria-busy', 'false')
  const adjusted = await preview.locator('img').getAttribute('src')
  await pixelSize.press('Home')
  await expect(pixelSize).toHaveValue('1')
  await expect.poll(async () => (await preview.locator('img').getAttribute('src')) !== adjusted).toBe(true)
  await expect(preview).toHaveAttribute('aria-busy', 'false')
  await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
  const pending = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download Pixel Art Image', exact: true }).last().click()
  const download = await pending
  const output = await fs.readFile(await download.path())
  const metadata = await sharp(output).metadata()
  expect([metadata.width, metadata.height, metadata.format]).toEqual([2200, 1100, 'png'])
})
