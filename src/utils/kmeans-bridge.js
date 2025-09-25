// KMeans worker bridge + LRU cache for sampled palette extraction
import { KMEANS_CACHE_MAX, KMEANS_SAMPLE_PX, WORKER_ID_MAXLEN } from './constants.js'
import { clamp255 } from './color-utils.js'

const KMEANS_CACHE = new Map() // key -> { value, tick }
let KMEANS_TICK = 0
let KMEANS_WORKER = null
const KMEANS_HANDLERS = new Map() // id -> { resolve, reject }

function kmeansCacheGet(key) {
  const hit = KMEANS_CACHE.get(key)
  if (hit) hit.tick = ++KMEANS_TICK
  return hit?.value || null
}
function kmeansCacheSet(key, value) {
  KMEANS_CACHE.set(key, { value, tick: ++KMEANS_TICK })
  if (KMEANS_CACHE.size > KMEANS_CACHE_MAX) {
    let oldestKey = null
    let oldestTick = Infinity
    for (const [k, v] of KMEANS_CACHE.entries()) {
      if (v.tick < oldestTick) { oldestTick = v.tick; oldestKey = k }
    }
    if (oldestKey) KMEANS_CACHE.delete(oldestKey)
  }
}

function ensureKMeansWorker() {
  if (KMEANS_WORKER) return KMEANS_WORKER
  const worker = new Worker(new URL('../workers/kmeansWorker.js', import.meta.url), { type: 'module' })
  const onMessage = (e) => {
    const d = e && e.data
    if (!d || typeof d !== 'object') return
    const id = d.id
    if (typeof id !== 'string' || id.length > WORKER_ID_MAXLEN) return
    const handler = KMEANS_HANDLERS.get(id)
    if (!handler) return
    KMEANS_HANDLERS.delete(id)
    if (typeof d.ok !== 'boolean') { handler.reject(new Error('Invalid worker response')); return }
    if (!d.ok) { handler.reject(new Error(d.error || 'KMeans worker failed')); return }
    const cents = d.centroids
    if (!Array.isArray(cents) || cents.length === 0) { handler.reject(new Error('Invalid centroids')); return }
    try {
      const result = cents.map((c) => {
        if (!Array.isArray(c)) return [0, 0, 0]
        return [clamp255(c[0]), clamp255(c[1]), clamp255(c[2])]
      })
      handler.resolve(result)
    } catch (err) {
      handler.reject(err)
    }
  }
  const onError = (err) => {
    for (const [, h] of KMEANS_HANDLERS) { try { h.reject(err) } catch { /* ignore */ void 0 } }
    KMEANS_HANDLERS.clear()
    try { worker.terminate() } catch { /* ignore */ void 0 }
    KMEANS_WORKER = null
  }
  worker.addEventListener('message', onMessage)
  worker.addEventListener('error', onError)
  KMEANS_WORKER = worker
  return worker
}

export async function getKMeansPalette(sourceCanvas, k, signal) {
  const sampleSize = KMEANS_SAMPLE_PX
  const ratio = Math.max(sourceCanvas.width, sourceCanvas.height) / sampleSize
  const w = Math.max(1, Math.round(sourceCanvas.width / ratio))
  const h = Math.max(1, Math.round(sourceCanvas.height / ratio))
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.drawImage(sourceCanvas, 0, 0, w, h)
  const img = ctx.getImageData(0, 0, w, h)

  let hash = `${w}x${h}|k=${k}|`
  const view = img.data
  const step = Math.max(1, Math.floor(view.length / 4096))
  for (let i = 0; i < view.length; i += step) { hash += view[i] + ',' }
  const cached = kmeansCacheGet(hash)
  if (cached) return cached

  const worker = ensureKMeansWorker()
  const id = Math.random().toString(36).slice(2)
  const promise = new Promise((resolve, reject) => {
    KMEANS_HANDLERS.set(id, {
      resolve: (res) => { try { kmeansCacheSet(hash, res) } catch { /* ignore */ void 0 } ; if (signal) try { signal.removeEventListener('abort', onAbort) } catch { /* ignore */ void 0 } ; resolve(res) },
      reject: (err) => { if (signal) try { signal.removeEventListener('abort', onAbort) } catch { /* ignore */ void 0 } ; reject(err) },
    })
    const onAbort = () => { KMEANS_HANDLERS.delete(id); try { KMEANS_WORKER?.postMessage({ type: 'cancel', id }) } catch { /* ignore */ void 0 } ; reject(new DOMException('Aborted', 'AbortError')) }
    if (signal) {
      if (signal.aborted) { onAbort(); return }
      signal.addEventListener('abort', onAbort, { once: true })
    }
  })
  worker.postMessage({ type: 'run', id, data: img.data.buffer, width: w, height: h, k }, [img.data.buffer])
  return promise
}
