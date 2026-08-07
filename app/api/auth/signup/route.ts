import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { createServerClient } from '@/lib/supabase-server'
import { jwtSecret } from '@/lib/jwt-secret'
import { signupSchema } from '@/lib/validation'

const COOKIE  = 'user_token'
const MAX_AGE = 60 * 60 * 24 * 30 // 30 days

async function issueToken(sub: string, email: string, role: string, name: string) {
  return new SignJWT({ sub, email, role, name })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(jwtSecret())
}

export async function POST(req: Request) {
  try {
    const parsed = signupSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const { email, password, name, phone, role } = parsed.data

    const sb = createServerClient()

    const { data, error } = await sb.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role },
    })

    if (error || !data.user) {
      const msg = error?.message ?? 'Signup failed'
      const status = msg.toLowerCase().includes('already registered') ? 409 : 400
      return NextResponse.json({ error: msg }, { status })
    }

    await sb.from('profiles').insert({
      id:        data.user.id,
      role,
      full_name: name,
      phone:     phone ?? null,
    })

    const token = await issueToken(data.user.id, email, role, name)
    const res   = NextResponse.json({ ok: true, role, name })

    res.cookies.set(COOKIE, token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge:   MAX_AGE,
      path:     '/',
    })

    return res
  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
