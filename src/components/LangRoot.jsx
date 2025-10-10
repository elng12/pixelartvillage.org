import React, { useEffect, Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
// import ErrorBoundary from './ErrorBoundary' // 暂时禁用以调试文件上传问题
import App from '@/App'
import i18n from '@/i18n'

export default function LangRoot() {
  useEffect(() => {
    const el = document.documentElement
    const sync = () => {
      try {
        el.setAttribute('lang', i18n.language || 'en')
      } catch {
        /* noop */
      }
    }
    sync()
    i18n.on('languageChanged', sync)
    return () => {
      i18n.off('languageChanged', sync)
    }
  }, [])

  return (
    <BrowserRouter>
      {/* <ErrorBoundary> */} {/* 暂时禁用以调试文件上传问题 */}
        <Suspense fallback={<div className="container mx-auto px-4 py-10 text-sm text-gray-600" role="status">Loading...</div>}>
          <App />
        </Suspense>
      {/* </ErrorBoundary> */}
    </BrowserRouter>
  )
}
