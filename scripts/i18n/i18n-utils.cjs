const fs = require('node:fs')
const crypto = require('node:crypto')

function flatten(obj, prefix = '', out = {}) {
  if (!obj || typeof obj !== 'object') return out
  for (const [key, value] of Object.entries(obj)) {
    const nextKey = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flatten(value, nextKey, out)
    } else {
      out[nextKey] = value
    }
  }
  return out
}

function unflatten(flat) {
  const result = {}
  for (const [chain, value] of Object.entries(flat)) {
    const parts = chain.split('.')
    let cursor = result
    for (let i = 0; i < parts.length; i++) {
      const segment = parts[i]
      if (i === parts.length - 1) {
        cursor[segment] = value
      } else {
        if (!cursor[segment] || typeof cursor[segment] !== 'object' || Array.isArray(cursor[segment])) {
          cursor[segment] = {}
        }
        cursor = cursor[segment]
      }
    }
  }
  return result
}

const PLACEHOLDER_REGEX = /({{[^}]+}}|%s|%\d?\$s|%d|%\d?\$d|<[^>]+>|\{[^{}]+\}|\[[^\]]+\]|&[a-zA-Z]+;)/g

function protectPlaceholders(text) {
  if (!text || typeof text !== 'string') return { safe: text, map: [] }
  const map = []
  const safe = text.replace(PLACEHOLDER_REGEX, (match) => {
    const idx = map.push(match) - 1
    return `__PH_${idx}__`
  })
  return { safe, map }
}

function restorePlaceholders(text, map = []) {
  if (!text || typeof text !== 'string' || !map.length) return text
  return text.replace(/__PH_(\d+)__/g, (_, idx) => map[Number(idx)] ?? '')
}

function protectTerms(text, terms = []) {
  if (!terms.length || typeof text !== 'string') return { safe: text, map: [] }
  const escaped = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (!escaped.length) return { safe: text, map: [] }
  const regex = new RegExp(`\\b(${escaped.join('|')})\\b`, 'g')
  const map = []
  const safe = text.replace(regex, (match) => {
    const idx = map.push(match) - 1
    return `__TERM_${idx}__`
  })
  return { safe, map }
}

function restoreTerms(text, map = [], glossary = {}, lang = 'en') {
  if (!map.length || typeof text !== 'string') return text
  return text.replace(/__TERM_(\d+)__/g, (_, idx) => {
    const source = map[Number(idx)]
    if (!source) return ''
    const entry = glossary[source]
    if (entry && typeof entry === 'object' && entry[lang]) return entry[lang]
    if (typeof entry === 'string') return entry
    return source
  })
}

function difference(baseFlat, targetFlat) {
  const result = {}
  for (const [key, value] of Object.entries(baseFlat)) {
    const current = targetFlat[key]
    if (typeof value === 'string') {
      if (typeof current !== 'string' || !current.trim() || current === value) {
        result[key] = value
      }
    } else if (Array.isArray(value)) {
      if (!Array.isArray(current) || JSON.stringify(current) === JSON.stringify(value)) {
        result[key] = value
      }
    } else if (value && typeof value === 'object') {
      if (!current || typeof current !== 'object') {
        result[key] = value
      }
    }
  }
  return result
}

function hashString(text) {
  return crypto.createHash('md5').update(text).digest('hex')
}

module.exports = {
  flatten,
  unflatten,
  protectPlaceholders,
  restorePlaceholders,
  protectTerms,
  restoreTerms,
  difference,
  hashString,
}
