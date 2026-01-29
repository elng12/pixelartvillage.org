// Lightweight image resize helpers for preview/adaptation on the client.

export function loadImageFromUrl(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = url
  })
}

export async function loadImageFromFile(file) {
  const url = URL.createObjectURL(file)
  try {
    const img = await loadImageFromUrl(url)
    return { img, url }
  } catch (e) {
    URL.revokeObjectURL(url)
    throw e
  }
}

export function drawContainToCanvas(img, maxW, maxH, { pixelated = false } = {}) {
  const scale = Math.min(maxW / (img.naturalWidth || img.width), maxH / (img.naturalHeight || img.height), 1)
  const outW = Math.max(1, Math.floor((img.naturalWidth || img.width) * scale))
  const outH = Math.max(1, Math.floor((img.naturalHeight || img.height) * scale))
  const canvas = document.createElement('canvas')
  canvas.width = outW
  canvas.height = outH
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Canvas 2D context unavailable')
  }
  ctx.imageSmoothingEnabled = !pixelated
  ctx.drawImage(img, 0, 0, outW, outH)
  return canvas
}

function dataUrlToBlob(dataUrl) {
  const [header, data] = dataUrl.split(',')
  if (!header || !data) return null
  const isBase64 = header.includes(';base64')
  const mimeMatch = header.match(/data:([^;]+)/)
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream'
  if (!isBase64) {
    const text = decodeURIComponent(data)
    return new Blob([text], { type: mime })
  }
  const binary = atob(data)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i += 1) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

export async function downscaleFileToBlob(file, maxDim, { preferPng = false, quality = 0.92, pixelated = false } = {}) {
  const { img, url } = await loadImageFromFile(file)
  try {
    const canvas = drawContainToCanvas(img, maxDim, maxDim, { pixelated })
    const mime = preferPng || file.type === 'image/png' ? 'image/png' : 'image/jpeg'
    const qualityArg = mime === 'image/png' ? undefined : quality
    if (typeof canvas.toBlob !== 'function') {
      const fallbackUrl = canvas.toDataURL(mime, qualityArg)
      const fallbackBlob = dataUrlToBlob(fallbackUrl)
      if (!fallbackBlob) throw new Error('Failed to encode image')
      return fallbackBlob
    }
    const blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b), mime, qualityArg))
    if (blob) return blob
    const fallbackUrl = canvas.toDataURL(mime, qualityArg)
    const fallbackBlob = dataUrlToBlob(fallbackUrl)
    if (!fallbackBlob) throw new Error('Failed to encode image')
    return fallbackBlob
  } finally {
    URL.revokeObjectURL(url)
  }
}

