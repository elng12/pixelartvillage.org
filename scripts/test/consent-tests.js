import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import {
  CONSENT_STORAGE_KEY,
  createConsentUpdate,
  hasConsentManager,
  parseConsentChoice,
  pushConsentChoice,
  readConsentChoice,
  saveConsentChoice,
} from '../../src/utils/consent.js'
import safeStorage from '../../src/utils/safeStorage.js'
import { cancelAdSenseLoad, scheduleAdSenseLoad } from '../../src/utils/loadAdSense.js'

function memoryStorage() {
  const values = new Map()
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  }
}

// Browser globals and storage are isolated mocks; real UI acceptance is separate.
function withBrowserMocks(run) {
  const keys = ['window', 'document', 'localStorage', 'sessionStorage', 'setTimeout', 'clearTimeout']
  const descriptors = new Map(keys.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]))
  const localAvailable = safeStorage.isLocalStorageAvailable
  const sessionAvailable = safeStorage.isSessionStorageAvailable
  const oldMemory = safeStorage.memoryStorage
  globalThis.window = new EventTarget()
  globalThis.window.dataLayer = []
  globalThis.localStorage = memoryStorage()
  globalThis.sessionStorage = memoryStorage()
  safeStorage.isLocalStorageAvailable = true
  safeStorage.isSessionStorageAvailable = true
  safeStorage.memoryStorage = new Map()
  try {
    run()
  } finally {
    cancelAdSenseLoad()
    safeStorage.isLocalStorageAvailable = localAvailable
    safeStorage.isSessionStorageAvailable = sessionAvailable
    safeStorage.memoryStorage = oldMemory
    for (const [key, descriptor] of descriptors) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor)
      else delete globalThis[key]
    }
  }
}

export function registerConsentTests(test) {
  test('consent preserves legacy accept and reject without rewriting storage', () => withBrowserMocks(() => {
    for (const granted of [true, false]) {
      const raw = JSON.stringify({ granted, ts: 123 })
      localStorage.setItem(CONSENT_STORAGE_KEY, raw)
      assert.deepEqual(readConsentChoice(), { analytics: granted, advertising: granted })
      assert.equal(localStorage.getItem(CONSENT_STORAGE_KEY), raw)
    }
  }))

  test('consent rejects corrupt, incomplete, non-boolean and unknown-version records', () => {
    for (const value of [null, '', '{', 'null', 'true', '[]', '{}', '{"granted":"true"}',
      '{"version":2,"analytics":true}', '{"analytics":true,"advertising":false}',
      '{"version":3,"analytics":true,"advertising":true,"granted":true}',
      '{"version":2,"analytics":1,"advertising":false,"granted":true}']) {
      assert.equal(parseConsentChoice(value), null, String(value))
    }
    assert.throws(() => createConsentUpdate({ analytics: true }), TypeError)
    assert.throws(() => saveConsentChoice({ analytics: 'true', advertising: false }), TypeError)
  })

  for (const analytics of [false, true]) {
    for (const advertising of [false, true]) {
      test(`consent independently maps and persists analytics=${analytics}, advertising=${advertising}`, () => withBrowserMocks(() => {
        const choice = { analytics, advertising }
        const expected = {
          analytics_storage: analytics ? 'granted' : 'denied',
          ad_storage: advertising ? 'granted' : 'denied',
          ad_user_data: advertising ? 'granted' : 'denied',
          ad_personalization: advertising ? 'granted' : 'denied',
        }
        assert.deepEqual(createConsentUpdate(choice), expected)
        assert.equal(pushConsentChoice(choice), true)
        assert.deepEqual(Array.from(window.dataLayer[0]), ['consent', 'update', expected])
        assert.equal(saveConsentChoice(choice), true)
        assert.deepEqual(readConsentChoice(), choice)
        const stored = JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY))
        assert.equal(stored.version, 2)
        assert.equal(stored.granted, analytics && advertising)
        assert.ok(Number.isFinite(stored.ts))
      }))
    }
  }

  test('consent uses session storage when local storage is unavailable and reports memory-only storage', () => withBrowserMocks(() => {
    safeStorage.isLocalStorageAvailable = false
    const choice = { analytics: true, advertising: false }
    assert.equal(saveConsentChoice(choice), true)
    assert.equal(localStorage.getItem(CONSENT_STORAGE_KEY), null)
    assert.deepEqual(JSON.parse(sessionStorage.getItem(CONSENT_STORAGE_KEY)).analytics, true)
    assert.deepEqual(readConsentChoice(), choice)
    safeStorage.isSessionStorageAvailable = false
    assert.equal(saveConsentChoice({ analytics: false, advertising: false }), false)
    assert.deepEqual(readConsentChoice(), { analytics: false, advertising: false })
  }))

  test('consent never pushes its own update when a CMP is present', () => withBrowserMocks(() => {
    for (const key of ['__tcfapi', '__gpp', '__cmp']) {
      window[key] = () => {}
      assert.equal(hasConsentManager(), true)
      assert.equal(pushConsentChoice({ analytics: true, advertising: true }), false)
      assert.equal(window.dataLayer.length, 0)
      delete window[key]
    }
    assert.equal(hasConsentManager(), false)
  }))

  test('revoking advertising cancels pending timers and interaction listeners; reallow can load once', () => withBrowserMocks(() => {
    const timers = new Map()
    let nextTimer = 0
    globalThis.setTimeout = (callback) => { timers.set(++nextTimer, callback); return nextTimer }
    globalThis.clearTimeout = (id) => timers.delete(id)
    const elements = []
    globalThis.document = {
      readyState: 'loading',
      querySelector: () => null,
      createElement: (tag) => ({ tag, addEventListener: () => {} }),
      head: { appendChild: (element) => elements.push(element) },
    }
    scheduleAdSenseLoad()
    assert.equal(window.__adsenseLoadScheduled, true)
    cancelAdSenseLoad()
    document.readyState = 'complete'
    window.dispatchEvent(new Event('load'))
    window.dispatchEvent(new Event('pointerdown'))
    assert.equal(timers.size, 0)
    assert.equal(window.__adsenseLoadScheduled, false)
    scheduleAdSenseLoad()
    window.dispatchEvent(new Event('pointerdown'))
    assert.equal(timers.size, 2)
    cancelAdSenseLoad()
    assert.equal(timers.size, 0)
    assert.equal(elements.filter((element) => element.tag === 'script').length, 0)
    scheduleAdSenseLoad()
    assert.equal(timers.size, 1)
    const callback = [...timers.values()][0]
    callback()
    callback()
    assert.equal(elements.filter((element) => element.tag === 'script').length, 1)
    assert.equal(timers.size, 0)
  }))

  test('every locale has complete cookie settings labels and descriptions', () => {
    const keys = ['desc', 'customize', 'settings', 'preferencesDesc', 'analytics', 'analyticsDesc',
      'advertising', 'advertisingDesc', 'save', 'cancel', 'close', 'storageWarning', 'managerUnavailable', 'saveError']
    for (const locale of fs.readdirSync('public/locales')) {
      const file = path.join('public/locales', locale, 'translation.json')
      if (!fs.existsSync(file)) continue
      const content = JSON.parse(fs.readFileSync(file, 'utf8'))
      for (const key of keys) assert.ok(content.consent?.[key]?.trim(), `${locale}: consent.${key}`)
      if (locale === 'es') assert.equal(content.home.consentDescription, content.consent.desc)
    }
    assert.deepEqual(
      JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8')).consent,
      JSON.parse(fs.readFileSync('public/locales/en/translation.json', 'utf8')).consent,
    )
  })
}
