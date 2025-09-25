import React, { useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import i18n from '@/i18n'
import { SUPPORTED_LANGS, setStoredLang } from '@/i18n'

const LABELS = {
  en: 'English', es: 'Español', id: 'Bahasa', de: 'Deutsch', pl: 'Polski', it: 'Italiano',
  pt: 'Português', fr: 'Français', ru: 'Русский', fil: 'Filipino', vi: 'Tiếng Việt', ja: 'japan',
}

function getLangLabel(code) {
  if (LABELS[code]) return LABELS[code]
  try {
    if (typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function') {
      const dn = new Intl.DisplayNames([code], { type: 'language' })
      const name = dn.of(code)
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
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const currentLang = useMemo(() => (params.lang && SUPPORTED_LANGS.includes(params.lang) ? params.lang : 'en'), [params.lang])

  const onChange = useCallback((e) => {
    const next = e.target.value
    if (!SUPPORTED_LANGS.includes(next)) return
    const suffix = stripLeadingLang(location.pathname)
    const search = location.search || ''
    const keepHash = (() => {
      try {
        if (!import.meta?.env?.VITE_PRESERVE_HASH_ON_LANG_SWITCH) return false
        const raw = (location.hash || '').slice(1)
        if (!raw) return false
        const id = decodeURIComponent(raw)
        if (typeof document === 'undefined') return false
        return !!document.getElementById(id)
      } catch { return false }
    })()
    const nextUrl = `/${next}${suffix}${search}${keepHash ? location.hash : ''}`
    // 先同步 URL，再切换语言，避免竞态
    navigate(nextUrl, { replace: true })
    setStoredLang(next)
    i18n.changeLanguage(next)
  }, [location.pathname, location.search, location.hash, navigate])

  return (
    <label className="inline-flex items-center gap-2 text-sm text-gray-600">
      <span className="sr-only">{t('lang.label')}</span>
      <select aria-label={t('lang.label')} value={currentLang} onChange={onChange}
        className="px-2 py-1 rounded-md border border-gray-300 bg-white text-gray-800 hover:border-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        data-build={typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : 'dev'}>
        {SUPPORTED_LANGS.map((l) => (
          <option key={l} value={l}>{getLangLabel(l)}</option>
        ))}
      </select>
    </label>
  )
}
