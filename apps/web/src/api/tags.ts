import { apiRequest } from './client'
import type { Tag } from './types'

export interface CreateTagDto {
  name: string
  color?: string
}

export type UpdateTagDto = Partial<CreateTagDto>

export function listTags(): Promise<Tag[]> {
  return apiRequest('/tags')
}

export function getTag(id: string): Promise<Tag> {
  return apiRequest(`/tags/${id}`)
}

export function createTag(dto: CreateTagDto): Promise<Tag> {
  return apiRequest('/tags', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function updateTag(id: string, dto: UpdateTagDto): Promise<Tag> {
  return apiRequest(`/tags/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function deleteTag(id: string): Promise<void> {
  return apiRequest(`/tags/${id}`, { method: 'DELETE' })
}

export function attachTagToContact(tagId: string, contactId: string): Promise<void> {
  return apiRequest(`/tags/${tagId}/contacts/${contactId}`, { method: 'POST' })
}

export function detachTagFromContact(tagId: string, contactId: string): Promise<void> {
  return apiRequest(`/tags/${tagId}/contacts/${contactId}`, { method: 'DELETE' })
}

export function attachTagToDeal(tagId: string, dealId: string): Promise<void> {
  return apiRequest(`/tags/${tagId}/deals/${dealId}`, { method: 'POST' })
}

export function detachTagFromDeal(tagId: string, dealId: string): Promise<void> {
  return apiRequest(`/tags/${tagId}/deals/${dealId}`, { method: 'DELETE' })
}

export function attachTagToCompany(tagId: string, companyId: string): Promise<void> {
  return apiRequest(`/tags/${tagId}/companies/${companyId}`, { method: 'POST' })
}

export function detachTagFromCompany(tagId: string, companyId: string): Promise<void> {
  return apiRequest(`/tags/${tagId}/companies/${companyId}`, { method: 'DELETE' })
}
