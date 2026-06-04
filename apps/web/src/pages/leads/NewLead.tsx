import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Dropdown, Icon } from '../../components/ui'
import { createContact } from '../../api/contacts'
import { listCompanies } from '../../api/companies'
import type { Company } from '../../api/types'
import { ContactStatus } from '../../api/types'
import { useToast } from '../../hooks/useToast'

export default function NewLead() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [companies, setCompanies] = useState<Company[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', title: '',
    companyId: '', description: '', source: '',
  })

  useEffect(() => {
    listCompanies({ limit: 100 }).then((r) => setCompanies(r.data)).catch(() => {})
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await createContact({
        firstName: form.firstName,
        lastName: form.lastName,
        title: form.title || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        companyId: form.companyId || undefined,
        description: form.description || undefined,
        source: form.source || undefined,
        status: ContactStatus.LEAD,
      })
      toast('Lead created', 'success')
      navigate('/leads')
    } catch {
      setError('Failed to create lead')
      toast('Failed to create lead', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-container-margin">
      <div className="mb-stack-lg flex items-center justify-between">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Create New Lead</h1>
          <p className="text-body-md text-on-surface-variant mt-stack-sm">Capture details for a potential new business relationship.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => navigate('/leads')}>Cancel</Button>
          <Button type="submit" form="lead-form" loading={submitting}>Create Lead</Button>
        </div>
      </div>

      {error && (
        <div className="mb-stack-lg rounded bg-error-container px-4 py-2 text-body-md text-on-error-container">{error}</div>
      )}

      <form id="lead-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
          <div className="md:col-span-8 bg-surface-container-lowest rounded-xl border border-outline-variant p-stack-lg shadow-sm">
            <h2 className="font-title-lg text-title-lg mb-stack-md flex items-center gap-2">
              <Icon name="person" className="text-primary" />
              Contact Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
              <Input
                label="First Name"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="e.g. Jonathan"
                required
              />
              <Input
                label="Last Name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="e.g. Smith"
                required
              />
              <Input
                label="Job Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Procurement Manager"
              />
              <Input
                label="Email Address"
                type="email"
                icon="mail"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="j.smith@company.com"
              />
              <Input
                label="Phone Number"
                type="tel"
                icon="call"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="mt-stack-lg pt-stack-lg border-t border-outline-variant">
              <h2 className="font-title-lg text-title-lg mb-stack-md flex items-center gap-2">
                <Icon name="description" className="text-primary" />
                Additional Notes
              </h2>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Record initial context, preferences, or meeting summaries here..."
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-outline-variant font-body-md text-body-md focus:ring-2 focus:ring-primary outline-none transition-all bg-surface-bright resize-none"
              />
            </div>
          </div>

          <div className="md:col-span-4 space-y-stack-lg">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-stack-lg shadow-sm">
              <h2 className="font-title-md text-title-md mb-stack-md flex items-center gap-2">
                <Icon name="business" className="text-primary" />
                Company info
              </h2>
              <div className="flex flex-col gap-4">
                <Dropdown
                  label="Company Name"
                  value={form.companyId}
                  onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                  placeholder="Select company"
                  options={companies.map((c) => ({ value: c.id, label: c.name }))}
                />
                <Dropdown
                  label="Lead Source"
                  value={form.source}
                  onChange={(e) => setForm({ ...form, source: e.target.value })}
                  options={[
                    { value: '', label: 'Select source' },
                    { value: 'referral', label: 'Referral' },
                    { value: 'linkedin', label: 'LinkedIn Outreach' },
                    { value: 'website', label: 'Website Inbound' },
                    { value: 'event', label: 'Industry Event' },
                    { value: 'cold_call', label: 'Cold Outreach' },
                  ]}
                />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border border-outline-variant aspect-video group">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary-container/30">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-stack-md">
                  <p className="text-white font-title-md text-title-md">Lead Intelligence</p>
                  <p className="text-white/80 font-body-md text-body-md">Profiles are auto-enriched using Ma5zan AI.</p>
                </div>
              </div>
            </div>

            <div className="bg-primary-container rounded-xl p-stack-lg text-on-primary-container">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="bolt" filled />
                <span className="font-title-md text-title-md">Priority Setting</span>
              </div>
              <p className="font-body-md text-body-md opacity-90 mb-4">Set initial urgency to alert the sales pod.</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 py-2 rounded-lg transition-colors font-label-lg text-label-lg bg-white/30 text-on-primary-container font-bold"
                >
                  Normal
                </button>
                <button
                  type="button"
                  className="flex-1 py-2 rounded-lg transition-colors font-label-lg text-label-lg bg-on-primary-container/20 hover:bg-on-primary-container/30"
                >
                  High
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden mt-stack-lg flex flex-col gap-2 pb-10">
          <Button type="submit" form="lead-form" loading={submitting} size="lg" className="w-full">
            Create Lead
          </Button>
          <Button variant="secondary" size="lg" onClick={() => navigate('/leads')} className="w-full">
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
