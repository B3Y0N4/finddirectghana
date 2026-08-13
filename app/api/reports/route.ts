import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { reportSchema } from '@/lib/validation'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

export async function POST(req: Request) {
  try {
    if (!rateLimit(`reports-post:${getClientIp(req)}`, 10, 60 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many submissions — try again later' }, { status: 429 })
    }

    const parsed = reportSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }
    const body = parsed.data
    const sb = createServerClient()

    const { error } = await sb.from('reports').insert({
      listing_url:    body.url ?? null,
      issue_type:     body.issueType,
      description:    body.description,
      reporter_phone: body.phone ?? null,
      status:         'open',
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
