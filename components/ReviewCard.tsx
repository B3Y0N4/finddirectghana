import { CheckCircle, Star } from 'lucide-react'
import type { Review } from '@/lib/reviews'
import { categoryLabels } from '@/lib/reviews'

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(n => (
        <Star
          key={n}
          className={`w-3.5 h-3.5 ${n <= rating ? 'text-ghana-gold fill-ghana-gold' : 'text-border-col fill-border-col'}`}
        />
      ))}
    </div>
  )
}

export default function ReviewCard({ review: r }: { review: Review }) {
  const isLandlordReview = r.reviewerType === 'landlord'

  return (
    <div className="bg-white border border-border-col rounded-card p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
            isLandlordReview ? 'bg-ghana-gold/15 text-ghana-gold-dark' : 'bg-ghana-green-50 text-ghana-green'
          }`}>
            <span className="text-xs font-bold">{r.reviewerInitials}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">{r.reviewerName}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-badge ${
                isLandlordReview
                  ? 'bg-ghana-gold/10 text-ghana-gold-dark'
                  : 'bg-ghana-green-50 text-ghana-green'
              }`}>
                {isLandlordReview ? 'Landlord review' : 'Tenant review'}
              </span>
              {r.verified && (
                <span className="flex items-center gap-0.5 text-[9px] text-ghana-green font-semibold">
                  <CheckCircle className="w-2.5 h-2.5" /> Verified
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <Stars rating={r.rating} />
          <p className="text-[10px] text-muted">
            {new Date(r.date).toLocaleDateString('en-GH', { month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      <p className="font-semibold text-ink text-sm mb-1.5">{r.title}</p>
      <p className="text-muted text-sm leading-relaxed">{r.body}</p>

      {r.categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {r.categories.map(cat => (
            <span key={cat} className="text-[9px] font-semibold px-2 py-0.5 bg-stone-100 text-muted rounded-badge">
              {categoryLabels[cat]}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
