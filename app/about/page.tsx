import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Target, Eye, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About — Find Direct Ghana',
  description: 'Find Direct Ghana is Ghana\'s first verified owner-direct rental platform. Learn about our mission to make renting transparent and agent-free.',
}

export default function AboutPage() {
  return (
    <div className="pt-nav">
      {/* Hero */}
      <section className="bg-ghana-green-dark text-white py-20 lg:py-28">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-ghana-gold text-xs font-semibold tracking-widest uppercase mb-5">Our Story</p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6">
              We are fixing Ghana&apos;s rental market — one verified listing at a time.
            </h1>
            <p className="text-white/65 text-lg leading-relaxed">
              Find Direct Ghana was born from a simple frustration: why should a tenant pay GHS 300 just to view a property that doesn&apos;t match what was described? Why should a landlord lose 10% of rent to an agent whose only contribution was a phone call?
            </p>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target className="w-6 h-6 text-ghana-green" />,
                label: 'Our Mission',
                text: 'To make renting a home in Ghana transparent, safe, and agent-free for every Ghanaian — by connecting landlords and tenants directly through a platform they can trust.',
              },
              {
                icon: <Eye className="w-6 h-6 text-ghana-green" />,
                label: 'Our Vision',
                text: 'A Ghana where every rental transaction is honest, where landlords get fair value and tenants get what they were promised — and where digital trust replaces the unreliable informal agent ecosystem.',
              },
              {
                icon: <Heart className="w-6 h-6 text-ghana-green" />,
                label: 'Our Values',
                text: 'Transparency first. Verification always. Free access forever for the basic experience. We build trust brick by brick — and we never take a shortcut that puts users at risk.',
              },
            ].map(v => (
              <div key={v.label}>
                <div className="w-12 h-12 rounded-full bg-ghana-green-50 flex items-center justify-center mb-4">
                  {v.icon}
                </div>
                <h3 className="font-display font-semibold text-ink text-lg mb-3">{v.label}</h3>
                <p className="text-muted leading-relaxed text-sm">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The problem we're solving */}
      <section className="py-16 lg:py-20 bg-page-bg">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-ghana-green text-xs font-semibold tracking-widest uppercase mb-4">The Problem</p>
              <h2 className="font-display font-bold text-ink text-2xl sm:text-3xl mb-6">
                Ghana&apos;s rental market was built to benefit agents — not tenants or landlords.
              </h2>
              <p className="text-muted leading-relaxed mb-6">
                When you search for a property in Accra today, here is what typically happens: you find an agent through a WhatsApp group or a friend. The agent asks for GHS 100–500 just to show you anything. They take you to properties that don&apos;t match what you asked for. If you find something you like, they add a commission on top of the landlord&apos;s price — without telling you. And if the deal falls through, the viewing fee is gone.
              </p>
              <p className="text-muted leading-relaxed">
                Meanwhile, the landlord often pays their own commission too — and still doesn&apos;t know who they&apos;re renting to. The system serves neither party well. It exists because there has been no better alternative.
              </p>
              <p className="text-muted leading-relaxed mt-4 font-medium text-ink">
                Find Direct Ghana is that alternative.
              </p>
            </div>

            <div className="space-y-3">
              {[
                'GHS 200–500 viewing fee — paid before seeing anything',
                '5–10% agent commission on top of the landlord\'s price',
                'Mismatched properties shown to waste your time',
                'Fake listings and fraudulent landlords on Facebook',
                'No transparency on real prices',
                'No verification of who the landlord actually is',
                'Outdated listings — properties already rented still shown',
                'No platform that solves all of this at once',
              ].map((pain, i) => (
                <div key={i} className="flex items-start gap-3 bg-ghana-red/5 border border-ghana-red/15 rounded-btn p-3">
                  <span className="text-ghana-red font-bold text-sm flex-shrink-0">✕</span>
                  <p className="text-ink text-sm">{pain}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Inspiration */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <p className="text-ghana-green text-xs font-semibold tracking-widest uppercase mb-4">Inspiration</p>
            <h2 className="font-display font-bold text-ink text-2xl sm:text-3xl mb-6">
              Built on a proven model — adapted for Ghana
            </h2>
            <p className="text-muted leading-relaxed mb-4">
              In Turkey, there is a platform called <strong className="text-ink">Sahibinden.com</strong>. Its name literally translates to &quot;from the owner&quot; — and that is exactly what it delivers. It is Turkey&apos;s most visited website, with 30 million monthly users, and it was built entirely around one promise: connect buyers directly to sellers, and let both parties benefit from cutting out the middleman.
            </p>
            <p className="text-muted leading-relaxed mb-4">
              Sahibinden started with real estate and vehicles and grew into a full classifieds marketplace. It took years and built network effects that no competitor has displaced. Today it powers billions in transactions across real estate, cars, jobs, and more.
            </p>
            <p className="text-muted leading-relaxed">
              Ghana does not have a Sahibinden. The rental market pain points here are more severe than Turkey ever experienced. The opportunity to build something trusted, owner-direct, and mobile-first for the Ghanaian context is enormous — and entirely unclaimed. That is what Find Direct Ghana is building.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-ghana-gold">
        <div className="max-w-content mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display font-bold text-ink text-2xl sm:text-3xl mb-4">
            Join the movement.
          </h2>
          <p className="text-ink/65 text-lg max-w-lg mx-auto mb-8">
            Whether you&apos;re a landlord looking for serious tenants or a tenant tired of paying viewing fees — Find Direct Ghana is built for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/listings" className="flex items-center gap-2 bg-ink text-white font-bold px-8 py-4 rounded-btn hover:bg-ghana-green-dark transition-colors">
              Browse Properties <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/list" className="flex items-center gap-2 border-2 border-ink text-ink font-bold px-8 py-4 rounded-btn hover:bg-ink/10 transition-colors">
              List For Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
