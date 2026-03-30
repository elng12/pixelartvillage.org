import logger from '@/utils/logger'
// Image processing utilities — pixel art conversion
class ImageProcessor {
  constructor() { this.last = null; }
  setLast(payload) { this.last = payload; }
  getLast() { return this.last; }
}
export const imageProcessor = new ImageProcessor();

// Helper: robust image loader with decode() and timeout guard
const loadImage = (imageData, { timeoutMs = LOAD_TIMEOUT_MS } = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image()
      img.decoding = 'async'
      const timer = setTimeout(() => {
        try { img.src = '' } catch { /* noop */ }
        reject(new Error('Image loading timeout'))
      }, timeoutMs)
      img.onerror = () => {
        clearTimeout(timer)
        reject(new Error('Failed to load image.'))
      }
      img.onload = async () => {
        try { if (typeof img.decode === 'function') await img.decode() } catch { /* ignore decode failure */ }
        clearTimeout(timer)
        resolve(img)
      }
      img.src = imageData
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Main processing function. All operations happen on a single canvas for efficiency.
 * @param {string} imageData - Image data URL.
 * @param {object} options - Processing options.
 * @returns {Promise<string>} - Result image as data URL.
 */
import { PALETTE_MAP, getCustomPaletteByName, inferAutoPaletteSize, PREVIEW_LIMIT } from './constants.js'
import { LOAD_TIMEOUT_MS } from './constants.js'
import { drawContainToCanvas } from './resizeImage.js'
import { rgbToLab } from './color-utils.js'
import { hexToRgb, applyPaletteToCanvas, applyPaletteToCanvasDither, applyPaletteToCtx, applyPaletteToCtxDither } from './palette-helpers.js'
import { getKMeansPalette } from './kmeans-bridge.js'

function buildFilterString(brightness, contrast, saturation) {
  const f = [];
  if (brightness !== 0) f.push(`brightness(${100 + brightness}%)`);
  if (contrast !== 0) f.push(`contrast(${100 + contrast}%)`);
  if (saturation !== 0) f.push(`saturate(${100 + saturation}%)`);
  return f.length ? f.join(' ') : 'none';
}

function createCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

function normalizeHexColor(hexColor) {
  const normalized = String(hexColor || '').trim().replace('#', '')
  return /^[0-9a-fA-F]{6}$/.test(normalized) ? `#${normalized}` : '#475569'
}

function toGridStrokeColor(hexColor, alpha = 0.34) {
  const [r, g, b] = hexToRgb(normalizeHexColor(hexColor))
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function drawExportGrid(ctx, { width, height, columns, rows, color }) {
  if (!columns || !rows) return
  const cellWidth = width / columns
  const cellHeight = height / rows
  if (!Number.isFinite(cellWidth) || !Number.isFinite(cellHeight) || Math.min(cellWidth, cellHeight) < 2) return

  const thickness = Math.max(1, Math.round(Math.min(cellWidth, cellHeight) * 0.08))
  ctx.save()
  ctx.fillStyle = color
  for (let x = 1; x < columns; x++) {
    const xpos = Math.round(x * cellWidth - thickness / 2)
    ctx.fillRect(xpos, 0, thickness, height)
  }
  for (let y = 1; y < rows; y++) {
    const ypos = Math.round(y * cellHeight - thickness / 2)
    ctx.fillRect(0, ypos, width, thickness)
  }
  ctx.restore()
}

async function resolvePalette({ autoPalette, palette, paletteSize }, sourceCanvas, signal) {
  let paletteColors = null;
  if (autoPalette) {
    paletteColors = await getKMeansPalette(sourceCanvas, clampToInt(paletteSize, 2, 64), signal);
  } else {
    paletteColors = getPaletteColors(palette);
    if (!paletteColors) {
      const inferred = inferAutoPaletteSize(palette);
      if (inferred) paletteColors = await getKMeansPalette(sourceCanvas, clampToInt(inferred, 2, 64), signal);
    }
  }
  return paletteColors;
}

export async function processPixelArt(imageData, options, signal) {
  try {
    const {
      pixelSize = 8,
      brightness = 0,
      contrast = 0,
      saturation = 0,
      palette = 'none',
      dither = false,
      autoPalette = false,
      paletteSize = 16,
      colorDistance = 'rgb', // 'rgb' | 'lab'
    } = options || {};

    const img = await loadImage(imageData)
    // Enforce a hard cap on processing dimensions; contain-scale if oversized
    const limit = PREVIEW_LIMIT?.maxEdge || 2200
    let src = img
    let width = img.naturalWidth || img.width
    let height = img.naturalHeight || img.height
    if (Math.max(width, height) > limit) {
      const safe = drawContainToCanvas(img, limit, limit, { pixelated: false })
      src = safe
      width = safe.width
      height = safe.height
    }
    // 1) Build filter string (explicit 'none' to avoid stale state)
    const filterString = buildFilterString(brightness, contrast, saturation);

    // 2) Pixelation path
    // If pixel size is too big so scaled dimensions are <= 0, fall back to plain draw
    const scaledWidth = Math.floor(width / pixelSize)
    const scaledHeight = Math.floor(height / pixelSize)
    let previewCanvas
    let pixelCanvas
    if (pixelSize > 1 && scaledWidth > 0 && scaledHeight > 0) {
      ({ previewCanvas, pixelCanvas } = await processPixelatePath({ src, width, height, scaledWidth, scaledHeight, filterString, autoPalette, palette, paletteSize, dither, colorDistance }, signal))
    } else {
      previewCanvas = await processDirectPath({ src, width, height, filterString, autoPalette, palette, paletteSize, dither, colorDistance }, signal)
      pixelCanvas = previewCanvas
    }
    imageProcessor.setLast({
      previewCanvas,
      pixelCanvas,
      sourceWidth: width,
      sourceHeight: height,
      pixelWidth: pixelCanvas.width,
      pixelHeight: pixelCanvas.height,
    })
    return previewCanvas.toDataURL();
  } catch (error) {
    if (import.meta.env.DEV) logger.error('Pixel art processing error:', error);
    throw error;
  }
}

async function processPixelatePath({ src, width, height, scaledWidth, scaledHeight, filterString, autoPalette, palette, paletteSize, dither, colorDistance }, signal) {
  // Downscale to small canvas with filters, then quantize, then upscale without smoothing
  const tempCanvas = createCanvas(scaledWidth, scaledHeight)
  const tempCtx = tempCanvas.getContext('2d')
  tempCtx.filter = filterString
  tempCtx.drawImage(src, 0, 0, scaledWidth, scaledHeight)

  const paletteColors = await resolvePalette({ autoPalette, palette, paletteSize }, tempCanvas, signal)
  if (paletteColors) {
    const paletteLab = colorDistance === 'lab' ? paletteColors.map((c)=>rgbToLab(c[0],c[1],c[2])) : null
    if (dither) applyPaletteToCanvasDither(tempCanvas, paletteColors, colorDistance === 'lab', paletteLab)
    else applyPaletteToCanvas(tempCanvas, paletteColors, colorDistance === 'lab', paletteLab)
  }

  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = false
  ctx.filter = 'none'
  ctx.drawImage(tempCanvas, 0, 0, scaledWidth, scaledHeight, 0, 0, width, height)
  return { previewCanvas: canvas, pixelCanvas: tempCanvas }
}

async function processDirectPath({ src, width, height, filterString, autoPalette, palette, paletteSize, dither, colorDistance }, signal) {
  // Draw full-res with filters, then quantize on main canvas
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  ctx.filter = filterString
  ctx.drawImage(src, 0, 0)

  const paletteColors = await resolvePalette({ autoPalette, palette, paletteSize }, canvas, signal)
  if (paletteColors) {
    const paletteLab = colorDistance === 'lab' ? paletteColors.map((c)=>rgbToLab(c[0],c[1],c[2])) : null
    if (dither) applyPaletteToCtxDither(ctx, width, height, paletteColors, colorDistance === 'lab', paletteLab)
    else applyPaletteToCtx(ctx, width, height, paletteColors, colorDistance === 'lab', paletteLab)
  }
  ctx.filter = 'none'
  return canvas
}

// =============== Palette Utilities ===============

function getPaletteColors(name) {
  if (!name || name === 'none') return null;
  let list = PALETTE_MAP[name];
  if (!list) {
    const custom = getCustomPaletteByName(name);
    if (Array.isArray(custom) && custom.length) list = custom;
  }
  return Array.isArray(list) && list.length > 0 ? list.map(hexToRgb) : null;
}

// Simple k-means palette extraction on a downsampled canvas

function clampToInt(v, min, max) {
  const n = Math.round(Number(v) || 0);
  return Math.max(min, Math.min(max, n));
}

// 为兼容性保留纯函数导出（从拆分模块再导出）
export { hexToRgb } from './palette-helpers.js'
export { clamp255, rgbToLab } from './color-utils.js'

// -------- Export helpers --------
function mimeFromFormat(fmt) {
  return fmt === 'png' ? 'image/png' : fmt === 'jpeg' ? 'image/jpeg' : 'image/webp'
}

function resolveExportSource(cache, size) {
  if (!cache) return null
  const previewCanvas = cache.previewCanvas || null
  const pixelCanvas = cache.pixelCanvas || previewCanvas
  const pixelWidth = cache.pixelWidth || pixelCanvas?.width || previewCanvas?.width || 0
  const pixelHeight = cache.pixelHeight || pixelCanvas?.height || previewCanvas?.height || 0
  switch (size) {
    case 'pixel':
      return { canvas: pixelCanvas, multiplier: 1, pixelWidth, pixelHeight }
    case 'double':
      return { canvas: previewCanvas, multiplier: 2, pixelWidth, pixelHeight }
    case 'quad':
      return { canvas: previewCanvas, multiplier: 4, pixelWidth, pixelHeight }
    case 'source':
    default:
      return { canvas: previewCanvas, multiplier: 1, pixelWidth, pixelHeight }
  }
}

export async function exportProcessedBlob(
  processedDataUrl,
  { format = 'png', size = 'source', quality = 0.92, transparentBG = true, showGrid = false, gridColor = '#475569' } = {},
) {
  const cache = imageProcessor.getLast()

  const out = document.createElement('canvas');
  const ctx = out.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  async function toBlobAsync(canvas, mime, q) {
    return new Promise((resolve) => canvas.toBlob((b) => resolve(b), mime, q))
  }

  const mime = mimeFromFormat(format);

  const resolved = resolveExportSource(cache, size)
  if (resolved?.canvas?.width && resolved?.canvas?.height) {
    out.width = Math.max(1, Math.round(resolved.canvas.width * resolved.multiplier))
    out.height = Math.max(1, Math.round(resolved.canvas.height * resolved.multiplier))
    if (mime !== 'image/png' || !transparentBG) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, out.width, out.height);
    }
    ctx.drawImage(resolved.canvas, 0, 0, out.width, out.height)
    if (showGrid) {
      drawExportGrid(ctx, {
        width: out.width,
        height: out.height,
        columns: resolved.pixelWidth,
        rows: resolved.pixelHeight,
        color: toGridStrokeColor(gridColor),
      })
    }
    return await toBlobAsync(out, mime, format === 'png' ? undefined : quality)
  }

  // Fallback: decode from data URL if cache is missing
  const img = await loadImage(processedDataUrl);
  out.width = Math.max(1, Math.round(img.naturalWidth || img.width));
  out.height = Math.max(1, Math.round(img.naturalHeight || img.height));
  if (mime !== 'image/png' || !transparentBG) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, out.width, out.height);
  }
  ctx.drawImage(img, 0, 0, out.width, out.height);
  return await toBlobAsync(out, mime, format === 'png' ? undefined : quality);
}
