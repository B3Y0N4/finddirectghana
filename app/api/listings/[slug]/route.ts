import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { getSession } from '@/lib/auth'
import { landlordListingPatchSchema } from '@/lib/validation'

// Landlord self-service: toggle a listing's availability after it has
// already passed moderation. Cannot touch pending/rejected listings —
// those transitions are admin-only (see /api/admin/listings).
export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Sign in to continue' }, { status: 401 })
  }

  const parsed = landlordListingPatchSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }

  const { slug } = await params
  const sb = createServerClient()

  const { data, error } = await sb
    .from('listings')
    .update({ status: parsed.data.status, updated_at: new Date().toISOString() })
    .eq('slug', slug)
    .eq('owner_id', session.sub)
    .in('status', ['approved', 'rented', 'paused'])
    .select('id')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Listing not found, not yours, or not yet approved' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
