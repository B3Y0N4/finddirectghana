'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState }                    from 'react'
import { X, SlidersHorizontal, ChevronDown }        from 'lucide-react'
import { neighborhoods, propertyTypes }             from '@/lib/properties'

const PRICE_RANGES = [
  { label: 'Under GHS 2,000',      value: '0-2000'    },
  { label: 'GHS 2,000 – 3,500',    value: '2000-3500' },
  { label: 'GHS 3,500 – 6,000',    value: '3500-6000' },
  { label: 'GHS 6,000 – 10,000',   value: '6000-10000'},
  { label: 'Above GHS 10,000',      value: '10000-'   },
]

const BEDROOM_OPTIONS = [
  { label: 'Any',    value: ''  },
  { label: 'Studio', value: '0' },
  { label: '1 Bed',  value: '1' },
  { label: '2 Beds', value: '2' },
  { label: '3 Beds', value: '3' },
  { label: '4+',     value: '4' },
]

export default function FilterSidebar() {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()
  const [mobileOpen, setMobileOpen] = useState(false)

  const get = (key: string) => searchParams.get(key) ?? ''

  const update = useCallback((key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString())
    if (value) next.set(key, value)
    else        next.delete(key)
    router.push(`${pathname}?${next.toString()}`, { scroll: false })
  }, [router, pathname, searchParams])

  const toggle = useCallback((key: string, item: string) => {
    const current = get(key).split(',').filter(Boolean)
    const updated = current.includes(item)
      ? current.filter(x => x !== item)
      : [...current, item]
    update(key, updated.join(','))
  }, [get, update])

  const clearAll = useCallback(() => {
    router.push(pathname, { scroll: false })
  }, [router, pathname])

  const selectedNeighborhoods = get('neighborhood').split(',').filter(Boolean)
  const selectedTypes         = get('type').split(',').filter(Boolean)
  const selectedPrice         = get('priceRange')
  const selectedBedrooms      = get('bedrooms')
  const furnished             = get('furnished') === 'true'
  const verifiedOnly          = get('verified')  === 'true'
  const sortBy                = get('sortBy') || 'newest'

  const hasFilters = !!(
    selectedNeighborhoods.length || selectedTypes.length ||
    selectedPrice || selectedBedrooms ||
    furnished || verifiedOnly
  )

  const activeCount = [
    selectedNeighborhoods.length > 0,
    selectedTypes.length > 0,
    !!selectedPrice,
    !!selectedBedrooms,
    furnished,
    verifiedOnly,
  ].filter(Boolean).length

  const headingClass = 'text-[10px] font-bold uppercase tracking-widest text-muted mb-3'
  const dividerClass = 'border-t border-border-col pt-5 mt-5'

  const FilterContent = () => (
    <div className="px-5 py-5 space-y-0">

      {/* Sort */}
      <div>
        <p className={headingClass}>Sort by</p>
        <div className="space-y-1.5">
          {[
            { label: 'Newest first',      value: 'newest'     },
            { label: 'Price: Low → High', value: 'price-asc'  },
            { label: 'Price: High → Low', value: 'price-desc' },
            { label: 'Most viewed',       value: 'views'      },
            { label: 'Verified first',    value: 'verified'   },
          ].map(opt => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="sortBy"
                value={opt.value}
                checked={sortBy === opt.value}
                onChange={() => update('sortBy', opt.value)}
                className="accent-ghana-green w-3.5 h-3.5"
              />
              <span className="text-sm text-ink/80 group-hover:text-ink">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className={dividerClass}>
        <p className={headingClass}>Price Range</p>
        <div className="space-y-1.5">
          {PRICE_RANGES.map(opt => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="priceRange"
                value={opt.value}
                checked={selectedPrice === opt.value}
                onChange={() => update('priceRange', selectedPrice === opt.value ? '' : opt.value)}
                className="accent-ghana-green w-3.5 h-3.5"
              />
              <span className="text-sm text-ink/80 group-hover:text-ink">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div className={dividerClass}>
        <p className={headingClass}>Bedrooms</p>
        <div className="flex flex-wrap gap-2">
          {BEDROOM_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => update('bedrooms', opt.value)}
              className={`px-3 py-1.5 rounded-btn text-xs font-semibold border transition-colors ${
                selectedBedrooms === opt.value
                  ? 'bg-ghana-green text-white border-ghana-green'
                  : 'border-border-col text-ink hover:border-ghana-green hover:text-ghana-green'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div className={dividerClass}>
        <p className={headingClass}>Property Type</p>
        <div className="space-y-1.5">
          {propertyTypes.map(t => (
            <label key={t.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedTypes.includes(t.value)}
                onChange={() => toggle('type', t.value)}
                className="accent-ghana-green w-3.5 h-3.5 rounded"
              />
              <span className="text-sm text-ink/80 group-hover:text-ink">{t.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Neighborhood */}
      <div className={dividerClass}>
        <p className={headingClass}>Neighborhood</p>
        <div className="space-y-1.5 max-h-52 overflow-y-auto no-scrollbar">
          {neighborhoods.map(n => (
            <label key={n} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedNeighborhoods.includes(n)}
                onChange={() => toggle('neighborhood', n)}
                className="accent-ghana-green w-3.5 h-3.5 rounded"
              />
              <span className="text-sm text-ink/80 group-hover:text-ink">{n}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Quick toggles */}
      <div className={dividerClass}>
        <p className={headingClass}>More filters</p>
        <div className="space-y-2.5">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-ink/80">Furnished only</span>
            <button
              role="switch"
              aria-checked={furnished}
              onClick={() => update('furnished', furnished ? '' : 'true')}
              className={`w-9 h-5 rounded-full transition-colors flex-shrink-0 relative ${furnished ? 'bg-ghana-green' : 'bg-border-col'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${furnished ? 'left-4' : 'left-0.5'}`} />
            </button>
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-ink/80">Verified owners only</span>
            <button
              role="switch"
              aria-checked={verifiedOnly}
              onClick={() => update('verified', verifiedOnly ? '' : 'true')}
              className={`w-9 h-5 rounded-full transition-colors flex-shrink-0 relative ${verifiedOnly ? 'bg-ghana-green' : 'bg-border-col'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${verifiedOnly ? 'left-4' : 'left-0.5'}`} />
            </button>
          </label>
        </div>
      </div>

    </div>
  )

  return (
    <>
      {/* ── DESKTOP SIDEBAR (lg+) ─────────────────────────────── */}
      <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
        <div className="bg-white border border-border-col rounded-card overflow-hidden sticky top-24">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-col bg-page-bg">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-ghana-green" />
              <span className="font-semibold text-ink text-sm">Filters</span>
            </div>
            {hasFilters && (
              <button
                onClick={clearAll}
                className="text-xs text-ghana-green font-semibold hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear all
              </button>
            )}
          </div>
          <FilterContent />
        </div>
      </aside>

      {/* ── MOBILE FLOATING BUTTON (hidden on lg+) ────────────── */}
      <div className="lg:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 bg-ghana-green-dark text-white font-semibold text-sm px-5 py-3 rounded-full shadow-xl border border-white/10"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters & Sort
          {activeCount > 0 && (
            <span className="bg-ghana-gold text-ink text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center -ml-0.5">
              {activeCount}
            </span>
          )}
          <ChevronDown className="w-3.5 h-3.5 opacity-60" />
        </button>
      </div>

      {/* ── MOBILE BOTTOM SHEET ───────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Sheet */}
          <div className="relative bg-white rounded-t-2xl max-h-[88vh] flex flex-col shadow-2xl">

            {/* Sheet header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-col flex-shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-ghana-green" />
                <span className="font-semibold text-ink text-base">Filters & Sort</span>
                {activeCount > 0 && (
                  <span className="bg-ghana-green text-white text-[10px] font-bold px-2 py-0.5 rounded-badge">
                    {activeCount} active
                  </span>
                )}
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-muted hover:text-ink"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable filter content */}
            <div className="overflow-y-auto flex-1">
              <FilterContent />
            </div>

            {/* Footer buttons */}
            <div className="flex gap-3 px-5 py-4 border-t border-border-col flex-shrink-0 bg-white">
              {hasFilters && (
                <button
                  onClick={() => { clearAll(); setMobileOpen(false) }}
                  className="flex-1 py-3 rounded-btn border border-border-col text-sm font-semibold text-muted hover:border-ghana-green hover:text-ghana-green transition-colors"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setMobileOpen(false)}
                className="flex-1 py-3 rounded-btn bg-ghana-green text-white text-sm font-semibold hover:bg-ghana-green-dark transition-colors"
              >
                Show results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
