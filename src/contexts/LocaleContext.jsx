import { createContext, useContext } from 'react'
import { CANONICAL_LOCALE } from '@/i18n'

const LocaleContext = createContext({
  currentLocale: CANONICAL_LOCALE,
  buildPath: (path) => path ?? '/',
})

export function useLocaleContext() {
  return useContext(LocaleContext)
}

export const LocaleProvider = LocaleContext.Provider
