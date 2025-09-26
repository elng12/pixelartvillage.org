#!/usr/bin/env node
// Embed English locale into bundle by copying public/locales/en/translation.json
// to src/locales/en.json before dev/build. Keeps single source of truth in public/.
const fs = require('fs')
const path = require('path')

const SRC = path.resolve(process.cwd(), 'public', 'locales', 'en', 'translation.json')
const DEST_DIR = path.resolve(process.cwd(), 'src', 'locales')
const DEST = path.join(DEST_DIR, 'en.json')

function main() {
  try {
    if (!fs.existsSync(SRC)) {
      console.error('[embed-en-locale] source not found:', SRC)
      process.exit(0)
    }
    const json = fs.readFileSync(SRC, 'utf8')
    try { JSON.parse(json) } catch (e) {
      console.error('[embed-en-locale] invalid JSON at', SRC, e && e.message)
      process.exit(1)
    }
    fs.mkdirSync(DEST_DIR, { recursive: true })
    fs.writeFileSync(DEST, json, 'utf8')
    console.log('[embed-en-locale] wrote', path.relative(process.cwd(), DEST))
  } catch (e) {
    console.error('[embed-en-locale] failed:', e && e.stack || e)
    process.exit(1)
  }
}

main()

