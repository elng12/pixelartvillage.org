#!/usr/bin/env node
/**
 * Import translated CSV back into locale JSON.
 * Usage: node scripts/import-translations.cjs --lang es --file i18n/exports/es-translated.csv
 */
const fs = require('node:fs')
const path = require('node:path')
const { unflatten, flatten } = require('./i18n-utils.cjs')

function parseArgs(argv) {
  const opts = {}
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.startsWith('--')) {
      const [key, value] = arg.replace(/^--/, '').split('=')
      if (typeof value === 'undefined') {
        opts[key] = argv[i + 1]
        i++
      } else {
        opts[key] = value
      }
    }
  }
  return opts
}

const args = parseArgs(process.argv.slice(2))
const lang = args.lang
const csvPath = args.file || args.path

if (!lang || !csvPath) {
  console.error('Usage: node scripts/import-translations.cjs --lang <code> --file <csv>')
  process.exit(1)
}

const LOCALES_DIR = path.resolve('public/locales')
const baseFile = path.join(LOCALES_DIR, 'en', 'translation.json')
const targetFile = path.join(LOCALES_DIR, lang, 'translation.json')

if (!fs.existsSync(baseFile) || !fs.existsSync(targetFile)) {
  console.error('Locale files not found. Ensure base and target locale files exist.')
  process.exit(1)
}

const base = JSON.parse(fs.readFileSync(baseFile, 'utf8'))
const target = JSON.parse(fs.readFileSync(targetFile, 'utf8'))

const baseFlat = flatten(base)
const targetFlat = flatten(target)

if (!fs.existsSync(csvPath)) {
  console.error(`CSV file not found: ${csvPath}`)
  process.exit(1)
}

function parseLine(line) {
  const cells = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        current += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ',') {
        cells.push(current)
        current = ''
      } else {
        current += char
      }
    }
  }
  cells.push(current)
  return cells
}

const lines = fs.readFileSync(csvPath, 'utf8').split(/\r?\n/).filter(Boolean)
if (!lines.length) {
  console.error('CSV file empty')
  process.exit(1)
}

const header = parseLine(lines[0])
const keyIdx = header.indexOf('key')
const langIdx = header.findIndex((col) => col.toLowerCase() === lang.toLowerCase())
if (keyIdx === -1 || langIdx === -1) {
  console.error('CSV must contain columns: key, <lang>')
  process.exit(1)
}

let updated = 0
for (let i = 1; i < lines.length; i++) {
  const row = parseLine(lines[i])
  if (!row.length) continue
  const key = row[keyIdx]
  const text = row[langIdx] ?? ''
  if (!key) continue
  if (!(key in baseFlat)) continue
  if (!text.trim()) continue
  if (targetFlat[key] === text) continue
  targetFlat[key] = text
  updated++
}

if (!updated) {
  console.log('No keys updated.')
  process.exit(0)
}

const next = unflatten(targetFlat)
fs.writeFileSync(targetFile, JSON.stringify(next, null, 2) + '\n', 'utf8')
console.log(`[import] updated ${updated} keys -> ${targetFile}`)
