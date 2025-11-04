// 统一语言管理器 - 解决代码重复和逻辑混乱问题
import safeStorage from './safeStorage'
import { CANONICAL_LOCALE, SUPPORTED_LANGS } from '@/i18n'

class LanguageManager {
  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5分钟缓存
  }

  // 缓存键生成
  generateCacheKey(prefix, ...args) {
    return `${prefix}:${args.join(':')}`
  }

  // 缓存操作
  getFromCache(key) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.value
    }
    this.cache.delete(key)
    return null
  }

  setCache(key, value) {
    this.cache.set(key, {
      value,
      timestamp: Date.now()
    })
  }

  // 清理缓存
  clearCache() {
    this.cache.clear()
  }

  // 获取存储的语言
  getStoredLanguage() {
    const cacheKey = this.generateCacheKey('stored_lang')
    const cached = this.getFromCache(cacheKey)
    if (cached !== null) return cached

    try {
      const raw = safeStorage.get('pv_lang')
      if (!raw) return null

      const { lang, ts } = JSON.parse(raw)
      if (!lang || !ts) return null

      // 检查是否过期（1年）
      if (Date.now() - ts > 365 * 24 * 60 * 60 * 1000) return null

      if (!SUPPORTED_LANGS.includes(lang)) return null

      this.setCache(cacheKey, lang)
      return lang
    } catch (error) {
      console.warn('[LanguageManager] 获取存储语言失败:', error)
      return null
    }
  }

  // 设置存储语言
  setStoredLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return false

    try {
      safeStorage.set('pv_lang', JSON.stringify({
        lang,
        ts: Date.now()
      }))

      // 清理相关缓存
      this.clearCache()
      return true
    } catch (error) {
      console.warn('[LanguageManager] 设置存储语言失败:', error)
      return false
    }
  }

  // 检测浏览器语言
  detectBrowserLanguage() {
    const cacheKey = this.generateCacheKey('browser_lang')
    const cached = this.getFromCache(cacheKey)
    if (cached !== null) return cached

    if (typeof navigator === 'undefined') {
      this.setCache(cacheKey, CANONICAL_LOCALE)
      return CANONICAL_LOCALE
    }

    const candidates = []

    // 收集语言候选
    if (navigator.languages && Array.isArray(navigator.languages)) {
      candidates.push(...navigator.languages)
    }
    if (navigator.language) {
      candidates.push(navigator.language)
    }

    // 优先检查英文
    for (const candidate of candidates) {
      if (!candidate) continue
      const lang = candidate.toLowerCase().split('-')[0]
      if (lang === 'en') {
        this.setCache(cacheKey, 'en')
        return 'en'
      }
    }

    // 检查其他支持的语言
    for (const candidate of candidates) {
      if (!candidate) continue
      const lang = candidate.toLowerCase().split('-')[0]
      if (SUPPORTED_LANGS.includes(lang)) {
        this.setCache(cacheKey, lang)
        return lang
      }
    }

    this.setCache(cacheKey, CANONICAL_LOCALE)
    return CANONICAL_LOCALE
  }

  // 从路径提取语言
  extractLanguageFromPath(pathname) {
    const cacheKey = this.generateCacheKey('path_lang', pathname)
    const cached = this.getFromCache(cacheKey)
    if (cached !== null) return cached

    if (!pathname || typeof pathname !== 'string') {
      this.setCache(cacheKey, null)
      return null
    }

    const segments = pathname.trim().split('/')
    if (segments.length > 1) {
      const firstSegment = segments[1].toLowerCase()
      if (SUPPORTED_LANGS.includes(firstSegment)) {
        this.setCache(cacheKey, firstSegment)
        return firstSegment
      }
    }

    this.setCache(cacheKey, null)
    return null
  }

  // 构建本地化路径
  buildLocalizedPath(language, pathname) {
    if (!language || !pathname) return pathname

    // 规范化路径
    const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`

    // 如果是默认语言，移除语言前缀
    if (language === CANONICAL_LOCALE) {
      const segments = normalized.split('/').filter(Boolean)
      if (segments.length > 0 && SUPPORTED_LANGS.includes(segments[0].toLowerCase())) {
        segments.shift()
        return `/${segments.join('/')}` || '/'
      }
      return normalized
    }

    // 非默认语言，添加语言前缀
    const stripped = this.stripLanguageFromPath(normalized)
    return `/${language}${stripped}`
  }

  // 从路径移除语言前缀
  stripLanguageFromPath(pathname) {
    if (!pathname) return pathname

    let result = pathname
    for (let i = 0; i < 10; i++) {
      const segments = result.split('/').filter(Boolean)
      if (segments.length === 0) break

      const first = segments[0].toLowerCase()
      if (SUPPORTED_LANGS.includes(first)) {
        segments.shift()
        result = `/${segments.join('/')}` || '/'
      } else {
        break
      }
    }

    return result
  }

  // 验证语言支持
  isLanguageSupported(lang) {
    return SUPPORTED_LANGS.includes(lang)
  }

  // 获取最佳语言匹配
  getBestLanguageMatch(preferences = []) {
    const cacheKey = this.generateCacheKey('best_match', preferences.join(','))
    const cached = this.getFromCache(cacheKey)
    if (cached !== null) return cached

    // 存储的语言优先
    const stored = this.getStoredLanguage()
    if (stored && this.isLanguageSupported(stored)) {
      this.setCache(cacheKey, stored)
      return stored
    }

    // 传入的偏好语言
    for (const pref of preferences) {
      if (!pref) continue
      const lang = pref.toLowerCase().split('-')[0]
      if (this.isLanguageSupported(lang)) {
        this.setCache(cacheKey, lang)
        return lang
      }
    }

    // 浏览器语言
    const detected = this.detectBrowserLanguage()
    this.setCache(cacheKey, detected)
    return detected
  }
}

// 单例模式
export const languageManager = new LanguageManager()
export default languageManager