import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary'
import App from '@/App'
import i18n, { SUPPORTED_LANGS, setStoredLang } from '@/i18n'

// 在模块加载阶段即根据 URL 前缀同步 i18n 语言，避免初次渲染短暂英文态
try {
  const seg = (window.location.pathname.split('/')[1] || '').toLowerCase()
  if (SUPPORTED_LANGS.includes(seg) && i18n.language !== seg) {
    i18n.changeLanguage(seg)
    setStoredLang(seg)
  }
} catch { /* noop */ }

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
    return () => { i18n.off('languageChanged', sync) }
  }, [])
  
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  )
}
