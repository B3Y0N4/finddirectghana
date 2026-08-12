import type { createServerClient } from './supabase-server'

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
  if (bucket === 'property-images') {
    const { data: pub } = sb.storage.from(bucket).getPublicUrl(data.path)
    return pub.publicUrl
  }
  return data.path
}
