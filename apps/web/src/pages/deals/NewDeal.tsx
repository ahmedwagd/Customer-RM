import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Dropdown, Slider, Breadcrumbs, Icon, Chip } from '../../components/ui'
import type { BreadcrumbItem } from '../../components/ui'
import { createDeal } from '../../api/deals'
import { listCompanies } from '../../api/companies'
import type { Company } from '../../api/types'
import { DealStage } from '../../api/types'
import { useToast } from '../../hooks/useToast'

const stageOptions = [
  { value: DealStage.NEW, label: 'Discovery' },
  { value: DealStage.QUALIFIED, label: 'Qualification' },
  { value: DealStage.PROPOSAL, label: 'Proposal' },
  { value: DealStage.NEGOTIATION, label: 'Negotiation' },
  { value: DealStage.CLOSED_WON, label: 'Closing' },
  { value: DealStage.CLOSED_LOST, label: 'Closed Lost' },
]

const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Deals Pipeline', href: '/deals' },
  { label: 'Initiate New Deal' },
]

export default function NewDeal() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [companies, setCompanies] = useState<Company[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<{
    title: string; value: string; currency: string; stage: string;
    closeDate: string; companyId: string; description: string;
    probability: number
  }>({
    title: '', value: '', currency: 'USD', stage: DealStage.NEW,
    closeDate: '', companyId: '', description: '',
    probability: 50,
  })

  useEffect(() => {
    listCompanies({ limit: 100 }).then((r) => setCompanies(r.data)).catch(() => {})
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await createDeal({
        title: form.title,
        value: form.value ? Number(form.value) : undefined,
        currency: form.currency,
        stage: form.stage as DealStage,
        closeDate: form.closeDate || undefined,
        companyId: form.companyId || undefined,
        description: form.description || undefined,
      })
      toast('Deal created', 'success')
      navigate('/deals')
    } catch {
      setError('Failed to create deal')
      toast('Failed to create deal', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-container-margin">
      <div className="mb-stack-lg">
        <Breadcrumbs items={breadcrumbItems} />
        <h2 className="font-heading text-headline-lg font-bold text-on-surface">New Sales Deal</h2>
      </div>

      {error && (
        <div className="mb-4 rounded bg-error-container px-4 py-2 text-body-md text-on-error-container">{error}</div>
      )}

      <form id="deal-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-12 gap-gutter">
          <div className="col-span-12 lg:col-span-8 space-y-gutter">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg shadow-sm">
              <h3 className="font-heading text-title-lg mb-stack-md flex items-center gap-2 text-primary">
                <Icon name="description" />
                Deal Identification
              </h3>
              <div className="space-y-stack-md">
                <Input
                  label="Deal Name"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
                <div>
                  <Dropdown
                    label="Associated Company"
                    icon="corporate_fare"
                    value={form.companyId}
                    onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                    options={[
                      { value: '', label: 'No company' },
                      ...companies.map((c) => ({ value: c.id, label: c.name })),
                    ]}
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {companies.slice(0, 2).map((c) => (
                      <Chip key={c.id} color="neutral" trailingIcon="add">
                        Recent: {c.name}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low border border-outline-variant border-dashed rounded-xl p-stack-lg flex flex-col items-center justify-center text-center py-10">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-stack-sm text-outline shadow-sm">
                <Icon name="attachment" />
              </div>
              <p className="font-heading text-title-md text-on-surface-variant">
                Drop proposal drafts or RFP documents here
              </p>
              <p className="text-body-md text-outline">
                Support for PDF, DOCX, and XLSX up to 25MB
              </p>
              <button type="button" className="mt-4 text-primary font-bold hover:underline">
                Browse Files
              </button>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-gutter">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg shadow-sm">
              <h3 className="font-heading text-title-lg mb-stack-md flex items-center gap-2 text-secondary">
                <Icon name="payments" />
                Deal Value
              </h3>
              <div className="space-y-stack-md">
                <Input
                  label="Deal Value ($)"
                  type="number"
                  icon="attach_money"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  placeholder="0.00"
                />
                <Input
                  label="Expected Close Date"
                  type="date"
                  icon="calendar_today"
                  value={form.closeDate}
                  onChange={(e) => setForm({ ...form, closeDate: e.target.value })}
                />
              </div>
            </div>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg shadow-sm">
              <h3 className="font-heading text-title-lg mb-stack-md flex items-center gap-2 text-tertiary">
                <Icon name="insights" />
                Pipeline Status
              </h3>
              <div className="space-y-stack-md">
                <Dropdown
                  label="Pipeline Stage"
                  value={form.stage}
                  onChange={(e) => setForm({ ...form, stage: e.target.value })}
                  options={stageOptions}
                />
                <Slider
                  label="Probability (%)"
                  value={form.probability}
                  onChange={(v) => setForm({ ...form, probability: v })}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary to-secondary rounded-xl p-stack-lg text-on-primary shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10">
                <h4 className="font-heading text-title-md flex items-center gap-2 mb-2">
                  <Icon name="auto_awesome" filled />
                  Deal Insights
                </h4>
                <p className="text-label-lg opacity-90 leading-relaxed">
                  Based on TechFlow Inc.'s history, deals in "Proposal" stage typically close within 14 days with an 85% success rate.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-stack-lg flex items-center justify-end gap-stack-md pb-stack-lg border-t border-outline-variant pt-stack-md">
          <Button variant="secondary" onClick={() => navigate('/deals')}>
            Discard changes
          </Button>
          <Button type="submit" loading={submitting}>
            <Icon name="save" />
            Save Deal
          </Button>
        </div>
      </form>

      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
    </div>
  )
}
