import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Card, Chip, Spinner } from '../../components/ui'
import { getContact, deleteContact } from '../../api/contacts'
import type { Contact } from '../../api/types'

const statusColors: Record<string, string> = {
  LEAD: 'primary',
  ACTIVE: 'tertiary',
  INACTIVE: 'neutral',
  LOST: 'error',
}

export default function ContactDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [contact, setContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getContact(id).then(setContact).catch(() => navigate('/contacts')).finally(() => setLoading(false))
  }, [id, navigate])

  const handleDelete = async () => {
    if (!id || !confirm('Delete this contact?')) return
    try {
      await deleteContact(id)
      navigate('/contacts')
    } catch { /* silent */ }
  }

  if (loading) return <Spinner size="md" />
  if (!contact) return <p className="text-body-md text-brand-neutral">Contact not found</p>

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface">
            {contact.firstName} {contact.lastName}
          </h1>
          <p className="mt-1 text-body-md text-brand-neutral">{contact.title ?? contact.email ?? 'Contact'}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate(`/contacts/${id}/edit`)}>
            Edit
          </Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-1">
          <Card>
            <h3 className="font-heading text-title-md text-on-surface">Details</h3>
            <dl className="mt-3 space-y-3">
              <div>
                <dt className="text-label-sm text-brand-neutral">Email</dt>
                <dd className="text-body-md text-on-surface">{contact.email ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-label-sm text-brand-neutral">Phone</dt>
                <dd className="text-body-md text-on-surface">{contact.phone ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-label-sm text-brand-neutral">Title</dt>
                <dd className="text-body-md text-on-surface">{contact.title ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-label-sm text-brand-neutral">Status</dt>
                <dd>
                  <Chip color={statusColors[contact.status] ?? 'neutral'}>{contact.status}</Chip>
                </dd>
              </div>
              <div>
                <dt className="text-label-sm text-brand-neutral">Company</dt>
                <dd className="text-body-md text-on-surface">{contact.company?.name ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-label-sm text-brand-neutral">Source</dt>
                <dd className="text-body-md text-on-surface">{contact.source ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-label-sm text-brand-neutral">Created</dt>
                <dd className="text-body-md text-on-surface">
                  {new Date(contact.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </Card>

          {(contact.tags && contact.tags.length > 0) && (
            <Card>
              <h3 className="font-heading text-title-md text-on-surface">Tags</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {contact.tags.map((t) => (
                  <Chip key={t.id}>{t.name}</Chip>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          {contact.description && (
            <Card>
              <h3 className="font-heading text-title-md text-on-surface">Description</h3>
              <p className="mt-2 text-body-md text-on-surface">{contact.description}</p>
            </Card>
          )}

          {contact.deals && contact.deals.length > 0 && (
            <Card>
              <h3 className="font-heading text-title-md text-on-surface">Deals</h3>
              <div className="mt-3 space-y-2">
                {contact.deals.map((d) => (
                  <div key={d.id} className="flex items-center justify-between border-b border-outline-variant pb-2 last:border-b-0">
                    <span className="text-body-md text-on-surface">{d.title}</span>
                    <span className="text-body-md text-brand-neutral">{d.stage}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {contact.tasks && contact.tasks.length > 0 && (
            <Card>
              <h3 className="font-heading text-title-md text-on-surface">Tasks</h3>
              <div className="mt-3 space-y-2">
                {contact.tasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-2">
                    <span className={`text-body-md ${t.completed ? 'line-through text-brand-neutral' : 'text-on-surface'}`}>
                      {t.title}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {contact.notes && contact.notes.length > 0 && (
            <Card>
              <h3 className="font-heading text-title-md text-on-surface">Notes</h3>
              <div className="mt-3 space-y-3">
                {contact.notes.map((n) => (
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

          {contact.activities && contact.activities.length > 0 && (
            <Card>
              <h3 className="font-heading text-title-md text-on-surface">Activity</h3>
              <div className="mt-3 space-y-3">
                {contact.activities.map((a) => (
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