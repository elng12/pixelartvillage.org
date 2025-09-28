// Processing-related constants (centralized to avoid magic numbers)

// K-Means palette extraction
export const KMEANS_CACHE_MAX = 20;       // LRU cache size for k-means results
export const KMEANS_SAMPLE_PX = 64;       // Downsample longest edge to ~64px for sampling
export const WORKER_ID_MAXLEN = 100;      // Max acceptable id length from worker messages

// Image loading
export const LOAD_TIMEOUT_MS = 10_000;    // 10s timeout for image loading/decoding

// Processing debounce window (ms) for useImageProcessor
export const PROCESS_DEBOUNCE_MS = 300;

// Color science constants (D65, sRGB)
export const COLOR_SCIENCE = {
  // D65 reference white (CIE XYZ)
  XN: 0.95047,
  YN: 1.00000,
  ZN: 1.08883,
  // Lab non-linear thresholds/constants
  LAB_EPSILON: 216 / 24389,   // (6/29)^3
  LAB_KAPPA: 24389 / 27,      // (29/3)^3
  // sRGB transfer function parameters
  SRGB_THRESHOLD: 0.04045,
  SRGB_SLOPE: 12.92,
  SRGB_OFFSET: 0.055,
  SRGB_GAMMA: 2.4,
}
