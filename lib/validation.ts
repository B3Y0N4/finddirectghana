import { z } from 'zod'

export const signupSchema = z.object({
  name:     z.string().trim().min(1, 'Name is required'),
  email:    z.string().trim().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone:    z.string().trim().min(1).optional(),
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
