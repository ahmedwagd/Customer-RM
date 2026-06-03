import { useState, useEffect } from 'react'
import { Button, DataTable, Modal, Input, FAB, Pagination, Spinner } from '../../components/ui'
import type { Column } from '../../components/ui'
import { listTasks, createTask, updateTask, deleteTask } from '../../api/tasks'
import type { Task } from '../../api/types'

export default function TasksPage() {
  const [data, setData] = useState({ data: [] as Task[], total: 0, page: 1, limit: 10, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [showCompleted, setShowCompleted] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    listTasks({ page, limit, sortBy: 'createdAt', sortOrder: 'desc', completed: showCompleted || undefined })
      .then((res) => { if (!cancelled) { setData(res); setLoading(false) } })
      .catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [page, limit, showCompleted])

  const refresh = () => listTasks({ page, limit, sortBy: 'createdAt', sortOrder: 'desc', completed: showCompleted || undefined })
    .then(setData).catch(() => {})

  const openCreate = () => {
    setEditingTask(null); setForm({ title: '', description: '', dueDate: '' }); setError(''); setModalOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditingTask(task)
    setForm({ title: task.title, description: task.description ?? '', dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '' })
    setError(''); setModalOpen(true)
  }

  const handleSubmit = async () => {
    setError(''); setSubmitting(true)
    try {
      if (editingTask) {
        await updateTask(editingTask.id, { title: form.title, description: form.description || undefined, dueDate: form.dueDate || undefined })
      } else {
        await createTask({ title: form.title, description: form.description || undefined, dueDate: form.dueDate || undefined })
      }
      setModalOpen(false); refresh()
    } catch { setError('Failed to save task') } finally { setSubmitting(false) }
  }

  const toggleComplete = async (task: Task) => {
    try { await updateTask(task.id, { completed: !task.completed }); refresh() } catch { /* silent */ }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return
    try { await deleteTask(id); refresh() } catch { /* silent */ }
  }

  const columns: Column<Task>[] = [
    { key: 'completed', header: '', render: (r) => (
      <input type="checkbox" checked={r.completed} onChange={() => toggleComplete(r)} className="h-4 w-4 cursor-pointer accent-brand-primary" />
    )},
    { key: 'title', header: 'Title', render: (r) => (
      <span className={r.completed ? 'text-brand-neutral line-through' : 'text-on-surface'}>{r.title}</span>
    )},
    { key: 'dueDate', header: 'Due Date', render: (r) => r.dueDate ? new Date(r.dueDate).toLocaleDateString() : '—' },
    { key: 'id', header: '', render: (r) => (
      <div className="flex gap-2">
        <button type="button" onClick={(e) => { e.stopPropagation(); openEdit(r) }} className="text-label-sm text-brand-primary hover:underline">Edit</button>
        <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(r.id) }} className="text-label-sm text-error hover:underline">Delete</button>
      </div>
    )},
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface">Tasks</h1>
          <p className="mt-1 text-body-md text-brand-neutral">Manage your tasks</p>
        </div>
        <label className="flex items-center gap-2 text-body-md text-brand-neutral">
          <input type="checkbox" checked={showCompleted} onChange={(e) => { setShowCompleted(e.target.checked); setPage(1) }} className="h-4 w-4 accent-brand-primary" />
          Show completed
        </label>
      </div>

      {loading ? <Spinner size="md" /> : (
        <>
          <DataTable columns={columns} data={data.data} keyExtractor={(r) => r.id} emptyMessage="No tasks found" />
          <Pagination page={data.page} totalPages={data.totalPages} total={data.total} limit={data.limit} onPageChange={setPage} onLimitChange={setLimit} />
        </>
      )}

      <FAB onClick={openCreate}>+</FAB>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingTask ? 'Edit Task' : 'New Task'}>
        <div className="flex flex-col gap-4">
          {error && <div className="rounded bg-error-container px-4 py-2 text-body-md text-on-error-container">{error}</div>}
          <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <div>
            <label className="mb-1 block text-label-lg text-brand-neutral">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full rounded border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none transition-all focus:border-2 focus:border-brand-primary" />
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