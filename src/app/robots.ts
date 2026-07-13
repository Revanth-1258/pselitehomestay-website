import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/owner-analytics/'],
    },
    sitemap: 'https://pselitehomestays.com/sitemap.xml',
  };
}
