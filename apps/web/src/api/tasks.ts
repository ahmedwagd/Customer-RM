import { apiRequest } from './client'
import type { Task, PaginatedResult, PaginationParams } from './types'

export interface QueryTasksDto extends PaginationParams {
  completed?: boolean
  userId?: string
  contactId?: string
  dealId?: string
  dueDate?: string
}

export interface CreateTaskDto {
  title: string
  description?: string
  dueDate?: string
  completed?: boolean
  contactId?: string
  dealId?: string
}

export type UpdateTaskDto = Partial<CreateTaskDto>

export function listTasks(params?: QueryTasksDto): Promise<PaginatedResult<Task>> {
  const searchParams = new URLSearchParams()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value))
      }
    }
  }
  const qs = searchParams.toString()
  return apiRequest(`/api/tasks${qs ? `?${qs}` : ''}`)
}

export function getTask(id: string): Promise<Task> {
  return apiRequest(`/api/tasks/${id}`)
}

export function createTask(dto: CreateTaskDto): Promise<Task> {
  return apiRequest('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function updateTask(id: string, dto: UpdateTaskDto): Promise<Task> {
  return apiRequest(`/api/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function deleteTask(id: string): Promise<void> {
  return apiRequest(`/api/tasks/${id}`, { method: 'DELETE' })
}
