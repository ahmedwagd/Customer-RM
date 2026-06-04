import { type ButtonHTMLAttributes, type ReactNode } from 'react'

interface FABProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

export default function FAB({ children, className = '', ...props }: FABProps) {
  return (
    <button
      className={`fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-white shadow-modal transition-shadow hover:shadow-lg active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
