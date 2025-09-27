import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'plugins/seo-ext/**']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { ...globals.browser, __BUILD_ID__: 'readonly' },
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // 在未引入 eslint-plugin-react 的情况下，为了避免 JSX 组件/标识符被误判未使用，放宽为忽略大写开头；同时忽略以 _ 开头的参数。
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
    },
  },
  // Vite 配置文件（Node 环境）
  {
    files: ['vite.config.{js,ts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
      sourceType: 'module',
    },
  },
  // 针对 Node/Playwright 等非浏览器环境的覆盖
  {
    files: ['playwright.config.{cjs,js}', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
    },
  },
  // server 目录为 Node 环境
  {
    files: ['server/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
      sourceType: 'module',
    },
  },
  // scripts 目录（Node 环境）
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
      sourceType: 'module',
    },
  },
])
