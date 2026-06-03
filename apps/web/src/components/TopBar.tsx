import { useAuth } from '../hooks/useAuth'

interface TopBarProps {
  onMenuToggle: () => void
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const { user, logout } = useAuth()

  const initials = user
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??'

  return (
    <header className="flex h-14 items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded text-brand-neutral hover:bg-surface-container-high md:hidden"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <span className="font-body text-title-md text-on-surface">
          Welcome{user ? `, ${user.name}` : ''}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-label-sm text-on-primary-container">
          {initials}
        </div>
        <span className="hidden font-body text-body-md text-brand-neutral sm:inline">
          {user?.email}
        </span>
        <button
          onClick={logout}
          className="rounded px-3 py-1.5 text-label-lg text-brand-neutral transition-colors hover:bg-surface-container-high"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
