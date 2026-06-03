import { useAuth } from '../hooks/useAuth'

export default function TopBar() {
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
    <header className="flex h-14 items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-6">
      <div className="font-body text-title-md text-on-surface">
        Welcome{user ? `, ${user.name}` : ''}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-label-sm text-on-primary-container">
          {initials}
        </div>
        <span className="font-body text-body-md text-brand-neutral">
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
