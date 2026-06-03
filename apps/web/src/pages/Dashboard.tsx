import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Skeleton } from '../components/ui'
import { listContacts } from '../api/contacts'
import { listDeals } from '../api/deals'
import { listTasks } from '../api/tasks'
import { listActivities } from '../api/activities'
import type { Activity } from '../api/types'
import { activityTypeIcons } from '../api/types'
import { useToast } from '../hooks/useToast'

function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <div className="flex items-start gap-3 border-b border-outline-variant py-3 last:border-b-0">
      <span className="mt-0.5 text-lg">{activityTypeIcons[activity.type] ?? '•'}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-body-md text-on-surface">{activity.subject}</p>
        {activity.details && (
          <p className="mt-0.5 line-clamp-2 text-body-md text-brand-neutral">{activity.details}</p>
        )}
        <p className="mt-0.5 text-label-sm text-brand-neutral">
          {new Date(activity.occurredAt).toLocaleDateString(undefined, {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [stats, setStats] = useState({ contacts: 0, deals: 0, tasks: 0 })
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      listContacts({ limit: 1 }),
      listDeals({ limit: 1 }),
      listTasks({ completed: false, limit: 1 }),
      listActivities(),
    ]).then(([contactsRes, dealsRes, tasksRes, activitiesData]) => {
      if (cancelled) return
      setStats({
        contacts: contactsRes.total,
        deals: dealsRes.total,
        tasks: tasksRes.total,
      })
      setActivities(activitiesData.slice(0, 10))
    }).catch(() => { toast('Failed to load dashboard data', 'error') }).finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => { cancelled = true }
  }, [toast])

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-headline-lg text-on-surface">Dashboard</h1>
        <p className="mt-1 font-body text-body-md text-brand-neutral">
          Overview of your CRM activity
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-card">
                <Skeleton className="mb-2 h-4 w-1/3" />
                <Skeleton className="h-8 w-1/4" />
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-card">
              <p className="text-label-sm text-brand-neutral uppercase tracking-wide">Total Contacts</p>
              <p className="mt-2 font-heading text-headline-md text-on-surface">{stats.contacts}</p>
            </div>
            <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-card">
              <p className="text-label-sm text-brand-neutral uppercase tracking-wide">Active Deals</p>
              <p className="mt-2 font-heading text-headline-md text-on-surface">{stats.deals}</p>
            </div>
            <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-card">
              <p className="text-label-sm text-brand-neutral uppercase tracking-wide">Pending Tasks</p>
              <p className="mt-2 font-heading text-headline-md text-on-surface">{stats.tasks}</p>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-card">
          <h2 className="font-heading text-title-md text-on-surface">Recent Activity</h2>
          <div className="mt-3">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="border-b border-outline-variant py-3 last:border-b-0">
                    <Skeleton className="mb-1 h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                ))
              : activities.length === 0
                ? <p className="text-body-md text-brand-neutral">No recent activity</p>
                : activities.map((a) => <ActivityItem key={a.id} activity={a} />)
            }
          </div>
        </div>

        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-card">
          <h2 className="font-heading text-title-md text-on-surface">Quick Actions</h2>
          <div className="mt-4 flex flex-col gap-3">
            <Button variant="primary" onClick={() => navigate('/contacts/new')}>
              Create Contact
            </Button>
            <Button variant="secondary" onClick={() => navigate('/deals/new')}>
              Add Deal
            </Button>
            <Button variant="secondary" onClick={() => navigate('/tasks')}>
              View Tasks
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
