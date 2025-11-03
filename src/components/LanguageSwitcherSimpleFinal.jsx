import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const LANGUAGES = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
  ja: '日本語',
  ko: '한국어',
  pt: 'Português',
  ru: 'Русский',
  zh: '中文',
  it: 'Italiano',
  pl: 'Polski',
  nl: 'Nederlands',
  sv: 'Svenska',
  no: 'Norsk',
  ar: 'العربية',
  th: 'ไทย',
  vi: 'Tiếng Việt',
  id: 'Bahasa Indonesia',
  fil: 'Filipino'
}

export default function LanguageSwitcherSimpleFinal() {
  const { t, i18n } = useTranslation()
  const [currentLang, setCurrentLang] = useState('en')

  useEffect(() => {
    setCurrentLang(i18n.language || 'en')
  }, [i18n.language])

  const handleLanguageChange = (newLang) => {
    console.log(`[LanguageSwitcher] Changing language from ${currentLang} to ${newLang}`)

    const currentPath = window.location.pathname
    const search = window.location.search
    const hash = window.location.hash

    let newPath
    if (newLang === 'en') {
      newPath = currentPath.replace(/^\/[a-z]{2}\//, '/') || '/'
    } else {
      newPath = currentPath.replace(/^\/[a-z]{2}\//, '/') || '/'
      newPath = `/${newLang}${newPath === '/' ? '' : newPath}`
    }

    window.location.href = newPath + search + hash
  }

  return (
    <div
      className="language-switcher-final"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#2563eb',
        border: '3px solid #1d4ed8',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#ffffff',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
        position: 'relative',
        zIndex: 100
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#1d4ed8'
        e.currentTarget.style.borderColor = '#1e40af'
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#2563eb'
        e.currentTarget.style.borderColor = '#1d4ed8'
        e.currentTarget.style.transform = 'translateY(0px)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)'
      }}
    >
      {/* 使用文字替代emoji */}
      <div style={{
        marginRight: '12px',
        fontSize: '18px',
        fontWeight: '900',
        letterSpacing: '1px'
      }}>
        [LANG]
      </div>

      <select
        value={currentLang}
        onChange={(e) => handleLanguageChange(e.target.value)}
        style={{
          padding: '8px 12px',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          backgroundColor: '#ffffff',
          color: '#1f2937',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          outline: 'none',
          minWidth: '160px',
          height: '40px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#2563eb'
          e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#e2e8f0'
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        {Object.entries(LANGUAGES).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>

      {/* 添加一个小的指示器 */}
      <div style={{
        marginLeft: '8px',
        fontSize: '12px',
        backgroundColor: '#10b981',
        color: '#ffffff',
        padding: '4px 8px',
        borderRadius: '6px',
        fontWeight: 'normal'
      }}>
        {currentLang.toUpperCase()}
      </div>
    </div>
  )
}