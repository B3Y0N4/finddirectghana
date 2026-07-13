import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

async function withSignedUrls(sb: ReturnType<typeof createServerClient>, listings: Record<string, unknown>[]) {
  return Promise.all(listings.map(async listing => {
    const signed: Record<string, string> = {}
    for (const field of ['ghana_card_front_url', 'ghana_card_back_url', 'selfie_url'] as const) {
      const path = listing[field] as string | null
      if (path && !path.startsWith('http')) {
        const { data } = await sb.storage
          .from('verification-docs')
          .createSignedUrl(path, 3600)
        if (data?.signedUrl) signed[field] = data.signedUrl
      }
    }
    return { ...listing, ...signed }
  }))
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') ?? 'pending'
  const sb = createServerClient()

  const { data, error } = await sb
    .from('listings')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const withUrls = await withSignedUrls(sb, data ?? [])
  return NextResponse.json(withUrls)
}

export async function PATCH(req: Request) {
  const { id, status, admin_notes } = await req.json()
  const sb = createServerClient()

  const { error } = await sb
    .from('listings')
    .update({ status, admin_notes, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
