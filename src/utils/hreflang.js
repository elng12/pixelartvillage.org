import { SUPPORTED_LANGS } from '@/i18n'

// Hreflang utilities for multi-language SEO
// 注意：为符合当前 canonical 策略（仅无语言前缀 URL 为规范版本），
// 这里生成的 hreflang 仅包含 `en` 与 `x-default`，均指向规范 URL。
// 保留多语言能力由路由与 i18n 负责，但不把各语言版本声明到 hreflang，避免"指向非规范"与工具告警。

/**
 * Generate hreflang links for a given page path
 * @param {string} basePath - The base path without language prefix (e.g., '/about', '/blog/post-slug')
 * @returns {Array} Array of hreflang objects with hreflang and href properties
 */
export function generateHreflangLinks(basePath) {
  const cleanBasePath = basePath.startsWith('/') ? basePath : `/${basePath}`;
  const canonicalPath = cleanBasePath === '/' ? '/' : cleanBasePath.replace(/\/$/, '/')
  const canonicalHref = `https://pixelartvillage.org${canonicalPath}`

  const hreflangLinks = []

  // 为所有支持的语言生成hreflang链接
  SUPPORTED_LANGS.forEach(lang => {
    const localizedPath = lang === 'en' ? canonicalPath : `/${lang}${canonicalPath}`
    const localizedHref = `https://pixelartvillage.org${localizedPath}`
    hreflangLinks.push({ hreflang: lang, href: localizedHref })
  })

  // 添加x-default指向英文版本（canonical版本）
  hreflangLinks.push({ hreflang: 'x-default', href: canonicalHref })

  return hreflangLinks
}