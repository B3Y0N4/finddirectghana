import type { Metadata } from 'next'
import { Suspense }      from 'react'
import { X }             from 'lucide-react'
import Link              from 'next/link'
import PropertyCard      from '@/components/PropertyCard'
import SearchBar         from '@/components/SearchBar'
import FilterSidebar     from '@/components/FilterSidebar'
import { properties }    from '@/lib/properties'
import type { PropertyType } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Browse Properties — Owner-Direct Rentals in Accra',
  description:
    'Browse verified owner-direct rental listings in Accra and Ghana. Filter by neighborhood, type, bedrooms, and price. No agents, no viewing fees.',
}

interface SearchParams {
  q?:            string
  neighborhood?: string
  type?:         string
  maxPrice?:     string
  priceRange?:   string
  bedrooms?:     string
  furnished?:    string
  verified?:     string
  sortBy?:       string
}

interface Props {
  searchParams: Promise<SearchParams>
}

/* ── helpers ────────────────────────────────────────────────── */
function parseMulti(value: string | undefined): string[] {
  if (!value) return []
  return value.split(',').filter(Boolean)
}

function parsePriceRange(value: string | undefined): [number, number] | null {
  if (!value) return null
  const [minStr, maxStr] = value.split('-')
  const min = parseInt(minStr) || 0
  const max = maxStr ? parseInt(maxStr) : Infinity
  return [min, max]
}

