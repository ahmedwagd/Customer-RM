import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable, FAB, Skeleton, Chip, Button, Avatar, Icon } from '../../components/ui'
import type { Column } from '../../components/ui'
import { listDeals, updateDeal } from '../../api/deals'
import type { Deal } from '../../api/types'
import { DealStage } from '../../api/types'
import { dealStageLabels, dealStageColors, dealStageOrder } from '../../api/types'
import { useToast } from '../../hooks/useToast'

const stageBorderColors: Record<string, string> = {
  NEW: 'border-b-primary-container',
  QUALIFIED: 'border-b-surface-container-highest',
  PROPOSAL: 'border-b-surface-container-highest',
  NEGOTIATION: 'border-b-surface-container-highest',
  CLOSED_WON: 'border-b-tertiary',
}

function getTotalValue(deals: Deal[]): string {
  const total = deals.reduce((sum, d) => sum + (d.value ?? 0), 0)
  return `$${total.toLocaleString()}`
}

export default function DealsPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'pipeline' | 'table'>('pipeline')

  useEffect(() => {
    let cancelled = false
    listDeals({ limit: 100 }).then((res) => {
      if (!cancelled) { setDeals(res.data); setLoading(false) }
    }).catch(() => { if (!cancelled) { setLoading(false); toast('Failed to load deals', 'error') } })
    return () => { cancelled = true }
  }, [toast])

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
    try { await updateDeal(dealId, { stage }); toast('Deal stage updated', 'success'); refresh() } catch { toast('Failed to update deal', 'error') }
  }

  const columns: Column<Deal>[] = [
    { key: 'title', header: 'Title', render: (r) => <span className="font-medium">{r.title}</span> },
    { key: 'value', header: 'Value', render: (r) => r.value ? `${r.currency ?? 'USD'} ${r.value.toLocaleString()}` : '—' },
    { key: 'stage', header: 'Stage', render: (r) => <Chip color={dealStageColors[r.stage] ?? 'neutral'}>{dealStageLabels[r.stage] ?? r.stage}</Chip> },
    { key: 'contactId', header: 'Contact', render: (r) => r.contact ? `${r.contact.firstName} ${r.contact.lastName}` : '—' },
    { key: 'companyId', header: 'Company', render: (r) => r.company?.name ?? '—' },
    { key: 'closeDate', header: 'Close Date', render: (r) => r.closeDate ? new Date(r.closeDate).toLocaleDateString() : '—' },
  ]

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface">Deals Pipeline</h1>
            <p className="text-on-surface-variant font-body-md">Manage and track your active sales opportunities</p>
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-lg border border-outline-variant bg-surface-container-low p-3 min-w-75 w-80">
              <Skeleton className="mb-2 h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const pipelineColumns = [DealStage.NEW, DealStage.QUALIFIED, DealStage.PROPOSAL, DealStage.NEGOTIATION, DealStage.CLOSED_WON]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-6 bg-surface flex justify-between items-end border-b border-outline-variant">
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-on-surface">Deals Pipeline</h1>
          <p className="text-on-surface-variant font-body-md">Manage and track your active sales opportunities</p>
        </div>
        <div className="flex gap-1 bg-surface-container-low p-1 rounded-lg border border-outline-variant">
          <Button 
            variant={view === 'pipeline' ? 'primary' : 'ghost'} 
            size="sm"
            className={`rounded-md font-label-lg flex items-center gap-2 ${view === 'pipeline' ? '' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            onClick={() => setView('pipeline')}
          >
            <Icon name="view_kanban" className="text-sm" />
            Board
          </Button>
          <Button 
            variant={view === 'table' ? 'primary' : 'ghost'} 
            size="sm"
            className={`rounded-md font-label-lg flex items-center gap-2 ${view === 'table' ? '' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
            onClick={() => setView('table')}
          >
            <Icon name="table_rows" className="text-sm" />
            List
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {view === 'pipeline' ? (
          <div className="flex gap-6 px-6 pb-8 pt-6 h-full overflow-x-auto">
            {pipelineColumns.map((stage) => {
              const stageDeals = deals.filter((d) => d.stage === stage)
              const stageTotal = getTotalValue(stageDeals)
              return (
                <div key={stage} className="flex flex-col h-full min-w-75 w-80"
                  onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, stage)}>
                  {/* Column Header */}
                  <div className={`flex justify-between items-center py-3 mb-2 border-b-2 ${stageBorderColors[stage] ?? 'border-b-surface-container-highest'}`}>
                    <div className="flex items-center gap-2">
                      <span className="font-title-md text-title-md font-bold text-on-surface">{dealStageLabels[stage]}</span>
                      <span className="px-2 py-0.5 bg-surface-container-highest rounded-full text-label-sm font-bold">{stageDeals.length}</span>
                    </div>
                    <span className="text-label-sm text-on-surface-variant">{stageTotal}</span>
                  </div>
                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {stageDeals.map((deal) => {
                      const ownerName = deal.contact 
                        ? `${deal.contact.firstName} ${deal.contact.lastName}`
                        : deal.user 
                          ? `${deal.user.firstName} ${deal.user.lastName}`
                          : 'Owner'
                      return (
                        <div key={deal.id} draggable onDragStart={(e) => handleDragStart(e, deal.id)}
                          onClick={() => navigate(`/deals/${deal.id}`)}
                          className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant hover:border-primary-container hover:shadow-md transition-all cursor-grab active:cursor-grabbing group">
                          <div className="flex justify-between items-start mb-2">
                            <Chip color="tertiary" className="text-label-sm font-bold">Active</Chip>
                            <Button variant="ghost" size="sm" className="p-1 opacity-0 group-hover:opacity-100 hover:bg-surface-container rounded-full transition-opacity">
                              <Icon name="more_vert" className="text-sm" />
                            </Button>
                          </div>
                          <h3 className="font-title-md text-title-md text-on-surface font-semibold mb-1">{deal.title}</h3>
                          <p className="text-on-surface-variant text-label-lg mb-4">{deal.company?.name ?? ''}</p>
                          <div className="flex justify-between items-center">
                            <span className="font-title-md text-primary font-bold">{deal.value ? `${deal.currency ?? 'USD'} ${deal.value.toLocaleString()}` : '—'}</span>
                            <Avatar name={ownerName} size="sm" />
                          </div>
                        </div>
                      )
                    })}
                    {/* Drop zone for Proposal only */}
                    {stage === DealStage.PROPOSAL && (
                      <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer group">
                        <Icon name="add" className="text-4xl mb-2 group-hover:scale-110 transition-transform" />
                        <span className="font-label-lg">Drop here</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-6">
            <DataTable columns={columns} data={deals} keyExtractor={(r) => r.id} onRowClick={(r) => navigate(`/deals/${r.id}`)} />
          </div>
        )}
      </div>

      {/* FAB with Tooltip */}
      <div className="fixed bottom-8 right-8 z-50 group">
        <button
          onClick={() => navigate('/deals/new')}
          className="w-14 h-14 bg-primary-container text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-110 transition-all flex items-center justify-center active:scale-95"
        >
          <Icon name="add" className="text-3xl" />
        </button>
        <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-inverse-surface text-inverse-on-surface px-4 py-2 rounded-lg font-label-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
          Quick Add Deal
        </div>
      </div>
    </div>
  )
}
