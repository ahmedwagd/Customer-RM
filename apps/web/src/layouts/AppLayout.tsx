import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-[#ffffff]">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-auto bg-[#f7f9ff] p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
