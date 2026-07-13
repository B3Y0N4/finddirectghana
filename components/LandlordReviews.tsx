'use client'

import { useState } from 'react'
import { Star, MessageSquarePlus, X } from 'lucide-react'
import ReviewCard from '@/components/ReviewCard'
import WriteReviewForm from '@/components/WriteReviewForm'
import type { Review } from '@/lib/reviews'

interface Props {
  landlordName: string
  landlordSlug: string
  reviews: Review[]
  average: number
  count: number
}

function RatingBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="text-muted w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-border-col rounded-full overflow-hidden">
        <div className="h-full bg-ghana-green rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-ink font-semibold w-4 text-right">{value}</span>
    </div>
  )
}

export default function LandlordReviews({ landlordName, landlordSlug, reviews, average, count }: Props) {
  const [showForm, setShowForm] = useState(false)

  const dist = [5,4,3,2,1].map(n => ({
    stars: n,
    count: reviews.filter(r => r.rating === n).length,
  }))

  return (
    <section className="mt-10 pt-8 border-t border-border-col" id="reviews">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-bold text-ink text-xl mb-1">Landlord Reviews</h2>
          <p className="text-muted text-sm">Real experiences from tenants and landlords — publicly shared to build trust.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="hidden sm:flex items-center gap-2 bg-ghana-green text-white font-semibold text-sm px-4 py-2.5 rounded-btn hover:bg-ghana-green-dark transition-colors flex-shrink-0"
        >
          <MessageSquarePlus className="w-4 h-4" />
          Write a Review
        </button>
      </div>

      {count > 0 ? (
        <div className="grid lg:grid-cols-[200px_1fr] gap-8 mb-8">
          {/* Rating summary */}
          <div className="bg-white border border-border-col rounded-card p-5 h-fit">
            <div className="text-center mb-4">
              <p className="font-display font-bold text-ink text-4xl">{average.toFixed(1)}</p>
              <div className="flex justify-center gap-0.5 my-1">
                {[1,2,3,4,5].map(n => (
                  <Star key={n} className={`w-4 h-4 ${n <= Math.round(average) ? 'text-ghana-gold fill-ghana-gold' : 'text-border-col fill-border-col'}`} />
                ))}
              </div>
              <p className="text-muted text-xs">{count} review{count !== 1 ? 's' : ''}</p>
            </div>
            <div className="space-y-2">
              {dist.map(d => (
                <RatingBar key={d.stars} label={`${d.stars} star${d.stars !== 1 ? 's' : ''}`} value={d.count} max={count} />
              ))}
            </div>
          </div>

          {/* Review list */}
          <div className="space-y-4">
            {reviews.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-border-col rounded-card p-8 text-center mb-6">
          <MessageSquarePlus className="w-8 h-8 text-muted mx-auto mb-3" />
          <p className="font-semibold text-ink text-sm mb-1">No reviews yet</p>
          <p className="text-muted text-xs">Be the first to share your experience with this landlord.</p>
        </div>
      )}

      {/* Mobile write review button */}
      <button
        onClick={() => setShowForm(true)}
        className="sm:hidden w-full flex items-center justify-center gap-2 bg-ghana-green text-white font-semibold text-sm px-4 py-3 rounded-btn hover:bg-ghana-green-dark transition-colors mb-4"
      >
        <MessageSquarePlus className="w-4 h-4" />
        Write a Review
      </button>

      {/* Trust note */}
      <p className="text-xs text-muted text-center">
        Reviews are from verified users only. All submissions are moderated within 2 hours.{' '}
        <a href="/report" className="text-ghana-green hover:underline">Report a false review</a>
      </p>

      {/* Write review modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-border-col px-5 py-4 flex items-center justify-between rounded-t-2xl sm:rounded-t-2xl z-10">
              <h3 className="font-display font-bold text-ink text-base">Review {landlordName}</h3>
              <button onClick={() => setShowForm(false)} className="text-muted hover:text-ink p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <WriteReviewForm
                landlordName={landlordName}
                onClose={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
