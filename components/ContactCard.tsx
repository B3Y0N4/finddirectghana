'use client'

import Link from 'next/link'
import { MessageCircle, Phone, Shield } from 'lucide-react'
import { formatPrice, waLink } from '@/lib/utils'
import { useLandlordContact } from '@/lib/useLandlordContact'
import { advanceFlexibilityLabels } from '@/lib/properties'
import type { AdvanceFlexibility } from '@/lib/types'

interface Props {
  slug: string
  title: string
  price: number
  advanceMonths: number
  advanceFlexibility: AdvanceFlexibility
  isRented: boolean
}

export default function ContactCard({ slug, title, price, advanceMonths, advanceFlexibility, isRented }: Props) {
  const contact = useLandlordContact(slug)
  const loginHref = `/auth/login?next=${encodeURIComponent(`/property/${slug}`)}`

  return (
    <div className="bg-white border border-border-col rounded-card p-5 shadow-card">
      <div className="mb-4">
        <p className="font-display font-bold text-ink text-3xl">
          {formatPrice(price)}
          <span className="text-muted font-normal text-base ml-1">/month</span>
        </p>
        <p className="text-muted text-xs mt-1">
          {advanceMonths} months advance · {formatPrice(price * advanceMonths)} total advance
        </p>
        {advanceFlexibility !== 'fixed' && (
          <p className="inline-block mt-1.5 text-[10px] font-semibold text-ghana-green bg-ghana-green-50 border border-ghana-green-100 rounded-full px-2 py-0.5">
            {advanceFlexibilityLabels[advanceFlexibility]}
          </p>
        )}
      </div>

      {isRented ? (
        <div className="bg-ghana-red/10 border border-ghana-red/20 rounded-btn p-3 text-center">
          <p className="text-ghana-red font-semibold text-sm">This property is currently rented</p>
          <p className="text-muted text-xs mt-1">Check back later or browse similar listings</p>
        </div>
      ) : contact.status === 'ready' ? (
        <>
          <a
            href={waLink(contact.phone, title)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white font-bold text-sm py-3.5 rounded-btn hover:bg-[#20b858] transition-colors mb-2"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            Contact on WhatsApp
          </a>
          <a
            href={`tel:+${contact.phone}`}
            className="flex items-center justify-center gap-2 w-full border border-ghana-green text-ghana-green font-semibold text-sm py-3 rounded-btn hover:bg-ghana-green-50 transition-colors"
          >
            <Phone className="w-4 h-4" />
            Call Owner
          </a>
          <p className="text-center text-[10px] text-muted mt-2">
            No viewing fee. No agent commission. Speak directly to the owner.
          </p>
        </>
      ) : contact.status === 'loading' ? (
        <div className="h-[86px] animate-pulse bg-page-bg rounded-btn" />
      ) : (
        <div className="text-center py-2">
          <div className="w-10 h-10 rounded-full bg-ghana-green/10 border border-ghana-green/20 flex items-center justify-center mx-auto mb-3">
            <Shield className="w-5 h-5 text-ghana-green" />
          </div>
          <p className="font-semibold text-ink text-sm mb-1">Sign in to contact this landlord</p>
          <p className="text-muted text-xs leading-relaxed mb-4">
            Contact details are shown to signed-in users only — this keeps owners safe from spam.
          </p>
          <Link
            href={loginHref}
            className="inline-flex items-center justify-center gap-2 w-full bg-ghana-green text-white font-bold text-sm py-3 rounded-btn hover:bg-ghana-green-dark transition-colors"
          >
            Sign In to Contact
          </Link>
          <p className="mt-2 text-xs text-muted">
            No account?{' '}
            <Link href="/auth/signup" className="text-ghana-green font-semibold hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
