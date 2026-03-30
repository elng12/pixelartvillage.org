const BLOG_POST_META = {
  'best-pixel-art-converters-compared-2025': {
    badge: 'Comparison',
    chipClass: 'border-amber-200 bg-amber-50 text-amber-800',
    bestFor: 'Choose the right converter before you invest time in one workflow.',
  },
  'how-to-pixelate-an-image': {
    badge: 'Beginner',
    chipClass: 'border-sky-200 bg-sky-50 text-sky-800',
    bestFor: 'Start with a clean first workflow: size first, palette second, cleanup third.',
  },
  'how-to-get-pixel-art-version-of-image': {
    badge: 'SNES-style',
    chipClass: 'border-cyan-200 bg-cyan-50 text-cyan-800',
    bestFor: 'Turn photos into retro-looking scenes by simplifying shapes and tightening the palette early.',
  },
  'make-image-more-like-pixel': {
    badge: 'Cleanup',
    chipClass: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    bestFor: 'Fix blurry edges, muddy colors, and noisy dithering after the first conversion.',
  },
  'export-from-illustrator-image-to-pixel-art': {
    badge: 'Illustrator',
    chipClass: 'border-rose-200 bg-rose-50 text-rose-800',
    bestFor: 'Export cleaner source art first so your later conversion stays sharp.',
  },
}

const DEFAULT_PRESENTATION = {
  badge: 'Guide',
  chipClass: 'border-slate-200 bg-slate-50 text-slate-700',
  bestFor: 'A focused walkthrough for turning images into cleaner pixel art.',
}

const BLOG_COVER_IMAGES = {
  before: '/showcase-before-w640.jpg',
  after: '/showcase-after-w640.jpg',
}

function countWords(text = '') {
  return String(text)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length
}

export function estimateBlogReadTime(post = {}) {
  const bodyWords = Array.isArray(post.body)
    ? post.body.reduce((total, line) => total + countWords(line), 0)
    : 0
  const excerptWords = countWords(post.excerpt)
  const minutes = Math.max(3, Math.ceil((bodyWords + excerptWords) / 210))
  return `${minutes} min read`
}

export function getBlogPresentationMeta(post = {}) {
  return {
    ...DEFAULT_PRESENTATION,
    ...(BLOG_POST_META[post.slug] || {}),
  }
}

export function getBlogCoverImages() {
  return BLOG_COVER_IMAGES
}
