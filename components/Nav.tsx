'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Plus, Home, Building2, Layers, Sofa, MapPin, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/listings',     label: 'Browse'       },
  { href: '/blog',         label: 'Blog'         },
  { href: '/how-it-works', label: 'How It Works'  },
  { href: '/about',        label: 'About'         },
]

const menuCategories = [
  { href: '/listings?type=apartment',        label: 'Apartments',     Icon: Building2, accent: '#C8920A' },
  { href: '/listings?type=house',            label: 'Houses',         Icon: Home,      accent: '#006B3F' },
  { href: '/listings?type=chamber_and_hall', label: 'Chamber & Hall', Icon: Layers,    accent: '#CC0001' },
  { href: '/listings?type=studio',           label: 'Studios',        Icon: Sofa,      accent: '#FCD116' },
]

const menuAreas = [
  { href: '/listings?neighborhood=East+Legon',          label: 'East Legon'          },
  { href: '/listings?neighborhood=Airport+Residential', label: 'Airport Residential' },
  { href: '/listings?neighborhood=Osu',                 label: 'Osu'                 },
  { href: '/listings?neighborhood=Spintex+Road',        label: 'Spintex Road'        },
  { href: '/listings?neighborhood=Cantonments',         label: 'Cantonments'         },
  { href: '/listings?neighborhood=Labone',              label: 'Labone'              },
]

