import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CANONICAL_LOCALE } from '@/i18n'
import { getLocaleFallbackChain } from '@/utils/locale'

const CONTENT_LOADERS = {
  'blog-posts': import.meta.glob('../content/blog-posts.*.json'),
  'pseo-pages': import.meta.glob('../content/pseo-pages.*.json'),
}

const LOCALE_PATTERN = /\.([a-z0-9-]+)\.json$/i

function findLoader(loaders, locale) {
  return Object.entries(loaders).find(([path]) => {
    const match = path.match(LOCALE_PATTERN)
    return match && match[1]?.toLowerCase() === locale
  })
}

export function useLocalizedContent(baseName) {
  const { i18n } = useTranslation()
  const [state, setState] = useState({ data: null, locale: null, fallback: false })

  useEffect(() => {
    let cancelled = false
    const loaders = CONTENT_LOADERS[baseName]
    if (!loaders) {
      setState({ data: null, locale: null, fallback: false })
      return
    }

    const locales = getLocaleFallbackChain(i18n.language || CANONICAL_LOCALE)
    ;(async () => {
      for (const locale of locales) {
        const loaderEntry = findLoader(loaders, locale)
        if (!loaderEntry) continue
        try {
          const module = await loaderEntry[1]()
          if (cancelled) return
          setState({ data: module.default ?? module, locale, fallback: locale !== locales[0] })
          return
        } catch {
          /* try next fallback */
        }
      }
      if (!cancelled) {
        setState({ data: null, locale: null, fallback: false })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [baseName, i18n.language])

  return state
}
