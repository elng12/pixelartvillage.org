// Google Analytics config (loaded from index.html and static pages)
;(function () {
  try {
    const measurementId = 'G-L5N8DGXP7F'
    window.dataLayer = window.dataLayer || []
    function gtag() { window.dataLayer.push(arguments) }
    window.gtag = window.gtag || gtag
    if (window.__pvGaConfigured !== measurementId) {
      window.gtag('js', new Date())
      window.gtag('config', measurementId)
      window.__pvGaConfigured = measurementId
    }
  } catch {
    // no-op
  }
})()
