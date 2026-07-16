import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import {
  MapPin, CheckCircle, ArrowRight,
  Home, Building2, Layers, Sofa, MessageCircle,
} from 'lucide-react'
import PropertyCard from '@/components/PropertyCard'
import SearchBar    from '@/components/SearchBar'
import { getListings } from '@/lib/data'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Find Direct Ghana — Rent Directly from the Owner | No Agent Fees',
  description:
    'Browse verified owner-direct property listings in Accra, Ghana. No agents. No viewing fees. No commission. Contact landlords directly on WhatsApp.',
}

const NEIGHBORHOODS = [
  { name: 'East Legon',          tier: 'premium'    },
  { name: 'Airport Residential', tier: 'premium'    },
  { name: 'Cantonments',         tier: 'premium'    },
  { name: 'Labone',              tier: 'premium'    },
  { name: 'Osu',                 tier: 'mid'        },
  { name: 'Spintex Road',        tier: 'mid'        },
  { name: 'Haatso',              tier: 'mid'        },
  { name: 'Achimota',            tier: 'mid'        },
  { name: 'Adenta',              tier: 'affordable' },
  { name: 'Madina',              tier: 'affordable' },
  { name: 'Tema',                tier: 'affordable' },
  { name: 'Ashaiman',            tier: 'affordable' },
]

const CATEGORIES = [
  { href: '/listings',                       label: 'All',          Icon: Home,      pill: 'bg-ghana-green text-white border-ghana-green' },
  { href: '/listings?type=apartment',        label: 'Apartments',   Icon: Building2, pill: 'bg-white text-ink border-border-col hover:border-ghana-gold hover:text-ghana-gold' },
  { href: '/listings?type=house',            label: 'Houses',       Icon: Home,      pill: 'bg-white text-ink border-border-col hover:border-ghana-green hover:text-ghana-green' },
  { href: '/listings?type=chamber_and_hall', label: 'Chamber Hall', Icon: Layers,    pill: 'bg-white text-ink border-border-col hover:border-ghana-red hover:text-ghana-red' },
  { href: '/listings?type=studio',           label: 'Studios',      Icon: Sofa,      pill: 'bg-white text-ink border-border-col hover:border-ink' },
]

const TIER_STYLE: Record<string, string> = {
  premium:    'text-ghana-gold-dark bg-ghana-gold-50 border-ghana-gold/20',
  mid:        'text-ghana-green bg-ghana-green-50 border-ghana-green-100',
  affordable: 'text-muted bg-stone-100 border-stone-200',
}

const TIER_LABEL: Record<string, string> = {
  premium: 'Premium', mid: 'Mid-range', affordable: 'Affordable',
}

