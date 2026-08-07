import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { timingSafeEqual } from 'crypto'
import { jwtSecret } from '@/lib/jwt-secret'

const COOKIE = 'admin_token'

// In-memory lockout — resets on redeploy/restart and is per-instance only
// (won't coordinate across multiple serverless instances). Good enough as a
// stopgap; a real deployment should use a shared store (e.g. Redis).
const MAX_ATTEMPTS  = 5
const WINDOW_MS     = 15 * 60 * 1000
const attempts = new Map<string, { count: number; resetAt: number }>()

function isLockedOut(ip: string): boolean {
  const entry = attempts.get(ip)
  if (!entry) return false
  if (Date.now() > entry.resetAt) {
    attempts.delete(ip)
    return false
  }
  return entry.count >= MAX_ATTEMPTS
}

function recordFailure(ip: string) {
  const entry = attempts.get(ip)
  if (!entry || Date.now() > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: Date.now() + WINDOW_MS })
  } else {
    entry.count++
  }
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  // Buffers must be equal length for timingSafeEqual; pad the comparison
  // rather than short-circuiting on length to avoid leaking length info.
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA) // still do a comparison to keep timing flat
    return false
  }
  return timingSafeEqual(bufA, bufB)
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'

  if (isLockedOut(ip)) {
    return NextResponse.json({ error: 'Too many attempts — try again later' }, { status: 429 })
  }

  const { email, password } = await req.json()

  const validEmail    = typeof email === 'string' && timingSafeStringEqual(email, process.env.ADMIN_EMAIL ?? '')
  const validPassword = typeof password === 'string' && timingSafeStringEqual(password, process.env.ADMIN_PASSWORD ?? '')

  if (!validEmail || !validPassword) {
    recordFailure(ip)
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  attempts.delete(ip)

  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(jwtSecret())

  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   60 * 60 * 24 * 7,
    path:     '/',
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(COOKIE)
  return res
}
