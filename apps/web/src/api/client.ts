export class ApiError extends Error {
  status: number
  body: Record<string, unknown> | null

  constructor(status: number, body: Record<string, unknown> | null) {
    super(`API Error ${status}`)
    this.status = status
    this.body = body
  }
}

let _accessToken: string | null = null
let _refreshPromise: Promise<string | null> | null = null

export function setAccessToken(token: string | null) {
  _accessToken = token
}

export function getAccessToken(): string | null {
  return _accessToken
}

const API_BASE_URL = (() => {
  const url = import.meta.env.VITE_API_URL || '';
  if (!url) return '';
  return url.startsWith('http') ? url : `https://${url}`;
})();

async function attemptRefresh(): Promise<string | null> {
  if (_refreshPromise) return _refreshPromise

  _refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) {
        setAccessToken(null)
        return null
      }
      const data: { accessToken?: string } | null = await res.json()
      if (data?.accessToken) {
        setAccessToken(data.accessToken)
        return data.accessToken
      }
      setAccessToken(null)
      return null
    } catch {
      setAccessToken(null)
      return null
    } finally {
      _refreshPromise = null
    }
  })()

  return _refreshPromise
}

export async function tryRestoreSession(): Promise<string | null> {
  return attemptRefresh()
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (_accessToken) {
    headers['Authorization'] = `Bearer ${_accessToken}`
  }

  let res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string>) },
    credentials: 'include',
  })

  if (res.status === 401 && _accessToken) {
    const newToken = await attemptRefresh()
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`
      res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: { ...headers, ...(options.headers as Record<string, string>) },
        credentials: 'include',
      })
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new ApiError(res.status, body)
  }

  if (res.status === 204) return undefined as T

  return res.json()
}