export default function Nav() {
  const pathname  = usePathname()
  const [open,    setOpen]    = useState(false)
  const [openKey, setOpenKey] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (open) setOpenKey(k => k + 1)
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const isHome = pathname === '/'
  const onHero = isHome && !scrolled
  const close  = () => setOpen(false)

  return (
    <>
      <header className={cn(
        'fixed top-0 inset-x-0 z-50 h-16 transition-all duration-300',
        onHero ? 'bg-transparent border-b border-transparent' : 'bg-white border-b border-border-col shadow-nav'
      )}>
        <div className="max-w-content mx-auto px-4 lg:px-8 h-full flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" onClick={close}>
            <div className="w-8 h-8 rounded-full bg-ghana-green flex items-center justify-center flex-shrink-0">
              <span className="text-ghana-gold font-display font-bold text-xs leading-none">FD</span>
            </div>
            <div className="leading-none">
              <span className={cn('font-display font-bold text-sm transition-colors', onHero ? 'text-white' : 'text-ink')}>
                Find Direct
              </span>
              <span className={cn('block text-[10px] font-medium tracking-wide transition-colors', onHero ? 'text-ghana-gold-flag' : 'text-ghana-green')}>
                Ghana
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {links.map(l => (
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

          {/* Desktop CTA */}
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

          {/* Mobile hamburger — icon cross-fade */}
          <button
            onClick={() => setOpen(v => !v)}
            className={cn(
              'md:hidden relative w-9 h-9 flex items-center justify-center rounded-btn transition-colors z-[60]',
              open ? 'text-white' : onHero ? 'text-white' : 'text-ink'
            )}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className={cn('absolute inset-0 flex items-center justify-center transition-all duration-200',
              open ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-75')}>
              <X className="w-5 h-5" />
            </span>
            <span className={cn('absolute inset-0 flex items-center justify-center transition-all duration-200',
              open ? 'opacity-0 -rotate-90 scale-75' : 'opacity-100 rotate-0 scale-100')}>
              <Menu className="w-5 h-5" />
            </span>
          </button>
        </div>
      </header>

      {/* ── MOBILE MEGA MENU — always mounted, CSS transform slide ── */}
      <div
        className={cn(
          'fixed inset-0 z-40 md:hidden transition-transform duration-300 ease-in-out will-change-transform',
          open ? 'translate-y-0' : '-translate-y-full'
        )}
        aria-hidden={!open}
      >
        {/* Dark green backdrop */}
        <div className="absolute inset-0 bg-ghana-green-dark" />

        {/* Subtle kente dot texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }}
        />

        {/* Scrollable content — re-keyed each open so animations replay */}
        <div key={openKey} className="relative h-full overflow-y-auto pt-[72px] pb-10">
          <div className="px-5 flex flex-col gap-0 min-h-[calc(100%-72px)]">

            {/* Browse by Type */}
            <div className="mb-7">
              <p className="mega-item text-ghana-gold-flag/50 text-[10px] font-black tracking-[0.25em] uppercase mb-3"
                style={{ animationDelay: '0ms' }}>
                Browse by Type
              </p>
              <div className="grid grid-cols-2 gap-2">
                {menuCategories.map(({ href, label, Icon, accent }, i) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={close}
                    className="mega-item group flex items-center gap-3 rounded-card p-4 border border-white/[0.09] hover:border-white/25 transition-all duration-200"
                    style={{
                      animationDelay: `${(i + 1) * 55}ms`,
                      background: `${accent}11`,
                    }}
                  >
                    <div className="w-9 h-9 rounded-btn flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                      style={{ background: `${accent}22` }}>
                      <Icon className="w-4 h-4" style={{ color: accent }} />
                    </div>
                    <span className="text-white font-semibold text-sm leading-tight">{label}</span>
                    <ArrowRight className="w-3 h-3 text-white/20 ml-auto group-hover:text-white/50 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Neighborhood quick links */}
            <div className="mb-6">
              <div className="mega-item flex items-center gap-3 mb-3" style={{ animationDelay: '295ms' }}>
                <div className="h-px flex-1 bg-white/[0.07]" />
                <p className="text-white/25 text-[10px] font-bold tracking-[0.2em] uppercase">Neighborhoods</p>
                <div className="h-px flex-1 bg-white/[0.07]" />
              </div>
              <div className="grid grid-cols-2 gap-0.5">
                {menuAreas.map(({ href, label }, i) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={close}
                    className="mega-item group flex items-center gap-2 py-2.5 px-3 rounded-btn hover:bg-white/[0.07] transition-colors"
                    style={{ animationDelay: `${(i + 6) * 45}ms` }}
                  >
                    <MapPin className="w-3 h-3 text-ghana-gold flex-shrink-0" />
                    <span className="text-white/65 group-hover:text-white text-sm transition-colors">{label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Nav links */}
            <div className="border-t border-white/[0.07] pt-3 mb-6">
              {links.map(({ href, label }, i) => (
                <Link
                  key={href}
                  href={href}
                  onClick={close}
                  className={cn(
                    'mega-item flex items-center justify-between py-3 px-3 rounded-btn text-sm font-semibold transition-colors',
                    pathname === href
                      ? 'text-ghana-gold-flag'
                      : 'text-white/65 hover:text-white hover:bg-white/[0.05]'
                  )}
                  style={{ animationDelay: `${(i + 11) * 38}ms` }}
                >
                  {label}
                  {pathname === href && <span className="w-1.5 h-1.5 rounded-full bg-ghana-gold-flag" />}
                </Link>
              ))}
            </div>

            {/* CTA buttons — pushed to bottom */}
            <div className="mt-auto space-y-2.5 mega-item" style={{ animationDelay: '580ms' }}>
              <Link
                href="/list"
                onClick={close}
                className="flex items-center justify-center gap-2 w-full bg-ghana-gold-flag text-ghana-green-dark font-bold text-sm py-4 rounded-btn active:brightness-90 transition-all"
              >
                <Plus className="w-4 h-4" />
                List Your Property — Free
              </Link>
              <Link
                href="/listings"
                onClick={close}
                className="flex items-center justify-center gap-2 w-full bg-white/[0.07] border border-white/[0.12] text-white font-medium text-sm py-3.5 rounded-btn hover:bg-white/[0.12] transition-colors"
              >
                Browse All Listings
              </Link>
            </div>

            <p className="text-center text-white/15 text-[11px] mt-5 pb-2">
              No agents · No viewing fees · No commission
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
