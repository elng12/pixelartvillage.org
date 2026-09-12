// Minimal i18n E2E checks (Playwright) — ESM style
import { test, expect } from '@playwright/test'
import { readFileSync } from 'node:fs'
import sharp from 'sharp'

const es = JSON.parse(readFileSync(new URL('../public/locales/es/translation.json', import.meta.url), 'utf8'))
const en = JSON.parse(readFileSync(new URL('../public/locales/en/translation.json', import.meta.url), 'utf8'))
const spanishHomeTitle = 'Convertidor de Imagen a Arte Píxel | Pixel Art Village'
const spanishHomeDescription = 'Convierte imágenes en arte píxel gratis y online. Sube PNG, JPG, GIF o WEBP, ajusta el tamaño de píxel y la paleta, previsualiza y exporta en tu navegador.'
const englishHomeTitle = 'Image to Pixel Art Converter | Pixel Art Village'
const englishHomeDescription = 'Turn images into pixel art online with live preview, palette controls, dithering, and private browser-based processing for PNG, JPG, GIF, and WEBP files.'
const translationResidue = /English translation:|Wait, I need to clarify|If you meant to provide English text/

async function expectNoHorizontalOverflow(page) {
  await expect.poll(() => page.evaluate(() => (
    Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth
  ))).toBeLessThanOrEqual(1)
}

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

test.describe('Spanish homepage initial HTML', () => {
  test.use({ javaScriptEnabled: false })

  test('prerendered content is Spanish without changing the approved metadata', async ({ page }) => {
    const response = await page.goto('/es/')
    expect(response.status()).toBe(200)
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
    await expect(page).toHaveTitle(spanishHomeTitle)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', spanishHomeDescription)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://pixelartvillage.org/es/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Convertidor de Imagen a Arte Píxel')
    await expect(page.locator('main')).not.toContainText(translationResidue)
    await expect(page.locator('main')).not.toContainText(en.home.heroTitle)
    await expect(page.locator('main')).not.toContainText('Our image to pixel art converter gives precise palette control.')
    await expect(page.locator('#faq article').last().locator('p')).toHaveText(es.home.faqFormatAnswer)
  })
})

