import { createContext } from 'react'

export const LocaleContext = createContext(null)

export function LocaleProvider({ value, children }) {
  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}
