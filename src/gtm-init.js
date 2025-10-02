// Google Tag Manager loader (CSP-friendly, no inline script)
// Container ID: GTM-N4L9K6QR

let gtmLoaded = false

export function ensureGtmLoaded() {
  if (gtmLoaded) return
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  const w = window
  const d = document

  // Prepare dataLayer and initial event similar to the inline snippet
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })

  // If script already exists, mark as loaded
  if (d.querySelector('script[src^="https://www.googletagmanager.com/gtm.js"]')) {
    gtmLoaded = true
    return
  }

  const s = d.createElement('script')
  s.async = true
  s.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-N4L9K6QR'

  // Insert as high as possible in <head>, or before the first script
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

  gtmLoaded = true
}

export function insertGtmNoScript() {
  if (typeof document === 'undefined') return
  const d = document
  // Avoid duplication
  if (d.querySelector('noscript[data-gtm-ns="GTM-N4L9K6QR"]')) return

  const ns = d.createElement('noscript')
  ns.setAttribute('data-gtm-ns', 'GTM-N4L9K6QR')
  ns.innerHTML =
    '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N4L9K6QR" height="0" width="0" style="display:none;visibility:hidden"></iframe>'

  const body = d.body
  if (body && body.firstChild) {
    body.insertBefore(ns, body.firstChild)
  } else if (body) {
    body.appendChild(ns)
  } else {
    d.documentElement.appendChild(ns)
  }
}