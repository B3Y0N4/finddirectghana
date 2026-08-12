export type PropertyType = 'apartment' | 'house' | 'chamber_and_hall' | 'studio' | 'townhouse'
export type PropertyStatus = 'available' | 'rented' | 'paused'
export type VerificationLevel = 'none' | 'phone' | 'full'

export interface Owner {
  id: string | null
  name: string
  phone: string        // E.164 format for WhatsApp link
  initials: string
  verified_phone: boolean
  verified_card: boolean
  joined_year: number
  response_rate: number
}

// Raw moderation status as stored in the DB — broader than the public-facing
// PropertyStatus, since it includes pre-approval states a landlord needs to
// see but a tenant never should.
export type ListingRawStatus = 'pending' | 'approved' | 'rejected' | 'rented' | 'paused'

export interface OwnerListing {
  id: string
  slug: string
  title: string
  status: ListingRawStatus
  price_ghs: number
  neighborhood: string
  image_url: string | null
  admin_notes: string | null
  verification_level: VerificationLevel
  created_at: string
}

export interface Property {
  slug: string
  title: string
  description: string
  type: PropertyType
  status: PropertyStatus
  neighborhood: string
  city: string
  price_ghs: number
  advance_months: number
  bedrooms: number
  bathrooms: number
  size_sqm: number | null
  furnished: boolean
  features: string[]
  images: string[]
  owner: Owner
  verification_level: VerificationLevel
  views: number
  inquiries: number
  listed_date: string
}
