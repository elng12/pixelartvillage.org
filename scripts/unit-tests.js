#!/usr/bin/env node
// Minimal unit assertions (no extra deps)
import assert from 'node:assert'

import { inferAutoPaletteSize } from '../src/utils/palette-utils.js'
import { hexToRgb } from '../src/utils/palette-helpers.js'
import { clamp255, rgbToLab } from '../src/utils/color-utils.js'
import { nearestColorIndex, applyPaletteToCtx } from '../src/utils/palette-helpers.js'
import { getKMeansPalette } from '../src/utils/kmeans-bridge.js'

let failed = 0
function test(name, fn) {
  try { fn(); console.log(`✓ ${name}`) } catch (e) { failed++; console.error(`✗ ${name}:`, e.message) }
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

if (failed) {
  console.error(`\nUnit tests failed: ${failed}`)
  process.exit(1)
} else {
  console.log('\nAll unit tests passed.')
}
