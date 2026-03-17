import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { execSync } from 'node:child_process'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  let gitHash = ''
  try {
    gitHash = execSync('git rev-parse --short HEAD', { stdio: ['ignore','pipe','ignore'] }).toString().trim()
  } catch { /* ignore */ void 0 }
  const buildDate = new Date().toISOString().slice(0, 10)
  const BUILD_ID = mode === 'production'
    ? (process.env.GIT_COMMIT || gitHash || new Date().toISOString().replace(/[:.]/g, '-'))
    : 'dev'
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    define: {
      __BUILD_ID__: JSON.stringify(BUILD_ID),
      __BUILD_DATE__: JSON.stringify(buildDate),
      __BUILD_YEAR__: JSON.stringify(Number(buildDate.slice(0, 4))),
    },
    // 性能优化配置
    build: {
      sourcemap: mode === 'production',
      modulePreload: {
        resolveDependencies(_filename, deps, context) {
          if (context.hostType === 'html') {
            return deps.filter((dep) => !dep.includes('deferred-ui-'))
          }
          return deps
        },
      },
      // 启用代码分割
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (
                id.includes('/node_modules/react/') ||
                id.includes('/node_modules/react-dom/') ||
                id.includes('/node_modules/react-router-dom/')
              ) {
                return 'react-vendor'
              }
              if (
                id.includes('/node_modules/react-i18next/') ||
                id.includes('/node_modules/i18next/') ||
                id.includes('/node_modules/i18next-http-backend/')
              ) {
                return 'i18n-vendor'
              }
              return undefined
            }

            if (
              id.includes('/src/components/HomeBelowFold.jsx') ||
              id.includes('/src/components/Footer.jsx') ||
              id.includes('/src/components/FaqSection.jsx')
            ) {
              return 'deferred-ui'
            }

            return undefined
          }
        }
      },
      // 启用gzip压缩提示
      reportCompressedSize: true,
      // 优化chunk大小警告阈值
      chunkSizeWarningLimit: 1000,
      // 目标浏览器
      target: 'es2015',
      // 启用CSS代码分割
      cssCodeSplit: true,
    },
    // 开发服务器优化
    server: {
      preTransformRequests: true,
    },
    // 预加载优化
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'react-i18next',
        'i18next',
        'i18next-http-backend'
      ]
    },
  }
})
