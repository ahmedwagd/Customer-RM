import { apiRequest } from './client'
import type { Deal, PaginatedResult, PaginationParams, DealStage } from './types'

export interface QueryDealsDto extends PaginationParams {
  stage?: DealStage
  userId?: string
  contactId?: string
  companyId?: string
}

export interface CreateDealDto {
  title: string
  value?: number
  currency?: string
  stage?: DealStage
  closeDate?: string
  description?: string
  contactId?: string
  companyId?: string
}

export type UpdateDealDto = Partial<CreateDealDto>

export function listDeals(params?: QueryDealsDto): Promise<PaginatedResult<Deal>> {
  const searchParams = new URLSearchParams()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value))
      }
    }
  }
  const qs = searchParams.toString()
  return apiRequest(`/deals${qs ? `?${qs}` : ''}`)
}

export function getDeal(id: string): Promise<Deal> {
  return apiRequest(`/deals/${id}`)
}

export function createDeal(dto: CreateDealDto): Promise<Deal> {
  return apiRequest('/deals', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function updateDeal(id: string, dto: UpdateDealDto): Promise<Deal> {
  return apiRequest(`/deals/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function deleteDeal(id: string): Promise<void> {
  return apiRequest(`/deals/${id}`, { method: 'DELETE' })
}
