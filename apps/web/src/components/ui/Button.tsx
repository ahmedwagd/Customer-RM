import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import Spinner from './Spinner'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: ReactNode
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-primary-container text-on-primary-container hover:opacity-90 disabled:opacity-60',
  secondary:
    'border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high disabled:opacity-50',
  ghost:
    'text-on-surface-variant hover:bg-surface-container-high disabled:opacity-50',
  danger:
    'bg-error text-on-error hover:opacity-90 disabled:opacity-60',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-label-sm',
  md: 'px-4 py-2.5 text-label-lg',
  lg: 'px-6 py-3 text-label-lg',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded transition-all ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : children}
    </button>
  )
}
