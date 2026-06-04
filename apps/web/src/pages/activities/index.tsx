import { useState, useEffect } from 'react'
import { Dropdown, Skeleton, Icon } from '../../components/ui'
import { listActivities } from '../../api/activities'
import type { Activity } from '../../api/types'
import { ActivityType as AT, activityTypeLabels } from '../../api/types'
import { useToast } from '../../hooks/useToast'

const activityIcons: Record<string, string> = {
  [AT.EMAIL]: 'mail',
  [AT.CALL]: 'call',
  [AT.MEETING]: 'event',
  [AT.SYSTEM]: 'info',
}

const activityBorderColors: Record<string, string> = {
  [AT.EMAIL]: 'border-l-primary-container',
  [AT.CALL]: 'border-l-secondary-container',
  [AT.MEETING]: 'border-l-tertiary-container',
  [AT.SYSTEM]: 'border-l-outline-variant',
}

export default function ActivitiesPage() {
  const { toast } = useToast()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => {
    let cancelled = false
    listActivities({ type: (typeFilter || undefined) as AT | undefined })
      .then((data) => {
        if (!cancelled) {
          setActivities(data.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()))
          setLoading(false)
        }
      })
      .catch(() => { if (!cancelled) { setLoading(false); toast('Failed to load activities', 'error') } })
    return () => { cancelled = true }
  }, [typeFilter, toast])

  const grouped = activities.reduce<Record<string, Activity[]>>((acc, a) => {
    const dateKey = new Date(a.occurredAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(a)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface">Activities</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">Activity timeline</p>
        </div>
        <Dropdown value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          options={[{ value: '', label: 'All types' }, { value: AT.EMAIL, label: 'Email' }, { value: AT.CALL, label: 'Call' }, { value: AT.MEETING, label: 'Meeting' }, { value: AT.SYSTEM, label: 'System' }]} />
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-outline-variant border-l-4 border-l-outline bg-surface-container-lowest p-4 shadow-sm">
              <Skeleton className="mb-2 h-4 w-1/4" />
              <Skeleton className="mb-1 h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : Object.keys(grouped).length === 0
        ? <p className="text-body-md text-on-surface-variant">No activities found</p>
        : Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <h3 className="mb-3 font-title-md text-title-md text-on-surface">{date}</h3>
              <div className="flex flex-col gap-3">
                {items.map((a) => (
                  <div key={a.id} className={`rounded-xl border border-outline-variant border-l-4 bg-surface-container-lowest p-4 shadow-sm ${activityBorderColors[a.type] ?? 'border-l-outline-variant'}`}>
                    <div className="flex items-start gap-3">
                      <Icon name={activityIcons[a.type] ?? 'info'} className="mt-0.5 text-primary" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-label-sm font-medium text-on-surface">{activityTypeLabels[a.type] ?? a.type}</span>
                          <span className="text-label-sm text-on-surface-variant">
                            {new Date(a.occurredAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="mt-1 text-body-md text-on-surface">{a.subject}</p>
                        {a.details && <p className="mt-0.5 text-body-md text-on-surface-variant">{a.details}</p>}
                        <div className="mt-1 flex flex-wrap gap-2 text-label-sm text-on-surface-variant">
                          {a.user && <span>{a.user.name}</span>}
                          {a.contact && <span>{a.contact.firstName} {a.contact.lastName}</span>}
                          {a.company && <span>{a.company.name}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
      }
    </div>
  )
}
