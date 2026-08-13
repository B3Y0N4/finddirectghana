import { z } from 'zod'

const GHANA_PHONE_RE = /^0?\d{9}$/

/** Strips formatting and checks for a 9-digit Ghana local number (with or without a leading 0). */
export function isValidGhanaPhone(phone: string): boolean {
  return GHANA_PHONE_RE.test(phone.replace(/\D/g, ''))
}

const phoneSchema = z.string().trim().refine(isValidGhanaPhone, 'Enter a valid Ghana phone number')

export const signupSchema = z.object({
  name:     z.string().trim().min(1, 'Name is required'),
  email:    z.string().trim().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone:    phoneSchema.optional(),
  role:     z.enum(['tenant', 'landlord']),
})

export const loginSchema = z.object({
  email:    z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const reviewSchema = z.object({
  landlordId:   z.string().uuid().nullable().optional(),
  landlordSlug: z.string().trim().min(1, 'landlordSlug is required'),
  reviewerType: z.enum(['tenant', 'landlord']),
  name:         z.string().trim().min(1, 'Name is required'),
  rating:       z.number().int().min(1).max(5),
  categories:   z.array(z.string()).optional(),
  title:        z.string().trim().min(1, 'Title is required'),
  body:         z.string().trim().min(1, 'Review body is required'),
})

export const adminPatchSchema = z.object({
  id:          z.string().uuid('id must be a valid UUID'),
  status:      z.enum(['pending', 'approved', 'rejected']),
  admin_notes: z.string().optional(),
})

export const adminReviewPatchSchema = z.object({
  id:       z.string().uuid('id must be a valid UUID'),
  status:   z.enum(['pending', 'approved', 'rejected']).optional(),
  verified: z.boolean().optional(),
}).refine(data => data.status !== undefined || data.verified !== undefined, {
  message: 'Nothing to update',
})

export const adminReportPatchSchema = z.object({
  id:     z.string().uuid('id must be a valid UUID'),
  status: z.enum(['open', 'reviewed', 'resolved']),
})

export const landlordListingPatchSchema = z.object({
  status: z.enum(['approved', 'rented', 'paused']),
})

export const listingEditSchema = z.object({
  title:           z.string().trim().min(1, 'Title is required'),
  type:            z.enum(['apartment', 'house', 'chamber_and_hall', 'studio', 'townhouse', 'hotel_hostel']),
  bedrooms:        z.coerce.number().int().min(0),
  bathrooms:       z.coerce.number().int().min(1),
  furnished:       z.boolean(),
  features:        z.array(z.string()).optional(),
  neighborhood:    z.string().trim().min(1, 'Neighborhood is required'),
  address:         z.string().trim().optional(),
  price:           z.coerce.number().positive('Price must be greater than 0'),
  advanceMonths:   z.coerce.number().int().min(1),
  priceNegotiable: z.boolean(),
  description:     z.string().trim().optional(),
  videoUrl:        z.string().trim().optional(),
  name:            z.string().trim().min(1, 'Name is required'),
  phone:           phoneSchema,
  keepImages:      z.array(z.string()).optional(),
})

export const reportSchema = z.object({
  url:         z.string().trim().optional(),
  issueType:   z.enum(['fake', 'fraud', 'wrong_price', 'unresponsive', 'wrong_photos', 'already_rented', 'other']),
  description: z.string().trim().min(10, 'Please provide a bit more detail'),
  phone:       phoneSchema.optional(),
})
