import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import LocalizedLink from '@/components/LocalizedLink'
import {
  hasConsentManager,
  OPEN_CONSENT_SETTINGS_EVENT,
  pushConsentChoice,
  readConsentChoice,
  saveConsentChoice,
} from '@/utils/consent.js'
import logger from '@/utils/logger.js'

const AD_CENTER_URL = 'https://adssettings.google.com/'
const EMPTY_CHOICE = { analytics: false, advertising: false }
const SECONDARY_BUTTON = 'rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

export default function ConsentBanner({ description, adsSettingsLabel }) {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [choice, setChoice] = useState(EMPTY_CHOICE)
  const [notice, setNotice] = useState(null)
  const dialogRef = useRef(null)
  const returnFocusRef = useRef(null)

  useEffect(() => {
    if (String(import.meta.env.VITE_E2E) === '1') return

    const delegateToManager = () => {
      setVisible(false)
      setPreferencesOpen(false)
      try {
        if (typeof window.googlefc?.showRevocationMessage !== 'function') {
          setNotice('managerUnavailable')
          return
        }
        window.googlefc.showRevocationMessage()
      } catch (error) {
        logger.warn('[consent] Could not open the consent manager:', error.message)
        setNotice('managerUnavailable')
      }
    }

    const openPreferences = () => {
      setNotice(null)
      if (hasConsentManager()) {
        delegateToManager()
        return
      }
      returnFocusRef.current = document.activeElement
      setChoice(readConsentChoice() || EMPTY_CHOICE)
      setPreferencesOpen(true)
    }

    if (!hasConsentManager()) setVisible(!readConsentChoice())
    window.addEventListener(OPEN_CONSENT_SETTINGS_EVENT, openPreferences)
    return () => window.removeEventListener(OPEN_CONSENT_SETTINGS_EVENT, openPreferences)
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (preferencesOpen && !dialog.open) dialog.showModal()
    if (!preferencesOpen && dialog.open) {
      dialog.close()
      if (returnFocusRef.current?.isConnected) returnFocusRef.current.focus()
    }
  }, [preferencesOpen])

  const openPreferences = () => {
    window.dispatchEvent(new CustomEvent(OPEN_CONSENT_SETTINGS_EVENT))
  }

  const commitChoice = (nextChoice) => {
    // A manager appearing after mount still owns consent; never overwrite it.
    if (hasConsentManager()) {
      openPreferences()
      return
    }
    try {
      if (!pushConsentChoice(nextChoice)) return
      const persisted = saveConsentChoice(nextChoice)
      setChoice(nextChoice)
      setVisible(false)
      setPreferencesOpen(false)
      setNotice(persisted ? null : 'storageWarning')
    } catch (error) {
      logger.warn('[consent] Could not apply cookie preferences:', error.message)
      setNotice('saveError')
    }
  }

  return (
    <>
      {visible && (
        <div role="region" aria-label={t('consent.bannerLabel')} data-testid="consent-banner"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="container mx-auto flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:px-4">
            <div className="min-w-0 text-xs text-gray-700 sm:text-sm">
              <p className="font-semibold text-gray-900">{t('consent.title')}</p>
              <p className="mt-1">
                {description || t('consent.desc')}{' '}
                <LocalizedLink to="/privacy" className="underline underline-offset-2">{t('consent.privacy')}</LocalizedLink>
                <span className="hidden sm:inline">{' '}{t('consent.andManage')}{' '}
                  <a className="underline underline-offset-2" href={AD_CENTER_URL} target="_blank" rel="noopener noreferrer nofollow">
                    {adsSettingsLabel || 'Google Ads Settings'}
                  </a>.
                </span>
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2 sm:ml-auto sm:max-w-sm">
              <button type="button" className={SECONDARY_BUTTON} onClick={openPreferences} data-testid="consent-customize">{t('consent.customize')}</button>
              <button type="button" className={SECONDARY_BUTTON} onClick={() => commitChoice(EMPTY_CHOICE)} aria-label={t('consent.rejectLabel')}>{t('consent.reject')}</button>
              <button type="button" className="rounded-md border border-blue-600 bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                onClick={() => commitChoice({ analytics: true, advertising: true })} aria-label={t('consent.acceptLabel')}>{t('consent.accept')}</button>
            </div>
          </div>
        </div>
      )}

      <dialog ref={dialogRef} aria-labelledby="cookie-preferences-title" data-testid="consent-preferences"
        onCancel={() => setPreferencesOpen(false)} onClose={() => setPreferencesOpen(false)}
        className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-md border border-gray-200 bg-white p-5 text-gray-900 shadow-lg backdrop:bg-black/40 sm:p-6">
        <h2 id="cookie-preferences-title" className="text-lg font-semibold">{t('consent.settings')}</h2>
        <p className="mt-2 text-sm text-gray-600">{t('consent.preferencesDesc')}</p>
        <fieldset className="mt-4 divide-y divide-gray-200">
          <legend className="sr-only">{t('consent.settings')}</legend>
          {['analytics', 'advertising'].map((category) => (
            <label key={category} className="flex cursor-pointer items-start gap-3 py-4">
              <input type="checkbox" checked={choice[category]} data-testid={'consent-' + category}
                onChange={(event) => setChoice((current) => ({ ...current, [category]: event.target.checked }))}
                className="mt-1 h-5 w-5 shrink-0 accent-blue-600" />
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{t('consent.' + category)}</span>
                <span className="mt-1 block text-sm text-gray-600">{t('consent.' + category + 'Desc')}</span>
              </span>
            </label>
          ))}
        </fieldset>
        {notice && <p role="alert" className="mt-3 text-sm text-red-700">{t('consent.' + notice)}</p>}
        <div className="mt-3 flex flex-wrap justify-end gap-2">
          <button type="button" className={SECONDARY_BUTTON} onClick={() => setPreferencesOpen(false)}>{t('consent.cancel')}</button>
          <button type="button" data-testid="consent-save" onClick={() => commitChoice(choice)}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">{t('consent.save')}</button>
        </div>
      </dialog>

      {notice && !preferencesOpen && (
        <div role="status" className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 border-t border-gray-200 bg-white p-4 text-sm text-gray-800">
          <p>{t('consent.' + notice)}</p>
          <button type="button" className={SECONDARY_BUTTON} onClick={() => setNotice(null)}>{t('consent.close')}</button>
        </div>
      )}
    </>
  )
}
