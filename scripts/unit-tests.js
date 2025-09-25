#!/usr/bin/env node
// Minimal unit assertions (no extra deps)
import assert from 'node:assert'

import { inferAutoPaletteSize } from '../src/utils/palette-utils.js'
import { hexToRgb, clamp255, rgbToLab } from '../src/utils/imageProcessor.js'

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

if (failed) {
  console.error(`\nUnit tests failed: ${failed}`)
  process.exit(1)
} else {
  console.log('\nAll unit tests passed.')
}

