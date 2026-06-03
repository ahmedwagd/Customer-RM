import { apiRequest } from './client'
import type { Company, PaginatedResult, PaginationParams } from './types'

export interface QueryCompaniesDto extends PaginationParams {
  search?: string
}

export interface CreateCompanyDto {
  name: string
  domain?: string
  logoUrl?: string
  notes?: string
}

export type UpdateCompanyDto = Partial<CreateCompanyDto>

export function listCompanies(params?: QueryCompaniesDto): Promise<PaginatedResult<Company>> {
  const searchParams = new URLSearchParams()
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value))
      }
    }
  }
  const qs = searchParams.toString()
  return apiRequest(`/companies${qs ? `?${qs}` : ''}`)
}

export function getCompany(id: string): Promise<Company> {
  return apiRequest(`/companies/${id}`)
}

export function createCompany(dto: CreateCompanyDto): Promise<Company> {
  return apiRequest('/companies', {
    method: 'POST',
    body: JSON.stringify(dto),
  })
}

export function updateCompany(id: string, dto: UpdateCompanyDto): Promise<Company> {
  return apiRequest(`/companies/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(dto),
  })
}

export function deleteCompany(id: string): Promise<void> {
  return apiRequest(`/companies/${id}`, { method: 'DELETE' })
}
