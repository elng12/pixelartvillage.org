// Hreflang utilities for multi-language SEO
const SUPPORTED_LANGS = ['en', 'es', 'id', 'de', 'pl', 'it', 'pt', 'fr', 'ru', 'fil', 'vi', 'ja'];

const LANG_REGION_MAP = {
  'en': 'en-US',
  'es': 'es-ES',
  'id': 'id-ID',
  'de': 'de-DE',
  'pl': 'pl-PL',
  'it': 'it-IT',
  'pt': 'pt-PT',
  'fr': 'fr-FR',
  'ru': 'ru-RU',
  'fil': 'fil-PH',
  'vi': 'vi-VN',
  'ja': 'ja-JP'
};

/**
 * Generate hreflang links for a given page path
 * @param {string} basePath - The base path without language prefix (e.g., '/about', '/blog/post-slug')
 * @returns {Array} Array of hreflang objects with hreflang and href properties
 */
export function generateHreflangLinks(basePath) {
  const hreflangs = [];

  // Ensure basePath starts with /
  const cleanBasePath = basePath.startsWith('/') ? basePath : `/${basePath}`;

  for (const lang of SUPPORTED_LANGS) {
    const hreflangCode = LANG_REGION_MAP[lang] || lang;

    if (lang === 'en') {
      // English uses root path as canonical
      hreflangs.push({
        hreflang: hreflangCode,
        href: `https://pixelartvillage.org${cleanBasePath === '/' ? '/' : cleanBasePath}`
      });
    } else {
      // Other languages use language prefix
      const langPath = cleanBasePath === '/' ? `/${lang}/` : `/${lang}${cleanBasePath}`;
      hreflangs.push({
        hreflang: hreflangCode,
        href: `https://pixelartvillage.org${langPath}`
      });
    }
  }

  // Add x-default pointing to English version
  hreflangs.push({
    hreflang: 'x-default',
    href: `https://pixelartvillage.org${cleanBasePath === '/' ? '/' : cleanBasePath}`
  });

  return hreflangs;
}