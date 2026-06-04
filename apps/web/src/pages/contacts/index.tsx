import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable, SearchBar, Dropdown, Pagination, FAB, Chip, TableSkeleton, Button, Avatar, Icon } from '../../components/ui'
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
    if (!confirm('Are you sure you want to delete this contact?')) return
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
        <div className="flex items-center gap-3">
          <Avatar src={row.avatarUrl} name={`${row.firstName} ${row.lastName}`} size="sm" />
          <div>
            <p className="font-title-md text-on-surface">{row.firstName} {row.lastName}</p>
            <p className="text-label-sm text-on-surface-variant">{row.title || 'No title provided'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'companyId',
      header: 'Company',
      render: (row) => <span className="text-on-surface-variant font-body-md">{row.company?.name ?? '—'}</span>,
    },
    {
      key: 'email',
      header: 'Email',
      render: (row) => <span className="text-on-surface-variant font-body-md">{row.email}</span>,
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
      header: 'Last Contacted',
      render: (row) => <span className="text-on-surface-variant font-body-md">{new Date(row.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: 'id',
      header: '',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high"
            onClick={(e) => { e.stopPropagation(); navigate(`/contacts/${row.id}/edit`) }}
          >
            <Icon name="edit" className="text-sm" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-2 rounded-full text-error hover:bg-error/10"
            onClick={(e) => { e.stopPropagation(); handleDelete(row.id) }}
          >
            <Icon name="delete" className="text-sm" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-on-surface">Contacts</h1>
          <p className="text-on-surface-variant font-body-md">Manage your business relationships and communication history.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="rounded-full font-label-lg flex items-center gap-2" onClick={() => toast('Filter modal coming soon...', 'info')}>
            <Icon name="filter_list" className="text-sm" />
            Filters
          </Button>
          <Button 
            variant="primary" 
            className="rounded-full font-label-lg flex items-center gap-2"
            onClick={() => navigate('/contacts/new')}
          >
            <Icon name="add" className="text-sm" />
            Add Contact
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search records..."
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
        ? <TableSkeleton rows={8} cols={6} />
        : (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm flex flex-col">
            <DataTable
              columns={columns}
              data={data.data}
              keyExtractor={(r) => r.id}
              onRowClick={(r) => navigate(`/contacts/${r.id}`)}
            />
            <div className="px-6 py-4 flex items-center justify-between bg-surface-container-low border-t border-outline-variant">
              <p className="text-label-sm text-on-surface-variant">
                Showing {(data.page - 1) * data.limit + 1} to {Math.min(data.page * data.limit, data.total)} of {data.total} contacts
              </p>
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                total={data.total}
                limit={data.limit}
                onPageChange={setPage}
                onLimitChange={setLimit}
              />
            </div>
          </div>
        )
      }

      <FAB onClick={() => navigate('/contacts/new')}>
        <Icon name="add" className="text-2xl" />
      </FAB>
    </div>
  )
}
