'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Plus, User } from 'lucide-react'
import { cn } from '@/lib/utils'

function Tab({
  href,
  label,
  Icon,
  active,
}: {
  href: string
  label: string
  Icon: React.ComponentType<{ className?: string }>
  active: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex-1 flex flex-col items-center justify-center gap-[3px] h-full transition-colors',
        active ? 'text-ghana-green' : 'text-muted'
      )}
    >
      <Icon className="w-[22px] h-[22px]" />
      <span className="text-[10px] font-semibold leading-none">{label}</span>
    </Link>
  )
}

export default function BottomNav() {
  const path = usePathname()

  const isHome    = path === '/'
  const isBrowse  = path.startsWith('/listings') || path.startsWith('/property')
  const isAccount = path.startsWith('/auth') || path.startsWith('/profile')

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-border-col flex items-stretch"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        height: 'calc(58px + env(safe-area-inset-bottom))',
      }}
    >
      <Tab href="/"        label="Home"    Icon={Home}   active={isHome} />
      <Tab href="/listings"label="Browse"  Icon={Search} active={isBrowse} />

      {/* Center List button — elevated */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <Link href="/list" className="flex flex-col items-center gap-[3px]">
          <div className="w-[50px] h-[50px] rounded-full bg-ghana-green flex items-center justify-center shadow-lg -mt-6 border-[3px] border-white">
            <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-semibold text-muted leading-none">List</span>
        </Link>
      </div>

      <Tab href="/auth/login" label="Account" Icon={User} active={isAccount} />
    </nav>
  )
}
