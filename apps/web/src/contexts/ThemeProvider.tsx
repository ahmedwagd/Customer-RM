import { createContext, useEffect, useState, type ReactNode } from 'react'

export type Theme = 'luminous-enterprise' | 'neutral-modernist'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'luminous-enterprise',
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'luminous-enterprise'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('theme-neutral', theme === 'neutral-modernist')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'luminous-enterprise' ? 'neutral-modernist' : 'luminous-enterprise')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeContext }