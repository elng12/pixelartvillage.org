import { useEffect } from 'react'

// Keep runtime responsibility minimal: prerender owns SEO head tags,
// while the client only syncs visible browser state for SPA navigation.
export default function Seo({ title, lang = 'en', description, noindex }) {
  useEffect(() => {
    if (typeof document === 'undefined') return

    try {
      if (title && document.title !== title) {
        document.title = title
      }

      if (document.documentElement && document.documentElement.getAttribute('lang') !== lang) {
        document.documentElement.setAttribute('lang', lang)
      }

      if (typeof description === 'string') {
        const nextDescription = description.trim()
        if (nextDescription) {
          let meta = document.querySelector('meta[name="description"]')
          if (!meta) {
            meta = document.createElement('meta')
            meta.setAttribute('name', 'description')
            document.head.appendChild(meta)
          }
          if (meta.getAttribute('content') !== nextDescription) {
            meta.setAttribute('content', nextDescription)
          }
        }
      }

      const shouldNoIndex = Boolean(noindex)
      const robotsMeta = document.querySelector('meta[name="robots"]')
      if (shouldNoIndex) {
        if (!robotsMeta) {
          const meta = document.createElement('meta')
          meta.setAttribute('name', 'robots')
          meta.setAttribute('content', 'noindex')
          document.head.appendChild(meta)
        } else if (robotsMeta.getAttribute('content') !== 'noindex') {
          robotsMeta.setAttribute('content', 'noindex')
        }
      } else if (robotsMeta) {
        const content = String(robotsMeta.getAttribute('content') || '').toLowerCase()
        if (content.includes('noindex')) {
          robotsMeta.remove()
        }
      }
    } catch {
      // Ignore unsupported environments.
    }
  }, [description, lang, noindex, title])

  return null
}
