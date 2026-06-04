import { apiRequest } from './client'
import type { Note } from './types'

export interface QueryNotesDto {
  contactId?: string
  dealId?: string
}

export interface CreateNoteDto {
  content: string
  contactId?: string
  dealId?: string
}

export type UpdateNoteDto = Partial<CreateNoteDto>

export function listNotes(params?: QueryNotesDto): Promise<Note[]> {
  const searchParams = new URLSearchParams()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value))
      }
    }
  }
  const qs = searchParams.toString()
  return apiRequest(`/api/notes${qs ? `?${qs}` : ''}`)
}

export function getNote(id: string): Promise<Note> {
  return apiRequest(`/api/notes/${id}`)
}

export function createNote(dto: CreateNoteDto): Promise<Note> {
  return apiRequest('/api/notes', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function updateNote(id: string, dto: UpdateNoteDto): Promise<Note> {
  return apiRequest(`/api/notes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function deleteNote(id: string): Promise<void> {
  return apiRequest(`/api/notes/${id}`, { method: 'DELETE' })
}
