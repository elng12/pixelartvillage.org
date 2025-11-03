import { useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useLocation } from 'react-router-dom'
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
      // 检查资源是否已经加载
      const hasResource = i18nInstance.getResourceBundle(targetLang, 'translation')
      
      if (!hasResource) {
        // 如果资源未加载，强制加载
        await i18nInstance.loadLanguages(targetLang)
        
        // 再次检查是否加载成功
        const recheck = i18nInstance.getResourceBundle(targetLang, 'translation')
        if (!recheck) {
          console.warn(`[TranslationPreloader] Failed to load resources for ${targetLang}`)
          return false
        }
      }

      // 确保 i18n 实例的当前语言与目标语言一致
      if (i18nInstance.language !== targetLang) {
        await i18nInstance.changeLanguage(targetLang)
      }

      return true
    } catch (error) {
      console.error(`[TranslationPreloader] Error loading ${targetLang}:`, error)
      return false
    }
  }, [i18nInstance])

  // 监听路由变化，预加载翻译资源
  useEffect(() => {
    const currentLang = lang || DEFAULT_LOCALE
    
    // 异步预加载，不阻塞渲染
    preloadTranslation(currentLang).then(success => {
      if (!success && currentLang !== DEFAULT_LOCALE) {
        // 如果加载失败且不是默认语言，尝试加载默认语言
        console.warn(`[TranslationPreloader] Falling back to ${DEFAULT_LOCALE}`)
        preloadTranslation(DEFAULT_LOCALE)
      }
    })
  }, [lang, location.pathname, preloadTranslation])

  // 预加载常用语言（在空闲时间）
  useEffect(() => {
    const preloadCommonLanguages = () => {
      const commonLangs = ['en', 'es', 'de', 'fr', 'ko', 'ja']
      
      commonLangs.forEach(lng => {
        if (lng !== i18nInstance.language && SUPPORTED_LANGS.includes(lng)) {
          // 使用 requestIdleCallback 在空闲时预加载
          if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(() => {
              preloadTranslation(lng)
            }, { timeout: 5000 })
          } else {
            // 降级到 setTimeout
            setTimeout(() => {
              preloadTranslation(lng)
            }, 2000)
          }
        }
      })
    }

    // 延迟预加载，避免影响初始页面加载
    const timer = setTimeout(preloadCommonLanguages, 1000)
    return () => clearTimeout(timer)
  }, [i18nInstance, preloadTranslation])

  // 监听 i18n 事件，处理加载错误
  useEffect(() => {
    const handleFailedLoading = (lng, ns, msg) => {
      console.warn(`[TranslationPreloader] Failed to load ${lng}/${ns}:`, msg)
      
      // 如果不是默认语言，尝试加载默认语言
      if (lng !== DEFAULT_LOCALE) {
        preloadTranslation(DEFAULT_LOCALE)
      }
    }

    const handleLanguageChanged = (lng) => {
      console.log(`[TranslationPreloader] Language changed to: ${lng}`)
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
