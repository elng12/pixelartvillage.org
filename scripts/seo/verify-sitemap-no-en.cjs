#!/usr/bin/env node
// Verify multilingual sitemap consistency:
// - default locale should stay unprefixed (/), no /en/* URLs
// - non-default locale URLs should exist
const fs = require('fs')
const path = require('path')

const PUBLIC_DIR = path.resolve(process.cwd(), 'public')
const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml')
const localeConfig = require(path.resolve(process.cwd(), 'config', 'locales.json'))
const DEFAULT_LANG = (localeConfig && localeConfig.default) || 'en'
const SUPPORTED_LANGS = Array.from(new Set((localeConfig && localeConfig.supported) || [DEFAULT_LANG]))
const OTHER_LANGS = SUPPORTED_LANGS.filter((lang) => lang && lang !== DEFAULT_LANG)

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
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
const paths = urls.map((url) => {
  try {
    return new URL(url).pathname
  } catch {
    fail(`Invalid sitemap URL: ${url}`)
    return ''
  }
}).filter(Boolean)

function toArray(value) {
  if (Array.isArray(value)) return value
  if (value && typeof value === 'object') return Object.values(value)
  return []
}

function loadPseoSlugs(lang) {
  const filePath = path.resolve(process.cwd(), 'src', 'content', `pseo-pages.${lang}.json`)
  if (!fs.existsSync(filePath)) return new Set()
  try {
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    return new Set(toArray(parsed).map((entry) => entry && entry.slug).filter(Boolean))
  } catch (error) {
    fail(`Cannot parse ${path.relative(process.cwd(), filePath)}: ${error.message}`)
    return new Set()
  }
}

const pseoSlugsByLang = Object.fromEntries(
  SUPPORTED_LANGS.map((lang) => [lang, loadPseoSlugs(lang)])
)

// 1. Ensure default locale is unprefixed (no /en/)
const enPrefixedMatches = paths.filter((pathname) => pathname === '/en/' || pathname.startsWith('/en/'))
if (enPrefixedMatches.length > 0) {
  fail(`Found /en/ prefixed URLs: ${[...new Set(enPrefixedMatches)].join(', ')}`)
} else {
  pass('No /en/ prefixed URLs present')
}

// 2. Ensure multilingual entries exist
const nonDefaultPrefixed = paths.filter((pathname) => {
  const lang = pathname.split('/').filter(Boolean)[0]
  return OTHER_LANGS.includes(lang)
})
if (nonDefaultPrefixed.length === 0) {
  fail('No non-default language-prefixed URLs found')
} else {
  const prefixes = new Set(nonDefaultPrefixed.map((pathname) => pathname.split('/').filter(Boolean)[0]))
  pass(`Found multilingual URLs: ${prefixes.size} locale prefixes`)
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

// 5. pSEO converter pages must not use English fallback as localized indexable URLs
const illegalLocalizedPseo = []
for (const pathname of paths) {
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length !== 3) continue
  const [lang, section, slug] = parts
  if (!OTHER_LANGS.includes(lang) || section !== 'converter') continue
  if (!pseoSlugsByLang[lang]?.has(slug)) {
    illegalLocalizedPseo.push(pathname)
  }
}

if (illegalLocalizedPseo.length) {
  fail(`Found localized converter URLs without matching pSEO content: ${illegalLocalizedPseo.slice(0, 20).join(', ')}${illegalLocalizedPseo.length > 20 ? '...' : ''}`)
} else {
  pass('No fallback-English localized converter URLs in sitemap')
}

for (const lang of SUPPORTED_LANGS) {
  const slugs = pseoSlugsByLang[lang]
  if (!slugs || slugs.size === 0) continue
  for (const slug of slugs) {
    const expected = lang === DEFAULT_LANG ? `/converter/${slug}/` : `/${lang}/converter/${slug}/`
    if (!paths.includes(expected)) fail(`Missing pSEO sitemap entry for real content: ${expected}`)
  }
}
if (!process.exitCode) pass('All real pSEO content entries are present')

// 6. URL 数量 sanity check
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
