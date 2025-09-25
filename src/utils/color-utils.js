// Color utilities: clamp and RGB->Lab conversion (sRGB D65)
import { COLOR_SCIENCE } from './constants.js'

export function clamp255(v) {
  return Math.max(0, Math.min(255, Math.round(v)))
}

export function srgbToLinear(u8) {
  const c = (u8 / 255)
  return c <= COLOR_SCIENCE.SRGB_THRESHOLD
    ? c / COLOR_SCIENCE.SRGB_SLOPE
    : Math.pow((c + COLOR_SCIENCE.SRGB_OFFSET) / 1.055, COLOR_SCIENCE.SRGB_GAMMA)
}

export function labF(t) {
  const e = COLOR_SCIENCE.LAB_EPSILON
  const k = COLOR_SCIENCE.LAB_KAPPA
  return t > e ? Math.cbrt(t) : (k * t + 16) / 116
}

export function rgbToLab(r, g, b) {
  const R = srgbToLinear(r)
  const G = srgbToLinear(g)
  const B = srgbToLinear(b)
  const X = R * 0.4124 + G * 0.3576 + B * 0.1805
  const Y = R * 0.2126 + G * 0.7152 + B * 0.0722
  const Z = R * 0.0193 + G * 0.1192 + B * 0.9505
  const fx = labF(X / COLOR_SCIENCE.XN)
  const fy = labF(Y / COLOR_SCIENCE.YN)
  const fz = labF(Z / COLOR_SCIENCE.ZN)
  const L = 116 * fy - 16
  const a = 500 * (fx - fy)
  const bb = 200 * (fy - fz)
  return [L, a, bb]
}

