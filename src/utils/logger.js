/**
 * 开发环境日志工具
 * 在生产环境中自动禁用调试日志
 */

const isDev = import.meta?.env?.DEV || import.meta?.env?.MODE === 'development'

export const logger = {
  /**
   * 调试日志 - 仅在开发环境输出
   */
  debug: (...args) => {
    if (isDev) {
      console.log(...args)
    }
  },

  /**
   * 警告日志 - 所有环境输出
   */
  warn: (...args) => {
    console.warn(...args)
  },

  /**
   * 错误日志 - 所有环境输出
   */
  error: (...args) => {
    console.error(...args)
  },

  /**
   * 信息日志 - 仅在开发环境输出
   */
  info: (...args) => {
    if (isDev) {
      console.info(...args)
    }
  },
}

export default logger
