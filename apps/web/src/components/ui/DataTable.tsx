import { type ReactNode } from 'react'

export interface Column<T> {
  key: keyof T & string
  header: string
  sortable?: boolean
  render?: (row: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (row: T) => string
  sortKey?: string
  sortOrder?: 'asc' | 'desc'
  onSort?: (key: keyof T & string) => void
  emptyMessage?: string
  onRowClick?: (row: T) => void
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  sortKey,
  sortOrder,
  onSort,
  emptyMessage = 'No data',
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-surface-container-low text-label-lg text-on-surface-variant">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable && onSort?.(col.key)}
                className={`
                  px-4 py-3 text-left font-medium first:rounded-tl-lg last:rounded-tr-lg
                  ${col.sortable ? 'cursor-pointer select-none hover:text-on-surface' : ''}
                  ${col.className ?? ''}
                `}
              >
                <span className="inline-flex items-center gap-1">
                  {col.header}
                  {col.sortable && sortKey === col.key && (
                    <span className="text-xs">{sortOrder === 'asc' ? '\u25B2' : '\u25BC'}</span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-body-md text-on-surface-variant"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={`
                  border-b border-outline-variant text-body-md text-on-surface
                  last:border-b-0
                  ${onRowClick ? 'cursor-pointer transition-colors hover:bg-surface-container-low' : ''}
                `}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 ${col.className ?? ''}`}>
                    {col.render ? col.render(row) : row[col.key] as ReactNode}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
