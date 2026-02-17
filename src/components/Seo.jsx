import { createPortal } from 'react-dom'

// Lightweight head manager using portals so we stay within React's declarative flow.
export default function Seo({
  title,
  canonical,
  description,
  meta = [],
  hreflang = [],
  lang = 'en',
  noindex = false,
  jsonLd = [],
}) {
  const metas = Array.isArray(meta) ? meta : []
  const hreflangs = Array.isArray(hreflang) ? hreflang : []
  const jsonLdItems = Array.isArray(jsonLd) ? jsonLd : (jsonLd ? [jsonLd] : [])

  if (typeof document === 'undefined') return null

  try {
    if (document.documentElement && document.documentElement.getAttribute('lang') !== lang) {
      document.documentElement.setAttribute('lang', lang)
    }
  } catch {
    // Ignore SSR / unsupported environments.
  }

  return createPortal(
    <>
      {title ? <title>{title}</title> : null}
      {canonical ? <link rel="canonical" href={canonical} /> : null}
      {description ? <meta name="description" content={description} /> : null}
      {noindex ? <meta name="robots" content="noindex,nofollow" /> : null}
      {hreflangs.map((entry, index) => (
        <link key={`hreflang-${index}`} rel="alternate" hrefLang={entry.hreflang} href={entry.href} />
      ))}
      {metas.map((entry, index) =>
        entry?.name ? (
          <meta key={`meta-name-${index}`} name={entry.name} content={entry.content || ''} />
        ) : entry?.property ? (
          <meta key={`meta-prop-${index}`} property={entry.property} content={entry.content || ''} />
        ) : null,
      )}
      {jsonLdItems.map((item, index) => (
        <script
          key={`json-ld-${index}`}
          type="application/ld+json"
          // Escape "<" to avoid accidentally closing script tags from content.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, '\\u003c') }}
        />
      ))}
    </>,
    document.head,
  )
}
