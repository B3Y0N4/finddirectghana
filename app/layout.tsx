import type { Metadata, Viewport } from 'next'
import { Poppins, Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import BottomNav from '@/components/BottomNav'
import Footer from '@/components/Footer'

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
    'Browse verified owner-direct property listings in Accra, Ghana. No agents. No viewing fees. No commission. Contact landlords directly on WhatsApp.',
  keywords: 'Ghana property, Accra rentals, rent direct, no agent Ghana, properties for rent Accra, direct landlord Ghana',
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
    url: 'https://finddirectgh.com',
  },
  metadataBase: new URL('https://finddirectgh.com'),
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
      url: 'https://finddirectgh.com',
      logo: 'https://finddirectgh.com/icon',
      description: 'Owner-direct property listings in Accra, Ghana — no agents, no viewing fees, no commission.',
      areaServed: { '@type': 'City', name: 'Accra' },
    },
    {
      '@type': 'WebSite',
      name: 'Find Direct Ghana',
      url: 'https://finddirectgh.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://finddirectgh.com/listings?q={search_term_string}',
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
