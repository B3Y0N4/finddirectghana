import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, BookOpen } from 'lucide-react'
import { posts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'The Find Direct Ghana Blog — Real Stories, Real Prices, Real Ghana',
  description: 'The honest guide to renting in Ghana. Viewing fees, advance rent, neighborhood prices, fake landlords, chamber and hall — written by Ghanaians, for Ghanaians.',
  openGraph: {
    title: 'The Find Direct Ghana Blog',
    description: 'Real knowledge about renting in Ghana. No sugar-coating.',
  },
}

const categoryColors: Record<string, string> = {
  green: 'bg-ghana-green-50 text-ghana-green border-ghana-green-100',
  gold:  'bg-ghana-gold/10 text-ghana-gold-dark border-ghana-gold/20',
  red:   'bg-ghana-red/8 text-ghana-red border-ghana-red/15',
}

export default function BlogIndexPage() {
  const featured = posts.find(p => p.featured) ?? posts[0]
  const rest     = posts.filter(p => p.slug !== featured.slug)

  return (
    <div className="pt-nav">

      {/* Hero */}
      <section className="bg-ghana-green-dark text-white py-16 lg:py-20">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-ghana-gold text-xs font-semibold tracking-widest uppercase mb-4 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              Find Direct Ghana Blog
            </p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-5">
              Real stories.<br />
              <span className="text-ghana-gold">Real prices. Real Ghana.</span>
            </h1>
            <p className="text-white/60 text-lg leading-relaxed">
              The honest guide to renting in Ghana — written from the inside. Viewing fees, advance rent, fake landlords, neighborhood prices, and what they never tell you until it's too late.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-content mx-auto px-4 lg:px-8 py-12 lg:py-16">

        {/* Featured post */}
        <div className="mb-14">
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-5">Featured</p>
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid lg:grid-cols-2 gap-0 bg-white border border-border-col rounded-card overflow-hidden hover:shadow-card-hover transition-shadow"
          >
            {/* Visual panel */}
            <div className="bg-ghana-green-dark min-h-[220px] lg:min-h-[340px] p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px,white 1px,transparent 0)', backgroundSize: '24px 24px' }} />
              <span className={`relative self-start text-[10px] font-bold px-3 py-1 rounded-badge border ${categoryColors[featured.categoryColor]}`}>
                {featured.category}
              </span>
              <div className="relative">
                <p className="text-ghana-gold font-display font-bold text-5xl sm:text-6xl leading-none opacity-20 mb-3 select-none">"</p>
                <p className="text-white/75 text-sm leading-relaxed italic line-clamp-3">
                  {featured.excerpt}
                </p>
              </div>
            </div>

            {/* Text panel */}
            <div className="p-7 lg:p-10 flex flex-col justify-between">
              <div>
                <h2 className="font-display font-bold text-ink text-xl sm:text-2xl leading-tight mb-4 group-hover:text-ghana-green transition-colors">
                  {featured.title}
                </h2>
                <p className="text-muted text-sm leading-relaxed line-clamp-4">
                  {featured.excerpt}
                </p>
              </div>
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-border-col">
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {featured.readTime} min read
                  </span>
                  <span>·</span>
                  <span>{new Date(featured.publishedAt).toLocaleDateString('en-GH', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <span className="flex items-center gap-1.5 text-ghana-green font-semibold text-sm group-hover:gap-2.5 transition-all">
                  Read <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Post grid */}
        <div>
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-6">All Articles</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white border border-border-col rounded-card overflow-hidden hover:shadow-card-hover transition-shadow flex flex-col"
              >
                {/* Color bar */}
                <div className={`h-1.5 w-full ${post.categoryColor === 'green' ? 'bg-ghana-green' : post.categoryColor === 'gold' ? 'bg-ghana-gold' : 'bg-ghana-red'}`} />

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-badge border ${categoryColors[post.categoryColor]}`}>
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-muted ml-auto">
                      <Clock className="w-3 h-3" />
                      {post.readTime} min
                    </span>
                  </div>

                  <h2 className="font-display font-bold text-ink text-base leading-snug mb-3 group-hover:text-ghana-green transition-colors flex-1">
                    {post.title}
                  </h2>

                  <p className="text-muted text-xs leading-relaxed line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border-col">
                    <span className="text-[10px] text-muted">
                      {new Date(post.publishedAt).toLocaleDateString('en-GH', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1 text-ghana-green font-semibold text-xs group-hover:gap-1.5 transition-all">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-ghana-green-dark text-white rounded-card p-8 lg:p-10 text-center">
          <p className="text-ghana-gold text-xs font-semibold tracking-widest uppercase mb-3">You've done the reading</p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl mb-4">
            Now find your home — directly from the owner.
          </h2>
          <p className="text-white/60 text-base max-w-lg mx-auto mb-7">
            No viewing fees. No agent commission. No advance rent surprises. Browse verified listings and speak to landlords directly on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/listings"
              className="flex items-center gap-2 bg-ghana-gold text-ink font-bold px-8 py-4 rounded-btn hover:bg-ghana-gold-light transition-colors"
            >
              Browse Properties <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/list"
              className="flex items-center gap-2 border border-white/30 text-white font-semibold px-8 py-4 rounded-btn hover:border-white/60 transition-colors"
            >
              List Your Property Free
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
