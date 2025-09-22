import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'consent.choice.v1'

function updateConsent(granted) {
  try {
    const payload = { granted: !!granted, t: Date.now() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {}
  try {
    // gtag shim if present
    const gtag = window.gtag || (function(){ window.dataLayer = window.dataLayer || []; return function(){ window.dataLayer.push(arguments) } })()
    gtag('consent', 'update', {
      ad_storage: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
    })
  } catch {}
}

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) setVisible(true)
    } catch { setVisible(true) }
  }, [])

  const acceptAll = useCallback(() => {
    updateConsent(true)
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
          <p className="text-sm text-gray-800 font-medium">Privacy & Cookies</p>
          <p className="mt-1 text-sm text-gray-600">
            We use cookies to operate this site and, if enabled, to show Google AdSense ads. You can accept or reject non‑essential cookies at any time.
            See our <Link className="text-blue-600 underline" to="/privacy">Privacy Policy</Link> and manage ad personalization at
            {' '}<a className="text-blue-600 underline" href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">adssettings.google.com</a>.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={acceptAll} className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1.5 text-white text-sm font-semibold hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              Accept all
            </button>
            <button type="button" onClick={rejectAll} className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1.5 text-gray-800 text-sm font-semibold hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400">
              Reject non‑essential
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
