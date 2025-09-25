// CSP-friendly runtime fallback to avoid blank screen when extensions break React runtime
const BUILD_ID = (typeof __BUILD_ID__ !== 'undefined') ? __BUILD_ID__ : ''

function renderFallback(msg) {
  try {
    const root = document.getElementById('root')
    if (!root) return
    root.innerHTML = '' +
      '<div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; max-width: 860px; margin: 24px auto; padding: 16px; border: 1px solid #fde68a; background: #fffbeb; color: #78350f; border-radius: 8px;">' +
      '<strong>Heads up:</strong> A browser extension seems to be injecting a dev runtime and broke the page. Please disable such extensions (e.g., Plasmo/BacklinkPilot) on this site, then hard‑refresh (Ctrl/Cmd+Shift+R). ' +
      (BUILD_ID ? '<span style="opacity:.7">Build: ' + BUILD_ID + '</span>' : '') +
      (msg ? '<div style="margin-top:8px; font-size: 12px; color:#92400e">'+ String(msg) +'</div>' : '') +
      '</div>'
  } catch {}
}

let shown = false
window.addEventListener('error', (e) => {
  if (shown) return
  const m = (e && e.message) ? String(e.message) : ''
  if (m.includes('useContext') || m.includes('Cannot read properties of null')) {
    shown = true
    renderFallback(m)
  }
})

