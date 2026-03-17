import { lazy } from 'react'
import { SUPPORTED_LANGS } from '@/i18n'

const routePageLoaders = {
  PrivacyPolicy: () => import('./components/policy/PrivacyPolicy.jsx'),
  TermsOfService: () => import('./components/policy/TermsOfService.jsx'),
  About: () => import('./components/About.jsx'),
  Contact: () => import('./components/Contact.jsx'),
  Blog: () => import('./components/Blog.jsx'),
  BlogPost: () => import('./components/BlogPost.jsx'),
  PseoPage: () => import('./components/PseoPage.jsx'),
  NotFound: () => import('./components/NotFound.jsx'),
}

const clientRoutePages = Object.fromEntries(
  Object.entries(routePageLoaders).map(([name, loader]) => [name, lazy(loader)]),
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

export function getRoutePageNamesForUrl(url) {
  const segments = getPathSegments(url)
  const offset = segments[0] && SUPPORTED_LANGS.includes(segments[0]) ? 1 : 0

  if (segments.length === offset) return []

  const section = segments[offset]
  if (section === 'privacy' && segments.length === offset + 1) return ['PrivacyPolicy']
  if (section === 'terms' && segments.length === offset + 1) return ['TermsOfService']
  if (section === 'about' && segments.length === offset + 1) return ['About']
  if (section === 'contact' && segments.length === offset + 1) return ['Contact']
  if (section === 'blog' && segments.length === offset + 1) return ['Blog']
  if (section === 'blog' && segments.length === offset + 2) return ['BlogPost']
  if (section === 'converter' && segments.length === offset + 2) return ['PseoPage']
  return ['NotFound']
}

export async function preloadRoutePagesForSsr(url) {
  const pageNames = getRoutePageNamesForUrl(url)
  if (!pageNames.length) return {}

  const entries = await Promise.all(
    pageNames.map(async (name) => {
      const mod = await routePageLoaders[name]()
      return [name, mod.default]
    }),
  )

  return Object.fromEntries(entries)
}

export function getDeferredRoutePage(name) {
  if (import.meta.env.SSR) {
    const Component = globalThis.__PV_SSR_ROUTE_PAGES__?.[name]
    if (!Component) {
      throw new Error(`SSR route page "${name}" was not preloaded`)
    }
    return Component
  }

  return clientRoutePages[name]
}
