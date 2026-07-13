import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import {
  ArrowRight, CheckCircle, Shield, MessageCircle, MapPin,
  Home, Users, TrendingUp, Building2, Layers, Sofa,
} from 'lucide-react'
import PropertyCard from '@/components/PropertyCard'
import SearchBar from '@/components/SearchBar'
import { properties } from '@/lib/properties'
import type { PropertyType } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Find Direct Ghana — Rent Directly from the Owner | No Agent Fees',
  description:
    'Browse verified owner-direct property listings in Accra, Ghana. No agents. No viewing fees. No commission. Contact landlords directly on WhatsApp.',
}

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

function getCount(name: string) {
  return available.filter(p => p.neighborhood === name).length
}

const latestAvailable = [...available]
  .sort((a, b) => new Date(b.listed_date).getTime() - new Date(a.listed_date).getTime())
  .slice(0, 6)

export default function HomePage() {
  return (
    <>
      {/* ── FLAG ACCENT ──────────────────────────────────────────── */}
      <div className="flag-line" />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="bg-ghana-green-dark min-h-[82vh] flex flex-col justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px,white 1px,transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-ghana-green/15 to-transparent pointer-events-none" />

        <div className="relative max-w-content mx-auto px-4 lg:px-8 pt-24 pb-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-ghana-gold/15 border border-ghana-gold/30 rounded-badge px-3 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-ghana-gold animate-pulse" />
              <span className="text-ghana-gold text-xs font-bold tracking-wide">
                Ghana&apos;s First Owner-Direct Rental Platform
              </span>
            </div>

            <h1
              className="font-display font-bold text-white mb-4 leading-[1.1]"
              style={{ fontSize: 'clamp(2rem,5vw,3.75rem)' }}
            >
              Find your next home.<br />
              <span className="text-ghana-gold">Directly from the owner.</span>
            </h1>

            <p className="text-white/55 text-lg leading-relaxed mb-8 max-w-xl">
              No agents. No viewing fees. No commission. Browse verified listings and
              contact landlords directly on WhatsApp.
            </p>

            {/* Search */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-card p-3 mb-5">
              <Suspense fallback={<div className="h-14 bg-white/5 rounded-btn animate-pulse" />}>
                <SearchBar hero />
              </Suspense>
            </div>

            {/* Trust pills */}
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {['Zero Viewing Fees', 'Verified Owners', 'Real Prices', 'WhatsApp Direct'].map(p => (
                <span key={p} className="flex items-center gap-1.5 text-white/70 text-sm">
                  <CheckCircle className="w-3.5 h-3.5 text-ghana-gold flex-shrink-0" />
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/8 bg-black/25 backdrop-blur-sm">
          <div className="max-w-content mx-auto px-4 lg:px-8 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { value: `${totalListings}+`, label: 'Total Listings'      },
                { value: `${verifiedCount}`,  label: 'Verified Owners'     },
                { value: 'GHS 0',             label: 'Viewing Fee — Ever'  },
                { value: '0%',                label: 'Commission Charged'  },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <p className="font-display font-bold text-ghana-gold text-xl sm:text-2xl">{s.value}</p>
                  <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY PILLS ───────────────────────────────────────── */}
      <section className="bg-white border-b border-border-col">
        <div className="max-w-content mx-auto px-4 lg:px-8 py-5">
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3">Browse by type</p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/listings"
              className="flex items-center gap-2 px-4 py-2 border-2 border-ghana-green bg-ghana-green text-white rounded-btn text-sm font-semibold hover:bg-ghana-green-dark transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              All Properties
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[11px]">{available.length}</span>
            </Link>
            {([
              { type: 'apartment',        label: 'Apartments',    icon: <Building2 className="w-3.5 h-3.5" /> },
              { type: 'house',            label: 'Houses',        icon: <Home      className="w-3.5 h-3.5" /> },
              { type: 'chamber_and_hall', label: 'Chamber & Hall',icon: <Layers    className="w-3.5 h-3.5" /> },
              { type: 'studio',           label: 'Studios',       icon: <Sofa      className="w-3.5 h-3.5" /> },
            ] as { type: PropertyType; label: string; icon: React.ReactNode }[]).map(({ type, label, icon }) => (
              <Link
                key={type}
                href={`/listings?type=${type}`}
                className="flex items-center gap-2 px-4 py-2 border border-border-col rounded-btn text-sm font-medium text-ink hover:border-ghana-green hover:text-ghana-green transition-colors bg-white"
              >
                {icon} {label}
                <span className="text-muted text-xs ml-0.5">({categoryCounts[type]})</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEIGHBORHOOD GRID ────────────────────────────────────── */}
      <section className="py-12 lg:py-16 bg-page-bg">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-ghana-green text-xs font-semibold tracking-widest uppercase mb-2">By Location</p>
              <h2 className="font-display font-bold text-ink text-2xl sm:text-3xl">Browse by Neighborhood</h2>
              <p className="text-muted text-sm mt-1">Click any area to see available properties</p>
            </div>
            <Link
              href="/listings"
              className="hidden sm:flex items-center gap-1.5 text-ghana-green font-semibold text-sm hover:underline"
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
                  className="group bg-white border border-border-col rounded-card p-4 hover:border-ghana-green hover:shadow-card-hover transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-2.5">
                    <MapPin className="w-4 h-4 text-ghana-green flex-shrink-0 mt-0.5" />
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-badge ${
                      n.tier === 'premium'    ? 'bg-ghana-gold/15 text-ghana-gold-dark' :
                      n.tier === 'mid'        ? 'bg-ghana-green-50 text-ghana-green'    :
                                                'bg-stone-100 text-muted'
                    }`}>
                      {n.tier === 'premium' ? 'Premium' : n.tier === 'mid' ? 'Mid-range' : 'Affordable'}
                    </span>
                  </div>
                  <p className="font-display font-semibold text-ink text-sm group-hover:text-ghana-green transition-colors leading-snug">
                    {n.name}
                  </p>
                  <p className="text-muted text-xs mt-0.5">{n.city}</p>
                  <p className="mt-2.5 text-sm font-bold text-ghana-green">
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
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-ghana-green text-xs font-semibold tracking-widest uppercase mb-2">Fresh Listings</p>
              <h2 className="font-display font-bold text-ink text-2xl sm:text-3xl">Latest verified properties</h2>
            </div>
            <Link
              href="/listings"
              className="hidden sm:flex items-center gap-1.5 text-ghana-green font-semibold text-sm hover:underline hover:gap-2.5 transition-all"
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
      <section className="py-12 lg:py-16 bg-page-bg">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-ghana-green text-xs font-semibold tracking-widest uppercase mb-3">Simple Process</p>
            <h2 className="font-display font-bold text-ink text-2xl sm:text-3xl">Find a home in 3 steps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
                desc: 'Tap "WhatsApp" and speak directly to the landlord. No agent in the middle. No viewing fee to pay first.',
              },
              {
                icon: <CheckCircle className="w-6 h-6 text-ghana-green" />,
                step: '03',
                title: 'Visit & Move In',
                desc: 'Visit only what matches your needs. Deal directly. Transparent price, no hidden agent commission.',
              },
            ].map(item => (
              <div key={item.step} className="text-center px-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ghana-green-50 border border-ghana-green-100 mb-4">
                  {item.icon}
                </div>
                <p className="text-ghana-green font-bold text-xs tracking-widest mb-2">{item.step}</p>
                <h3 className="font-display font-semibold text-ink text-lg mb-3">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/how-it-works" className="text-ghana-green font-semibold text-sm hover:underline">
              Learn more about how it works →
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST ────────────────────────────────────────────────── */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-ghana-green text-xs font-semibold tracking-widest uppercase mb-4">Built on Trust</p>
              <h2 className="font-display font-bold text-ink text-2xl sm:text-3xl lg:text-4xl mb-6">
                Every listing is verified.<br />Every owner is real.
              </h2>
              <p className="text-muted leading-relaxed mb-8">
                Ghana&apos;s rental market has a trust problem. Fake listings, inflated prices,
                agents showing wrong properties — we built Find Direct Ghana to eliminate all of it.
              </p>
              <div className="space-y-4">
                {[
                  { icon: <Shield    className="w-5 h-5 text-ghana-green" />, title: 'Ghana Card Verification', desc: 'Verified owners submit Ghana Card for identity confirmation.' },
                  { icon: <MapPin    className="w-5 h-5 text-ghana-green" />, title: 'Exact Location Pinned',   desc: 'Every listing shows the real location on a map before you visit.' },
                  { icon: <CheckCircle className="w-5 h-5 text-ghana-green" />, title: 'Availability Confirmed',  desc: 'Listings auto-deactivate if not updated. No ghost listings.' },
                  { icon: <TrendingUp  className="w-5 h-5 text-ghana-green" />, title: 'Real Market Prices',    desc: 'Owners set their real price. No agent markup. No hidden fees.' },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-ghana-green-50 flex items-center justify-center mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-ink text-sm mb-0.5">{item.title}</h4>
                      <p className="text-muted text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-ghana-green-dark rounded-card p-8 text-white">
              <p className="text-ghana-gold font-semibold text-xs tracking-widest uppercase mb-6">Listing Trust Score</p>
              {[
                ['Property Photos', 'Verified as original',    true],
                ['Owner Identity',  'Ghana Card confirmed',    true],
                ['Listed Price',    'Confirmed by owner',      true],
                ['Availability',    'Updated within 7 days',   true],
                ['Platform Rating', '0 fraud reports',         true],
              ].map(([label, detail, ok]) => (
                <div key={String(label)} className="flex items-center justify-between py-3 border-b border-white/10 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-white/45 text-xs">{detail as string}</p>
                  </div>
                  {ok && (
                    <span className="flex items-center gap-1 text-ghana-gold text-xs font-bold">
                      <CheckCircle className="w-4 h-4" /> Verified
                    </span>
                  )}
                </div>
              ))}
              <div className="mt-6 bg-ghana-gold/15 border border-ghana-gold/30 rounded-btn p-4 text-center">
                <p className="text-ghana-gold font-bold text-2xl">5 / 5</p>
                <p className="text-white/60 text-xs mt-1">Fully Verified Listing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LANDLORD CTA ─────────────────────────────────────────── */}
      <section className="py-14 lg:py-20 bg-ghana-gold">
        <div className="max-w-content mx-auto px-4 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-ink/10 mb-6">
            <Users className="w-7 h-7 text-ink" />
          </div>
          <h2 className="font-display font-bold text-ink text-2xl sm:text-3xl lg:text-4xl mb-4">
            Are you a landlord?
          </h2>
          <p className="text-ink/65 text-lg max-w-lg mx-auto mb-8">
            List your property for free. Reach thousands of verified tenants in Accra
            who are searching right now — no agent needed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/list"
              className="flex items-center gap-2 bg-ink text-white font-semibold px-8 py-4 rounded-btn hover:bg-ghana-green-dark transition-colors"
            >
              List Your Property — Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/how-it-works#landlords"
              className="text-ink/70 font-medium text-sm hover:text-ink transition-colors underline underline-offset-4"
            >
              How does it work?
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
