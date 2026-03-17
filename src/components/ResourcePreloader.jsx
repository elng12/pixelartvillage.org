import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const PREFETCH_DELAY_MS = 1200
const PREFETCH_FALLBACK_MS = 7000

function canSpeculativelyPrefetch() {
  if (typeof navigator === 'undefined') return false
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
  if (!connection) return true
  if (connection.saveData) return false
  return !['slow-2g', '2g', '3g'].includes(connection.effectiveType)
}

function normalizePathname(pathname) {
  if (!pathname || pathname === '/') return '/'
  return pathname.endsWith('/') ? pathname : `${pathname}/`
}

// 资源预加载组件，用于提前加载关键资源
export default function ResourcePreloader() {
  const location = useLocation()

  // 预加载下一个可能访问的页面
  useEffect(() => {
    if (!canSpeculativelyPrefetch()) return undefined

    const prefetchNextPages = () => {
      const currentPath = normalizePathname(location.pathname)

      // 根据当前页面预加载相关页面
      const prefetchMap = {
        '/': ['/converter/png-to-pixel-art/', '/converter/jpg-to-pixel-art/'],
        '/converter/png-to-pixel-art/': ['/converter/jpg-to-pixel-art/', '/converter/image-to-pixel-art/'],
        '/converter/jpg-to-pixel-art/': ['/converter/png-to-pixel-art/', '/converter/photo-to-pixel-art/'],
        '/about/': ['/contact/', '/blog/'],
        '/contact/': ['/about/', '/privacy/'],
        '/blog': ['/blog/how-to-pixelate-an-image/'],
        '/blog/': ['/blog/how-to-pixelate-an-image/']
      }

      const nextPages = prefetchMap[currentPath] || []
      if (!nextPages.length) return

      const existingPrefetches = new Set(
        Array.from(document.head.querySelectorAll('link[rel="prefetch"][href]')).map((link) => link.href),
      )

      nextPages.forEach((page) => {
        const resolvedHref = new URL(page, window.location.origin).href
        if (existingPrefetches.has(resolvedHref)) return
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.as = 'document'
        link.href = page
        document.head.appendChild(link)
      })
    }

    let idleId = null
    let delayTimer = null
    let fallbackTimer = null
    let loadGateListener = null
    let fallbackLoadListener = null
    let scheduled = false
    let pageLoaded = document.readyState === 'complete'

    const cleanupIntentListeners = () => {
      window.removeEventListener('pointerdown', onFirstIntent)
      window.removeEventListener('keydown', onFirstIntent)
      window.removeEventListener('touchstart', onFirstIntent)
      window.removeEventListener('scroll', onFirstIntent)
    }

    const runWhenIdle = () => {
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(prefetchNextPages, { timeout: 2000 })
        return
      }
      prefetchNextPages()
    }

    const schedulePrefetch = () => {
      if (scheduled) return
      scheduled = true
      cleanupIntentListeners()
      const startDelay = () => {
        delayTimer = window.setTimeout(runWhenIdle, PREFETCH_DELAY_MS)
      }
      if (pageLoaded) {
        startDelay()
        return
      }
      if (loadGateListener) return
      loadGateListener = () => {
        pageLoaded = true
        loadGateListener = null
        startDelay()
      }
      window.addEventListener('load', loadGateListener, { once: true })
    }

    function onFirstIntent() {
      schedulePrefetch()
    }

    window.addEventListener('pointerdown', onFirstIntent, { passive: true, once: true })
    window.addEventListener('keydown', onFirstIntent, { once: true })
    window.addEventListener('touchstart', onFirstIntent, { passive: true, once: true })
    window.addEventListener('scroll', onFirstIntent, { passive: true, once: true })

    if (document.readyState === 'complete') {
      fallbackTimer = window.setTimeout(schedulePrefetch, PREFETCH_FALLBACK_MS)
    } else {
      fallbackLoadListener = () => {
        pageLoaded = true
        fallbackTimer = window.setTimeout(schedulePrefetch, PREFETCH_FALLBACK_MS)
      }
      window.addEventListener('load', fallbackLoadListener, { once: true })
    }

    return () => {
      cleanupIntentListeners()
      if (loadGateListener) window.removeEventListener('load', loadGateListener)
      if (fallbackLoadListener) window.removeEventListener('load', fallbackLoadListener)
      if (delayTimer) window.clearTimeout(delayTimer)
      if (fallbackTimer) window.clearTimeout(fallbackTimer)
      if (idleId && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId)
      }
    }
  }, [location.pathname])

  return null
}
