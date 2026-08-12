export type ReviewerType = 'tenant' | 'landlord'
export type ReviewCategory = 'deposit' | 'repairs' | 'communication' | 'construction' | 'general'

export interface Review {
  id:           string
  landlordSlug: string
  reviewerType: ReviewerType
  reviewerName: string
  reviewerInitials: string
  date:         string
  rating:       1 | 2 | 3 | 4 | 5
  categories:   ReviewCategory[]
  title:        string
  body:         string
  verified:     boolean
}

export const categoryLabels: Record<ReviewCategory, string> = {
  deposit:       'Deposit Return',
  repairs:       'Repair Response',
  communication: 'Communication',
  construction:  'No Disruption',
  general:       'General',
}

const hasSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToReview(row: Record<string, any>): Review {
  return {
    id:               row.id,
    landlordSlug:     row.landlord_slug,
    reviewerType:     row.reviewer_type,
    reviewerName:     row.reviewer_name,
    reviewerInitials: row.reviewer_initials ?? '',
    date:             (row.created_at as string).split('T')[0],
    rating:           row.rating,
    categories:       row.categories ?? [],
    title:            row.title,
    body:             row.body,
    verified:         row.verified ?? false,
  }
}

/* Offline/dev fallback data — used only when Supabase env vars are absent */
const sampleReviews: Review[] = [
  {
    id: 'r1',
    landlordSlug: 'landlord-kwame-asante',
    reviewerType: 'tenant',
    reviewerName: 'Efua M.',
    reviewerInitials: 'EM',
    date: '2026-05-14',
    rating: 5,
    categories: ['deposit', 'repairs', 'communication'],
    title: 'Returned full deposit within one week. One of the honest ones.',
    body: 'I rented from Mr. Asante for 14 months. When I gave notice he came to inspect the property with me, we agreed on the condition, and my full GHS 1,800 deposit was back in my MoMo within 7 days. He also fixed a leaking tap within 3 days of my reporting it. This is how it should work.',
    verified: true,
  },
  {
    id: 'r2',
    landlordSlug: 'landlord-kwame-asante',
    reviewerType: 'tenant',
    reviewerName: 'Kofi A.',
    reviewerInitials: 'KA',
    date: '2026-03-20',
    rating: 4,
    categories: ['communication', 'general'],
    title: 'Good landlord, responsive. Advance rent negotiable if you ask.',
    body: 'He was asking for 12 months advance but when I explained my situation he accepted 6 months. Communication was good throughout — always replied within a day. The compound is well kept. Only issue was water supply which went off for 4 days once but was restored.',
    verified: true,
  },
  {
    id: 'r3',
    landlordSlug: 'landlord-maame-owusu',
    reviewerType: 'tenant',
    reviewerName: 'Ama T.',
    reviewerInitials: 'AT',
    date: '2026-04-02',
    rating: 2,
    categories: ['deposit', 'repairs'],
    title: 'Kept GHS 2,500 deposit. Said we broke things we never touched.',
    body: 'Lived there 2 years without a single issue. Left the property cleaner than I found it. She claimed we cracked the bathroom tiles and damaged the ceiling — both were like that when we moved in. We had no photos from move-in so could not prove it. She kept the full deposit. I am sharing this so others take photos before they sign.',
    verified: true,
  },
  {
    id: 'r4',
    landlordSlug: 'landlord-maame-owusu',
    reviewerType: 'tenant',
    reviewerName: 'Kweku B.',
    reviewerInitials: 'KB',
    date: '2026-01-15',
    rating: 1,
    categories: ['repairs', 'construction', 'deposit'],
    title: 'Construction started above us 4 months into the tenancy. No compensation, no notice.',
    body: 'We were not told the landlord was planning to add another floor. Work started in February without any warning. Drilling from 7am, dust everywhere, workers in the compound all day. We asked about compensation or early exit — she said the lease was the lease. Then kept the deposit when we left, claiming "cleaning fees." Avoid.',
    verified: true,
  },
]

export async function getReviewsForLandlord(landlordId: string | null, landlordSlug: string): Promise<Review[]> {
  if (!hasSupabase) return sampleReviews.filter(r => r.landlordSlug === landlordSlug)

  const { createServerClient } = await import('./supabase-server')
  const sb = createServerClient()

  let query = sb.from('reviews').select('*').eq('status', 'approved').order('created_at', { ascending: false })
  query = landlordId ? query.eq('landlord_id', landlordId) : query.eq('landlord_slug', landlordSlug)

  const { data, error } = await query
  if (error) {
    console.error('[reviews] getReviewsForLandlord:', error.message)
    return []
  }
  return (data ?? []).map(rowToReview)
}

export async function getLandlordRating(landlordId: string | null, landlordSlug: string): Promise<{ average: number; count: number }> {
  const rs = await getReviewsForLandlord(landlordId, landlordSlug)
  if (!rs.length) return { average: 0, count: 0 }
  const average = rs.reduce((sum, r) => sum + r.rating, 0) / rs.length
  return { average: Math.round(average * 10) / 10, count: rs.length }
}
