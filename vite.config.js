import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { resolve as pathResolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: pathResolve(fileURLToPath(new URL('.', import.meta.url)), 'index.html'),
        privacy: pathResolve(fileURLToPath(new URL('.', import.meta.url)), 'privacy.html'),
        terms: pathResolve(fileURLToPath(new URL('.', import.meta.url)), 'terms.html'),
        about: pathResolve(fileURLToPath(new URL('.', import.meta.url)), 'about.html'),
        contact: pathResolve(fileURLToPath(new URL('.', import.meta.url)), 'contact.html'),
      },
    },
  },
})
