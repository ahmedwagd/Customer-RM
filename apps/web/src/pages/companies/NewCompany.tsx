import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from '../../components/ui'
import { createCompany } from '../../api/companies'
import { useToast } from '../../hooks/useToast'

export default function NewCompany() {
  const navigate = useNavigate()
  const { toast } = useToast()
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
      toast('Company created', 'success')
      navigate('/companies')
    } catch {
      setError('Failed to create company')
      toast('Failed to create company', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 mx-auto max-w-2xl">
      <div>
        <h1 className="font-headline-md text-headline-md font-bold text-on-surface">New Company</h1>
        <p className="text-on-surface-variant font-body-md">Add a new company</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-error-container px-4 py-3 text-body-md text-on-error-container">
            {error}
          </div>
        )}

        <Input label="Company Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <Input label="Domain" value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="example.com" />

        <div>
          <label className="mb-1 block text-label-lg text-on-surface-variant">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={4}
            className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none transition-all focus:border-2 focus:border-primary"
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
