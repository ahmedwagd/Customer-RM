import { useState, useEffect } from 'react'
import { Button, Icon, Modal, Input } from '../../components/ui'
import { listTasks, createTask, updateTask, deleteTask } from '../../api/tasks'
import type { Task } from '../../api/types'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'

type TabType = 'my' | 'team'

function getMonthDays(year: number, month: number) {
  let firstDow = new Date(year, month, 1).getDay()
  if (firstDow === 0) firstDow = 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days: { day: number; current: boolean }[] = []
  for (let i = firstDow - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    days.push({ day: d.getDate(), current: false })
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, current: true })
  }
  return days
}

function getPriority(task: Task) {
  const hash = task.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const list = [
    { label: 'High', className: 'bg-error-container text-on-error-container' },
    { label: 'Medium', className: 'bg-primary-fixed text-on-primary-fixed-variant' },
    { label: 'Low', className: 'bg-surface-container-highest text-on-surface-variant' },
  ]
  return list[hash % 3]
}

const meetings = [
  {
    month: 'Oct', day: 25, monthIndex: 9,
    title: 'Product Design Review',
    time: '11:00 AM', location: 'Zoom Meeting',
    bgClass: 'bg-secondary-container text-on-secondary-container',
  },
  {
    month: 'Oct', day: 29, monthIndex: 9,
    title: 'Customer Success Call',
    time: '02:30 PM', location: 'HQ - Room 4',
    bgClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
  },
]

