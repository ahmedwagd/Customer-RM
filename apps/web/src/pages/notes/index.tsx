import { useState, useEffect } from 'react'
import { Button, Card, Modal, FAB, CardSkeleton, Icon } from '../../components/ui'
import { listNotes, createNote, updateNote, deleteNote } from '../../api/notes'
import type { Note } from '../../api/types'
import { useToast } from '../../hooks/useToast'

export default function NotesPage() {
  const { toast } = useToast()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    listNotes().then((data) => {
      if (!cancelled) {
        setNotes(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
        setLoading(false)
      }
    }).catch(() => { if (!cancelled) { setLoading(false); toast('Failed to load notes', 'error') } })
    return () => { cancelled = true }
  }, [toast])

  const refresh = () => listNotes().then((data) => setNotes(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))).catch(() => {})

  const openCreate = () => { setEditingNote(null); setContent(''); setError(''); setModalOpen(true) }
  const openEdit = (note: Note) => { setEditingNote(note); setContent(note.content); setError(''); setModalOpen(true) }

  const handleSubmit = async () => {
    if (!content.trim()) return
    setError(''); setSubmitting(true)
    try {
      if (editingNote) { await updateNote(editingNote.id, { content: content.trim() }); toast('Note updated', 'success') }
      else { await createNote({ content: content.trim() }); toast('Note created', 'success') }
      setModalOpen(false); refresh()
    } catch { setError('Failed to save note'); toast('Failed to save note', 'error') } finally { setSubmitting(false) }
  }

  const handleDelete = async (id: string) => {
    try { await deleteNote(id); toast('Note deleted', 'success'); refresh() } catch { toast('Failed to delete note', 'error') }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-headline-lg text-on-surface">Notes</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">Quick notes and observations</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : notes.length === 0
        ? <p className="text-body-md text-on-surface-variant">No notes yet. Click + to add one.</p>
        : <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <Card key={note.id} elevated>
                <p className="text-body-md text-on-surface whitespace-pre-wrap line-clamp-6">{note.content}</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-label-sm text-on-surface-variant">{note.user?.name ?? 'Unknown'} · {new Date(note.createdAt).toLocaleDateString()}</p>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(note)}>
                      <Icon name="edit" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(note.id)} className="text-error">
                      <Icon name="delete" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
      }

      <FAB onClick={openCreate}>+</FAB>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingNote ? 'Edit Note' : 'New Note'}>
        <div className="flex flex-col gap-4">
          {error && <div className="rounded bg-error-container px-4 py-2 text-body-md text-on-error-container">{error}</div>}
          <div>
            <label className="mb-1 block text-label-lg text-on-surface-variant">Content *</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6}
              className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary-container" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSubmit} loading={submitting}>{editingNote ? 'Save' : 'Create Note'}</Button>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
