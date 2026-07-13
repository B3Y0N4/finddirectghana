import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET() {
  const sb = createServerClient()

  const [
    { count: totalListings },
    { count: pendingListings },
    { count: approvedListings },
    { count: pendingReviews },
    { count: approvedReviews },
  ] = await Promise.all([
    sb.from('listings').select('*', { count: 'exact', head: true }),
    sb.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    sb.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    sb.from('reviews').select('*',  { count: 'exact', head: true }).eq('status', 'pending'),
    sb.from('reviews').select('*',  { count: 'exact', head: true }).eq('status', 'approved'),
  ])

  return NextResponse.json({
    totalListings:    totalListings    ?? 0,
    pendingListings:  pendingListings  ?? 0,
    approvedListings: approvedListings ?? 0,
    pendingReviews:   pendingReviews   ?? 0,
    approvedReviews:  approvedReviews  ?? 0,
  })
}
