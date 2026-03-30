const HEX_COLOR_PATTERN = /#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b/g
const IMPORTED_PALETTE_NAME = 'Imported Palette'

function expandShortHex(value) {
  return value.length === 3 ? value.split('').map((char) => `${char}${char}`).join('') : value
}

export function normalizeHexColor(value) {
  const normalized = String(value || '').trim().replace(/^#/, '')
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(normalized)) return null
  return `#${expandShortHex(normalized).toUpperCase()}`
}

export function extractPaletteHexColors(input) {
  const text = String(input || '')
  const matches = text.matchAll(HEX_COLOR_PATTERN)
  const seen = new Set()
  const colors = []

  for (const match of matches) {
    const normalized = normalizeHexColor(match[0])
    if (!normalized || seen.has(normalized)) continue
    seen.add(normalized)
    colors.push(normalized)
  }

  return colors
}

function normalizeImportUrl(input) {
  const raw = String(input || '').trim()
  if (!raw) return null

  if (/^https?:\/\//i.test(raw)) {
    try {
      return new URL(raw)
    } catch {
      return null
    }
  }

  if (/^(www\.)?(lospec|pixilart)\.com\//i.test(raw)) {
    try {
      return new URL(`https://${raw}`)
    } catch {
      return null
    }
  }

  return null
}

function buildLospecJsonUrl(url) {
  const parts = url.pathname.split('/').filter(Boolean)
  if (parts[0] !== 'palette-list' || !parts[1]) return null
  const slug = parts[1].replace(/\.json$/i, '')
  return `https://lospec.com/palette-list/${slug}.json`
}

export function parsePaletteImportInput(input) {
  const raw = String(input || '').trim()
  if (!raw) return { type: 'empty' }

  const normalizedUrl = normalizeImportUrl(raw)
  if (normalizedUrl) {
    const host = normalizedUrl.hostname.replace(/^www\./, '').toLowerCase()
    if (host === 'lospec.com') {
      const jsonUrl = buildLospecJsonUrl(normalizedUrl)
      return jsonUrl ? { type: 'lospec-url', url: normalizedUrl.toString(), jsonUrl } : { type: 'unsupported-url', url: normalizedUrl.toString() }
    }
    if (host === 'pixilart.com') {
      return { type: 'pixilart-url', url: normalizedUrl.toString() }
    }
    return { type: 'unsupported-url', url: normalizedUrl.toString() }
  }

  const colors = extractPaletteHexColors(raw)
  if (colors.length >= 2) return { type: 'hex-list', colors }

  return { type: 'invalid' }
}

export async function fetchLospecPalette(jsonUrl, fetchImpl = fetch) {
  let response
  try {
    response = await fetchImpl(jsonUrl)
  } catch (cause) {
    const error = new Error('Lospec request failed')
    error.code = 'LOSPEC_FETCH_FAILED'
    error.cause = cause
    throw error
  }

  if (!response.ok) {
    const error = new Error(`Lospec request failed: ${response.status}`)
    error.code = 'LOSPEC_FETCH_FAILED'
    throw error
  }

  let payload
  try {
    payload = await response.json()
  } catch (cause) {
    const error = new Error('Lospec response could not be parsed')
    error.code = 'LOSPEC_FETCH_FAILED'
    error.cause = cause
    throw error
  }
  const colors = extractPaletteHexColors(Array.isArray(payload?.colors) ? payload.colors.join(' ') : '')
  if (colors.length === 0) {
    const error = new Error('Lospec palette did not contain any colors')
    error.code = 'NO_COLORS'
    throw error
  }

  const slug = jsonUrl.split('/').pop()?.replace(/\.json$/i, '') || ''

  return {
    name: String(payload?.name || slug || IMPORTED_PALETTE_NAME).trim() || IMPORTED_PALETTE_NAME,
    author: String(payload?.author || '').trim(),
    colors,
    slug,
    url: jsonUrl.replace(/\.json$/i, ''),
    source: 'lospec',
    usedFallbackName: !String(payload?.name || slug || '').trim(),
  }
}

export async function importPaletteFromInput(input, { nameHint = '', fetchImpl = fetch } = {}) {
  const parsed = parsePaletteImportInput(input)
  const trimmedNameHint = String(nameHint || '').trim()

  if (parsed.type === 'hex-list') {
    return {
      name: trimmedNameHint || IMPORTED_PALETTE_NAME,
      colors: parsed.colors,
      source: 'manual',
      url: '',
      slug: '',
      author: '',
      usedFallbackName: !trimmedNameHint,
    }
  }

  if (parsed.type === 'lospec-url') {
    return fetchLospecPalette(parsed.jsonUrl, fetchImpl)
  }

  if (parsed.type === 'pixilart-url') {
    const error = new Error('PixilArt blocks direct palette fetching.')
    error.code = 'PIXILART_BLOCKED'
    throw error
  }

  if (parsed.type === 'unsupported-url') {
    const error = new Error('Unsupported palette URL.')
    error.code = 'UNSUPPORTED_URL'
    throw error
  }

  if (parsed.type === 'empty') {
    const error = new Error('Palette import input is empty.')
    error.code = 'EMPTY_INPUT'
    throw error
  }

  const error = new Error('No palette colors were found.')
  error.code = 'NO_COLORS'
  throw error
}
