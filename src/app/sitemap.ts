import { MetadataRoute } from 'next';
import { ROOMS_DATA } from '@/data/roomsData';
import { NEARBY_ATTRACTIONS } from '@/data/templesData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.pselitehomestays.com';
  // Stable release date prevents Googlebot penalty from artificial freshness on every crawl
  const lastModified = new Date('2026-11-01T00:00:00Z');

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // Programmatic Room landing pages (spokes)
  const roomRoutes: MetadataRoute.Sitemap = ROOMS_DATA.map((room) => ({
    url: `${baseUrl}/rooms/${room.id}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Programmatic Landmark & Proximity landing pages
  const landmarkRoutes: MetadataRoute.Sitemap = NEARBY_ATTRACTIONS.map((attraction) => ({
    url: `${baseUrl}/near/${attraction.id}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  return [...staticRoutes, ...roomRoutes, ...landmarkRoutes];
}
