'use client'

import { useEffect, useState } from 'react'

type ContactState =
  | { status: 'loading' }
  | { status: 'guest' }
  | { status: 'ready'; phone: string }

export function useLandlordContact(slug: string): ContactState {
  const [state, setState] = useState<ContactState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    fetch('/api/auth/me')
      .then(r => (r.ok ? r.json() : null))
      .then(user => {
        if (cancelled) return
        if (!user) {
          setState({ status: 'guest' })
          return
        }
        return fetch(`/api/listings/${slug}/contact`)
          .then(r => (r.ok ? r.json() : null))
          .then(data => {
            if (cancelled) return
            setState(data?.phone ? { status: 'ready', phone: data.phone } : { status: 'guest' })
          })
      })
      .catch(() => { if (!cancelled) setState({ status: 'guest' }) })

    return () => { cancelled = true }
  }, [slug])

  return state
}
