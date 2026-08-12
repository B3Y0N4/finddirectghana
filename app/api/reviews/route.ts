import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { getSession } from '@/lib/auth'
import { reviewSchema } from '@/lib/validation'

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Sign in to continue' }, { status: 401 })
    }

    const parsed = reviewSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const body = parsed.data
    const sb   = createServerClient()

    const initials = body.name
      .split(' ')
      .map(w => w[0]?.toUpperCase() ?? '')
      .slice(0, 2)
      .join('')

    const { data, error } = await sb.from('reviews').insert({
      landlord_id:       body.landlordId ?? null,
      landlord_slug:     body.landlordSlug,
      reviewer_type:     body.reviewerType,
      reviewer_id:       session.sub,
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
