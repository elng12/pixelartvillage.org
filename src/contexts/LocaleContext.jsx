import { createContext } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export const LocaleContext = createContext(null)

export function LocaleProvider({ value, children }) {
  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}
