import { type DetailedHTMLProps, type HTMLAttributes } from 'react'

interface IconProps extends DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
  name: string
  filled?: boolean
}

export default function Icon({ name, filled = false, className = '', ...props }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24` }}
      {...props}
    >
      {name}
    </span>
  )
}