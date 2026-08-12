'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ListingRawStatus } from '@/lib/types'

interface Props {
  slug: string
  status: Extract<ListingRawStatus, 'approved' | 'rented' | 'paused'>
}

export default function ListingStatusToggle({ slug, status }: Props) {
  const router = useRouter()
  const [busy, setBusy]   = useState(false)
  const [error, setError] = useState('')

  async function setStatus(next: 'approved' | 'rented' | 'paused') {
    setBusy(true)
    setError('')
    try {
      const res = await fetch(`/api/listings/${slug}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status: next }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => null)
        setError(json?.error ?? 'Something went wrong')
        setBusy(false)
        return
      }
      router.refresh()
    } catch {
      setError('Network error — please try again')
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {status === 'approved' && (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={() => setStatus('rented')}
              className="text-xs font-semibold px-3 py-2 rounded-btn bg-ghana-green text-white hover:bg-ghana-green-dark transition-colors disabled:opacity-50"
            >
              Mark as Rented
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setStatus('paused')}
              className="text-xs font-semibold px-3 py-2 rounded-btn border border-border-col text-muted hover:text-ink hover:border-ink transition-colors disabled:opacity-50"
            >
              Pause Listing
            </button>
          </>
        )}
        {status === 'rented' && (
          <button
            type="button"
            disabled={busy}
            onClick={() => setStatus('approved')}
            className="text-xs font-semibold px-3 py-2 rounded-btn bg-ghana-green text-white hover:bg-ghana-green-dark transition-colors disabled:opacity-50"
          >
            Mark as Available
          </button>
        )}
        {status === 'paused' && (
          <button
            type="button"
            disabled={busy}
            onClick={() => setStatus('approved')}
            className="text-xs font-semibold px-3 py-2 rounded-btn bg-ghana-green text-white hover:bg-ghana-green-dark transition-colors disabled:opacity-50"
          >
            Reactivate Listing
          </button>
        )}
      </div>
      {error && <p className="text-xs text-ghana-red">{error}</p>}
    </div>
  )
}
