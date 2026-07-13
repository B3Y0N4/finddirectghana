import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Search, MessageCircle, Home, CheckCircle, Shield, Camera,
  MapPin, Phone, Star, Users, ArrowRight, AlertTriangle,
} from 'lucide-react'
import { properties } from '@/lib/properties'

const availableCount = properties.filter(p => p.status === 'available').length

export const metadata: Metadata = {
  title: 'How It Works — Find Direct Ghana',
  description: 'Learn how Find Direct Ghana works for tenants and landlords. Browse verified listings, contact owners directly, and rent without agent fees.',
}

export default function HowItWorksPage() {
  return (
    <div className="pt-nav">

      {/* Hero */}
      <section className="bg-ghana-green text-white py-16 lg:py-20">
        <div className="max-w-content mx-auto px-4 lg:px-8 text-center">
          <p className="text-ghana-gold text-xs font-semibold tracking-widest uppercase mb-4">Simple · Transparent · Free</p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl mb-4">How Find Direct Ghana works</h1>
          <p className="text-white/65 text-lg max-w-xl mx-auto">
            For tenants, it&apos;s the easiest way to find a home without paying viewing fees or agent commissions. For landlords, it&apos;s the fastest way to find serious tenants — for free.
          </p>
        </div>
      </section>

      {/* For Tenants */}
      <section id="tenants" className="py-16 lg:py-20 bg-white">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-ghana-green-50 text-ghana-green text-xs font-bold px-4 py-1.5 rounded-badge tracking-wider uppercase mb-4">For Tenants</span>
            <h2 className="font-display font-bold text-ink text-2xl sm:text-3xl">Find your home in 4 steps</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { icon: <Search className="w-6 h-6 text-ghana-green" />, num: '01', title: 'Search Listings', desc: 'Filter by neighborhood, property type, and price. Every listing shows real photos and the exact area on a map.' },
              { icon: <CheckCircle className="w-6 h-6 text-ghana-green" />, num: '02', title: 'Check Verification', desc: 'Look for the "Verified Owner" badge. It means the landlord has confirmed their Ghana Card identity — you know who you\'re dealing with.' },
              { icon: <MessageCircle className="w-6 h-6 text-ghana-green" />, num: '03', title: 'Contact on WhatsApp', desc: 'Tap the WhatsApp button to message the owner directly. Ask your questions. Get real answers. No middleman.' },
              { icon: <Home className="w-6 h-6 text-ghana-green" />, num: '04', title: 'Visit & Move In', desc: 'Visit only properties that match your needs. No viewing fee. Negotiate directly with the owner and close the deal.' },
            ].map(s => (
              <div key={s.num} className="text-center">
                <div className="w-14 h-14 rounded-full bg-ghana-green-50 border border-ghana-green-100 flex items-center justify-center mx-auto mb-4">
                  {s.icon}
                </div>
                <p className="text-ghana-green font-bold text-xs tracking-widest mb-2">{s.num}</p>
                <h3 className="font-display font-semibold text-ink text-base mb-2">{s.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Tenant savings box */}
          <div className="bg-ghana-green-dark text-white rounded-card p-8">
            <h3 className="font-display font-bold text-xl mb-6 text-center">How much you save vs. going through an agent</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Viewing fees saved', value: 'GHS 200–500', desc: 'Agents charge this just to show you properties' },
                { label: 'Commission avoided', value: 'GHS 1,800–9,600', desc: '~10% of 1 year\'s rent on a GHS 1,500–8,000/mo property' },
                { label: 'Time saved', value: '5–15 hours', desc: 'No wasted trips to properties that don\'t match' },
              ].map(s => (
                <div key={s.label} className="text-center border border-white/10 rounded-btn p-4">
                  <p className="text-ghana-gold font-bold text-2xl mb-1">{s.value}</p>
                  <p className="text-white font-semibold text-sm mb-1">{s.label}</p>
                  <p className="text-white/50 text-xs">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Landlords */}
      <section id="landlords" className="py-16 lg:py-20 bg-page-bg">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-ghana-gold/15 text-ghana-gold-dark text-xs font-bold px-4 py-1.5 rounded-badge tracking-wider uppercase mb-4">For Landlords</span>
            <h2 className="font-display font-bold text-ink text-2xl sm:text-3xl">List your property in 5 steps</h2>
          </div>

          <div className="grid md:grid-cols-5 gap-4 mb-10">
            {[
              { icon: <Camera className="w-5 h-5" />, title: 'Create listing', desc: 'Fill in property details, upload photos, set your price.' },
              { icon: <MapPin className="w-5 h-5" />, title: 'Pin location', desc: 'Drop a GPS pin so tenants know the area before asking.' },
              { icon: <Phone className="w-5 h-5" />, title: 'Verify phone', desc: 'Confirm your number via SMS — takes 30 seconds.' },
              { icon: <Shield className="w-5 h-5" />, title: 'Ghana Card', desc: 'Optional but recommended — gets you the Verified Owner badge.' },
              { icon: <Users className="w-5 h-5" />, title: 'Receive inquiries', desc: 'Tenants contact you directly on WhatsApp.' },
            ].map((s, i) => (
              <div key={s.title} className="bg-white border border-border-col rounded-card p-5 text-center">
                <div className="w-10 h-10 rounded-full bg-ghana-green text-white flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                  {i + 1}
                </div>
                <div className="text-ghana-green mb-2 flex justify-center">{s.icon}</div>
                <h4 className="font-semibold text-ink text-sm mb-1">{s.title}</h4>
                <p className="text-muted text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: <Star className="w-5 h-5 text-ghana-gold-dark" />, title: 'Always free to list', desc: 'Basic listing is permanently free. Verified owners can pay to boost visibility in Phase 2.' },
              { icon: <Users className="w-5 h-5 text-ghana-green" />, title: 'Serious tenants only', desc: 'Tenants on Find Direct Ghana are looking to rent — they\'ve already done their research before contacting you.' },
              { icon: <Shield className="w-5 h-5 text-ghana-green" />, title: 'You stay in control', desc: 'Set your real price, toggle availability instantly, and close the door on any tenant you don\'t trust.' },
            ].map(s => (
              <div key={s.title} className="bg-white border border-border-col rounded-card p-5">
                <div className="mb-3">{s.icon}</div>
                <h4 className="font-semibold text-ink text-sm mb-2">{s.title}</h4>
                <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification explained */}
      <section id="verification" className="py-16 lg:py-20 bg-white">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block bg-ghana-green-50 text-ghana-green text-xs font-bold px-4 py-1.5 rounded-badge tracking-wider uppercase mb-4">Trust & Safety</span>
              <h2 className="font-display font-bold text-ink text-2xl sm:text-3xl">How we verify owners</h2>
              <p className="text-muted mt-3">Trust is not a feature — it&apos;s the product. Here is exactly what &quot;Verified Owner&quot; means on Find Direct Ghana.</p>
            </div>

            <div className="space-y-4">
              {[
                { badge: 'Phone Verified', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700', desc: 'Owner confirmed their mobile number via SMS OTP. All listings require this minimum. Ensures the owner can be reached.' },
                { badge: 'Verified Owner', color: 'bg-ghana-green-50 border-ghana-green-100', textColor: 'text-ghana-green', desc: 'Owner submitted Ghana Card (front + back) and a live selfie. Name and ID number confirmed. This badge tells tenants: this is a real, identified person.' },
                { badge: 'Location Pinned', color: 'bg-orange-50 border-orange-200', textColor: 'text-orange-700', desc: 'Property GPS location has been confirmed by our team and pinned on the map. Tenants see the real neighbourhood before visiting.' },
                { badge: 'Price Confirmed', color: 'bg-purple-50 border-purple-200', textColor: 'text-purple-700', desc: 'Owner confirmed the listed price is the actual asking price — not agent-inflated. What you see is what you pay.' },
              ].map(v => (
                <div key={v.badge} className={`border rounded-card p-5 ${v.color}`}>
                  <div className="flex items-start gap-3">
                    <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${v.textColor}`} />
                    <div>
                      <p className={`font-bold text-sm mb-1 ${v.textColor}`}>{v.badge}</p>
                      <p className="text-ink text-sm leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-ghana-green-50 border border-ghana-green-100 rounded-card p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-ghana-green flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-ink text-sm mb-1">Report a suspicious listing</p>
                  <p className="text-muted text-sm">If a listing looks fake, the price seems wrong, or the owner is unresponsive — report it. Our team investigates within 24 hours. Fraud is grounds for immediate permanent ban.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-ghana-green-dark text-white">
        <div className="max-w-content mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display font-bold text-2xl sm:text-3xl mb-4">Ready to find your next home?</h2>
          <p className="text-white/60 mb-8">Browse {availableCount} verified listings in Accra and beyond. No agents. No fees. No commission.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/listings" className="flex items-center gap-2 bg-ghana-gold text-ink font-bold px-8 py-4 rounded-btn hover:bg-ghana-gold-light transition-colors">
              Browse Properties <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/list" className="flex items-center gap-2 border border-white/30 text-white font-semibold px-8 py-4 rounded-btn hover:border-white/60 transition-colors">
              List Your Property Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
