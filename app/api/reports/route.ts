import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { reportSchema } from '@/lib/validation'

export async function POST(req: Request) {
  try {
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
