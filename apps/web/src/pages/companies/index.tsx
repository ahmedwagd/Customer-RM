import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable, SearchBar, Pagination, FAB, Spinner } from '../../components/ui'
import type { Column } from '../../components/ui'
import { listCompanies, deleteCompany } from '../../api/companies'
import type { Company } from '../../api/types'

export default function CompaniesPage() {
  const navigate = useNavigate()
  const [data, setData] = useState({ data: [] as Company[], total: 0, page: 1, limit: 10, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  useEffect(() => {
    let cancelled = false
    listCompanies({
      page, limit, sortBy: 'createdAt', sortOrder: 'desc',
      search: search || undefined,
    }).then((res) => {
      if (!cancelled) { setData(res); setLoading(false) }
    }).catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [page, limit, search])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this company?')) return
    try {
      await deleteCompany(id)
      listCompanies({ page, limit, sortBy: 'createdAt', sortOrder: 'desc', search: search || undefined })
        .then(setData).catch(() => {})
    } catch { /* silent */ }
  }

  const columns: Column<Company>[] = [
    { key: 'name', header: 'Name', render: (r) => <span className="font-medium">{r.name}</span> },
    { key: 'domain', header: 'Domain', render: (r) => r.domain ?? '—' },
    {
      key: 'updatedAt',
      header: 'Contacts',
      render: (r) => r._count?.contacts ?? '—',
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (r) => new Date(r.createdAt).toLocaleDateString(),
    },
    {
      key: 'id',
      header: '',
      render: (r) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); navigate(`/companies/${r.id}`) }}
            className="text-label-sm text-brand-primary hover:underline"
          >
            View
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleDelete(r.id) }}
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
        <h1 className="font-heading text-headline-lg text-on-surface">Companies</h1>
        <p className="mt-1 text-body-md text-brand-neutral">Manage your companies</p>
      </div>

      <div className="flex-1">
        <SearchBar value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search companies..." />
      </div>

      {loading
        ? <Spinner size="md" />
        : (
          <>
            <DataTable columns={columns} data={data.data} keyExtractor={(r) => r.id} onRowClick={(r) => navigate(`/companies/${r.id}`)} />
            <Pagination page={data.page} totalPages={data.totalPages} total={data.total} limit={data.limit} onPageChange={setPage} onLimitChange={setLimit} />
          </>
        )
      }

      <FAB onClick={() => navigate('/companies/new')}>+</FAB>
    </div>
  )
}