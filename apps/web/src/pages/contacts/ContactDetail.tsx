import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button, Card, Chip, Skeleton } from '../../components/ui'
import { getContact, deleteContact } from '../../api/contacts'
import type { Contact } from '../../api/types'
import { contactStatusColors } from '../../api/types'
import { useToast } from '../../hooks/useToast'
import { useBreadcrumb } from '../../contexts/BreadcrumbContext'

export default function ContactDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { setDynamicLabel } = useBreadcrumb()
  const [contact, setContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getContact(id).then(setContact).catch(() => { toast('Contact not found', 'error'); navigate('/contacts') }).finally(() => setLoading(false))
  }, [id, navigate, toast])

  useEffect(() => {
    if (contact) setDynamicLabel(`${contact.firstName} ${contact.lastName}`)
  }, [contact, setDynamicLabel])

  const handleDelete = async () => {
    if (!id) return
    try {
      await deleteContact(id)
      toast('Contact deleted', 'success')
      navigate('/contacts')
    } catch { toast('Failed to delete contact', 'error') }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <div className="flex items-start justify-between">
          <div>
            <Skeleton className="mb-2 h-8 w-64" />
            <Skeleton className="h-5 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-1">
            <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-card">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="mb-3 h-4 w-full" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-card">
              <Skeleton className="mb-3 h-5 w-1/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!contact) return <p className="text-body-md text-on-surface-variant">Contact not found</p>

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface">
            {contact.firstName} {contact.lastName}
          </h1>
          <p className="mt-1 text-body-md text-on-surface-variant">{contact.title ?? contact.email ?? 'Contact'}</p>
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
                <dt className="text-label-sm text-on-surface-variant">Email</dt>
                <dd className="text-body-md text-on-surface">{contact.email ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-label-sm text-on-surface-variant">Phone</dt>
                <dd className="text-body-md text-on-surface">{contact.phone ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-label-sm text-on-surface-variant">Title</dt>
                <dd className="text-body-md text-on-surface">{contact.title ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-label-sm text-on-surface-variant">Status</dt>
                <dd>
                  <Chip color={contactStatusColors[contact.status] ?? 'neutral'}>{contact.status}</Chip>
                </dd>
              </div>
              <div>
                <dt className="text-label-sm text-on-surface-variant">Company</dt>
                <dd className="text-body-md text-on-surface">{contact.company?.name ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-label-sm text-on-surface-variant">Source</dt>
                <dd className="text-body-md text-on-surface">{contact.source ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-label-sm text-on-surface-variant">Created</dt>
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
                    <span className="text-body-md text-on-surface-variant">{d.stage}</span>
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
                    <span className={`text-body-md ${t.completed ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
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
                    <p className="mt-0.5 text-label-sm text-on-surface-variant">
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
                    <p className="mt-0.5 text-label-sm text-on-surface-variant">
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
