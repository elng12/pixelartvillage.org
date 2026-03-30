import logger from './logger.js'
import safeStorage from './safeStorage.js'
// 负责持久化（localStorage）访问与兼容处理
const STORAGE_KEY = 'customPalettes'
const PALETTE_LIBRARY_TYPE = 'pixel-art-village.custom-palettes'
const PALETTE_LIBRARY_VERSION = 1

function normalizePaletteRecord(palette) {
  if (!palette || typeof palette.name !== 'string' || !Array.isArray(palette.colors)) return null
  const name = palette.name.trim()
  const colors = palette.colors
    .filter((color) => typeof color === 'string')
    .map((color) => color.trim().toUpperCase())
    .filter((color) => /^#[0-9A-F]{6}$/.test(color))

  if (!name || colors.length === 0) return null
  return { name, colors: [...new Set(colors)] }
}

function normalizePaletteCollection(palettes) {
  const next = []
  const seen = new Set()

  for (let index = palettes.length - 1; index >= 0; index -= 1) {
    const normalized = normalizePaletteRecord(palettes[index])
    if (!normalized || seen.has(normalized.name)) continue
    seen.add(normalized.name)
    next.unshift(normalized)
  }

  return next
}

function createPaletteLibraryError(code, cause) {
  const error = new Error(code)
  error.code = code
  if (cause) error.cause = cause
  return error
}

export function loadCustomPalettes() {
  try {
    const raw = safeStorage.get(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return normalizePaletteCollection(parsed)
  } catch (err) {
    logger.error('Failed to load custom palettes from localStorage:', err)
    return []
  }
}

export function saveCustomPalettes(palettes) {
  try {
    safeStorage.set(STORAGE_KEY, JSON.stringify(normalizePaletteCollection(Array.isArray(palettes) ? palettes : [])))
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

export function buildCustomPaletteLibraryFilename(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `pixel-art-village-palettes-${year}-${month}-${day}.json`
}

export function serializeCustomPaletteLibrary(palettes = loadCustomPalettes()) {
  return JSON.stringify({
    app: 'pixelartvillage.org',
    type: PALETTE_LIBRARY_TYPE,
    version: PALETTE_LIBRARY_VERSION,
    exportedAt: new Date().toISOString(),
    palettes: normalizePaletteCollection(Array.isArray(palettes) ? palettes : []),
  }, null, 2)
}

export function parseCustomPaletteLibrary(rawText) {
  const text = String(rawText || '').trim()
  if (!text) throw createPaletteLibraryError('PALETTE_LIBRARY_INVALID_JSON')

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch (err) {
    throw createPaletteLibraryError('PALETTE_LIBRARY_INVALID_JSON', err)
  }

  const list = Array.isArray(parsed) ? parsed : parsed?.palettes
  if (!Array.isArray(list)) {
    throw createPaletteLibraryError('PALETTE_LIBRARY_INVALID_FORMAT')
  }

  const palettes = normalizePaletteCollection(list)
  if (!palettes.length) {
    throw createPaletteLibraryError('PALETTE_LIBRARY_EMPTY')
  }

  return palettes
}

export function importCustomPaletteLibrary(rawText, { replaceExisting = false } = {}) {
  const incoming = parseCustomPaletteLibrary(rawText)
  const existing = loadCustomPalettes()
  const existingNames = new Set(existing.map((palette) => palette.name))
  const collisions = incoming
    .filter((palette) => existingNames.has(palette.name))
    .map((palette) => palette.name)

  if (collisions.length > 0 && !replaceExisting) {
    return {
      palettes: existing,
      importedCount: 0,
      addedCount: 0,
      replacedCount: 0,
      collisions,
      needsConfirmation: true,
    }
  }

  const incomingByName = new Map(incoming.map((palette) => [palette.name, palette]))
  const merged = existing.map((palette) => incomingByName.get(palette.name) || palette)
  const seen = new Set(merged.map((palette) => palette.name))

  for (const palette of incoming) {
    if (seen.has(palette.name)) continue
    merged.push(palette)
    seen.add(palette.name)
  }

  saveCustomPalettes(merged)
  return {
    palettes: merged,
    importedCount: incoming.length,
    addedCount: incoming.length - collisions.length,
    replacedCount: collisions.length,
    collisions,
    needsConfirmation: false,
  }
}
