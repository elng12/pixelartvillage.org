#!/usr/bin/env node
// Minimal unit assertions (no extra deps)
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'

import { inferAutoPaletteSize } from '../../src/utils/palette-utils.js'
import { hexToRgb } from '../../src/utils/palette-helpers.js'
import { clamp255, rgbToLab } from '../../src/utils/color-utils.js'
import { nearestColorIndex, applyPaletteToCtx } from '../../src/utils/palette-helpers.js'
import { getKMeansPalette } from '../../src/utils/kmeans-bridge.js'
import {
  extractPaletteHexColors,
  fetchLospecPalette,
  importPaletteFromInput,
  parsePaletteImportInput,
  normalizeHexColor,
} from '../../src/utils/palette-import.js'

const tests = []
let failed = 0
function test(name, fn) {
  tests.push({ name, fn })
}

function assertLocaleStrings(section, requiredKeys) {
  const localesDir = path.resolve('public/locales')

  for (const lang of fs.readdirSync(localesDir)) {
    const file = path.join(localesDir, lang, 'translation.json')
    if (!fs.existsSync(file)) continue
    const json = JSON.parse(fs.readFileSync(file, 'utf8'))
    for (const key of requiredKeys) {
      assert.ok(
        typeof json?.[section]?.[key] === 'string' && json[section][key].trim().length > 0,
        `Missing ${section}.${key} in ${lang}`,
      )
    }
  }
}

// inferAutoPaletteSize
test('inferAutoPaletteSize parses trailing number', () => {
  assert.strictEqual(inferAutoPaletteSize('Custom 12'), 12)
  assert.strictEqual(inferAutoPaletteSize('any 1'), 2) // clamped to >=2
  assert.strictEqual(inferAutoPaletteSize('name 128'), 64) // clamped to <=64
})
test('inferAutoPaletteSize falls back by name map', () => {
  assert.strictEqual(inferAutoPaletteSize('Hollow'), 8)
  assert.strictEqual(inferAutoPaletteSize('Lost Century'), 16)
})

// hexToRgb
test('hexToRgb works with full and short form', () => {
  assert.deepStrictEqual(hexToRgb('#ffffff'), [255, 255, 255])
  assert.deepStrictEqual(hexToRgb('#000'), [0, 0, 0])
})

// palette-import helpers
test('normalizeHexColor expands and uppercases hex values', () => {
  assert.strictEqual(normalizeHexColor('#abc'), '#AABBCC')
  assert.strictEqual(normalizeHexColor('123456'), '#123456')
  assert.strictEqual(normalizeHexColor('bad-value'), null)
})

test('extractPaletteHexColors dedupes and preserves order', () => {
  assert.deepStrictEqual(
    extractPaletteHexColors('#abc #ABC 123456 #654321'),
    ['#AABBCC', '#123456', '#654321'],
  )
})

test('parsePaletteImportInput recognizes Lospec URLs and manual hex lists', () => {
  const lospec = parsePaletteImportInput('https://lospec.com/palette-list/greyt-bit')
  const manual = parsePaletteImportInput('#112233 #445566 #778899')
  const pixilart = parsePaletteImportInput('https://www.pixilart.com/palettes/pastel-rainbow-90879')

  assert.deepStrictEqual(lospec, {
    type: 'lospec-url',
    url: 'https://lospec.com/palette-list/greyt-bit',
    jsonUrl: 'https://lospec.com/palette-list/greyt-bit.json',
  })
  assert.deepStrictEqual(manual, {
    type: 'hex-list',
    colors: ['#112233', '#445566', '#778899'],
  })
  assert.deepStrictEqual(pixilart, {
    type: 'pixilart-url',
    url: 'https://www.pixilart.com/palettes/pastel-rainbow-90879',
  })
})

test('importPaletteFromInput falls back to default name when name hint is blank', async () => {
  const imported = await importPaletteFromInput('#112233 #445566', { nameHint: '   ' })
  assert.strictEqual(imported.name, 'Imported Palette')
})

test('fetchLospecPalette maps thrown fetch errors to LOSPEC_FETCH_FAILED', async () => {
  await assert.rejects(
    () => fetchLospecPalette('https://lospec.com/palette-list/test.json', async () => {
      throw new TypeError('Failed to fetch')
    }),
    (error) => error?.code === 'LOSPEC_FETCH_FAILED',
  )
})

test('palette import locale keys exist in every shipped locale', () => {
  const requiredKeys = [
    'importSuccess',
    'importTab',
    'importTitle',
    'importDesc',
    'defaultImportedName',
    'directImportTitle',
    'directImportDesc',
    'directImportBadge',
    'directImportLabel',
    'directImportPlaceholder',
    'directImportNameLabel',
    'directImportNamePlaceholder',
    'importButton',
    'importing',
    'emptyImportInput',
    'unsupportedUrl',
    'fetchFailed',
    'noColorsFound',
    'pixilartBlocked',
    'curatedHeading',
    'pixilartHint',
    'importSuccessGeneric',
  ]
  assertLocaleStrings('paletteManager', requiredKeys)
})

test('support locale keys exist in every shipped locale', () => {
  assertLocaleStrings('footer', ['supportTitle', 'supportDesc'])
  assertLocaleStrings('contact', ['supportEyebrow', 'supportTitle', 'emailCta', 'emailHint'])
})

// clamp255
test('clamp255 clamps and rounds', () => {
  assert.strictEqual(clamp255(-10), 0)
  assert.strictEqual(clamp255(300), 255)
  assert.strictEqual(clamp255(12.6), 13)
})

// rgbToLab (basic monotonic sanity)
test('rgbToLab returns finite values and monotonic L', () => {
  const [L1] = rgbToLab(0, 0, 0)
  const [L2] = rgbToLab(255, 255, 255)
  assert.ok(Number.isFinite(L1) && Number.isFinite(L2))
  assert.ok(L2 > L1)
})

// palette-helpers: nearestColorIndex basic behaviour
test('nearestColorIndex selects closest Euclidean RGB', () => {
  const pal = [[255,0,0],[0,255,0]] // red, green
  const idx1 = nearestColorIndex(200, 10, 10, pal)
  const idx2 = nearestColorIndex(10, 200, 10, pal)
  assert.strictEqual(idx1, 0)
  assert.strictEqual(idx2, 1)
})

// palette-helpers: applyPaletteToCtx maps pixels to palette
test('applyPaletteToCtx quantizes to given palette', () => {
  const width = 2, height = 1
  // RGBA data: pixel0=(250,10,10,255) -> red, pixel1=(10,240,10,255) -> green
  const data = new Uint8ClampedArray([250,10,10,255, 10,240,10,255])
  const imageData = { data }
  const ctx = {
    getImageData: () => imageData,
    putImageData: (_img, _x, _y) => { /* no-op; imageData mutated in place */ }
  }
  const pal = [[255,0,0],[0,255,0]]
  applyPaletteToCtx(ctx, width, height, pal, false, null)
  assert.deepStrictEqual(Array.from(data), [255,0,0,255, 0,255,0,255])
})

// kmeans-bridge: smoke in Node (expect DOM lack)
test('getKMeansPalette exists (smoke)', () => {
  assert.strictEqual(typeof getKMeansPalette, 'function')
})

for (const { name, fn } of tests) {
  try {
    await fn()
    console.log(`✓ ${name}`)
  } catch (e) {
    failed++
    console.error(`✗ ${name}:`, e.message)
  }
}

if (failed) {
  console.error(`\nUnit tests failed: ${failed}`)
  process.exit(1)
}

console.log('\nAll unit tests passed.')
