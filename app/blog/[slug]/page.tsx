import type { Metadata } from 'next'
import { notFound }        from 'next/navigation'
import Link                from 'next/link'
import { ArrowLeft, Clock, ArrowRight, BookOpen } from 'lucide-react'
import { posts, getPost, getRelatedPosts } from '@/lib/blog'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
    },
  }
}

const categoryColors: Record<string, string> = {
  green: 'bg-ghana-green-50 text-ghana-green border-ghana-green-100',
  gold:  'bg-ghana-gold/10 text-ghana-gold-dark border-ghana-gold/20',
  red:   'bg-ghana-red/8 text-ghana-red border-ghana-red/15',
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const related = getRelatedPosts(slug, 3)

  return (
    <div className="pt-nav bg-page-bg">

      {/* Article hero */}
      <section className="bg-ghana-green-dark text-white py-14 lg:py-20">
        <div className="max-w-content mx-auto px-4 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-ghana-gold text-sm transition-colors mb-7"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <span className={`text-[10px] font-bold px-3 py-1 rounded-badge border ${categoryColors[post.categoryColor]}`}>
                {post.category}
              </span>
              <span className="flex items-center gap-1.5 text-white/40 text-xs">
                <Clock className="w-3 h-3" />
                {post.readTime} min read
              </span>
              <span className="text-white/30 text-xs">
                {new Date(post.publishedAt).toLocaleDateString('en-GH', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight mb-5">
              {post.title}
            </h1>
            <p className="text-white/55 text-base sm:text-lg leading-relaxed">
              {post.excerpt}
            </p>
            <p className="text-white/30 text-xs mt-5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              The Find Direct Ghana Team
            </p>
          </div>
        </div>
      </section>

      {/* Article body */}
      <div className="max-w-content mx-auto px-4 lg:px-8 py-10 lg:py-14">
        <div className="grid lg:grid-cols-[1fr_280px] gap-10 lg:gap-14">

          {/* Main article */}
          <article className="min-w-0">
            <div className="prose-ghana">
              {post.body.map((block, i) => {
                switch (block.type) {

                  case 'p':
                    return (
                      <p key={i} className="text-ink/80 leading-[1.85] text-[15px] sm:text-base mb-5">
                        {block.text}
                      </p>
                    )

                  case 'h2':
                    return (
                      <h2 key={i} className="font-display font-bold text-ink text-xl sm:text-2xl mt-10 mb-4 leading-snug border-l-4 border-ghana-green pl-4">
                        {block.text}
                      </h2>
                    )

                  case 'quote':
                    return (
                      <blockquote key={i} className="border-l-4 border-ghana-gold pl-5 my-7">
                        <p className="text-ink font-medium text-base sm:text-lg leading-relaxed italic mb-2">
                          &ldquo;{block.text}&rdquo;
                        </p>
                        {block.attr && (
                          <p className="text-muted text-sm">— {block.attr}</p>
                        )}
                      </blockquote>
                    )

                  case 'callout':
                    return (
                      <div key={i} className={`rounded-card p-5 my-6 border ${
                        block.variant === 'green' ? 'bg-ghana-green-50 border-ghana-green-100 text-ghana-green-dark' :
                        block.variant === 'gold'  ? 'bg-ghana-gold/10 border-ghana-gold/25 text-ink'                :
                                                    'bg-ghana-red/8 border-ghana-red/20 text-ghana-red'
                      }`}>
                        <p className="text-sm sm:text-base leading-relaxed font-medium">{block.text}</p>
                      </div>
                    )

                  case 'list':
                    return (
                      <ul key={i} className="my-5 space-y-2.5">
                        {block.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-3 text-ink/80 text-[15px] sm:text-base leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-ghana-green flex-shrink-0 mt-2" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )

                  case 'stat':
                    return (
                      <div key={i} className="grid sm:grid-cols-3 gap-3 my-7">
                        {block.stats.map((s, j) => (
                          <div key={j} className="bg-white border border-border-col rounded-card p-4 text-center">
                            <p className="font-display font-bold text-ghana-green text-xl sm:text-2xl mb-1">{s.value}</p>
                            <p className="text-muted text-xs leading-snug">{s.label}</p>
                          </div>
                        ))}
                      </div>
                    )

                  default:
                    return null
                }
              })}
            </div>

            {/* Article footer CTA */}
            <div className="mt-12 bg-ghana-green-dark text-white rounded-card p-7 lg:p-8">
              <p className="text-ghana-gold text-xs font-semibold tracking-widest uppercase mb-3">Now you know</p>
              <h3 className="font-display font-bold text-xl sm:text-2xl mb-3">
                Find a home directly from the owner — no agents, no fees.
              </h3>
              <p className="text-white/55 text-sm leading-relaxed mb-5">
                Browse verified listings in Accra. Contact landlords directly on WhatsApp. Zero viewing fees. Zero commission.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/listings"
                  className="flex items-center justify-center gap-2 bg-ghana-gold text-ink font-bold text-sm px-6 py-3 rounded-btn hover:bg-ghana-gold-light transition-colors"
                >
                  Browse Properties <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/list"
                  className="flex items-center justify-center gap-2 border border-white/30 text-white font-semibold text-sm px-6 py-3 rounded-btn hover:border-white/60 transition-colors"
                >
                  List Your Property Free
                </Link>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">

              {/* More articles */}
              <div className="bg-white border border-border-col rounded-card p-5">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-4">More Articles</p>
                <div className="space-y-4">
                  {related.map(r => (
                    <Link key={r.slug} href={`/blog/${r.slug}`} className="group block">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-badge border ${categoryColors[r.categoryColor]} mb-1.5 inline-block`}>
                        {r.category}
                      </span>
                      <p className="text-sm font-semibold text-ink group-hover:text-ghana-green transition-colors leading-snug">
                        {r.title}
                      </p>
                      <p className="text-xs text-muted mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {r.readTime} min
                      </p>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/blog"
                  className="mt-4 pt-4 border-t border-border-col flex items-center gap-1.5 text-xs text-ghana-green font-semibold hover:underline"
                >
                  All articles <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Quick CTA */}
              <div className="bg-ghana-green rounded-card p-5 text-white text-center">
                <p className="font-display font-bold text-base mb-2">Find a home today</p>
                <p className="text-white/65 text-xs leading-relaxed mb-4">No agents. No fees. Contact landlords directly.</p>
                <Link
                  href="/listings"
                  className="block bg-ghana-gold text-ink font-bold text-sm py-2.5 rounded-btn hover:bg-ghana-gold-light transition-colors"
                >
                  Browse Listings
                </Link>
              </div>
            </div>
          </aside>

        </div>

        {/* Mobile related posts */}
        <div className="lg:hidden mt-12 pt-8 border-t border-border-col">
          <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-5">More Articles</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {related.slice(0, 2).map(r => (
              <Link key={r.slug} href={`/blog/${r.slug}`} className="group bg-white border border-border-col rounded-card p-4">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-badge border ${categoryColors[r.categoryColor]} mb-2 inline-block`}>
                  {r.category}
                </span>
                <p className="text-sm font-semibold text-ink group-hover:text-ghana-green transition-colors leading-snug">
                  {r.title}
                </p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
