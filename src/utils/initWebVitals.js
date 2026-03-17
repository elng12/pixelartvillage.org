import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals/attribution'

let hasInitialized = false

function generateMetricTarget(node) {
  if (!(node instanceof Element)) return null
  if (node.id) return `#${node.id}`
  if (node instanceof HTMLElement && node.dataset?.testid) {
    return `[data-testid="${node.dataset.testid}"]`
  }
  if (node instanceof HTMLElement && node.dataset?.track) {
    return `[data-track="${node.dataset.track}"]`
  }

  const tagName = node.tagName?.toLowerCase()
  if (!tagName) return null

  const ariaLabel = node.getAttribute('aria-label')
  if (ariaLabel) {
    return `${tagName}[aria-label="${ariaLabel.slice(0, 48)}"]`
  }

  return tagName
}

function buildReporter(report) {
  return (metric) => {
    try {
      report(metric)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.debug('[web-vitals] report failed:', error?.message)
      }
    }
  }
}

export function initWebVitals(report = () => {}) {
  if (hasInitialized) return
  hasInitialized = true

  try {
    const reportMetric = buildReporter(report)
    const options = { generateTarget: generateMetricTarget }

    onCLS(reportMetric, options)
    onINP(reportMetric, options)
    onLCP(reportMetric, options)
    onFCP(reportMetric, options)
    onTTFB(reportMetric, options)
  } catch (error) {
    if (import.meta.env.DEV) {
      console.debug('[web-vitals] init disabled:', error?.message)
    }
  }
}
