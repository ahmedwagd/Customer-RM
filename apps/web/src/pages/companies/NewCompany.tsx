import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '../../components/ui'
import { createCompany } from '../../api/companies'

export default function NewCompany() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', domain: '', notes: '' })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await createCompany({
        name: form.name,
        domain: form.domain || undefined,
        notes: form.notes || undefined,
      })
      navigate('/companies')
    } catch {
      setError('Failed to create company')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="font-heading text-headline-lg text-on-surface">New Company</h1>
        <p className="mt-1 text-body-md text-brand-neutral">Add a new company</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded bg-error-container px-4 py-2 text-body-md text-on-error-container">
            {error}
          </div>
        )}

        <Input label="Company Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input label="Domain" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="example.com" />

        <div>
          <label className="mb-1 block text-label-lg text-brand-neutral">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={4}
            className="w-full rounded border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none transition-all focus:border-2 focus:border-brand-primary"
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" loading={submitting}>Create Company</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/companies')}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}