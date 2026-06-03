import { useState, useCallback } from 'react'

interface Filters {
  search: string
  page: number
  limit: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

const defaults: Filters = {
  search: '',
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
}

export function useFilters(initial?: Partial<Filters>) {
  const [filters, setFiltersState] = useState<Filters>({ ...defaults, ...initial })

  const setFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFiltersState((prev) => ({ ...prev, [key]: value, ...(key !== 'sortBy' && key !== 'sortOrder' ? { page: 1 } : {}) }))
  }, [])

  const resetFilters = useCallback(() => {
    setFiltersState(defaults)
  }, [])

  return { filters, setFilter, resetFilters }
}
