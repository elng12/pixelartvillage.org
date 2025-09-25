// Image processing utilities — pixel art conversion
class ImageProcessor {
  constructor() { this.last = null; }
  setLast(canvas) { this.last = canvas; }
  getLast() { return this.last; }
}
export const imageProcessor = new ImageProcessor();
// Simple LRU cache for k-means results on sampled data
const KMEANS_CACHE = new Map(); // key -> {value, tick}
let KMEANS_TICK = 0;

// Reusable singleton worker and request routing (avoid per-call creation/teardown)
let KMEANS_WORKER = null;
const KMEANS_HANDLERS = new Map(); // id -> { resolve, reject }

function ensureKMeansWorker() {
  if (KMEANS_WORKER) return KMEANS_WORKER;
  const worker = new Worker(new URL('../workers/kmeansWorker.js', import.meta.url), { type: 'module' });
  const onMessage = (e) => {
    const d = e && e.data;
    if (!d || typeof d !== 'object') return;
    const id = d.id;
    if (typeof id !== 'string' || id.length > WORKER_ID_MAXLEN) return;
    const handler = KMEANS_HANDLERS.get(id);
    if (!handler) return; // possibly aborted; drop
    KMEANS_HANDLERS.delete(id);
    if (typeof d.ok !== 'boolean') {
      handler.reject(new Error('Invalid worker response'));
      return;
    }
    if (!d.ok) {
      handler.reject(new Error(d.error || 'KMeans worker failed'));
      return;
    }
    const cents = d.centroids;
    if (!Array.isArray(cents) || cents.length === 0) {
      handler.reject(new Error('Invalid centroids'));
      return;
    }
    try {
      const result = cents.map((c) => {
        if (!Array.isArray(c)) return [0, 0, 0];
        return [clamp255(c[0]), clamp255(c[1]), clamp255(c[2])];
      });
      handler.resolve(result);
    } catch (err) {
      handler.reject(err);
    }
  };
  const onError = (err) => {
    // reject all pending
    for (const [, h] of KMEANS_HANDLERS) {
      try { h.reject(err); } catch { /* ignore */ }
    }
    KMEANS_HANDLERS.clear();
    try { worker.terminate(); } catch { /* ignore */ }
    KMEANS_WORKER = null;
  };
  worker.addEventListener('message', onMessage);
  worker.addEventListener('error', onError);
  KMEANS_WORKER = worker;
  return worker;
}

