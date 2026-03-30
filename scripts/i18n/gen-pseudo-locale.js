#!/usr/bin/env node
// Generate pseudo-locale from English translations for visual QA
// Usage: node scripts/gen-pseudo-locale.js [outLang]
// Default outLang = 'pseudo'

import fs from 'node:fs'
import path from 'node:path'

const OUT_LANG = process.argv[2] || 'pseudo'
const SRC = path.resolve('public/locales/en/translation.json')
const OUT_DIR = path.resolve(`public/locales/${OUT_LANG}`)
const OUT = path.join(OUT_DIR, 'translation.json')

const MAP = Object.fromEntries(
  [
    ['A', 'Å'], ['B', 'Ɓ'], ['C', 'Ć'], ['D', 'Đ'], ['E', 'Ē'], ['F', 'Ƒ'], ['G', 'Ǥ'], ['H', 'Ħ'], ['I', 'Į'], ['J', 'Ĵ'], ['K', 'Ķ'], ['L', 'Ŀ'], ['M', 'Ɱ'], ['N', 'Ń'], ['O', 'Ö'], ['P', 'Ƥ'], ['Q', 'Ǫ'], ['R', 'Ŗ'], ['S', 'Ś'], ['T', 'Ŧ'], ['U', 'Ū'], ['V', 'Ṽ'], ['W', 'Ŵ'], ['X', 'Ẋ'], ['Y', 'Ÿ'], ['Z', 'Ž'],
    ['a', 'å'], ['b', 'ƀ'], ['c', 'ć'], ['d', 'đ'], ['e', 'ē'], ['f', 'ƒ'], ['g', 'ǥ'], ['h', 'ħ'], ['i', 'į'], ['j', 'ĵ'], ['k', 'ķ'], ['l', 'ŀ'], ['m', 'ɱ'], ['n', 'ń'], ['o', 'ö'], ['p', 'ƥ'], ['q', 'ǫ'], ['r', 'ŗ'], ['s', 'ś'], ['t', 'ŧ'], ['u', 'ū'], ['v', 'ṽ'], ['w', 'ŵ'], ['x', 'ẋ'], ['y', 'ÿ'], ['z', 'ž']
  ]
)

function pseudo(s) {
  if (typeof s !== 'string') return s
  const mapped = s.replace(/[A-Za-z]/g, (ch) => MAP[ch] || ch)
  // expand length a bit to catch truncation issues
  return `［‼ ${mapped} ‼］`
}

function transform(node) {
  if (typeof node === 'string') return pseudo(node)
  if (Array.isArray(node)) return node.map(transform)
  if (node && typeof node === 'object') {
    const out = {}
    for (const [k, v] of Object.entries(node)) out[k] = transform(v)
    return out
  }
  return node
}

function main() {
  const en = JSON.parse(fs.readFileSync(SRC, 'utf8'))
  const pseudoJson = transform(en)
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(OUT, JSON.stringify(pseudoJson, null, 2))
  console.log(`Pseudo locale written: ${OUT}`)
}

main()

