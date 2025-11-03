import React, { useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import i18n, { SUPPORTED_LANGS, setStoredLang } from '@/i18n'

const LABELS = {
  en: 'English',
  es: 'Español',
  id: 'Bahasa',
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
}

const RUNTIME_LANGS = SUPPORTED_LANGS.filter((lang) => lang && lang !== 'pseudo')

function getLangLabel(code) {
  if (LABELS[code]) return LABELS[code]
  try {
    if (typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function') {
      const dn = new Intl.DisplayNames([code], { type: 'language' })
      const name = dn.of(code)
      if (name && typeof name === 'string') return name
    }
  } catch {
    /* ignore */
  }
  return code
}

function stripLeadingLang(pathname = '') {
  const parts = pathname.split('/')
  if (parts.length > 1 && RUNTIME_LANGS.includes(parts[1])) {
    return '/' + parts.slice(2).join('/')
  }
  return pathname || '/'
}

export default function LanguageSwitcher() {
  const { t } = useTranslation()
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const currentLang = useMemo(
    () => (params.lang && RUNTIME_LANGS.includes(params.lang) ? params.lang : 'en'),
    [params.lang]
  )

  const onChange = useCallback(
    async (event) => {
      const next = event.target.value
      if (!RUNTIME_LANGS.includes(next)) return

      const suffix = stripLeadingLang(location.pathname)
      const search = location.search || ''
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

      const basePath = suffix === '/' ? '' : suffix.replace(/^\/+/, '').replace(/\/+$/, '')
      const nextPath = basePath ? `/${next}/${basePath}/` : `/${next}/`
      const nextUrl = `${nextPath}${search}${keepHash ? location.hash : ''}`.replace(/\/+$/, '/')
      try {
        // 确保语言资源已加载
        await i18n.changeLanguage(next)
        
        // 如果资源未加载，强制重新加载
        if (!i18n.getResourceBundle(next, 'translation')) {
          await i18n.reloadResources(next, 'translation')
        }
        
        setStoredLang(next)
        navigate(nextUrl, { replace: true })
      } catch (error) {
        console.error('Language switch error:', error)
      }
    },
    [location.pathname, location.search, location.hash, navigate]
  )

  return (
    <label className="inline-flex items-center gap-2 text-sm text-gray-600">
      <span className="sr-only">{t('lang.label')}</span>
      <select
        aria-label={t('lang.label')}
        value={currentLang}
        onChange={onChange}
        className="px-2 py-1 rounded-md border border-gray-300 bg-white text-gray-800 hover:border-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        data-build={typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : 'dev'}
      >
        {RUNTIME_LANGS.map((lang) => (
          <option key={lang} value={lang}>
            {getLangLabel(lang)}
          </option>
        ))}
      </select>
    </label>
  )
}
