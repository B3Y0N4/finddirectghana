import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

function jwtSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret-change-me')
}

async function verify(token: string) {
  const { payload } = await jwtVerify(token, jwtSecret())
  return payload
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const method = req.method

  // ── ADMIN ROUTES ──────────────────────────────────────────────
  const isAdminPage = pathname.startsWith('/admin') && pathname !== '/admin/login'
  const isAdminApi  = pathname.startsWith('/api/admin') && pathname !== '/api/admin/auth'

  if (isAdminPage || isAdminApi) {
    const token = req.cookies.get('admin_token')?.value
    if (!token) {
      if (isAdminApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    try {
      await verify(token)
    } catch {
      if (isAdminApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    return NextResponse.next()
  }

  // ── USER-PROTECTED ROUTES ─────────────────────────────────────
  // /list page requires login (any role)
  // POST to /api/listings and /api/reviews requires login
  const isProtectedPage = pathname === '/list'
  const isProtectedPost = method === 'POST' &&
    (pathname === '/api/listings' || pathname === '/api/reviews')

  if (isProtectedPage || isProtectedPost) {
    const token = req.cookies.get('user_token')?.value
    if (!token) {
      if (isProtectedPost) {
        return NextResponse.json({ error: 'Sign in to continue', code: 'UNAUTHENTICATED' }, { status: 401 })
      }
      const next = encodeURIComponent(pathname)
      return NextResponse.redirect(new URL(`/auth/login?next=${next}`, req.url))
    }
    try {
      await verify(token)
    } catch {
      if (isProtectedPost) {
        return NextResponse.json({ error: 'Session expired — please sign in again', code: 'SESSION_EXPIRED' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/list',
    '/api/listings',
    '/api/reviews',
  ],
}
