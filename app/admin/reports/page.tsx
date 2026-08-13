'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, Eye, Flag } from 'lucide-react'

interface Report {
  id:             string
  listing_url:    string | null
  issue_type:     string
  description:    string
  reporter_phone: string | null
  status:         string
  created_at:     string
}

const ISSUE_LABEL: Record<string, string> = {
  fake:           'Fake listing',
  fraud:          'Fraud',
  wrong_price:    'Wrong price',
  unresponsive:   'Unresponsive owner',
  wrong_photos:   'Wrong photos',
  already_rented: 'Already rented',
  other:          'Other',
}

function ReportRow({ report: r, onAction }: { report: Report; onAction: () => void }) {
  const [busy, setBusy] = useState(false)

  async function act(status: 'reviewed' | 'resolved') {
    setBusy(true)
    await fetch('/api/admin/reports', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ id: r.id, status }),
    })
    setBusy(false)
    onAction()
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">
          {ISSUE_LABEL[r.issue_type] ?? r.issue_type}
        </span>
        {r.reporter_phone && (
          <span className="text-xs text-gray-500">from {r.reporter_phone}</span>
        )}
        <span className="text-xs text-gray-300 ml-auto">
          {new Date(r.created_at).toLocaleDateString('en-GH', { day: 'numeric', month: 'short' })}
        </span>
      </div>

      {r.listing_url && (
        <a
          href={r.listing_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xs text-ghana-green hover:underline mb-2 break-all"
        >
          {r.listing_url}
        </a>
      )}

      <p className="text-sm text-gray-700 leading-relaxed">{r.description}</p>

      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
        {r.status === 'open' && (
          <button
            onClick={() => act('reviewed')}
            disabled={busy}
            className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:border-ghana-green hover:text-ghana-green transition-colors disabled:opacity-40"
          >
            <Eye className="w-3.5 h-3.5" /> Mark Reviewed
          </button>
        )}
        {r.status !== 'resolved' && (
          <button
            onClick={() => act('resolved')}
            disabled={busy}
            className="flex items-center gap-1.5 bg-ghana-green text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-ghana-green-dark transition-colors disabled:opacity-40"
          >
            <CheckCircle className="w-3.5 h-3.5" /> Resolve
          </button>
        )}
      </div>
    </div>
  )
}

function AdminReportsInner() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const status       = searchParams.get('status') ?? 'open'
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch(`/api/admin/reports?status=${status}`)
      const data = await res.json()
      setReports(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => { load() }, [load])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Flag className="w-5 h-5" /> Reports
      </h1>

      <div className="flex gap-2 mb-6">
        {(['open', 'reviewed', 'resolved'] as const).map(t => (
          <button
            key={t}
            onClick={() => router.push(`/admin/reports?status=${t}`)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
              status === t
                ? 'bg-ghana-green text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-ghana-green hover:text-ghana-green'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading...</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No {status} reports</div>
      ) : (
        <div className="space-y-3">
          {reports.map(r => (
            <ReportRow key={r.id} report={r} onAction={load} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminReports() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-400 text-sm">Loading...</div>}>
      <AdminReportsInner />
    </Suspense>
  )
}
