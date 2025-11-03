#!/usr/bin/env node
/**
 * Flatten English + target locale files into CSV so you can translate in Google Sheets.
 * Usage: node scripts/export-translations.cjs [lang ...]
 * CSV format: key,en,<lang>
 * Output files will be placed in i18n/exports/<lang>.csv
 */
const fs = require('node:fs')
const path = require('node:path')
const { flatten } = require('./i18n-utils.cjs')

const LOCALES_DIR = path.resolve('public/locales')
const BASE_LANG = 'en'
const EXPORT_DIR = path.resolve('i18n', 'exports')

if (!fs.existsSync('i18n')) fs.mkdirSync('i18n', { recursive: true })
if (!fs.existsSync(EXPORT_DIR)) fs.mkdirSync(EXPORT_DIR, { recursive: true })

const baseFile = path.join(LOCALES_DIR, BASE_LANG, 'translation.json')
if (!fs.existsSync(baseFile)) {
  console.error(`[export] base file not found: ${baseFile}`)
  process.exit(1)
}

const base = JSON.parse(fs.readFileSync(baseFile, 'utf8'))
const baseFlat = flatten(base)

const argLangs = process.argv.slice(2).filter(Boolean)
const available = fs.readdirSync(LOCALES_DIR).filter((dir) => {
  if (dir === BASE_LANG || dir === 'pseudo') return false
  const file = path.join(LOCALES_DIR, dir, 'translation.json')
  return fs.existsSync(file)
})

const targets = argLangs.length ? argLangs : available

const quote = (str) => {
  const value = str ?? ''
  if (typeof value !== 'string') return `"${String(value).replace(/"/g, '""')}"`
  const needsQuote = /[",\n\r]/.test(value)
  const escaped = value.replace(/"/g, '""')
  return needsQuote ? `"${escaped}"` : escaped
}

for (const lang of targets) {
  if (!available.includes(lang)) {
    console.warn(`[export] skip: ${lang} not found in ${LOCALES_DIR}`)
    continue
  }
  const langFile = path.join(LOCALES_DIR, lang, 'translation.json')
  const data = JSON.parse(fs.readFileSync(langFile, 'utf8'))
  const flat = flatten(data)

  const rows = ['key,en,' + lang]
  for (const key of Object.keys(baseFlat)) {
    const source = baseFlat[key]
    const target = flat[key]
    const sourceStr = typeof source === 'string' ? source : JSON.stringify(source)
    const targetStr = typeof target === 'string' ? target : (typeof target === 'undefined' ? '' : JSON.stringify(target))
    rows.push(`${quote(key)},${quote(sourceStr)},${quote(targetStr)}`)
  }

  const outFile = path.join(EXPORT_DIR, `${lang}.csv`)
  fs.writeFileSync(outFile, rows.join('\n'), 'utf8')
  console.log(`[export] wrote ${rows.length - 1} rows -> ${outFile}`)
}
