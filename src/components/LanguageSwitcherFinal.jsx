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

export default function LanguageSwitcherFinal() {
  const { t, i18n } = useTranslation()
  const [currentLang, setCurrentLang] = useState('en')

  useEffect(() => {
    // 设置当前语言
    setCurrentLang(i18n.language || 'en')
  }, [i18n.language])

  const handleLanguageChange = (newLang) => {
    console.log(`[LanguageSwitcher] Changing language from ${currentLang} to ${newLang}`)

    // 获取当前路径信息
    const currentPath = window.location.pathname
    const search = window.location.search
    const hash = window.location.hash

    let newPath
    if (newLang === 'en') {
      // 英语：移除语言前缀
      newPath = currentPath.replace(/^\/[a-z]{2}\//, '/') || '/'
    } else {
      // 其他语言：添加语言前缀
      newPath = currentPath.replace(/^\/[a-z]{2}\//, '/') || '/'
      newPath = `/${newLang}${newPath === '/' ? '' : newPath}`
    }

    // 导航到新路径
    window.location.href = newPath + search + hash
  }

  return (
    <div
      className="language-switcher"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        backgroundColor: '#1d4ed8',
        border: '2px solid #1e40af',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#ffffff',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#2563eb'
        e.currentTarget.style.borderColor = '#1d4ed8'
        e.currentTarget.style.transform = 'translateY(-1px)'
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#1d4ed8'
        e.currentTarget.style.borderColor = '#1e40af'
        e.currentTarget.style.transform = 'translateY(0px)'
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
      }}
      title="切换语言 / Change Language"
    >
      <span style={{
        fontSize: '16px',
        whiteSpace: 'nowrap'
      }}>
        🌍 Language
      </span>

      <select
        value={currentLang}
        onChange={(e) => handleLanguageChange(e.target.value)}
        style={{
          padding: '6px 8px',
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          backgroundColor: '#ffffff',
          color: '#1f2937',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          outline: 'none',
          minWidth: '140px',
          height: '32px'
        }}
      >
        {Object.entries(LANGUAGES).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}