import { LocaleContext } from './LocaleContextBase'

export function LocaleProvider({ value, children }) {
  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}
