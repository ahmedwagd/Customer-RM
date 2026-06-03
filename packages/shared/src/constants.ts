import { DealStage, ContactStatus, ActivityType } from './types'

export const dealStageLabels: Record<string, string> = {
  [DealStage.NEW]: 'New',
  [DealStage.QUALIFIED]: 'Qualified',
  [DealStage.PROPOSAL]: 'Proposal',
  [DealStage.NEGOTIATION]: 'Negotiation',
  [DealStage.CLOSED_WON]: 'Closed Won',
  [DealStage.CLOSED_LOST]: 'Closed Lost',
}

export const dealStageColors: Record<string, string> = {
  [DealStage.NEW]: 'primary',
  [DealStage.QUALIFIED]: 'secondary',
  [DealStage.PROPOSAL]: 'primary',
  [DealStage.NEGOTIATION]: 'secondary',
  [DealStage.CLOSED_WON]: 'tertiary',
  [DealStage.CLOSED_LOST]: 'error',
}

export const dealStageOrder: DealStage[] = [
  DealStage.NEW,
  DealStage.QUALIFIED,
  DealStage.PROPOSAL,
  DealStage.NEGOTIATION,
  DealStage.CLOSED_WON,
  DealStage.CLOSED_LOST,
]

export const contactStatusLabels: Record<string, string> = {
  [ContactStatus.LEAD]: 'Lead',
  [ContactStatus.ACTIVE]: 'Active',
  [ContactStatus.INACTIVE]: 'Inactive',
  [ContactStatus.LOST]: 'Lost',
}

export const contactStatusColors: Record<string, string> = {
  [ContactStatus.LEAD]: 'primary',
  [ContactStatus.ACTIVE]: 'tertiary',
  [ContactStatus.INACTIVE]: 'neutral',
  [ContactStatus.LOST]: 'error',
}

export const activityTypeLabels: Record<string, string> = {
  [ActivityType.EMAIL]: 'Email',
  [ActivityType.CALL]: 'Call',
  [ActivityType.MEETING]: 'Meeting',
  [ActivityType.SYSTEM]: 'System',
}

export const activityTypeIcons: Record<string, string> = {
  [ActivityType.EMAIL]: '✉',
  [ActivityType.CALL]: '📞',
  [ActivityType.MEETING]: '📅',
  [ActivityType.SYSTEM]: '⚙',
}

export const activityTypeColors: Record<string, string> = {
  [ActivityType.EMAIL]: 'border-l-brand-primary',
  [ActivityType.CALL]: 'border-l-brand-secondary',
  [ActivityType.MEETING]: 'border-l-brand-tertiary',
  [ActivityType.SYSTEM]: 'border-l-outline',
}

export const userRoleLabels: Record<string, string> = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  MEMBER: 'Member',
}

export const userRoleColors: Record<string, string> = {
  ADMIN: 'error',
  MANAGER: 'primary',
  MEMBER: 'neutral',
}
