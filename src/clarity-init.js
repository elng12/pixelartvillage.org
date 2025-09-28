// Microsoft Clarity loader (CSP-friendly, no inline script)
// ID: thla3xja49

let clarityLoaded = false

export function ensureClarityLoaded() {
  if (clarityLoaded) return
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  const a = 'clarity'
  const c = window
  const l = document

  // If already present or script tag exists, mark loaded
  if (c[a] && typeof c[a] === 'function' && !('q' in c[a])) {
    clarityLoaded = true
    return
  }
  if (l.querySelector('script[src^="https://www.clarity.ms/tag/"]')) {
    clarityLoaded = true
    return
  }

  if (!c[a]) {
    c[a] = function () {
      (c[a].q = c[a].q || []).push(arguments)
    }
  }

  const s = l.createElement('script')
  s.async = true
  s.src = 'https://www.clarity.ms/tag/thla3xja49'

  const firstScript = l.getElementsByTagName('script')[0]
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(s, firstScript)
  } else if (l.head) {
    l.head.appendChild(s)
  } else {
    l.documentElement.appendChild(s)
  }

  clarityLoaded = true
}
