'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, CheckCircle, X, Shield } from 'lucide-react'
import { categoryLabels } from '@/lib/reviews'
import type { ReviewCategory, ReviewerType } from '@/lib/reviews'

interface Props {
  landlordName: string
  onClose?: () => void
}

const ALL_CATEGORIES = Object.entries(categoryLabels) as [ReviewCategory, string][]

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="p-0.5"
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          <Star className={`w-6 h-6 transition-colors ${
            n <= (hover || value) ? 'text-ghana-gold fill-ghana-gold' : 'text-border-col fill-border-col'
          }`} />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm text-muted">
          {value === 1 ? 'Very poor' : value === 2 ? 'Poor' : value === 3 ? 'OK' : value === 4 ? 'Good' : 'Excellent'}
        </span>
      )}
    </div>
  )
}

const inputClass = 'w-full px-4 py-3 border border-border-col rounded-btn text-sm text-ink focus:outline-none focus:border-ghana-green focus:ring-1 focus:ring-ghana-green bg-white'

export default function WriteReviewForm({ landlordName, onClose }: Props) {
  const [authChecked, setAuthChecked] = useState(false)
  const [authed,      setAuthed]      = useState(false)
  const [submitted,   setSubmitted]   = useState(false)

  const [reviewerType, setReviewerType] = useState<ReviewerType>('tenant')
  const [rating,       setRating]       = useState(0)
  const [categories,   setCategories]   = useState<ReviewCategory[]>([])
  const [name,         setName]         = useState('')
  const [title,        setTitle]        = useState('')
  const [body,         setBody]         = useState('')

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(user => {
        setAuthed(!!user)
        if (user?.name) setName(user.name)
        setAuthChecked(true)
      })
      .catch(() => { setAuthed(false); setAuthChecked(true) })
  }, [])

  function toggleCategory(cat: ReviewCategory) {
    setCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/reviews', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        landlordSlug: `landlord-${landlordName.toLowerCase().replace(/\s+/g, '-')}`,
        reviewerType,
        name,
        rating,
        categories,
        title,
        body,
      }),
    })
    if (res.status === 401) {
      setAuthed(false)
      return
    }
    if (res.ok) setSubmitted(true)
  }

  const ratingLabels: Record<ReviewerType, string[]> = {
    tenant:   ['', 'Very poor landlord', 'Poor landlord', 'OK landlord', 'Good landlord', 'Excellent landlord'],
    landlord: ['', 'Very difficult tenant', 'Difficult tenant', 'OK tenant', 'Good tenant', 'Excellent tenant'],
  }

  if (!authChecked) {
    return <div className="h-32 animate-pulse bg-page-bg rounded-card" />
  }

  if (!authed) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-14 h-14 rounded-full bg-ghana-green/10 border border-ghana-green/20 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-7 h-7 text-ghana-green" />
        </div>
        <h3 className="font-display font-bold text-ink text-lg mb-2">Sign in to leave a review</h3>
        <p className="text-muted text-sm leading-relaxed mb-5 max-w-xs mx-auto">
          Reviews are from verified users only — this helps keep our community honest and fair.
        </p>
        <Link
          href="/auth/login?next=/landlords"
          className="inline-flex items-center gap-2 bg-ghana-green text-white font-bold text-sm px-6 py-3 rounded-btn hover:bg-ghana-green-dark transition-colors"
        >
          Sign In to Review
        </Link>
        <p className="mt-3 text-xs text-muted">
          No account?{' '}
          <Link href="/auth/signup" className="text-ghana-green font-semibold hover:underline">
            Sign up free
          </Link>
        </p>
        {onClose && (
          <button onClick={onClose} className="mt-4 text-muted font-medium text-xs hover:text-ink transition-colors flex items-center gap-1 mx-auto">
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
        )}
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="text-center py-8 px-4">
        <div className="w-16 h-16 rounded-full bg-ghana-green flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="font-display font-bold text-ink text-lg mb-2">Review Submitted</h3>
        <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">
          Thank you. Your review will be published after a quick check — usually within 2 hours. Honest reviews help build a better rental market for everyone in Ghana.
        </p>
        {onClose && (
          <button onClick={onClose} className="mt-5 text-ghana-green font-semibold text-sm hover:underline">
            Close
          </button>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Reviewer type */}
      <div>
        <p className="text-sm font-medium text-ink mb-2">You are reviewing as</p>
        <div className="grid grid-cols-2 gap-2">
          {(['tenant', 'landlord'] as ReviewerType[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setReviewerType(t)}
              className={`py-2.5 rounded-btn border text-sm font-semibold transition-colors ${
                reviewerType === t
                  ? 'bg-ghana-green text-white border-ghana-green'
                  : 'border-border-col text-muted hover:border-ghana-green hover:text-ghana-green'
              }`}
            >
              {t === 'tenant' ? 'A Tenant' : 'A Landlord'}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted mt-1.5">
          {reviewerType === 'tenant'
            ? `You rented from ${landlordName} and are reviewing them as a landlord.`
            : `You are the landlord and are reviewing a tenant who rented your property.`}
        </p>
      </div>

      {/* Star rating */}
      <div>
        <p className="text-sm font-medium text-ink mb-2">Overall rating *</p>
        <StarPicker value={rating} onChange={setRating} />
        {rating > 0 && (
          <p className="text-xs text-ghana-green mt-1">{ratingLabels[reviewerType][rating]}</p>
        )}
      </div>

      {/* Categories */}
      <div>
        <p className="text-sm font-medium text-ink mb-2">What are you reviewing? <span className="text-muted font-normal">(select all that apply)</span></p>
        <div className="flex flex-wrap gap-2">
          {ALL_CATEGORIES.map(([cat, label]) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1.5 rounded-btn border text-xs font-semibold transition-colors ${
                categories.includes(cat)
                  ? 'bg-ghana-green text-white border-ghana-green'
                  : 'border-border-col text-muted hover:border-ghana-green hover:text-ghana-green'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Your name *</label>
        <input
          type="text"
          className={inputClass}
          placeholder="e.g. Kofi A. (only first name + initial shown publicly)"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Review title *</label>
        <input
          type="text"
          className={inputClass}
          placeholder="One sentence summary of your experience"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Body */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5">Your review *</label>
        <textarea
          className={`${inputClass} h-32 resize-none`}
          placeholder={
            reviewerType === 'tenant'
              ? "Describe your experience. Was the deposit returned fairly? Were repairs handled promptly? Were there any surprises during the tenancy? Be specific and honest."
              : "Describe this tenant's behaviour. Did they pay on time? Care for the property? Communicate well? Give notice properly? Be fair and specific."
          }
          value={body}
          onChange={e => setBody(e.target.value)}
          required
          minLength={50}
        />
        <p className="text-muted text-xs mt-1">{body.length}/50 minimum characters</p>
      </div>

      <div className="bg-ghana-green-50 border border-ghana-green-100 rounded-card p-3">
        <p className="text-xs text-muted leading-relaxed">
          <strong className="text-ink">Community standards:</strong> Reviews must be based on your real experience. No personal attacks, no defamation. Reviews that violate these standards will be removed. Abusive or false reports may result in account action.
        </p>
      </div>

      <button
        type="submit"
        disabled={!rating || !name || !title || body.length < 50}
        className="w-full bg-ghana-green text-white font-bold text-sm py-3.5 rounded-btn hover:bg-ghana-green-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Submit Review
      </button>
    </form>
  )
}
