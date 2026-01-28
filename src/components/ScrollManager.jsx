import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1))
      const removableHashes = new Set(['tool', 'showcase', 'features', 'how-it-works', 'faq'])
      // 使用 rAF 等下一帧，确保目标节点已渲染
      requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el && typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          if (removableHashes.has(id)) {
            const nextUrl = `${window.location.pathname}${window.location.search}`
            window.history.replaceState(null, '', nextUrl)
          }
        }
      })
      return
    }
    // 无 hash 时滚动到顶部
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}
