import { useState, useEffect } from 'react'
import { Button, Modal, Input, Skeleton, Icon } from '../../components/ui'
import { listTags, createTag, updateTag, deleteTag } from '../../api/tags'
import type { Tag } from '../../api/types'
import { useToast } from '../../hooks/useToast'

const presetColors = ['#1a73e8', '#4285f4', '#34a853', '#ea4335', '#fbbc04', '#ff6d01', '#46bdc6', '#ab47bc', '#7c4dff', '#5f6368']

export default function TagsPage() {
  const { toast } = useToast()
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [name, setName] = useState('')
  const [color, setColor] = useState(presetColors[0])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    listTags().then((data) => {
      if (!cancelled) { setTags(data); setLoading(false) }
    }).catch(() => { if (!cancelled) { setLoading(false); toast('Failed to load tags', 'error') } })
    return () => { cancelled = true }
  }, [toast])

  const refresh = () => listTags().then(setTags).catch(() => {})

  const openCreate = () => { setEditingTag(null); setName(''); setColor(presetColors[0]); setError(''); setModalOpen(true) }
  const openEdit = (tag: Tag) => { setEditingTag(tag); setName(tag.name); setColor(tag.color); setError(''); setModalOpen(true) }

  const handleSubmit = async () => {
    if (!name.trim()) return
    setError(''); setSubmitting(true)
    try {
      if (editingTag) { await updateTag(editingTag.id, { name: name.trim(), color }); toast('Tag updated', 'success') }
      else { await createTag({ name: name.trim(), color }); toast('Tag created', 'success') }
      setModalOpen(false); refresh()
    } catch { setError('Failed to save tag'); toast('Failed to save tag', 'error') } finally { setSubmitting(false) }
  }

  const handleDelete = async (id: string) => {
    try { await deleteTag(id); toast('Tag deleted', 'success'); refresh() } catch { toast('Failed to delete tag', 'error') }
  }

  const usageCount = (tag: Tag) => {
    const c = tag._count
    return (c?.contacts ?? 0) + (c?.deals ?? 0) + (c?.companies ?? 0)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-headline-lg text-on-surface">Tags</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">Manage your tags</p>
        </div>
        <Button onClick={openCreate}>New Tag</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
              <Skeleton variant="circular" width={16} height={16} />
              <div className="flex-1">
                <Skeleton className="mb-1 h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : tags.length === 0
        ? <p className="text-body-md text-on-surface-variant">No tags yet. Create your first tag.</p>
        : <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="h-4 w-4 rounded-full" style={{ backgroundColor: tag.color }} />
                  <div>
                    <p className="text-body-md font-medium text-on-surface">{tag.name}</p>
                    <p className="text-label-sm text-on-surface-variant">{usageCount(tag)} uses</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(tag)}>
                    <Icon name="edit" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(tag.id)} className="text-error">
                    <Icon name="delete" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
      }

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingTag ? 'Edit Tag' : 'New Tag'}>
        <div className="flex flex-col gap-4">
          {error && <div className="rounded bg-error-container px-4 py-2 text-body-md text-on-error-container">{error}</div>}
          <Input label="Tag Name *" value={name} onChange={(e) => setName(e.target.value)} required />
          <div>
            <label className="mb-2 block text-label-lg text-on-surface-variant">Color</label>
            <div className="flex flex-wrap gap-2">
              {presetColors.map((c) => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-full border-2 transition-all ${color === c ? 'border-on-surface scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSubmit} loading={submitting}>{editingTag ? 'Save' : 'Create Tag'}</Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