function kmeansCacheGet(key) {
  const hit = KMEANS_CACHE.get(key);
  if (hit) hit.tick = ++KMEANS_TICK;
  return hit?.value || null;
}
function kmeansCacheSet(key, value) {
  KMEANS_CACHE.set(key, { value, tick: ++KMEANS_TICK });
  if (KMEANS_CACHE.size > KMEANS_CACHE_MAX) {
    // evict least-recently used
    let oldestKey = null;
    let oldestTick = Infinity;
    for (const [k, v] of KMEANS_CACHE.entries()) {
      if (v.tick < oldestTick) { oldestTick = v.tick; oldestKey = k; }
    }
    if (oldestKey) KMEANS_CACHE.delete(oldestKey);
  }
}

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
import {
  PALETTE_MAP,
  getCustomPaletteByName,
  inferAutoPaletteSize,
  PREVIEW_LIMIT,
} from './constants.js'
import {
  KMEANS_CACHE_MAX,
  KMEANS_SAMPLE_PX,
  WORKER_ID_MAXLEN,
  LOAD_TIMEOUT_MS,
  COLOR_SCIENCE,
} from './constants.js'
import { drawContainToCanvas } from './resizeImage.js'

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
    let outCanvas;
    if (pixelSize > 1 && scaledWidth > 0 && scaledHeight > 0) {
      outCanvas = await processPixelatePath({ src, width, height, scaledWidth, scaledHeight, filterString, autoPalette, palette, paletteSize, dither, colorDistance }, signal)
    } else {
      outCanvas = await processDirectPath({ src, width, height, filterString, autoPalette, palette, paletteSize, dither, colorDistance }, signal)
    }
    imageProcessor.setLast(outCanvas);
    return outCanvas.toDataURL();
  } catch (error) {
    if (import.meta?.env?.DEV) console.error('Pixel art processing error:', error);
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
  return canvas
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
async function getKMeansPalette(sourceCanvas, k, signal) {
  const sampleSize = KMEANS_SAMPLE_PX; // downsample to ~64px on the longest edge
  const ratio = Math.max(sourceCanvas.width, sourceCanvas.height) / sampleSize;
  const w = Math.max(1, Math.round(sourceCanvas.width / ratio));
  const h = Math.max(1, Math.round(sourceCanvas.height / ratio));
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(sourceCanvas, 0, 0, w, h);
  const img = ctx.getImageData(0, 0, w, h);

  // build a simple cache key from a slice of data + dims + k
  const view = img.data;
  let hash = `${w}x${h}|k=${k}|`;
  // use first 4096 bytes to hash to keep cost small
  const step = Math.max(1, Math.floor(view.length / 4096));
  for (let i = 0; i < view.length; i += step) {
    hash += view[i] + ',';
  }
  const cached = kmeansCacheGet(hash);
  if (cached) return cached;

  const worker = ensureKMeansWorker();
  const id = Math.random().toString(36).slice(2);
  const promise = new Promise((resolve, reject) => {
    KMEANS_HANDLERS.set(id, {
      resolve: (res) => {
        // cache successful result
        try { kmeansCacheSet(hash, res); } catch { /* ignore */ }
        if (signal) try { signal.removeEventListener('abort', onAbort); } catch { /* ignore */ }
        resolve(res);
      },
      reject: (err) => {
        if (signal) try { signal.removeEventListener('abort', onAbort); } catch { /* ignore */ }
        reject(err);
      }
    });
    const onAbort = () => {
      // 仅移除处理器，结果到达时丢弃；避免销毁全局 worker
      KMEANS_HANDLERS.delete(id);
      try { KMEANS_WORKER?.postMessage({ type: 'cancel', id }); } catch { /* ignore */ }
      reject(new DOMException('Aborted', 'AbortError'));
    };
    if (signal) {
      if (signal.aborted) {
        onAbort();
        return;
      }
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });
  // transfer the buffer to avoid copy
  worker.postMessage({ type: 'run', id, data: img.data.buffer, width: w, height: h, k }, [img.data.buffer]);
  return promise;
}

function clampToInt(v, min, max) {
  const n = Math.round(Number(v) || 0);
  return Math.max(min, Math.min(max, n));
}

function hexToRgb(hex) {
  const h = hex.replace('#', '').trim();
  const bigint = parseInt(h, 16);
  if (h.length === 3) {
    // #abc → #aabbcc
    const r = parseInt(h[0] + h[0], 16);
    const g = parseInt(h[1] + h[1], 16);
    const b = parseInt(h[2] + h[2], 16);
    return [r, g, b];
  }
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function nearestColorIndex(r, g, b, palette, useLab = false, paletteLab = null) {
  let best = 0;
  let bestDist = Infinity;
  let L,a,bb;
  if (useLab) {
    [L,a,bb] = rgbToLab(r,g,b);
  }
  for (let i = 0; i < palette.length; i++) {
    let dist;
    if (!useLab) {
      const pr = palette[i][0];
      const pg = palette[i][1];
      const pb = palette[i][2];
      const dr = r - pr;
      const dg = g - pg;
      const db = b - pb;
      dist = dr * dr + dg * dg + db * db;
    } else {
      const [l2, a2, b2] = paletteLab ? paletteLab[i] : rgbToLab(palette[i][0], palette[i][1], palette[i][2]);
      const dl = L - l2;
      const da = a - a2;
      const dbb = bb - b2;
      dist = dl*dl + da*da + dbb*dbb;
    }
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
}

function applyPaletteToCanvas(canvas, palette, useLab = false, paletteLab = null) {
  const ctx = canvas.getContext('2d');
  applyPaletteToCtx(ctx, canvas.width, canvas.height, palette, useLab, paletteLab);
}

function applyPaletteToCtx(ctx, width, height, palette, useLab = false, paletteLab = null) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (a === 0) continue;
    const idx = nearestColorIndex(r, g, b, palette, useLab, paletteLab);
    const [pr, pg, pb] = palette[idx];
    data[i] = pr;
    data[i + 1] = pg;
    data[i + 2] = pb;
  }
  ctx.putImageData(imageData, 0, 0);
}

// Floyd–Steinberg dithering with fixed palette
function applyPaletteToCanvasDither(canvas, palette, useLab = false, paletteLab = null) {
  const ctx = canvas.getContext('2d');
  applyPaletteToCtxDither(ctx, canvas.width, canvas.height, palette, useLab, paletteLab);
}

function applyPaletteToCtxDither(ctx, width, height, palette, useLab = false, paletteLab = null) {
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

      // Inline error diffusion (avoid function call/idx recompute)
      if (x < width - 1) {
        const j = i + 4
        data[j]     = clamp255(data[j]     + er * F7)
        data[j + 1] = clamp255(data[j + 1] + eg * F7)
        data[j + 2] = clamp255(data[j + 2] + eb * F7)
      }
      if (y < height - 1) {
        const dj = i + width4
        // Down
        data[dj]     = clamp255(data[dj]     + er * F5)
        data[dj + 1] = clamp255(data[dj + 1] + eg * F5)
        data[dj + 2] = clamp255(data[dj + 2] + eb * F5)
        // Down-left
        if (x > 0) {
          const dlj = dj - 4
          data[dlj]     = clamp255(data[dlj]     + er * F3)
          data[dlj + 1] = clamp255(data[dlj + 1] + eg * F3)
          data[dlj + 2] = clamp255(data[dlj + 2] + eb * F3)
        }
        // Down-right
        if (x < width - 1) {
          const drj = dj + 4
          data[drj]     = clamp255(data[drj]     + er * F1)
          data[drj + 1] = clamp255(data[drj + 1] + eg * F1)
          data[drj + 2] = clamp255(data[drj + 2] + eb * F1)
        }
      }
    }
  }
  ctx.putImageData(imageData, 0, 0)
}

