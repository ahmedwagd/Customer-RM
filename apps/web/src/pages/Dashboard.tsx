import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Skeleton, Card, Avatar, Icon } from '../components/ui'
import { listContacts } from '../api/contacts'
import { listDeals } from '../api/deals'
import { listTasks } from '../api/tasks'
import { listActivities } from '../api/activities'
import type { Activity } from '../api/types'
import { activityTypeIcons } from '../api/types'
import { useToast } from '../hooks/useToast'

function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <div className="flex gap-4 py-4 first:pt-0 last:pb-0">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
        activity.type === 'email' ? 'bg-primary-container text-on-primary-container' :
        activity.type === 'meeting' ? 'bg-tertiary-container text-on-tertiary-container' :
        'bg-surface-container-highest text-on-surface-variant'
      }`}>
        <Icon name={activityTypeIcons[activity.type] || 'event'} className="text-xl" />
      </div>
      <div>
        <p className="font-body-md text-body-md text-on-surface">
          <span className="font-bold">{activity.subject}</span>
        </p>
        <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
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
    <div className="flex flex-col gap-8 p-6 md:p-8">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary">Good Morning, Alexander</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
            Here is what's happening with your sales pipeline today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="rounded-full py-2 px-4 font-label-lg">
            <Icon name="calendar_today" className="mr-2 text-sm" />
            Last 30 Days
          </Button>
          <Button variant="primary" className="rounded-full py-2 px-4 font-label-lg">
            <Icon name="download" className="mr-2 text-sm" />
            Export Report
          </Button>
        </div>
      </section>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="mb-4 h-4 w-1/3" />
              <Skeleton className="h-8 w-1/4 mb-4" />
              <Skeleton className="h-12 w-full" />
            </Card>
          ))
        ) : (
          <>
            <MetricCard 
              label="Total Revenue" 
              value={`$${(stats.deals * 1200).toLocaleString()}`} 
              trend={12} 
              icon="payments" 
              trendUp 
            />
            <MetricCard 
              label="New Leads" 
              value={stats.contacts.toString()} 
              trend={8} 
              icon="person_add" 
              trendUp 
            />
            <MetricCard 
              label="Active Deals" 
              value={stats.deals.toString()} 
              trend={4} 
              icon="handshake" 
              trendUp={false} 
            />
            <MetricCard 
              label="Conversion Rate" 
              value="24.8%" 
              trend={2.1} 
              icon="query_stats" 
              trendUp 
            />
          </>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Sales Performance Chart */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-title-lg text-title-lg font-bold">Sales Performance</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-1 font-label-sm text-label-sm">
                  <div className="w-3 h-3 rounded-full bg-primary" /> Revenue
                </div>
                <div className="flex items-center gap-1 font-label-sm text-label-sm">
                  <div className="w-3 h-3 rounded-full bg-outline-variant" /> Target
                </div>
              </div>
            </div>
            <div className="relative h-64 w-full bg-linear-to-b from-primary/10 to-transparent rounded-lg border-b border-l border-outline-variant">
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
                <path d="M0,80 Q50,60 100,70 T200,30 T300,50 T400,20" fill="none" stroke="#1a73e8" strokeWidth="3" />
                <path d="M0,90 Q50,70 100,80 T200,40 T300,60 T400,30" fill="none" stroke="#c1c6d6" strokeDasharray="4" strokeWidth="2" />
              </svg>
              <div className="absolute bottom-0 left-0 w-full flex justify-between px-2 pb-2 pt-4 translate-y-full font-label-sm text-label-sm text-on-surface-variant">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4</span>
              </div>
            </div>
          </Card>

          {/* Recent Activity Feed */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-title-lg text-title-lg font-bold">Recent Activity</h3>
              <Button variant="ghost" className="text-primary font-label-lg" onClick={() => navigate('/activities')}>
                View All
              </Button>
            </div>
            <div className="space-y-2">
              {loading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="border-b border-outline-variant py-3 last:border-b-0">
                      <Skeleton className="mb-1 h-4 w-2/3" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  ))
                : activities.length === 0
                  ? <p className="text-body-md text-on-surface-variant">No recent activity</p>
                  : activities.map((a) => <ActivityItem key={a.id} activity={a} />)
              }
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Upcoming Tasks */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-title-lg text-title-lg font-bold">Upcoming Tasks</h3>
              <Button variant="ghost" size="sm" className="p-1">
                <Icon name="more_vert" className="text-on-surface-variant" />
              </Button>
            </div>
            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg border border-outline-variant">
                    <Skeleton className="w-5 h-5 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <TaskItem title="Review contract details" date="Today • 2:00 PM" priority="high" />
                  <TaskItem title="Follow up with NexaSoft" date="Tomorrow • 10:30 AM" />
                  <TaskItem title="Update quarterly pipeline" date="Oct 24 • 4:00 PM" />
                </>
              )}
            </div>
            <Button 
              variant="secondary" 
              className="w-full mt-6 py-2 border-dashed border-primary text-primary hover:bg-primary-container/10 rounded-lg font-label-lg"
              onClick={() => navigate('/tasks/new')}
            >
              + Add New Task
            </Button>
          </Card>

          {/* Top Deals Mini Table */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-title-lg text-title-lg font-bold">Top Deals</h3>
              <Button variant="ghost" className="text-primary font-label-lg" onClick={() => navigate('/deals')}>
                View Pipeline
              </Button>
            </div>
            <div className="space-y-5">
              <DealItem name="Acme Corp" stage="Proposal" value="$42,000" progress={75} initial="A" color="secondary" />
              <DealItem name="Velocity Ltd" stage="Negotiation" value="$31,500" progress={50} initial="V" color="tertiary" />
              <DealItem name="Koda Systems" stage="Discovery" value="$18,900" progress={25} initial="K" color="error" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, trend, icon, trendUp }: any) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow border-outline-variant">
      <div className="flex justify-between items-start">
        <span className="font-label-lg text-label-lg text-on-surface-variant">{label}</span>
        <Icon name={icon} className="text-primary" />
      </div>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-headline-md text-headline-md font-bold text-on-surface">{value}</span>
        <span className={`font-label-sm text-label-sm flex items-center ${trendUp ? 'text-tertiary' : 'text-error'}`}>
          <Icon name={trendUp ? 'trending_up' : 'trending_down'} className="text-[14px] mr-1" /> {trend}%
        </span>
      </div>
      <div className="mt-4 h-12 w-full flex items-end gap-1">
        {[40, 60, 40, 70, 100].map((h, i) => (
          <div 
            key={i} 
            className={`w-full rounded-t-sm ${i >= 3 ? 'bg-primary' : 'bg-primary-fixed-dim'}`} 
            style={{ height: `${h}%` }} 
          />
        ))}
      </div>
    </Card>
  )
}

function TaskItem({ title, date, priority }: any) {
  return (
    <div className="group flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant">
      <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
      <div className="flex-1">
        <p className="font-label-lg text-label-lg">{title}</p>
        <p className="font-label-sm text-label-sm text-on-surface-variant">{date}</p>
      </div>
      {priority === 'high' && <Icon name="priority_high" className="text-error text-[18px]" />}
    </div>
  )
}

function DealItem({ name, stage, value, progress, initial, color }: any) {
  const colorMap: Record<string, string> = {
    secondary: 'bg-secondary/10 text-secondary',
    tertiary: 'bg-tertiary/10 text-tertiary',
    error: 'bg-error/10 text-error',
  }
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${colorMap[color]}`}>
          {initial}
        </div>
        <div>
          <p className="font-label-lg text-label-lg">{name}</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant">{stage}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-label-lg text-label-lg font-bold">{value}</p>
        <div className="w-16 h-1 bg-surface-container-highest rounded-full mt-1">
          <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}
