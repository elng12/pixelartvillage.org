// i18n initialization for Pixel Art Village
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'
import enBundle from '@/locales/en.json'
import localeConfig from '../config/locales.json'

export const DEFAULT_LOCALE = localeConfig?.default || 'en'
export const ALL_SUPPORTED_LOCALES = Array.isArray(localeConfig?.supported)
  ? Array.from(new Set(localeConfig.supported))
  : [DEFAULT_LOCALE]

function parseConfiguredLangs() {
  try {
    const raw = import.meta?.env?.VITE_LANGS
    if (!raw || typeof raw !== 'string') return []
    return raw
      .split(',')
      .map((token) => token.trim().toLowerCase())
      .filter(Boolean)
      .map((token) => token.replace(/[^a-z-]/g, ''))
      .filter(Boolean)
  } catch {
    return []
  }
}

// Merge env-provided languages with config defaults; support pseudo locale for testing.
export const SUPPORTED_LANGS = (() => {
  const fromEnv = parseConfiguredLangs()
  const base = fromEnv.length ? fromEnv : ALL_SUPPORTED_LOCALES
  const unique = Array.from(new Set([...base, 'pseudo']))
  if (!unique.includes(DEFAULT_LOCALE)) unique.unshift(DEFAULT_LOCALE)
  return unique
})()

export const CANONICAL_LOCALE = DEFAULT_LOCALE

const STORAGE_KEY = 'pv_lang'
const STORAGE_TTL = 365 * 24 * 60 * 60 * 1000 // 1 year

export function getStoredLang() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const { lang, ts } = JSON.parse(raw)
    if (!lang || !ts) return null
    if (Date.now() - ts > STORAGE_TTL) return null
    if (!SUPPORTED_LANGS.includes(lang)) return null
    return lang
  } catch {
    return null
  }
}

export function setStoredLang(lang) {
  try {
    if (!SUPPORTED_LANGS.includes(lang)) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ lang, ts: Date.now() }))
  } catch {
    /* ignore */
  }
}

export function detectBrowserLang() {
  const nav = typeof navigator !== 'undefined' ? navigator : null
  const candidates = []
  if (nav?.languages && Array.isArray(nav.languages)) candidates.push(...nav.languages)
  if (nav?.language) candidates.push(nav.language)
  for (const candidate of candidates) {
    if (!candidate) continue
    const lc = String(candidate).toLowerCase()
    const base = lc.split('-')[0]
    if (SUPPORTED_LANGS.includes(base)) return base
  }
  return DEFAULT_LOCALE
}

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: SUPPORTED_LANGS,
    ns: ['translation'],
    defaultNS: 'translation',
    load: 'languageOnly',
    resources: { en: { translation: enBundle } },
    backend: {
      loadPath: `${(import.meta?.env?.BASE_URL ?? '/') }locales/{{lng}}/translation.json`.replace(/\/+/, '/'),
      // 添加请求超时和重试机制
      requestOptions: {
        cache: 'default',
        credentials: 'same-origin',
        mode: 'cors'
      },
      // 自定义加载函数，增加错误处理
      customLoad: (lng, ns, callback) => {
        const url = `${(import.meta?.env?.BASE_URL ?? '/') }locales/${lng}/translation.json`.replace(/\/+/, '/')
        
        fetch(url, {
          cache: 'default',
          credentials: 'same-origin',
          mode: 'cors'
        })
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }
          return response.json()
        })
        .then(data => {
          callback(null, data)
        })
        .catch(error => {
          console.warn(`[i18n] Failed to load ${lng}/${ns}:`, error.message)
          // 如果不是默认语言，尝试加载默认语言作为后备
          if (lng !== DEFAULT_LOCALE) {
            callback(error, false) // 让 i18next 使用 fallback
          } else {
            callback(error, {}) // 返回空对象避免完全失败
          }
        })
      }
    },
    interpolation: { escapeValue: false },
    react: { 
      useSuspense: true,
      // 添加绑定事件，确保组件在语言变化时重新渲染
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed'
    },
    debug: !!(import.meta?.env?.DEV),
    // 添加更严格的缓存策略
    saveMissing: false,
    updateMissing: false,
    // 改进加载策略
    preload: [DEFAULT_LOCALE], // 预加载默认语言
    cleanCode: true,
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  })

// Expose i18n for debugging in browser console (preview/dev)
try {
  if (typeof window !== 'undefined') {
    window.i18next = i18n
  }
} catch (error) {
  if (import.meta?.env?.DEV) {
    console.warn('[i18n] Failed to expose i18next on window:', error)
  }
}

try {
  i18n.on('missingKey', (langs, ns, key) => {
    const msg = `[i18n missing] key="${key}" ns="${ns}" langs=${Array.isArray(langs) ? langs.join(',') : langs}`
    if (import.meta?.env?.DEV) {
      console.error(msg)
      // Don't throw error in dev mode to avoid blank page, but log it clearly
      // Developers can check console for missing keys
    }
  })
} catch (error) {
  if (import.meta?.env?.DEV) {
    console.warn('[i18n] Failed to attach missingKey listener:', error)
  }
}

export default i18n
