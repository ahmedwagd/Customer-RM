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
    <header className="flex h-14 items-center justify-between border-b border-[#e0e0e0] bg-[#ffffff] px-6">
      <div className="font-[Inter] text-[16px] font-[500] leading-[24px] text-[#181c20]">
        Welcome{user ? `, ${user.name}` : ''}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a73e8] text-[11px] font-[500] leading-[16px] text-[#ffffff]">
          {initials}
        </div>
        <span className="font-[Inter] text-[14px] leading-[20px] text-[#5f6368]">
          {user?.email}
        </span>
        <button
          onClick={logout}
          className="rounded-lg px-3 py-1.5 text-[14px] font-[500] leading-[20px] text-[#5f6368] transition-colors hover:bg-[#e8eaed]"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
