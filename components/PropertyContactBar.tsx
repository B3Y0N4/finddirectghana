'use client'

import { MessageCircle, Phone } from 'lucide-react'
import { formatPrice, waLink } from '@/lib/utils'

interface Props {
  phone:    string
  title:    string
  price:    number
  isRented: boolean
}

export default function PropertyContactBar({ phone, title, price, isRented }: Props) {
  if (isRented) return null

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-border-col shadow-[0_-4px_24px_rgba(12,26,18,0.12)]">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-muted uppercase tracking-wider">Monthly rent</p>
          <p className="font-display font-bold text-ink text-lg leading-none">
            {formatPrice(price)}
            <span className="text-muted font-normal text-xs ml-1">/mo</span>
          </p>
        </div>
        <a
          href={`tel:+${phone}`}
          className="flex items-center justify-center gap-1.5 border border-ghana-green text-ghana-green font-semibold text-sm px-4 py-3 rounded-btn hover:bg-ghana-green-50 transition-colors flex-shrink-0"
        >
          <Phone className="w-4 h-4" />
          Call
        </a>
        <a
          href={waLink(phone, title)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold text-sm px-5 py-3 rounded-btn hover:bg-[#20b858] transition-colors flex-shrink-0"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          WhatsApp
        </a>
      </div>
    </div>
  )
}
