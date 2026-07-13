'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Bed, Bath, MapPin, CheckCircle, MessageCircle, Eye } from 'lucide-react'
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

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={p.images[0]}
          alt={p.title}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          priority={priority}
        />

        {/* Status overlay */}
        {isRented && (
          <div className="absolute inset-0 bg-ink/40 flex items-center justify-center">
            <span className="bg-ghana-red text-white text-xs font-bold px-3 py-1.5 rounded-badge tracking-wider uppercase">
              Rented
            </span>
          </div>
        )}

        {/* Verification badge */}
        {!isRented && (
          <div className="absolute top-3 left-3">
            {p.verification_level === 'full' ? (
              <span className="flex items-center gap-1 bg-ghana-green text-white text-[10px] font-bold px-2 py-1 rounded-badge">
                <CheckCircle className="w-2.5 h-2.5" />
                Verified Owner
              </span>
            ) : p.verification_level === 'phone' ? (
              <span className="flex items-center gap-1 bg-white/90 text-ghana-green text-[10px] font-bold px-2 py-1 rounded-badge border border-ghana-green/30">
                <CheckCircle className="w-2.5 h-2.5" />
                Phone Verified
              </span>
            ) : null}
          </div>
        )}

        {/* Furnished badge */}
        {p.furnished && !isRented && (
          <div className="absolute top-3 right-3">
            <span className="bg-ghana-gold text-ink text-[10px] font-bold px-2 py-1 rounded-badge">
              Furnished
            </span>
          </div>
        )}

        {/* Price */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/75 to-transparent pt-8 pb-3 px-4">
          <p className="text-white font-display font-bold text-lg leading-none">
            {formatPrice(p.price_ghs)}
            <span className="text-white/60 font-normal text-xs ml-1">/month</span>
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-[10px] font-semibold text-ghana-green tracking-wider uppercase">
            {propertyTypeLabel(p.type)}
          </span>
          <span className="flex items-center gap-1 text-[10px] text-muted">
            <Eye className="w-3 h-3" />
            {p.views}
          </span>
        </div>

        <Link href={`/property/${p.slug}`}>
          <h3 className="font-display font-semibold text-ink text-sm leading-snug clamp-2 group-hover:text-ghana-green transition-colors mb-2">
            {p.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-muted text-xs mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          {p.neighborhood}, {p.city}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-ink border-t border-border-col pt-3 mb-3">
          <span className="flex items-center gap-1">
            <Bed className="w-3.5 h-3.5 text-muted" />
            {bedroomLabel(p.bedrooms)}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3.5 h-3.5 text-muted" />
            {p.bathrooms} Bath
          </span>
          {p.size_sqm && (
            <span className="text-muted">{p.size_sqm} m²</span>
          )}
        </div>

        {/* Owner row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-ghana-green-50 border border-ghana-green-100 flex items-center justify-center">
              <span className="text-ghana-green text-[10px] font-bold">{p.owner.initials}</span>
            </div>
            <div>
              <p className="text-[11px] font-medium text-ink">{p.owner.name}</p>
              <p className="text-[9px] text-muted">Owner · {p.owner.response_rate}% response</p>
            </div>
          </div>

          {!isRented && (
            <a
              href={waLink(p.owner.phone, p.title)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-[#25D366] text-white text-[10px] font-bold px-3 py-1.5 rounded-btn hover:bg-[#20b858] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="w-3 h-3 fill-white" />
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
