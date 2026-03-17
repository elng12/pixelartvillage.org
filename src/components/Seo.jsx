import { useEffect } from 'react'

// Keep runtime responsibility minimal: prerender owns SEO head tags,
// while the client only syncs visible browser state for SPA navigation.
export default function Seo({ title, lang = 'en' }) {
  useEffect(() => {
    if (typeof document === 'undefined') return

    try {
      if (title && document.title !== title) {
        document.title = title
      }

      if (document.documentElement && document.documentElement.getAttribute('lang') !== lang) {
        document.documentElement.setAttribute('lang', lang)
      }
    } catch {
      // Ignore unsupported environments.
    }
  }, [lang, title])

  return null
}
