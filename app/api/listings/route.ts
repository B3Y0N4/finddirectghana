import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { createServerClient } from '@/lib/supabase-server'

async function getOwnerId(): Promise<string | null> {
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

function toSlug(title: string): string {
  return (
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') +
    '-' +
    Date.now()
  )
}

async function uploadFile(
  sb: ReturnType<typeof createServerClient>,
  bucket: string,
  file: File,
  path: string,
): Promise<string | null> {
  const buf = await file.arrayBuffer()
  const { data, error } = await sb.storage.from(bucket).upload(path, buf, {
    contentType: file.type || 'image/jpeg',
    upsert: false,
  })
  if (error) { console.error('Upload error:', error.message); return null }
  if (bucket === 'property-images') {
    const { data: pub } = sb.storage.from(bucket).getPublicUrl(data.path)
    return pub.publicUrl
  }
  return data.path
}

export async function POST(req: Request) {
  try {
    const fd      = await req.formData()
    const sb      = createServerClient()
    const ts      = Date.now()
    const ownerId = await getOwnerId()

    // Upload property photos
    const photoUrls: string[] = []
    let i = 0
    while (true) {
      const file = fd.get(`photo_${i}`) as File | null
      if (!file || file.size === 0) break
      const ext = file.name.split('.').pop() ?? 'jpg'
      const url = await uploadFile(sb, 'property-images', file, `listings/${ts}_${i}.${ext}`)
      if (url) photoUrls.push(url)
      i++
    }

    // Upload Ghana Card verification docs (private bucket)
    const cardFrontFile = fd.get('cardFront') as File | null
    const cardBackFile  = fd.get('cardBack')  as File | null
    const selfieFile    = fd.get('selfie')    as File | null

    const [cardFrontPath, cardBackPath, selfiePath] = await Promise.all([
      cardFrontFile && cardFrontFile.size > 0
        ? uploadFile(sb, 'verification-docs', cardFrontFile, `${ts}_front.${cardFrontFile.name.split('.').pop() ?? 'jpg'}`)
        : Promise.resolve(null),
      cardBackFile && cardBackFile.size > 0
        ? uploadFile(sb, 'verification-docs', cardBackFile, `${ts}_back.${cardBackFile.name.split('.').pop() ?? 'jpg'}`)
        : Promise.resolve(null),
      selfieFile && selfieFile.size > 0
        ? uploadFile(sb, 'verification-docs', selfieFile, `${ts}_selfie.${selfieFile.name.split('.').pop() ?? 'jpg'}`)
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
      city:                 'Accra',
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
