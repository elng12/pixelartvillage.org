const QUEUE_LIMIT = 20
const CONSENT_EVENT_NAME = 'pv:analytics-consent'

const queuedMetrics = []
const seenMetricKeys = new Set()
let consentListenerAttached = false

function getMetricKey(metric) {
  return `${metric?.name || 'unknown'}:${metric?.id || 'no-id'}`
}

function roundMetricValue(metricName, value) {
  if (!Number.isFinite(value)) return undefined
  if (metricName === 'CLS') {
    return Number(value.toFixed(3))
  }
  return Math.round(value)
}

function buildEventValue(metricName, delta) {
  if (!Number.isFinite(delta)) return undefined
  if (metricName === 'CLS') {
    return Math.round(delta * 1000)
  }
  return Math.round(delta)
}

function normalizePathname(pathname) {
  const path = pathname || '/'
  return path.endsWith('/') ? path : `${path}/`
}

function getPageType(pathname) {
  const normalized = normalizePathname(pathname).replace(/^\/(?:[a-z]{2}|pseudo)(?=\/)/, '') || '/'
  if (normalized === '/') return 'home'
  if (normalized === '/blog/') return 'blog-index'
  if (normalized.startsWith('/blog/')) return 'blog-post'
  if (normalized.startsWith('/converter/')) return 'converter'
  if (normalized === '/privacy/') return 'privacy'
  if (normalized === '/terms/') return 'terms'
  if (normalized === '/about/') return 'about'
  if (normalized === '/contact/') return 'contact'
  return 'other'
}

function getDebugTarget(metric) {
  const attribution = metric?.attribution || {}
  if (metric?.name === 'CLS') return attribution.largestShiftTarget
  if (metric?.name === 'INP') return attribution.interactionTarget
  if (metric?.name === 'LCP') return attribution.element
  return undefined
}

function isAnalyticsReady() {
  return (
    typeof window !== 'undefined' &&
    window.__pvAnalyticsConsentGranted === true &&
    typeof window.gtag === 'function'
  )
}

function cleanParams(params) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )
}

function sendMetricToGa(metric) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/'
  const eventParams = cleanParams({
    event_category: 'Web Vitals',
    event_label: `${metric.name}:${metric.rating}`,
    value: buildEventValue(metric.name, metric.delta),
    metric_id: metric.id,
    metric_name: metric.name,
    metric_value: roundMetricValue(metric.name, metric.value),
    metric_delta: roundMetricValue(metric.name, metric.delta),
    metric_rating: metric.rating,
    metric_navigation_type: metric.navigationType,
    page_path: pathname,
    page_type: getPageType(pathname),
    locale: document.documentElement.lang || undefined,
    build_id: typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : undefined,
    build_date: typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : undefined,
    debug_target: getDebugTarget(metric),
    non_interaction: true,
    transport_type: 'beacon',
  })

  window.gtag('event', 'web_vital', eventParams)
}

function flushQueuedMetrics() {
  if (!isAnalyticsReady()) return
  while (queuedMetrics.length) {
    sendMetricToGa(queuedMetrics.shift())
  }
}

function ensureConsentListener() {
  if (consentListenerAttached || typeof window === 'undefined') return
  window.addEventListener(CONSENT_EVENT_NAME, (event) => {
    if (event?.detail?.granted) {
      flushQueuedMetrics()
    }
  })
  consentListenerAttached = true
}

export function createWebVitalsReporter({ debug = false } = {}) {
  ensureConsentListener()

  return (metric) => {
    if (!metric?.name) return

    const metricKey = getMetricKey(metric)
    if (seenMetricKeys.has(metricKey)) return
    seenMetricKeys.add(metricKey)

    if (debug) {
      console.debug('[web-vitals]', metric)
    }

    if (isAnalyticsReady()) {
      sendMetricToGa(metric)
      return
    }

    if (queuedMetrics.length >= QUEUE_LIMIT) {
      queuedMetrics.shift()
    }
    queuedMetrics.push(metric)
  }
}
