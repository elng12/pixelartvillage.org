import sharp from 'sharp'
import { test, expect } from '@playwright/test'

async function enlargeSpritePreview(page) {
  const slider = page.getByRole('slider', { name: /^Zoom:/ })
  await slider.scrollIntoViewIfNeeded()
  const box = await slider.boundingBox()
  await slider.click({ position: { x: box.width * 0.75, y: box.height / 2 } })
  await expect.poll(async () => Number(await slider.inputValue())).toBeGreaterThan(4)
}

test('sprite SEO is present in initial HTML and its example matches a real export', async ({ page, request }) => {
  const route = '/converter/photo-to-sprite-converter/'
  const response = await request.get(route)
  expect(response.status()).toBe(200)
  const html = await response.text()
  await page.goto(route)
  const audit = await page.evaluate((html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const title = doc.title
    const description = doc.querySelector('meta[name="description"]').content
    const metadata = Object.fromEntries(['og:title', 'og:description', 'twitter:title', 'twitter:description'].map((key) => [key, doc.querySelector(`meta[property="${key}"],meta[name="${key}"]`).content]))
    const schemas = [...doc.querySelectorAll('script[type="application/ld+json"]')].flatMap((el) => JSON.parse(el.textContent))
    const faq = schemas.find((entry) => entry['@type'] === 'FAQPage')
    return {
      title, description, metadata,
      canonical: doc.querySelector('link[rel="canonical"]').href,
      h1: [...doc.querySelectorAll('h1')].map((el) => el.textContent),
      faq: faq.mainEntity.map((item) => ({ question: item.name, answer: item.acceptedAnswer.text })),
      visibleFaq: [...doc.querySelectorAll('#faq article')].map((el) => ({ question: el.querySelector('h3').textContent, answer: el.querySelector('p').textContent })),
    }
  }, html)
  // Preserve approved metadata; only the primary phrase has a frequency-rank requirement.
  expect(audit.title).toBe('Photo to Sprite Converter - Free PNG | Pixel Art Village')
  expect(audit.description).toBe('Photo to Sprite Converter turns photos and PNGs into single sprite-style images. Adjust pixel size and palettes, preview changes, and download PNGs for free.')
  expect(audit.h1).toEqual(['Photo to Sprite Converter'])
  expect(audit.canonical).toBe(`https://pixelartvillage.org${route}`)
  expect(audit.faq).toEqual(audit.visibleFaq)
  expect(audit.metadata['og:title']).toBe(audit.title)
  expect(audit.metadata['twitter:title']).toBe(audit.title)
  expect(audit.metadata['og:description']).toBe(audit.description)
  expect(audit.metadata['twitter:description']).toBe(audit.description)
  const robots = await request.get('/robots.txt')
  expect(robots.status()).toBe(200)
  expect(await robots.text()).not.toContain('Disallow: /converter/')
  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.status()).toBe(200)
  expect(await sitemap.text()).toContain(`https://pixelartvillage.org${route}`)
  await test.info().attach('sprite-metadata-and-faq', { body: JSON.stringify(audit, null, 2), contentType: 'application/json' })

  const phraseCounts = await page.evaluate(() => {
    const words = document.body.innerText.toLowerCase().match(/[a-z0-9]+(?:['-][a-z0-9]+)*/g) || []
    const counts = {}
    for (let i = 0; i <= words.length - 4; i += 1) {
      const phrase = words.slice(i, i + 4).join(' ')
      counts[phrase] = (counts[phrase] || 0) + 1
    }
    return counts
  })
  const primary = 'photo to sprite converter'
  const competitors = Object.entries(phraseCounts).filter(([phrase]) => phrase !== primary)
  expect(phraseCounts[primary]).toBeGreaterThan(Math.max(...competitors.map(([, count]) => count)))
  await test.info().attach('sprite-visible-four-word-frequency', {
    body: JSON.stringify(Object.entries(phraseCounts).sort((a, b) => b[1] - a[1]).slice(0, 15), null, 2),
    contentType: 'application/json',
  })

  const example = page.getByTestId('sprite-example')
  await expect(example.locator('img')).toHaveCount(2)
  await example.scrollIntoViewIfNeeded()
  await expect.poll(() => example.locator('img').evaluateAll((images) => images.every((img) => img.complete && img.naturalWidth > 0))).toBe(true)
  await expect(example.getByRole('link', { name: /Free Health and Mana Potions/ })).toHaveAttribute('href', 'https://opengameart.org/content/free-health-and-mana-potions')
  await expect(example.getByRole('link', { name: 'CC0', exact: true })).toHaveAttribute('href', 'https://creativecommons.org/publicdomain/zero/1.0/')
  const artifact = await request.get('/sprite-mana-pixel6.png')
  expect(artifact.status()).toBe(200)
  const stored = sharp(await artifact.body())
  expect((await stored.metadata()).width).toBe(38)
  expect((await stored.metadata()).height).toBe(38)
  await page.getByRole('button', { name: 'Try demo image', exact: true }).click()
  const preview = page.getByTestId('preview-container')
  await expect(preview.locator('img')).toHaveAttribute('src', /^data:image\/png/)
  await expect(preview).toHaveAttribute('aria-busy', 'false')
  await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
  const pending = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download Pixel Art Image', exact: true }).last().click()
  const downloaded = sharp(await (await pending).path())
  expect((await downloaded.raw().toBuffer()).equals(await stored.raw().toBuffer()), 'case pixels match a fresh Chromium export').toBe(true)
  const { data, info } = await downloaded.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (const index of [0, 37, 37 * 38, 38 * 38 - 1]) expect(data[index * 4 + 3]).toBe(0)
  expect(data[(19 * info.width + 19) * 4 + 3]).toBe(255)
  await enlargeSpritePreview(page)
  await page.getByRole('button', { name: 'Original size', exact: true }).click()
  const originalPending = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download Pixel Art Image', exact: true }).last().click()
  const original = sharp(await (await originalPending).path())
  expect((await original.metadata()).width).toBe(228)
  expect((await original.metadata()).height).toBe(228)
  expect((await original.ensureAlpha().raw().toBuffer())[3]).toBe(0)
})

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

test('sprite page keeps the complete upload area ahead of supporting content', async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/converter/photo-to-sprite-converter/')

    await expect(page).toHaveTitle('Photo to Sprite Converter - Free PNG | Pixel Art Village')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Photo to Sprite Converter')
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href', 'https://pixelartvillage.org/converter/photo-to-sprite-converter/'
    )
    await expect(page.getByTestId('primary-converter-callout-top')).toHaveCount(0)
    await expect(page.getByTestId('primary-converter-callout-bottom')).toHaveCount(0)

    const upload = await page.getByTestId('upload-zone').boundingBox()
    const heading = await page.getByRole('heading', { level: 1 }).boundingBox()
    const details = await page.getByRole('heading', { name: 'A transparent item, converted' }).boundingBox()
    expect(upload).not.toBeNull()
    expect(heading).not.toBeNull()
    expect(details).not.toBeNull()
    expect(upload.y).toBeGreaterThan(heading.y + heading.height)
    expect(upload.y + upload.height).toBeLessThan(viewport.height)
    expect(details.y).toBeGreaterThan(upload.y + upload.height)
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
    await test.info().attach(`sprite-first-viewport-${viewport.width}`, {
      body: await page.screenshot(),
      contentType: 'image/png',
    })

    await expect(page.getByTestId('choose-file-btn')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Adjust the pixels', exact: true })).toBeVisible()
    await expect(page.locator('#how-it-works')).toHaveCount(0)
    await expect(page.getByTestId('sprite-guide').locator('tbody tr')).toHaveCount(4)
    await expect(page.getByRole('heading', { name: 'Choose an export size', exact: true })).toBeVisible()
    await expect(page.getByText('Does this create a sprite sheet or animation frames?', { exact: true })).toBeVisible()

    const structuredData = await page.locator('script[type="application/ld+json"]').evaluateAll(
      (scripts) => scripts.flatMap((script) => {
        const value = JSON.parse(script.textContent)
        return Array.isArray(value) ? value : [value]
      })
    )
    const faq = structuredData.find((entry) => entry['@type'] === 'FAQPage')
    const howTo = structuredData.find((entry) => entry['@type'] === 'HowTo')
    expect(faq.mainEntity).toHaveLength(5)
    for (const item of faq.mainEntity) {
      await expect(page.locator('#faq').getByText(item.name, { exact: true })).toBeVisible()
      await expect(page.locator('#faq').getByText(item.acceptedAnswer.text, { exact: true })).toBeVisible()
    }
    for (const step of howTo.step) {
      await expect(page.getByText(step.name, { exact: true }).first()).toBeVisible()
    }
    expect(howTo.step.map((step) => step.name)).toEqual([
      'Choose image',
      'Adjust the pixels',
      'Choose an export size',
    ])
    const guide = await page.getByTestId('sprite-guide').boundingBox()
    const faqBox = await page.locator('#faq').boundingBox()
    const related = await page.getByRole('heading', { name: 'Explore other converters', exact: true }).boundingBox()
    expect(details.y).toBeLessThan(guide.y)
    expect(guide.y).toBeLessThan(faqBox.y)
    expect(faqBox.y).toBeLessThan(related.y)
    await test.info().attach(`sprite-full-page-${viewport.width}`, {
      body: await page.screenshot({ fullPage: true }), contentType: 'image/png',
    })

    // The licensed case image also exercises real upload, adjustment, and download on both viewports.
    const source = await page.request.get('/sprite-mana-source.png')
    expect(source.status()).toBe(200)
    await page.getByTestId('file-input').setInputFiles({ name: 'mana.png', mimeType: 'image/png', buffer: await source.body() })
    const preview = page.getByTestId('preview-container')
    await expect(preview).toHaveAttribute('aria-busy', 'false')
    await expect(preview.locator('img')).toHaveAttribute('src', /^data:image\/png/)
    const initial = await preview.locator('img').getAttribute('src')
    await page.getByRole('slider', { name: /^Pixel Size:/ }).press('ArrowRight')
    await expect(page.getByRole('slider', { name: /^Pixel Size:/ })).toHaveValue('7')
    await page.getByLabel('Palette', { exact: true }).selectOption('Pico-8')
    await expect(preview).toHaveAttribute('aria-busy', 'false')
    await expect(preview.locator('img')).not.toHaveAttribute('src', initial)
    await enlargeSpritePreview(page)
    await page.getByRole('button', { name: 'Pixel size', exact: true }).click()
    const pending = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Download Pixel Art Image', exact: true }).last().click()
    const result = sharp(await (await pending).path())
    const metadata = await result.metadata()
    expect(metadata.format).toBe('png')
    expect(metadata.width).toBe(32)
    expect(metadata.height).toBe(32)
    expect((await result.ensureAlpha().raw().toBuffer())[3]).toBe(0)
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
    await preview.scrollIntoViewIfNeeded()
    await test.info().attach(`sprite-uploaded-${viewport.width}`, {
      body: await page.screenshot(), contentType: 'image/png',
    })
  }
})

