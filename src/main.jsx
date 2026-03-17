import logger from '@/utils/logger'
import React, { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import LangRoot from './components/LangRoot.jsx'
import i18n, { SUPPORTED_LANGS, setStoredLang } from '@/i18n'
import { createWebVitalsReporter } from './utils/reportWebVitals.js'

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Root element #root not found')
}

async function bootstrapWebVitals(reportHandler) {
  try {
    const { initWebVitals } = await import('./utils/initWebVitals.js')
    if (typeof initWebVitals === 'function') {
      initWebVitals(reportHandler)
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.debug('initWebVitals bootstrap failed:', error?.message)
    }
  }
}

function scheduleWebVitalsBootstrap(reportHandler) {
  const run = () => {
    bootstrapWebVitals(reportHandler)
  }

  const start = () => {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(run, { timeout: 2500 })
      return
    }
    window.setTimeout(run, 1200)
  }

  if (document.readyState === 'complete') {
    start()
    return
  }

  window.addEventListener('load', start, { once: true })
}

const ENABLE_WEB_VITALS =
  import.meta.env.DEV ||
  (import.meta.env.PROD && String(import.meta.env.VITE_ENABLE_WEB_VITALS) !== '0')

if (ENABLE_WEB_VITALS) {
  const reportWebVitals = createWebVitalsReporter({ debug: import.meta.env.DEV })
  scheduleWebVitalsBootstrap(reportWebVitals)
}

async function ensureInitialLanguage() {
  try {
    const params = new URLSearchParams(location.search)
    const forced = (params.get('forceLang') || '').toLowerCase()
    // const first = (location.pathname.split('/')[1] || '').toLowerCase()
    // 临时禁用自动路径语言检测，避免跳转到日语
    const target = SUPPORTED_LANGS.includes(forced) ? forced : null
    if (target && i18n.language !== target) {
      await i18n.changeLanguage(target)
      try {
        setStoredLang(target)
      } catch (error) {
        if (import.meta.env.DEV) {
          logger.warn('Failed to persist language preference:', error)
        }
      }
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      logger.warn('ensureInitialLanguage failed:', error)
    }
  }
}

;(async () => {
  try {
    await ensureInitialLanguage()
  } catch (error) {
    if (import.meta.env.DEV) {
      logger.warn('ensureInitialLanguage bootstrap failed:', error)
    }
  }
  const app = (
    <StrictMode>
      <LangRoot />
    </StrictMode>
  )
  const shouldHydrate = rootEl.hasAttribute('data-ssr-root') && rootEl.hasChildNodes()
  if (shouldHydrate) {
    hydrateRoot(rootEl, app)
    return
  }

  createRoot(rootEl).render(app)
})()

// 保持验证/外链块永久隐藏，不再在运行时显示，避免任何刷新闪屏
