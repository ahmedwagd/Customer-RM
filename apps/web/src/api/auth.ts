import { apiRequest, setAccessToken } from './client'

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  name: string
  password: string
  avatarUrl?: string
}

interface AuthResponse {
  accessToken: string
}

export async function login(dto: LoginDto): Promise<string> {
  const data = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
  setAccessToken(data.accessToken)
  return data.accessToken
}

export async function register(dto: RegisterDto): Promise<string> {
  const data = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
  setAccessToken(data.accessToken)
  return data.accessToken
}

export async function logout(): Promise<void> {
  await apiRequest<void>('/auth/logout', { method: 'POST' })
  setAccessToken(null)
}
