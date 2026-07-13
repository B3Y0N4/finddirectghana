import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Find Direct Ghana',
    short_name: 'FindDirect',
    description: 'Rent directly from the owner in Ghana. No agents. No viewing fees. No commission.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#004D2C',
    theme_color: '#006B3F',
    categories: ['lifestyle', 'business'],
    icons: [
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
      { src: '/apple-icon', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/apple-icon', sizes: '512x512', type: 'image/png' },
    ],
    screenshots: [],
  }
}
