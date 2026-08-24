import type { Metadata } from 'next'
import { SITE_URL } from '@/lib/site'

// /list/page.tsx is a client component (interactive multi-step form), so it
// can't export its own metadata — Next's metadata API only works in Server
// Components. This layout carries it instead.
export const metadata: Metadata = {
  title: 'List Your Property — Free, Direct to Tenants | Find Direct Ghana',
  description:
    'List your rental property directly to verified tenants across Greater Accra. No agent commission, no listing fees. Get contacted on WhatsApp within days.',
  alternates: { canonical: `${SITE_URL}/list` },
}

export default function ListLayout({ children }: { children: React.ReactNode }) {
  return children
}
