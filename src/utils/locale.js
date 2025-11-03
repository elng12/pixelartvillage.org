import { CANONICAL_LOCALE, SUPPORTED_LANGS } from '@/i18n'

export const RUNTIME_LANGS = Array.from(new Set(SUPPORTED_LANGS.filter(Boolean)))

function ensureLeadingSlash(input = '/') {
  if (!input) return '/'
  return input.startsWith('/') ? input : `/${input}`
}

function ensureTrailingSlash(path) {
  if (!path || path === '/') return '/'
  return path.endsWith('/') ? path : `${path}/`
}

export function buildLocalizedPath(locale, rawInput = '/') {
  if (!rawInput) rawInput = '/'
  if (typeof rawInput !== 'string') return rawInput

  if (rawInput.startsWith('http') || rawInput.startsWith('mailto:')) return rawInput
  if (rawInput.startsWith('#')) return rawInput

  let path = rawInput
  let hash = ''
  let search = ''

  const hashIndex = path.indexOf('#')
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex)
    path = path.slice(0, hashIndex)
  }

  const searchIndex = path.indexOf('?')
  if (searchIndex >= 0) {
    search = path.slice(searchIndex)
    path = path.slice(0, searchIndex)
  }

  const normalized = ensureLeadingSlash(path || '/')

  let localized
  if (!locale || locale === CANONICAL_LOCALE) {
    localized = ensureTrailingSlash(normalized)
  } else {
    const appended = normalized === '/' ? `/${locale}` : `/${locale}${normalized}`
    localized = ensureTrailingSlash(appended.replace(/\/{2,}/g, '/'))
  }

  if (localized !== '/' && hash) {
    localized = localized.replace(/\/+$/, '/')
  }

  return `${localized}${search}${hash}`
}

export function stripLeadingLang(pathname = '/') {
  const normalized = ensureLeadingSlash(pathname)
  const match = normalized.match(/^\/(?<lang>[^/]+)(?<rest>\/.*|\/?)?$/)
  if (!match?.groups?.lang) return normalized
  const candidate = match.groups.lang
  if (!RUNTIME_LANGS.includes(candidate)) return normalized
  const rest = match.groups.rest || '/'
  return rest.startsWith('/') ? rest : `/${rest}`
}

export function extractLocaleFromPath(pathname = '/') {
  const normalized = ensureLeadingSlash(pathname)
  const match = normalized.match(/^\/(?<lang>[^/]+)(?:\/|$)/)
  if (!match?.groups?.lang) return null
  const { lang } = match.groups
  return RUNTIME_LANGS.includes(lang) ? lang : null
}

export function getLocaleFallbackChain(locale) {
  const chain = []
  if (locale) {
    const lowered = locale.toLowerCase()
    chain.push(lowered)
    const parts = lowered.split('-')
    if (parts.length > 1) {
      const base = parts[0]
      if (!chain.includes(base)) chain.push(base)
    }
  }
  if (!chain.includes(CANONICAL_LOCALE)) chain.push(CANONICAL_LOCALE)
  return chain
}
