import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { getSession } from '@/lib/auth'
import { uploadFile, PROPERTY_IMAGES_BUCKET, VERIFICATION_DOCS_BUCKET } from '@/lib/storage'
import { cityForNeighborhood } from '@/lib/properties'
import { isValidGhanaPhone } from '@/lib/validation'
import { rateLimit, getClientIp } from '@/lib/rateLimit'

function toSlug(title: string): string {
  return (
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') +
    '-' +
    Date.now()
  )
}

export async function POST(req: Request) {
  try {
    if (!rateLimit(`listings-post:${getClientIp(req)}`, 10, 60 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many submissions — try again later' }, { status: 429 })
    }

    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Sign in to continue' }, { status: 401 })
    }
    if (session.role !== 'landlord') {
      return NextResponse.json({ error: 'Only landlord accounts can list a property' }, { status: 403 })
    }

    const fd = await req.formData()

    const phone = (fd.get('phone') as string) || ''
    if (!isValidGhanaPhone(phone)) {
      return NextResponse.json({ error: 'Enter a valid Ghana phone number' }, { status: 400 })
    }

    const sb      = createServerClient()
    const ts      = Date.now()
    const ownerId = session.sub

    // Upload property photos
    const photoUrls: string[] = []
    let i = 0
    while (true) {
      const file = fd.get(`photo_${i}`) as File | null
      if (!file || file.size === 0) break
      const ext = file.name.split('.').pop() ?? 'jpg'
      const url = await uploadFile(sb, PROPERTY_IMAGES_BUCKET, file, `listings/${ts}_${i}.${ext}`)
      if (url) photoUrls.push(url)
      i++
    }

    // Upload Ghana Card verification docs (private bucket)
    const cardFrontFile = fd.get('cardFront') as File | null
    const cardBackFile  = fd.get('cardBack')  as File | null
    const selfieFile    = fd.get('selfie')    as File | null

    const [cardFrontPath, cardBackPath, selfiePath] = await Promise.all([
      cardFrontFile && cardFrontFile.size > 0
        ? uploadFile(sb, VERIFICATION_DOCS_BUCKET, cardFrontFile, `${ts}_front.${cardFrontFile.name.split('.').pop() ?? 'jpg'}`)
        : Promise.resolve(null),
      cardBackFile && cardBackFile.size > 0
        ? uploadFile(sb, VERIFICATION_DOCS_BUCKET, cardBackFile, `${ts}_back.${cardBackFile.name.split('.').pop() ?? 'jpg'}`)
        : Promise.resolve(null),
      selfieFile && selfieFile.size > 0
        ? uploadFile(sb, VERIFICATION_DOCS_BUCKET, selfieFile, `${ts}_selfie.${selfieFile.name.split('.').pop() ?? 'jpg'}`)
        : Promise.resolve(null),
    ])

    const title = (fd.get('title') as string) || ''

    const { data, error } = await sb.from('listings').insert({
      slug:                 toSlug(title),
      title,
      type:                 fd.get('type'),
      bedrooms:             Number(fd.get('bedrooms'))     || null,
      bathrooms:            Number(fd.get('bathrooms'))    || null,
      furnished:            fd.get('furnished')  === 'true',
      features:             JSON.parse((fd.get('features') as string) || '[]'),
      neighborhood:         fd.get('neighborhood'),
      address:              fd.get('address')    || null,
      city:                 cityForNeighborhood(fd.get('neighborhood') as string),
      price_ghs:            Number(fd.get('price')),
      advance_months:       Number(fd.get('advanceMonths')) || 12,
      price_negotiable:     fd.get('priceNegotiable') === 'true',
      description:          fd.get('description') || null,
      video_url:            fd.get('videoUrl')    || null,
      owner_id:             ownerId ?? null,
      owner_name:           fd.get('name'),
      owner_phone:          fd.get('phone'),
      image_urls:           photoUrls,
      ghana_card_front_url: cardFrontPath ?? null,
      ghana_card_back_url:  cardBackPath  ?? null,
      selfie_url:           selfiePath    ?? null,
      verification_level:   cardFrontPath ? 'pending' : 'none',
      status:               'pending',
    }).select('id, slug').single()

    if (error) {
      console.error('Insert error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, id: data.id, slug: data.slug })
  } catch (err) {
    console.error('Listing submit error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
