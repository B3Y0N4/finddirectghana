import type { Metadata } from 'next'
import { Poppins, Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
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

export const metadata: Metadata = {
  title: {
    default: 'Find Direct Ghana — Rent Directly from the Owner',
    template: '%s | Find Direct Ghana',
  },
  description:
    'Browse verified owner-direct property listings in Accra, Ghana. No agents. No viewing fees. No commission. Contact landlords directly on WhatsApp.',
  keywords: 'Ghana property, Accra rentals, rent direct, no agent Ghana, properties for rent Accra, direct landlord Ghana',
  openGraph: {
    type: 'website',
    locale: 'en_GH',
    siteName: 'Find Direct Ghana',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-page-bg text-ink">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
