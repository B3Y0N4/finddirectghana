'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Star } from 'lucide-react'

interface Review {
  id:            string
  landlord_slug: string
  reviewer_type: string
  reviewer_name: string
  rating:        number
  categories:    string[]
  title:         string
  body:          string
  status:        string
  created_at:    string
}

function ReviewRow({ review: r, onAction }: { review: Review; onAction: () => void }) {
  const [busy, setBusy] = useState(false)

  async function act(status: 'approved' | 'rejected') {
    setBusy(true)
    await fetch('/api/admin/reviews', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ id: r.id, status }),
    })
    setBusy(false)
    onAction()
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
          r.reviewer_type === 'tenant' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {r.reviewer_type === 'tenant' ? 'Tenant' : 'Landlord'}
        </span>
        <span className="text-xs text-gray-600 font-medium">{r.reviewer_name}</span>
        <span className="text-xs text-gray-300">·</span>
        <span className="text-xs text-gray-400">re: {r.landlord_slug.replace('landlord-', '').replace(/-/g, ' ')}</span>
        <span className="text-xs text-gray-300 ml-auto">
          {new Date(r.created_at).toLocaleDateString('en-GH', { day: 'numeric', month: 'short' })}
        </span>
      </div>

      <div className="flex items-center gap-0.5 mb-2">
        {[1,2,3,4,5].map(n => (
          <Star key={n} className={`w-3.5 h-3.5 ${n <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} />
        ))}
        <span className="text-xs text-gray-500 ml-1">{r.rating}/5</span>
      </div>

      <p className="font-semibold text-gray-900 text-sm mb-1">{r.title}</p>
      <p className="text-sm text-gray-600 leading-relaxed">{r.body}</p>

      {r.categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {r.categories.map(c => (
            <span key={c} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
              {c}
            </span>
          ))}
        </div>
      )}

      {r.status === 'pending' && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
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
        </div>
      )}
    </div>
  )
}

function AdminReviewsInner() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const status       = searchParams.get('status') ?? 'pending'
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch(`/api/admin/reviews?status=${status}`)
      const data = await res.json()
      setReviews(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => { load() }, [load])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h1>

      <div className="flex gap-2 mb-6">
        {(['pending', 'approved', 'rejected'] as const).map(t => (
          <button
            key={t}
            onClick={() => router.push(`/admin/reviews?status=${t}`)}
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
      ) : reviews.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No {status} reviews</div>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
            <ReviewRow key={r.id} review={r} onAction={load} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminReviews() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-400 text-sm">Loading...</div>}>
      <AdminReviewsInner />
    </Suspense>
  )
}
