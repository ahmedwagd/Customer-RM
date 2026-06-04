import { apiRequest } from './client'
import type { Contact, PaginatedResult, PaginationParams, ContactStatus } from './types'

export interface QueryContactsDto extends PaginationParams {
  status?: ContactStatus
  companyId?: string
  search?: string
}

export interface CreateContactDto {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  title?: string
  avatarUrl?: string
  description?: string
  status?: ContactStatus
  source?: string
  companyId?: string
}

export type UpdateContactDto = Partial<CreateContactDto>

export function listContacts(params?: QueryContactsDto): Promise<PaginatedResult<Contact>> {
  const searchParams = new URLSearchParams()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value))
      }
    }
  }
  const qs = searchParams.toString()
  return apiRequest(`/api/contacts${qs ? `?${qs}` : ''}`)
}

export function getContact(id: string): Promise<Contact> {
  return apiRequest(`/api/contacts/${id}`)
}

export function createContact(dto: CreateContactDto): Promise<Contact> {
  return apiRequest('/api/contacts', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function updateContact(id: string, dto: UpdateContactDto): Promise<Contact> {
  return apiRequest(`/api/contacts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function deleteContact(id: string): Promise<void> {
  return apiRequest(`/api/contacts/${id}`, { method: 'DELETE' })
}
