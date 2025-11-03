import { SUPPORTED_LANGS, CANONICAL_LOCALE } from '@/i18n'

const SITE_ORIGIN = 'https://pixelartvillage.org'

function normalizePath(path) {
  if (!path || path === '/') return '/'
  const ensured = path.startsWith('/') ? path : `/${path}`
  return ensured.endsWith('/') ? ensured.slice(0, -1) : ensured
}

function buildHref(locale, basePath) {
  if (locale === CANONICAL_LOCALE) {
    return `${SITE_ORIGIN}${basePath === '/' ? '/' : `${basePath}/`}`
  }
  const localized = `${SITE_ORIGIN}/${locale}${basePath === '/' ? '/' : `${basePath}/`}`
  return localized.replace(/\/+$/, '/')
}

/**
 * 生成指定路径的 hreflang 声明
 * @param {string} basePath - 不含语言前缀的路径（如 `/about`、`/blog/post`）
 * @returns {{hreflang: string, href: string}[]}
 */
export function generateHreflangLinks(basePath) {
  const normalized = normalizePath(basePath)
  const runtimeLangs = SUPPORTED_LANGS.filter((lang) => lang && lang !== 'pseudo')
  const uniqueLangs = Array.from(new Set(runtimeLangs))

  const links = uniqueLangs.map((lang) => ({
    hreflang: lang,
    href: buildHref(lang, normalized)
  }))

  const canonicalEntry = links.find((entry) => entry.hreflang === CANONICAL_LOCALE)
  if (canonicalEntry) {
    links.push({ hreflang: 'x-default', href: canonicalEntry.href })
  }

  return links
}
