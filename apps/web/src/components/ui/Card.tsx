import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  elevated?: boolean
  className?: string
  onClick?: () => void
}

export default function Card({
  children,
  elevated = false,
  className = '',
  onClick,
}: CardProps) {
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
      {children}
    </div>
  )
}
