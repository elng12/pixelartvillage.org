import React, { useMemo, useCallback } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import i18n from '@/i18n'
import { SUPPORTED_LANGS, setStoredLang } from '@/i18n'

const LABELS = {
  en: 'English', es: 'Español', id: 'Bahasa', de: 'Deutsch', pl: 'Polski', it: 'Italiano',
  pt: 'Português', fr: 'Français', ru: 'Русский', fil: 'Filipino', vi: 'Tiếng Việt',
}

function stripLeadingLang(pathname = '') {
  const parts = pathname.split('/')
  if (parts.length > 1 && SUPPORTED_LANGS.includes(parts[1])) {
    return '/' + parts.slice(2).join('/')
  }
  return pathname || '/'
}

export default function LanguageSwitcher() {
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const currentLang = useMemo(() => (params.lang && SUPPORTED_LANGS.includes(params.lang) ? params.lang : 'en'), [params.lang])

  const onChange = useCallback((e) => {
    const next = e.target.value
    if (!SUPPORTED_LANGS.includes(next)) return
    i18n.changeLanguage(next)
    setStoredLang(next)
    const suffix = stripLeadingLang(location.pathname)
    const search = location.search || ''
    const hash = location.hash || ''
    navigate(`/${next}${suffix}${search}${hash}`, { replace: true })
  }, [location.pathname, location.search, location.hash, navigate])

  return (
    <label className="inline-flex items-center gap-2 text-sm text-gray-600">
      <span className="sr-only">Language</span>
      <select aria-label="Language" value={currentLang} onChange={onChange}
        className="px-2 py-1 rounded-md border border-gray-300 bg-white text-gray-800 hover:border-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
        {SUPPORTED_LANGS.map((l) => (
          <option key={l} value={l}>{LABELS[l] || l}</option>
        ))}
      </select>
    </label>
  )
}

