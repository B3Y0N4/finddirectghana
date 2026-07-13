'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/listings',      label: 'Browse Properties' },
  { href: '/how-it-works',  label: 'How It Works'      },
  { href: '/about',         label: 'About'             },
]

export default function Nav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 bg-white/98 backdrop-blur-sm border-b border-border-col shadow-nav">
      <div className="max-w-content mx-auto px-4 lg:px-8 h-full flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-ghana-green flex items-center justify-center">
            <span className="text-ghana-gold font-display font-bold text-xs leading-none">FD</span>
          </div>
          <div className="leading-none">
            <span className="font-display font-bold text-ink text-sm">Find Direct</span>
            <span className="block text-[10px] font-medium text-ghana-green tracking-wide">Ghana</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'text-sm font-medium transition-colors',
                pathname === l.href
                  ? 'text-ghana-green'
                  : 'text-muted hover:text-ink'
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/list"
            className="flex items-center gap-1.5 bg-ghana-green text-white text-sm font-semibold px-4 py-2 rounded-btn hover:bg-ghana-green-dark transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            List For Free
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-ink"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden absolute top-full inset-x-0 bg-white border-b border-border-col shadow-lg">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'text-sm font-medium py-2.5 px-3 rounded transition-colors',
                  pathname === l.href ? 'bg-ghana-green-50 text-ghana-green' : 'text-ink hover:bg-stone-50'
                )}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/list"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-1.5 bg-ghana-green text-white text-sm font-semibold px-4 py-3 rounded-btn"
            >
              <Plus className="w-3.5 h-3.5" />
              List Your Property — Free
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