/* ── page ───────────────────────────────────────────────────── */
export default async function ListingsPage({ searchParams }: Props) {
  const p = await searchParams

  const query         = p.q            ?? ''
  const neighborhoods = parseMulti(p.neighborhood)
  const types         = parseMulti(p.type)
  const bedrooms      = p.bedrooms     ?? ''
  const furnished     = p.furnished === 'true'
  const verifiedOnly  = p.verified  === 'true'
  const maxPrice      = p.maxPrice ? parseInt(p.maxPrice) : undefined
  const priceRange    = parsePriceRange(p.priceRange)
  const sortBy        = p.sortBy ?? 'newest'

  /* Filter */
  let filtered = [...properties]

  if (query) {
    const q = query.toLowerCase()
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.neighborhood.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.features.some(f => f.toLowerCase().includes(q))
    )
  }
  if (neighborhoods.length) {
    filtered = filtered.filter(p => neighborhoods.includes(p.neighborhood))
  }
  if (types.length) {
    filtered = filtered.filter(p => types.includes(p.type as string))
  }
  if (bedrooms !== '') {
    const n = parseInt(bedrooms)
    filtered = filtered.filter(p => n === 4 ? p.bedrooms >= 4 : p.bedrooms === n)
  }
  if (furnished) {
    filtered = filtered.filter(p => p.furnished)
  }
  if (verifiedOnly) {
    filtered = filtered.filter(p => p.verification_level === 'full')
  }
  if (maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price_ghs <= maxPrice)
  }
  if (priceRange) {
    const [min, max] = priceRange
    filtered = filtered.filter(p => p.price_ghs >= min && p.price_ghs <= max)
  }

  /* Sort */
  const available = filtered.filter(p => p.status === 'available')
  const rented    = filtered.filter(p => p.status === 'rented')

  function sortList(list: typeof available) {
    switch (sortBy) {
      case 'price-asc':  return [...list].sort((a, b) => a.price_ghs - b.price_ghs)
      case 'price-desc': return [...list].sort((a, b) => b.price_ghs - a.price_ghs)
      case 'views':      return [...list].sort((a, b) => b.views - a.views)
      case 'verified':   return [...list].sort((a, b) => (b.verification_level === 'full' ? 1 : 0) - (a.verification_level === 'full' ? 1 : 0))
      default:           return [...list].sort((a, b) => new Date(b.listed_date).getTime() - new Date(a.listed_date).getTime())
    }
  }

  const sortedAvailable = sortList(available)
  const allResults      = [...sortedAvailable, ...rented]

  /* Active filter labels */
  const activeFilters: { label: string; clearKey: string; clearValue: string }[] = []
  if (query)              activeFilters.push({ label: `"${query}"`,              clearKey: 'q',            clearValue: ''      })
  if (neighborhoods.length) activeFilters.push({ label: neighborhoods.join(', '), clearKey: 'neighborhood', clearValue: ''      })
  if (types.length)       activeFilters.push({ label: types.map(t => t.replace('_', ' ')).join(', '), clearKey: 'type', clearValue: '' })
  if (bedrooms)           activeFilters.push({ label: bedrooms === '0' ? 'Studio' : `${bedrooms}${parseInt(bedrooms) >= 4 ? '+' : ''} bed${parseInt(bedrooms) > 1 ? 's' : ''}`, clearKey: 'bedrooms', clearValue: '' })
  if (furnished)          activeFilters.push({ label: 'Furnished',               clearKey: 'furnished',    clearValue: ''      })
  if (verifiedOnly)       activeFilters.push({ label: 'Verified only',            clearKey: 'verified',     clearValue: ''      })
  if (p.priceRange)       activeFilters.push({ label: `Price: ${p.priceRange.replace('-', ' – ')} GHS`, clearKey: 'priceRange', clearValue: '' })

  const hasFilters = activeFilters.length > 0

  return (
    <div className="pt-nav min-h-screen bg-page-bg">

      {/* Sticky search bar */}
      <div className="sticky top-16 z-30 bg-white border-b border-border-col shadow-sm">
        <div className="max-w-content mx-auto px-4 lg:px-8 py-3">
          <Suspense fallback={<div className="h-11 bg-stone-100 rounded-btn animate-pulse" />}>
            <SearchBar compact />
          </Suspense>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 lg:px-8 py-8 pb-24 lg:pb-8">
        <div className="flex flex-col lg:flex-row gap-7">

          {/* Sidebar */}
          <Suspense fallback={<div className="lg:w-64 xl:w-72 h-96 bg-white rounded-card border border-border-col animate-pulse flex-shrink-0" />}>
            <FilterSidebar />
          </Suspense>

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Results header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-display font-bold text-ink text-xl">
                  {hasFilters ? `${available.length} matching` : 'All Properties'}
                  {available.length !== 1 ? ' properties' : ' property'}
                </h1>
                <p className="text-muted text-sm mt-0.5">
                  {rented.length > 0 && `${rented.length} recently rented shown below ·`} Sorted:{' '}
                  {sortBy === 'newest'     ? 'Newest first'      :
                   sortBy === 'price-asc' ? 'Price: Low → High' :
                   sortBy === 'price-desc'? 'Price: High → Low' :
                   sortBy === 'views'     ? 'Most viewed'        :
                                            'Verified first'}
                </p>
              </div>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-5">
                {activeFilters.map(f => (
                  <Link
                    key={f.label}
                    href={(() => {
                      const next = new URLSearchParams(
                        Object.entries(p).filter(([, v]) => v !== undefined) as [string, string][]
                      )
                      next.delete(f.clearKey)
                      return `/listings?${next.toString()}`
                    })()}
                    className="flex items-center gap-1.5 bg-ghana-green-50 text-ghana-green border border-ghana-green/25 text-xs font-semibold px-2.5 py-1 rounded-badge hover:bg-ghana-green hover:text-white transition-colors"
                  >
                    {f.label}
                    <X className="w-3 h-3" />
                  </Link>
                ))}
                <Link
                  href="/listings"
                  className="text-xs text-muted hover:text-ghana-green font-medium px-1 py-1"
                >
                  Clear all
                </Link>
              </div>
            )}

            {/* Property grid */}
            {allResults.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-card border border-border-col">
                <div className="w-16 h-16 rounded-full bg-ghana-green-50 flex items-center justify-center mx-auto mb-4">
                  <X className="w-7 h-7 text-muted" />
                </div>
                <h2 className="font-display font-semibold text-ink text-lg mb-2">No listings match your filters</h2>
                <p className="text-muted text-sm mb-5">Try adjusting or clearing some filters.</p>
                <Link href="/listings" className="text-ghana-green font-semibold text-sm hover:underline">
                  Clear all filters →
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {allResults.map((prop, i) => (
                  <PropertyCard key={prop.slug} property={prop} priority={i < 4} />
                ))}
              </div>
            )}

            {/* List a property prompt */}
            {allResults.length > 0 && (
              <div className="mt-10 bg-ghana-gold/10 border border-ghana-gold/30 rounded-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-ink text-sm">Own a property in this area?</p>
                  <p className="text-muted text-xs mt-0.5">List it free and reach verified tenants — no agent needed.</p>
                </div>
                <Link
                  href="/list"
                  className="flex-shrink-0 bg-ghana-green text-white text-sm font-semibold px-5 py-2.5 rounded-btn hover:bg-ghana-green-dark transition-colors whitespace-nowrap"
                >
                  List for Free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
