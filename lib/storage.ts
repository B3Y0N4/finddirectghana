import type { createServerClient } from './supabase-server'

export const PROPERTY_IMAGES_BUCKET = 'property-images'
export const VERIFICATION_DOCS_BUCKET = 'verification-docs'

export async function uploadFile(
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
  if (bucket === PROPERTY_IMAGES_BUCKET) {
    const { data: pub } = sb.storage.from(bucket).getPublicUrl(data.path)
    return pub.publicUrl
  }
  return data.path
}
