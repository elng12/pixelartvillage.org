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

function kmeansCacheGet(key) {
  const hit = KMEANS_CACHE.get(key);
  if (hit) hit.tick = ++KMEANS_TICK;
  return hit?.value || null;
}
function kmeansCacheSet(key, value) {
  KMEANS_CACHE.set(key, { value, tick: ++KMEANS_TICK });
  if (KMEANS_CACHE.size > 20) {
    // evict least-recently used
    let oldestKey = null;
    let oldestTick = Infinity;
    for (const [k, v] of KMEANS_CACHE.entries()) {
      if (v.tick < oldestTick) { oldestTick = v.tick; oldestKey = k; }
    }
    if (oldestKey) KMEANS_CACHE.delete(oldestKey);
  }
}

// Helper: load an image and resolve to the HTMLImageElement when ready
const loadImage = (imageData) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image.'));
    img.src = imageData;
  });
};

/**
 * Main processing function. All operations happen on a single canvas for efficiency.
 * @param {string} imageData - Image data URL.
 * @param {object} options - Processing options.
 * @returns {Promise<string>} - Result image as data URL.
 */
import { PALETTE_MAP, getCustomPaletteByName, inferAutoPaletteSize } from './constants';

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

    const img = await loadImage(imageData);
    const { width, height } = img;
    // 1) Build filter string (explicit 'none' to avoid stale state)
    const filterString = buildFilterString(brightness, contrast, saturation);

    // 2) Pixelation path
    // If pixel size is too big so scaled dimensions are <= 0, fall back to plain draw
    const scaledWidth = Math.floor(width / pixelSize);
    const scaledHeight = Math.floor(height / pixelSize);
    let outCanvas;
    if (pixelSize > 1 && scaledWidth > 0 && scaledHeight > 0) {
      outCanvas = await processPixelatePath({ img, width, height, scaledWidth, scaledHeight, filterString, autoPalette, palette, paletteSize, dither, colorDistance }, signal)
    } else {
      outCanvas = await processDirectPath({ img, width, height, filterString, autoPalette, palette, paletteSize, dither, colorDistance }, signal)
    }
    imageProcessor.setLast(outCanvas);
    return outCanvas.toDataURL();
  } catch (error) {
    if (import.meta?.env?.DEV) console.error('Pixel art processing error:', error);
    throw error;
  }
}

async function processPixelatePath({ img, width, height, scaledWidth, scaledHeight, filterString, autoPalette, palette, paletteSize, dither, colorDistance }, signal) {
  // Downscale to small canvas with filters, then quantize, then upscale without smoothing
  const tempCanvas = createCanvas(scaledWidth, scaledHeight)
  const tempCtx = tempCanvas.getContext('2d')
  tempCtx.filter = filterString
  tempCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight)

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

async function processDirectPath({ img, width, height, filterString, autoPalette, palette, paletteSize, dither, colorDistance }, signal) {
  // Draw full-res with filters, then quantize on main canvas
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')
  ctx.filter = filterString
  ctx.drawImage(img, 0, 0)

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
  const sampleSize = 64; // downsample to ~64px on the longest edge
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

  const worker = new Worker(new URL('../workers/kmeansWorker.js', import.meta.url), { type: 'module' });
  const id = Math.random().toString(36).slice(2);
  const promise = new Promise((resolve, reject) => {
    const onMessage = (e) => {
      const { ok, centroids } = e.data || {};
      worker.terminate();
      if (signal) signal.removeEventListener('abort', onAbort);
      if (!ok || !centroids) {
        reject(new Error('KMeans worker failed'));
        return;
      }
      const result = centroids.map((c) => [clamp255(c[0]), clamp255(c[1]), clamp255(c[2])]);
      kmeansCacheSet(hash, result);
      resolve(result);
    }
    const onError = (err) => {
      worker.terminate();
      if (signal) signal.removeEventListener('abort', onAbort);
      reject(err);
    }
    const onAbort = () => {
      worker.terminate();
      reject(new DOMException('Aborted', 'AbortError'));
    }
    worker.onmessage = onMessage;
    worker.onerror = onError;
    if (signal) {
      if (signal.aborted) {
        onAbort();
        return;
      }
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });
  // transfer the buffer to avoid copy
  worker.postMessage({ id, data: img.data.buffer, width: w, height: h, k }, [img.data.buffer]);
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
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const idx = (x, y) => (y * width + x) * 4;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = idx(x, y);
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (a === 0) continue;
      const ni = nearestColorIndex(r, g, b, palette, useLab, paletteLab);
      const nr = palette[ni][0];
      const ng = palette[ni][1];
      const nb = palette[ni][2];
      const er = r - nr;
      const eg = g - ng;
      const eb = b - nb;
      data[i] = nr; data[i + 1] = ng; data[i + 2] = nb;

      // distribute error
      // Right (x+1, y) 7/16
      distribute(x + 1, y, er, eg, eb, 7 / 16);
      // Down-left (x-1, y+1) 3/16
      distribute(x - 1, y + 1, er, eg, eb, 3 / 16);
      // Down (x, y+1) 5/16
      distribute(x, y + 1, er, eg, eb, 5 / 16);
      // Down-right (x+1, y+1) 1/16
      distribute(x + 1, y + 1, er, eg, eb, 1 / 16);
    }
  }
  ctx.putImageData(imageData, 0, 0);

  function distribute(x, y, er, eg, eb, factor) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const j = idx(x, y);
    data[j] = clamp255(data[j] + er * factor);
    data[j + 1] = clamp255(data[j + 1] + eg * factor);
    data[j + 2] = clamp255(data[j + 2] + eb * factor);
  }
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
  const Xn = 0.95047, Yn = 1.0, Zn = 1.08883;
  const fx = labF(X / Xn);
  const fy = labF(Y / Yn);
  const fz = labF(Z / Zn);
  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const bb = 200 * (fy - fz);
  return [L, a, bb];
}

function srgbToLinear(u8) {
  const c = (u8 / 255);
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function labF(t) {
  const e = 216 / 24389; // (6/29)^3
  const k = 24389 / 27;  // (29/3)^3
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
