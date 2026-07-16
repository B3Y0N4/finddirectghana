'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next   = params.get('next') ?? '/'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      })
      const json = await res.json()
      if (res.ok) {
        const destination = next !== '/' ? next : json.role === 'landlord' ? '/list' : '/'
        router.push(destination)
        router.refresh()
      } else {
        setError(json.error ?? 'Login failed')
      }
    } catch {
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-4 py-3.5 border border-border-col rounded-btn text-sm text-ink focus:outline-none focus:border-ghana-green focus:ring-1 focus:ring-ghana-green bg-white'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">Email address</label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input
            type="email"
            className={`${inputClass} pl-10`}
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-ink mb-1.5">Password</label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input
            type={showPw ? 'text' : 'password'}
            className={`${inputClass} pl-10 pr-10`}
            placeholder="Your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
            onClick={() => setShowPw(v => !v)}
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-ghana-red text-sm bg-ghana-red/5 border border-ghana-red/20 rounded-btn px-3 py-2.5">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-ghana-green text-white font-bold text-sm py-3.5 rounded-btn hover:bg-ghana-green-dark transition-colors disabled:opacity-60"
      >
        {loading ? 'Signing in…' : 'Sign In'}
      </button>

      <p className="text-center text-xs text-muted pt-1">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="text-ghana-green font-semibold hover:underline">
          Sign up free
        </Link>
      </p>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="pt-nav min-h-screen bg-page-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        <div className="text-center mb-7">
          <Link href="/" className="inline-block mb-5">
            <div className="w-12 h-12 rounded-full bg-ghana-green flex items-center justify-center mx-auto">
              <span className="text-ghana-gold font-display font-bold text-sm leading-none">FD</span>
            </div>
          </Link>
          <h1 className="font-display font-bold text-ink text-2xl">Welcome back</h1>
          <p className="text-muted text-sm mt-1">Sign in to your Find Direct Ghana account</p>
        </div>

        <div className="bg-white border border-border-col rounded-card p-6 shadow-card">
          <Suspense fallback={<div className="h-52 animate-pulse bg-page-bg rounded-btn" />}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="text-center text-xs text-muted mt-5">
          Are you a landlord?{' '}
          <Link href="/auth/signup" className="text-ghana-green font-semibold hover:underline">
            Create a landlord account
          </Link>
        </p>
      </div>
    </div>
  )
}