export default async function HomePage() {
  const properties      = await getListings()
  const available       = properties.filter(p => p.status === 'available')
  const latestAvailable = [...available]
    .sort((a, b) => new Date(b.listed_date).getTime() - new Date(a.listed_date).getTime())
    .slice(0, 6)

  const areaCount = (name: string) => available.filter(p => p.neighborhood === name).length

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────
          Mobile-first: compact, text visible immediately,
          search above the fold on all phones.
          No GPU-expensive blur circles or large DOM arrays.
      ─────────────────────────────────────────────────────────── */}
      <section className="bg-ghana-green-dark pt-16">
        <div className="flag-line" />

        <div className="px-4 pt-7 pb-6 max-w-2xl mx-auto lg:px-8 lg:pt-12 lg:pb-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-ghana-gold-flag/12 border border-ghana-gold-flag/25 rounded-badge px-3 py-1.5 mb-4">
            <span className="text-ghana-gold-flag text-[10px] font-bold tracking-wider uppercase">
              🇬🇭 Ghana&apos;s #1 Direct Rental Platform
            </span>
          </div>

          {/* Heading — clamp keeps it single-line on desktop, wraps on mobile */}
          <h1 className="font-display font-extrabold text-white leading-[1.1] mb-2"
              style={{ fontSize: 'clamp(1.6rem, 6vw, 3.2rem)' }}>
            Find your home.<br />
            <span className="text-ghana-gold-flag">No agent. No fees.</span>
          </h1>
          <p className="text-white/50 text-sm sm:text-base mb-5 leading-relaxed">
            Contact landlords directly on WhatsApp — zero commission.
          </p>

          {/* Search — client component, Suspense fallback is a skeleton */}
          <div className="bg-white/[0.08] border border-white/12 rounded-card p-2.5 mb-5">
            <Suspense fallback={
              <div className="h-12 bg-white/8 rounded-btn animate-pulse" aria-label="Loading search" />
            }>
              <SearchBar hero />
            </Suspense>
          </div>

          {/* Trust pills — text renders instantly, no JS */}
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              { icon: '✓', label: 'Zero Viewing Fees' },
              { icon: '✓', label: 'Verified Owners' },
              { icon: '✓', label: 'Real Prices' },
            ].map(t => (
              <span key={t.label} className="flex items-center gap-1.5 text-white/55 text-xs">
                <CheckCircle className="w-3 h-3 text-ghana-gold-flag flex-shrink-0" />
                {t.label}
              </span>
            ))}
          </div>
        </div>

        {/* Stats strip */}
        <div className="border-t border-white/8 bg-black/20">
          <div className="grid grid-cols-3 max-w-content mx-auto px-4 py-4">
            {[
              { v: `${available.length}+`, l: 'Listings' },
              { v: 'GHS 0',               l: 'Viewing Fee' },
              { v: '0%',                  l: 'Commission' },
            ].map(s => (
              <div key={s.l} className="text-center">
                <p className="font-display font-bold text-ghana-gold-flag text-2xl">{s.v}</p>
                <p className="text-white/35 text-[10px] uppercase tracking-wide mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY PILLS ───────────────────────────────────────
          Sticky below nav — horizontal scroll on mobile.
          No JS. Pure server render.
      ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-border-col sticky top-16 z-30 shadow-sm">
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-2.5">
          {CATEGORIES.map(({ href, label, Icon, pill }) => (
            <Link
              key={href}
              href={href}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-badge text-[13px] font-semibold border whitespace-nowrap transition-colors ${pill}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── LISTINGS ─────────────────────────────────────────────
          Available immediately — server rendered, no loading state.
      ─────────────────────────────────────────────────────────── */}
      <section className="bg-page-bg">
        <div className="max-w-content mx-auto px-4 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-ink text-lg">Available Now</h2>
              <p className="text-muted text-xs mt-0.5">
                {available.length > 0
                  ? `${available.length} verified propert${available.length === 1 ? 'y' : 'ies'}`
                  : 'Be the first to list'}
              </p>
            </div>
            <Link href="/listings" className="flex items-center gap-1 text-ghana-green text-sm font-semibold">
              See all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {latestAvailable.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {latestAvailable.map((p, i) => (
                  <PropertyCard key={p.slug} property={p} priority={i < 2} />
                ))}
              </div>
              {/* Mobile browse-all CTA below cards */}
              <Link
                href="/listings"
                className="sm:hidden mt-4 flex items-center justify-center gap-2 w-full bg-white border border-border-col text-ink font-semibold text-sm py-3.5 rounded-btn"
              >
                Browse all {available.length} properties
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          ) : (
            /* Empty state — show when no listings yet */
            <div className="text-center py-14 bg-white rounded-card border border-border-col">
              <p className="text-4xl mb-3">🏠</p>
              <p className="font-display font-bold text-ink text-base mb-1">
                First listings coming soon
              </p>
              <p className="text-muted text-sm max-w-xs mx-auto leading-relaxed">
                Be the first landlord on Find Direct Ghana. List your property — free, no agents, no commission.
              </p>
              <Link
                href="/list"
                className="inline-flex items-center gap-2 mt-5 bg-ghana-green text-white font-bold text-sm px-6 py-3 rounded-btn"
              >
                List Your Property Free →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── LANDLORD CTA STRIP ───────────────────────────────── */}
      <div className="px-4 lg:px-8 pb-6 max-w-content mx-auto">
        <div className="bg-ghana-green-dark rounded-card overflow-hidden">
          <div className="flag-line" />
          <div className="px-5 py-5 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-white font-display font-bold text-base">Have a property to rent?</p>
              <p className="text-white/50 text-xs mt-0.5">List free · No agents · Tenants contact you on WhatsApp</p>
            </div>
            <Link
              href="/list"
              className="flex-shrink-0 bg-ghana-gold-flag text-ghana-green-dark font-bold text-sm px-5 py-2.5 rounded-btn hover:brightness-105 transition-all"
            >
              List Free →
            </Link>
          </div>
        </div>
      </div>

      {/* ── NEIGHBORHOODS ────────────────────────────────────────
          Mobile: horizontal scroll chips (fast, thumb-friendly)
          Desktop: 4-col grid with tier badges
      ─────────────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-border-col py-7">
        <div className="max-w-content mx-auto">
          <div className="flex items-center justify-between mb-4 px-4 lg:px-8">
            <h2 className="font-display font-bold text-ink text-lg">Browse by Area</h2>
            <Link href="/listings" className="text-ghana-green text-xs font-semibold">View all</Link>
          </div>

          {/* Mobile scroll */}
          <div className="md:hidden flex gap-2.5 overflow-x-auto no-scrollbar px-4 pb-1">
            {NEIGHBORHOODS.map(n => {
              const count = areaCount(n.name)
              return (
                <Link
                  key={n.name}
                  href={`/listings?neighborhood=${encodeURIComponent(n.name)}`}
                  className="flex-shrink-0 w-36 bg-white border border-border-col rounded-card px-3.5 py-3.5 hover:border-ghana-green transition-colors"
                >
                  <div className="flex items-center gap-1 mb-1.5">
                    <MapPin className="w-3 h-3 text-ghana-gold flex-shrink-0" />
                    <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-badge border ${TIER_STYLE[n.tier]}`}>
                      {TIER_LABEL[n.tier]}
                    </span>
                  </div>
                  <p className="font-semibold text-ink text-sm leading-snug">{n.name}</p>
                  <p className={`text-xs font-bold mt-1.5 ${count > 0 ? 'text-ghana-green' : 'text-muted'}`}>
                    {count > 0 ? `${count} listing${count > 1 ? 's' : ''}` : 'Coming soon'}
                  </p>
                </Link>
              )
            })}
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-3 px-8">
            {NEIGHBORHOODS.map(n => {
              const count = areaCount(n.name)
              return (
                <Link
                  key={n.name}
                  href={`/listings?neighborhood=${encodeURIComponent(n.name)}`}
                  className="group bg-white border border-border-col rounded-card p-4 hover:border-ghana-green hover:shadow-card transition-all"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <MapPin className="w-4 h-4 text-ghana-gold" />
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-badge border ${TIER_STYLE[n.tier]}`}>
                      {TIER_LABEL[n.tier]}
                    </span>
                  </div>
                  <p className="font-semibold text-ink text-sm group-hover:text-ghana-green transition-colors leading-snug">
                    {n.name}
                  </p>
                  <p className={`text-xs font-bold mt-2 ${count > 0 ? 'text-ghana-green' : 'text-muted font-normal'}`}>
                    {count > 0 ? `${count} listing${count > 1 ? 's' : ''}` : 'Be first to list'}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — compact, mobile-first ─────────────── */}
      <section className="bg-page-bg border-t border-border-col py-7 px-4 lg:px-8">
        <div className="max-w-content mx-auto">
          <h2 className="font-display font-bold text-ink text-lg mb-5 text-center">How it works</h2>
          <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
            {[
              {
                n: '1',
                title: 'Browse verified listings',
                desc:  'Search by area, price or type. Every listing shows real photos and the owner\'s WhatsApp contact.',
                color: 'bg-ghana-green',
              },
              {
                n: '2',
                title: 'WhatsApp the landlord',
                desc:  'Contact directly — no agent in between, no viewing fee before you visit.',
                color: 'bg-ghana-gold',
              },
              {
                n: '3',
                title: 'Visit & move in',
                desc:  'See only what matches your needs. Transparent price, zero hidden commission.',
                color: 'bg-ghana-green-dark',
              },
            ].map(item => (
              <div key={item.n} className="flex items-start gap-4 sm:flex-col sm:items-center sm:text-center sm:flex-1">
                <div className={`w-9 h-9 rounded-full ${item.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-sm">{item.n}</span>
                </div>
                <div>
                  <p className="font-semibold text-ink text-sm mb-0.5">{item.title}</p>
                  <p className="text-muted text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHATSAPP CTA BANNER ───────────────────────────────── */}
      <section className="bg-[#25D366] py-5 px-4 lg:px-8">
        <div className="max-w-content mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Contact landlords on WhatsApp</p>
              <p className="text-white/70 text-xs">Every listing has a direct WhatsApp link — no middleman</p>
            </div>
          </div>
          <Link
            href="/listings"
            className="flex-shrink-0 bg-white text-[#128C7E] font-bold text-sm px-5 py-2.5 rounded-btn hover:bg-white/90 transition-colors"
          >
            Browse Listings
          </Link>
        </div>
      </section>
    </>
  )
}
