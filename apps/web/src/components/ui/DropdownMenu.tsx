import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import Icon from './Icon'

export interface MenuItem {
  label?: string
  icon?: string
  onClick?: () => void
  separator?: boolean
  danger?: boolean
}

interface DropdownMenuProps {
  items: MenuItem[]
  children: ReactNode
}

export default function DropdownMenu({ items, children }: DropdownMenuProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    triggerRef.current?.focus()
  }, [])

  const toggle = useCallback(() => {
    setOpen(prev => !prev)
  }, [])

  useEffect(() => {
    if (!open) return
    requestAnimationFrame(() => {
      const first = menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]')
      first?.focus()
    })
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !e.composedPath().includes(menuRef.current)) {
        close()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, close])

  const handleTriggerKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle()
    }
  }

  const handleMenuKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      close()
    }
    const items_elements = menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')
    if (!items_elements?.length) return
    const currentIndex = Array.from(items_elements).indexOf(document.activeElement as HTMLButtonElement)
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = (currentIndex + 1) % items_elements.length
      items_elements[next]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = (currentIndex - 1 + items_elements.length) % items_elements.length
      items_elements[prev]?.focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      items_elements[0]?.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      items_elements[items_elements.length - 1]?.focus()
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        ref={triggerRef}
        onClick={toggle}
        onKeyDown={handleTriggerKey}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex cursor-pointer"
      >
        {children}
      </button>
      {open && (
        <div
          ref={menuRef}
          onKeyDown={handleMenuKey}
          className="absolute right-0 top-full mt-1 min-w-[160px] bg-surface-container rounded-xl shadow-modal border border-outline-variant z-50 py-1"
          role="menu"
        >
          {items.map((item, i) => {
            if (item.separator) {
              return <hr key={i} className="my-1 border-outline-variant" />
            }
            return (
              <button
                key={i}
                onClick={() => {
                  item.onClick?.()
                  close()
                }}
                className={`flex w-full items-center gap-3 px-4 py-2 text-body-md text-left hover:bg-surface-container-high transition-colors ${item.danger ? 'text-error' : 'text-on-surface'}`}
                role="menuitem"
              >
                {item.icon && <Icon name={item.icon} className="text-[18px]" />}
                {item.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
