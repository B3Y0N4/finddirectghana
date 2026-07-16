import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import {
  ArrowRight, CheckCircle, Shield, MessageCircle, MapPin,
  Home, Users, TrendingUp, Building2, Layers, Sofa,
} from 'lucide-react'
import PropertyCard from '@/components/PropertyCard'
import SearchBar from '@/components/SearchBar'
import { getListings } from '@/lib/data'
import type { PropertyType } from '@/lib/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Find Direct Ghana — Rent Directly from the Owner | No Agent Fees',
  description:
    'Browse verified owner-direct property listings in Accra, Ghana. No agents. No viewing fees. No commission. Contact landlords directly on WhatsApp.',
}

const neighborhoodData = [
  { name: 'East Legon',          city: 'Accra', tier: 'premium'    },
  { name: 'Airport Residential', city: 'Accra', tier: 'premium'    },
  { name: 'Cantonments',         city: 'Accra', tier: 'premium'    },
  { name: 'Labone',              city: 'Accra', tier: 'premium'    },
  { name: 'Osu',                 city: 'Accra', tier: 'mid'        },
  { name: 'Spintex Road',        city: 'Accra', tier: 'mid'        },
  { name: 'Haatso',              city: 'Accra', tier: 'mid'        },
  { name: 'Achimota',            city: 'Accra', tier: 'mid'        },
  { name: 'Adenta',              city: 'Accra', tier: 'affordable' },
  { name: 'Madina',              city: 'Accra', tier: 'affordable' },
  { name: 'Tema Community 9',    city: 'Tema',  tier: 'affordable' },
  { name: 'Ashaiman',            city: 'Tema',  tier: 'affordable' },
]

