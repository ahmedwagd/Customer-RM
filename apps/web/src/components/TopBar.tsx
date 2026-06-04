import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import Icon from './ui/Icon'
import Avatar from './ui/Avatar'

interface TopBarProps {
  onMenuToggle: () => void
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <header className="flex h-16 items-center justify-between border-b border-outline-variant bg-surface px-4 md:px-6">
      <div className="flex items-center gap-4 flex-1">
        <button
          type="button"
          onClick={onMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded text-on-surface-variant hover:bg-surface-container-high md:hidden"
          aria-label="Toggle menu"
        >
          <Icon name="menu" />
        </button>
        <div className="relative max-w-md w-full">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-body-md focus:ring-2 focus:ring-primary-container outline-none"
            placeholder="Search deals, people, or companies..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/deals/new')}
          className="hidden sm:flex items-center gap-2 bg-primary text-on-primary px-5 py-2 rounded-full font-label-lg text-label-lg hover:opacity-90 transition-all active:scale-95 shadow-sm"
        >
          <Icon name="add_circle" />
          New Deal
        </button>
        <div className="h-6 w-px bg-outline-variant mx-2" />
        <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors" title="Notifications">
          <Icon name="notifications" />
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
          title={theme === 'neutral-modernist' ? 'Switch to Luminous Enterprise' : 'Switch to Neutral Modernist'}
        >
          <Icon name={theme === 'neutral-modernist' ? 'light_mode' : 'contrast'} />
        </button>
        <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors" title="Help">
          <Icon name="help" />
        </button>
        <button className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors" title="Settings">
          <Icon name="settings" />
        </button>
        <Link
          to="/profile"
          className="ml-2 w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border border-outline-variant"
          title="Profile"
        >
          <Avatar name={user?.name ?? 'User'} size="sm" />
        </Link>
      </div>
    </header>
  )
}
