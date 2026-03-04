import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import safeStorage from '@/utils/safeStorage'
import LocalizedLink from '@/components/LocalizedLink'

const STORAGE_KEY = 'consent.choice.v1'
const AD_CENTER_URL = 'https://adssettings.google.com/'
const CONSENT_KEYS = ['ad_storage', 'analytics_storage', 'ad_user_data', 'ad_personalization']

function hasCmp() {
  return typeof window.__tcfapi === 'function' || typeof window.__gpp === 'function' || typeof window.__cmp === 'function'
}

function pushConsentUpdate(granted) {
  const update = Object.fromEntries(CONSENT_KEYS.map((key) => [key, granted ? 'granted' : 'denied']))
  try {
    const gtag = window.gtag || (function () {
      window.dataLayer = window.dataLayer || []
      return function () { window.dataLayer.push(arguments) }
    })()
    gtag('consent', 'update', update)
  } catch {
    // noop
  }
}

export default function ConsentBanner() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const IS_E2E = String(import.meta?.env?.VITE_E2E) === '1'
    if (IS_E2E) return
    if (hasCmp()) return

    try {
      if (safeStorage.get(STORAGE_KEY)) return
    } catch {
      // ignore
    }
    setVisible(true)
  }, [])

  if (!visible) return null

  const setChoice = (granted) => {
    try {
      safeStorage.set(STORAGE_KEY, JSON.stringify({ granted, ts: Date.now() }))
    } catch {
      // ignore
    }
    pushConsentUpdate(granted)
    setVisible(false)
  }

  return (
    <div
      role="region"
      aria-label={t('consent.bannerLabel')}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="container mx-auto flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center">
        <div className="text-sm text-gray-700">
          <p className="font-semibold text-gray-900">{t('consent.title')}</p>
          <p className="mt-1">
            {t('consent.desc')}{' '}
            <LocalizedLink to="/privacy" className="underline underline-offset-2">
              {t('consent.privacy')}
            </LocalizedLink>{' '}
            {t('consent.andManage')}{' '}
            <a
              className="underline underline-offset-2"
              href={AD_CENTER_URL}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Google Ads Settings
            </a>
            .
          </p>
        </div>
        <div className="flex gap-2 sm:ml-auto">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50"
            onClick={() => setChoice(false)}
            aria-label={t('consent.rejectLabel')}
          >
            {t('consent.reject')}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
            onClick={() => setChoice(true)}
            aria-label={t('consent.acceptLabel')}
          >
            {t('consent.accept')}
          </button>
        </div>
      </div>
    </div>
  )
}
