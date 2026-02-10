import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CANONICAL_LOCALE } from '@/i18n'
import { getLocaleFallbackChain } from '@/utils/locale'

const CONTENT_LOADERS = {
  'blog-posts': import.meta.glob('../content/blog-posts.*.json'),
  'pseo-pages': import.meta.glob('../content/pseo-pages.*.json'),
}

const LOCALE_PATTERN = /\.([a-z0-9-]+)\.json$/i

function sortObjectKeys(a, b) {
  const aNum = Number(a)
  const bNum = Number(b)
  const aIsNum = Number.isFinite(aNum)
  const bIsNum = Number.isFinite(bNum)
  if (aIsNum && bIsNum) return aNum - bNum
  if (aIsNum) return -1
  if (bIsNum) return 1
  return String(a).localeCompare(String(b))
}

function toArray(value) {
  if (Array.isArray(value)) return value
  if (value && typeof value === 'object') {
    return Object.keys(value)
      .sort(sortObjectKeys)
      .map((key) => value[key])
  }
  return []
}

function toStringArray(value) {
  return toArray(value)
    .map((item) => (typeof item === 'string' ? item : String(item ?? '')))
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeBlogPosts(value) {
  return toArray(value)
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null
      return {
        ...entry,
        tags: toStringArray(entry.tags),
        body: toStringArray(entry.body),
      }
    })
    .filter((entry) => entry && typeof entry.slug === 'string' && entry.slug.trim())
}

function normalizeContent(baseName, value) {
  if (baseName === 'blog-posts') return normalizeBlogPosts(value)
  if (baseName === 'pseo-pages') {
    return toArray(value).filter((entry) => entry && typeof entry.slug === 'string' && entry.slug.trim())
  }
  return toArray(value)
}

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
          const normalizedData = normalizeContent(baseName, module.default ?? module)
          if (!normalizedData.length) continue
          if (cancelled) return
          setState({ data: normalizedData, locale, fallback: locale !== locales[0] })
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
