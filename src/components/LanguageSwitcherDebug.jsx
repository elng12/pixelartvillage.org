import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

// 注入CSS动画
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0.3; }
    }
    .language-switcher-debug-wrapper {
      animation: pulse 2s infinite !important;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1.1); }
      50% { transform: scale(1.15); }
    }
  `
  if (!document.head.querySelector('style[data-debug-switcher]')) {
    style.setAttribute('data-debug-switcher', 'true')
    document.head.appendChild(style)
  }
}

const LANGUAGES = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
  ja: '日本語',
  ko: '한국어',
  pt: 'Português',
  ru: 'Русский'
}

export default function LanguageSwitcherDebug() {
  const { t, i18n } = useTranslation()
  const [currentLang, setCurrentLang] = useState('en')
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    console.log('[LanguageSwitcherDebug] Component mounted')

    // 强制显示组件
    setIsVisible(true)
    setCurrentLang(i18n.language || 'en')

    // 添加定时器确保组件渲染
    const timer = setTimeout(() => {
      const element = document.getElementById('debug-language-switcher')
      if (element) {
        console.log('[LanguageSwitcherDebug] Found element in DOM:', element)
        element.style.display = 'block'
        element.style.visibility = 'visible'
        element.style.position = 'relative'
        element.style.zIndex = '9999'
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const handleLanguageChange = (newLang) => {
    console.log(`[LanguageSwitcherDebug] Changing language from ${currentLang} to ${newLang}`)

    // 直接使用URL导航，简单可靠
    const currentPath = window.location.pathname
    const search = window.location.search
    const hash = window.location.hash

    let newPath
    if (newLang === 'en') {
      // 英语移除语言前缀
      newPath = currentPath.replace(/^\/[a-z]{2}\//, '/') || '/'
    } else {
      // 其他语言添加语言前缀
      newPath = currentPath.replace(/^\/[a-z]{2}\//, '/') || '/'
      newPath = `/${newLang}${newPath === '/' ? '' : newPath}`
    }

    window.location.href = newPath + search + hash
  }

  if (!isVisible) {
    return <div>LOADING...</div>
  }

  return (
    <div
      id="debug-language-switcher"
      className="language-switcher-debug-wrapper"
      style={{
        display: 'block !important',
        visibility: 'visible !important',
        position: 'relative',
        zIndex: 9999,
        backgroundColor: '#ff0000',
        color: '#ffffff',
        padding: '12px',
        margin: '8px',
        border: '5px solid #00ff00',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        textAlign: 'center',
        minWidth: '200px',
        cursor: 'pointer',
        boxShadow: '0 0 20px rgba(255, 0, 0, 0.8)',
        outline: '3px solid #ffff00',
        transform: 'scale(1.1)'
      }}
    >
      <div style={{ marginBottom: '4px' }}>
        🌍 LANG: {currentLang.toUpperCase()}
      </div>

      <select
        value={currentLang}
        onChange={(e) => handleLanguageChange(e.target.value)}
        style={{
          display: 'block !important',
          visibility: 'visible !important',
          width: '100%',
          padding: '4px',
          backgroundColor: '#ffffff',
          color: '#000000',
          border: '1px solid #cccccc',
          borderRadius: '2px',
          fontSize: '12px'
        }}
      >
        {Object.entries(LANGUAGES).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>

      <div style={{
        marginTop: '8px',
        fontSize: '14px',
        backgroundColor: '#ffff00',
        color: '#000000',
        padding: '6px',
        border: '2px solid #ff00ff',
        borderRadius: '4px',
        fontWeight: 'black',
        textTransform: 'uppercase',
        animation: 'blink 1s infinite'
      }}>
        🔴 DEBUG COMPONENT 🔴
      </div>
    </div>
  )
}