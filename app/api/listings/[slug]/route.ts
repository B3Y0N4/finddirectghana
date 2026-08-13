import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { getSession } from '@/lib/auth'
import { uploadFile } from '@/lib/storage'
import { landlordListingPatchSchema, listingEditSchema } from '@/lib/validation'

const EDITABLE_STATUSES = ['approved', 'rented', 'paused'] as const
// PUT (full edit) additionally allows 'rejected', so a landlord can fix the
// issue and resubmit — status flips back to 'pending' on save in that case.
const SELF_SERVICE_STATUSES = ['approved', 'rented', 'paused', 'rejected'] as const

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
    .in('status', EDITABLE_STATUSES)
    .select('id')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'Listing not found, not yours, or not yet approved' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}

// Landlord self-service: full edit of a listing's details (everything
// except the identity-verification docs from the original submission).
// Allows 'approved' | 'rented' | 'paused' | 'rejected' as the starting
// point — a pending listing has nothing to fix yet (no review happened),
// but a rejected one can be edited and resubmitted (see status logic below).
export async function PUT(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Sign in to continue' }, { status: 401 })
  }

  const { slug } = await params
  const sb = createServerClient()

  // Ownership + status check up front, before any storage upload work.
  const { data: existing } = await sb
    .from('listings')
    .select('id, status')
    .eq('slug', slug)
    .eq('owner_id', session.sub)
    .in('status', SELF_SERVICE_STATUSES)
    .single()

  if (!existing) {
    return NextResponse.json({ error: 'Listing not found, not yours, or not yet reviewed' }, { status: 404 })
  }

  // Fixing a rejected listing sends it back into the moderation queue.
  // Any other status (approved/rented/paused) is left exactly as-is.
  const nextStatus = existing.status === 'rejected' ? 'pending' : existing.status

  const fd = await req.formData()

  const parsed = listingEditSchema.safeParse({
    title:           fd.get('title'),
    type:            fd.get('type'),
    bedrooms:        fd.get('bedrooms'),
    bathrooms:       fd.get('bathrooms'),
    furnished:       fd.get('furnished') === 'true',
    features:        JSON.parse((fd.get('features') as string) || '[]'),
    neighborhood:    fd.get('neighborhood'),
    address:         fd.get('address') || undefined,
    price:           fd.get('price'),
    advanceMonths:   fd.get('advanceMonths'),
    priceNegotiable: fd.get('priceNegotiable') === 'true',
    description:     fd.get('description') || undefined,
    videoUrl:        fd.get('videoUrl') || undefined,
    name:            fd.get('name'),
    phone:           fd.get('phone'),
    keepImages:      JSON.parse((fd.get('keepImages') as string) || '[]'),
  })

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }
  const body = parsed.data

  // Upload any newly-added photos, same convention as POST /api/listings.
  const ts = Date.now()
  const newPhotoUrls: string[] = []
  let i = 0
  while (true) {
    const file = fd.get(`photo_${i}`) as File | null
    if (!file || file.size === 0) break
    const ext = file.name.split('.').pop() ?? 'jpg'
    const url = await uploadFile(sb, 'property-images', file, `listings/${ts}_edit_${i}.${ext}`)
    if (url) newPhotoUrls.push(url)
    i++
  }

  const imageUrls = [...(body.keepImages ?? []), ...newPhotoUrls]

  const { data, error } = await sb
    .from('listings')
    .update({
      title:             body.title,
      type:              body.type,
      bedrooms:          body.bedrooms,
      bathrooms:         body.bathrooms,
      furnished:         body.furnished,
      features:          body.features ?? [],
      neighborhood:      body.neighborhood,
      address:           body.address ?? null,
      price_ghs:         body.price,
      advance_months:    body.advanceMonths,
      price_negotiable:  body.priceNegotiable,
      description:       body.description ?? null,
      video_url:         body.videoUrl ?? null,
      owner_name:        body.name,
      owner_phone:       body.phone,
      image_urls:        imageUrls,
      status:            nextStatus,
      updated_at:        new Date().toISOString(),
    })
    .eq('slug', slug)
    .eq('owner_id', session.sub)
    .in('status', SELF_SERVICE_STATUSES)
    .select('slug, status')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, slug: data.slug, status: data.status, image_urls: imageUrls })
}
