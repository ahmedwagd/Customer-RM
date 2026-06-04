interface AvatarProps {
  src?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'h-6 w-6 text-label-sm',
  md: 'h-8 w-8 text-label-sm',
  lg: 'h-10 w-10 text-body-md',
}

function getInitials(name: string): string {
  if (!name || !name.trim()) return '??'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function Avatar({
  src,
  name,
  size = 'md',
  className = '',
}: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover ${sizeMap[size]} ${className}`}
      />
    )
  }

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-primary-container text-on-primary-container font-medium ${sizeMap[size]} ${className}`}
      title={name}
    >
      {getInitials(name)}
    </div>
  )
}
