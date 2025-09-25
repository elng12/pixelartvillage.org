#!/usr/bin/env node
// Site-wide single-word density (from dist/**/index.html)
// Outputs top words (excluding common stopwords) and tracked keyword set

import fs from 'node:fs'
import path from 'node:path'

const DIST = path.resolve('dist')
if (!fs.existsSync(DIST)) {
  console.error('dist/ not found. Run `npm run build` first.')
  process.exit(2)
}

const TRACK = (process.env.KW_WORDS || 'pixel,art,image,palette,palettes,converter')
  .split(',').map(s => s.trim().toLowerCase()).filter(Boolean)

const STOP = new Set([
  'the','and','to','of','in','a','for','on','with','is','that','this','it','as','at','by','from','or','be','are','your','our','we','you','an','into','any','can','will','not','no','all','was','have','has','but','do','does','how','what','which','who','when','where','why','free','online'
])

function listHtml(dir) {
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

function getText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const files = listHtml(DIST)
const counts = new Map()
let total = 0
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8')
  const text = getText(html).toLowerCase()
  const words = text.match(/[a-z0-9\-']+/g) || []
  total += words.length
  for (const w of words) {
    if (w.length <= 2) continue
    const key = w
    counts.set(key, (counts.get(key) || 0) + 1)
  }
}

// Report tracked words
console.log('Tracked words:')
for (const w of TRACK) {
  const c = counts.get(w) || 0
  const ratio = ((c / Math.max(1,total)) * 100).toFixed(2)
  console.log(`${w}\t${c}\t${ratio}%`)
}

// Report top 15 (excluding stopwords)
const top = [...counts.entries()]
  .filter(([w]) => !STOP.has(w))
  .sort((a,b) => b[1]-a[1])
  .slice(0,15)

console.log('\nTop 15 words (excluding stopwords):')
for (const [w,c] of top) {
  console.log(`${w}\t${c}\t${((c/Math.max(1,total))*100).toFixed(2)}%`)
}

console.log(`\nTotal words: ${total}`)

