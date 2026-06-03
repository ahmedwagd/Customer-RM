import { apiRequest } from './client'
import type { User, PaginatedResult, PaginationParams, UserRole } from './types'

export interface QueryUsersDto extends PaginationParams {
  role?: UserRole
  search?: string
}

export interface UpdateUserDto {
  name?: string
  email?: string
  avatarUrl?: string
  role?: UserRole
}

export interface UpdateProfileDto {
  name?: string
  email?: string
  avatarUrl?: string | null
}

export function listUsers(params?: QueryUsersDto): Promise<PaginatedResult<User>> {
  const searchParams = new URLSearchParams()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value))
      }
    }
  }
  const qs = searchParams.toString()
  return apiRequest(`/users${qs ? `?${qs}` : ''}`)
}

export function getUser(id: string, signal?: AbortSignal): Promise<User> {
  return apiRequest(`/users/${id}`, { signal })
}

export function getMyProfile(): Promise<User & { _count: { contacts: number; deals: number; tasks: number } }> {
  return apiRequest('/users/me')
}

export function updateMyProfile(dto: UpdateProfileDto): Promise<User> {
  return apiRequest('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function updateUser(id: string, dto: UpdateUserDto): Promise<User> {
  return apiRequest(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function deleteUser(id: string): Promise<void> {
  return apiRequest(`/users/${id}`, { method: 'DELETE' })
}
