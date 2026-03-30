#!/usr/bin/env node
// Compare translation keys of all locales against English baseline
// Usage: node scripts/i18n-check.js

import fs from 'node:fs'
import path from 'node:path'

const LOCALES_DIR = path.resolve('public/locales')
const BASE_LANG = 'en'

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function isPlainObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v)
}

function collectKeys(obj, prefix = '', out = new Set()) {
  if (!obj || typeof obj !== 'object') return out
  if (Array.isArray(obj)) {
    // Do not dive into array indices to avoid fragile checks
    return out
  }
  for (const k of Object.keys(obj)) {
    const next = prefix ? `${prefix}.${k}` : k
    out.add(next)
    const v = obj[k]
    if (isPlainObject(v)) collectKeys(v, next, out)
    if (Array.isArray(v)) {
      // If array of objects, check the shape of first item only
      const first = v.find((x) => isPlainObject(x))
      if (first) collectKeys(first, next + '[]', out)
    }
  }
  return out
}

function main() {
  const langs = fs.readdirSync(LOCALES_DIR).filter((d) => fs.existsSync(path.join(LOCALES_DIR, d, 'translation.json')))
  if (!langs.includes(BASE_LANG)) {
    console.error(`Base language ${BASE_LANG} not found under ${LOCALES_DIR}`)
    process.exit(1)
  }
  const base = readJson(path.join(LOCALES_DIR, BASE_LANG, 'translation.json'))
  const baseKeys = collectKeys(base)

  const report = []
  for (const lang of langs) {
    if (lang === BASE_LANG) continue
    const data = readJson(path.join(LOCALES_DIR, lang, 'translation.json'))
    const keys = collectKeys(data)
    const missing = [...baseKeys].filter((k) => !keys.has(k)).sort()
    const extra = [...keys].filter((k) => !baseKeys.has(k)).sort()
    report.push({ lang, missing, extra })
  }

  let hasIssues = false
  for (const { lang, missing, extra } of report) {
    if (missing.length === 0 && extra.length === 0) continue
    hasIssues = true
    console.log(`\n== ${lang} ==`)
    if (missing.length) {
      console.log(`  Missing (${missing.length}):`)
      for (const k of missing) console.log(`   - ${k}`)
    }
    if (extra.length) {
      console.log(`  Extra (${extra.length}):`)
      for (const k of extra) console.log(`   + ${k}`)
    }
  }

  if (!hasIssues) {
    console.log('All locales are consistent with base keys.')
  }
}

main()

