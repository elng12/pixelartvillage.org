// Palette helpers: hex parsing, nearest color, quantization with/without dithering
import { rgbToLab, clamp255 } from './color-utils.js'

export function hexToRgb(hex) {
  const h = hex.replace('#', '').trim()
  const bigint = parseInt(h, 16)
  if (h.length === 3) {
    const r = parseInt(h[0] + h[0], 16)
    const g = parseInt(h[1] + h[1], 16)
    const b = parseInt(h[2] + h[2], 16)
    return [r, g, b]
  }
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return [r, g, b]
}

export function nearestColorIndex(r, g, b, palette, useLab = false, paletteLab = null) {
  let best = 0
  let bestDist = Infinity
  let L, a, bb
  if (useLab) {
    ;[L, a, bb] = rgbToLab(r, g, b)
  }
  for (let i = 0; i < palette.length; i++) {
    let dist
    if (!useLab) {
      const pr = palette[i][0]
      const pg = palette[i][1]
      const pb = palette[i][2]
      const dr = r - pr
      const dg = g - pg
      const db = b - pb
      dist = dr * dr + dg * dg + db * db
    } else {
      const [l2, a2, b2] = paletteLab ? paletteLab[i] : rgbToLab(palette[i][0], palette[i][1], palette[i][2])
      const dl = L - l2
      const da = a - a2
      const dbb = bb - b2
      dist = dl * dl + da * da + dbb * dbb
    }
    if (dist < bestDist) {
      bestDist = dist
      best = i
    }
  }
  return best
}

export function applyPaletteToCanvas(canvas, palette, useLab = false, paletteLab = null) {
  const ctx = canvas.getContext('2d')
  applyPaletteToCtx(ctx, canvas.width, canvas.height, palette, useLab, paletteLab)
}

export function applyPaletteToCtx(ctx, width, height, palette, useLab = false, paletteLab = null) {
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const a = data[i + 3]
    if (a === 0) continue
    const idx = nearestColorIndex(r, g, b, palette, useLab, paletteLab)
    const [pr, pg, pb] = palette[idx]
    data[i] = pr
    data[i + 1] = pg
    data[i + 2] = pb
  }
  ctx.putImageData(imageData, 0, 0)
}

// Floyd–Steinberg dithering with fixed palette
export function applyPaletteToCanvasDither(canvas, palette, useLab = false, paletteLab = null) {
  const ctx = canvas.getContext('2d')
  applyPaletteToCtxDither(ctx, canvas.width, canvas.height, palette, useLab, paletteLab)
}

export function applyPaletteToCtxDither(ctx, width, height, palette, useLab = false, paletteLab = null) {
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  const width4 = width * 4
  const F7 = 7 / 16, F5 = 5 / 16, F3 = 3 / 16, F1 = 1 / 16

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = y * width4 + x * 4
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]
      if (a === 0) continue
      const ni = nearestColorIndex(r, g, b, palette, useLab, paletteLab)
      const nr = palette[ni][0]
      const ng = palette[ni][1]
      const nb = palette[ni][2]
      const er = r - nr
      const eg = g - ng
      const eb = b - nb
      data[i] = nr; data[i + 1] = ng; data[i + 2] = nb

      if (x < width - 1) {
        const j = i + 4
        data[j] = clamp255(data[j] + er * F7)
        data[j + 1] = clamp255(data[j + 1] + eg * F7)
        data[j + 2] = clamp255(data[j + 2] + eb * F7)
      }
      if (y < height - 1) {
        const dj = i + width4
        // Down
        data[dj] = clamp255(data[dj] + er * F5)
        data[dj + 1] = clamp255(data[dj + 1] + eg * F5)
        data[dj + 2] = clamp255(data[dj + 2] + eb * F5)
        // Down-left
        if (x > 0) {
          const dlj = dj - 4
          data[dlj] = clamp255(data[dlj] + er * F3)
          data[dlj + 1] = clamp255(data[dlj + 1] + eg * F3)
          data[dlj + 2] = clamp255(data[dlj + 2] + eb * F3)
        }
        // Down-right
        if (x < width - 1) {
          const drj = dj + 4
          data[drj] = clamp255(data[drj] + er * F1)
          data[drj + 1] = clamp255(data[drj + 1] + eg * F1)
          data[drj + 2] = clamp255(data[drj + 2] + eb * F1)
        }
      }
    }
  }
  ctx.putImageData(imageData, 0, 0)
}

