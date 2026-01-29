import { useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useLocation } from 'react-router-dom'
import logger from '@/utils/logger'
import { SUPPORTED_LANGS, DEFAULT_LOCALE } from '@/i18n'

/**
 * TranslationPreloader - 确保翻译资源在路由切换时正确加载
 * 
 * 功能：
 * 1. 监听路由变化，预加载对应语言的翻译资源
 * 2. 处理翻译资源加载失败的情况
 * 3. 确保语言切换时的状态一致性
 */
export default function TranslationPreloader() {
  const { i18n: i18nInstance } = useTranslation()
  const { lang } = useParams()
  const location = useLocation()

  // 预加载翻译资源的函数
  const preloadTranslation = useCallback(async (targetLang) => {
    if (!targetLang || !SUPPORTED_LANGS.includes(targetLang)) {
      return false
    }

    try {
      await i18nInstance.loadLanguages(targetLang)

      if (i18nInstance.language !== targetLang) {
        await i18nInstance.changeLanguage(targetLang)
      }

      return true
    } catch (error) {
      logger.error(`[TranslationPreloader] Error loading ${targetLang}:`, error)
      return false
    }
  }, [i18nInstance])

  // 监听路由变化，预加载翻译资源
  useEffect(() => {
    const currentLang = lang || DEFAULT_LOCALE

    preloadTranslation(currentLang)
  }, [lang, location.pathname, preloadTranslation])

  // 预加载常用语言（在空闲时间）- 临时禁用以防止自动语言切换
  useEffect(() => {
    // 临时禁用所有预加载，防止自动切换到日语
    if (import.meta.env.DEV) {
      console.log('[TranslationPreloader] 语言预加载已禁用')
    }
    return () => {}
  }, [i18nInstance, preloadTranslation])

  // 监听 i18n 事件，处理加载错误
  useEffect(() => {
    const handleFailedLoading = (lng, ns, msg) => {
      logger.warn(`[TranslationPreloader] Failed to load ${lng}/${ns}:`, msg)
    }

    const handleLanguageChanged = (lng) => {
      logger.debug(`[TranslationPreloader] Language changed to: ${lng}`)
    }

    i18nInstance.on('failedLoading', handleFailedLoading)
    i18nInstance.on('languageChanged', handleLanguageChanged)

    return () => {
      i18nInstance.off('failedLoading', handleFailedLoading)
      i18nInstance.off('languageChanged', handleLanguageChanged)
    }
  }, [i18nInstance, preloadTranslation])

  // 这个组件不渲染任何内容
  return null
}
