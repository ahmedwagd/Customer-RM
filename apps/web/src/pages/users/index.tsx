import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { DataTable, SearchBar, Chip, Pagination, Spinner } from '../../components/ui'
import type { Column } from '../../components/ui'
import { listUsers, updateUser, deleteUser } from '../../api/users'
import type { User } from '../../api/types'
import { UserRole } from '../../api/types'

const roleLabels: Record<string, string> = { ADMIN: 'Admin', MANAGER: 'Manager', MEMBER: 'Member' }
const roleColors: Record<string, string> = { ADMIN: 'error', MANAGER: 'primary', MEMBER: 'neutral' }

export default function UsersPage() {
  const { user: currentUser } = useAuth()
  const [data, setData] = useState({ data: [] as User[], total: 0, page: 1, limit: 10, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  useEffect(() => {
    let cancelled = false
    listUsers({ page, limit, sortBy: 'createdAt', sortOrder: 'desc', search: search || undefined })
      .then((res) => { if (!cancelled) { setData(res); setLoading(false) } })
      .catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [page, limit, search])

  const refresh = () => listUsers({ page, limit, sortBy: 'createdAt', sortOrder: 'desc', search: search || undefined }).then(setData).catch(() => {})

  const toggleRole = async (targetUser: User) => {
    const nextRole = targetUser.role === UserRole.ADMIN ? UserRole.MANAGER : targetUser.role === UserRole.MANAGER ? UserRole.MEMBER : UserRole.MANAGER
    try { await updateUser(targetUser.id, { role: nextRole }); refresh() } catch { /* silent */ }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return
    try { await deleteUser(id); refresh() } catch { /* silent */ }
  }

  const isAdmin = currentUser?.role === UserRole.ADMIN

  const columns: Column<User>[] = [
    { key: 'name', header: 'Name', render: (r) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{r.name}</span>
        {r.id === currentUser?.id && <span className="text-label-sm text-brand-neutral">(you)</span>}
      </div>
    )},
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', render: (r) => (
      <button type="button" disabled={!isAdmin} onClick={(e) => { e.stopPropagation(); toggleRole(r) }} className="disabled:cursor-default" title={isAdmin ? 'Click to toggle role' : ''}>
        <Chip color={roleColors[r.role] ?? 'neutral'}>{roleLabels[r.role] ?? r.role}</Chip>
      </button>
    )},
    { key: 'createdAt', header: 'Joined', render: (r) => new Date(r.createdAt).toLocaleDateString() },
    ...(isAdmin ? [{
      key: 'id' as keyof User & string, header: '', render: (r: User) => (
        <div className="flex gap-2">
          {r.id !== currentUser?.id && <button type="button" onClick={(e) => { e.stopPropagation(); handleDelete(r.id) }} className="text-label-sm text-error hover:underline">Remove</button>}
        </div>
      ),
    }] : []),
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-headline-lg text-on-surface">Users</h1>
        <p className="mt-1 text-body-md text-brand-neutral">{isAdmin ? 'Manage users and roles' : 'Team members'}</p>
      </div>

      <div className="flex-1">
        <SearchBar value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search users..." />
      </div>

      {loading ? <Spinner size="md" /> : (
        <>
          <DataTable columns={columns} data={data.data} keyExtractor={(r) => r.id} />
          <Pagination page={data.page} totalPages={data.totalPages} total={data.total} limit={data.limit} onPageChange={setPage} onLimitChange={setLimit} />
        </>
      )}
    </div>
  )
}