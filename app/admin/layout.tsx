'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, ListChecks, MessageSquare, ExternalLink, LogOut } from 'lucide-react'

const NAV = [
  { href: '/admin',          label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/listings', label: 'Listings',  icon: ListChecks },
  { href: '/admin/reviews',  label: 'Reviews',   icon: MessageSquare },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()

  if (pathname === '/admin/login') return <>{children}</>

  async function logout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex w-56 bg-ghana-green-dark text-white flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-ghana-gold flex items-center justify-center flex-shrink-0">
              <span className="text-ghana-green-dark font-bold text-sm">FD</span>
            </div>
            <div>
              <p className="font-bold text-sm leading-tight">Find Direct</p>
              <p className="text-white/50 text-[10px] leading-tight">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-white/15 text-white'
                    : 'text-white/65 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/65 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> View Site
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/65 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Top bar — mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-ghana-green-dark text-white px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-sm font-display">FD Admin</span>
        <div className="flex items-center gap-4">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-xs font-medium ${pathname === href ? 'text-ghana-gold' : 'text-white/70'}`}
            >
              {label}
            </Link>
          ))}
          <button onClick={logout} className="text-white/60 text-xs">Out</button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-16 md:pt-6">
        {children}
      </main>
    </div>
  )
}
