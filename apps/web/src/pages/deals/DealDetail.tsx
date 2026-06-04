import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Card, Chip, Skeleton } from '../../components/ui'
import { getDeal, deleteDeal, updateDeal } from '../../api/deals'
import type { Deal } from '../../api/types'
import { dealStageLabels, dealStageColors, dealStageOrder } from '../../api/types'
import { useToast } from '../../hooks/useToast'
import { useBreadcrumb } from '../../contexts/BreadcrumbContext'

export default function DealDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { setDynamicLabel } = useBreadcrumb()
  const [deal, setDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getDeal(id).then(setDeal).catch(() => { toast('Deal not found', 'error'); navigate('/deals') }).finally(() => setLoading(false))
  }, [id, navigate, toast])

  useEffect(() => {
    if (deal) setDynamicLabel(deal.title)
  }, [deal, setDynamicLabel])

  const handleDelete = async () => {
    if (!id) return
    try { await deleteDeal(id); toast('Deal deleted', 'success'); navigate('/deals') } catch { toast('Failed to delete deal', 'error') }
  }

  const advanceStage = async () => {
    if (!deal || !id) return
    const idx = dealStageOrder.indexOf(deal.stage)
    if (idx < 0 || idx >= dealStageOrder.length - 1) return
    const nextStage = dealStageOrder[idx + 1]
    try {
      const updated = await updateDeal(id, { stage: nextStage })
      setDeal(updated)
      toast('Deal stage advanced', 'success')
    } catch { toast('Failed to advance deal', 'error') }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-start justify-between">
          <div>
            <Skeleton className="mb-2 h-8 w-64" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-1">
            <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-card">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="mb-3 h-4 w-full" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-card">
              <Skeleton className="mb-3 h-5 w-1/4" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!deal) return <p className="text-body-md text-on-surface-variant">Deal not found</p>

  const currentIdx = dealStageOrder.indexOf(deal.stage)
  const canAdvance = currentIdx >= 0 && currentIdx < dealStageOrder.length - 1

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface">{deal.title}</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            <Chip color={dealStageColors[deal.stage] ?? 'neutral'}>{dealStageLabels[deal.stage] ?? deal.stage}</Chip>
          </p>
        </div>
        <div className="flex gap-2">
          {canAdvance && (
            <Button variant="primary" onClick={advanceStage}>
              Advance to {dealStageLabels[dealStageOrder[currentIdx + 1]]}
            </Button>
          )}
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-1">
          <Card>
            <h3 className="font-heading text-title-md text-on-surface">Details</h3>
            <dl className="mt-3 space-y-3">
              <div>
                <dt className="text-label-sm text-on-surface-variant">Value</dt>
                <dd className="text-body-md text-on-surface">
                  {deal.value != null ? `${deal.currency ?? 'USD'} ${deal.value.toLocaleString()}` : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-label-sm text-on-surface-variant">Stage</dt>
                <dd className="text-body-md text-on-surface">{dealStageLabels[deal.stage] ?? deal.stage}</dd>
              </div>
              <div>
                <dt className="text-label-sm text-on-surface-variant">Close Date</dt>
                <dd className="text-body-md text-on-surface">
                  {deal.closeDate ? new Date(deal.closeDate).toLocaleDateString() : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-label-sm text-on-surface-variant">Contact</dt>
                <dd className="text-body-md text-on-surface">
                  {deal.contact ? `${deal.contact.firstName} ${deal.contact.lastName}` : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-label-sm text-on-surface-variant">Company</dt>
                <dd className="text-body-md text-on-surface">{deal.company?.name ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-label-sm text-on-surface-variant">Owner</dt>
                <dd className="text-body-md text-on-surface">{deal.user?.name ?? '—'}</dd>
              </div>
            </dl>
          </Card>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          {deal.description && (
            <Card>
              <h3 className="font-heading text-title-md text-on-surface">Description</h3>
              <p className="mt-2 text-body-md text-on-surface">{deal.description}</p>
            </Card>
          )}

          {deal.tasks && deal.tasks.length > 0 && (
            <Card>
              <h3 className="font-heading text-title-md text-on-surface">Tasks</h3>
              <div className="mt-3 space-y-2">
                {deal.tasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-2">
                    <span className={`text-body-md ${t.completed ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                      {t.title}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {deal.notes && deal.notes.length > 0 && (
            <Card>
              <h3 className="font-heading text-title-md text-on-surface">Notes</h3>
              <div className="mt-3 space-y-3">
                {deal.notes.map((n) => (
                  <div key={n.id} className="border-b border-outline-variant pb-2 last:border-b-0">
                    <p className="text-body-md text-on-surface">{n.content}</p>
                    <p className="mt-0.5 text-label-sm text-on-surface-variant">
                      {n.user?.name} — {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {deal.activities && deal.activities.length > 0 && (
            <Card>
              <h3 className="font-heading text-title-md text-on-surface">Activity</h3>
              <div className="mt-3 space-y-3">
                {deal.activities.map((a) => (
                  <div key={a.id} className="border-b border-outline-variant pb-2 last:border-b-0">
                    <p className="text-body-md text-on-surface">{a.subject}</p>
                    <p className="mt-0.5 text-label-sm text-on-surface-variant">
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