test('sprite upload recovers from invalid input and exports existing PNG transparency', async ({ page }) => {
  await page.goto('/converter/photo-to-sprite-converter/')
  const input = page.getByTestId('file-input')
  await input.setInputFiles({ name: 'invalid.txt', mimeType: 'text/plain', buffer: Buffer.from('not an image') })
  await expect(page.getByRole('alert')).toBeVisible()
  await expect(page.getByTestId('preview-container')).toHaveCount(0)

  // Synthetic transparent-border fixture, not a photo-quality assessment.
  const buffer = await sharp({
    create: { width: 32, height: 32, channels: 4, background: { r: 40, g: 180, b: 80, alpha: 1 } },
  }).extend({ top: 16, bottom: 16, left: 16, right: 16, background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
  await input.setInputFiles({ name: 'sprite-fixture.png', mimeType: 'image/png', buffer })
  await expect(page.getByRole('alert')).toHaveCount(0)
  const preview = page.getByTestId('preview-container')
  await expect(preview).toHaveAttribute('aria-busy', 'false')
  const pixelSize = page.getByRole('slider', { name: /^Pixel Size:/ })
  await expect(pixelSize).toHaveValue('6')
  await expect(page.getByRole('heading', { level: 2, name: 'Photo to Sprite Converter', exact: true })).toBeVisible()
  await expect(preview.locator('img')).toHaveAttribute('src', /^data:image\/png/)
  const oldPreview = await preview.locator('img').getAttribute('src')
  for (const invalidFile of [
    { name: 'invalid.txt', mimeType: 'text/plain', buffer: Buffer.from('not an image') },
    { name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('invalid PNG bytes') },
    { name: 'oversized.png', mimeType: 'image/png', buffer: Buffer.alloc(10 * 1024 * 1024 + 1) },
  ]) {
    await input.setInputFiles(invalidFile)
    await expect(page.getByRole('alert')).toBeVisible()
    await expect(preview.locator('img')).toHaveAttribute('src', oldPreview)
  }
  await input.setInputFiles({ name: 'sprite-fixture.png', mimeType: 'image/png', buffer })
  await expect(page.getByRole('alert')).toHaveCount(0)
  await expect(preview).toHaveAttribute('aria-busy', 'false')
  await expect(page.locator('#upload-instructions')).toHaveCount(1)
  await expect(page.locator('#upload-supports')).toHaveCount(1)
  await pixelSize.press('ArrowRight')
  await expect(pixelSize).toHaveValue('7')
  await expect(page.locator('#transparent-bg')).toBeChecked()
  await page.getByRole('button', { name: 'Original size', exact: true }).click()

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Download Pixel Art Image', exact: true }).last().click()
  const download = await downloadPromise
  const result = sharp(await download.path())
  const metadata = await result.metadata()
  const { data } = await result.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  expect(metadata.format).toBe('png')
  expect(metadata.width).toBe(64)
  expect(metadata.height).toBe(64)
  expect(data[3]).toBe(0)
  expect(data[((32 * 64 + 32) * 4) + 3]).toBe(255)
})

test('sprite mobile settings flow naturally and preview supports horizontal touch scrolling', async ({ page, browserName }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/converter/photo-to-sprite-converter/')
  await expect(page.getByTestId('sprite-example')).toContainText('Actual conversion')
  await expect(page.getByText('8-Bit Sprite Result', { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Try demo image', exact: true }).click()
  const preview = page.getByTestId('preview-container')
  await expect(preview).toHaveAttribute('aria-busy', 'false')
  await expect(preview.locator('img')).toHaveAttribute('src', /^data:image\/png/)
  await expect(page.getByTestId('upload-zone')).toHaveCSS('min-height', '0px')
  await expect(page.getByTestId('editor-controls')).toHaveCSS('overflow-y', 'visible')
  await expect(preview).toHaveCSS('touch-action', 'auto')
  await enlargeSpritePreview(page)
  await preview.scrollIntoViewIfNeeded()
  await expect.poll(() => preview.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true)
  // Oversized images must remain reachable from their left/top edge, not centered off-screen.
  const edges = await preview.evaluate((el) => {
    const image = el.querySelector('img').getBoundingClientRect()
    const frame = el.getBoundingClientRect()
    return { x: image.left - frame.left + el.scrollLeft, y: image.top - frame.top + el.scrollTop }
  })
  expect(edges.x).toBeGreaterThanOrEqual(0)
  expect(edges.y).toBeGreaterThanOrEqual(0)
  if (browserName === 'chromium') {
    const session = await page.context().newCDPSession(page)
    await session.send('Emulation.setTouchEmulationEnabled', { enabled: true })
    const box = await preview.boundingBox()
    await session.send('Input.synthesizeScrollGesture', {
      x: box.x + box.width / 2, y: box.y + box.height / 2,
      xDistance: -160, yDistance: 0, gestureSourceType: 'touch',
    })
    await expect.poll(() => preview.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0)
    await session.detach()
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false)
})

test('sprite mobile download stays below the site header while scrolling settings', async ({ page }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 820, height: 1180 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/converter/photo-to-sprite-converter/')
    await page.getByRole('button', { name: 'Try demo image', exact: true }).click()
    await expect(page.getByTestId('preview-container')).toHaveAttribute('aria-busy', 'false')
    const controls = page.getByTestId('editor-controls')
    const download = controls.getByRole('button', { name: 'Download Pixel Art Image', exact: true })
    await expect(download).toBeEnabled()
    await controls.evaluate((el) => window.scrollTo({
      top: window.scrollY + el.getBoundingClientRect().top + 200, behavior: 'instant',
    }))
    await expect.poll(async () => (await controls.boundingBox()).y).toBeLessThan(0)

    const header = await page.getByRole('banner').boundingBox()
    const button = await download.boundingBox()
    expect(button.y).toBeGreaterThanOrEqual(header.y + header.height)
    expect(button.y + button.height).toBeLessThan(viewport.height)
    expect(await download.evaluate((el) => {
      const rect = el.getBoundingClientRect()
      return el.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2))
    })).toBe(true)

    const scrollY = await page.evaluate(() => window.scrollY)
    const downloadPromise = page.waitForEvent('download')
    await download.click()
    const result = await downloadPromise
    expect(await result.failure()).toBeNull()
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollY)
    await test.info().attach(`sprite-sticky-download-${viewport.width}`, {
      body: await page.screenshot(), contentType: 'image/png',
    })
  }
})

test('sprite layout and preset reset do not change home or other converters', async ({ page }) => {
  // Synthetic fixture isolates layout and reset behavior, not image quality.
  const buffer = await sharp({ create: { width: 64, height: 64, channels: 4, background: '#287850' } }).png().toBuffer()
  for (const route of ['/', '/converter/png-to-pixel-art/', '/converter/photo-to-sprite-converter/']) {
    const sprite = route.includes('sprite')
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(route)
    if (sprite) await expect(page.locator('#how-it-works')).toHaveCount(0)
    else await expect(page.locator('#how-it-works h2')).toHaveCSS('font-size', '36px')
    await expect(page.locator('#faq h2')).toHaveCSS('font-size', sprite ? '24px' : '36px')
    if (route !== '/') {
      const faq = await page.locator('#faq').boundingBox()
      const related = await page.getByRole('heading', { name: 'Explore other converters', exact: true }).boundingBox()
      expect(faq.y < related.y).toBe(sprite)
    }
    await page.setViewportSize({ width: 390, height: 844 })
    await page.getByTestId('file-input').setInputFiles({ name: 'reset-fixture.png', mimeType: 'image/png', buffer })
    await expect(page.getByTestId('preview-container')).toHaveAttribute('aria-busy', 'false')
    await expect(page.getByTestId('editor-controls')).toHaveCSS('overflow-y', sprite ? 'visible' : 'auto')
    const palette = page.getByLabel('Palette', { exact: true })
    await palette.selectOption('Pico-8')
    await expect(palette).toHaveValue('Pico-8')
    await page.getByRole('button', { name: 'Reset All', exact: true }).click()
    await expect(palette).toHaveValue(sprite ? 'none' : 'Pico-8')
    await expect(page.getByRole('slider', { name: /^Pixel Size:/ })).toHaveValue(sprite ? '6' : '1')
    await page.setViewportSize({ width: 1440, height: 900 })
    await expect(page.getByTestId('editor-controls')).toHaveCSS('overflow-y', 'auto')
    const toolbar = page.getByTestId('editor-controls').locator(':scope > div').first()
    await expect(toolbar).toHaveCSS('position', 'sticky')
    await expect(toolbar).toHaveCSS('top', '0px')
  }
  await page.goto('/es/converter/photo-to-sprite-converter/')
  await expect(page).toHaveTitle('Photo to Sprite Converter | Pixel Art Village')
  await expect(page.getByTestId('sprite-example')).toHaveCount(0)
  await expect(page.getByTestId('sprite-guide')).toHaveCount(0)
  await expect(page.locator('#how-it-works h2')).toHaveText('Cómo funciona pixel art Village')
  await expect(page.locator('#faq article')).toHaveCount(7)
})
