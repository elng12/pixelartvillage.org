#!/usr/bin/env node
// Site-wide keyword density (FULL mode) on prerendered output in dist/
// Includes: visible text (tags stripped), <title>, all <meta content>,
// JSON-LD payloads, common attributes (alt/title/aria-label), hyphen split.
// Env:
//   KW_WORDS   comma-separated words to track (default: image,pixel,art,palette,palettes,converter)
//   DIST_DIR   dist root (default: ./dist)

import fs from 'node:fs'
import path from 'node:path'

const DIST = path.resolve(process.env.DIST_DIR || 'dist')
const WORDS = (process.env.KW_WORDS || 'image,pixel,art,palette,palettes,converter')
  .split(',').map(s => s.trim().toLowerCase()).filter(Boolean)

function listIndexHtml(dir) {
  const out = []
  const stack = [dir]
  while (stack.length) {
    const d = stack.pop()
    for (const name of fs.readdirSync(d)) {
      const p = path.join(d, name)
      const st = fs.statSync(p)
      if (st.isDirectory()) stack.push(p)
      else if (name === 'index.html') out.push(p)
    }
  }
  return out
}

function extractFullText(html) {
  // visible text (strip scripts/styles/tags)
  const visible = html
    .replace(/<script[\s\s]*?<\/script>/gi, ' ')
    .replace(/<style[\s\s]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')

  // <title>
  const title = (() => {
    const m = /<title>([\s\s]*?)<\/title>/i.exec(html)
    return (m && m[1]) || ''
  })()

  // meta content
  const metas = [...html.matchAll(/<meta[^>]+content=\"([^\"]+)\"[^>]*>/gi)].map(m => m[1]).join(' ')

  // JSON-LD
  const ld = [...html.matchAll(/<script[^>]+type=\"application\/ld\+json\"[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]).join(' ')

  // Common attributes
  const attrs = [...html.matchAll(/\s(?:alt|title|aria-label)=\"([^\"]+)\"/gi)].map(m => m[1]).join(' ')

  // Combine, lowercase, compress spaces, split hyphen
  let text = (visible + ' ' + title + ' ' + metas + ' ' + ld + ' ' + attrs).toLowerCase()
  text = text.replace(/\s+/g, ' ').trim()
  text = text.replace(/-/g, ' ')
  return text
}

function countWord(text, w) {
  const re = new RegExp('(?<![a-z0-9])' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![a-z0-9])', 'g')
  const m = text.match(re)
  return m ? m.length : 0
}

function main() {
  if (!fs.existsSync(DIST)) {
    console.error('dist not found:', DIST)
    process.exit(2)
  }
  const files = listIndexHtml(DIST)
  const totals = Object.fromEntries(WORDS.map(w => [w, 0]))
  let totalTokens = 0
  for (const f of files) {
    const html = fs.readFileSync(f, 'utf8')
    const text = extractFullText(html)
    const tokens = text.match(/[a-z0-9']+/g) || []
    totalTokens += tokens.length
    for (const w of WORDS) totals[w] += countWord(text, w)
  }
  console.log('files\t' + files.length)
  console.log('totalTokens\t' + totalTokens)
  console.log('word\tcount\tratio%')
  for (const w of WORDS) {
    const c = totals[w]
    const ratio = ((c / Math.max(1, totalTokens)) * 100).toFixed(2)
    console.log(`${w}\t${c}\t${ratio}%`)
  }
}

main()

