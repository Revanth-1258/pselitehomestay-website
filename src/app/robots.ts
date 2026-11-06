import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /admin and /owner-analytics are intentionally NOT disallowed: they carry
      // <meta name="robots" content="noindex"> (see their layout.tsx), and Google can
      // only honour that tag if it is allowed to crawl the page.
      disallow: ['/api/'],
    },
    sitemap: 'https://www.pselitehomestays.com/sitemap.xml',
    host: 'https://www.pselitehomestays.com',
  };
}
