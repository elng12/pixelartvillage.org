#!/usr/bin/env node
// Sync translation keys from English to all other languages
// Missing keys will be filled with English text as placeholders
// Usage: node scripts/sync-translation-keys.cjs

const fs = require('node:fs')
const path = require('node:path')

const LOCALES_DIR = path.resolve('public/locales')
const BASE_LANG = 'en'

function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key] || typeof target[key] !== 'object' || Array.isArray(target[key])) {
        target[key] = {}
      }
      deepMerge(target[key], source[key])
    } else if (!(key in target)) {
      // Only add missing keys
      target[key] = Array.isArray(source[key]) ? JSON.parse(JSON.stringify(source[key])) : source[key]
    }
  }
  return target
}

function main() {
  const baseFile = path.join(LOCALES_DIR, BASE_LANG, 'translation.json')
  const base = JSON.parse(fs.readFileSync(baseFile, 'utf8'))
  
  const langs = fs.readdirSync(LOCALES_DIR).filter((d) => {
    const filePath = path.join(LOCALES_DIR, d, 'translation.json')
    return fs.existsSync(filePath) && d !== BASE_LANG && d !== 'pseudo'
  })
  
  let totalUpdated = 0
  
  for (const lang of langs) {
    const langFile = path.join(LOCALES_DIR, lang, 'translation.json')
    const existing = JSON.parse(fs.readFileSync(langFile, 'utf8'))
    const original = JSON.stringify(existing, null, 2)
    
    deepMerge(existing, base)
    
    const updated = JSON.stringify(existing, null, 2)
    if (original !== updated) {
      fs.writeFileSync(langFile, updated)
      totalUpdated++
      console.log(`✓ Updated ${lang}: Added missing keys from ${BASE_LANG}`)
    } else {
      console.log(`- ${lang}: Already up to date`)
    }
  }
  
  console.log(`\nDone! Updated ${totalUpdated} language file(s).`)
  if (totalUpdated > 0) {
    console.log(`Note: New keys are filled with English text as placeholders. Please translate them.`)
  }
}

main()

