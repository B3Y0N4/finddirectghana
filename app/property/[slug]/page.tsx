import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Bed, Bath, Maximize2, MapPin, CheckCircle, Shield, MessageCircle,
  Phone, Calendar, Eye, ArrowLeft, Home, Star, AlertTriangle,
} from 'lucide-react'
import PropertyCard from '@/components/PropertyCard'
import PropertyContactBar from '@/components/PropertyContactBar'
import LandlordReviews from '@/components/LandlordReviews'
import { properties } from '@/lib/properties'
import { formatPrice, propertyTypeLabel, bedroomLabel, waLink } from '@/lib/utils'
import { getReviewsForLandlord, getLandlordRating } from '@/lib/reviews'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return properties.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = properties.find(p => p.slug === slug)
  if (!p) return {}
  return {
    title: `${p.title} — ${formatPrice(p.price_ghs)}/mo`,
    description: p.description.slice(0, 155),
  }
}

export default async function PropertyPage({ params }: Props) {
  const { slug } = await params
  const p = properties.find(p => p.slug === slug)
  if (!p) notFound()

  const related = properties
    .filter(q => q.slug !== p.slug && q.neighborhood === p.neighborhood && q.status === 'available')
    .slice(0, 3)

  const isRented    = p.status === 'rented'
  const landlordSlug = `landlord-${p.owner.name.toLowerCase().replace(/\s+/g, '-')}`
  const ownerReviews = getReviewsForLandlord(landlordSlug)
  const ownerRating  = getLandlordRating(landlordSlug)

  return (
    <div className="pt-nav pb-20 lg:pb-0">
      {/* Breadcrumb */}
      <div className="border-b border-border-col bg-white">
        <div className="max-w-content mx-auto px-4 lg:px-8 py-3 flex items-center gap-2 text-xs text-muted">
          <Link href="/" className="hover:text-ghana-green transition-colors flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <span>/</span>
          <Link href="/listings" className="hover:text-ghana-green transition-colors">Listings</Link>
          <span>/</span>
          <span className="text-ink font-medium truncate">{p.neighborhood}</span>
        </div>
      </div>

      {/* Photo gallery */}
      <div className="bg-ink">
        <div className="max-w-content mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 h-[300px] md:h-[440px]">
            <div className="relative overflow-hidden">
              <Image
                src={p.images[0]}
                alt={p.title}
                fill
                sizes="(max-width:768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              {isRented && (
                <div className="absolute inset-0 bg-ink/50 flex items-center justify-center">
                  <span className="bg-ghana-red text-white font-bold px-5 py-2 text-sm tracking-wider uppercase">Rented</span>
                </div>
              )}
            </div>
            <div className="hidden md:grid grid-rows-2 gap-1">
              {p.images.slice(1, 3).map((img, i) => (
                <div key={i} className="relative overflow-hidden">
                  <Image
                    src={img}
                    alt={`${p.title} photo ${i + 2}`}
                    fill
                    sizes="(max-width:1240px) 50vw, 600px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-content mx-auto px-4 lg:px-8 py-8">
        <Link href="/listings" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ghana-green transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left — main details */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between gap-4 mb-2">
              <span className="text-ghana-green text-xs font-semibold tracking-widest uppercase">
                {propertyTypeLabel(p.type)} · {p.neighborhood}, {p.city}
              </span>
              <span className="flex items-center gap-1 text-muted text-xs flex-shrink-0">
                <Eye className="w-3.5 h-3.5" /> {p.views} views
              </span>
            </div>

            <h1 className="font-display font-bold text-ink text-2xl sm:text-3xl leading-tight mb-3">
              {p.title}
            </h1>

            <div className="flex items-center gap-1.5 text-muted text-sm mb-5">
              <MapPin className="w-4 h-4 text-ghana-green flex-shrink-0" />
              {p.neighborhood}, {p.city}, Ghana
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { icon: <Bed className="w-4 h-4 text-ghana-green" />, label: 'Bedrooms', value: bedroomLabel(p.bedrooms) },
                { icon: <Bath className="w-4 h-4 text-ghana-green" />, label: 'Bathrooms', value: `${p.bathrooms} Bath` },
                { icon: <Maximize2 className="w-4 h-4 text-ghana-green" />, label: 'Size', value: p.size_sqm ? `${p.size_sqm} m²` : 'N/A' },
                { icon: <Home className="w-4 h-4 text-ghana-green" />, label: 'Type', value: propertyTypeLabel(p.type) },
              ].map(s => (
                <div key={s.label} className="bg-white border border-border-col rounded-card p-3">
                  <div className="flex items-center gap-1.5 mb-1">{s.icon}<span className="text-[10px] text-muted uppercase tracking-wider">{s.label}</span></div>
                  <p className="font-semibold text-ink text-sm">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="font-display font-semibold text-ink text-lg mb-3">About this property</h2>
              <p className="text-muted leading-relaxed text-sm">{p.description}</p>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h2 className="font-display font-semibold text-ink text-lg mb-3">Features & Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {p.features.map(f => (
                  <div key={f} className="flex items-center gap-2 bg-ghana-green-50 rounded-btn px-3 py-2">
                    <CheckCircle className="w-3.5 h-3.5 text-ghana-green flex-shrink-0" />
                    <span className="text-xs font-medium text-ink">{f}</span>
                  </div>
                ))}
                {p.furnished && (
                  <div className="flex items-center gap-2 bg-ghana-gold/10 rounded-btn px-3 py-2">
                    <CheckCircle className="w-3.5 h-3.5 text-ghana-gold-dark flex-shrink-0" />
                    <span className="text-xs font-medium text-ink">Fully Furnished</span>
                  </div>
                )}
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mb-6">
              <h2 className="font-display font-semibold text-ink text-lg mb-3">Location</h2>
              <div className="bg-ghana-green-50 border border-ghana-green-100 rounded-card h-48 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-ghana-green mx-auto mb-2" />
                  <p className="font-semibold text-ink text-sm">{p.neighborhood}, {p.city}</p>
                  <p className="text-muted text-xs mt-1">Exact pin shared on WhatsApp after contact</p>
                </div>
              </div>
            </div>

            {/* Listed date */}
            <div className="flex items-center gap-2 text-muted text-xs">
              <Calendar className="w-3.5 h-3.5" />
              Listed: {new Date(p.listed_date).toLocaleDateString('en-GH', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* Right — sticky contact card */}
          <div className="lg:col-span-1">
            <div className="sticky top-[84px] space-y-4">

              {/* Price card */}
              <div className="bg-white border border-border-col rounded-card p-5 shadow-card">
                <div className="mb-4">
                  <p className="font-display font-bold text-ink text-3xl">
                    {formatPrice(p.price_ghs)}
                    <span className="text-muted font-normal text-base ml-1">/month</span>
                  </p>
                  <p className="text-muted text-xs mt-1">
                    {p.advance_months} months advance · {formatPrice(p.price_ghs * p.advance_months)} total advance
                  </p>
                </div>

                {isRented ? (
                  <div className="bg-ghana-red/10 border border-ghana-red/20 rounded-btn p-3 text-center">
                    <p className="text-ghana-red font-semibold text-sm">This property is currently rented</p>
                    <p className="text-muted text-xs mt-1">Check back later or browse similar listings</p>
                  </div>
                ) : (
                  <>
                    <a
                      href={waLink(p.owner.phone, p.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-bold text-sm py-3.5 rounded-btn hover:bg-[#20b858] transition-colors mb-2"
                    >
                      <MessageCircle className="w-4 h-4 fill-white" />
                      Contact on WhatsApp
                    </a>
                    <a
                      href={`tel:+${p.owner.phone}`}
                      className="flex items-center justify-center gap-2 w-full border border-ghana-green text-ghana-green font-semibold text-sm py-3 rounded-btn hover:bg-ghana-green-50 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Call Owner
                    </a>
                    <p className="text-center text-[10px] text-muted mt-2">
                      No viewing fee. No agent commission. Speak directly to the owner.
                    </p>
                  </>
                )}
              </div>

              {/* Owner card */}
              <div className="bg-white border border-border-col rounded-card p-5 shadow-card">
                <h3 className="font-semibold text-ink text-sm mb-4">About the Owner</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-ghana-green flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{p.owner.initials}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-ink text-sm">{p.owner.name}</p>
                    <p className="text-muted text-xs">Member since {p.owner.joined_year}</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> Phone Verified
                    </span>
                    {p.owner.verified_phone
                      ? <CheckCircle className="w-4 h-4 text-ghana-green" />
                      : <span className="text-muted text-xs">—</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Ghana Card Verified
                    </span>
                    {p.owner.verified_card
                      ? <CheckCircle className="w-4 h-4 text-ghana-green" />
                      : <span className="text-[10px] bg-stone-100 text-muted px-2 py-0.5 rounded-badge">Pending</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5" /> Response Rate
                    </span>
                    <span className="text-xs font-semibold text-ghana-green">{p.owner.response_rate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" /> Listing Inquiries
                    </span>
                    <span className="text-xs font-semibold text-ink">{p.inquiries}</span>
                  </div>
                </div>
              </div>

              {/* Verification trust card */}
              <div className={`rounded-card p-4 border ${p.verification_level === 'full' ? 'bg-ghana-green-50 border-ghana-green-100' : 'bg-stone-50 border-border-col'}`}>
                {p.verification_level === 'full' ? (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-ghana-green flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-ghana-green font-semibold text-sm">Fully Verified Listing</p>
                      <p className="text-muted text-xs mt-0.5">Owner identity confirmed · Price verified · Location pinned</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-muted flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-ink font-semibold text-sm">Phone Verified</p>
                      <p className="text-muted text-xs mt-0.5">Owner&apos;s phone confirmed. Ghana Card verification in progress.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Report link */}
              <button className="flex items-center gap-1.5 text-xs text-muted hover:text-ghana-red transition-colors w-full justify-center py-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                Report this listing
              </button>
            </div>
          </div>
        </div>

        {/* Mobile sticky WhatsApp bar */}
        <PropertyContactBar
          phone={p.owner.phone}
          title={p.title}
          price={p.price_ghs}
          isRented={isRented}
        />

        {/* Landlord reviews */}
        <LandlordReviews
          landlordName={p.owner.name}
          landlordSlug={landlordSlug}
          reviews={ownerReviews}
          average={ownerRating.average}
          count={ownerRating.count}
        />

        {/* Related listings */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-border-col">
            <h2 className="font-display font-bold text-ink text-2xl mb-6">
              More in {p.neighborhood}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map(r => (
                <PropertyCard key={r.slug} property={r} />
              ))}
            </div>
            {related.length === 0 && (
              <Link href="/listings" className="text-ghana-green font-semibold text-sm hover:underline">
                Browse all properties →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
