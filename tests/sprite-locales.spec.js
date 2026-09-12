import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import sharp from 'sharp'

const { supported } = JSON.parse(readFileSync(new URL('../config/locales.json', import.meta.url), 'utf8'))
const spritePath = '/converter/photo-to-sprite-converter/'
const english = JSON.parse(readFileSync(new URL('../public/locales/en/translation.json', import.meta.url), 'utf8'))

async function expectNoOverflow(page) {
  await expect.poll(() => page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth)).toBeLessThanOrEqual(1)
}

for (const locale of supported) {
  test(`Sprite uses the compact layout and real export in ${locale}`, async ({ page, request }) => {
    const bundle = JSON.parse(readFileSync(new URL(`../public/locales/${locale}/translation.json`, import.meta.url), 'utf8'))
    const route = `${locale === 'en' ? '' : `/${locale}`}${spritePath}`
    await page.setViewportSize({ width: 1440, height: 900 })
    const response = await page.goto(route)
    expect(response.status()).toBe(200)
    await expect(page.getByTestId('sprite-guide')).toBeVisible()
    await expect(page).toHaveTitle('Photo to Sprite Converter - Free PNG | Pixel Art Village')
    await expect(page.locator('html')).toHaveAttribute('lang', locale)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://pixelartvillage.org${spritePath}`)
    await expect(page.getByTestId('choose-file-btn')).toHaveText(locale === 'en' ? 'Choose image' : bundle.tool.chooseFile)
    await expect(page.getByTestId('sprite-fallback-notice')).toHaveCount(locale === 'en' ? 0 : 1)
    if (locale !== 'en') await expect(page.getByTestId('sprite-fallback-notice')).toHaveText(bundle.content.fallbackNotice)
    await expect(page.locator('#how-it-works')).toHaveCount(0)
    await expect(page.getByTestId('primary-converter-callout-top')).toHaveCount(0)
    await expect(page.getByTestId('primary-converter-callout-bottom')).toHaveCount(0)
    await expect(page.getByTestId('sprite-guide').locator('tbody tr')).toHaveCount(4)
    await expect(page.getByTestId('sprite-guide')).toHaveCSS('direction', 'ltr')
    await expect(page.getByTestId('sprite-example')).toHaveAttribute('lang', 'en')
    await expect(page.locator('#faq article')).toHaveCount(5)
    const sections = ['#tool', '[data-testid="sprite-example"]', '[data-testid="sprite-guide"]', '#faq']
    const tops = await Promise.all(sections.map(async (selector) => (await page.locator(selector).boundingBox()).y))
    expect(tops).toEqual([...tops].sort((a, b) => a - b))
    const faq = await page.evaluate((html) => {
      const schemas = [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((el) => JSON.parse(el.textContent))
      const initial = new DOMParser().parseFromString(html, 'text/html')
      return {
        initialGuide: Boolean(initial.querySelector('[data-testid="sprite-guide"]')),
        initialFaq: [...initial.querySelectorAll('#faq article')].map((el) => ({ question: el.querySelector('h3').textContent, answer: el.querySelector('p').textContent })),
        schema: schemas.find((item) => item['@type'] === 'FAQPage').mainEntity.map((item) => ({ question: item.name, answer: item.acceptedAnswer.text })),
        visible: [...document.querySelectorAll('#faq article')].map((el) => ({ question: el.querySelector('h3').textContent, answer: el.querySelector('p').textContent })),
      }
    }, await response.text())
    expect(faq.initialGuide).toBe(true)
    expect(faq.initialFaq).toEqual(faq.visible)
    expect(faq.schema).toEqual(faq.visible)
    await expectNoOverflow(page)
    await page.setViewportSize({ width: 390, height: 844 })
    await expectNoOverflow(page)
    await page.getByTestId('sprite-example').scrollIntoViewIfNeeded()
    await expect.poll(() => page.getByTestId('sprite-example').locator('img').evaluateAll((images) => images.every((img) => img.complete && img.naturalWidth > 0))).toBe(true)
    await test.info().attach(`${locale}-mobile-example`, { body: await page.screenshot(), contentType: 'image/png' })

    const source = await request.get('/sprite-mana-source.png')
    await page.getByTestId('file-input').setInputFiles({ name: 'mana.png', mimeType: 'image/png', buffer: await source.body() })
    const preview = page.getByTestId('preview-container')
    await expect(preview.locator('img')).toHaveAttribute('src', /^data:image\/png/)
    await expect(preview).toHaveAttribute('aria-busy', 'false')
    await expect(page.locator('#pixel-size-slider')).toHaveValue('6')
    await expect(page.getByTestId('editor-controls')).toHaveCSS('overflow-y', 'visible')
    const pixelExport = page.getByRole('button', { name: bundle.export?.size?.pixel || english.export.size.pixel, exact: true })
    await pixelExport.click()
    await expect(pixelExport).toHaveClass(/ring-blue-500/)
    const pending = page.waitForEvent('download')
    await page.getByRole('button', { name: bundle.editor.downloadBtn, exact: true }).last().click()
    const result = sharp(await (await pending).path())
    expect(await result.metadata()).toMatchObject({ width: 38, height: 38, hasAlpha: true })
    const stored = sharp(await (await request.get('/sprite-mana-pixel6.png')).body())
    expect((await result.raw().toBuffer()).equals(await stored.raw().toBuffer())).toBe(true)
    const rgba = await result.ensureAlpha().raw().toBuffer()
    for (const index of [0, 37, 37 * 38, 38 * 38 - 1]) expect(rgba[index * 4 + 3]).toBe(0)

    const before = await preview.locator('img').getAttribute('src')
    await page.locator('#pixel-size-slider').press(locale === 'ar' ? 'ArrowLeft' : 'ArrowRight')
    await expect(page.locator('#pixel-size-slider')).toHaveValue('7')
    await page.locator('#palette-select').selectOption('Pico-8')
    await expect(preview).toHaveAttribute('aria-busy', 'false')
    await expect(preview.locator('img')).not.toHaveAttribute('src', before)
    await expectNoOverflow(page)
  })
}

test('switching Sprite languages keeps the new structure and localized controls', async ({ page }) => {
  await page.goto(spritePath)
  for (const locale of ['es', 'ja', 'ar', 'en']) {
    await page.locator('#language-switcher').selectOption(locale)
    await expect.poll(() => new URL(page.url()).pathname.replace(/\/$/, '')).toBe(`${locale === 'en' ? '' : `/${locale}`}${spritePath.slice(0, -1)}`)
    await expect(page.locator('html')).toHaveAttribute('lang', locale)
    await expect(page.getByTestId('sprite-guide')).toBeVisible()
    const bundle = JSON.parse(readFileSync(new URL(`../public/locales/${locale}/translation.json`, import.meta.url), 'utf8'))
    await expect(page.getByTestId('choose-file-btn')).toHaveText(locale === 'en' ? 'Choose image' : bundle.tool.chooseFile)
  }
})
