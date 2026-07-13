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
              Ghana does not need to wait for someone else to fix this. We are here.
            </h1>
            <p className="text-white/65 text-lg leading-relaxed">
              Find Direct Ghana was not built in a boardroom in London or Silicon Valley. It was built by Ghanaians who have sat in the same frustrating WhatsApp groups, paid the same unfair viewing fees, and watched the same system take advantage of our people for too long.
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

      {/* Built for Ghana */}
      <section className="py-16 lg:py-20 bg-ghana-green-dark text-white">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <p className="text-ghana-gold text-xs font-semibold tracking-widest uppercase mb-4">Ghanaian to the Core</p>
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl mb-6">
              Built for Ghanaians, by Ghanaians — with every bit of pride that comes with it.
            </h2>
            <p className="text-white/70 leading-relaxed mb-5">
              Ghana was the first country in sub-Saharan Africa to declare independence. We did not wait for someone to free us — we stood up and said: this belongs to us. That same spirit lives in everything we build. Find Direct Ghana is not a foreign platform adapted for our market. It was conceived here, designed here, and built by people who know these streets, these neighbourhoods, and the real cost of what our people have been putting up with.
            </p>
            <p className="text-white/70 leading-relaxed mb-5">
              We grew up watching our parents negotiate with agents, pay fees they could not afford, and hand over years of rent to strangers because there was no system in place to protect them. We felt the weight of a rental market that treated Ghanaians as if they did not deserve better. We felt it personally. And we refused to accept it.
            </p>
            <p className="text-white/70 leading-relaxed mb-5">
              Every decision on this platform — from how search works, to how landlords are verified, to why we will never charge a viewing fee — was made by Ghanaians, for Ghanaians. Not as a charity. Not as a favour. But because Ghana deserves a rental market that reflects who we are: warm, honest, resourceful, and proud.
            </p>
            <p className="text-ghana-gold font-semibold leading-relaxed text-lg">
              Ghana Beyond Aid is not just a government policy. It is a mindset. We build our own solutions. This is ours.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-ghana-gold">
        <div className="max-w-content mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-display font-bold text-ink text-2xl sm:text-3xl mb-4">
            This is our platform. This is our country. Let&apos;s build it together.
          </h2>
          <p className="text-ink/70 text-lg max-w-xl mx-auto mb-8">
            Whether you are a landlord who wants tenants you can trust, or a tenant who is tired of being charged just to see a door — Find Direct Ghana was made for you. No agents. No fees. No nonsense. Just Ghanaians helping Ghanaians.
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
