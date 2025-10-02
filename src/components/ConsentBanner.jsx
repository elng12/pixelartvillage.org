import React, { useEffect, useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ensureAdSenseLoaded } from '@/utils/loadAdSense.js'

const STORAGE_KEY = 'consent.choice.v1'

function updateConsent(granted) {
  try {
    const payload = { granted: !!granted, t: Date.now() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch { void 0 }
  try {
    // gtag shim if present
    const gtag = window.gtag || (function(){ window.dataLayer = window.dataLayer || []; return function(){ window.dataLayer.push(arguments) } })()
    gtag('consent', 'update', {
      ad_storage: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
    })
  } catch { void 0 }
}

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false)
  const { t } = useTranslation()
  const params = useParams()
  const currentLang = params.lang || 'en'
  const prefix = currentLang === 'en' ? '' : `/${currentLang}`

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) setVisible(true)
    } catch { setVisible(true) }
  }, [])

  const acceptAll = useCallback(() => {
    updateConsent(true)
    // 用户同意后再加载 AdSense
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => ensureAdSenseLoaded(), { timeout: 2000 })
    } else {
      setTimeout(() => ensureAdSenseLoaded(), 300)
    }
    setVisible(false)
  }, [])

  const rejectAll = useCallback(() => {
    updateConsent(false)
    setVisible(false)
  }, [])

  if (!visible) return null

  return (
    <div role="dialog" aria-live="polite" aria-label="Cookie consent" className="fixed inset-x-0 bottom-0 z-[60]">
      <div className="mx-auto max-w-4xl m-4 rounded-lg border border-gray-200 bg-white shadow-lg">
        <div className="p-4 sm:p-5">
          <p className="text-sm text-gray-800 font-medium">{t('consent.title')}</p>
          <p className="mt-1 text-sm text-gray-600">
            {t('consent.desc')}
            {' '}<Link className="text-blue-600 underline" to={`${prefix}/privacy`}>{t('consent.privacy')}</Link> {t('consent.andManage')}
            {' '}<a className="text-blue-600 underline" href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">adssettings.google.com</a>.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={acceptAll} className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-white text-sm font-semibold hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              {t('consent.accept')}
            </button>
            <button type="button" onClick={rejectAll} className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1.5 text-gray-800 text-sm font-semibold hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400">
              {t('consent.reject')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
