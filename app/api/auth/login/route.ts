import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { createServerClient, createAuthClient } from '@/lib/supabase-server'
import { jwtSecret } from '@/lib/jwt-secret'
import { loginSchema } from '@/lib/validation'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

const COOKIE  = 'user_token'
const MAX_AGE = 60 * 60 * 24 * 30

export async function POST(req: Request) {
  try {
    if (!rateLimit(`login:${getClientIp(req)}`, 8, 15 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many attempts — try again later' }, { status: 429 })
    }

    const parsed = loginSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const { email, password } = parsed.data

    const auth = createAuthClient()
    const { data, error } = await auth.auth.signInWithPassword({ email, password })

    if (error || !data.user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const sb = createServerClient()
    const { data: profile } = await sb
      .from('profiles')
      .select('role, full_name')
      .eq('id', data.user.id)
      .single()

    const role = (profile?.role ?? data.user.user_metadata?.role ?? 'tenant') as string
    const name = (profile?.full_name ?? data.user.user_metadata?.name ?? '') as string

    const token = await new SignJWT({ sub: data.user.id, email, role, name })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('30d')
      .sign(jwtSecret())

    const res = NextResponse.json({ ok: true, role, name })

    res.cookies.set(COOKIE, token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   MAX_AGE,
      path:     '/',
    })

    return res
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
