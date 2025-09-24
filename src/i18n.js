// i18n initialization for Pixel Art Village
// Lazy-load JSON from /public/locales/{lang}/translation.json
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpBackend from 'i18next-http-backend'

export const SUPPORTED_LANGS = [
  'en', 'es', 'id', 'de', 'pl', 'it', 'pt', 'fr', 'ru', 'fil', 'vi',
]

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
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGS,
    ns: ['translation'],
    defaultNS: 'translation',
    load: 'languageOnly',
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })

export default i18n

