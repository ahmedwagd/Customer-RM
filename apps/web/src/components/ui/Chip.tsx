import { type ReactNode } from 'react'
import Icon from './Icon'

interface ChipProps {
  children: ReactNode
  color?: string
  onRemove?: () => void
  leadingIcon?: string
  trailingIcon?: string
  className?: string
}

export default function Chip({
  children,
  color = 'primary',
  onRemove,
  leadingIcon,
  trailingIcon,
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
      {leadingIcon && <Icon name={leadingIcon} className="text-[14px]" />}
      {children}
      {trailingIcon && <Icon name={trailingIcon} className="text-[14px] cursor-pointer" onClick={trailingIcon === 'add' ? onRemove : undefined} />}
    </span>
  )
}
