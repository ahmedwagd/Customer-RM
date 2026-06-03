import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f9ff] px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-[Hanken_Grotesk] text-[28px] font-[400] leading-[36px] text-[#181c20]">
            CRM
          </h1>
          <p className="mt-1 font-[Inter] text-[14px] leading-[20px] text-[#5f6368]">
            Luminous Enterprise
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
