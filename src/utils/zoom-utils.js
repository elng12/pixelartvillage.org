export const MIN_ZOOM = 0.05
export const MAX_ZOOM = 8
export const ZOOM_STEP = 0.05

function toFiniteNumber(value, fallback = 1) {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric : fallback
}

export function clampZoom(value) {
  const numeric = toFiniteNumber(value)
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, numeric))
}

export function snapZoom(value, mode = 'nearest') {
  const clamped = clampZoom(value)
  const steps = mode === 'down'
    ? Math.floor(clamped / ZOOM_STEP)
    : Math.round(clamped / ZOOM_STEP)
  const normalizedSteps = Math.max(1, steps)
  return Number((normalizedSteps * ZOOM_STEP).toFixed(2))
}

export function formatZoomLabel(value) {
  const normalized = snapZoom(value)
  return normalized.toFixed(2).replace(/\.?0+$/, '')
}
