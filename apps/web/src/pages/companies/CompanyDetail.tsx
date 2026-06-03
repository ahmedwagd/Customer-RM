import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Card, Skeleton } from '../../components/ui'
import { getCompany, deleteCompany } from '../../api/companies'
import type { Company } from '../../api/types'
import { useToast } from '../../hooks/useToast'

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getCompany(id).then(setCompany).catch(() => { toast('Company not found', 'error'); navigate('/companies') }).finally(() => setLoading(false))
  }, [id, navigate, toast])

  const handleDelete = async () => {
    if (!id) return
    try { await deleteCompany(id); toast('Company deleted', 'success'); navigate('/companies') } catch { toast('Failed to delete company', 'error') }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between">
          <div>
            <Skeleton className="mb-2 h-8 w-64" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-1">
            <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-card">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="mb-3 h-4 w-full" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-card">
              <Skeleton className="mb-3 h-5 w-1/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!company) return <p className="text-body-md text-brand-neutral">Company not found</p>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface">{company.name}</h1>
          <p className="mt-1 text-body-md text-brand-neutral">{company.domain ?? 'No domain'}</p>
        </div>
        <Button variant="danger" onClick={handleDelete}>Delete</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-1">
          <Card>
            <h3 className="font-heading text-title-md text-on-surface">Details</h3>
            <dl className="mt-3 space-y-3">
              <div>
                <dt className="text-label-sm text-brand-neutral">Domain</dt>
                <dd className="text-body-md text-on-surface">{company.domain ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-label-sm text-brand-neutral">Created</dt>
                <dd className="text-body-md text-on-surface">{new Date(company.createdAt).toLocaleDateString()}</dd>
              </div>
              <div>
                <dt className="text-label-sm text-brand-neutral">Contacts</dt>
                <dd className="text-body-md text-on-surface">{company._count?.contacts ?? 0}</dd>
              </div>
              <div>
                <dt className="text-label-sm text-brand-neutral">Deals</dt>
                <dd className="text-body-md text-on-surface">{company._count?.deals ?? 0}</dd>
              </div>
            </dl>
          </Card>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          {company.notes && (
            <Card>
              <h3 className="font-heading text-title-md text-on-surface">Notes</h3>
              <p className="mt-2 text-body-md text-on-surface">{company.notes}</p>
            </Card>
          )}

          {company.contacts && company.contacts.length > 0 && (
            <Card>
              <h3 className="font-heading text-title-md text-on-surface">Contacts</h3>
              <div className="mt-3 space-y-2">
                {company.contacts.map((c) => (
                  <div key={c.id} className="flex items-center justify-between border-b border-outline-variant pb-2 last:border-b-0">
                    <span className="text-body-md text-on-surface">{c.firstName} {c.lastName}</span>
                    <span className="text-body-md text-brand-neutral">{c.email ?? '—'}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {company.deals && company.deals.length > 0 && (
            <Card>
              <h3 className="font-heading text-title-md text-on-surface">Deals</h3>
              <div className="mt-3 space-y-2">
                {company.deals.map((d) => (
                  <div key={d.id} className="flex items-center justify-between border-b border-outline-variant pb-2 last:border-b-0">
                    <span className="text-body-md text-on-surface">{d.title}</span>
                    <span className="text-body-md text-brand-neutral">{d.stage}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {company.activities && company.activities.length > 0 && (
            <Card>
              <h3 className="font-heading text-title-md text-on-surface">Activity</h3>
              <div className="mt-3 space-y-3">
                {company.activities.map((a) => (
                  <div key={a.id} className="border-b border-outline-variant pb-2 last:border-b-0">
                    <p className="text-body-md text-on-surface">{a.subject}</p>
                    <p className="mt-0.5 text-label-sm text-brand-neutral">
                      {a.type} — {new Date(a.occurredAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
