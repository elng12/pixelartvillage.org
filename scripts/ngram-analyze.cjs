#!/usr/bin/env node
// Simple n-gram analyzer for a single HTML file (1/2/3-gram)
// Usage: node scripts/ngram-analyze.cjs --file dist/index.html

const fs = require('node:fs')
const path = require('node:path')

function arg(name, def) {
  const i = process.argv.indexOf(name)
  return i > -1 ? process.argv[i+1] : def
}

const file = arg('--file', 'dist/index.html')
if (!fs.existsSync(file)) {
  console.error('File not found:', file)
  process.exit(2)
}

const html = fs.readFileSync(file, 'utf8')
const text = html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase()

const words = (text.match(/[a-z0-9\-']+/g) || []).filter(w => w.length > 1)
const total = words.length

function tallyN(n) {
  const map = new Map()
  for (let i = 0; i <= words.length - n; i++) {
    const gram = words.slice(i, i+n).join(' ')
    map.set(gram, (map.get(gram) || 0) + 1)
  }
  return map
}

function top(map, k=15) {
  return [...map.entries()].sort((a,b)=>b[1]-a[1]).slice(0,k)
}

function report(title, arr) {
  console.log(`\n=== ${title} ===`)
  console.log('Total words:', total)
  for (const [key, count] of arr) {
    const density = ((count/Math.max(1,total))*100).toFixed(2)+'%'
    console.log(`${key}\t${count}\t${total}\t${density}`)
  }
}

const uni = tallyN(1)
const bi = tallyN(2)
const tri = tallyN(3)

// If specific keys were requested via env, prioritize them
const focus1 = (process.env.KW1||'image,pixel,art,palette,village,custom,digital,converter,palettes,controls')
  .split(',').map(s=>s.trim()).filter(Boolean)
const focus2 = (process.env.KW2||'pixel art,to pixel,image to,art village,custom palette,with custom,art with,digital art,palette controls')
  .split(',').map(s=>s.trim()).filter(Boolean)
const focus3 = (process.env.KW3||'pixel art village,image to pixel,to pixel art,pixel art with,with custom palette,to digital art,digital art converter,create pixel art,with palette controls')
  .split(',').map(s=>s.trim()).filter(Boolean)

function pick(map, keys) {
  return keys.map(k => [k, map.get(k) || 0])
}

console.log('File:', path.resolve(file))
console.log('Total words:', total)
report('1-gram (focus)', pick(uni, focus1))
report('2-gram (focus)', pick(bi, focus2))
report('3-gram (focus)', pick(tri, focus3))

// Also print overall top lists for context
report('Top 1-gram', top(uni))
report('Top 2-gram', top(bi))
report('Top 3-gram', top(tri))
