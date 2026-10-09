import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import logger from '@/utils/logger'

const PAGE_HEAD_SELECTOR = 'link[rel="canonical"],link[rel="alternate"][hreflang],meta[name="description"],meta[name="robots"],meta[name="googlebot"],meta[property^="og:"],meta[name^="twitter:"],script[type="application/ld+json"]'

function readPageHead(doc) {
  return {
    title: doc.title,
    lang: doc.documentElement.lang,
    nodes: [...doc.head.querySelectorAll(PAGE_HEAD_SELECTOR)].map(node => node.cloneNode(true)),
  }
}

const INITIAL_PAGE_HEAD = typeof document === 'undefined' ? null : {
  pathname: window.location.pathname,
  ...readPageHead(document),
}

function replacePageHead(head) {
  const fragment = document.createDocumentFragment()
  for (const node of head.nodes) fragment.appendChild(document.importNode(node, true))
  document.head.querySelectorAll(PAGE_HEAD_SELECTOR).forEach(node => node.remove())
  document.head.appendChild(fragment)
  document.title = head.title
  document.documentElement.lang = head.lang
}

// Use the existing prerendered document as the source of truth on SPA navigation.
export default function Seo({ title, lang = 'en', description, noindex }) {
  const { pathname } = useLocation()

  useEffect(() => {
    if (!INITIAL_PAGE_HEAD) return undefined
    if (pathname === INITIAL_PAGE_HEAD.pathname) {
      replacePageHead(INITIAL_PAGE_HEAD)
      return undefined
    }

    // Remove the previous page's signals even if loading the new head fails.
    document.head.querySelectorAll(PAGE_HEAD_SELECTOR).forEach(node => node.remove())
    const controller = new AbortController()
    let cancelled = false
    const timeout = window.setTimeout(() => controller.abort(), 10000)

    async function synchronizeHead() {
      try {
        const response = await fetch(pathname, { signal: controller.signal })
        if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) {
          throw new Error(`Invalid page response (${response.status})`)
        }
        if (new URL(response.url).origin !== window.location.origin) {
          throw new Error('Unexpected page origin')
        }
        const doc = new DOMParser().parseFromString(await response.text(), 'text/html')
        const canonicals = doc.head.querySelectorAll('link[rel="canonical"]')
        if (!doc.title.trim() || !doc.documentElement.lang || canonicals.length !== 1) {
          throw new Error('Missing prerendered page metadata')
        }
        const canonical = new URL(canonicals[0].getAttribute('href'))
        if (!['http:', 'https:'].includes(canonical.protocol)) {
          throw new Error('Invalid canonical URL')
        }
        const normalizePath = path => path.endsWith('/') ? path : `${path}/`
        const responsePath = normalizePath(new URL(response.url).pathname)
        const payloadNode = doc.getElementById('pv-initial-content')
        const payload = payloadNode ? JSON.parse(payloadNode.textContent) : null
        if (payload?.path && normalizePath(payload.path) !== responsePath) {
          throw new Error('Prerendered content belongs to another route')
        }
        // Explicit fallback pages have their own embedded route and may canonicalize elsewhere.
        if (normalizePath(canonical.pathname) !== responsePath && normalizePath(payload?.path || '') !== responsePath) {
          throw new Error('Page metadata belongs to another route')
        }
        for (const script of doc.head.querySelectorAll('script[type="application/ld+json"]')) {
          if (script.hasAttribute('src')) throw new Error('Unexpected structured data source')
          JSON.parse(script.textContent)
        }
        if (!cancelled) replacePageHead(readPageHead(doc))
      } catch (error) {
        if (!cancelled) logger.error('[Seo] Could not synchronize prerendered head', pathname, error)
      } finally {
        window.clearTimeout(timeout)
      }
    }

    synchronizeHead()
    return () => {
      cancelled = true
      controller.abort()
      window.clearTimeout(timeout)
    }
  }, [pathname])

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
