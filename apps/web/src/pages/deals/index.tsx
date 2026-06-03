import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable, FAB, Spinner, Chip } from '../../components/ui'
import type { Column } from '../../components/ui'
import { listDeals, updateDeal } from '../../api/deals'
import type { Deal, DealStage } from '../../api/types'
import { DealStage as DS } from '../../api/types'

const stageOrder: DealStage[] = [DS.NEW, DS.QUALIFIED, DS.PROPOSAL, DS.NEGOTIATION, DS.CLOSED_WON, DS.CLOSED_LOST]
const stageLabels: Record<string, string> = {
  NEW: 'New', QUALIFIED: 'Qualified', PROPOSAL: 'Proposal',
  NEGOTIATION: 'Negotiation', CLOSED_WON: 'Closed Won', CLOSED_LOST: 'Closed Lost',
}
const stageColors: Record<string, string> = {
  NEW: 'primary', QUALIFIED: 'secondary', PROPOSAL: 'primary',
  NEGOTIATION: 'secondary', CLOSED_WON: 'tertiary', CLOSED_LOST: 'error',
}

export default function DealsPage() {
  const navigate = useNavigate()
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'pipeline' | 'table'>('pipeline')

  useEffect(() => {
    let cancelled = false
    listDeals({ limit: 100 }).then((res) => {
      if (!cancelled) { setDeals(res.data); setLoading(false) }
    }).catch(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const refresh = () => {
    listDeals({ limit: 100 }).then((res) => setDeals(res.data)).catch(() => {})
  }

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId)
  }

  const handleDrop = async (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault()
    const dealId = e.dataTransfer.getData('dealId')
    if (!dealId) return
    try { await updateDeal(dealId, { stage }); refresh() } catch { /* silent */ }
  }

  const columns: Column<Deal>[] = [
    { key: 'title', header: 'Title', render: (r) => <span className="font-medium">{r.title}</span> },
    { key: 'value', header: 'Value', render: (r) => r.value ? `${r.currency ?? 'USD'} ${r.value.toLocaleString()}` : '—' },
    { key: 'stage', header: 'Stage', render: (r) => <Chip color={stageColors[r.stage] ?? 'neutral'}>{stageLabels[r.stage] ?? r.stage}</Chip> },
    { key: 'contactId', header: 'Contact', render: (r) => r.contact ? `${r.contact.firstName} ${r.contact.lastName}` : '—' },
    { key: 'companyId', header: 'Company', render: (r) => r.company?.name ?? '—' },
    { key: 'closeDate', header: 'Close Date', render: (r) => r.closeDate ? new Date(r.closeDate).toLocaleDateString() : '—' },
  ]

  if (loading) return <Spinner size="md" />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface">Deals</h1>
          <p className="mt-1 text-body-md text-brand-neutral">Manage your deal pipeline</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setView('pipeline')}
            className={`rounded px-3 py-1.5 text-label-sm transition-colors ${view === 'pipeline' ? 'bg-primary-container text-on-primary-container' : 'text-brand-neutral hover:bg-surface-container-high'}`}>Pipeline</button>
          <button type="button" onClick={() => setView('table')}
            className={`rounded px-3 py-1.5 text-label-sm transition-colors ${view === 'table' ? 'bg-primary-container text-on-primary-container' : 'text-brand-neutral hover:bg-surface-container-high'}`}>Table</button>
        </div>
      </div>

      {view === 'pipeline' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {stageOrder.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage)
            return (
              <div key={stage} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, stage)}
                className="flex flex-col rounded-lg border border-outline-variant bg-surface-container-low p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-label-sm font-medium text-on-surface">{stageLabels[stage]}</span>
                  <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-label-sm text-brand-neutral">{stageDeals.length}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {stageDeals.map((deal) => (
                    <div key={deal.id} draggable onDragStart={(e) => handleDragStart(e, deal.id)}
                      onClick={() => navigate(`/deals/${deal.id}`)}
                      className="cursor-grab rounded-lg border border-outline-variant bg-surface-container-lowest p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing">
                      <p className="text-body-md font-medium text-on-surface">{deal.title}</p>
                      {deal.value != null && <p className="text-label-sm text-brand-neutral">{deal.currency ?? 'USD'} {deal.value.toLocaleString()}</p>}
                      {deal.contact && <p className="mt-1 text-label-sm text-brand-neutral">{deal.contact.firstName} {deal.contact.lastName}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <DataTable columns={columns} data={deals} keyExtractor={(r) => r.id} onRowClick={(r) => navigate(`/deals/${r.id}`)} />
      )}

      <FAB onClick={() => navigate('/deals/new')}>+</FAB>
    </div>
  )
}