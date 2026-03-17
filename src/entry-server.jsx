import fs from 'node:fs/promises'
import path from 'node:path'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { I18nextProvider, initReactI18next } from 'react-i18next'
import { createInstance } from 'i18next'
import App from './App.jsx'
import { DEFAULT_LOCALE, SUPPORTED_LANGS } from './i18n'
import { preloadDeferredUiForSsr } from './deferredUi.js'
import { preloadRoutePagesForSsr } from './routePages.js'

const ROOT = process.cwd()
const translationCache = new Map()

async function loadTranslation(lang) {
  const normalizedLang = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LOCALE
  if (translationCache.has(normalizedLang)) {
    return translationCache.get(normalizedLang)
  }

  const filePath = path.join(ROOT, 'public', 'locales', normalizedLang, 'translation.json')
  const raw = await fs.readFile(filePath, 'utf8')
  const data = JSON.parse(raw)
  translationCache.set(normalizedLang, data)
  return data
}

async function createServerI18n(lang) {
  const resolvedLang = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LOCALE
  const [activeTranslation, fallbackTranslation] = await Promise.all([
    loadTranslation(resolvedLang),
    resolvedLang === DEFAULT_LOCALE ? Promise.resolve(null) : loadTranslation(DEFAULT_LOCALE),
  ])

  const i18n = createInstance()
  await i18n
    .use(initReactI18next)
    .init({
      lng: resolvedLang,
      fallbackLng: DEFAULT_LOCALE,
      supportedLngs: SUPPORTED_LANGS,
      ns: ['translation'],
      defaultNS: 'translation',
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
      resources: {
        [resolvedLang]: { translation: activeTranslation },
        ...(fallbackTranslation ? { [DEFAULT_LOCALE]: { translation: fallbackTranslation } } : {}),
      },
    })

  return i18n
}

export async function renderApp(url, { lang = DEFAULT_LOCALE, initialContent = null } = {}) {
  const i18n = await createServerI18n(lang)
  const previousInitialContent = globalThis.__PV_INITIAL_CONTENT__
  const previousSsrRoutePages = globalThis.__PV_SSR_ROUTE_PAGES__
  const previousSsrDeferredUi = globalThis.__PV_SSR_DEFERRED_UI__
  const [ssrRoutePages, ssrDeferredUi] = await Promise.all([
    preloadRoutePagesForSsr(url),
    preloadDeferredUiForSsr(url),
  ])

  globalThis.__PV_SSR_ROUTE_PAGES__ = ssrRoutePages
  globalThis.__PV_SSR_DEFERRED_UI__ = ssrDeferredUi

  if (initialContent) {
    globalThis.__PV_INITIAL_CONTENT__ = initialContent
  } else {
    delete globalThis.__PV_INITIAL_CONTENT__
  }

  try {
    return renderToString(
      <I18nextProvider i18n={i18n}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </I18nextProvider>,
    )
  } finally {
    if (typeof previousInitialContent === 'undefined') {
      delete globalThis.__PV_INITIAL_CONTENT__
    } else {
      globalThis.__PV_INITIAL_CONTENT__ = previousInitialContent
    }
    if (typeof previousSsrRoutePages === 'undefined') {
      delete globalThis.__PV_SSR_ROUTE_PAGES__
    } else {
      globalThis.__PV_SSR_ROUTE_PAGES__ = previousSsrRoutePages
    }
    if (typeof previousSsrDeferredUi === 'undefined') {
      delete globalThis.__PV_SSR_DEFERRED_UI__
    } else {
      globalThis.__PV_SSR_DEFERRED_UI__ = previousSsrDeferredUi
    }
  }
}
