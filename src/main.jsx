import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LangRoot from './components/LangRoot.jsx'
import i18n from '@/i18n'

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

;(async () => {
  try {
    // 最小改动：在挂载前确保翻译命名空间已加载，避免键名闪现
    await i18n.loadNamespaces('translation')
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.warn('i18n loadNamespaces failed:', error)
    }
  }
  createRoot(rootEl).render(
    <StrictMode>
      <LangRoot />
    </StrictMode>
  )
})()

// 保持验证/外链块永久隐藏，不再在运行时显示，避免任何刷新闪屏
