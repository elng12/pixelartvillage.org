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
})()
