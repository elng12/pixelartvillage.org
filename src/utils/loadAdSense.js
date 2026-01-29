// 动态加载 Google AdSense Auto Ads 脚本（基于同意后）
// 幂等：若已加载则不重复注入

export function ensureAdSenseLoaded() {
  try {
    if (window.__adsenseLoaded) return
    // 已经存在 adsbygoogle 全局变量也视为已加载
    if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
      window.__adsenseLoaded = true
      return
    }
    const existing = document.querySelector('script[data-origin="adsbygoogle"]')
    if (existing) {
      window.__adsenseLoaded = true
      return
    }
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3219924658522446'
    script.crossOrigin = 'anonymous'
    script.setAttribute('data-origin', 'adsbygoogle')
    script.addEventListener('load', () => { window.__adsenseLoaded = true })
    document.head.appendChild(script)
  } catch { /* no-op */ }
}

function ensurePreconnect(href) {
  try {
    if (document.querySelector(`link[rel="preconnect"][href="${href}"]`)) return
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = href
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  } catch { /* no-op */ }
}

export function scheduleAdSenseLoad({ delayMs = 4000 } = {}) {
  try {
    if (window.__adsenseLoaded) return
    ensurePreconnect('https://pagead2.googlesyndication.com')
    ensurePreconnect('https://securepubads.g.doubleclick.net')
    let settled = false
    let timer = null
    const cleanup = () => {
      if (timer) clearTimeout(timer)
      window.removeEventListener('scroll', onInteract)
      window.removeEventListener('pointerdown', onInteract)
      window.removeEventListener('keydown', onInteract)
    }
    const trigger = () => {
      if (settled) return
      settled = true
      cleanup()
      ensureAdSenseLoaded()
    }
    const onInteract = () => trigger()
    window.addEventListener('scroll', onInteract, { passive: true })
    window.addEventListener('pointerdown', onInteract, { passive: true })
    window.addEventListener('keydown', onInteract)
    timer = setTimeout(trigger, delayMs)
    if ('requestIdleCallback' in window) {
      requestIdleCallback(trigger, { timeout: delayMs })
    }
  } catch { /* no-op */ }
}
