import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LangRoot from './components/LangRoot.jsx'

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

createRoot(rootEl).render(
  <StrictMode>
    <LangRoot />
  </StrictMode>
)

if (import.meta.env.PROD) {
  // 接入上报端点时替换为 sendBeacon 上报
  import('./utils/initWebVitals.js').then(({ initWebVitals }) => {
    if (typeof initWebVitals === 'function') {
      initWebVitals(() => {})
    }
  })
}