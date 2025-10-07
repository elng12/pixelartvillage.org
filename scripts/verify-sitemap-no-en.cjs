#!/usr/bin/env node
// Verify sitemap.xml only exposes canonical（英文）URL，避免语言前缀残留。
const fs = require('fs')
const path = require('path')

const PUBLIC_DIR = path.resolve(process.cwd(), 'public')
const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml')

function fail(msg) {
  console.error('❌ ' + msg)
  process.exitCode = 1
}
function pass(msg) {
  console.log('✅ ' + msg)
}

if (!fs.existsSync(sitemapPath)) {
  fail(`sitemap.xml not found at ${sitemapPath}`)
  process.exit(1)
}

const xml = fs.readFileSync(sitemapPath, 'utf8')

// 1. Ensure no /en/ or other language-prefixed entries remain
const LANG_PREFIX_RE = /https:\/\/pixelartvillage\.org\/[a-z]{2}\//g
const prefixedMatches = xml.match(LANG_PREFIX_RE) || []
const filtered = prefixedMatches.filter(url => !url.includes('/converter/')) // legacy safeguard
if (filtered.length > 0) {
  fail(`Found language-prefixed URLs: ${[...new Set(filtered)].join(', ')}`)
} else {
  pass('No language-prefixed URLs present')
}

// 2. Ensure root URL present
if (!/https:\/\/pixelartvillage\.org\/<\/loc>/.test(xml)) {
  fail('Root <loc> entry missing')
} else {
  pass('Root <loc> present')
}

// 3. Spot check关键页面存在
const required = [
  /https:\/\/pixelartvillage\.org\/privacy\/<\/loc>/,
  /https:\/\/pixelartvillage\.org\/terms\/<\/loc>/,
  /https:\/\/pixelartvillage\.org\/converter\/png-to-pixel-art\/<\/loc>/,
  /https:\/\/pixelartvillage\.org\/blog\/<\/loc>/,
]
required.forEach((re) => {
  if (!re.test(xml)) {
    fail(`Missing required sitemap entry matching ${re}`)
  }
})
if (!process.exitCode) pass('Required canonical entries present')

// 4. URL 数量 sanity check
const urlCount = (xml.match(/<url>/g) || []).length
if (urlCount < 20) {
  console.warn(`⚠️  Sitemap contains only ${urlCount} <url> entries (expected at least 20).`)
} else {
  pass(`Sitemap url count = ${urlCount}`)
}

if (process.exitCode) {
  console.error('\nSitemap verification FAILED')
  process.exit(1)
} else {
  console.log('\n🎉 Sitemap verification PASSED')
}
