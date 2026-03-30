import { test, expect } from '@playwright/test'

async function waitForProcessing(page) {
  const container = page.getByTestId('preview-container')
  await container.waitFor({ state: 'attached', timeout: 10000 })
  try {
    await expect(container).toHaveAttribute('aria-busy', 'true', { timeout: 2000 })
  } catch {
    // Some cached previews finish too quickly to observe the busy state.
  }
  await expect(container).toHaveAttribute('aria-busy', 'false', { timeout: 10000 })
}

async function getPaletteOptions(page) {
  return page.locator('#palette-select option').evaluateAll((nodes) =>
    nodes.map((node) => node.textContent?.trim()).filter(Boolean),
  )
}

async function getStoredCustomPalettes(page) {
  return page.evaluate(() => JSON.parse(window.localStorage.getItem('customPalettes') || '[]'))
}

function createRedPixelImage() {
  const b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQotAAAAAElFTkSuQmCC'
  return Buffer.from(b64, 'base64')
}

async function openEditorWithFixture(page) {
  await page.goto('/')
  const fileInput = page.getByTestId('file-input')
  await fileInput.setInputFiles({ name: 'red.png', mimeType: 'image/png', buffer: createRedPixelImage() })
  await waitForProcessing(page)
}

test('imports Lospec URLs and manual hex palettes into the editor library', async ({ page }) => {
  await page.route('https://lospec.com/palette-list/greyt-bit.json', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        name: 'Greyt-bit',
        author: 'skeddles',
        colors: ['574368', '8488d3', 'cfd3c1', 'f8c868'],
      }),
    })
  })

  await openEditorWithFixture(page)

  await page.getByRole('tab', { name: 'Import palette', exact: true }).click()

  await page.getByTestId('palette-import-input').fill('https://lospec.com/palette-list/greyt-bit')
  await page.getByTestId('palette-import-submit').click()
  await expect(page.getByText('Imported Greyt-bit.')).toBeVisible()
  await expect.poll(() => getPaletteOptions(page)).toContain('Greyt-bit (Lospec)')

  await page.getByTestId('palette-import-input').fill('#112233 #445566 #778899')
  await page.getByTestId('palette-import-name').fill('Evening Mix')
  await page.getByTestId('palette-import-submit').click()
  await expect(page.getByText('Imported Evening Mix.')).toBeVisible()
  await expect.poll(() => getPaletteOptions(page)).toContain('Evening Mix')
})

test('manual palette import falls back to the default name when the custom name is blank', async ({ page }) => {
  await openEditorWithFixture(page)

  await page.getByRole('tab', { name: 'Import palette', exact: true }).click()
  await page.getByTestId('palette-import-input').fill('#112233 #445566 #778899')
  await page.getByTestId('palette-import-name').fill('   ')
  await page.getByTestId('palette-import-submit').click()

  await expect(page.getByText('Palette imported.')).toBeVisible()
  await expect.poll(() => getPaletteOptions(page)).toContain('Imported Palette')
})

test('saving a duplicate custom palette asks before replacing it', async ({ page }) => {
  await openEditorWithFixture(page)

  await page.locator('#palette-name-input').fill('Evening Mix')
  await page.locator('#palette-color-input').fill('#112233')
  await page.getByRole('button', { name: 'Add color', exact: true }).click()
  await page.getByRole('button', { name: 'Save palette', exact: true }).click()

  await expect.poll(() => getStoredCustomPalettes(page)).toEqual([
    { name: 'Evening Mix', colors: ['#112233'] },
  ])

  await page.getByRole('button', { name: 'Reset form', exact: true }).click()
  await page.locator('#palette-name-input').fill('Evening Mix')
  await page.locator('#palette-color-input').fill('#445566')
  await page.getByRole('button', { name: 'Add color', exact: true }).click()

  page.once('dialog', async (dialog) => {
    await expect(dialog.message()).toContain('A custom palette named "Evening Mix" already exists.')
    await dialog.dismiss()
  })
  await page.getByRole('button', { name: 'Save palette', exact: true }).click()

  await expect.poll(() => getStoredCustomPalettes(page)).toEqual([
    { name: 'Evening Mix', colors: ['#112233'] },
  ])

  page.once('dialog', async (dialog) => {
    await expect(dialog.message()).toContain('A custom palette named "Evening Mix" already exists.')
    await dialog.accept()
  })
  await page.getByRole('button', { name: 'Save palette', exact: true }).click()

  await expect.poll(() => getStoredCustomPalettes(page)).toEqual([
    { name: 'Evening Mix', colors: ['#445566'] },
  ])
})

test('clear all custom palettes removes imported palettes and resets the active selection', async ({ page }) => {
  await openEditorWithFixture(page)

  await page.getByRole('tab', { name: 'Import palette', exact: true }).click()
  await page.getByTestId('palette-import-input').fill('#112233 #445566 #778899')
  await page.getByTestId('palette-import-name').fill('Evening Mix')
  await page.getByTestId('palette-import-submit').click()

  await expect(page.getByText('Imported Evening Mix.')).toBeVisible()
  await expect.poll(() => getPaletteOptions(page)).toContain('Evening Mix')

  await page.locator('#palette-select').selectOption('Evening Mix')
  await expect(page.locator('#palette-select')).toHaveValue('Evening Mix')

  page.once('dialog', async (dialog) => {
    await expect(dialog.message()).toContain('Delete all 1 custom palettes?')
    await dialog.accept()
  })

  await page.getByRole('tab', { name: 'Create palette', exact: true }).click()
  await page.getByTestId('palette-clear-all').click()

  await expect.poll(() => getPaletteOptions(page)).not.toContain('Evening Mix')
  await expect(page.locator('#palette-select')).toHaveValue('none')
})

test('Lospec network failures surface a fetch-specific message', async ({ page }) => {
  await page.route('https://lospec.com/palette-list/broken-fetch.json', async (route) => {
    await route.abort('failed')
  })

  await openEditorWithFixture(page)

  await page.getByRole('tab', { name: 'Import palette', exact: true }).click()
  await page.getByTestId('palette-import-input').fill('https://lospec.com/palette-list/broken-fetch')
  await page.getByTestId('palette-import-submit').click()

  await expect(
    page.getByText('We could not fetch that Lospec palette right now. Please check the link and try again.'),
  ).toBeVisible()
})
