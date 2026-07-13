'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Shield, Phone, MapPin, ChevronDown, ChevronUp, Eye } from 'lucide-react'

interface Listing {
  id:                   string
  slug:                 string
  title:                string
  type:                 string
  status:               string
  price_ghs:            number
  neighborhood:         string
  description:          string | null
  owner_name:           string
  owner_phone:          string
  ghana_card_front_url: string | null
  ghana_card_back_url:  string | null
  selfie_url:           string | null
  image_urls:           string[]
  admin_notes:          string | null
  created_at:           string
}

const STATUS_CLASS: Record<string, string> = {
  pending:  'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
}

function ListingRow({ listing, onAction }: { listing: Listing; onAction: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const [notes,    setNotes]    = useState(listing.admin_notes ?? '')
  const [busy,     setBusy]     = useState(false)

  const hasId = !!(listing.ghana_card_front_url || listing.selfie_url)

  async function act(status: 'approved' | 'rejected') {
    setBusy(true)
    await fetch('/api/admin/listings', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ id: listing.id, status, admin_notes: notes }),
    })
    setBusy(false)
    onAction()
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_CLASS[listing.status] ?? 'bg-gray-100 text-gray-500'}`}>
                {listing.status}
              </span>
              {hasId && (
                <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 bg-ghana-green-50 text-ghana-green rounded-full">
                  <Shield className="w-2.5 h-2.5" /> ID Uploaded
                </span>
              )}
              <span className="text-xs text-gray-400">
                {new Date(listing.created_at).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 text-sm leading-snug">{listing.title}</h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />{listing.neighborhood}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Phone className="w-3 h-3" />{listing.owner_name} · +233{listing.owner_phone}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="font-bold text-gray-900 text-sm">GHS {listing.price_ghs.toLocaleString()}</p>
            <p className="text-xs text-gray-400">/month</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {listing.status === 'pending' && (
            <>
              <button
                onClick={() => act('approved')}
                disabled={busy}
                className="flex items-center gap-1.5 bg-ghana-green text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-ghana-green-dark transition-colors disabled:opacity-40"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Approve
              </button>
              <button
                onClick={() => act('rejected')}
                disabled={busy}
                className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-40"
              >
                <XCircle className="w-3.5 h-3.5" /> Reject
              </button>
            </>
          )}
          {listing.status === 'approved' && (
            <a
              href={`/property/${listing.slug}`}
              target="_blank"
              className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> View Live
            </a>
          )}
          <button
            onClick={() => setExpanded(v => !v)}
            className="ml-auto flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors"
          >
            {expanded
              ? <><ChevronUp   className="w-3.5 h-3.5" /> Less</>
              : <><ChevronDown className="w-3.5 h-3.5" /> Details</>}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-5">
          {listing.description && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</p>
              <p className="text-sm text-gray-700 leading-relaxed">{listing.description}</p>
            </div>
          )}

          {hasId && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Identity Verification</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Card Front', url: listing.ghana_card_front_url },
                  { label: 'Card Back',  url: listing.ghana_card_back_url  },
                  { label: 'Selfie',     url: listing.selfie_url           },
                ].filter(x => x.url).map(({ label, url }) => (
                  <div key={label}>
                    <p className="text-[10px] text-gray-400 mb-1">{label}</p>
                    <a href={url!} target="_blank" rel="noopener noreferrer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url!}
                        alt={label}
                        className="w-full h-28 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity"
                      />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {listing.image_urls.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Property Photos ({listing.image_urls.length})
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {listing.image_urls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Photo ${i + 1}`} className="h-24 w-36 object-cover rounded-lg border border-gray-200" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Admin Notes</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:border-ghana-green resize-none h-20"
              placeholder="Internal notes (not shown to owner)..."
            />
            {listing.status === 'pending' && (
              <p className="text-xs text-gray-400 mt-1">Notes are saved when you approve or reject.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function AdminListingsInner() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const status       = searchParams.get('status') ?? 'pending'
  const [listings, setListings] = useState<Listing[]>([])
  const [loading,  setLoading]  = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch(`/api/admin/listings?status=${status}`)
      const data = await res.json()
      setListings(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => { load() }, [load])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Listings</h1>

      <div className="flex gap-2 mb-6">
        {(['pending', 'approved', 'rejected'] as const).map(t => (
          <button
            key={t}
            onClick={() => router.push(`/admin/listings?status=${t}`)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
              status === t
                ? 'bg-ghana-green text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-ghana-green hover:text-ghana-green'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No {status} listings</div>
      ) : (
        <div className="space-y-3">
          {listings.map(l => (
            <ListingRow key={l.id} listing={l} onAction={load} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminListings() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-400 text-sm">Loading...</div>}>
      <AdminListingsInner />
    </Suspense>
  )
}
