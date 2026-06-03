import { type ReactNode } from 'react'
import Icon from './Icon'

interface CardProps {
  children: ReactNode
  elevated?: boolean
  className?: string
  onClick?: () => void
  leadingIcon?: string
  title?: string
}

export default function Card({
  children,
  elevated = false,
  className = '',
  onClick,
  leadingIcon,
  title,
}: CardProps) {
  const hasHeader = title || leadingIcon

  return (
    <div
      onClick={onClick}
      className={`
        rounded-lg border border-outline-variant bg-surface-container-lowest p-3
        ${elevated ? 'shadow-card' : ''}
        ${onClick ? 'cursor-pointer transition-shadow hover:shadow-card' : ''}
        ${className}
      `}
    >
      {hasHeader && (
        <h3 className="font-title-lg text-title-lg mb-stack-md flex items-center gap-2 text-primary">
          {leadingIcon && <Icon name={leadingIcon} />}
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}
