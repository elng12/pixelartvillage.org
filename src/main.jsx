import logger from '@/utils/logger'
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LangRoot from './components/LangRoot.jsx'
import i18n, { SUPPORTED_LANGS, setStoredLang } from '@/i18n'
import { ensureClarityLoaded } from './clarity-init.js'
import { ensureGtmLoaded, insertGtmNoScript } from './gtm-init.js'
import { ensureGaLoaded } from './ga-init.js'

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
    if (import.meta.env?.DEV) {
      console.debug('initWebVitals bootstrap failed:', error?.message)
    }
  }
}

// Initialize Web Vitals tracking once，根据环境决定回调
const reportWebVitals = import.meta.env.PROD ? () => {} : undefined
bootstrapWebVitals(reportWebVitals)

// Load analytics only when explicitly enabled for production
const ENABLE_ANALYTICS = Boolean(import.meta.env?.PROD) && String(import.meta.env?.VITE_ENABLE_ANALYTICS) === '1'
if (ENABLE_ANALYTICS) {
  ensureGaLoaded('G-5RG3H97P63')
  ensureClarityLoaded()
  ensureGtmLoaded()
  insertGtmNoScript()
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
        if (import.meta.env?.DEV) {
          logger.warn('Failed to persist language preference:', error)
        }
      }
    }
  } catch (error) {
    if (import.meta.env?.DEV) {
      logger.warn('ensureInitialLanguage failed:', error)
    }
  }
}

;(async () => {
  try {
    await ensureInitialLanguage()
    // 最小改动：在挂载前确保翻译命名空间已加载，避免键名闪现
    await i18n.loadNamespaces('translation')
  } catch (error) {
    if (import.meta.env?.DEV) {
      logger.warn('i18n loadNamespaces failed:', error)
    }
  }
  createRoot(rootEl).render(
    <StrictMode>
      <LangRoot />
    </StrictMode>
  )
})()

// 保持验证/外链块永久隐藏，不再在运行时显示，避免任何刷新闪屏
