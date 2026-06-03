import { useState, useEffect } from 'react'
import { Dropdown, Spinner } from '../../components/ui'
import { listActivities } from '../../api/activities'
import type { Activity } from '../../api/types'
import { ActivityType as AT } from '../../api/types'

const typeLabels: Record<string, string> = { EMAIL: 'Email', CALL: 'Call', MEETING: 'Meeting', SYSTEM: 'System' }
const typeIcons: Record<string, string> = { EMAIL: '✉', CALL: '📞', MEETING: '📅', SYSTEM: '⚙' }
const typeColors: Record<string, string> = {
  EMAIL: 'border-l-brand-primary', CALL: 'border-l-brand-secondary',
  MEETING: 'border-l-brand-tertiary', SYSTEM: 'border-l-outline',
}

export default function ActivitiesPage() {
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
      .catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [typeFilter])

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
          <p className="mt-1 text-body-md text-brand-neutral">Activity timeline</p>
        </div>
        <Dropdown value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          options={[{ value: '', label: 'All types' }, { value: AT.EMAIL, label: 'Email' }, { value: AT.CALL, label: 'Call' }, { value: AT.MEETING, label: 'Meeting' }, { value: AT.SYSTEM, label: 'System' }]} />
      </div>

      {loading ? <Spinner size="md" /> : Object.keys(grouped).length === 0
        ? <p className="text-body-md text-brand-neutral">No activities found</p>
        : Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <h3 className="mb-3 font-heading text-title-md text-on-surface">{date}</h3>
              <div className="flex flex-col gap-3">
                {items.map((a) => (
                  <div key={a.id} className={`rounded-lg border border-outline-variant border-l-4 bg-surface-container-lowest p-4 shadow-sm ${typeColors[a.type] ?? 'border-l-outline'}`}>
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{typeIcons[a.type] ?? '•'}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-label-sm font-medium text-on-surface">{typeLabels[a.type] ?? a.type}</span>
                          <span className="text-label-sm text-brand-neutral">
                            {new Date(a.occurredAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="mt-1 text-body-md text-on-surface">{a.subject}</p>
                        {a.details && <p className="mt-0.5 text-body-md text-brand-neutral">{a.details}</p>}
                        <div className="mt-1 flex flex-wrap gap-2 text-label-sm text-brand-neutral">
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