import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import i18n, { SUPPORTED_LANGS, setStoredLang } from '@/i18n'

const LABELS = {
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
}

function getLangLabel(code) {
  if (LABELS[code]) return LABELS[code]
  try {
    if (typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function') {
      const displayNames = new Intl.DisplayNames([code], { type: 'language' })
      const name = displayNames.of(code)
      if (name && typeof name === 'string') return name
    }
  } catch { /* ignore */ }
  return code
}

function stripLeadingLang(pathname = '') {
  const parts = pathname.split('/')
  if (parts.length > 1 && SUPPORTED_LANGS.includes(parts[1])) {
    return '/' + parts.slice(2).join('/')
  }
  return pathname || '/'
}

export default function LanguageSwitcher() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()

  // 更可靠的语言检测：URL 参数优先，其次路径，最后回退 i18n 当前值
  const currentLang = (() => {
    if (params.lang && SUPPORTED_LANGS.includes(params.lang)) {
      return params.lang
    }
    const pathParts = location.pathname.split('/')
    if (pathParts.length > 1 && SUPPORTED_LANGS.includes(pathParts[1])) {
      return pathParts[1]
    }
    return i18n.language || 'en'
  })()

  const onChange = useCallback((event) => {
    const next = event.target.value
    if (!SUPPORTED_LANGS.includes(next)) return

    try {
      i18n.changeLanguage(next)
      setStoredLang(next)

      const suffix = stripLeadingLang(location.pathname)
      const search = location.search || ''
      // 可选：设置 VITE_PRESERVE_HASH_ON_LANG_SWITCH=1 时保留 hash（需锚点存在）
      const keepHash = (() => {
        try {
          if (!import.meta?.env?.VITE_PRESERVE_HASH_ON_LANG_SWITCH) return false
          const raw = (location.hash || '').slice(1)
          if (!raw) return false
          const id = decodeURIComponent(raw)
          if (typeof document === 'undefined') return false
          return Boolean(document.getElementById(id))
        } catch {
          return false
        }
      })()
      const nextUrl = `/${next}${suffix}${search}${keepHash ? location.hash : ''}`
      navigate(nextUrl, { replace: true })
    } catch (error) {
      console.error('Language switch error:', error)
    }
  }, [location.pathname, location.search, location.hash, navigate])

  return (
    <div className="language-switcher inline-flex items-center gap-2 text-sm text-gray-600">
      <label htmlFor="language-select" className="sr-only">{t('lang.label')}</label>
      <select
        id="language-select"
        aria-label={t('lang.label')}
        value={currentLang}
        onChange={onChange}
        className="px-2 py-1 rounded-md border border-gray-300 bg-white text-gray-800 hover:border-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-sm"
        data-build={typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : 'dev'}
      >
        {SUPPORTED_LANGS.map((lang) => (
          <option key={lang} value={lang}>
            {getLangLabel(lang)}
          </option>
        ))}
      </select>
    </div>
  )
}
