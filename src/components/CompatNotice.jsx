import React, { useEffect, useState } from 'react'

const STORAGE_KEY = 'pv_compat_notice_dismiss.v1'

function detectExtensionFootprints() {
  try {
    if (typeof window !== 'undefined') {
      // Known globals or script hints from common content scripts that inject bundler runtimes
      if (window.BacklinkPilot) return true
    }
    const scripts = Array.from(document.scripts || [])
    return scripts.some((s) => {
      const src = s.getAttribute('src') || ''
      return /plasmo|autofill|BacklinkPilot|parcel-runtime/i.test(src)
    })
  } catch { return false }
}

export default function CompatNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(STORAGE_KEY)
      if (dismissed === '1') return
    } catch { /* ignore */ }
    if (detectExtensionFootprints()) setVisible(true)
  }, [])

  if (!visible) return null

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900">
      <div className="container mx-auto px-4 py-2 text-sm flex items-start gap-3">
        <span role="img" aria-label="warning">⚠️</span>
        <p className="flex-1">
          We detected browser extensions injecting dev runtimes into this page, which can break React and cause a blank screen. Please disable such extensions (e.g., BacklinkPilot/Plasmo) on this site and refresh.
        </p>
        <button
          type="button"
          className="ml-2 inline-flex items-center rounded border border-amber-300 px-2 py-0.5 hover:bg-amber-100"
          onClick={() => { try { localStorage.setItem(STORAGE_KEY, '1') } catch { /* ignore */ void 0 } ; setVisible(false) }}
        >
          Dismiss
        </button>
      </div>
    </div>
  )
}