test.describe('Spanish homepage runtime', () => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    test(`Spanish content and layout at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport)
      await page.goto('/es/')

      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Convertidor de Imagen a Arte Píxel')
      await expect(page.getByTestId('upload-zone')).toBeVisible()
      await expect(page.getByTestId('choose-file-btn')).toBeVisible()
      await expect(page.getByText(es.home.heroSubtitle, { exact: true })).toBeVisible()
      await expect(page.getByText(es.home.heroSubtitle2, { exact: true })).toBeVisible()
      await expect(page.getByText(es.home.entrySupports, { exact: true })).toBeVisible()
      await expect(page.locator('a[href="#main-content"]')).toHaveText(es.home.skipToMain)
      await expectNoHorizontalOverflow(page)

      const explore = page.getByRole('heading', { level: 2, name: es.home.exploreHeading, exact: true })
      await explore.scrollIntoViewIfNeeded()
      await expect(explore).toBeVisible()
      for (const [key, slug] of [
        ['photoToPixel', 'photo-to-pixel-art'],
        ['photoToSprite', 'photo-to-sprite-converter'],
        ['pngToPixel', 'png-to-pixel-art'],
        ['gifToPixel', 'gif-to-pixel-art'],
      ]) {
        const link = page.locator(`main a[href="/es/converter/${slug}/"]`).filter({ hasText: es.home.cards[key].description })
        await expect(link).toContainText(es.home.cards[key].title)
        await expect(link).toContainText(es.home.cards[key].description)
      }
      await expect(page.getByText(es.home.paletteDescription, { exact: true })).toHaveCount(1)

      const faq = page.locator('#faq')
      await faq.scrollIntoViewIfNeeded()
      await expect(faq.locator('article')).toHaveCount(7)
      await expect(faq.locator('article').last().locator('h3')).toHaveText(es.faq.items[6].question)
      await expect(faq.locator('article').last().locator('p')).toHaveText(es.home.faqFormatAnswer)
      await expect(faq).not.toContainText(translationResidue)
      await expect(page.locator('main')).not.toContainText(en.home.heroSubtitle)
      await expect(page.locator('main')).not.toContainText(en.home.exploreHeading)
      await expectNoHorizontalOverflow(page)

      const footer = page.locator('footer')
      await footer.scrollIntoViewIfNeeded()
      await expect(footer).toContainText(es.home.footer.mediaFeaturedIn)
      await expect(footer).not.toContainText(en.footer.mediaFeaturedIn)
      await expect(footer.locator('a[href="/es/converter/photo-to-sprite-converter/"]')).toHaveText(es.home.footer.links.photo2sprite)
      await expect(footer.locator('img[alt^="Featured on"], img[alt^="Listed on"]')).toHaveCount(0)
      await expectNoHorizontalOverflow(page)
    })
  }

  test('homepage overrides do not leak into English or Spanish inner pages', async ({ page }) => {
    await page.goto('/es/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Convertidor de Imagen a Arte Píxel')
    if (process.env.EXPECT_CONSENT_BANNER === '1') {
      await page.getByRole('button', { name: es.consent.rejectLabel, exact: true }).click()
    }
    const select = page.locator('#language-switcher, select[aria-label="Language"]')
    await select.selectOption('en')

    await expect(page).toHaveURL((url) => url.pathname === '/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page).toHaveTitle(englishHomeTitle)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', englishHomeDescription)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(en.home.heroTitle)
    await expect(page.locator('footer')).toContainText(en.footer.mediaFeaturedIn)
    await expect(page.locator('footer')).not.toContainText(es.home.footer.mediaFeaturedIn)

    await select.selectOption('es')
    await expect(page).toHaveURL(/\/es\/$/)
    await page.locator('footer a[href="/es/about/"]').click()
    await expect(page).toHaveURL(/\/es\/about\/$/)
    await expect(page.locator('footer')).not.toContainText(es.home.footer.mediaFeaturedIn)
    await expect(page.locator('footer a[href="/es/converter/photo-to-sprite-converter/"]')).not.toHaveText(es.home.footer.links.photo2sprite)
    await expect(page.locator('main')).not.toContainText(es.home.paletteDescription)

    // The existing SPA translation preloader issue is outside this homepage-only change.
    await page.goto('/es/about/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'es')
    await expect(page.locator('footer')).toContainText(es.footer.mediaFeaturedIn)
    await expect(page.locator('footer')).not.toContainText(es.home.footer.mediaFeaturedIn)
    await expect(page.locator('footer a[href="/es/converter/image-to-pixel-art/"]')).toHaveText(es.footer.links.generator)
    await expect(page.locator('footer a[href="/es/converter/photo-to-sprite-converter/"]')).toHaveText(en.footer.links.photo2sprite)

    await page.locator('header a[href="/es/"]').click()
    await expect(page).toHaveURL(/\/es\/$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Convertidor de Imagen a Arte Píxel')
    await expect(page.locator('#faq article').last().locator('p')).toHaveText(es.home.faqFormatAnswer)
    await expect(page.locator('footer')).toContainText(es.home.footer.mediaFeaturedIn)
  })

  test('Spanish homepage uploads, adjusts, and downloads a transparent PNG', async ({ page }) => {
    await page.goto('/es/')
    if (process.env.EXPECT_CONSENT_BANNER === '1') {
      await page.getByRole('button', { name: es.consent.rejectLabel, exact: true }).click()
    }

    const source = await page.request.get('/sprite-mana-source.png')
    expect(source.status()).toBe(200)
    const sourceBuffer = await source.body()
    expect(await sharp(sourceBuffer).metadata()).toMatchObject({ width: 228, height: 228, hasAlpha: true })
    await page.getByTestId('file-input').setInputFiles({ name: 'mana.png', mimeType: 'image/png', buffer: sourceBuffer })

    const preview = page.getByTestId('preview-container')
    const previewImage = preview.locator('img')
    await expect(preview).toHaveAttribute('aria-busy', 'false')
    await expect(previewImage).toHaveAttribute('src', /^data:image\/png/)
    const initialPreview = await previewImage.getAttribute('src')
    const pixelSlider = page.locator('#pixel-size-slider')
    await pixelSlider.scrollIntoViewIfNeeded()
    await pixelSlider.press('Home')
    await expect(page.locator('label[for="pixel-size-slider"]')).toHaveText('Tamaño de píxel: 1')
    for (let step = 0; step < 5; step += 1) {
      await pixelSlider.press('ArrowRight')
      await expect(page.locator('label[for="pixel-size-slider"]')).toHaveText(`Tamaño de píxel: ${step + 2}`)
    }
    await expect(pixelSlider).toHaveValue('6')
    await expect(preview).toHaveAttribute('aria-busy', 'false')
    await expect(previewImage).not.toHaveAttribute('src', initialPreview)

    const pixelPreview = await previewImage.getAttribute('src')
    await page.locator('#palette-select').selectOption('Pico-8')
    await expect(page.locator('#palette-select')).toHaveValue('Pico-8')
    await expect(preview).toHaveAttribute('aria-busy', 'false')
    await expect(previewImage).not.toHaveAttribute('src', pixelPreview)
    await page.locator('#format-select').selectOption('png')
    await page.locator('#transparent-bg').check()
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()

    const pendingDownload = page.waitForEvent('download')
    await page.getByRole('button', { name: es.editor.downloadBtn, exact: true }).last().click()
    const downloadPath = await (await pendingDownload).path()
    const result = sharp(downloadPath)
    expect(await result.metadata()).toMatchObject({ format: 'png', width: 38, height: 38, hasAlpha: true })
    const { data, info } = await result.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    for (const [x, y] of [[0, 0], [37, 0], [0, 37], [37, 37]]) {
      expect(data[(y * info.width + x) * info.channels + 3], `alpha at ${x}, ${y}`).toBe(0)
    }
    expect(data.some((value, index) => index % info.channels === 3 && value > 0), 'the output retains visible image pixels').toBe(true)
    await test.info().attach('es-mana-pixel6-pico8.png', { path: downloadPath, contentType: 'image/png' })
  })

  test('production cookie banner uses Spanish homepage copy', async ({ page }) => {
    // The standard VITE_E2E build deliberately omits this banner.
    test.skip(process.env.EXPECT_CONSENT_BANNER !== '1', 'Run with EXPECT_CONSENT_BANNER=1 against a non-E2E build.')
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/es/')

    const banner = page.getByRole('region', { name: es.consent.bannerLabel, exact: true })
    await expect(banner).toBeVisible()
    await expect(banner).toContainText(es.home.consentDescription)
    await expect(banner).not.toContainText('We use cookies')
    await expect(banner.getByRole('link', { name: es.home.adsSettingsLabel, exact: true })).toHaveAttribute('href', 'https://adssettings.google.com/')
    await banner.getByRole('button', { name: es.consent.rejectLabel, exact: true }).click()
    await expect(banner).toHaveCount(0)
  })
})
