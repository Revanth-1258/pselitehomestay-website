import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import { NEARBY_ATTRACTIONS } from '@/data/templesData';

const SITE_URL = 'https://www.pselitehomestays.com';

export const metadata: Metadata = {
  title: 'Distances to Tirumala, Alipiri & Landmarks | PS Elite',
  description:
    'Road distances from PS Elite Homestay to Tirupati railway station (1.5 km), bus stand (1.4 km), Alipiri footpath (6 km), Tirumala, Tiruchanur and the airport.',
  alternates: { canonical: `${SITE_URL}/near` },
  openGraph: {
    title: 'Distances to Tirumala, Alipiri & Landmarks | PS Elite',
    url: `${SITE_URL}/near`,
    siteName: 'PS Elite Homestay',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: `${SITE_URL}/images/og-cover.jpg`, width: 1200, height: 630 }],
  },
};

// Closest first: what a pilgrim scanning this page wants to know.
const byDistance = [...NEARBY_ATTRACTIONS].sort((a, b) => parseFloat(a.distanceKm) - parseFloat(b.distanceKm));

export default function NearIndexPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Nearby Landmarks', item: `${SITE_URL}/near` },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Landmarks near PS Elite Homestay, Tirupati',
        itemListElement: byDistance.map((a, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/near/${a.id}`,
          name: a.name,
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="bg-[#111111] text-white pt-28 sm:pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
            <Link href="/" className="hover:text-[#D4AF37] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="text-[#D4AF37] font-semibold">Nearby Landmarks</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-light tracking-tight">
            How Far Is <span className="font-semibold text-gold-gradient">PS Elite Homestay</span> from Tirupati&apos;s
            Landmarks?
          </h1>
          <p className="mt-4 max-w-3xl text-neutral-300 leading-relaxed">
            PS Elite Homestay is on Air Bypass Road, STV Nagar, Tirupati: 1.5 km from the railway station, 1.4 km from
            the APSRTC bus stand and 6 km from the Alipiri footpath to Tirumala. Distances below are by road; travel
            times are typical for a car or auto and are longer at peak hours.
          </p>

          <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[560px] text-sm">
              <caption className="sr-only">Road distance and travel time from PS Elite Homestay</caption>
              <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-neutral-400">
                <tr>
                  <th scope="col" className="px-4 py-3">Landmark</th>
                  <th scope="col" className="px-4 py-3">Road distance</th>
                  <th scope="col" className="px-4 py-3">Travel time</th>
                  <th scope="col" className="px-4 py-3">Guide</th>
                </tr>
              </thead>
              <tbody>
                {byDistance.map((a) => (
                  <tr key={a.id} className="border-t border-white/10">
                    <th scope="row" className="px-4 py-3 text-left font-semibold text-white">
                      {a.name}
                    </th>
                    <td className="px-4 py-3 text-neutral-200">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-[#D4AF37]" /> {a.distanceKm}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-200">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#D4AF37]" /> {a.travelTimeMin}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/near/${a.id}`} className="text-[#D4AF37] font-semibold hover:underline">
                        Stay near {a.name.split(' (')[0]}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-10 text-sm text-neutral-400">
            Ready to book?{' '}
            <Link href="/rooms" className="text-[#D4AF37] hover:underline">
              Compare rooms and tariffs
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
