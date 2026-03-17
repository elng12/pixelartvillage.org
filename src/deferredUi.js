import { lazy } from 'react'
import { SUPPORTED_LANGS } from '@/i18n'

const deferredUiLoaders = {
  Footer: () => import('./components/Footer.jsx'),
  HomeBelowFold: () => import('./components/HomeBelowFold.jsx'),
}

const clientDeferredUi = Object.fromEntries(
  Object.entries(deferredUiLoaders).map(([name, loader]) => [name, lazy(loader)]),
)

function normalizePathname(url) {
  const parsed = new URL(url, 'https://pixelartvillage.org')
  const pathname = parsed.pathname.replace(/\/+/g, '/')
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1)
  }
  return pathname || '/'
}

function getPathSegments(url) {
  return normalizePathname(url).split('/').filter(Boolean)
}

export function getDeferredUiNamesForUrl(url) {
  const segments = getPathSegments(url)
  const offset = segments[0] && SUPPORTED_LANGS.includes(segments[0]) ? 1 : 0
  const names = ['Footer']

  if (segments.length === offset) {
    names.unshift('HomeBelowFold')
  }

  return names
}

export async function preloadDeferredUiForSsr(url) {
  const names = getDeferredUiNamesForUrl(url)
  if (!names.length) return {}

  const entries = await Promise.all(
    names.map(async (name) => {
      const mod = await deferredUiLoaders[name]()
      return [name, mod.default]
    }),
  )

  return Object.fromEntries(entries)
}

export function getDeferredUiComponent(name) {
  if (import.meta.env.SSR) {
    const Component = globalThis.__PV_SSR_DEFERRED_UI__?.[name]
    if (!Component) {
      throw new Error(`SSR deferred UI "${name}" was not preloaded`)
    }
    return Component
  }

  return clientDeferredUi[name]
}
