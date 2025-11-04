import logger from '@/utils/logger'
import { useEffect } from 'react'

// 以最小依赖的方式提供可复用的防抖 effect
export function useDebouncedEffect(effect, deps, delay) {
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        effect()
      } catch (e) {
        if (import.meta?.env?.DEV) {
          logger.error('useDebouncedEffect error:', e)
        }
      }
    }, delay)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps || []), delay])
}
