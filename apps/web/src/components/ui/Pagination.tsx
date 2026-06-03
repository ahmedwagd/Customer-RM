interface PaginationProps {
  page: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (page: number) => void
  onLimitChange?: (limit: number) => void
}

export default function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-2 text-body-md text-brand-neutral">
        <span>
          {start}–{end} of {total}
        </span>
        {onLimitChange && (
          <select
            value={limit}
            onChange={(e) => { onLimitChange(Number(e.target.value)); onPageChange(1) }}
            className="rounded border border-outline-variant bg-surface-container-lowest px-2 py-1 text-body-md text-on-surface outline-none"
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}/page
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded px-3 py-1.5 text-body-md text-brand-neutral transition-colors hover:bg-surface-container-high disabled:opacity-40"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => {
            if (totalPages <= 7) return true
            if (p === 1 || p === totalPages) return true
            if (Math.abs(p - page) <= 1) return true
            return false
          })
          .map((p, idx, arr) => (
            <span key={p} className="inline-flex items-center">
              {idx > 0 && arr[idx - 1] !== p - 1 && (
                <span className="px-1 text-brand-neutral">…</span>
              )}
              <button
                type="button"
                onClick={() => onPageChange(p)}
                className={`rounded px-3 py-1.5 text-body-md transition-colors ${
                  p === page
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-brand-neutral hover:bg-surface-container-high'
                }`}
              >
                {p}
              </button>
            </span>
          ))}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded px-3 py-1.5 text-body-md text-brand-neutral transition-colors hover:bg-surface-container-high disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}
