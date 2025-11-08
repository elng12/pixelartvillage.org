import { useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { SUPPORTED_LANGS as RUNTIME_LANGS } from '@/i18n'
import useLanguageSync from '@/hooks/useLanguageSync'

const LANGUAGE_LABELS = {
  en: 'English',
  es: 'Español',
  id: 'Bahasa Indonesia',
  de: 'Deutsch',
  pl: 'Polski',
  it: 'Italiano',
  pt: 'Português',
  fr: 'Français',
  ru: 'Русский',
  fil: 'Filipino',
  vi: 'Tiếng Việt',
  ja: '日本語',
  sv: 'Svenska',
  no: 'Norsk',
  nl: 'Nederlands',
  ar: 'العربية',
  ko: '한국어',
  th: 'ไทย',
  pseudo: 'Pseudo (Test)',
}

function getLanguageLabel(code) {
  if (LANGUAGE_LABELS[code]) return LANGUAGE_LABELS[code]
  try {
    if (typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function') {
      const displayNames = new Intl.DisplayNames([code], { type: 'language' })
      const name = displayNames.of(code)
      if (name && typeof name === 'string') return name
    }
  } catch {
    /* ignore */
  }
  return code
}

export default function LanguageSwitcherBalanced() {
  const { t } = useTranslation()
  const location = useLocation()
  const { currentLang, handleLanguageChange } = useLanguageSync()

  const handleChange = useCallback(async (event) => {
    const nextLang = event?.target?.value || ''
    await handleLanguageChange(nextLang)
  }, [handleLanguageChange])

  const options = useMemo(() => {
    return RUNTIME_LANGS.map((code) => ({
      code,
      label: getLanguageLabel(code),
    }))
  }, [])

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
      title={t('lang.title', 'Select language')}
    >
      <span style={{
        fontSize: '14px',
        color: '#6b7280',
        fontWeight: '500',
        whiteSpace: 'nowrap'
      }}>
        🌍
      </span>

      <label htmlFor="language-switcher" className="sr-only">
        {t('lang.label', '选择语言')}
      </label>

      <select
        id="language-switcher"
        value={currentLang}
        onChange={handleChange}
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
          minWidth: '130px',
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
        {options.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>

      <div style={{
        fontSize: '11px',
        color: '#9ca3af',
        fontWeight: 'normal',
        whiteSpace: 'nowrap'
      }}>
        {currentLang === 'en' ? 'EN' :
         currentLang === 'ja' ? '日本語' :
         currentLang === 'ko' ? '한국어' :
         currentLang === 'ar' ? 'العربية' :
         currentLang === 'th' ? 'ไทย' :
         currentLang.toUpperCase()}
      </div>
    </div>
  )
}
