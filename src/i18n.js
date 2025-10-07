// i18n initialization for Pixel Art Village
// Lazy-load JSON from /public/locales/{lang}/translation.json
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'
import enBundle from '@/locales/en.json'

const BASE_LANGS = ['en']
// 保留扩展点：允许通过 VITE_ENABLE_PSEUDO=1 启用伪本地化，但默认仅提供英文版本
export const SUPPORTED_LANGS = (() => {
  try {
    if (import.meta?.env?.VITE_ENABLE_PSEUDO) return [...BASE_LANGS, 'pseudo']
  } catch { /* noop */ }
  return BASE_LANGS
})()

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
  } catch { /* ignore */ }
}

export function detectBrowserLang() {
  const nav = typeof navigator !== 'undefined' ? navigator : null
  const cands = []
  if (nav?.languages && Array.isArray(nav.languages)) cands.push(...nav.languages)
  if (nav?.language) cands.push(nav.language)
  for (const c of cands) {
    if (!c) continue
    const lc = String(c).toLowerCase()
    // map regioned to base: pt-BR -> pt, en-US -> en
    const base = lc.split('-')[0]
    if (SUPPORTED_LANGS.includes(base)) return base
  }
  return 'en'
}

// Initialize i18n
i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGS,
    ns: ['translation'],
    defaultNS: 'translation',
    load: 'languageOnly',
    // 将英文资源内置进主包，其它语言仍经由 HttpBackend 按需加载
    resources: { en: { translation: enBundle } },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    interpolation: { escapeValue: false },
    // 启用 Suspense：在资源未就绪时由 <Suspense> 兜底，避免闪现键名
    react: { useSuspense: true },
  })

// 在开发环境中，缺失 key 立即报错并在控制台标红，防止漏补
try {
  i18n.on('missingKey', (lngs, ns, key) => {
    const msg = `[i18n missing] key="${key}" ns="${ns}" langs=${Array.isArray(lngs)?lngs.join(','):lngs}`
    if (import.meta?.env?.DEV) {
      // 控制台显式报错，并抛出异常以便 ErrorBoundary 捕获
      // 注意：仅当英文基线也缺失时才会触发此事件
      // 若仅当前语言缺失、英文存在，将回退到英文，不触发此事件
      // 因此不会影响正常的回退策略
      console.error(msg)
      throw new Error(msg)
    }
  })
} catch { /* noop */ }

export default i18n
