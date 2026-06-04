import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, DataTable, Badge, Pagination, FAB, Icon, TableSkeleton } from '../../components/ui'
import type { Column } from '../../components/ui'
import { listContacts } from '../../api/contacts'
import type { Contact } from '../../api/types'
import { ContactStatus, contactStatusLabels, contactStatusColors } from '../../api/types'
import { useToast } from '../../hooks/useToast'

export default function LeadsPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [data, setData] = useState({ data: [] as Contact[], total: 0, page: 1, limit: 10, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    listContacts({ page, limit, status: ContactStatus.LEAD, sortBy: 'createdAt', sortOrder: 'desc' })
      .then((res) => { if (!cancelled) { setData(res); setLoading(false) } })
      .catch(() => { if (!cancelled) { setLoading(false); toast('Failed to load leads', 'error') } })
    return () => { cancelled = true }
  }, [page, limit, toast])

  const columns: Column<Contact>[] = [
    { key: 'firstName', header: 'Name', render: (r) => (
      <span className="text-on-surface font-medium">{r.firstName} {r.lastName}</span>
    )},
    { key: 'title', header: 'Title', render: (r) => r.title || '—' },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status', render: (r) => (
      <Badge variant={contactStatusColors[r.status] as 'primary' | 'secondary' | 'tertiary' | 'error' | 'neutral'}>{contactStatusLabels[r.status]}</Badge>
    )},
    { key: 'createdAt', header: 'Created', render: (r) => new Date(r.createdAt).toLocaleDateString() },
    { key: 'id', header: '', render: (r) => (
      <button onClick={() => navigate(`/contacts/${r.id}`)} className="text-primary hover:underline">
        <Icon name="open_in_new" />
      </button>
    )},
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Leads</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">Manage inbound leads and prospects.</p>
        </div>
        <Button onClick={() => navigate('/leads/new')}>
          <Icon name="add" /> Add Lead
        </Button>
      </div>

      {loading ? (
        <TableSkeleton rows={8} cols={4} />
      ) : (
        <>
          <div className="rounded-xl border border-outline-variant overflow-hidden bg-surface-container-lowest">
            <DataTable columns={columns} data={data.data} keyExtractor={(r) => r.id} emptyMessage="No leads found" />
          </div>
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            total={data.total}
            limit={data.limit}
            onPageChange={setPage}
          />
        </>
      )}

      <FAB onClick={() => navigate('/leads/new')}>+</FAB>
    </div>
  )
}
