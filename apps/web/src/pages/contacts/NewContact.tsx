import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Dropdown, Icon, Badge } from '../../components/ui'
import { createContact } from '../../api/contacts'
import { listCompanies } from '../../api/companies'
import type { Company } from '../../api/types'
import { ContactStatus } from '../../api/types'
import { useToast } from '../../hooks/useToast'

export default function NewContact() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [companies, setCompanies] = useState<Company[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', title: '',
    status: ContactStatus.LEAD, source: '', companyId: '', description: '',
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
        status: form.status as ContactStatus,
        companyId: form.companyId || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        title: form.title || undefined,
        source: form.source || undefined,
        description: form.description || undefined,
      })
      toast('Contact created', 'success')
      navigate('/contacts')
    } catch {
      setError('Failed to create contact')
      toast('Failed to create contact', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-stack-lg flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/contacts')}
            className="flex items-center gap-2 text-primary hover:underline font-title-md"
          >
            <Icon name="arrow_back" />
            Back to Customers
          </button>
          <h2 className="font-heading text-headline-lg mt-2">New Contact</h2>
        </div>
        <div className="flex gap-stack-sm">
          <Button variant="secondary" onClick={() => navigate('/contacts')}>
            Discard
          </Button>
          <Button type="submit" form="contact-form" loading={submitting}>
            Add Contact
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded bg-error-container px-4 py-2 text-body-md text-on-error-container">
          {error}
        </div>
      )}

      <form id="contact-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-12 gap-gutter">
          <div className="col-span-12 md:col-span-4 space-y-gutter">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg flex flex-col items-center text-center">
              <div className="relative group cursor-pointer">
                <div className="w-32 h-32 rounded-full bg-surface-container-high border-2 border-dashed border-outline flex items-center justify-center overflow-hidden">
                  <Icon name="person" className="text-5xl text-outline" />
                </div>
                <div className="absolute bottom-0 right-0 p-2 bg-primary text-on-primary rounded-full shadow-lg">
                  <Icon name="edit" className="text-sm" />
                </div>
              </div>
              <h3 className="font-heading text-title-lg mt-4">Contact Image</h3>
              <p className="text-on-surface-variant text-body-md mt-1">Upload a professional photo (JPG, PNG, max 2MB)</p>
            </div>

            <div className="bg-primary-container/10 border border-primary/20 rounded-xl p-stack-lg">
              <div className="flex items-center gap-3 text-primary mb-2">
                <Icon name="info" />
                <span className="font-heading text-title-md">Quick Tip</span>
              </div>
              <p className="text-on-surface-variant text-body-md">
                Linking a LinkedIn URL will automatically fetch recent activity and job titles during synchronization.
              </p>
            </div>
          </div>

          <div className="col-span-12 md:col-span-8 space-y-gutter">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-stack-md">
                <Input
                  label="First Name"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                />
                <Input
                  label="Last Name"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                />
              </div>

              <div className="mt-stack-md">
                <Dropdown
                  label="Company"
                  icon="business"
                  value={form.companyId}
                  onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                  options={[
                    { value: '', label: 'No company' },
                    ...companies.map((c) => ({ value: c.id, label: c.name })),
                  ]}
                />
              </div>

              <div className="mt-stack-md grid grid-cols-1 sm:grid-cols-2 gap-stack-md">
                <Input
                  label="Primary Email"
                  type="email"
                  icon="mail"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <Input
                  label="Mobile Number"
                  type="tel"
                  icon="call"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="mt-stack-md relative">
                <label className="absolute -top-2.5 left-3 px-1 bg-surface-container-lowest text-label-sm text-outline z-10">
                  Internal Notes
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  placeholder="Add any relevant information about this contact..."
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-body-md bg-transparent resize-none"
                />
              </div>
            </div>

            <div className="p-6 rounded-xl bg-surface-container-high/50 border border-outline-variant/30 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-label-sm text-outline">Lead Score Preview</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-2 flex-1 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="h-full bg-tertiary w-1/4 rounded-full"></div>
                    </div>
                    <span className="font-bold text-tertiary">25%</span>
                  </div>
                </div>
                <div className="h-10 w-px bg-outline-variant mx-4"></div>
                <div>
                  <p className="text-label-sm text-outline">Status</p>
                  <Badge variant="tertiary" className="mt-1">Drafting</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
