#!/usr/bin/env node
const fs = require('node:fs')
const path = require('node:path')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
const {
  flatten,
  unflatten,
  protectPlaceholders,
  restorePlaceholders,
  protectTerms,
  restoreTerms,
  difference,
  hashString,
} = require('./i18n-utils.cjs')

const LOCALES_DIR = path.resolve('public/locales')
const BASE_LANG = 'en'
const SKIP_LANGS = new Set([BASE_LANG, 'pseudo'])
const CACHE_PATH = path.resolve('i18n', 'translations-cache.json')
const GLOSSARY_PATH = path.resolve('i18n', 'glossary.json')
const DNT_PATH = path.resolve('i18n', 'dnt.json')

const GOOGLE_LANG_MAP = {
  ar: 'ar',
  de: 'de',
  es: 'es',
  fil: 'tl',
  fr: 'fr',
  id: 'id',
  it: 'it',
  ja: 'ja',
  ko: 'ko',
  nl: 'nl',
  no: 'no',
  pl: 'pl',
  pt: 'pt',
  ru: 'ru',
  sv: 'sv',
  th: 'th',
  vi: 'vi',
}

if (!fs.existsSync('i18n')) {
  fs.mkdirSync('i18n', { recursive: true })
}

const cache = fs.existsSync(CACHE_PATH)
  ? JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'))
  : {}

const glossary = fs.existsSync(GLOSSARY_PATH)
  ? JSON.parse(fs.readFileSync(GLOSSARY_PATH, 'utf8'))
  : {}

const dnt = fs.existsSync(DNT_PATH)
  ? JSON.parse(fs.readFileSync(DNT_PATH, 'utf8'))
  : []

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function parseArgs(rawArgs) {
  const opts = {}
  const langs = []
  for (const arg of rawArgs) {
    if (arg.startsWith('--')) {
      const [key, value = 'true'] = arg.replace(/^--/, '').split('=')
      opts[key] = value
    } else {
      langs.push(arg)
    }
  }
  return { opts, langs }
}

const { opts: cliOpts, langs: cliLangs } = parseArgs(process.argv.slice(2))

const toNumber = (value, fallback) => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

const PROVIDER = (cliOpts.provider || process.env.TRANSLATE_PROVIDER || 'minimax').toLowerCase()

const THROTTLE_DELAY = toNumber(
  cliOpts.delay ?? process.env.TRANSLATE_DELAY_MS,
  PROVIDER === 'minimax' ? 800 : 1200
)
const BACKOFF_BASE = toNumber(
  cliOpts.backoff ?? process.env.TRANSLATE_BACKOFF_MS,
  Math.max(THROTTLE_DELAY * 4, PROVIDER === 'minimax' ? 3000 : 4000)
)
const MAX_RETRIES = toNumber(cliOpts.retries ?? process.env.TRANSLATE_RETRIES, 6)

async function withBackoff(task, { maxRetries = 5, baseDelay = 1000 } = {}) {
  let attempt = 0
  while (true) {
    try {
      return await task()
    } catch (error) {
      attempt++
      if (attempt > maxRetries) throw error
      const wait = baseDelay * Math.pow(2, attempt - 1)
      console.warn(`[auto-translate] retry in ${wait}ms due to ${error.message}`)
      await sleep(wait)
    }
  }
}

async function translateText(text, langCode) {
  if (!text) return text
  cache[langCode] = cache[langCode] || {}
  const cacheKey = `${PROVIDER}:${hashString(text)}`
  if (cache[langCode][cacheKey]) return cache[langCode][cacheKey]

  const { safe, map: placeholderMap } = protectPlaceholders(text)
  const { safe: termSafe, map: termMap } = protectTerms(safe, [...Object.keys(glossary), ...dnt])

  const translated = await withBackoff(
    () => translateViaProvider(termSafe, langCode),
    { maxRetries: MAX_RETRIES, baseDelay: BACKOFF_BASE }
  )

  let out = translated
  out = restoreTerms(out, termMap, glossary, langCode)
  out = restorePlaceholders(out, placeholderMap)

  cache[langCode][cacheKey] = out
  await sleep(THROTTLE_DELAY)
  return out
}

async function translateViaProvider(text, langCode) {
  switch (PROVIDER) {
    case 'minimax':
    case 'anthropic':
      return translateViaMiniMax(text, langCode)
    case 'libre':
      return translateViaLibre(text, langCode)
    default:
      throw new Error(`Unsupported provider: ${PROVIDER}`)
  }
}

function languageLabel(code) {
  const map = {
    ar: 'Arabic',
    de: 'German',
    es: 'Spanish',
    fr: 'French',
    id: 'Indonesian',
    it: 'Italian',
    ja: 'Japanese',
    ko: 'Korean',
    nl: 'Dutch',
    no: 'Norwegian',
    pl: 'Polish',
    pt: 'Portuguese',
    ru: 'Russian',
    sv: 'Swedish',
    th: 'Thai',
    vi: 'Vietnamese',
    fil: 'Filipino',
    zh: 'Chinese',
  }
  return map[code?.toLowerCase()] || code
}

async function translateViaMiniMax(text, langCode) {
  const apiKey = process.env.ANTHROPIC_AUTH_TOKEN
  if (!apiKey) throw new Error('ANTHROPIC_AUTH_TOKEN is not set')
  const baseUrl = process.env.ANTHROPIC_BASE_URL || 'https://api.minimaxi.com/anthropic'
  const model = process.env.ANTHROPIC_SMALL_FAST_MODEL || process.env.ANTHROPIC_DEFAULT_HAIKU_MODEL || process.env.ANTHROPIC_DEFAULT_SONNET_MODEL || 'MiniMax-M2'

  const instruction = `You are a professional localization engine.
Translate the user provided string from English into ${languageLabel(langCode)}.
Preserve placeholders like __PH_0__, __TERM_0__, {name}, or HTML tags exactly as they appear.
Do not add explanations, only return the translated text.`

  const payload = {
    model,
    max_tokens: 1024,
    temperature: 0,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: instruction },
          { type: 'text', text: `TEXT:\n${text}` }
        ]
      }
    ]
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`MiniMax API ${response.status}: ${await response.text()}`)
  }

  const data = await response.json()
  const textOut = data?.content?.[0]?.text || data?.output_text || ''
  if (!textOut) {
    throw new Error('MiniMax API returned empty response')
  }
  return textOut.trim()
}

async function translateViaLibre(text, langCode) {
  const baseUrl = process.env.LIBRETRANSLATE_URL || 'http://localhost:5000/translate'
  const body = {
    q: text,
    source: 'en',
    target: langCode,
    format: 'text'
  }
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!response.ok) {
    throw new Error(`LibreTranslate ${response.status}: ${await response.text()}`)
  }
  const data = await response.json()
  return (data?.translatedText || '').trim()
}

async function translateNode(baseValue, currentValue, langCode) {
  if (typeof baseValue === 'string') {
    if (typeof currentValue === 'string' && currentValue.trim() && currentValue !== baseValue) {
      return currentValue
    }
    return translateText(baseValue, langCode)
  }

  if (Array.isArray(baseValue)) {
    const result = Array.isArray(currentValue) ? [...currentValue] : []
    for (let i = 0; i < baseValue.length; i++) {
      result[i] = await translateNode(baseValue[i], result[i], langCode)
    }
    return result
  }

  if (baseValue && typeof baseValue === 'object') {
    const result = { ...(currentValue && typeof currentValue === 'object' ? currentValue : {}) }
    for (const key of Object.keys(baseValue)) {
      result[key] = await translateNode(baseValue[key], result[key], langCode)
    }
    return result
  }

  return baseValue
}

async function processLanguage(lang) {
  const langCode = GOOGLE_LANG_MAP[lang]
  if (!langCode) {
    console.warn(`[auto-translate] skip: no Google mapping for ${lang}`)
    return
  }

  const baseFile = path.join(LOCALES_DIR, BASE_LANG, 'translation.json')
  const langFile = path.join(LOCALES_DIR, lang, 'translation.json')
  if (!fs.existsSync(langFile)) {
    console.warn(`[auto-translate] skip: missing ${langFile}`)
    return
  }

  const base = JSON.parse(fs.readFileSync(baseFile, 'utf8'))
  const existing = JSON.parse(fs.readFileSync(langFile, 'utf8'))

  const baseFlat = flatten(base)
  const existingFlat = flatten(existing)
  const pendingFlat = difference(baseFlat, existingFlat)
  const pendingKeys = Object.keys(pendingFlat)

  if (!pendingKeys.length) {
    console.log(`[auto-translate] ${lang}: no missing keys.`)
    return
  }

  const pendingNested = unflatten(pendingFlat)
  const merged = await translateNode(pendingNested, existing, langCode)

  fs.writeFileSync(langFile, JSON.stringify(merged, null, 2) + '\n', 'utf8')
  console.log(`[auto-translate] done: ${lang} (${pendingKeys.length} keys updated)`) 
}

async function main() {
  const available = fs.readdirSync(LOCALES_DIR).filter((dir) => {
    if (SKIP_LANGS.has(dir)) return false
    const file = path.join(LOCALES_DIR, dir, 'translation.json')
    return fs.existsSync(file)
  })

  const targets = cliLangs.length ? cliLangs : available

  for (const lang of targets) {
    if (!available.includes(lang)) {
      console.warn(`[auto-translate] skip: ${lang} not found`)
      continue
    }
    try {
      await processLanguage(lang)
    } catch (error) {
      console.error(`[auto-translate] error for ${lang}: ${error.message}`)
    }
  }

  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8')
  console.log('[auto-translate] completed')
}

main().catch((error) => {
  console.error('[auto-translate] failed:', error)
  process.exit(1)
})
