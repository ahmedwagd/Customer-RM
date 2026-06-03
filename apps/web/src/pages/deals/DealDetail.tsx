import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Card, Chip, Spinner } from '../../components/ui'
import { getDeal, deleteDeal, updateDeal } from '../../api/deals'
import type { Deal, DealStage } from '../../api/types'
import { DealStage as DS } from '../../api/types'

const stageLabels: Record<string, string> = {
  NEW: 'New', QUALIFIED: 'Qualified', PROPOSAL: 'Proposal',
  NEGOTIATION: 'Negotiation', CLOSED_WON: 'Closed Won', CLOSED_LOST: 'Closed Lost',
}
const stageColors: Record<string, string> = {
  NEW: 'primary', QUALIFIED: 'secondary', PROPOSAL: 'primary',
  NEGOTIATION: 'secondary', CLOSED_WON: 'tertiary', CLOSED_LOST: 'error',
}
const stageOrder: DealStage[] = [DS.NEW, DS.QUALIFIED, DS.PROPOSAL, DS.NEGOTIATION, DS.CLOSED_WON, DS.CLOSED_LOST]

export default function DealDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [deal, setDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getDeal(id).then(setDeal).catch(() => navigate('/deals')).finally(() => setLoading(false))
  }, [id, navigate])

  const handleDelete = async () => {
    if (!id || !confirm('Delete this deal?')) return
    try { await deleteDeal(id); navigate('/deals') } catch { /* silent */ }
  }

  const advanceStage = async () => {
    if (!deal || !id) return
    const idx = stageOrder.indexOf(deal.stage)
    if (idx < 0 || idx >= stageOrder.length - 1) return
    const nextStage = stageOrder[idx + 1]
    try {
      const updated = await updateDeal(id, { stage: nextStage })
      setDeal(updated)
    } catch { /* silent */ }
  }

  if (loading) return <Spinner size="md" />
  if (!deal) return <p className="text-body-md text-brand-neutral">Deal not found</p>

  const currentIdx = stageOrder.indexOf(deal.stage)
  const canAdvance = currentIdx >= 0 && currentIdx < stageOrder.length - 1

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface">{deal.title}</h1>
          <p className="mt-1 text-body-md text-brand-neutral">
            <Chip color={stageColors[deal.stage] ?? 'neutral'}>{stageLabels[deal.stage] ?? deal.stage}</Chip>
          </p>
        </div>
        <div className="flex gap-2">
          {canAdvance && (
            <Button variant="primary" onClick={advanceStage}>
              Advance to {stageLabels[stageOrder[currentIdx + 1]]}
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
                <dt className="text-label-sm text-brand-neutral">Value</dt>
                <dd className="text-body-md text-on-surface">
                  {deal.value != null ? `${deal.currency ?? 'USD'} ${deal.value.toLocaleString()}` : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-label-sm text-brand-neutral">Stage</dt>
                <dd className="text-body-md text-on-surface">{stageLabels[deal.stage] ?? deal.stage}</dd>
              </div>
              <div>
                <dt className="text-label-sm text-brand-neutral">Close Date</dt>
                <dd className="text-body-md text-on-surface">
                  {deal.closeDate ? new Date(deal.closeDate).toLocaleDateString() : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-label-sm text-brand-neutral">Contact</dt>
                <dd className="text-body-md text-on-surface">
                  {deal.contact ? `${deal.contact.firstName} ${deal.contact.lastName}` : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-label-sm text-brand-neutral">Company</dt>
                <dd className="text-body-md text-on-surface">{deal.company?.name ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-label-sm text-brand-neutral">Owner</dt>
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
                    <span className={`text-body-md ${t.completed ? 'line-through text-brand-neutral' : 'text-on-surface'}`}>
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
                    <p className="mt-0.5 text-label-sm text-brand-neutral">
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