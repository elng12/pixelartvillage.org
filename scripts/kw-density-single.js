#!/usr/bin/env node
// Keyword density for a single prerendered HTML file (or a route under dist/)
// Options (flags):
//   --file <path>           Path to an HTML file (e.g., dist/en/index.html)
//   --route <route>         Route under dist (e.g., /en/ or /en/blog/slug/)
//   --dist <dir>            Dist root (default: ./dist)
//   --words <csv>           Comma-separated words to track (default: image,pixel,art,palette,palettes,converter)
//   --include-meta          Include <title> and <meta content="..."> text in analysis
//   --include-jsonld        Include <script type="application/ld+json"> text in analysis
//   --split-hyphen          Split hyphenated tokens (pixel-art -> pixel + art) for matching
//   --include-attrs         Include common attributes text (alt, title, aria-label) in analysis
//   --include-inline-scripts Include inline <script> bodies (excluding JSON-LD)
//   --include-comments      Include HTML comments <!-- ... -->
//   --dupe-text             Duplicate visible text once (to emulate innerText + custom text)
//   --dupe-factor <n>       Duplicate visible text by factor n (e.g., 0.3 adds 30% of visible text)
//   --stem                  Naive singularization for tracked words (images->image, pixels->pixel, etc.)
//   --token-letters-only    Use [a-z]+ tokenization for Total (instead of [a-z0-9']+)
//   --tsv                   Output TSV (word, count, ratio)
//   --verbose               Print debug info (resolved file, lengths)
//
// Examples:
//  node scripts/kw-density-single.js --route /en/ --include-meta --split-hyphen
//  node scripts/kw-density-single.js --file dist/en/index.html --words image,pixel,art

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function parseArgs(argv) {
  const out = {
    dist: path.resolve(process.cwd(), 'dist'),
    words: 'image,pixel,art,palette,palettes,converter',
    includeMeta: false,
    includeJsonLd: false,
    splitHyphen: false,
    includeAttrs: false,
    includeInlineScripts: false,
    includeComments: false,
    dupeText: false,
    stem: false,
    tokenLettersOnly: false,
    tsv: false,
    verbose: false,
  }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--file') out.file = argv[++i]
    else if (a === '--route') out.route = argv[++i]
    else if (a === '--dist') out.dist = path.resolve(argv[++i])
    else if (a === '--words') out.words = argv[++i]
    else if (a === '--include-meta') out.includeMeta = true
    else if (a === '--include-jsonld') out.includeJsonLd = true
    else if (a === '--split-hyphen') out.splitHyphen = true
    else if (a === '--include-attrs') out.includeAttrs = true
    else if (a === '--include-inline-scripts') out.includeInlineScripts = true
    else if (a === '--include-comments') out.includeComments = true
    else if (a === '--dupe-text') out.dupeText = true
    else if (a === '--dupe-factor') out.dupeFactor = Math.max(0, parseFloat(argv[++i] || '0'))
    else if (a === '--stem') out.stem = true
    else if (a === '--token-letters-only') out.tokenLettersOnly = true
    else if (a === '--tsv') out.tsv = true
    else if (a === '--verbose') out.verbose = true
  }
  out.wordList = out.words.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
  return out
}

function routeToFile(dist, route) {
  let r = String(route || '/').trim()
  if (!r.startsWith('/')) r = '/' + r
  if (!r.endsWith('/')) r += '/'
  const p = path.join(dist, r.substring(1), 'index.html')
  return p
}

