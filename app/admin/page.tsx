'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock, Star, CheckCircle, FileText } from 'lucide-react'

interface Stats {
  totalListings:    number
  pendingListings:  number
  approvedListings: number
  pendingReviews:   number
  approvedReviews:  number
}

function StatCard({
  label, value, sub, valueClass, href,
}: {
  label: string; value: number | null; sub?: string; valueClass?: string; href?: string
}) {
  const inner = (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${valueClass ?? 'text-gray-900'}`}>
        {value ?? '—'}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
  return href ? <Link href={href}>{inner}</Link> : inner
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats).catch(console.error)
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Pending Listings"
          value={stats?.pendingListings ?? null}
          sub="Awaiting review"
          valueClass="text-amber-600"
          href="/admin/listings?status=pending"
        />
        <StatCard
          label="Approved Listings"
          value={stats?.approvedListings ?? null}
          sub="Live on site"
          valueClass="text-ghana-green"
          href="/admin/listings?status=approved"
        />
        <StatCard
          label="Total Listings"
          value={stats?.totalListings ?? null}
          href="/admin/listings"
        />
        <StatCard
          label="Pending Reviews"
          value={stats?.pendingReviews ?? null}
          sub="Needs moderation"
          valueClass="text-amber-600"
          href="/admin/reviews?status=pending"
        />
        <StatCard
          label="Approved Reviews"
          value={stats?.approvedReviews ?? null}
          sub="Visible publicly"
          valueClass="text-ghana-green"
          href="/admin/reviews?status=approved"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/admin/listings?status=pending"
          className="flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-xl p-5 hover:bg-amber-100 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Review Pending Listings</p>
            <p className="text-sm text-gray-500">
              {stats?.pendingListings ?? '...'} listing{stats?.pendingListings !== 1 ? 's' : ''} awaiting approval
            </p>
          </div>
        </Link>

        <Link
          href="/admin/reviews?status=pending"
          className="flex items-center gap-4 bg-blue-50 border border-blue-200 rounded-xl p-5 hover:bg-blue-100 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Star className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Moderate Reviews</p>
            <p className="text-sm text-gray-500">
              {stats?.pendingReviews ?? '...'} review{stats?.pendingReviews !== 1 ? 's' : ''} waiting
            </p>
          </div>
        </Link>

        <Link
          href="/admin/listings?status=approved"
          className="flex items-center gap-4 bg-green-50 border border-green-200 rounded-xl p-5 hover:bg-green-100 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Live Listings</p>
            <p className="text-sm text-gray-500">
              {stats?.approvedListings ?? '...'} propert{stats?.approvedListings !== 1 ? 'ies' : 'y'} live
            </p>
          </div>
        </Link>

        <Link
          href="/listings"
          target="_blank"
          className="flex items-center gap-4 bg-gray-50 border border-gray-200 rounded-xl p-5 hover:bg-gray-100 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">View Public Site</p>
            <p className="text-sm text-gray-500">finddrectgh.com</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
