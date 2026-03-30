#!/usr/bin/env node
// Keyword density checker (site-level aggregation)
// Scans dist/**/index.html and reports counts for the target phrase vs comparators

import fs from 'node:fs'
import path from 'node:path'

const DIST = path.resolve('dist')
const PAGES = []
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const stat = fs.statSync(p)
    if (stat.isDirectory()) walk(p)
    else if (name === 'index.html') PAGES.push(p)
  }
}
if (!fs.existsSync(DIST)) {
  console.error('dist/ not found. Run `npm run build` first.')
  process.exit(2)
}
walk(DIST)

const TARGET = 'image to pixel art'
// Compare with other multi-word phrases instead of single tokens
const COMPETITORS = [
  'pixel art maker',
  'pixel art converter',
  'photo to pixel art',
  'turn photo into pixel art',
  'pixelate image online',
  'photo to sprite converter',
  'retro game graphics maker',
  '8-bit art generator'
]

function getText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function countPhrase(text, phrase) {
  const re = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
  const matches = text.match(re)
  return matches ? matches.length : 0
}

let totalWords = 0
let site = { [TARGET]: 0 }
for (const c of COMPETITORS) site[c] = 0

for (const file of PAGES) {
  const html = fs.readFileSync(file, 'utf8')
  const text = getText(html)
  const words = text.split(/\s+/).filter(Boolean)
  totalWords += words.length
  site[TARGET] += countPhrase(text, TARGET)
  for (const c of COMPETITORS) site[c] += countPhrase(text, c)
}

const entries = Object.entries(site).map(([k, v]) => ({ key: k, count: v, ratio: (v / totalWords) * 100 }))
entries.sort((a, b) => b.count - a.count)

console.log('Scanned pages:', PAGES.length)
console.log('Total words:', totalWords)
for (const { key, count, ratio } of entries) {
  console.log(`${key}\t${count}\t${ratio.toFixed(2)}%`)
}

const top = entries[0]
if (top.key !== TARGET) {
  console.error(`\nFAIL: "${TARGET}" is not the top keyword site‑wide. Top is "${top.key}" (${top.count}).`)
  process.exit(1)
}
console.log(`\nOK: "${TARGET}" is the most frequent across the site.`)
