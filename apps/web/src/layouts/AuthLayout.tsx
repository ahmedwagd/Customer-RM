import { Outlet } from 'react-router-dom'
import logo from '../assets/Ma5zan-logo.png'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img src={logo} alt="Ma5zan" className="mx-auto h-16 w-auto" />
          <p className="mt-2 font-body text-body-md text-brand-neutral">
            Luminous Enterprise
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
