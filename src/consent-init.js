// Consent Mode v2 lightweight initializer (no inline scripts; CSP-safe)
// - Applies stored user choice if exists (only when CMP is not present)
// - Watches consent updates to load optional scripts after consent

import { ensureAdSenseLoaded } from './utils/loadAdSense.js'
import { ensureClarityLoaded } from './clarity-init.js'

const STORAGE_KEY = 'consent.choice.v1'
const CONSENT_KEYS = ['ad_storage', 'analytics_storage', 'ad_user_data', 'ad_personalization']
const consentState = Object.fromEntries(CONSENT_KEYS.map((key) => [key, 'denied']))

function hasCmp() {
  return typeof window.__tcfapi === 'function' || typeof window.__gpp === 'function' || typeof window.__cmp === 'function'
}

function applyConsentUpdate(update) {
  if (!update || typeof update !== 'object') return
  let changed = false
  for (const key of CONSENT_KEYS) {
    if (key in update && update[key] !== consentState[key]) {
      consentState[key] = update[key]
      changed = true
    }
  }
  if (!changed) return
  if (consentState.ad_storage === 'granted') {
    try { ensureAdSenseLoaded() } catch { /* no-op */ }
  }
  if (consentState.analytics_storage === 'granted') {
    try { ensureClarityLoaded() } catch { /* no-op */ }
  }
}

function scanExistingDataLayer() {
  try {
    const dl = window.dataLayer || []
    for (const item of dl) {
      if (item && item[0] === 'consent' && item[1] === 'update') {
        applyConsentUpdate(item[2] || {})
      }
    }
  } catch { /* no-op */ }
}

function watchConsentUpdates() {
  try {
    window.dataLayer = window.dataLayer || []
    const dl = window.dataLayer
    const originalPush = dl.push.bind(dl)
    dl.push = (...args) => {
      for (const arg of args) {
        if (arg && arg[0] === 'consent' && arg[1] === 'update') {
          applyConsentUpdate(arg[2] || {})
        }
      }
      return originalPush(...args)
    }
  } catch { /* no-op */ }
}

// Watch consent updates from CMP/gtag
watchConsentUpdates()
scanExistingDataLayer()

// Apply stored choice (only if no CMP is detected)
try {
  if (!hasCmp()) {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const c = JSON.parse(saved)
      const granted = c?.granted === true
      const update = {
        ad_storage: granted ? 'granted' : 'denied',
        analytics_storage: granted ? 'granted' : 'denied',
        ad_user_data: granted ? 'granted' : 'denied',
        ad_personalization: granted ? 'granted' : 'denied',
      }
      try {
        const gtag = window.gtag || (function(){ window.dataLayer = window.dataLayer || []; return function(){ window.dataLayer.push(arguments) } })()
        gtag('consent', 'update', update)
      } catch { /* no-op */ }
      applyConsentUpdate(update)
    }
  }
} catch { /* no-op */ }

// GitHub Pages SPA fallback: if 404.html redirected here with ?p=/x&q=query#hash, fix the URL
try {
  const u = new URL(window.location.href)
  const p = u.searchParams.get('p')
  if (p) {
    const q = u.searchParams.get('q')
    const hash = u.hash || ''
    const next = decodeURIComponent(p) + (q ? `?${decodeURIComponent(q)}` : '') + hash
    window.history.replaceState(null, '', next)
  }
} catch { /* TODO: handle error */ }
