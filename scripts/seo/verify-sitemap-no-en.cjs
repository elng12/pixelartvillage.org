#!/usr/bin/env node
// Verify multilingual sitemap consistency:
// - default locale should stay unprefixed (/), no /en/* URLs
// - non-default locale URLs should exist
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

// 1. Ensure default locale is unprefixed (no /en/)
const enPrefixedMatches = xml.match(/https:\/\/pixelartvillage\.org\/en\//g) || []
if (enPrefixedMatches.length > 0) {
  fail(`Found /en/ prefixed URLs: ${[...new Set(enPrefixedMatches)].join(', ')}`)
} else {
  pass('No /en/ prefixed URLs present')
}

// 2. Ensure multilingual entries exist
const nonDefaultPrefixed = xml.match(/https:\/\/pixelartvillage\.org\/(es|id|de|pl|it|pt|fr|ru|tl|vi|ja|sv|nb|nl|ar|ko|th)\//g) || []
if (nonDefaultPrefixed.length === 0) {
  fail('No non-default language-prefixed URLs found')
} else {
  pass(`Found multilingual URLs: ${[...new Set(nonDefaultPrefixed)].length} locale prefixes`)
}

// 3. Ensure root URL present
if (!/https:\/\/pixelartvillage\.org\/<\/loc>/.test(xml)) {
  fail('Root <loc> entry missing')
} else {
  pass('Root <loc> present')
}

// 4. Spot check关键页面存在
const required = [
  /https:\/\/pixelartvillage\.org\/privacy\/<\/loc>/,
  /https:\/\/pixelartvillage\.org\/terms\/<\/loc>/,
  /https:\/\/pixelartvillage\.org\/converter\/png-to-pixel-art\/<\/loc>/,
  /https:\/\/pixelartvillage\.org\/blog\/<\/loc>/,
  /https:\/\/pixelartvillage\.org\/es\/blog\/<\/loc>/,
]
required.forEach((re) => {
  if (!re.test(xml)) {
    fail(`Missing required sitemap entry matching ${re}`)
  }
})
if (!process.exitCode) pass('Required canonical entries present')

// 5. URL 数量 sanity check
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
