import type { MetadataRoute } from 'next'
import { getListings } from '@/lib/data'
import { posts } from '@/lib/blog'

const BASE = 'https://finddirectgh.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await getListings()

  const propertyUrls: MetadataRoute.Sitemap = listings.map(p => ({
    url: `${BASE}/property/${p.slug}`,
    lastModified: new Date(p.listed_date),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const blogUrls: MetadataRoute.Sitemap = posts.map(p => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [
    { url: BASE,                       lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/listings`,         lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/blog`,             lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/list`,             lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/how-it-works`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/about`,            lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/report`,           lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    ...propertyUrls,
    ...blogUrls,
  ]
}
