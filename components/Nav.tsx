'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/listings',     label: 'Browse'      },
  { href: '/blog',         label: 'Blog'        },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/about',        label: 'About'        },
]

export default function Nav() {
  const pathname  = usePathname()
  const [open,    setOpen]    = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome    = pathname === '/'
  const onHero    = isHome && !scrolled

  return (
    <header className={cn(
      'fixed top-0 inset-x-0 z-50 h-16 transition-all duration-300',
      onHero
        ? 'bg-transparent border-b border-transparent'
        : 'bg-white border-b border-border-col shadow-nav'
    )}>
      <div className="max-w-content mx-auto px-4 lg:px-8 h-full flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className={cn(
            'w-9 h-9 rounded-lg flex flex-col items-center justify-center gap-px transition-colors',
            onHero ? 'bg-ghana-gold-flag' : 'bg-ghana-green'
          )}>
            {/* Mini Ghana flag in logo */}
            <div className={cn(
              'w-full h-1 rounded-sm',
              onHero ? 'bg-ghana-red' : 'bg-ghana-gold-flag'
            )} />
            <div className={cn(
              'text-[8px] font-display font-black leading-none',
              onHero ? 'text-ghana-green-dark' : 'text-white'
            )}>★</div>
            <div className={cn(
              'w-full h-1 rounded-sm',
              onHero ? 'bg-ghana-green' : 'bg-ghana-gold-flag'
            )} />
          </div>
          <div className="leading-none">
            <span className={cn(
              'font-display font-bold text-sm transition-colors',
              onHero ? 'text-white' : 'text-ink'
            )}>
              Find Direct
            </span>
            <span className={cn(
              'block text-[10px] font-semibold tracking-widest uppercase transition-colors',
              onHero ? 'text-ghana-gold-flag' : 'text-ghana-gold'
            )}>
              Ghana
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'text-sm font-medium transition-colors',
                pathname === l.href
                  ? onHero ? 'text-ghana-gold-flag' : 'text-ghana-green'
                  : onHero ? 'text-white/80 hover:text-white' : 'text-muted hover:text-ink'
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
            className={cn(
              'flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-btn transition-colors',
              onHero
                ? 'bg-ghana-gold-flag text-ghana-green-dark hover:bg-yellow-300'
                : 'bg-ghana-green text-white hover:bg-ghana-green-dark'
            )}
          >
            <Plus className="w-3.5 h-3.5" />
            List For Free
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className={cn('md:hidden p-2 transition-colors', onHero ? 'text-white' : 'text-ink')}
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
