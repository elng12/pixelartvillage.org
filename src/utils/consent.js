import safeStorage from './safeStorage.js'
import logger from './logger.js'

export const CONSENT_STORAGE_KEY = 'consent.choice.v1'
export const OPEN_CONSENT_SETTINGS_EVENT = 'pv:open-cookie-settings'

export function hasConsentManager() {
  if (typeof window === 'undefined') return false
  return ['__tcfapi', '__gpp', '__cmp'].some((key) => typeof window[key] === 'function')
}

export function parseConsentChoice(raw) {
  if (!raw) return null
  try {
    const choice = JSON.parse(raw)
    if (!choice || typeof choice !== 'object' || Array.isArray(choice)) return null
    if ('analytics' in choice || 'advertising' in choice || 'version' in choice) {
      if (choice.version !== 2 || typeof choice.analytics !== 'boolean' || typeof choice.advertising !== 'boolean') return null
      return { analytics: choice.analytics, advertising: choice.advertising }
    }
    if (typeof choice.granted !== 'boolean') return null
    return { analytics: choice.granted, advertising: choice.granted }
  } catch {
    return null
  }
}

export function readConsentChoice() {
  const raw = safeStorage.get(CONSENT_STORAGE_KEY)
  const choice = parseConsentChoice(raw)
  if (raw && !choice) logger.warn('[consent] Invalid saved preferences; consent remains denied.')
  return choice
}

export function createConsentUpdate(choice) {
  if (typeof choice?.analytics !== 'boolean' || typeof choice?.advertising !== 'boolean') {
    throw new TypeError('Consent preferences must contain boolean analytics and advertising values.')
  }
  const ads = choice.advertising ? 'granted' : 'denied'
  return {
    analytics_storage: choice.analytics ? 'granted' : 'denied',
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
  }
}

export function saveConsentChoice(choice) {
  createConsentUpdate(choice)
  return safeStorage.set(CONSENT_STORAGE_KEY, JSON.stringify({
    version: 2,
    analytics: choice.analytics,
    advertising: choice.advertising,
    // Old clients must not interpret a partial choice as permission for everything.
    granted: choice.analytics && choice.advertising,
    ts: Date.now(),
  }))
}

export function pushConsentChoice(choice) {
  if (hasConsentManager()) return false
  const update = createConsentUpdate(choice)
  window.dataLayer = window.dataLayer || []
  const gtag = window.gtag || function () { window.dataLayer.push(arguments) }
  gtag('consent', 'update', update)
  return true
}

export function openConsentSettings() {
  window.dispatchEvent(new CustomEvent(OPEN_CONSENT_SETTINGS_EVENT))
}
