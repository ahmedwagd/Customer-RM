import { NavLink } from 'react-router-dom'

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

export default function Sidebar() {
  return (
    <aside className="flex w-60 flex-col border-r border-[#e0e0e0] bg-[#f8f9fa]">
      <div className="flex h-14 items-center px-6 border-b border-[#e0e0e0]">
        <NavLink to="/dashboard" className="font-[Hanken_Grotesk] text-[22px] font-[500] leading-[28px] text-[#1a73e8] no-underline">
          CRM
        </NavLink>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center px-6 py-2.5 text-[14px] font-[500] leading-[20px] no-underline transition-colors ${
                isActive
                  ? 'bg-[#d8e2ff] text-[#004493]'
                  : 'text-[#5f6368] hover:bg-[#e8eaed]'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
