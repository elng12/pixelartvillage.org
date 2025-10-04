import { useEffect } from 'react'

// 关键CSS内联和优化组件
export default function CriticalCSS() {
  useEffect(() => {
    // 预加载关键CSS
    const preloadCriticalCSS = () => {
      const criticalCSS = `
        /* 关键路径CSS - 首屏渲染必需样式 */
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        /* 防止布局偏移 */
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* 首屏关键元素的可见性 */
        header {
          display: block;
        }

        main {
          display: block;
          min-height: 50vh;
        }

        /* 字体显示优化 */
        @font-face {
          font-family: 'Inter';
          font-display: swap;
          src: url('/fonts/inter-var.woff2') format('woff2');
        }
      `

      // 创建style标签内联关键CSS
      const styleElement = document.createElement('style')
      styleElement.textContent = criticalCSS
      styleElement.setAttribute('data-critical-css', 'true')
      document.head.appendChild(styleElement)

      // 异步加载完整CSS
      const cssLink = document.createElement('link')
      cssLink.rel = 'stylesheet'
      cssLink.href = '/src/index.css'
      cssLink.media = 'print'
      cssLink.onload = function() {
        this.onload = null
        this.media = 'all'
      }
      document.head.appendChild(cssLink)
    }

    // 尽早执行关键CSS加载
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', preloadCriticalCSS)
    } else {
      preloadCriticalCSS()
    }
  }, [])

  // 优化字体加载
  useEffect(() => {
    const optimizeFontLoading = () => {
      // 预连接到字体CDN
      const preconnect = document.createElement('link')
      preconnect.rel = 'preconnect'
      preconnect.href = 'https://fonts.googleapis.com'
      document.head.appendChild(preconnect)

      const preconnect2 = document.createElement('link')
      preconnect2.rel = 'preconnect'
      preconnect2.href = 'https://fonts.gstatic.com'
      preconnect2.crossOrigin = 'anonymous'
      document.head.appendChild(preconnect2)

      // 字体加载优化
      if ('fonts' in document) {
        Promise.all([
          document.fonts.load('1em Inter'),
          document.fonts.load('700 1em Inter')
        ]).then(() => {
          document.documentElement.classList.add('fonts-loaded')
        }).catch(() => {
          // 字体加载失败时的回退处理
          document.documentElement.classList.add('fonts-fallback')
        })
      }
    }

    optimizeFontLoading()
  }, [])

  // 减少CLS（累积布局偏移）
  useEffect(() => {
    const reserveSpaceForDynamicContent = () => {
      // 为动态内容预留空间，减少布局偏移
      const style = document.createElement('style')
      style.textContent = `
        /* 为可能加载的动态内容预留空间 */
        .dynamic-content-placeholder {
          min-height: 200px;
          background: transparent;
        }

        /* 图片容器设置明确尺寸 */
        img-container {
          aspect-ratio: 16/9;
          width: 100%;
        }

        /* 防止字体切换时的布局偏移 */
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
        }

        .fonts-loaded body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
            sans-serif;
        }
      `
      document.head.appendChild(style)
    }

    reserveSpaceForDynamicContent()
  }, [])

  return null
}