'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState }                    from 'react'
import { Search }                      from 'lucide-react'
import { neighborhoods, propertyTypes } from '@/lib/properties'

interface Props {
  compact?: boolean
  hero?:    boolean
}

export default function SearchBar({ compact = false, hero = false }: Props) {
  const router = useRouter()
  const params = useSearchParams()

  const [query,        setQuery]        = useState(params.get('q')            ?? '')
  const [neighborhood, setNeighborhood] = useState(params.get('neighborhood') ?? '')
  const [type,         setType]         = useState(params.get('type')         ?? '')
  const [maxPrice,     setMaxPrice]     = useState(params.get('maxPrice')     ?? '')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = new URLSearchParams()
    if (query)        q.set('q',            query)
    if (neighborhood) q.set('neighborhood', neighborhood)
    if (type)         q.set('type',         type)
    if (maxPrice)     q.set('maxPrice',     maxPrice)
    router.push(`/listings?${q.toString()}`)
  }

  const selectClass = `
    flex-1 min-w-0 px-4 py-3 border border-border-col rounded-btn text-sm text-ink
    focus:outline-none focus:border-ghana-green focus:ring-1 focus:ring-ghana-green
    appearance-none cursor-pointer bg-white
  `

  const inputClass = `
    flex-1 min-w-0 px-4 py-3 border border-border-col rounded-btn text-sm text-ink
    focus:outline-none focus:border-ghana-green focus:ring-1 focus:ring-ghana-green bg-white
    placeholder-muted
  `

  /* ── HERO MODE — keyword + neighborhood + type in one row ── */
  if (hero) {
    return (
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
        <div className="flex-[2] relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Apartment, house, studio..."
            className={`${inputClass} pl-10 w-full`}
          />
        </div>
        <select
          value={neighborhood}
          onChange={e => setNeighborhood(e.target.value)}
          className={`${selectClass} flex-[1.5]`}
          aria-label="Neighborhood"
        >
          <option value="">Any Neighborhood</option>
          {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className={`${selectClass} flex-1`}
          aria-label="Property type"
        >
          <option value="">Any Type</option>
          {propertyTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-ghana-gold text-ink font-bold text-sm px-6 py-3 rounded-btn hover:bg-ghana-gold-light transition-colors flex-shrink-0"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </form>
    )
  }

  /* ── COMPACT (listings page top bar) ── */
  if (compact) {
    return (
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by location or type..."
            className={`${inputClass} pl-9 w-full`}
          />
        </div>
        {/* Selects hidden on mobile — covered by the filter drawer */}
        <select value={neighborhood} onChange={e => setNeighborhood(e.target.value)} className={`${selectClass} hidden sm:block`} aria-label="Neighborhood">
          <option value="">All Neighborhoods</option>
          {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <select value={type} onChange={e => setType(e.target.value)} className={`${selectClass} hidden sm:block`} aria-label="Property type">
          <option value="">Any Type</option>
          {propertyTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-ghana-green text-white font-semibold text-sm px-4 py-3 rounded-btn hover:bg-ghana-green-dark transition-colors flex-shrink-0"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </form>
    )
  }

  /* ── DEFAULT (homepage fallback) ── */
  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
      <select value={neighborhood} onChange={e => setNeighborhood(e.target.value)} className={selectClass} aria-label="Neighborhood">
        <option value="">All Neighborhoods</option>
        {neighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      <select value={type} onChange={e => setType(e.target.value)} className={selectClass} aria-label="Property type">
        <option value="">Any Type</option>
        {propertyTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
      </select>
      <select value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className={selectClass} aria-label="Max price">
        <option value="">Any Price</option>
        <option value="2000">Under GHS 2,000/mo</option>
        <option value="3000">Under GHS 3,000/mo</option>
        <option value="5000">Under GHS 5,000/mo</option>
        <option value="8000">Under GHS 8,000/mo</option>
        <option value="10000">Under GHS 10,000/mo</option>
      </select>
      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-ghana-green text-white font-semibold text-sm px-6 py-3 rounded-btn hover:bg-ghana-green-dark transition-colors flex-shrink-0"
      >
        <Search className="w-4 h-4" />
        Search Properties
      </button>
    </form>
  )
}
