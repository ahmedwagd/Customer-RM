import { NavLink } from 'react-router-dom'
import logo from '../assets/Ma5zan-logo.png'

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/contacts', label: 'Contacts' },
  { to: '/companies', label: 'Companies' },
  { to: '/deals', label: 'Deals' },
  { to: '/tasks', label: 'Tasks' },
  { to: '/notes', label: 'Notes' },
  { to: '/activities', label: 'Activities' },
  { to: '/tags', label: 'Tags' },
  { to: '/users', label: 'Users' },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-outline-variant bg-brand-surface-secondary transition-transform duration-300
          md:static md:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-center py-4 px-6 border-b border-outline-variant">
          <NavLink to="/dashboard" className="flex items-center gap-2 no-underline" onClick={onClose}>
            <img src={logo} alt="Ma5zan" className="h-32 w-auto" />
          </NavLink>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center px-6 py-2.5 text-label-lg no-underline transition-colors ${
                  isActive
                    ? 'bg-primary-fixed text-on-primary-fixed-variant'
                    : 'text-brand-neutral hover:bg-surface-container-high'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
