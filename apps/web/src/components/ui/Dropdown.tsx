import { type SelectHTMLAttributes } from 'react'

interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: DropdownOption[]
  error?: string
  placeholder?: string
}

export default function Dropdown({
  label,
  options,
  error,
  placeholder,
  className = '',
  ...props
}: DropdownProps) {
  return (
    <div>
      {label && (
        <label className="mb-1 block text-label-lg text-brand-neutral">
          {label}
        </label>
      )}
      <select
        className={`w-full rounded border bg-surface-container-lowest px-3 py-2.5 text-body-md text-on-surface outline-none transition-all ${
          error
            ? 'border-error'
            : 'border-outline-variant focus:border-2 focus:border-brand-primary'
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
      {error && <p className="mt-1 text-label-sm text-error">{error}</p>}
    </div>
  )
}
