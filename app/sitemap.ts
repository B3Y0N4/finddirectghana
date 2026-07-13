import type { MetadataRoute } from 'next'
import { properties } from '@/lib/properties'

const BASE = 'https://finddirectghana.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const propertyUrls: MetadataRoute.Sitemap = properties.map(p => ({
    url: `${BASE}/property/${p.slug}`,
    lastModified: new Date(p.listed_date),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    { url: BASE,                       lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/listings`,         lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/list`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/how-it-works`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/about`,            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/report`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    ...propertyUrls,
  ]
}
