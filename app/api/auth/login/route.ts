import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { createServerClient, createAuthClient } from '@/lib/supabase-server'

const COOKIE  = 'user_token'
const MAX_AGE = 60 * 60 * 24 * 30

function secret() {
  return new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret-change-me')
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

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
      .sign(secret())

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
