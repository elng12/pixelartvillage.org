// Google Analytics gtag loader (CSP-friendly, no inline script)
// Measurement ID: G-L5N8DGXP7F

let gaLoaded = false
const GA_MEASUREMENT_ID = 'G-L5N8DGXP7F'

export function ensureGaLoaded(measurementId = GA_MEASUREMENT_ID) {
  if (gaLoaded) return
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  const w = window
  const d = document

  // Initialize dataLayer and gtag function
  w.dataLayer = w.dataLayer || []
  function gtag(){ w.dataLayer.push(arguments) }
  w.gtag = w.gtag || gtag
  if (w.__pvGaConfigured !== measurementId) {
    w.gtag('js', new Date())
    w.gtag('config', measurementId)
    w.__pvGaConfigured = measurementId
  }

  // If GA script already present, do not add again
  if (d.querySelector('script[src^="https://www.googletagmanager.com/gtag/js"]')) {
    gaLoaded = true
    return
  }

  // Create GA script tag
  const s = d.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`

  // Insert as high as possible in <head> or before first script
  const head = d.head
  const firstScript = d.getElementsByTagName('script')[0]
  if (head && head.firstChild) {
    head.insertBefore(s, head.firstChild)
  } else if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(s, firstScript)
  } else if (head) {
    head.appendChild(s)
  } else {
    d.documentElement.appendChild(s)
  }

  gaLoaded = true
}