export default async function HomePage() {
  const properties = await getListings()
  const available     = properties.filter(p => p.status === 'available')
  const totalListings = properties.length
  const verifiedCount = properties.filter(p => p.verification_level === 'full').length

  const categoryCounts: Record<PropertyType, number> = {
    apartment:        available.filter(p => p.type === 'apartment').length,
    house:            available.filter(p => p.type === 'house').length,
    chamber_and_hall: available.filter(p => p.type === 'chamber_and_hall').length,
    studio:           available.filter(p => p.type === 'studio').length,
    townhouse:        available.filter(p => p.type === 'townhouse').length,
  }

  const latestAvailable = [...available]
    .sort((a, b) => new Date(b.listed_date).getTime() - new Date(a.listed_date).getTime())
    .slice(0, 6)

  function getCount(name: string) {
    return available.filter(p => p.neighborhood === name).length
  }

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="bg-ghana-green-dark min-h-[88vh] flex flex-col justify-center relative overflow-hidden">

        {/* Flag line at very top */}
        <div className="absolute top-0 left-0 right-0 flag-line z-10" />

        {/* Kente-inspired geometric texture */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `
            repeating-linear-gradient(0deg,   transparent, transparent 28px, rgba(255,255,255,0.6) 28px, rgba(255,255,255,0.6) 29px),
            repeating-linear-gradient(90deg,  transparent, transparent 28px, rgba(255,255,255,0.6) 28px, rgba(255,255,255,0.6) 29px)
          `,
        }} />

        {/* Gold glow accent — top right */}
        <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-ghana-gold-flag opacity-[0.06] blur-[120px] pointer-events-none" />
        {/* Green depth — bottom left */}
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-ghana-green opacity-[0.3] blur-[80px] pointer-events-none" />

        {/* Kente stripe accent — vertical right edge */}
        <div className="absolute right-0 top-0 bottom-0 w-2 flex flex-col">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="flex-1"
              style={{ background: ['#CC0001', '#FCD116', '#006B3F', '#12130F'][i % 4] }}
            />
          ))}
        </div>

        <div className="relative max-w-content mx-auto px-4 lg:px-8 pt-24 pb-10 sm:pt-32 sm:pb-14">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-ghana-gold-flag/12 border border-ghana-gold-flag/25 rounded-badge px-3 py-1.5 mb-6">
              <span className="text-ghana-gold-flag text-xs">★</span>
              <span className="text-ghana-gold-flag text-xs font-bold tracking-wider uppercase">
                Ghana&apos;s First Owner-Direct Rental Platform
              </span>
            </div>

            <h1
              className="font-display font-extrabold text-white mb-5 leading-[1.08] tracking-tight"
              style={{ fontSize: 'clamp(2rem,6.5vw,4rem)' }}
            >
              Find your next home.<br />
              <span className="text-ghana-gold-flag">Directly from the owner.</span>
            </h1>

            <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              No agents. No viewing fees. No commission. Browse verified listings and
              contact landlords directly on WhatsApp.
            </p>

            {/* Search */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-card p-3 mb-6">
              <Suspense fallback={<div className="h-14 bg-white/5 rounded-btn animate-pulse" />}>
                <SearchBar hero />
              </Suspense>
            </div>

            {/* Trust pills */}
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {['Zero Viewing Fees', 'Verified Owners', 'Real Prices', 'WhatsApp Direct'].map(label => (
                <span key={label} className="flex items-center gap-1.5 text-white/65 text-sm">
                  <CheckCircle className="w-3.5 h-3.5 text-ghana-gold-flag flex-shrink-0" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/8 bg-ink/40 backdrop-blur-sm">
          <div className="max-w-content mx-auto px-4 lg:px-8 py-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { value: `${totalListings}+`, label: 'Total Listings'     },
                { value: `${verifiedCount}`,  label: 'Verified Owners'    },
                { value: 'GHS 0',             label: 'Viewing Fee — Ever' },
                { value: '0%',                label: 'Commission'         },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="font-display font-bold text-ghana-gold text-2xl sm:text-3xl">{s.value}</p>
                  <p className="text-white/40 text-xs mt-1 uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY GRID — MARKETPLACE STYLE ───────────────────── */}
      <section className="bg-white border-b border-border-col">
        <div className="max-w-content mx-auto px-4 lg:px-8 py-7">
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-display font-bold text-ink text-base whitespace-nowrap">What are you looking for?</h2>
            <div className="h-px flex-1 bg-border-col" />
            <Link href="/listings" className="text-ghana-green text-xs font-semibold hover:underline whitespace-nowrap">
              View all →
            </Link>
          </div>

          {/* Main 2×2 category grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {/* All Properties — filled green */}
            <Link
              href="/listings"
              className="group relative bg-ghana-green text-white rounded-card p-5 hover:bg-ghana-green-dark transition-colors overflow-hidden"
            >
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-white/5 transition-transform duration-300 group-hover:scale-150" />
              <Home className="w-7 h-7 mb-3 relative z-10" />
              <p className="font-display font-bold text-base relative z-10 leading-snug">All Properties</p>
              <p className="text-white/55 text-xs mt-1 relative z-10">{available.length} available</p>
            </Link>

            {/* Apartments */}
            <Link
              href="/listings?type=apartment"
              className="group relative bg-white border-2 border-border-col hover:border-ghana-gold rounded-card p-5 overflow-hidden transition-all duration-200 hover:shadow-card"
            >
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-ghana-gold/[0.07] rounded-full transition-transform duration-300 group-hover:scale-150" />
              <Building2 className="w-7 h-7 text-ghana-gold mb-3" />
              <p className="font-display font-bold text-ink text-base group-hover:text-ghana-gold transition-colors leading-snug">Apartments</p>
              <p className="text-muted text-xs mt-1">{categoryCounts.apartment} listings</p>
            </Link>

            {/* Houses */}
            <Link
              href="/listings?type=house"
              className="group relative bg-white border-2 border-border-col hover:border-ghana-green rounded-card p-5 overflow-hidden transition-all duration-200 hover:shadow-card"
            >
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-ghana-green/[0.07] rounded-full transition-transform duration-300 group-hover:scale-150" />
              <Home className="w-7 h-7 text-ghana-green mb-3" />
              <p className="font-display font-bold text-ink text-base group-hover:text-ghana-green transition-colors leading-snug">Houses</p>
              <p className="text-muted text-xs mt-1">{categoryCounts.house} listings</p>
            </Link>

            {/* Studios */}
            <Link
              href="/listings?type=studio"
              className="group relative bg-white border-2 border-border-col hover:border-ghana-red rounded-card p-5 overflow-hidden transition-all duration-200 hover:shadow-card"
            >
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-ghana-red/[0.06] rounded-full transition-transform duration-300 group-hover:scale-150" />
              <Sofa className="w-7 h-7 text-ghana-red mb-3" />
              <p className="font-display font-bold text-ink text-base group-hover:text-ghana-red transition-colors leading-snug">Studios</p>
              <p className="text-muted text-xs mt-1">{categoryCounts.studio} listings</p>
            </Link>
          </div>

          {/* Chamber & Hall — wide accent card */}
          <Link
            href="/listings?type=chamber_and_hall"
            className="group flex items-center gap-4 bg-ghana-gold-50 border-2 border-ghana-gold/20 hover:border-ghana-gold rounded-card px-5 py-4 transition-all duration-200 hover:shadow-card"
          >
            <div className="w-10 h-10 bg-ghana-gold/15 rounded-btn flex items-center justify-center flex-shrink-0">
              <Layers className="w-5 h-5 text-ghana-gold-dark" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-ink text-sm group-hover:text-ghana-gold-dark transition-colors">Chamber &amp; Hall</p>
              <p className="text-muted text-xs mt-0.5">{categoryCounts.chamber_and_hall} listings · Affordable family homes across Accra</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-ghana-gold-dark transition-colors flex-shrink-0" />
          </Link>
        </div>
      </section>

      {/* ── LANDLORD STRIP ───────────────────────────────────────── */}
      <section className="bg-ghana-green-dark">
        <div className="flag-line" />
        <div className="max-w-content mx-auto px-4 lg:px-8 py-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-white font-display font-bold text-base">Are you a landlord?</p>
            <p className="text-white/50 text-xs mt-0.5">List free · No agents · Direct WhatsApp contact</p>
          </div>
          <Link
            href="/list"
            className="flex items-center gap-2 bg-ghana-gold-flag text-ghana-green-dark font-bold text-sm px-5 py-2.5 rounded-btn hover:brightness-110 transition-all flex-shrink-0"
          >
            List Free →
          </Link>
        </div>
      </section>

      {/* ── NEIGHBORHOOD GRID ────────────────────────────────────── */}
      <section className="py-14 lg:py-20 bg-page-bg">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-0.5 bg-ghana-gold rounded" />
                <p className="text-ghana-gold text-xs font-bold tracking-widest uppercase">By Location</p>
              </div>
              <h2 className="font-display font-bold text-ink text-2xl sm:text-3xl">Browse by Neighborhood</h2>
              <p className="text-muted text-sm mt-1">Click any area to see available properties</p>
            </div>
            <Link
              href="/listings"
              className="hidden sm:flex items-center gap-1.5 text-ghana-green font-semibold text-sm hover:gap-2.5 transition-all"
            >
              All areas <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {neighborhoodData.map(n => {
              const count = getCount(n.name)
              return (
                <Link
                  key={n.name}
                  href={`/listings?neighborhood=${encodeURIComponent(n.name)}`}
                  className="group relative bg-white border border-border-col rounded-card p-4 hover:border-ghana-green hover:shadow-card transition-all duration-200 overflow-hidden"
                >
                  {/* Colored left accent bar per tier */}
                  <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-l-card transition-all duration-200 ${
                    n.tier === 'premium'    ? 'bg-ghana-gold   group-hover:w-1' :
                    n.tier === 'mid'        ? 'bg-ghana-green  group-hover:w-1' :
                                             'bg-muted/30      group-hover:w-1'
                  }`} />
                  <div className="flex items-start justify-between mb-3">
                    <MapPin className="w-4 h-4 text-ghana-gold flex-shrink-0 mt-0.5" />
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-badge ${
                      n.tier === 'premium'
                        ? 'bg-ghana-gold-50 text-ghana-gold-dark border border-ghana-gold/20'
                        : n.tier === 'mid'
                          ? 'bg-ghana-green-50 text-ghana-green border border-ghana-green-100'
                          : 'bg-stone-100 text-muted border border-stone-200'
                    }`}>
                      {n.tier === 'premium' ? 'Premium' : n.tier === 'mid' ? 'Mid-range' : 'Affordable'}
                    </span>
                  </div>
                  <p className="font-display font-semibold text-ink text-sm group-hover:text-ghana-green transition-colors leading-snug">
                    {n.name}
                  </p>
                  <p className="text-muted text-xs mt-0.5">{n.city}</p>
                  <p className="mt-3 text-sm font-bold text-ghana-green">
                    {count > 0
                      ? `${count} listing${count > 1 ? 's' : ''}`
                      : <span className="text-muted font-normal text-xs">Be first to list</span>}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FRESH LISTINGS ───────────────────────────────────────── */}
      <section className="py-14 lg:py-20 bg-white border-y border-border-col">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-0.5 bg-ghana-gold rounded" />
                <p className="text-ghana-gold text-xs font-bold tracking-widest uppercase">Fresh Listings</p>
              </div>
              <h2 className="font-display font-bold text-ink text-2xl sm:text-3xl">Latest verified properties</h2>
              <p className="text-muted text-sm mt-1">Every owner confirmed. Every price real.</p>
            </div>
            <Link
              href="/listings"
              className="hidden sm:flex items-center gap-1.5 text-ghana-green font-semibold text-sm hover:gap-2.5 transition-all"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestAvailable.map((p, i) => (
              <PropertyCard key={p.slug} property={p} priority={i < 3} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/listings"
              className="inline-flex items-center gap-2 bg-ghana-green text-white text-sm font-semibold px-6 py-3 rounded-btn"
            >
              View all properties <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (compact) ───────────────────────────────── */}
      <section className="py-14 lg:py-20 bg-page-bg">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-5 h-0.5 bg-ghana-gold rounded" />
              <p className="text-ghana-gold text-xs font-bold tracking-widest uppercase">Simple Process</p>
              <div className="w-5 h-0.5 bg-ghana-gold rounded" />
            </div>
            <h2 className="font-display font-bold text-ink text-2xl sm:text-3xl">Find a home in 3 steps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10 relative">
            {/* Connector line desktop */}
            <div className="hidden md:block absolute top-7 left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-px border-t border-dashed border-border-col" />

            {[
              {
                icon: <Home className="w-6 h-6 text-ghana-green" />,
                step: '01',
                title: 'Browse Verified Listings',
                desc: "Search by neighborhood, type, and price. Every listing shows real photos and the actual owner's contact.",
              },
              {
                icon: <MessageCircle className="w-6 h-6 text-ghana-green" />,
                step: '02',
                title: 'Contact on WhatsApp',
                desc: 'Speak directly to the landlord. No agent in the middle. No viewing fee to pay first.',
              },
              {
                icon: <CheckCircle className="w-6 h-6 text-ghana-green" />,
                step: '03',
                title: 'Visit & Move In',
                desc: 'Visit only what matches your needs. Transparent price, no hidden agent commission.',
              },
            ].map(item => (
              <div key={item.step} className="text-center relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ghana-green border-2 border-ghana-green-light mb-5 relative z-10">
                  {item.icon && <span className="[&>*]:text-white">{item.icon}</span>}
                </div>
                <p className="font-display font-black text-ghana-gold text-sm tracking-widest mb-2">{item.step}</p>
                <h3 className="font-display font-semibold text-ink text-lg mb-3">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-1.5 border border-border-col text-ink font-semibold text-sm px-5 py-2.5 rounded-btn hover:border-ghana-green hover:text-ghana-green transition-colors"
            >
              Learn more about how it works <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST ────────────────────────────────────────────────── */}
      <section className="py-14 lg:py-20 bg-white border-t border-border-col">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-0.5 bg-ghana-gold rounded" />
                <p className="text-ghana-gold text-xs font-bold tracking-widest uppercase">Built on Trust</p>
              </div>
              <h2 className="font-display font-bold text-ink text-2xl sm:text-3xl lg:text-4xl mb-5 leading-tight">
                Every listing is verified.<br />Every owner is real.
              </h2>
              <p className="text-muted leading-relaxed mb-8 text-base">
                Ghana&apos;s rental market has a trust problem. Fake listings, inflated prices,
                agents showing wrong properties — we built Find Direct Ghana to eliminate all of it.
              </p>
              <div className="space-y-5">
                {[
                  { icon: <Shield      className="w-5 h-5 text-ghana-green" />, title: 'Ghana Card Verification', desc: 'Verified owners submit Ghana Card for identity confirmation.' },
                  { icon: <MapPin      className="w-5 h-5 text-ghana-green" />, title: 'Exact Location Pinned',   desc: 'Every listing shows the real location on a map before you visit.' },
                  { icon: <CheckCircle className="w-5 h-5 text-ghana-green" />, title: 'Availability Confirmed',  desc: 'Listings auto-deactivate if not updated. No ghost listings.' },
                  { icon: <TrendingUp  className="w-5 h-5 text-ghana-green" />, title: 'Real Market Prices',      desc: 'Owners set their real price. No agent markup. No hidden fees.' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-card bg-ghana-green-50 border border-ghana-green-100 flex items-center justify-center mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-ink text-sm mb-1">{item.title}</h4>
                      <p className="text-muted text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-ghana-green-dark rounded-card p-8 text-white relative overflow-hidden">
              {/* Kente accent inside card */}
              <div className="absolute top-0 left-0 right-0 h-1 flex">
                <div className="flex-1 bg-ghana-red" />
                <div className="flex-1 bg-ghana-gold-flag" />
                <div className="flex-1 bg-ghana-green" />
              </div>
              <p className="text-ghana-gold font-bold text-xs tracking-widest uppercase mb-6 mt-2">Listing Trust Score</p>
              {[
                ['Property Photos', 'Verified as original',   true],
                ['Owner Identity',  'Ghana Card confirmed',   true],
                ['Listed Price',    'Confirmed by owner',     true],
                ['Availability',    'Updated within 7 days',  true],
                ['Platform Rating', '0 fraud reports',        true],
              ].map(([label, detail, ok]) => (
                <div key={String(label)} className="flex items-center justify-between py-3.5 border-b border-white/8 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-white/40 text-xs mt-0.5">{detail as string}</p>
                  </div>
                  {ok && (
                    <span className="flex items-center gap-1.5 text-ghana-gold text-xs font-bold">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>
              ))}
              <div className="mt-6 bg-ghana-gold/12 border border-ghana-gold/25 rounded-card p-4 text-center">
                <p className="text-ghana-gold font-display font-bold text-3xl">5 / 5</p>
                <p className="text-white/50 text-xs mt-1 uppercase tracking-wide">Fully Verified Listing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LANDLORD CTA ─────────────────────────────────────────── */}
      <section className="py-16 lg:py-24 bg-ghana-green-dark relative overflow-hidden">
        {/* Kente stripe top */}
        <div className="absolute top-0 left-0 right-0 flex h-1">
          <div className="flex-1 bg-ghana-red" />
          <div className="flex-1 bg-ghana-gold-flag" />
          <div className="flex-1 bg-ghana-green" />
        </div>
        {/* Kente stripe bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex h-1">
          <div className="flex-1 bg-ghana-green" />
          <div className="flex-1 bg-ghana-gold-flag" />
          <div className="flex-1 bg-ghana-red" />
        </div>
        {/* Dot grid texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px,white 1px,transparent 0)', backgroundSize: '24px 24px' }}
        />

        <div className="relative max-w-content mx-auto px-4 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ghana-gold/15 border border-ghana-gold/30 mb-6">
            <Users className="w-8 h-8 text-ghana-gold" />
          </div>
          <h2 className="font-display font-bold text-white text-2xl sm:text-3xl lg:text-4xl mb-4">
            Are you a landlord?
          </h2>
          <p className="text-white/55 text-base sm:text-lg max-w-lg mx-auto mb-8 leading-relaxed">
            List your property for free. Reach verified tenants in Accra
            searching right now — no agent, no commission, no fees.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/list"
              className="flex items-center gap-2 bg-ghana-gold text-ink font-bold px-8 py-4 rounded-btn hover:bg-ghana-gold-dark hover:text-white transition-colors"
            >
              List Your Property — Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/how-it-works#landlords"
              className="text-white/60 font-medium text-sm hover:text-white transition-colors"
            >
              How does it work? →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
