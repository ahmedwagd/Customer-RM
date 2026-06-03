import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { login as apiLogin, register as apiRegister, logout as apiLogout, tryRestoreSession, getUser as apiGetUser } from '../api'
import type { User } from '../api'
import { AuthContext } from './AuthContext'

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

async function fetchUserFromToken(token: string, signal?: AbortSignal): Promise<User> {
  const payload = decodeJwtPayload(token)
  if (!payload?.sub || typeof payload.sub !== 'string') {
    throw new Error('Invalid token: missing user identifier')
  }
  return apiGetUser(payload.sub, signal)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const abort = new AbortController()
    const init = async () => {
      const token = await tryRestoreSession()
      if (token) {
        try {
          const u = await fetchUserFromToken(token, abort.signal)
          setUser(u)
        } catch {
          // session restore failed — stay logged out
        }
      }
      setLoading(false)
    }
    init()
    return () => abort.abort()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const token = await apiLogin({ email, password })
    const u = await fetchUserFromToken(token)
    setUser(u)
  }, [])

  const register = useCallback(async (email: string, name: string, password: string) => {
    const token = await apiRegister({ email, name, password })
    const u = await fetchUserFromToken(token)
    setUser(u)
  }, [])

  const logout = useCallback(async () => {
    await apiLogout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
