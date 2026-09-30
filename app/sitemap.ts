import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || SITE.url
  return [{ url: `${base}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 }]
}
