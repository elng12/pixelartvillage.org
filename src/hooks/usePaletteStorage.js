import { useCallback, useEffect, useState } from 'react'
import { loadCustomPalettes, saveCustomPalettes } from '../utils/constants'

// 统一封装调色板的持久化访问，屏蔽具体存储实现（当前为 localStorage）
export function usePaletteStorage() {
  const [palettes, setPalettes] = useState([])

  const reload = useCallback(() => {
    setPalettes(loadCustomPalettes())
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const upsertPalette = useCallback((name, colors) => {
    const nm = String(name || '').trim()
    const cols = Array.isArray(colors) ? colors : []
    if (!nm || cols.length === 0) return
    const next = loadCustomPalettes()
    const idx = next.findIndex((p) => p.name === nm)
    if (idx >= 0) next[idx] = { name: nm, colors: cols }
    else next.push({ name: nm, colors: cols })
    saveCustomPalettes(next)
    setPalettes(next)
  }, [])

  const deletePalette = useCallback((name) => {
    const nm = String(name || '').trim()
    if (!nm) return
    const next = loadCustomPalettes().filter((p) => p.name !== nm)
    saveCustomPalettes(next)
    setPalettes(next)
  }, [])

  return { palettes, upsertPalette, deletePalette, reload }
}

