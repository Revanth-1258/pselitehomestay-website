import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Users, BedDouble, Maximize2 } from 'lucide-react';
import { ROOMS_DATA } from '@/data/roomsData';

const SITE_URL = 'https://www.pselitehomestays.com';
const fromPrice = Math.min(...ROOMS_DATA.map((r) => r.pricePerNight)).toLocaleString('en-IN');

export const metadata: Metadata = {
  title: 'Rooms & Tariffs in Tirupati | PS Elite Homestay',
  description: `Compare budget rooms, AC rooms, 2BHK family service apartments and a penthouse suite in Tirupati, from ₹${fromPrice}/night. 1.5 km from the railway station.`,
  alternates: { canonical: `${SITE_URL}/rooms` },
  openGraph: {
    title: 'Rooms & Tariffs in Tirupati | PS Elite Homestay',
    url: `${SITE_URL}/rooms`,
    siteName: 'PS Elite Homestay',
    locale: 'en_IN',
    type: 'website',
    images: [{ url: `${SITE_URL}/images/og-cover.jpg`, width: 1200, height: 630 }],
  },
};

export default function RoomsIndexPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Rooms & Tariffs', item: `${SITE_URL}/rooms` },
        ],
      },
      {
        '@type': 'ItemList',
        name: 'Rooms at PS Elite Homestay, Tirupati',
        itemListElement: ROOMS_DATA.map((room, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE_URL}/rooms/${room.id}`,
          name: room.name,
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
            <span className="text-[#D4AF37] font-semibold">Rooms &amp; Tariffs</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-light tracking-tight">
            Rooms &amp; Tariffs at <span className="font-semibold text-gold-gradient">PS Elite Homestay, Tirupati</span>
          </h1>
          <p className="mt-4 max-w-3xl text-neutral-300 leading-relaxed">
            Five room types on Air Bypass Road, STV Nagar: from a budget room for solo pilgrims and couples to 1BHK
            and 2BHK service apartments with a kitchen for families and groups. Every stay has lift access, parking
            and a 24/7 front desk, 1.5 km from Tirupati railway station. Rates below are for booking direct.
          </p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ROOMS_DATA.map((room) => (
              <Link
                key={room.id}
                href={`/rooms/${room.id}`}
                className="group rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-[#D4AF37]/60 transition-all flex flex-col"
              >
                <div className="relative h-52 overflow-hidden bg-neutral-900">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/75 px-2.5 py-1 rounded-lg text-sm font-bold text-[#D4AF37]">
                    ₹{room.pricePerNight.toLocaleString('en-IN')}{' '}
                    <span className="text-[11px] text-neutral-300 font-normal">/ night</span>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h2 className="text-lg font-bold group-hover:text-[#D4AF37] transition-colors">{room.name}</h2>
                  <p className="text-sm text-neutral-400 mt-1">{room.tagline}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-neutral-300">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#D4AF37]" /> Up to {room.guests} guests
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BedDouble className="w-4 h-4 text-[#D4AF37]" /> {room.bedrooms} bedroom
                      {room.bedrooms > 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Maximize2 className="w-4 h-4 text-[#D4AF37]" /> {room.areaSqFt} sq.ft
                    </span>
                  </div>
                  <span className="mt-auto pt-4 text-sm font-semibold text-[#D4AF37]">
                    View details &amp; photos &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-10 text-sm text-neutral-400">
            Planning around a temple visit? See{' '}
            <Link href="/near" className="text-[#D4AF37] hover:underline">
              distances to Tirumala, Alipiri and other landmarks
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
