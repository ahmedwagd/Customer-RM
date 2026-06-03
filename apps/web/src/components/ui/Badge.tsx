import { type ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'neutral'
  className?: string
}

const variantStyles: Record<string, string> = {
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-secondary-fixed text-on-secondary-fixed',
  tertiary: 'bg-tertiary-fixed text-on-tertiary-fixed',
  error: 'bg-error text-on-error',
  neutral: 'bg-surface-container-high text-on-surface-variant',
}

export default function Badge({
  children,
  variant = 'primary',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-label-sm font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
