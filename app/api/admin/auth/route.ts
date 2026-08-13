import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { timingSafeEqual } from 'crypto'
import { jwtSecret } from '@/lib/jwt-secret'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

const COOKIE = 'admin_token'

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
  const ip = getClientIp(req)

  if (!rateLimit(`admin-auth:${ip}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many attempts — try again later' }, { status: 429 })
  }

  const { email, password } = await req.json()

  const validEmail    = typeof email === 'string' && timingSafeStringEqual(email, process.env.ADMIN_EMAIL ?? '')
  const validPassword = typeof password === 'string' && timingSafeStringEqual(password, process.env.ADMIN_PASSWORD ?? '')

  if (!validEmail || !validPassword) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

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
