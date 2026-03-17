// i18n initialization for Pixel Art Village
// Lazy-load JSON from /public/locales/{lang}/translation.json
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'
import localeConfig from '../config/locales.json'
import fallbackEn from './locales/en.json'
import safeStorage from './utils/safeStorage'
import logger from './utils/logger'

export const DEFAULT_LOCALE = localeConfig?.default || 'en'
export const CANONICAL_LOCALE = DEFAULT_LOCALE

const BASE_LANGS = localeConfig?.supported || ['en', 'es', 'id', 'de', 'pl', 'it', 'pt', 'fr', 'ru', 'tl', 'vi', 'ja', 'sv', 'nb', 'nl', 'ar', 'ko', 'th']
// 可选：在开发环境下通过 VITE_ENABLE_PSEUDO=1 启用伪本地化语言 'pseudo'
export const SUPPORTED_LANGS = (() => {
  try {
    if (import.meta.env.VITE_ENABLE_PSEUDO) return [...BASE_LANGS, 'pseudo']
  } catch { /* noop */ }
  return BASE_LANGS
})()

const STORAGE_KEY = 'pv_lang'
const STORAGE_TTL = 365 * 24 * 60 * 60 * 1000 // 1 year
const IS_BROWSER = typeof window !== 'undefined'

function readInitialI18nPayload() {
  if (!IS_BROWSER) return null
  try {
    const el = document.getElementById('pv-initial-i18n')
    if (!el || !el.textContent) return null
    const payload = JSON.parse(el.textContent)
    const lang = SUPPORTED_LANGS.includes(payload?.lang) ? payload.lang : null
    const resources = payload?.resources
    if (!lang || !resources || typeof resources !== 'object') return null
    if (!resources[lang]?.translation) return null
    return { lang, resources }
  } catch {
    return null
  }
}

export function getStoredLang() {
  try {
    const raw = safeStorage.get(STORAGE_KEY)
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
    safeStorage.set(STORAGE_KEY, JSON.stringify({ lang, ts: Date.now() }))
  } catch { /* ignore */ }
}

export function detectBrowserLang() {
  const nav = typeof navigator !== 'undefined' ? navigator : null
  const cands = []
  if (nav?.languages && Array.isArray(nav.languages)) cands.push(...nav.languages)
  if (nav?.language) cands.push(nav.language)

  // 调试日志
  if (import.meta.env.DEV) {
    console.log('[detectBrowserLang] 浏览器语言候选:', cands)
    console.log('[detectBrowserLang] 支持的语言:', SUPPORTED_LANGS)
  }

  // 优先检查英文
  for (const c of cands) {
    if (!c) continue
    const lc = String(c).toLowerCase()
    const base = lc.split('-')[0]
    if (base === 'en') {
      if (import.meta.env.DEV) {
        console.log('[detectBrowserLang] 检测到英文，优先返回:', base)
      }
      return 'en'
    }
  }

  // 检查其他支持的语言
  for (const c of cands) {
    if (!c) continue
    const lc = String(c).toLowerCase()
    const base = lc.split('-')[0]
    if (SUPPORTED_LANGS.includes(base)) {
      if (import.meta.env.DEV) {
        console.log('[detectBrowserLang] 检测到支持的语言:', base)
      }
      return base
    }
  }

  if (import.meta.env.DEV) {
    console.log('[detectBrowserLang] 未检测到支持的语言，返回默认: en')
  }
  return 'en'
}

// 服务端渲染只需要一个最小的英文实例，避免在 Node 里请求浏览器本地资源。
if (!i18n.isInitialized) {
  const commonConfig = {
    lng: 'en', // 强制使用英语作为初始语言
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: SUPPORTED_LANGS,
    ns: ['translation'],
    defaultNS: 'translation',
    load: 'languageOnly',
    interpolation: { escapeValue: false },
    detection: {
      order: ['none'],
      caches: [],
    },
  }

  if (IS_BROWSER) {
    const initialPayload = readInitialI18nPayload()
    i18n
      .use(HttpBackend)
      .use(initReactI18next)
      .init({
        ...commonConfig,
        lng: initialPayload?.lang || DEFAULT_LOCALE,
        resources: initialPayload?.resources || {
          [DEFAULT_LOCALE]: {
            translation: fallbackEn,
          },
        },
        partialBundledLanguages: true,
        backend: {
          loadPath: '/locales/{{lng}}/translation.json',
        },
        react: { useSuspense: true },
      })
  } else {
    i18n
      .use(initReactI18next)
      .init({
        ...commonConfig,
        resources: {
          en: {
            translation: fallbackEn,
          },
        },
        react: { useSuspense: false },
      })
  }
}

// 改进的缺失键处理 - 提供更好的调试信息
try {
  i18n.on('missingKey', (lngs, ns, key) => {
    const msg = `[i18n missing] key="${key}" ns="${ns}" langs=${Array.isArray(lngs)?lngs.join(','):lngs}`
    if (import.meta.env.DEV) {
      console.warn(msg)
      // 提供修复建议
      console.info(`💡 修复建议: 在 public/locales/en/translation.json 中添加 "${key}": ""`)
    }
    // 生产环境可以选择发送到错误监控服务
    // if (import.meta.env.PROD && typeof window !== 'undefined') {
    //   window.gtag?.('event', 'i18n_missing_key', { key, ns, langs: lngs })
    // }
  })
} catch (error) {
  logger.error('[i18n] 缺失键监听器设置失败:', error)
}

export default i18n
