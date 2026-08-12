import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Home, AlertTriangle } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { getListingsForOwner } from '@/lib/data'
import { formatPrice } from '@/lib/utils'
import ListingStatusToggle from '@/components/ListingStatusToggle'
import type { ListingRawStatus } from '@/lib/types'

export const metadata: Metadata = {
  title: 'My Listings — Find Direct Ghana',
  robots: { index: false, follow: false },
}

const STATUS_LABEL: Record<ListingRawStatus, string> = {
  pending:  'Under Review',
  approved: 'Live',
  rejected: 'Rejected',
  rented:   'Rented',
  paused:   'Paused',
}

const STATUS_CLASS: Record<ListingRawStatus, string> = {
  pending:  'bg-ghana-gold-50 text-ghana-gold-flag',
  approved: 'bg-ghana-green-50 text-ghana-green',
  rejected: 'bg-ghana-red/10 text-ghana-red',
  rented:   'bg-page-bg text-muted border border-border-col',
  paused:   'bg-page-bg text-muted border border-border-col',
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session || session.role !== 'landlord') {
    return (
      <div className="pt-nav bg-page-bg min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-xs">
          <p className="font-display font-bold text-ink text-lg mb-2">Landlord dashboard</p>
          <p className="text-muted text-sm mb-5">This page is for landlord accounts. Sign in with a landlord account to manage your listings.</p>
          <Link href="/" className="text-ghana-green font-semibold text-sm hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  const listings = await getListingsForOwner(session.sub)

  return (
    <div className="pt-nav bg-page-bg min-h-screen pb-16">
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-ink text-2xl">My Listings</h1>
            <p className="text-muted text-sm mt-0.5">{listings.length} propert{listings.length === 1 ? 'y' : 'ies'}</p>
          </div>
          <Link
            href="/list"
            className="text-sm font-semibold bg-ghana-green text-white px-4 py-2.5 rounded-btn hover:bg-ghana-green-dark transition-colors flex-shrink-0"
          >
            List a Property
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="bg-white border border-border-col rounded-card p-8 text-center">
            <Home className="w-8 h-8 text-muted mx-auto mb-3" />
            <p className="font-semibold text-ink text-sm mb-1">No listings yet</p>
            <p className="text-muted text-xs mb-5">List your first property to start receiving inquiries.</p>
            <Link href="/list" className="text-ghana-green font-semibold text-sm hover:underline">
              List a Property →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map(listing => (
              <div key={listing.id} className="bg-white border border-border-col rounded-card p-4 flex gap-4">
                <div className="relative w-20 h-20 flex-shrink-0 rounded-btn overflow-hidden bg-page-bg">
                  {listing.image_url ? (
                    <Image src={listing.image_url} alt={listing.title} fill className="object-cover" sizes="80px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="w-6 h-6 text-muted" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-semibold text-ink text-sm leading-snug truncate">{listing.title}</p>
                    <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-badge ${STATUS_CLASS[listing.status]}`}>
                      {STATUS_LABEL[listing.status]}
                    </span>
                  </div>
                  <p className="text-muted text-xs mb-1">{listing.neighborhood}</p>
                  <p className="text-ink font-semibold text-sm mb-2">{formatPrice(listing.price_ghs)}<span className="text-muted font-normal text-xs">/mo</span></p>

                  {listing.status === 'rejected' && listing.admin_notes && (
                    <div className="flex gap-2 bg-ghana-red/5 border border-ghana-red/15 rounded-btn px-3 py-2 mb-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-ghana-red flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-ink leading-relaxed">{listing.admin_notes}</p>
                    </div>
                  )}
                  {listing.status === 'pending' && (
                    <p className="text-xs text-muted">Usually reviewed within a few hours.</p>
                  )}

                  {(listing.status === 'approved' || listing.status === 'rented' || listing.status === 'paused') && (
                    <div className="flex flex-wrap items-center gap-2">
                      <ListingStatusToggle slug={listing.slug} status={listing.status} />
                      <Link
                        href={`/dashboard/${listing.slug}/edit`}
                        className="text-xs font-semibold px-3 py-2 rounded-btn border border-border-col text-ink hover:border-ghana-green hover:text-ghana-green transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
