import logger from './logger.js'
import safeStorage from './safeStorage.js'
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

export function clearCustomPalettes() {
  try {
    safeStorage.remove(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function renameCustomPalette(oldName, nextName) {
  const fromName = String(oldName || '').trim()
  const toName = String(nextName || '').trim()
  if (!fromName || !toName) return null

  const palettes = loadCustomPalettes()
  const sourceIndex = palettes.findIndex((palette) => palette.name === fromName)
  if (sourceIndex < 0) return null
  if (fromName === toName) return palettes

  const sourcePalette = palettes[sourceIndex]
  const nextPalettes = palettes.filter((_, index) => index !== sourceIndex && palettes[index]?.name !== toName)
  const insertIndex = Math.min(sourceIndex, nextPalettes.length)
  nextPalettes.splice(insertIndex, 0, { name: toName, colors: sourcePalette.colors })
  saveCustomPalettes(nextPalettes)
  return nextPalettes
}

export function getCustomPaletteByName(name) {
  const list = loadCustomPalettes()
  const hit = list.find((p) => p.name === name)
  return hit ? hit.colors : null
}
