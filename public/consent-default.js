// Consent Mode v2 default state (must run before any Google tags)
// Keep this file free of imports so it can execute synchronously in <head>.
;(function () {
  try {
    window.dataLayer = window.dataLayer || []
    function gtag() { window.dataLayer.push(arguments) }
    if (!window.gtag) window.gtag = gtag
    gtag('consent', 'default', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500,
    })
  } catch { /* no-op */ }

  // PVUV is paused until its SDK supports reliable consent revocation.
  // Remove only its identifiers, preserving consent choices and editor state.
  const pvuvCookies = ['_pv_id', '_pv_sid', '_pv_ft', '_pv_v', '_pv_uid', '_pv_t']
  const expirePvuvCookies = (domain) => {
    for (const name of pvuvCookies) {
      try {
        document.cookie = `${name}=; Path=/; Max-Age=0${domain ? `; Domain=${domain}` : ''}`
      } catch { /* Cookies may be unavailable. */ }
    }
  }
  expirePvuvCookies('')
  let domain = window.location.hostname
  if (!domain.includes(':') && !/^\d+\.\d+\.\d+\.\d+$/.test(domain)) {
    while (domain.includes('.')) {
      expirePvuvCookies(domain)
      domain = domain.slice(domain.indexOf('.') + 1)
    }
  }
  try {
    window.localStorage.removeItem('_pv_id')
  } catch { /* Storage may be unavailable. */ }
})()
