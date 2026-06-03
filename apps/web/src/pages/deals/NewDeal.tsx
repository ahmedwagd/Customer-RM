import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Dropdown } from '../../components/ui'
import { createDeal } from '../../api/deals'
import { listContacts } from '../../api/contacts'
import { listCompanies } from '../../api/companies'
import type { Contact, Company } from '../../api/types'
import { DealStage } from '../../api/types'
import { useToast } from '../../hooks/useToast'

const stageOptions = [
  { value: DealStage.NEW, label: 'New' },
  { value: DealStage.QUALIFIED, label: 'Qualified' },
  { value: DealStage.PROPOSAL, label: 'Proposal' },
  { value: DealStage.NEGOTIATION, label: 'Negotiation' },
  { value: DealStage.CLOSED_WON, label: 'Closed Won' },
  { value: DealStage.CLOSED_LOST, label: 'Closed Lost' },
]

export default function NewDeal() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<{ title: string; value: string; currency: string; stage: string; closeDate: string; contactId: string; companyId: string; description: string }>({
    title: '', value: '', currency: 'USD', stage: DealStage.NEW,
    closeDate: '', contactId: '', companyId: '', description: '',
  })

  useEffect(() => {
    Promise.all([
      listContacts({ limit: 100 }),
      listCompanies({ limit: 100 }),
    ]).then(([cRes, compRes]) => {
      setContacts(cRes.data)
      setCompanies(compRes.data)
    }).catch(() => {})
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
        contactId: form.contactId || undefined,
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
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="font-heading text-headline-lg text-on-surface">New Deal</h1>
        <p className="mt-1 text-body-md text-brand-neutral">Add a new deal to your pipeline</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded bg-error-container px-4 py-2 text-body-md text-on-error-container">{error}</div>
        )}

        <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input label="Value" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          <Dropdown label="Currency" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} options={[{ value: 'USD', label: 'USD' }, { value: 'EUR', label: 'EUR' }, { value: 'GBP', label: 'GBP' }, { value: 'EGP', label: 'EGP' }]} />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Dropdown label="Stage" value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })} options={stageOptions} />
          <Input label="Close Date" type="date" value={form.closeDate} onChange={(e) => setForm({ ...form, closeDate: e.target.value })} />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Dropdown label="Contact" value={form.contactId} onChange={(e) => setForm({ ...form, contactId: e.target.value })} options={[{ value: '', label: 'No contact' }, ...contacts.map((c) => ({ value: c.id, label: `${c.firstName} ${c.lastName}` }))]} />
          <Dropdown label="Company" value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })} options={[{ value: '', label: 'No company' }, ...companies.map((c) => ({ value: c.id, label: c.name }))]} />
        </div>

        <div>
          <label className="mb-1 block text-label-lg text-brand-neutral">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none transition-all focus:border-2 focus:border-brand-primary" />
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={submitting}>Create Deal</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/deals')}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
