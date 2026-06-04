import { apiRequest } from './client'
import type { Activity, ActivityType } from './types'

export interface QueryActivitiesDto {
  type?: ActivityType
  contactId?: string
  dealId?: string
  companyId?: string
  startDate?: string
  endDate?: string
}

export interface CreateActivityDto {
  type: ActivityType
  subject: string
  details?: string
  occurredAt: string
  contactId?: string
  dealId?: string
  companyId?: string
}

export function listActivities(params?: QueryActivitiesDto): Promise<Activity[]> {
  const searchParams = new URLSearchParams()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value))
      }
    }
  }
  const qs = searchParams.toString()
  return apiRequest(`/api/activities${qs ? `?${qs}` : ''}`)
}

export function getActivity(id: string): Promise<Activity> {
  return apiRequest(`/api/activities/${id}`)
}

export function createActivity(dto: CreateActivityDto): Promise<Activity> {
  return apiRequest('/api/activities', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function deleteActivity(id: string): Promise<void> {
  return apiRequest(`/api/activities/${id}`, { method: 'DELETE' })
}
