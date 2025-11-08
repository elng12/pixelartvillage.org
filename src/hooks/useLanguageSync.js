// 语言同步Hook - 封装语言切换逻辑
import { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { languageManager } from '@/utils/languageManager'
import { CANONICAL_LOCALE, SUPPORTED_LANGS } from '@/i18n'
import logger from '@/utils/logger'

export function useLanguageSync() {
  const { i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()

  // 获取当前语言
  const currentLang = useMemo(() => {
    // 存储的语言优先
    const stored = languageManager.getStoredLanguage()
    if (stored) {
      if (import.meta?.env?.DEV) {
        console.log('[useLanguageSync] 使用存储语言:', stored)
      }
      return stored
    }

    // 路由参数语言
    const routeLang = (params.lang || '').toLowerCase()
    if (SUPPORTED_LANGS.includes(routeLang)) {
      if (import.meta?.env?.DEV) {
        console.log('[useLanguageSync] 使用路由语言:', routeLang)
      }
      return routeLang
    }

    // 路径语言
    const pathLang = languageManager.extractLanguageFromPath(location.pathname)
    if (pathLang) {
      if (import.meta?.env?.DEV) {
        console.log('[useLanguageSync] 使用路径语言:', pathLang)
      }
      return pathLang
    }

    // i18n语言
    const i18nLang = (i18n.language || '').toLowerCase()
    if (SUPPORTED_LANGS.includes(i18nLang)) {
      if (import.meta?.env?.DEV) {
        console.log('[useLanguageSync] 使用i18n语言:', i18nLang)
      }
      return i18nLang
    }

    // 默认语言
    if (import.meta?.env?.DEV) {
      console.log('[useLanguageSync] 使用默认语言:', CANONICAL_LOCALE)
    }
    return CANONICAL_LOCALE
  }, [params.lang, location.pathname, i18n.language])

  // 语言切换处理
  const handleLanguageChange = useCallback(async (targetLang) => {
    const lang = (targetLang || '').toLowerCase()

    if (import.meta?.env?.DEV) {
      console.log('[useLanguageSync] 尝试切换到语言:', lang)
      console.log('[useLanguageSync] 当前语言:', currentLang)
    }

    if (!SUPPORTED_LANGS.includes(lang) || lang === currentLang) {
      if (import.meta?.env?.DEV) {
        console.log('[useLanguageSync] 切换被阻止:',
          !SUPPORTED_LANGS.includes(lang) ? '语言不支持' : '语言相同')
      }
      return false
    }

    try {
      // 保存语言设置
      const saved = languageManager.setStoredLanguage(lang)
      if (!saved) {
        logger.warn('[useLanguageSync] 保存语言设置失败')
      }

      // 更新i18n
      await i18n.changeLanguage(lang)

      if (import.meta?.env?.DEV) {
        console.log('[useLanguageSync] 语言切换成功:', lang)
      }

      // 导航到新路径
      const strippedPath = languageManager.stripLanguageFromPath(location.pathname)
      const newPath = languageManager.buildLocalizedPath(lang, strippedPath)

      // 保留查询参数和哈希
      const searchParams = new URLSearchParams(location.search || '')
      searchParams.delete('forceLang') // 清理强制语言参数

      const keepHash = (() => {
        try {
          if (!import.meta?.env?.VITE_PRESERVE_HASH_ON_LANG_SWITCH) return false
          const raw = (location.hash || '').slice(1)
          if (!raw) return false
          const id = decodeURIComponent(raw)
          return Boolean(document.getElementById(id))
        } catch {
          return false
        }
      })()

      const search = searchParams.toString()
      const nextUrl = `${newPath}${search ? `?${search}` : ''}${keepHash ? location.hash : ''}`

      if (import.meta?.env?.DEV) {
        console.log('[useLanguageSync] 导航到:', nextUrl)
      }

      // 使用replace避免历史堆积
      navigate(nextUrl, { replace: true })

      return true
    } catch (error) {
      logger.error('[useLanguageSync] 语言切换失败:', error)
      return false
    }
  }, [currentLang, i18n, location.pathname, location.search, location.hash, navigate])

  // 重定向到本地化路径 - 禁用自动重定向，由App.jsx统一处理
  const redirectToLocalizedPath = useCallback(() => {
    // 禁用自动重定向，避免与App.jsx中的逻辑冲突
    return false
  }, [location.pathname, navigate])

  // 自动重定向效果 - 禁用
  useEffect(() => {
    // 不执行自动重定向，让App.jsx处理
  }, [redirectToLocalizedPath])

  return {
    currentLang,
    handleLanguageChange,
    redirectToLocalizedPath,
    isChanging: i18n.isChanging
  }
}

export default useLanguageSync