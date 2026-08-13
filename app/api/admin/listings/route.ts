import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { adminPatchSchema } from '@/lib/validation'
import { VERIFICATION_DOCS_BUCKET } from '@/lib/storage'

async function withSignedUrls(sb: ReturnType<typeof createServerClient>, listings: Record<string, unknown>[]) {
  return Promise.all(listings.map(async listing => {
    const signed: Record<string, string> = {}
    for (const field of ['ghana_card_front_url', 'ghana_card_back_url', 'selfie_url'] as const) {
      const path = listing[field] as string | null
      if (path && !path.startsWith('http')) {
        const { data } = await sb.storage
          .from(VERIFICATION_DOCS_BUCKET)
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
  const parsed = adminPatchSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }
  const { id, status, admin_notes } = parsed.data
  const sb = createServerClient()

  const { error } = await sb
    .from('listings')
    .update({ status, admin_notes, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (status === 'approved') {
    // Promote card verification for listings that had Ghana Card docs
    // uploaded at submission (verification_level was set to 'pending' then).
    // No-ops for listings with no docs (verification_level 'none') or
    // already-full listings.
    const { error: verifyError } = await sb
      .from('listings')
      .update({ verified_card: true, verification_level: 'full' })
      .eq('id', id)
      .eq('verification_level', 'pending')

    if (verifyError) console.error('Card verification promote error:', verifyError.message)
  }

  return NextResponse.json({ ok: true })
}
