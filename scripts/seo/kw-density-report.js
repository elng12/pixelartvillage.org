#!/usr/bin/env node
// Per-category keyword report for prerendered pages in dist/
// Categories: homepage, blog, converter(pSEO), policy(privacy/terms/about/contact), others

import fs from 'node:fs'
import path from 'node:path'

const DIST = path.resolve('dist')
const TARGET = 'image to pixel art'

if (!fs.existsSync(DIST)) {
  console.error('dist/ not found. Run `npm run build` first.')
  process.exit(2)
}

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

function posixRel(p) {
  const rel = path.relative(DIST, p)
  return ('/' + rel.split(path.sep).join('/')).replace(/\/index\.html$/, '/').replace(/\/+/g, '/').replace(/\/\/?$/, '/')
}

function getText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function countPhrase(text, phrase) {
  const re = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
  const m = text.match(re)
  return m ? m.length : 0
}

function categorize(route) {
  // route like /en/, /en/blog/... , /en/converter/... , /en/privacy/, etc.
  const segs = route.split('/').filter(Boolean)
  if (route === '/' || (segs.length === 1 && segs[0].length === 2)) return 'homepage'
  const pathAfterLang = segs.length > 1 ? '/' + segs.slice(1).join('/') + '/' : '/'
  if (/^\/blog\//.test(pathAfterLang)) return 'blog'
  if (/^\/converter\//.test(pathAfterLang)) return 'converter'
  if (/^\/(privacy|terms|about|contact)\//.test(pathAfterLang)) return 'policy'
  return 'others'
}

const files = listIndexHtml(DIST)
const rows = []
let totals = { words: 0, count: 0 }
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8')
  const text = getText(html)
  const words = text.split(/\s+/).filter(Boolean).length
  const count = countPhrase(text, TARGET)
  const route = posixRel(f)
  rows.push({ route, words, count, cat: categorize(route) })
  totals.words += words
  totals.count += count
}

function sumCat(cat) {
  const list = rows.filter(r => r.cat === cat)
  const words = list.reduce((a, b) => a + b.words, 0)
  const count = list.reduce((a, b) => a + b.count, 0)
  list.sort((a, b) => b.count - a.count)
  return { list, words, count }
}

const cats = ['homepage', 'blog', 'converter', 'policy', 'others']
console.log(`Scanned pages: ${files.length}`)
console.log(`Target phrase: "${TARGET}"`)
console.log('---')
for (const c of cats) {
  const { list, words, count } = sumCat(c)
  if (!list.length) continue
  console.log(`Category: ${c}`)
  console.log(`  pages: ${list.length}, total: ${count}, density: ${(count/Math.max(1,words)*100).toFixed(2)}%`)
  for (const r of list.slice(0, 5)) {
    console.log(`   - ${r.route}  (${r.count})`)
  }
  console.log('')
}
console.log('Site total:', totals.count, `(${(totals.count/Math.max(1,totals.words)*100).toFixed(2)}%)`)

