import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getListing } from '@/lib/data'

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Sign in to view contact details' }, { status: 401 })
  }

  const { slug } = await params
  const listing = await getListing(slug)
  if (!listing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ phone: listing.owner.phone })
}
