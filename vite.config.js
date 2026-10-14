import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { execSync } from 'node:child_process'
import { readFileSync, readdirSync } from 'node:fs'

function readPreviewHeaders() {
  try {
    const headersFile = fileURLToPath(new URL('./public/_headers', import.meta.url))
    const headers = {}
    let inGlobalBlock = false

    for (const rawLine of readFileSync(headersFile, 'utf8').split(/\r?\n/)) {
      const trimmed = rawLine.trim()
      if (!trimmed) {
        continue
      }

      if (!rawLine.startsWith(' ') && !rawLine.startsWith('\t')) {
        inGlobalBlock = trimmed === '/*'
        continue
      }

      if (inGlobalBlock) {
        const separatorIndex = trimmed.indexOf(':')
        if (separatorIndex > 0) {
          headers[trimmed.slice(0, separatorIndex)] = trimmed.slice(separatorIndex + 1).trim()
        }
      }
    }

    return headers
  } catch {
    return {}
  }
}

function blogArticleLocales() {
  const publicId = 'virtual:blog-article-locales'
  const moduleId = `\0${publicId}`
  const contentDir = fileURLToPath(new URL('./src/content/', import.meta.url))
  const filePattern = /^blog-posts\.([a-z0-9-]+)\.json$/i

  return {
    name: 'blog-article-locales',
    resolveId(id) {
      if (id === publicId) return moduleId
    },
    load(id) {
      if (id !== moduleId) return
      const localesBySlug = new Map()
      for (const filename of readdirSync(contentDir)) {
        const match = filename.match(filePattern)
        if (!match) continue
        const file = `${contentDir}${filename}`
        this.addWatchFile(file)
        const data = JSON.parse(readFileSync(file, 'utf8'))
        const posts = data && typeof data === 'object' ? Object.values(data) : []
        for (const post of posts) {
          if (typeof post?.slug !== 'string' || !post.slug.trim()) continue
          let locales = localesBySlug.get(post.slug)
          if (!locales) {
            locales = new Set()
            localesBySlug.set(post.slug, locales)
          }
          locales.add(match[1].toLowerCase())
        }
      }
      const entries = Array.from(localesBySlug, ([slug, locales]) => [slug, [...locales]])
      return `export default new Map(${JSON.stringify(entries)})`
    },
    hotUpdate({ file, modules, timestamp }) {
      if (!file.startsWith(contentDir) || !filePattern.test(file.slice(contentDir.length))) return
      const graph = this.environment.moduleGraph
      const module = graph.getModuleById(moduleId)
      if (!module) return
      graph.invalidateModule(module, new Set(), timestamp, true)
      return modules.includes(module) ? modules : [...modules, module]
    },
  }
}


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
    plugins: [react(), blogArticleLocales()],
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
      target: 'es2020',
      // 启用CSS代码分割
      cssCodeSplit: true,
    },
    // 开发服务器优化
    server: {
      preTransformRequests: true,
    },
    // Keep vite preview aligned with Cloudflare Pages security headers for CSP tests.
    preview: {
      headers: readPreviewHeaders(),
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
