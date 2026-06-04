import { type InputHTMLAttributes, useId } from 'react'
import Icon from './Icon'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: string
}

export default function Input({
  label,
  error,
  icon,
  className = '',
  id: externalId,
  ...props
}: InputProps) {
  const generatedId = useId()
  const id = externalId ?? generatedId

  return (
    <div className="relative">
      <input
        id={id}
        placeholder=" "
        className={`
          peer block w-full rounded border bg-transparent px-3 pb-1 pt-5
          text-body-md text-on-surface outline-none transition-all
          ${icon ? 'pl-10' : ''}
          ${
            error
              ? 'border-error'
              : 'border-outline-variant focus:border-2 focus:border-primary-container'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      />
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline">
          <Icon name={icon} />
        </span>
      )}
      <label
        htmlFor={id}
        className={`
          absolute left-${icon ? '10' : '3'} top-1 origin-[0] text-label-sm transition-all
          peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-body-md peer-placeholder-shown:text-on-surface-variant
          peer-focus:top-1 peer-focus:text-label-sm
          ${
            error
              ? 'text-error peer-focus:text-error'
              : 'text-on-surface-variant peer-focus:text-primary-container'
          }
        `}
      >
        {label}
      </label>
      {error && (
        <p className="mt-1 text-label-sm text-error">{error}</p>
      )}
    </div>
  )
}
