import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export default function LanguageSwitcherMinimal() {
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

  const commonLanguages = [
    { code: 'en', name: 'EN' },
    { code: 'es', name: 'ES' },
    { code: 'de', name: 'DE' },
    { code: 'fr', name: 'FR' },
    { code: 'ja', name: 'JA' },
    { code: 'ko', name: 'KO' },
    { code: 'zh', name: '中文' },
    { code: 'pt', name: 'PT' },
    { code: 'ru', name: 'RU' }
  ]

  return (
    <div
      className="language-switcher-minimal"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '2px'
      }}
    >
      <span
        style={{
          fontSize: '12px',
          color: '#6b7280',
          marginRight: '4px',
          cursor: 'default'
        }}
      >
        🌍
      </span>

      <select
        value={currentLang}
        onChange={(e) => handleLanguageChange(e.target.value)}
        style={{
          padding: '2px 6px',
          border: '1px solid #e5e7eb',
          borderRadius: '4px',
          backgroundColor: '#ffffff',
          color: '#374151',
          fontSize: '12px',
          cursor: 'pointer',
          outline: 'none',
          minWidth: '60px',
          height: '24px',
          lineHeight: '18px'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#3b82f6'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#e5e7eb'
        }}
      >
        {commonLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
        <option value="it">IT</option>
        <option value="pl">PL</option>
        <option value="nl">NL</option>
        <option value="sv">SV</option>
        <option value="no">NO</option>
        <option value="ar">العربية</option>
        <option value="th">ไทย</option>
        <option value="vi">VI</option>
        <option value="id">ID</option>
        <option value="fil">FIL</option>
      </select>
    </div>
  )
}