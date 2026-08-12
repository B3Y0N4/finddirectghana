import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { getListingForEdit } from '@/lib/data'
import EditListingForm from '@/components/EditListingForm'

export const metadata: Metadata = {
  title: 'Edit Listing — Find Direct Ghana',
  robots: { index: false, follow: false },
}

interface Props {
  params: Promise<{ slug: string }>
}

export default async function EditListingPage({ params }: Props) {
  const { slug } = await params
  const session = await getSession()

  if (!session || session.role !== 'landlord') {
    return (
      <div className="pt-nav bg-page-bg min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-xs">
          <p className="font-display font-bold text-ink text-lg mb-2">Edit listing</p>
          <p className="text-muted text-sm mb-5">This page is for landlord accounts.</p>
          <Link href="/" className="text-ghana-green font-semibold text-sm hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    )
  }

  const listing = await getListingForEdit(slug, session.sub)
  if (!listing) notFound()

  return <EditListingForm listing={listing} />
}