function readText(html, { includeMeta, includeJsonLd, includeAttrs, includeInlineScripts, includeComments, dupeText, dupeFactor = 0, splitHyphen, stem }) {
  const parts = []
  let bodyText = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
  parts.push(bodyText)

  if (includeMeta) {
    const metas = []
    const title = /<title>([\s\s]*?)<\/title>/i.exec(html)
    if (title && title[1]) metas.push(title[1])
    const metaContent = [...html.matchAll(/<meta[^>]+content=\"([^\"]+)\"[^>]*>/gi)].map(m => m[1])
    metas.push(...metaContent)
    parts.push(metas.join(' '))
  }

  if (includeJsonLd) {
    const ld = [...html.matchAll(/<script[^>]+type=\"application\/ld\+json\"[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1])
    parts.push(ld.join(' '))
  }

  if (includeAttrs) {
    const attrs = []
    // alt, title, aria-label on any tag
    for (const m of html.matchAll(/\s(?:alt|title|aria-label)=\"([^\"]+)\"/gi)) {
      attrs.push(m[1])
    }
    parts.push(attrs.join(' '))
  }

  if (includeInlineScripts) {
    // Include inline scripts except JSON-LD blocks (already handled)
    const scr = [...html.matchAll(/<script(?![^>]*type=\"application\/ld\+json\")[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]).join(' ')
    parts.push(scr)
  }

  if (includeComments) {
    const comments = [...html.matchAll(/<!--([\s\S]*?)-->/g)].map(m => m[1]).join(' ')
    parts.push(comments)
  }

  let text = parts.join(' ')
  text = text.replace(/\s+/g, ' ').trim().toLowerCase()
  if (splitHyphen) text = text.replace(/-/g, ' ')
  if (dupeText) text = text + ' ' + bodyText.toLowerCase()
  if (dupeFactor && dupeFactor > 0) {
    const bt = bodyText.toLowerCase()
    const whole = Math.floor(dupeFactor)
    const frac = dupeFactor - whole
    if (whole > 0) text += ' ' + bt.repeat(whole)
    if (frac > 0) {
      const cut = Math.max(1, Math.floor(bt.length * frac))
      text += ' ' + bt.slice(0, cut)
    }
  }
  if (stem) {
    // naive stemming for tracked words (plural -> singular)
    text = text
      .replace(/\bimages\b/g, 'image')
      .replace(/\bpixels\b/g, 'pixel')
      .replace(/\barts\b/g, 'art')
      .replace(/\bpalettes\b/g, 'palette')
      .replace(/\bconverters\b/g, 'converter')
  }
  return text
}

function countWord(text, word, splitHyphen) {
  // 若未 splitHyphen，则允许单词内部连字符存在；否则严格按字母数字边界
  const re = splitHyphen
    ? new RegExp('(?<![a-z0-9])' + escapeRe(word) + '(?![a-z0-9])', 'g')
    : new RegExp('(?<![a-z0-9-])' + escapeRe(word) + '(?![a-z0-9-])', 'g')
  const m = text.match(re)
  return m ? m.length : 0
}

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') }

function main() {
  const opt = parseArgs(process.argv)
  let file = opt.file ? path.resolve(opt.file) : null
  if (!file) {
    if (!opt.route) {
      console.error('Specify --file <path> or --route </en/...>')
      process.exit(2)
    }
    file = routeToFile(opt.dist, opt.route)
  }
  if (!fs.existsSync(file)) {
    console.error('File not found:', file)
    process.exit(2)
  }
  const html = fs.readFileSync(file, 'utf8')
  const text = readText(html, { includeMeta: opt.includeMeta, includeJsonLd: opt.includeJsonLd, includeAttrs: opt.includeAttrs, includeInlineScripts: opt.includeInlineScripts, includeComments: opt.includeComments, dupeText: opt.dupeText, dupeFactor: opt.dupeFactor, splitHyphen: opt.splitHyphen, stem: opt.stem })
  const tokens = (text.match(opt.tokenLettersOnly ? /[a-z]+/g : /[a-z0-9']+/g) || [])
  const total = tokens.length
  const rows = []
  for (const w of opt.wordList) {
    const c = countWord(text, w, opt.splitHyphen)
    rows.push({ word: w, count: c, ratio: total ? (c / total) * 100 : 0 })
  }
  if (opt.verbose) {
    console.log('# file:', file)
    console.log('# options:', JSON.stringify({ includeMeta: opt.includeMeta, includeJsonLd: opt.includeJsonLd, includeAttrs: opt.includeAttrs, splitHyphen: opt.splitHyphen }, null, 0))
    console.log('# totalWords:', total)
  }
  if (opt.tsv) {
    console.log('word\tcount\tratio%')
    for (const r of rows) console.log(`${r.word}\t${r.count}\t${r.ratio.toFixed(2)}%`)
  } else {
    console.log(`Total words: ${total}`)
    for (const r of rows) console.log(`${r.word}\t${r.count}\t${r.ratio.toFixed(2)}%`)
  }
}

main()
