import { Link } from 'react-router-dom'
import Icon from './Icon'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className="mb-stack-md">
      <ol className="flex items-center gap-stack-sm text-label-lg">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-stack-sm">
            {i > 0 && (
              <Icon name="chevron_right" className="text-[16px] text-outline" />
            )}
            {item.href ? (
              <Link to={item.href} className="text-brand-neutral transition-colors hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className="text-on-surface-variant font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
