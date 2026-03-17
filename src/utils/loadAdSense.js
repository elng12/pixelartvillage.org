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
    const existingBySrc = document.querySelector(
      'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]',
    )
    if (existingBySrc) {
      window.__adsenseLoaded = true
      return
    }
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3219924658522446'
    script.crossOrigin = 'anonymous'
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
    if (window.__adsenseLoaded || window.__adsenseLoadScheduled) return
    window.__adsenseLoadScheduled = true
    let settled = false
    let timer = null
    let loadTimer = null
    let loadListener = null
    let pageLoaded = document.readyState === 'complete'
    let pendingInteraction = false
    const cleanup = () => {
      if (timer) clearTimeout(timer)
      if (loadTimer) clearTimeout(loadTimer)
      window.removeEventListener('scroll', onInteract)
      window.removeEventListener('pointerdown', onInteract)
      window.removeEventListener('touchstart', onInteract)
      window.removeEventListener('keydown', onInteract)
      if (loadListener) window.removeEventListener('load', loadListener)
    }
    const trigger = () => {
      if (settled) return
      settled = true
      cleanup()
      window.__adsenseLoadScheduled = false
      ensureAdSenseLoaded()
    }
    const scheduleInteractionLoad = () => {
      if (settled) return
      if (!pageLoaded) {
        pendingInteraction = true
        return
      }
      ensurePreconnect('https://pagead2.googlesyndication.com')
      ensurePreconnect('https://securepubads.g.doubleclick.net')
      if (timer) clearTimeout(timer)
      timer = setTimeout(trigger, 600)
    }
    const onInteract = () => {
      scheduleInteractionLoad()
    }
    window.addEventListener('scroll', onInteract, { passive: true })
    window.addEventListener('pointerdown', onInteract, { passive: true })
    window.addEventListener('touchstart', onInteract, { passive: true })
    window.addEventListener('keydown', onInteract)

    const scheduleFallback = () => {
      if (settled) return
      ensurePreconnect('https://pagead2.googlesyndication.com')
      ensurePreconnect('https://securepubads.g.doubleclick.net')
      loadTimer = setTimeout(trigger, delayMs)
    }

    if (document.readyState === 'complete') {
      scheduleFallback()
    } else {
      loadListener = () => {
        pageLoaded = true
        if (pendingInteraction) {
          pendingInteraction = false
          scheduleInteractionLoad()
          return
        }
        scheduleFallback()
      }
      window.addEventListener('load', loadListener, { once: true })
    }
  } catch {
    window.__adsenseLoadScheduled = false
  }
}
