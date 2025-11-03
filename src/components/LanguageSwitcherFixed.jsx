import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import i18n, { setStoredLang } from '@/i18n'
import { buildLocalizedPath, stripLeadingLang, RUNTIME_LANGS } from '@/utils/locale'

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
  sv: 'Svenska',
  no: 'Norsk',
  nl: 'Nederlands',
  ar: 'العربية',
  ko: '한국어',
  th: 'ไทย',
  pseudo: 'Pseudo (Test)',
}

function getLangLabel(code) {
  if (LABELS[code]) return LABELS[code]
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

export default function LanguageSwitcherFixed() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()

  // Debug: 检查语言切换器状态
  React.useEffect(() => {
    if (import.meta?.env?.DEV) {
      console.log('[LanguageSwitcherFixed] Component mounted');
      console.log('[LanguageSwitcherFixed] RUNTIME_LANGS:', RUNTIME_LANGS);
      console.log('[LanguageSwitcherFixed] Current language:', currentLang);
      console.log('[LanguageSwitcherFixed] Location:', location.pathname);
      console.log('[LanguageSwitcherFixed] Translation available:', !!i18n.getResourceBundle(currentLang, 'translation'));
    }
  }, [currentLang, location.pathname]);

  const currentLang = useMemo(() => {
    if (params.lang && RUNTIME_LANGS.includes(params.lang)) {
      return params.lang
    }
    const parts = location.pathname.split('/')
    if (parts.length > 1 && RUNTIME_LANGS.includes(parts[1])) {
      return parts[1]
    }
    return i18n.language || 'en'
  }, [location.pathname, params.lang])

  const onChange = useCallback(
    async (event) => {
      const next = event.target.value
      if (!RUNTIME_LANGS.includes(next)) return

      try {
        // 先尝试加载语言资源
        await i18n.loadLanguages(next)
        
        // 检查资源是否成功加载
        let hasResource = i18n.getResourceBundle(next, 'translation')
        
        // 如果资源未加载，尝试重新加载
        if (!hasResource) {
          console.warn(`[LanguageSwitcher] Resources not found for ${next}, attempting reload...`)
          await i18n.reloadResources(next, 'translation')
          hasResource = i18n.getResourceBundle(next, 'translation')
        }
        
        // 如果仍然没有资源，记录警告但继续切换
        if (!hasResource) {
          console.warn(`[LanguageSwitcher] Failed to load resources for ${next}, using fallback`)
        }
        
        // 切换语言
        await i18n.changeLanguage(next)
        
        // 保存语言偏好
        setStoredLang(next)

        // 构建新的URL
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

        const basePath = suffix || '/'
        const nextPath = buildLocalizedPath(next, basePath)
        const nextUrl = `${nextPath}${search}${keepHash ? location.hash : ''}`
        
        // 导航到新URL
        navigate(nextUrl, { replace: true })
        
        console.log(`[LanguageSwitcher] Successfully switched to ${next}`)
      } catch (error) {
        console.error(`[LanguageSwitcher] Error switching to ${next}:`, error)
        
        // 错误处理：尝试回退到之前的语言或默认语言
        try {
          const fallbackLang = currentLang !== 'en' ? 'en' : 'en'
          if (fallbackLang !== next) {
            console.warn(`[LanguageSwitcher] Falling back to ${fallbackLang}`)
            await i18n.changeLanguage(fallbackLang)
          }
        } catch (fallbackError) {
          console.error('[LanguageSwitcher] Fallback also failed:', fallbackError)
        }
      }
    },
    [location.pathname, location.search, location.hash, navigate, currentLang]
  )

  return (
    <div className="language-switcher inline-flex items-center gap-2 text-sm text-gray-600" style={{ display: 'inline-flex !important', visibility: 'visible !important', border: '2px solid red', padding: '8px' }}>
      {/* 临时调试标签 */}
      <span style={{ color: 'red', fontWeight: 'bold' }}>LANG:</span>

      <label htmlFor="language-select" className="sr-only">
        {t('lang.label')}
      </label>
      <select
        id="language-select"
        aria-label={t('lang.label')}
        value={currentLang}
        onChange={onChange}
        className="px-2 py-1 rounded-md border border-gray-300 bg-white text-gray-800 hover:border-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-sm"
        style={{ display: 'block !important', visibility: 'visible !important' }}
        data-build={typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : 'dev'}
      >
        {RUNTIME_LANGS.map((lang) => (
          <option key={lang} value={lang}>
            {getLangLabel(lang)}
          </option>
        ))}
      </select>
    </div>
  )
}
