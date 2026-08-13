import type { Metadata, Viewport } from 'next'
import { Poppins, Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import BottomNav from '@/components/BottomNav'
import Footer from '@/components/Footer'
import { SITE_URL } from '@/lib/site'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#006B3F',
}

export const metadata: Metadata = {
  title: {
    default: 'Find Direct Ghana — Rent Directly from the Owner',
    template: '%s | Find Direct Ghana',
  },
  description:
    'Browse verified owner-direct property listings across Greater Accra — Accra, Tema, and Kasoa. No agents. No viewing fees. No commission. Contact landlords directly on WhatsApp.',
  keywords: 'Ghana property, Accra rentals, Tema rentals, Kasoa rentals, rent direct, no agent Ghana, properties for rent Accra, direct landlord Ghana',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Find Direct Ghana',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GH',
    siteName: 'Find Direct Ghana',
    url: SITE_URL,
  },
  metadataBase: new URL(SITE_URL),
  twitter: {
    card: 'summary_large_image',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Find Direct Ghana',
      url: SITE_URL,
      logo: `${SITE_URL}/icon`,
      description: 'Owner-direct property listings across Greater Accra, Ghana — no agents, no viewing fees, no commission.',
      areaServed: [
        { '@type': 'City', name: 'Accra' },
        { '@type': 'City', name: 'Tema' },
        { '@type': 'City', name: 'Kasoa' },
      ],
    },
    {
      '@type': 'WebSite',
      name: 'Find Direct Ghana',
      url: SITE_URL,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/listings?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-page-bg text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Nav />
        <main className="pb-[calc(58px+env(safe-area-inset-bottom))] md:pb-0">
          {children}
        </main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  )
}
