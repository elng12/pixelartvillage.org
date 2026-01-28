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
      `

      // 创建style标签内联关键CSS
      const styleElement = document.createElement('style')
      styleElement.textContent = criticalCSS
      styleElement.setAttribute('data-critical-css', 'true')
      document.head.appendChild(styleElement)

    }

    // 尽早执行关键CSS加载
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', preloadCriticalCSS)
    } else {
      preloadCriticalCSS()
    }
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
      `
      document.head.appendChild(style)
    }

    reserveSpaceForDynamicContent()
  }, [])

  return null
}
