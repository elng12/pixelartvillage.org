import { useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
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
  tl: 'Filipino',
  vi: 'Tiếng Việt',
  ja: '日本語',
  sv: 'Svenska',
  nb: 'Norsk (Bokmål)',
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
      className="language-switcher-balanced inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 shadow-sm transition hover:bg-gray-50 hover:border-gray-300 hover:shadow-md"
      title={t('lang.title', 'Select language')}
    >
      <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
        🌍
      </span>

      <label htmlFor="language-switcher" className="sr-only">
        {t('lang.label', '选择语言')}
      </label>

      <select
        id="language-switcher"
        value={currentLang}
        onChange={handleChange}
        className="min-w-[130px] h-7 px-2 py-1 border border-gray-300 rounded bg-white text-gray-700 text-sm font-medium cursor-pointer outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      >
        {options.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>

      <div className="text-xs text-gray-700 font-medium whitespace-nowrap">
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
