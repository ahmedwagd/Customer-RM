import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import type { BreadcrumbItem } from '../components/ui/Breadcrumbs'
import { buildItems } from './breadcrumb-utils'

interface BreadcrumbContextValue {
  setDynamicLabel: (label: string | null) => void
  items: BreadcrumbItem[]
}

const BreadcrumbContext = createContext<BreadcrumbContextValue>({
  setDynamicLabel: () => {},
  items: [],
})

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [state, setState] = useState<{ pathKey: string; label: string | null }>({
    pathKey: location.key,
    label: null,
  })

  if (location.key !== state.pathKey) {
    setState({ pathKey: location.key, label: null })
  }

  const items = useMemo(
    () => buildItems(location.pathname, state.label),
    [location.pathname, state.label]
  )

  const setDynamicLabel = useCallback((label: string | null) => {
    setState((prev) => ({ ...prev, label }))
  }, [])

  return (
    <BreadcrumbContext.Provider value={{ setDynamicLabel, items }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBreadcrumb() {
  return useContext(BreadcrumbContext)
}

