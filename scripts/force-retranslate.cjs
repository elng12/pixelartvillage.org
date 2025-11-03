#!/usr/bin/env node
/**
 * Force re-translate English text found in non-English translation files
 * This script identifies strings with English words and re-translates them
 */
require('dotenv').config()
const fs = require('node:fs')
const path = require('node:path')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
const {
  protectPlaceholders,
  restorePlaceholders,
  protectTerms,
  restoreTerms,
  hashString,
} = require('./i18n-utils.cjs')

const LOCALES_DIR = path.resolve('public/locales')
const CACHE_PATH = path.resolve('i18n', 'translations-cache.json')
const GLOSSARY_PATH = path.resolve('i18n', 'glossary.json')
const DNT_PATH = path.resolve('i18n', 'dnt.json')

// 允许的英文词汇（品牌名、技术术语等）
const ALLOWED_ENGLISH = new Set([
  'PNG', 'JPG', 'JPEG', 'WebP', 'GIF', 'SVG',
  'GitHub', 'Google', 'AdSense',
  'Pixel Art Village', 'Pixel', 'Art', 'Village',
  'FAQ', 'Blog', 'Cookie', 'Cookies',
  'OK', 'ID', 'URL', 'API', 'CSS', 'HTML',
  'Twitter', 'Facebook', 'Instagram',
  'Chrome', 'Firefox', 'Safari', 'Edge',
  'Floyd', 'Steinberg', 'Pico',
  'Plasmo', 'BacklinkPilot', 'React',
  'Ctrl', 'Cmd', 'Shift',
  'WEBP', 'SNES', 'Lospec',
  'Image', 'Photo', 'Sprite',
  'RGB', 'LAB'
])

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
const THROTTLE_DELAY = toNumber(cliOpts.delay ?? process.env.TRANSLATE_DELAY_MS, PROVIDER === 'minimax' ? 800 : 1200)
const BACKOFF_BASE = toNumber(cliOpts.backoff ?? process.env.TRANSLATE_BACKOFF_MS, Math.max(THROTTLE_DELAY * 4, PROVIDER === 'minimax' ? 3000 : 4000))
const MAX_RETRIES = toNumber(cliOpts.retries ?? process.env.TRANSLATE_RETRIES, 6)

function hasEnglishWords(text) {
  if (typeof text !== 'string') return false
  
  // 检查是否包含英文单词（至少4个连续字母）
  const englishWords = text.match(/\b[A-Za-z]{4,}\b/g)
  
  if (!englishWords) return false
  
  // 过滤掉允许的英文词汇
  const disallowedWords = englishWords.filter(word => {
    if (ALLOWED_ENGLISH.has(word)) return false
    for (let allowed of ALLOWED_ENGLISH) {
      if (allowed.includes(word)) return false
    }
    return true
  })
  
  return disallowedWords.length > 0
}

