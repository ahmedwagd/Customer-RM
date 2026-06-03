import { type ReactNode } from 'react'

interface ChipProps {
  children: ReactNode
  color?: string
  onRemove?: () => void
  className?: string
}

export default function Chip({
  children,
  color = 'primary',
  onRemove,
  className = '',
}: ChipProps) {
  const colorMap: Record<string, string> = {
    primary: 'bg-primary-fixed text-on-primary-fixed-variant',
    secondary: 'bg-secondary-fixed text-on-secondary-fixed-variant',
    tertiary: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
    error: 'bg-error-container text-on-error-container',
    neutral: 'bg-surface-container-high text-on-surface-variant',
  }

  const bgColor = colorMap[color] ?? colorMap.primary

  return (
    <span
      className={`inline-flex items-center gap-1 rounded px-2.5 py-0.5 text-label-sm font-medium ${bgColor} ${className}`}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          className="ml-0.5 inline-flex items-center justify-center rounded-full p-0.5 hover:opacity-70"
        >
          ✕
        </button>
      )}
    </span>
  )
}
