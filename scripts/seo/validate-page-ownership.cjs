const fs = require('node:fs')
const path = require('node:path')

const TITLE_MIN = 55
const TITLE_MAX = 60
const DESCRIPTION_MIN = 150
const DESCRIPTION_MAX = 160
const pagesPath = path.resolve(__dirname, '../../src/content/pseo-pages.en.json')
const pages = JSON.parse(fs.readFileSync(pagesPath, 'utf8'))
const failures = []
const primaryKeywordOwners = new Map()

function normalize(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ')
}

for (const page of pages) {
  if (!page.seo) continue

  const label = page.slug || '(missing slug)'
  const keyword = normalize(page.seo.primaryKeyword)
  const expectedOwnerPath = `/converter/${page.slug}/`

  if (!keyword) failures.push(`${label}: missing seo.primaryKeyword`)
  if (!normalize(page.seo.intent)) failures.push(`${label}: missing seo.intent`)
  if (page.seo.ownerPath !== expectedOwnerPath) {
    failures.push(`${label}: seo.ownerPath must be ${expectedOwnerPath}`)
  }
  if (page.title.length < TITLE_MIN || page.title.length > TITLE_MAX) {
    failures.push(`${label}: title length ${page.title.length}, expected ${TITLE_MIN}-${TITLE_MAX}`)
  }
  if (page.metaDescription.length < DESCRIPTION_MIN || page.metaDescription.length > DESCRIPTION_MAX) {
    failures.push(`${label}: meta description length ${page.metaDescription.length}, expected ${DESCRIPTION_MIN}-${DESCRIPTION_MAX}`)
  }
  if (keyword && !normalize(page.title).includes(keyword)) {
    failures.push(`${label}: title must include primary keyword "${keyword}"`)
  }
  if (keyword && !normalize(page.h1).includes(keyword)) {
    failures.push(`${label}: H1 must include primary keyword "${keyword}"`)
  }

  if (keyword) {
    const existingOwner = primaryKeywordOwners.get(keyword)
    if (existingOwner) failures.push(`${label}: primary keyword already owned by ${existingOwner}`)
    primaryKeywordOwners.set(keyword, label)
  }
}

if (failures.length) {
  console.error('[seo-ownership] validation failed')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`[seo-ownership] validated ${primaryKeywordOwners.size} migrated page owner(s)`)
