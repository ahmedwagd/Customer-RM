import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import { BreadcrumbProvider, useBreadcrumb } from '../contexts/BreadcrumbContext'

function BreadcrumbBar() {
  const { items } = useBreadcrumb()
  return <Breadcrumbs items={items} />
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-surface-container-lowest">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col min-w-0">
        <TopBar onMenuToggle={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 overflow-auto bg-surface p-4 md:p-6">
          <BreadcrumbProvider>
            <BreadcrumbBar />
            <Outlet />
          </BreadcrumbProvider>
        </main>
      </div>
    </div>
  )
}
