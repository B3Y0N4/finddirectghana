'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Bed, Bath, MapPin, CheckCircle, MessageCircle } from 'lucide-react'
import type { Property } from '@/lib/types'
import { formatPrice, propertyTypeLabel, bedroomLabel, waLink, cn } from '@/lib/utils'

interface Props {
  property: Property
  priority?: boolean
}

export default function PropertyCard({ property: p, priority = false }: Props) {
  const isRented = p.status === 'rented'

  return (
    <article className={cn(
      'group bg-card-bg rounded-card border border-border-col overflow-hidden',
      'shadow-card hover:shadow-card-hover transition-all duration-300',
      isRented && 'opacity-70'
    )}>

      {/* ── IMAGE — links to detail page ─────────────────────── */}
      <Link href={`/property/${p.slug}`} className="block relative aspect-[4/3] overflow-hidden">
        <Image
          src={p.images[0]}
          alt={p.title}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          priority={priority}
        />

        {isRented && (
          <div className="absolute inset-0 bg-ink/40 flex items-center justify-center">
            <span className="bg-ghana-red text-white text-xs font-bold px-3 py-1.5 rounded-badge tracking-wider uppercase">Rented</span>
          </div>
        )}

        {/* Verification badge */}
        {!isRented && (
          <div className="absolute top-3 left-3">
            {p.verification_level === 'full' ? (
              <span className="flex items-center gap-1 bg-ghana-green text-white text-[10px] font-bold px-2.5 py-1.5 rounded-badge shadow-sm">
                <CheckCircle className="w-2.5 h-2.5" /> Verified Owner
              </span>
            ) : p.verification_level === 'phone' ? (
              <span className="flex items-center gap-1 bg-white/95 backdrop-blur-sm text-ghana-green text-[10px] font-bold px-2.5 py-1.5 rounded-badge border border-ghana-green/25 shadow-sm">
                <CheckCircle className="w-2.5 h-2.5" /> Phone Verified
              </span>
            ) : null}
          </div>
        )}

        {p.furnished && !isRented && (
          <div className="absolute top-3 right-3">
            <span className="bg-ghana-gold text-ink text-[10px] font-bold px-2.5 py-1.5 rounded-badge shadow-sm">Furnished</span>
          </div>
        )}

        {/* Price gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/80 to-transparent pt-8 pb-3 px-4">
          <p className="text-white font-display font-bold text-lg leading-none">
            {formatPrice(p.price_ghs)}
            <span className="text-white/55 font-normal text-xs ml-1">/month</span>
          </p>
        </div>
      </Link>

      {/* ── DETAILS — links to detail page ───────────────────── */}
      <Link href={`/property/${p.slug}`} className="block p-4 pb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-bold text-ghana-gold tracking-wider uppercase">
            {propertyTypeLabel(p.type)}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <Bed className="w-3.5 h-3.5" /> {bedroomLabel(p.bedrooms)}
            <span className="mx-0.5 text-border-col">·</span>
            <Bath className="w-3.5 h-3.5" /> {p.bathrooms}
          </span>
        </div>

        <h3 className="font-display font-semibold text-ink text-sm leading-snug clamp-2 group-hover:text-ghana-green transition-colors mb-2">
          {p.title}
        </h3>

        <div className="flex items-center gap-1 text-muted text-xs">
          <MapPin className="w-3 h-3 flex-shrink-0 text-ghana-green" />
          {p.neighborhood}, {p.city}
        </div>

        {/* Owner */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-col">
          <div className="w-6 h-6 rounded-full bg-ghana-green flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[9px] font-bold">{p.owner.initials}</span>
          </div>
          <p className="text-xs text-muted flex-1 min-w-0 truncate">{p.owner.name} · Owner</p>
        </div>
      </Link>

      {/* ── WHATSAPP CTA — full-width, high-contrast ──────────── */}
      {!isRented ? (
        <div className="px-4 pb-4">
          <a
            href={waLink(p.owner.phone, p.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white text-sm font-bold py-3 rounded-btn hover:bg-[#20b858] active:bg-[#1aa34a] transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            Contact on WhatsApp
          </a>
        </div>
      ) : (
        <div className="px-4 pb-4">
          <Link
            href={`/property/${p.slug}`}
            className="flex items-center justify-center gap-2 w-full bg-page-bg border border-border-col text-muted text-sm font-medium py-3 rounded-btn hover:bg-white transition-colors"
          >
            See similar listings
          </Link>
        </div>
      )}
    </article>
  )
}
