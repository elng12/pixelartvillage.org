#!/usr/bin/env node
const fs = require('node:fs')
const path = require('node:path')

const DIST = path.resolve('dist')
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

function getText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const files = listIndexHtml(DIST)
const rows = files.map(f => {
  const html = fs.readFileSync(f, 'utf8')
  const text = getText(html)
  const words = (text.match(/[A-Za-z0-9\-']+/g) || []).length
  const rel = path.relative(DIST, f).split(path.sep).join('/')
  return { file: f, route: '/' + rel.replace(/\/index\.html$/, '') , words }
}).sort((a,b)=>a.words-b.words)

for (const r of rows) {
  console.log(`${r.words}\t${r.route}`)
}
