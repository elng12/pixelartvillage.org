import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// 资源预加载组件，用于提前加载关键资源
export default function ResourcePreloader() {
  const location = useLocation()

  useEffect(() => {
    // 预加载关键资源
    const preloadResources = () => {
      // 根据当前路由预加载相应的语言包
      const pathSegments = location.pathname.split('/')
      const currentLang = pathSegments[1] || 'en'

      if (currentLang !== 'en') {
        const langPreload = document.createElement('link')
        langPreload.rel = 'preload'
        langPreload.href = `/locales/${currentLang}/translation.json`
        langPreload.as = 'fetch'
        langPreload.crossOrigin = 'anonymous'
        document.head.appendChild(langPreload)
      }
    }

    // 延迟执行预加载，避免阻塞初始渲染
    const timer = setTimeout(preloadResources, 100)

    return () => clearTimeout(timer)
  }, [location.pathname])

  // 预加载下一个可能访问的页面
  useEffect(() => {
    const prefetchNextPages = () => {
      const currentPath = location.pathname

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

      nextPages.forEach(page => {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = page
        document.head.appendChild(link)
      })
    }

    // 在空闲时间预加载
    if ('requestIdleCallback' in window) {
      requestIdleCallback(prefetchNextPages)
    } else {
      setTimeout(prefetchNextPages, 2000)
    }
  }, [location.pathname])

  return null
}
