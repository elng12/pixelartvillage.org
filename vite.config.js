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
    // 可选：生产构建可打开 sourcemap，便于线上排错
    build: {
      sourcemap: mode === 'production',
    },
  }
})
