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

