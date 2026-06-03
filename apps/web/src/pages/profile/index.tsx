import { useState, useEffect, type FormEvent } from 'react'
import { Button, Input, Skeleton } from '../../components/ui'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { getMyProfile, updateMyProfile } from '../../api/users'
import { userRoleLabels, userRoleColors } from '../../api/types'

export default function ProfilePage() {
  const { setUser } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<Awaited<ReturnType<typeof getMyProfile>> | null>(null)

  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', avatarUrl: '' })

  useEffect(() => {
    let cancelled = false
    getMyProfile()
      .then((data) => {
        if (cancelled) return
        setProfile(data)
        setForm({ name: data.name, email: data.email, avatarUrl: data.avatarUrl ?? '' })
      })
      .catch(() => { if (!cancelled) toast('Failed to load profile', 'error') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [toast])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const updated = await updateMyProfile({
        name: form.name,
        email: form.email,
        avatarUrl: form.avatarUrl || null,
      })
      setProfile((prev) => prev ? { ...prev, ...updated } : null)
      setUser((prev) => prev ? { ...prev, ...updated } : null)
      setEditing(false)
      toast('Profile updated', 'success')
    } catch {
      setError('Failed to update profile')
      toast('Failed to update profile', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const initials = profile
    ? profile.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??'

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-6">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center text-body-md text-brand-neutral">
        Could not load profile.
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface">Profile</h1>
          <p className="mt-1 text-body-md text-brand-neutral">Your personal information and activity</p>
        </div>
        {!editing && (
          <Button variant="secondary" onClick={() => setEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      {!editing ? (
        <>
          <div className="mt-8 flex items-center gap-6 rounded-xl bg-surface-container-lowest p-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-container text-headline-lg font-medium text-on-primary-container">
              {initials}
            </div>
            <div>
              <h2 className="font-heading text-title-lg text-on-surface">{profile.name}</h2>
              <p className="text-body-md text-brand-neutral">{profile.email}</p>
              <span
                className="mt-1 inline-block rounded px-2 py-0.5 text-label-sm"
                style={{
                  backgroundColor: `${userRoleColors[profile.role] ?? '#6366f1'}20`,
                  color: userRoleColors[profile.role] ?? '#6366f1',
                }}
              >
                {userRoleLabels[profile.role] ?? profile.role}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              { label: 'Contacts', value: profile._count.contacts },
              { label: 'Deals', value: profile._count.deals },
              { label: 'Tasks', value: profile._count.tasks },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 text-center">
                <p className="font-heading text-display-lg text-on-surface">{stat.value}</p>
                <p className="mt-1 text-label-lg text-brand-neutral">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
            <h3 className="font-heading text-title-md text-on-surface">Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-label-sm text-brand-neutral">Member since</p>
                <p className="text-body-md text-on-surface">{new Date(profile.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-label-sm text-brand-neutral">Last updated</p>
                <p className="text-body-md text-on-surface">{new Date(profile.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {error && (
            <div className="rounded bg-error-container px-4 py-2 text-body-md text-on-error-container">
              {error}
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-container text-headline-lg font-medium text-on-primary-container">
              {form.name ? form.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : '??'}
            </div>
            <Input label="Avatar URL" value={form.avatarUrl} onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} placeholder="https://example.com/avatar.jpg" className="flex-1" />
          </div>

          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />

          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />

          <div className="flex gap-3">
            <Button type="submit" loading={submitting}>Save Changes</Button>
            <Button type="button" variant="secondary" onClick={() => {
              setEditing(false)
              setForm({ name: profile.name, email: profile.email, avatarUrl: profile.avatarUrl ?? '' })
              setError('')
            }}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
