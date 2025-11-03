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

export default function LanguageSwitcherBalanced() {
  const { t, i18n } = useTranslation()
  const [currentLang, setCurrentLang] = useState('en')

  useEffect(() => {
    setCurrentLang(i18n.language || 'en')
  }, [i18n.language])

  const handleLanguageChange = (newLang) => {
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
      className="language-switcher-balanced"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#374151',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f9fafb'
        e.currentTarget.style.borderColor = '#d1d5db'
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#ffffff'
        e.currentTarget.style.borderColor = '#e5e7eb'
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
      }}
      title="选择语言 / Select Language"
    >
      <span style={{
        fontSize: '14px',
        color: '#6b7280',
        fontWeight: '500',
        whiteSpace: 'nowrap'
      }}>
        🌍
      </span>

      <select
        value={currentLang}
        onChange={(e) => handleLanguageChange(e.target.value)}
        style={{
          padding: '4px 8px',
          border: '1px solid #d1d5db',
          borderRadius: '4px',
          backgroundColor: '#ffffff',
          color: '#374151',
          fontSize: '13px',
          fontWeight: '500',
          cursor: 'pointer',
          outline: 'none',
          minWidth: '110px',
          height: '28px',
          lineHeight: '20px'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#3b82f6'
          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#d1d5db'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="de">Deutsch</option>
        <option value="fr">Français</option>
        <option value="ja">日本語</option>
        <option value="ko">한국어</option>
        <option value="zh">中文</option>
        <option value="pt">Português</option>
        <option value="ru">Русский</option>
        <option value="it">Italiano</option>
        <option value="pl">Polski</option>
        <option value="nl">Nederlands</option>
        <option value="sv">Svenska</option>
        <option value="no">Norsk</option>
        <option value="ar">العربية</option>
        <option value="th">ไทย</option>
        <option value="vi">Tiếng Việt</option>
        <option value="id">Bahasa Indonesia</option>
        <option value="fil">Filipino</option>
      </select>

      <div style={{
        fontSize: '11px',
        color: '#9ca3af',
        fontWeight: 'normal',
        whiteSpace: 'nowrap'
      }}>
        {currentLang === 'en' ? 'EN' :
         currentLang === 'zh' ? '中文' :
         currentLang === 'ja' ? '日本語' :
         currentLang === 'ko' ? '한국어' :
         currentLang === 'ar' ? 'العربية' :
         currentLang === 'th' ? 'ไทย' :
         currentLang.toUpperCase()}
      </div>
    </div>
  )
}