export default function TasksPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<TabType>('my')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' })
  const [error, setError] = useState('')
  const today = new Date()
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const monthDays = getMonthDays(calYear, calMonth)

  const load = () => {
    setLoading(true)
    const params: Parameters<typeof listTasks>[0] = { page: 1, limit: 100, sortBy: 'createdAt', sortOrder: 'desc' }
    if (tab === 'my' && user?.id) params.userId = user.id
    listTasks(params)
      .then((res) => { setTasks(res.data); setLoading(false) })
      .catch(() => { setLoading(false); toast('Failed to load tasks', 'error') })
  }

  useEffect(() => { load() }, [toast, tab, user?.id])

  const incompleteCount = tasks.filter(t => !t.completed).length

  const toggleComplete = async (task: Task) => {
    try { await updateTask(task.id, { completed: !task.completed }); load() }
    catch { toast('Failed to update task', 'error') }
  }

  const handleDelete = async (id: string) => {
    try { await deleteTask(id); toast('Task deleted', 'success'); load() }
    catch { toast('Failed to delete task', 'error') }
  }

  const openCreate = () => {
    setEditingTask(null); setForm({ title: '', description: '', dueDate: '' }); setError(''); setModalOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditingTask(task)
    setForm({
      title: task.title,
      description: task.description ?? '',
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
    })
    setError(''); setModalOpen(true)
  }

  const handleSubmit = async () => {
    setError(''); setSubmitting(true)
    try {
      if (editingTask) {
        await updateTask(editingTask.id, {
          title: form.title,
          description: form.description || undefined,
          dueDate: form.dueDate || undefined,
        })
        toast('Task updated', 'success')
      } else {
        await createTask({
          title: form.title,
          description: form.description || undefined,
          dueDate: form.dueDate || undefined,
        })
        toast('Task created', 'success')
      }
      setModalOpen(false); load()
    } catch {
      setError('Failed to save task')
      toast('Failed to save task', 'error')
    } finally { setSubmitting(false) }
  }

  const markAllDone = async () => {
    const incomplete = tasks.filter(t => !t.completed)
    if (incomplete.length === 0) return
    try {
      await Promise.all(incomplete.map(t => updateTask(t.id, { completed: true })))
      toast('All tasks marked as done', 'success')
      load()
    } catch { toast('Failed to mark all as done', 'error') }
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface">Tasks & Activity</h1>
          <p className="text-on-surface-variant mt-1">Manage your daily workflow and team objectives.</p>
        </div>
        <div className="flex bg-surface-container-high p-1 rounded-xl">
          <button
            onClick={() => setTab('my')}
            className={`px-6 py-2 rounded-lg font-label-lg transition-all ${
              tab === 'my' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            My Tasks
          </button>
          <button
            onClick={() => setTab('team')}
            className={`px-6 py-2 rounded-lg font-label-lg transition-all ${
              tab === 'team' ? 'bg-surface-container-lowest text-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Team Tasks
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
        <section className="col-span-12 lg:col-span-8 flex flex-col gap-4 overflow-hidden">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant flex flex-col h-full shadow-sm">
            <div className="p-4 border-b border-outline-variant flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Icon name="filter_list" className="text-primary" />
                <span className="font-label-lg text-label-lg">Filter: All Tasks</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-label-sm text-on-surface-variant">{incompleteCount} items remaining</span>
                <div className="h-4 w-px bg-outline-variant" />
                <button onClick={markAllDone} className="text-primary font-label-lg hover:underline">Mark all as done</button>
              </div>
            </div>
            {loading ? (
              <div className="flex-1 flex items-center justify-center text-on-surface-variant py-12">Loading...</div>
            ) : tasks.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-on-surface-variant py-12">No tasks found</div>
            ) : (
              <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
                {tasks.map(task => {
                  const priority = getPriority(task)
                  return (
                    <div key={task.id} className="group flex items-center justify-between p-4 hover:bg-surface-container-low rounded-lg transition-all border-b border-surface-container">
                      <div className="flex items-center gap-4 min-w-0">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleComplete(task)}
                          className="w-5 h-5 rounded border-outline text-primary focus:ring-primary-container cursor-pointer shrink-0"
                        />
                        <div className="min-w-0">
                          <p className={`font-title-md text-title-md truncate ${task.completed ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            {task.dueDate && (
                              <span className="flex items-center gap-1 text-label-sm text-on-surface-variant whitespace-nowrap">
                                <Icon name="calendar_today" className="text-[16px]" />
                                {new Date(task.dueDate).toLocaleDateString('en-US', {
                                  month: 'short', day: 'numeric',
                                  ...(new Date(task.dueDate).getFullYear() !== today.getFullYear() ? { year: 'numeric' } : {}),
                                })}
                              </span>
                            )}
                            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${priority.className}`}>
                              {priority.label}
                            </span>
                            {task.dealId && (
                              <span className="flex items-center gap-1 text-label-sm text-on-surface-variant whitespace-nowrap">
                                <Icon name="link" className="text-[16px]" />
                                Opportunity #{task.dealId.slice(0, 4).toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 shrink-0 ml-2">
                        <button onClick={() => openEdit(task)} className="p-2 hover:bg-surface-container-high rounded-full">
                          <Icon name="edit" className="text-on-surface-variant" />
                        </button>
                        <button onClick={() => handleDelete(task.id)} className="p-2 hover:bg-surface-container-high rounded-full">
                          <Icon name="delete" className="text-error" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-10">
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-title-lg text-title-lg text-on-surface">{monthNames[calMonth]} {calYear}</h3>
              <div className="flex gap-1">
                <button
                  onClick={() => { if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11) } else { setCalMonth(m => m - 1) } }}
                  className="p-1 hover:bg-surface-container-high rounded-full"
                >
                  <Icon name="chevron_left" />
                </button>
                <button
                  onClick={() => { if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0) } else { setCalMonth(m => m + 1) } }}
                  className="p-1 hover:bg-surface-container-high rounded-full"
                >
                  <Icon name="chevron_right" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => (
                <span key={d} className="text-label-sm text-on-surface-variant">{d}</span>
              ))}
              {monthDays.map((d, i) => {
                const isToday = d.current && d.day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear()
                const hasEvent = meetings.some(m => m.day === d.day && m.monthIndex === calMonth)
                return (
                  <div
                    key={i}
                    className={`py-2 font-body-md leading-none relative ${
                      !d.current ? 'text-on-surface-variant opacity-40' : ''
                    } ${isToday ? 'bg-primary-container text-white rounded-full font-bold' : ''}`}
                  >
                    {d.current ? d.day : d.day}
                    {hasEvent && !isToday && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="font-title-lg text-title-lg text-on-surface">Upcoming Meetings</h3>
              <button className="text-primary font-label-lg">View All</button>
            </div>
            <div className="space-y-4">
              {meetings.map((m, i) => (
                <div key={i} className="flex gap-4 p-3 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer border border-transparent hover:border-outline-variant">
                  <div className={`${m.bgClass} p-2 rounded-lg flex flex-col items-center justify-center min-w-[50px] h-[50px]`}>
                    <span className="text-label-sm font-bold uppercase">{m.month}</span>
                    <span className="text-title-lg font-black leading-none">{m.day}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-title-md text-title-md text-on-surface leading-tight truncate">{m.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-label-sm text-on-surface-variant flex items-center gap-1 whitespace-nowrap">
                        <Icon name="schedule" className="text-[14px]" />
                        {m.time}
                      </span>
                      <div className="w-1 h-1 bg-outline-variant rounded-full shrink-0" />
                      <span className="text-label-sm text-on-surface-variant truncate">{m.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 rounded-xl overflow-hidden h-32 relative group">
              <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary-container/40 flex items-end p-4">
                <span className="text-white text-label-lg font-medium drop-shadow-md">Team Workshop - Nov 3rd</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <button
        onClick={openCreate}
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary-container text-on-primary-container rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center active:scale-95 group"
      >
        <Icon name="add" className="text-[32px] group-hover:rotate-90 transition-transform duration-300" />
        <span className="absolute right-20 bg-inverse-surface text-inverse-on-surface px-3 py-1.5 rounded-lg text-label-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          Create Task
        </span>
      </button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingTask ? 'Edit Task' : 'New Task'}>
        <div className="flex flex-col gap-4">
          {error && (
            <div className="rounded bg-error-container px-4 py-2 text-body-md text-on-error-container">{error}</div>
          )}
          <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div>
            <label className="mb-1 block text-label-lg text-on-surface-variant">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary"
            />
          </div>
          <Input label="Due Date" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSubmit} loading={submitting}>{editingTask ? 'Save' : 'Create Task'}</Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
