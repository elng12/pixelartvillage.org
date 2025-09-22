// Consent Mode v2 lightweight initializer (no inline scripts; CSP-safe)
// - Sets default denied
// - Applies stored user choice if exists

const STORAGE_KEY = 'consent.choice.v1'

// Ensure dataLayer exists and define gtag shim
window.dataLayer = window.dataLayer || []
function gtag(){ window.dataLayer.push(arguments) }

// Default: denied (before any Google tags, if later added)
gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500,
})

// Apply stored choice
try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    const c = JSON.parse(saved)
    const granted = c?.granted === true
    gtag('consent', 'update', {
      ad_storage: granted ? 'granted' : 'denied',
      analytics_storage: granted ? 'granted' : 'denied',
      ad_user_data: granted ? 'granted' : 'denied',
      ad_personalization: granted ? 'granted' : 'denied',
    })
  }
} catch { void 0 }

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
} catch { void 0 }
