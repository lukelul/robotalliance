import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('ra-theme') || 'light')
  const [showConnections, setShowConnections] = useState(() => localStorage.getItem('ra-connections') === 'true')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ra-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')
  const toggleConnections = () => setShowConnections(v => {
    localStorage.setItem('ra-connections', String(!v))
    return !v
  })

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, showConnections, toggleConnections }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
