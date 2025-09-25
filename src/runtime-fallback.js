// CSP-friendly runtime fallback to avoid blank screen when extensions break React runtime
const BUILD_ID = (typeof __BUILD_ID__ !== 'undefined') ? __BUILD_ID__ : ''

function renderFallback(msg) {
  try {
    const root = document.getElementById('root')
    if (!root) return
    root.textContent = ''

    const wrap = document.createElement('div')
    wrap.style.fontFamily = 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    wrap.style.maxWidth = '860px'
    wrap.style.margin = '24px auto'
    wrap.style.padding = '16px'
    wrap.style.border = '1px solid #fde68a'
    wrap.style.background = '#fffbeb'
    wrap.style.color = '#78350f'
    wrap.style.borderRadius = '8px'

    const strong = document.createElement('strong')
    strong.textContent = 'Heads up: '
    const text = document.createTextNode('A browser extension seems to be injecting a dev runtime and broke the page. Please disable such extensions (e.g., Plasmo/BacklinkPilot) on this site, then hard‑refresh (Ctrl/Cmd+Shift+R). ')
    wrap.appendChild(strong)
    wrap.appendChild(text)

    if (BUILD_ID) {
      const span = document.createElement('span')
      span.style.opacity = '.7'
      span.textContent = `Build: ${BUILD_ID}`
      wrap.appendChild(span)
    }
    if (msg) {
      const div = document.createElement('div')
      div.style.marginTop = '8px'
      div.style.fontSize = '12px'
      div.style.color = '#92400e'
      div.textContent = String(msg)
      wrap.appendChild(div)
    }
    root.appendChild(wrap)
  } catch { /* ignore */ void 0 }
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
