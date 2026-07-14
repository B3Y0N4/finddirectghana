/**
 * Central data access layer.
 * Reads from Supabase when env vars are present, falls back to static seed data.
 */
import type { Property, PropertyType, VerificationLevel } from './types'
import { properties as staticProperties } from './properties'

const hasSupabase =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.SUPABASE_SERVICE_ROLE_KEY

/* ── mapper ──────────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToProperty(row: Record<string, any>): Property {
  const initials = (row.owner_name as string)
    .split(' ')
    .map((w: string) => w[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')

  const verLevel: VerificationLevel =
    row.verification_level === 'pending' ? 'phone'
    : (row.verification_level as VerificationLevel) ?? 'none'

  return {
    slug:           row.slug,
    title:          row.title,
    description:    row.description ?? '',
    type:           row.type as PropertyType,
    status:         row.status === 'approved' ? 'available' : row.status,
    neighborhood:   row.neighborhood,
    city:           row.city ?? 'Accra',
    price_ghs:      Number(row.price_ghs),
    advance_months: row.advance_months ?? 12,
    bedrooms:       row.bedrooms ?? 0,
    bathrooms:      row.bathrooms ?? 0,
    size_sqm:       row.size_sqm ?? null,
    furnished:      row.furnished ?? false,
    features:       row.features ?? [],
    images:         row.image_urls ?? [],
    owner: {
      name:           row.owner_name,
      phone:          row.owner_phone,
      initials,
      verified_phone: row.verified_phone ?? false,
      verified_card:  row.verified_card  ?? false,
      joined_year:    new Date(row.created_at).getFullYear(),
      response_rate:  100,
    },
    verification_level: verLevel,
    views:      row.views     ?? 0,
    inquiries:  row.inquiries ?? 0,
    listed_date: (row.created_at as string).split('T')[0],
  }
}

/* ── public API ──────────────────────────────────────────────── */

/** All approved / available listings. */
export async function getListings(): Promise<Property[]> {
  if (!hasSupabase) return staticProperties

  const { createServerClient } = await import('./supabase-server')
  const sb = createServerClient()

  const { data, error } = await sb
    .from('listings')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[data] getListings:', error.message)
    return staticProperties
  }

  return (data ?? []).map(rowToProperty)
}

/** Single listing by slug. */
export async function getListing(slug: string): Promise<Property | null> {
  if (!hasSupabase) {
    return staticProperties.find(p => p.slug === slug) ?? null
  }

  const { createServerClient } = await import('./supabase-server')
  const sb = createServerClient()

  const { data, error } = await sb
    .from('listings')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'approved')
    .single()

  if (error || !data) return null
  return rowToProperty(data)
}

/** Slugs for generateStaticParams. */
export async function getAllSlugs(): Promise<string[]> {
  if (!hasSupabase) return staticProperties.map(p => p.slug)

  const { createServerClient } = await import('./supabase-server')
  const sb = createServerClient()

  const { data } = await sb
    .from('listings')
    .select('slug')
    .eq('status', 'approved')

  return (data ?? []).map((r: { slug: string }) => r.slug)
}

/** Related listings in the same neighbourhood (excludes current slug). */
export async function getRelated(slug: string, neighborhood: string, limit = 3): Promise<Property[]> {
  const all = await getListings()
  return all
    .filter(p => p.slug !== slug && p.neighborhood === neighborhood && p.status === 'available')
    .slice(0, limit)
}
