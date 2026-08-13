import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { adminReportPatchSchema } from '@/lib/validation'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') ?? 'open'
  const sb = createServerClient()

  const { data, error } = await sb
    .from('reports')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function PATCH(req: Request) {
  const parsed = adminReportPatchSchema.safeParse(await req.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
  }
  const { id, status } = parsed.data
  const sb = createServerClient()

  const { error } = await sb.from('reports').update({ status }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
