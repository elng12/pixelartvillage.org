#!/usr/bin/env node
const fs = require('node:fs')
const path = require('node:path')
const { flatten } = require('./i18n-utils.cjs')

const LOCALES_DIR = path.resolve('public/locales')
const BASE_LANG = 'en'
const OUTPUT = path.resolve('i18n', 'review.md')

if (!fs.existsSync('i18n')) fs.mkdirSync('i18n', { recursive: true })

const baseFile = path.join(LOCALES_DIR, BASE_LANG, 'translation.json')
const base = JSON.parse(fs.readFileSync(baseFile, 'utf8'))
const baseFlat = flatten(base)

const locales = fs.readdirSync(LOCALES_DIR).filter((dir) => {
  if (dir === BASE_LANG || dir === 'pseudo') return false
  const file = path.join(LOCALES_DIR, dir, 'translation.json')
  return fs.existsSync(file)
})

const rows = []
for (const lang of locales) {
  const file = path.join(LOCALES_DIR, lang, 'translation.json')
  const data = JSON.parse(fs.readFileSync(file, 'utf8'))
  const flat = flatten(data)
  for (const [key, value] of Object.entries(flat)) {
    const source = baseFlat[key]
    if (typeof source === 'undefined') continue
    if (value === source) rows.push({ lang, key, source, value, note: 'same as English' })
  }
}

let md = '# Translation Review Report\n\n'
if (!rows.length) {
  md += 'All translations differ from English.\n'
} else {
  md += '| Language | Key | English | Current | Note |\n'
  md += '| --- | --- | --- | --- | --- |\n'
  for (const row of rows) {
    md += `| ${row.lang} | \`${row.key}\` | ${escapeCell(row.source)} | ${escapeCell(row.value)} | ${row.note} |\n`
  }
}

fs.writeFileSync(OUTPUT, md, 'utf8')
console.log(`[export-review] written ${rows.length} row(s) -> ${OUTPUT}`)

function escapeCell(str) {
  if (!str) return ''
  return String(str).replace(/\|/g, '\\|').replace(/\n/g, '<br>')
}
