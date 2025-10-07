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
    },
    // 性能优化配置
    build: {
      sourcemap: mode === 'production',
      // 启用代码分割
      rollupOptions: {
        output: {
          manualChunks: {
            // 将React相关库分离成单独的chunk
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            // 将i18n相关库分离
            'i18n-vendor': ['react-i18next', 'i18next', 'i18next-http-backend'],
            // 其他第三方库（当前暂无额外拆分）
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