function clamp255(v) {
  return Math.max(0, Math.min(255, Math.round(v)));
}

// ---- Color space helpers (sRGB D65 -> CIE Lab) ----
function rgbToLab(r, g, b) {
  const R = srgbToLinear(r);
  const G = srgbToLinear(g);
  const B = srgbToLinear(b);
  const X = R * 0.4124 + G * 0.3576 + B * 0.1805;
  const Y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  const Z = R * 0.0193 + G * 0.1192 + B * 0.9505;
  const fx = labF(X / COLOR_SCIENCE.XN);
  const fy = labF(Y / COLOR_SCIENCE.YN);
  const fz = labF(Z / COLOR_SCIENCE.ZN);
  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const bb = 200 * (fy - fz);
  return [L, a, bb];
}

// 为可测试的纯函数提供命名导出（不破坏既有 API）
export { hexToRgb, clamp255, rgbToLab }

function srgbToLinear(u8) {
  const c = (u8 / 255);
  return c <= COLOR_SCIENCE.SRGB_THRESHOLD
    ? c / COLOR_SCIENCE.SRGB_SLOPE
    : Math.pow((c + COLOR_SCIENCE.SRGB_OFFSET) / 1.055, COLOR_SCIENCE.SRGB_GAMMA);
}

function labF(t) {
  const e = COLOR_SCIENCE.LAB_EPSILON;
  const k = COLOR_SCIENCE.LAB_KAPPA;
  return t > e ? Math.cbrt(t) : (k * t + 16) / 116;
}

// -------- Export helpers --------
function mimeFromFormat(fmt) {
  return fmt === 'png' ? 'image/png' : fmt === 'jpeg' ? 'image/jpeg' : 'image/webp'
}

export async function exportProcessedBlob(processedDataUrl, { format = 'png', scale = 1, quality = 0.92, transparentBG = true } = {}) {
  const source = imageProcessor.getLast();
  let srcW, srcH;
  if (source && source.width && source.height) {
    srcW = source.width; srcH = source.height;
  }

  const out = document.createElement('canvas');
  const ctx = out.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  async function toBlobAsync(canvas, mime, q) {
    return new Promise((resolve) => canvas.toBlob((b) => resolve(b), mime, q))
  }

  const mime = mimeFromFormat(format);

  if (srcW && srcH) {
    out.width = Math.max(1, Math.round(srcW * scale));
    out.height = Math.max(1, Math.round(srcH * scale));
    if (mime !== 'image/png' || !transparentBG) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, out.width, out.height);
    }
    ctx.drawImage(source, 0, 0, out.width, out.height);
    return await toBlobAsync(out, mime, format === 'png' ? undefined : quality);
  }

  // Fallback: decode from data URL if cache is missing
  const img = await loadImage(processedDataUrl);
  out.width = Math.max(1, Math.round(img.naturalWidth * scale || img.width * scale));
  out.height = Math.max(1, Math.round(img.naturalHeight * scale || img.height * scale));
  if (mime !== 'image/png' || !transparentBG) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, out.width, out.height);
  }
  ctx.drawImage(img, 0, 0, out.width, out.height);
  return await toBlobAsync(out, mime, format === 'png' ? undefined : quality);
}
