import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable, SearchBar, Dropdown, Pagination, FAB, Chip, TableSkeleton } from '../../components/ui'
import type { Column } from '../../components/ui'
import { listContacts, deleteContact } from '../../api/contacts'
import type { Contact, ContactStatus } from '../../api/types'
import { contactStatusLabels, contactStatusColors } from '../../api/types'
import { useToast } from '../../hooks/useToast'
import { useDebounce } from '../../hooks/useDebounce'

export default function ContactsPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [data, setData] = useState({ data: [] as Contact[], total: 0, page: 1, limit: 10, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    listContacts({
      page, limit, sortBy: 'createdAt', sortOrder: 'desc',
      search: debouncedSearch || undefined,
      status: (statusFilter || undefined) as ContactStatus | undefined,
    }).then((res) => {
      if (!cancelled) { setData(res); setLoading(false) }
    }).catch(() => { if (!cancelled) { setLoading(false); toast('Failed to load contacts', 'error') } })
    return () => { cancelled = true }
  }, [page, limit, debouncedSearch, statusFilter, toast])

  const handleDelete = async (id: string) => {
    try {
      await deleteContact(id)
      toast('Contact deleted', 'success')
      listContacts({
        page, limit, sortBy: 'createdAt', sortOrder: 'desc',
        search: debouncedSearch || undefined,
        status: (statusFilter || undefined) as ContactStatus | undefined,
      }).then(setData).catch(() => {})
    } catch { toast('Failed to delete contact', 'error') }
  }

  const columns: Column<Contact>[] = [
    {
      key: 'firstName',
      header: 'Name',
      render: (row) => (
        <span className="font-medium">{row.firstName} {row.lastName}</span>
      ),
    },
    { key: 'email', header: 'Email' },
    {
      key: 'companyId',
      header: 'Company',
      render: (row) => row.company?.name ?? '—',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Chip color={contactStatusColors[row.status] ?? 'neutral'}>
          {contactStatusLabels[row.status] ?? row.status}
        </Chip>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: 'id',
      header: '',
      render: (row) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); navigate(`/contacts/${row.id}/edit`) }}
            className="text-label-sm text-brand-primary hover:underline"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleDelete(row.id) }}
            className="text-label-sm text-error hover:underline"
          >
            Delete
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-headline-lg text-on-surface">Contacts</h1>
        <p className="mt-1 text-body-md text-brand-neutral">Manage your contacts</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search contacts..."
          />
        </div>
        <Dropdown
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          options={[
            { value: '', label: 'All statuses' },
            ...Object.entries(contactStatusLabels).map(([value, label]) => ({ value, label })),
          ]}
        />
      </div>

      {loading
        ? <TableSkeleton rows={8} cols={5} />
        : (
          <>
            <DataTable
              columns={columns}
              data={data.data}
              keyExtractor={(r) => r.id}
              onRowClick={(r) => navigate(`/contacts/${r.id}`)}
            />
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              total={data.total}
              limit={data.limit}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          </>
        )
      }

      <FAB onClick={() => navigate('/contacts/new')}>+</FAB>
    </div>
  )
}
