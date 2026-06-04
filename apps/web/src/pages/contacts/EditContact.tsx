import { useState, useEffect, type FormEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Input, Dropdown, Skeleton } from '../../components/ui'
import { getContact, updateContact } from '../../api/contacts'
import { listCompanies } from '../../api/companies'
import type { Company } from '../../api/types'
import { ContactStatus } from '../../api/types'
import { useToast } from '../../hooks/useToast'
import { useBreadcrumb } from '../../contexts/BreadcrumbContext'

const statusOptions = [
  { value: ContactStatus.LEAD, label: 'Lead' },
  { value: ContactStatus.ACTIVE, label: 'Active' },
  { value: ContactStatus.INACTIVE, label: 'Inactive' },
  { value: ContactStatus.LOST, label: 'Lost' },
]

export default function EditContact() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { setDynamicLabel } = useBreadcrumb()
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<{ firstName: string; lastName: string; email: string; phone: string; title: string; status: string; source: string; companyId: string; description: string }>({
    firstName: '', lastName: '', email: '', phone: '', title: '',
    status: ContactStatus.LEAD, source: '', companyId: '', description: '',
  })

  useEffect(() => {
    if (!id) return
    Promise.all([
      getContact(id),
      listCompanies({ limit: 100 }),
    ]).then(([contact, compRes]) => {
      setDynamicLabel(`${contact.firstName} ${contact.lastName}`)
      setForm({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email ?? '',
        phone: contact.phone ?? '',
        title: contact.title ?? '',
        status: contact.status,
        source: contact.source ?? '',
        companyId: contact.companyId ?? '',
        description: contact.description ?? '',
      })
      setCompanies(compRes.data)
    }).catch(() => { toast('Failed to load contact', 'error'); navigate('/contacts') }).finally(() => setLoading(false))
  }, [id, navigate, toast, setDynamicLabel])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await updateContact(id!, {
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
      toast('Contact updated', 'success')
      navigate(`/contacts/${id}`)
    } catch {
      setError('Failed to update contact')
      toast('Failed to update contact', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <Skeleton className="mb-2 h-8 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="space-y-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="font-heading text-headline-lg text-on-surface">Edit Contact</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">Update contact information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded bg-error-container px-4 py-2 text-body-md text-on-error-container">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input label="First Name *" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
          <Input label="Last Name *" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
        </div>

        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Dropdown label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={statusOptions} />
          <Dropdown label="Company" value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })} options={[{ value: '', label: 'No company' }, ...companies.map((c) => ({ value: c.id, label: c.name }))]} />
        </div>

        <Input label="Source" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />

        <div>
          <label className="mb-1 block text-label-lg text-on-surface-variant">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none transition-all focus:border-2 focus:border-primary-container" />
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={submitting}>Save Changes</Button>
          <Button type="button" variant="secondary" onClick={() => navigate(`/contacts/${id}`)}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