async function withBackoff(task, { maxRetries = 5, baseDelay = 1000 } = {}) {
  let attempt = 0
  while (true) {
    try {
      return await task()
    } catch (error) {
      attempt++
      if (attempt > maxRetries) throw error
      const wait = baseDelay * Math.pow(2, attempt - 1)
      console.warn(`[force-retranslate] retry in ${wait}ms due to ${error.message}`)
      await sleep(wait)
    }
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
Preserve placeholders like __PH_0__, __TERM_0__, {name}, {{name}}, {{date}}, {{year}}, {{value}}, {{percent}}, or HTML tags exactly as they appear.
Do not add explanations, only return the translated text.`

  const payload = {
    model,
    max_tokens: 4096,
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
    const errorText = await response.text()
    console.error(`[MiniMax API Error] Status: ${response.status}`)
    console.error(`[MiniMax API Error] Response: ${errorText}`)
    throw new Error(`MiniMax API ${response.status}: ${errorText}`)
  }

  const data = await response.json()

  // MiniMax API 可能返回 thinking + text，我们需要找到 text 类型的内容
  let textOut = ''
  if (data?.content && Array.isArray(data.content)) {
    const textContent = data.content.find(item => item.type === 'text')
    textOut = textContent?.text || ''
  }

  // 备用方案
  if (!textOut) {
    textOut = data?.content?.[0]?.text || data?.output_text || ''
  }

  if (!textOut) {
    console.error(`[MiniMax API Error] Full response:`, JSON.stringify(data, null, 2))
    throw new Error('MiniMax API returned empty response')
  }
  return textOut.trim()
}

async function translateText(text, langCode) {
  if (!text) return text

  cache[langCode] = cache[langCode] || {}
  const cacheKey = `${PROVIDER}:force:${hashString(text)}`

  // 强制重新翻译，不使用缓存
  const { safe, map: placeholderMap } = protectPlaceholders(text)
  const { safe: termSafe, map: termMap } = protectTerms(safe, [...Object.keys(glossary), ...dnt])

  try {
    const translated = await withBackoff(
      () => translateViaMiniMax(termSafe, langCode),
      { maxRetries: MAX_RETRIES, baseDelay: BACKOFF_BASE }
    )

    let out = translated
    out = restoreTerms(out, termMap, glossary, langCode)
    out = restorePlaceholders(out, placeholderMap)

    cache[langCode][cacheKey] = out
    await sleep(THROTTLE_DELAY)
    return out
  } catch (error) {
    console.warn(`[force-retranslate] Failed to translate after ${MAX_RETRIES} retries, skipping: "${text.substring(0, 50)}..."`)
    console.warn(`[force-retranslate] Error: ${error.message}`)
    await sleep(THROTTLE_DELAY)
    return text // 返回原文
  }
}

async function processNode(obj, langCode, path = '', stats = { total: 0, translated: 0 }) {
  if (typeof obj === 'string') {
    stats.total++
    if (hasEnglishWords(obj)) {
      console.log(`  [${path}] Translating: ${obj.substring(0, 60)}${obj.length > 60 ? '...' : ''}`)
      const translated = await translateText(obj, langCode)
      stats.translated++
      return translated
    }
    return obj
  }

  if (Array.isArray(obj)) {
    const result = []
    for (let i = 0; i < obj.length; i++) {
      result[i] = await processNode(obj[i], langCode, `${path}[${i}]`, stats)
    }
    return result
  }

  if (obj && typeof obj === 'object') {
    const result = {}
    for (const key of Object.keys(obj)) {
      const newPath = path ? `${path}.${key}` : key
      result[key] = await processNode(obj[key], langCode, newPath, stats)
    }
    return result
  }

  return obj
}

async function processLanguage(lang) {
  const langCode = GOOGLE_LANG_MAP[lang]
  if (!langCode) {
    console.warn(`[force-retranslate] skip: no Google mapping for ${lang}`)
    return
  }

  const langFile = path.join(LOCALES_DIR, lang, 'translation.json')
  if (!fs.existsSync(langFile)) {
    console.warn(`[force-retranslate] skip: missing ${langFile}`)
    return
  }

  console.log(`\n${'='.repeat(60)}`)
  console.log(`Processing ${lang.toUpperCase()} (${languageLabel(langCode)})...`)
  console.log('='.repeat(60))

  const existing = JSON.parse(fs.readFileSync(langFile, 'utf8'))
  const stats = { total: 0, translated: 0 }
  
  const updated = await processNode(existing, langCode, '', stats)

  if (stats.translated > 0) {
    fs.writeFileSync(langFile, JSON.stringify(updated, null, 2) + '\n', 'utf8')
    console.log(`\n✅ ${lang}: ${stats.translated} strings translated (out of ${stats.total} total)`)
  } else {
    console.log(`\n✅ ${lang}: No English text found (${stats.total} strings checked)`)
  }
}

async function main() {
  const available = fs.readdirSync(LOCALES_DIR).filter((dir) => {
    if (dir === 'en' || dir === 'pseudo') return false
    const file = path.join(LOCALES_DIR, dir, 'translation.json')
    return fs.existsSync(file)
  })

  const targets = cliLangs.length ? cliLangs : ['ko', 'ja', 'fr']

  console.log(`\n🌍 Force Re-translate Script`)
  console.log(`Provider: ${PROVIDER}`)
  console.log(`Languages: ${targets.join(', ')}`)
  console.log(`Throttle: ${THROTTLE_DELAY}ms`)
  console.log('')

  for (const lang of targets) {
    if (!available.includes(lang)) {
      console.warn(`[force-retranslate] skip: ${lang} not found`)
      continue
    }
    try {
      await processLanguage(lang)
    } catch (error) {
      console.error(`[force-retranslate] error for ${lang}: ${error.message}`)
      console.error(error.stack)
    }
  }

  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8')
  console.log('\n' + '='.repeat(60))
  console.log('✅ Force re-translation completed!')
  console.log('='.repeat(60))
}

main().catch((error) => {
  console.error('[force-retranslate] failed:', error)
  process.exit(1)
})

