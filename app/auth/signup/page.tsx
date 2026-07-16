'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

type Role = 'tenant' | 'landlord'

export default function SignupPage() {
  const router = useRouter()

  const [role,     setRole]     = useState<Role>('tenant')
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [phone,    setPhone]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/auth/signup', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, phone: phone || undefined, password, role }),
      })
      const json = await res.json()
      if (res.ok) {
        router.push(role === 'landlord' ? '/list' : '/')
        router.refresh()
      } else {
        setError(json.error ?? 'Signup failed')
      }
    } catch {
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-4 py-3.5 border border-border-col rounded-btn text-sm text-ink focus:outline-none focus:border-ghana-green focus:ring-1 focus:ring-ghana-green bg-white'

  return (
    <div className="pt-nav min-h-screen bg-page-bg flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">

        <div className="text-center mb-7">
          <Link href="/" className="inline-block mb-5">
            <div className="w-12 h-12 rounded-full bg-ghana-green flex items-center justify-center mx-auto">
              <span className="text-ghana-gold font-display font-bold text-sm leading-none">FD</span>
            </div>
          </Link>
          <h1 className="font-display font-bold text-ink text-2xl">Create your account</h1>
          <p className="text-muted text-sm mt-1">100% free · No hidden fees</p>
        </div>

        <div className="bg-white border border-border-col rounded-card p-6 shadow-card">

          {/* Role selector */}
          <div className="mb-5">
            <p className="text-sm font-semibold text-ink mb-2.5">I am a…</p>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: 'tenant',   label: 'Tenant',   desc: 'Looking to rent'     },
                { value: 'landlord', label: 'Landlord', desc: 'I have property to list' },
              ] as { value: Role; label: string; desc: string }[]).map(({ value, label, desc }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRole(value)}
                  className={cn(
                    'flex flex-col items-center gap-1 py-4 px-3 rounded-card border-2 transition-all duration-150',
                    role === value
                      ? 'border-ghana-green bg-ghana-green/5'
                      : 'border-border-col hover:border-ghana-green/40'
                  )}
                >
                  <span className={cn(
                    'font-display font-bold text-sm',
                    role === value ? 'text-ghana-green' : 'text-ink'
                  )}>{label}</span>
                  <span className="text-[11px] text-muted text-center leading-tight">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Full Name *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                <input
                  type="text"
                  className={`${inputClass} pl-10`}
                  placeholder="Kofi Mensah"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Email Address *</label>
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
              <label className="block text-sm font-semibold text-ink mb-1.5">
                WhatsApp Number{role === 'landlord' ? ' *' : ' (optional)'}
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                <span className="absolute left-9 top-1/2 -translate-y-1/2 text-muted text-sm font-semibold select-none pointer-events-none">+233</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  className={`${inputClass} pl-[4.5rem]`}
                  placeholder="24 XXX XXXX"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required={role === 'landlord'}
                />
              </div>
              {role === 'landlord' && (
                <p className="text-muted text-xs mt-1">Tenants will contact you on this number</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1.5">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
                <input
                  type={showPw ? 'text' : 'password'}
                  className={`${inputClass} pl-10 pr-10`}
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
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
              className="w-full bg-ghana-green text-white font-bold text-sm py-3.5 rounded-btn hover:bg-ghana-green-dark transition-colors disabled:opacity-60 mt-1"
            >
              {loading
                ? 'Creating account…'
                : role === 'landlord' ? 'Create Landlord Account' : 'Create Account'}
            </button>

            <p className="text-center text-xs text-muted">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-ghana-green font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-muted mt-5 leading-relaxed">
          By signing up you agree to our community standards.<br />
          No spam. No agents. No fees.
        </p>
      </div>
    </div>
  )
}
