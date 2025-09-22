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
  ctx.imageSmoothingEnabled = !pixelated
  ctx.drawImage(img, 0, 0, outW, outH)
  return canvas
}

export async function downscaleFileToBlob(file, maxDim, { preferPng = false, quality = 0.92, pixelated = false } = {}) {
  const { img, url } = await loadImageFromFile(file)
  try {
    const canvas = drawContainToCanvas(img, maxDim, maxDim, { pixelated })
    const mime = preferPng || file.type === 'image/png' ? 'image/png' : 'image/jpeg'
    const blob = await new Promise((resolve) => canvas.toBlob((b) => resolve(b), mime, mime === 'image/png' ? undefined : quality))
    return blob
  } finally {
    URL.revokeObjectURL(url)
  }
}

