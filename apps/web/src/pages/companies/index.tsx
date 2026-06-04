import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable, SearchBar, Pagination, FAB, TableSkeleton, Button, Icon } from '../../components/ui'
import type { Column } from '../../components/ui'
import { listCompanies, deleteCompany } from '../../api/companies'
import type { Company } from '../../api/types'
import { useToast } from '../../hooks/useToast'
import { useDebounce } from '../../hooks/useDebounce'

export default function CompaniesPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [data, setData] = useState({ data: [] as Company[], total: 0, page: 1, limit: 10, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    listCompanies({
      page, limit, sortBy: 'createdAt', sortOrder: 'desc',
      search: debouncedSearch || undefined,
    }).then((res) => {
      if (!cancelled) { setData(res); setLoading(false) }
    }).catch(() => { if (!cancelled) { setLoading(false); toast('Failed to load companies', 'error') } })
    return () => { cancelled = true }
  }, [page, limit, debouncedSearch, toast])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this company?')) return
    try {
      await deleteCompany(id)
      toast('Company deleted', 'success')
      listCompanies({ page, limit, sortBy: 'createdAt', sortOrder: 'desc', search: debouncedSearch || undefined })
        .then(setData).catch(() => {})
    } catch { toast('Failed to delete company', 'error') }
  }

  const columns: Column<Company>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (r) => <span className="font-title-md text-on-surface font-medium">{r.name}</span>,
    },
    {
      key: 'domain',
      header: 'Domain',
      render: (r) => <span className="text-on-surface-variant font-body-md">{r.domain ?? '—'}</span>,
    },
    {
      key: 'updatedAt',
      header: 'Contacts',
      render: (r) => <span className="text-on-surface-variant font-body-md">{r._count?.contacts ?? '—'}</span>,
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (r) => <span className="text-on-surface-variant font-body-md">{new Date(r.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: 'id',
      header: '',
      render: (r) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container-high"
            onClick={(e) => { e.stopPropagation(); navigate(`/companies/${r.id}`) }}
          >
            <Icon name="visibility" className="text-sm" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 rounded-full text-error hover:bg-error/10"
            onClick={(e) => { e.stopPropagation(); handleDelete(r.id) }}
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
          <h1 className="font-headline-md text-headline-md font-bold text-on-surface">Companies</h1>
          <p className="text-on-surface-variant font-body-md">Manage your partner organizations and client accounts.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="rounded-full font-label-lg flex items-center gap-2" onClick={() => toast('Filter modal coming soon...', 'info')}>
            <Icon name="filter_list" className="text-sm" />
            Filters
          </Button>
          <Button
            variant="primary"
            className="rounded-full font-label-lg flex items-center gap-2"
            onClick={() => navigate('/companies/new')}
          >
            <Icon name="add" className="text-sm" />
            Add Company
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search companies..."
          />
        </div>
      </div>

      {loading
        ? <TableSkeleton rows={8} cols={4} />
        : (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden shadow-sm flex flex-col">
            <DataTable
              columns={columns}
              data={data.data}
              keyExtractor={(r) => r.id}
              onRowClick={(r) => navigate(`/companies/${r.id}`)}
            />
            <div className="px-6 py-4 flex items-center justify-between bg-surface-container-low border-t border-outline-variant">
              <p className="text-label-sm text-on-surface-variant">
                Showing {(data.page - 1) * data.limit + 1} to {Math.min(data.page * data.limit, data.total)} of {data.total} companies
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

      <FAB onClick={() => navigate('/companies/new')}>
        <Icon name="add" className="text-2xl" />
      </FAB>
    </div>
  )
}
