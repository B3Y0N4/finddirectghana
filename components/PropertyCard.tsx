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
      'bg-white rounded-card border border-border-col overflow-hidden shadow-card',
      isRented && 'opacity-70'
    )}>

      {/* IMAGE */}
      <Link href={`/property/${p.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-ghana-green-50">
        {p.images?.[0] && (
          <Image
            src={p.images[0]}
            alt={p.title}
            fill
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
            className="object-cover"
            priority={priority}
          />
        )}

        {isRented && (
          <div className="absolute inset-0 bg-ink/40 flex items-center justify-center">
            <span className="bg-ghana-red text-white text-xs font-bold px-3 py-1.5 rounded-badge tracking-wider uppercase">
              Rented
            </span>
          </div>
        )}

        {!isRented && p.verification_level === 'full' && (
          <span className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-ghana-green text-white text-[10px] font-bold px-2 py-1 rounded-badge">
            <CheckCircle className="w-2.5 h-2.5" /> Verified
          </span>
        )}

        {p.furnished && !isRented && (
          <span className="absolute top-2.5 right-2.5 bg-ghana-gold text-white text-[10px] font-bold px-2 py-1 rounded-badge">
            Furnished
          </span>
        )}

        {/* Price overlay */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-ink/80 to-transparent pt-8 pb-2.5 px-3">
          <p className="text-white font-display font-bold text-xl leading-none">
            {formatPrice(p.price_ghs)}
            <span className="text-white/55 font-normal text-xs ml-1">/mo</span>
          </p>
        </div>
      </Link>

      {/* DETAILS */}
      <Link href={`/property/${p.slug}`} className="block px-4 pt-3 pb-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-ghana-gold tracking-wide uppercase">
            {propertyTypeLabel(p.type)}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted">
            <Bed className="w-3.5 h-3.5" />
            {bedroomLabel(p.bedrooms)}
            <span className="mx-1 text-border-col">·</span>
            <Bath className="w-3.5 h-3.5" />
            {p.bathrooms}ba
          </span>
        </div>

        <h3 className="font-semibold text-ink text-sm leading-snug clamp-2 mb-2">
          {p.title}
        </h3>

        <div className="flex items-center gap-1 text-xs text-muted">
          <MapPin className="w-3 h-3 text-ghana-green flex-shrink-0" />
          {p.neighborhood}, {p.city}
        </div>
      </Link>

      {/* WHATSAPP */}
      <div className="px-4 pb-4 pt-1">
        {!isRented ? (
          <a
            href={waLink(p.owner.phone, p.title)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white text-sm font-bold py-3 rounded-btn active:bg-[#1aa34a] transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            Contact on WhatsApp
          </a>
        ) : (
          <Link
            href={`/property/${p.slug}`}
            className="flex items-center justify-center w-full bg-page-bg border border-border-col text-muted text-sm font-medium py-3 rounded-btn"
          >
            See similar listings
          </Link>
        )}
      </div>
    </article>
  )
}
