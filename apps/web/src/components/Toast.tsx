import { type Toast as ToastType } from '../contexts/ToastContext'

const bgMap: Record<ToastType['type'], string> = {
  success: 'bg-tertiary-container text-on-tertiary-container border-tertiary',
  error: 'bg-error-container text-on-error-container border-error',
  info: 'bg-surface-container-high text-on-surface border-outline-variant',
}

export default function Toast({ toast, onDismiss }: { toast: ToastType; onDismiss: (id: string) => void }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 shadow-card animate-slide-in-right ${bgMap[toast.type]}`}
    >
      <span className="text-body-md">{toast.message}</span>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="ml-2 text-label-sm opacity-70 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  )
}
