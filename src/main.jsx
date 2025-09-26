import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LangRoot from './components/LangRoot.jsx'
import i18n from '@/i18n'

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Root element #root not found')
}

// Initialize Web Vitals tracking
import('./utils/initWebVitals.js').then(({ initWebVitals }) => {
  if (typeof initWebVitals === 'function') {
    initWebVitals()
  }
})

;(async () => {
  try {
    // 最小改动：在挂载前确保翻译命名空间已加载，避免键名闪现
    await i18n.loadNamespaces('translation')
  } catch {}
  createRoot(rootEl).render(
    <StrictMode>
      <LangRoot />
    </StrictMode>
  )
})()

// 保持验证/外链块永久隐藏，不再在运行时显示，避免任何刷新闪屏

if (import.meta.env.PROD) {
  // 接入上报端点时替换为 sendBeacon 上报
  import('./utils/initWebVitals.js').then(({ initWebVitals }) => {
    if (typeof initWebVitals === 'function') {
      initWebVitals(() => {})
    }
  })
}
