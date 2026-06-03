export const DealStage = {
  NEW: 'NEW',
  QUALIFIED: 'QUALIFIED',
  PROPOSAL: 'PROPOSAL',
  NEGOTIATION: 'NEGOTIATION',
  CLOSED_WON: 'CLOSED_WON',
  CLOSED_LOST: 'CLOSED_LOST',
} as const
export type DealStage = (typeof DealStage)[keyof typeof DealStage]

export const UserRole = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  MEMBER: 'MEMBER',
} as const
export type UserRole = (typeof UserRole)[keyof typeof UserRole]

export const ContactStatus = {
  LEAD: 'LEAD',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  LOST: 'LOST',
} as const
export type ContactStatus = (typeof ContactStatus)[keyof typeof ContactStatus]

export const ActivityType = {
  EMAIL: 'EMAIL',
  CALL: 'CALL',
  MEETING: 'MEETING',
  SYSTEM: 'SYSTEM',
} as const
export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType]

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string | null
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface Company {
  id: string
  name: string
  domain?: string | null
  logoUrl?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
  contacts?: Contact[]
  deals?: Deal[]
  activities?: Activity[]
  tags?: Tag[]
  _count?: { contacts: number; deals: number; activities: number }
}

export interface Contact {
  id: string
  firstName: string
  lastName: string
  email?: string | null
  phone?: string | null
  title?: string | null
  avatarUrl?: string | null
  description?: string | null
  status: ContactStatus
  source?: string | null
  userId?: string | null
  companyId?: string | null
  createdAt: string
  updatedAt: string
  company?: Company
  tags?: Tag[]
  deals?: Deal[]
  tasks?: Task[]
  notes?: Note[]
  activities?: Activity[]
  user?: User
}

export interface Deal {
  id: string
  title: string
  value?: number | null
  currency: string
  stage: DealStage
  closeDate?: string | null
  description?: string | null
  userId?: string | null
  contactId?: string | null
  companyId?: string | null
  createdAt: string
  updatedAt: string
  contact?: Contact
  company?: Company
  tasks?: Task[]
  notes?: Note[]
  activities?: Activity[]
  tags?: Tag[]
  user?: User
}

export interface Task {
  id: string
  title: string
  description?: string | null
  dueDate?: string | null
  completed: boolean
  userId?: string | null
  contactId?: string | null
  dealId?: string | null
  createdAt: string
  updatedAt: string
  contact?: Contact
  deal?: Deal
  user?: User
}

export interface Note {
  id: string
  content: string
  userId?: string | null
  contactId?: string | null
  dealId?: string | null
  createdAt: string
  updatedAt: string
  user?: User
  contact?: Contact
  deal?: Deal
}

export interface Activity {
  id: string
  type: ActivityType
  subject: string
  details?: string | null
  occurredAt: string
  userId?: string | null
  contactId?: string | null
  dealId?: string | null
  companyId?: string | null
  createdAt: string
  user?: User
  contact?: Contact
  deal?: Deal
  company?: Company
}

export interface Tag {
  id: string
  name: string
  color: string
  _count?: { contacts: number; deals: number; companies: number }
}
