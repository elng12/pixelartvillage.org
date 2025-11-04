/**
 * 安全的存储工具类
 * 提供localStorage的降级方案,在隐私模式或存储配额满时使用内存存储
 */

import logger from './logger'

class SafeStorage {
  constructor() {
    this.memoryStorage = new Map()
    this.isLocalStorageAvailable = this._testLocalStorage()
    this.isSessionStorageAvailable = this._testSessionStorage()
  }

  /**
   * 测试localStorage是否可用
   */
  _testLocalStorage() {
    try {
      const testKey = '__storage_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      return true
    } catch (e) {
      logger.warn('[SafeStorage] localStorage不可用，将尝试其他存储方案:', e.message)
      return false
    }
  }

  /**
   * 测试sessionStorage是否可用
   */
  _testSessionStorage() {
    try {
      const testKey = '__storage_test__'
      sessionStorage.setItem(testKey, 'test')
      sessionStorage.removeItem(testKey)
      return true
    } catch (e) {
      logger.warn('[SafeStorage] sessionStorage不可用，将使用内存存储:', e.message)
      return false
    }
  }

  /**
   * 获取存储的值
   * @param {string} key - 存储键名
   * @returns {string|null} 存储的值
   */
  get(key) {
    try {
      if (this.isLocalStorageAvailable) {
        const value = localStorage.getItem(key)
        if (value !== null) {
          this.memoryStorage.set(key, value)
          return value
        }
      }
    } catch (error) {
      logger.warn(`[SafeStorage] 从localStorage读取失败 (key: ${key}):`, error.message)
      this.isLocalStorageAvailable = this._testLocalStorage()
    }

    try {
      if (this.isSessionStorageAvailable) {
        const value = sessionStorage.getItem(key)
        if (value !== null) {
          this.memoryStorage.set(key, value)
          return value
        }
      }
    } catch (error) {
      logger.warn(`[SafeStorage] 从sessionStorage读取失败 (key: ${key}):`, error.message)
      this.isSessionStorageAvailable = this._testSessionStorage()
    }

    return this.memoryStorage.get(key) ?? null
  }

  /**
   * 设置存储的值
   * @param {string} key - 存储键名
   * @param {string} value - 要存储的值
   * @returns {boolean} 是否成功存储
   */
  set(key, value) {
    this.memoryStorage.set(key, value)

    try {
      if (this.isLocalStorageAvailable) {
        localStorage.setItem(key, value)
        return true
      }
    } catch (error) {
      logger.warn(`[SafeStorage] 写入localStorage失败 (key: ${key}):`, error.message)
      this.isLocalStorageAvailable = this._testLocalStorage()
    }

    try {
      if (this.isSessionStorageAvailable) {
        sessionStorage.setItem(key, value)
        return true
      }
    } catch (error) {
      logger.warn(`[SafeStorage] 写入sessionStorage失败 (key: ${key}):`, error.message)
      this.isSessionStorageAvailable = this._testSessionStorage()
    }

    logger.debug(`[SafeStorage] 使用内存存储 (key: ${key})`)
    return false
  }

  /**
   * 删除存储的值
   * @param {string} key - 存储键名
   */
  remove(key) {
    this.memoryStorage.delete(key)

    try {
      if (this.isLocalStorageAvailable) {
        localStorage.removeItem(key)
      }
    } catch (error) {
      logger.warn(`[SafeStorage] 从localStorage删除失败 (key: ${key}):`, error.message)
      this.isLocalStorageAvailable = this._testLocalStorage()
    }

    try {
      if (this.isSessionStorageAvailable) {
        sessionStorage.removeItem(key)
      }
    } catch (error) {
      logger.warn(`[SafeStorage] 从sessionStorage删除失败 (key: ${key}):`, error.message)
      this.isSessionStorageAvailable = this._testSessionStorage()
    }
  }

  /**
   * 清空所有存储
   */
  clear() {
    this.memoryStorage.clear()

    try {
      if (this.isLocalStorageAvailable) {
        localStorage.clear()
      }
    } catch (error) {
      logger.warn('[SafeStorage] 清空localStorage失败:', error.message)
      this.isLocalStorageAvailable = this._testLocalStorage()
    }

    try {
      if (this.isSessionStorageAvailable) {
        sessionStorage.clear()
      }
    } catch (error) {
      logger.warn('[SafeStorage] 清空sessionStorage失败:', error.message)
      this.isSessionStorageAvailable = this._testSessionStorage()
    }
  }

  /**
   * 检查键是否存在
   * @param {string} key - 存储键名
   * @returns {boolean}
   */
  has(key) {
    if (this.isLocalStorageAvailable) {
      try {
        if (localStorage.getItem(key) !== null) return true
      } catch (error) {
        logger.warn(`[SafeStorage] 检查localStorage失败 (key: ${key}):`, error.message)
        this.isLocalStorageAvailable = this._testLocalStorage()
      }
    }

    if (this.isSessionStorageAvailable) {
      try {
        if (sessionStorage.getItem(key) !== null) return true
      } catch (error) {
        logger.warn(`[SafeStorage] 检查sessionStorage失败 (key: ${key}):`, error.message)
        this.isSessionStorageAvailable = this._testSessionStorage()
      }
    }

    return this.memoryStorage.has(key)
  }

  /**
   * 获取所有键
   * @returns {string[]}
   */
  keys() {
    if (this.isLocalStorageAvailable) {
      try {
        return Object.keys(localStorage)
      } catch (error) {
        logger.warn('[SafeStorage] 获取localStorage keys失败:', error.message)
        this.isLocalStorageAvailable = this._testLocalStorage()
      }
    }

    if (this.isSessionStorageAvailable) {
      try {
        return Object.keys(sessionStorage)
      } catch (error) {
        logger.warn('[SafeStorage] 获取sessionStorage keys失败:', error.message)
        this.isSessionStorageAvailable = this._testSessionStorage()
      }
    }

    return Array.from(this.memoryStorage.keys())
  }
}

const safeStorage = new SafeStorage()

export default safeStorage
