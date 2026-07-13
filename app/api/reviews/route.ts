import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const sb   = createServerClient()

    const initials = (body.name as string)
      .split(' ')
      .map((w: string) => w[0]?.toUpperCase() ?? '')
      .slice(0, 2)
      .join('')

    const { data, error } = await sb.from('reviews').insert({
      landlord_slug:     body.landlordSlug,
      reviewer_type:     body.reviewerType,
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
