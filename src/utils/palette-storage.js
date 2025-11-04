import logger from '@/utils/logger'
import safeStorage from '@/utils/safeStorage'
// 负责持久化（localStorage）访问与兼容处理
const STORAGE_KEY = 'customPalettes'

export function loadCustomPalettes() {
  try {
    const raw = safeStorage.get(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((p) => p && typeof p.name === 'string' && Array.isArray(p.colors))
      .map((p) => ({ name: p.name, colors: p.colors.filter((c) => typeof c === 'string') }))
  } catch (err) {
    logger.error('Failed to load custom palettes from localStorage:', err)
    return []
  }
}

export function saveCustomPalettes(palettes) {
  try {
    safeStorage.set(STORAGE_KEY, JSON.stringify(palettes || []))
  } catch {
    // ignore
  }
}

export function getCustomPaletteByName(name) {
  const list = loadCustomPalettes()
  const hit = list.find((p) => p.name === name)
  return hit ? hit.colors : null
}

