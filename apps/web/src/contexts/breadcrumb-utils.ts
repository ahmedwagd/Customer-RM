import type { BreadcrumbItem } from '../components/ui/Breadcrumbs'

export const LABEL_MAP: Record<string, string> = {
  dashboard: 'Dashboard',
  contacts: 'Contacts',
  companies: 'Companies',
  deals: 'Deals',
  tasks: 'Tasks',
  notes: 'Notes',
  activities: 'Activities',
  tags: 'Tags',
  users: 'Users',
  profile: 'Profile',
  new: 'New',
  edit: 'Edit',
}

export function buildItems(pathname: string, dynamicLabel: string | null): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = []

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    const href = '/' + segments.slice(0, i + 1).join('/')

    if (LABEL_MAP[seg]) {
      items.push({ label: LABEL_MAP[seg], href })
      continue
    }

    if (seg === 'new' && i > 0) {
      items.push({ label: 'New', href })
      continue
    }

    if (seg === 'edit' && i > 0) {
      items.push({ label: 'Edit', href })
      continue
    }

    items.push({
      label: dynamicLabel ?? 'Loading...',
      href,
    })
  }

  if (items.length > 0) {
    const last = items[items.length - 1]
    items[items.length - 1] = { label: last.label }
  }

  return items
}
