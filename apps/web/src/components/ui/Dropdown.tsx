import { type SelectHTMLAttributes } from 'react'
import Icon from './Icon'

interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: DropdownOption[]
  error?: string
  placeholder?: string
  icon?: string
}

export default function Dropdown({
  label,
  options,
  error,
  placeholder,
  icon,
  className = '',
  ...props
}: DropdownProps) {
  return (
    <div>
      {label && (
        <label className="mb-1 block text-label-lg text-on-surface-variant">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
            <Icon name={icon} />
          </span>
        )}
        <select
          className={`w-full rounded border bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none transition-all ${
            icon ? 'pl-10' : ''
          } ${
            error
              ? 'border-error'
              : 'border-outline-variant focus:border-2 focus:border-primary-container'
          } disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="mt-1 text-label-sm text-error">{error}</p>}
    </div>
  )
}
