import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="pt-nav min-h-screen flex items-center justify-center bg-page-bg px-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 rounded-full bg-ghana-green-50 border border-ghana-green-100 flex items-center justify-center mx-auto mb-6">
          <Search className="w-9 h-9 text-ghana-green" />
        </div>
        <h1 className="font-display font-bold text-ink text-2xl mb-2">Page not found</h1>
        <p className="text-muted mb-8">The page you&apos;re looking for doesn&apos;t exist or this listing may have been removed.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/listings" className="flex items-center gap-2 bg-ghana-green text-white font-semibold text-sm px-6 py-3 rounded-btn hover:bg-ghana-green-dark transition-colors">
            <Search className="w-4 h-4" />
            Browse Listings
          </Link>
          <Link href="/" className="flex items-center gap-2 border border-border-col text-ink font-semibold text-sm px-6 py-3 rounded-btn hover:bg-white transition-colors">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
