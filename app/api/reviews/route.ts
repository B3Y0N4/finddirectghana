import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { createServerClient } from '@/lib/supabase-server'

async function getReviewerId(): Promise<string | null> {
  try {
    const store = await cookies()
    const token = store.get('user_token')?.value
    if (!token) return null
    const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret-change-me')
    const { payload } = await jwtVerify(token, secret)
    return (payload.sub as string) ?? null
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  try {
    const body       = await req.json()
    const sb         = createServerClient()
    const reviewerId = await getReviewerId()

    const initials = (body.name as string)
      .split(' ')
      .map((w: string) => w[0]?.toUpperCase() ?? '')
      .slice(0, 2)
      .join('')

    const { data, error } = await sb.from('reviews').insert({
      landlord_slug:     body.landlordSlug,
      reviewer_type:     body.reviewerType,
      reviewer_id:       reviewerId ?? null,
      reviewer_name:     body.name,
      reviewer_initials: initials,
      rating:            body.rating,
      categories:        body.categories ?? [],
      title:             body.title,
      body:              body.body,
      status:            'pending',
      verified:          false,
    }).select('id').single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, id: data.id })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
