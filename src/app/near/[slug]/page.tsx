import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  MapPin,
  Clock,
  Navigation,
  Compass,
  ArrowLeft,
  CalendarCheck,
  MessageCircle,
  Phone,
  CheckCircle2,
  Car,
  Building,
  ShieldCheck,
} from 'lucide-react';
import { NEARBY_ATTRACTIONS, RAIL_STATIONS } from '@/data/templesData';
import { ROOMS_DATA } from '@/data/roomsData';

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return NEARBY_ATTRACTIONS.map((attraction) => ({
    slug: attraction.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const attraction = NEARBY_ATTRACTIONS.find((a) => a.id === slug);

  if (!attraction) {
    return {
      title: 'Location Not Found | PS Elite Homestay Tirupati',
    };
  }

  const title =
    attraction.seoTitle ?? `Homestay near ${attraction.name} (${attraction.distanceKm}) | PS Elite Homestay`;
  const description =
    attraction.seoDescription ??
    `Looking for stays near ${attraction.name}? PS Elite Homestay is just ${attraction.distanceKm} (${attraction.travelTimeMin}) on Air Bypass Road, Tirupati. AC rooms, elevator access, parking & 24/7 desk.`;
  const canonicalUrl = `https://www.pselitehomestays.com/near/${attraction.id}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'PS Elite Homestay',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: 'https://www.pselitehomestays.com/images/og-cover.jpg',
          width: 1200,
          height: 630,
          alt: `PS Elite Homestay near ${attraction.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://www.pselitehomestays.com/images/og-cover.jpg'],
    },
  };
}

export default async function NearbyAttractionPage({ params }: Props) {
  const { slug } = await params;
  const attraction = NEARBY_ATTRACTIONS.find((a) => a.id === slug);

  if (!attraction) {
    notFound();
  }

  const otherAttractions = NEARBY_ATTRACTIONS.filter((a) => a.id !== attraction.id);

  const whatsappMessage = encodeURIComponent(
    `Hello PS Elite Homestay, I am planning to visit ${attraction.name} and would like to reserve a room near this landmark.`
  );
  const whatsappUrl = `https://wa.me/919392739715?text=${whatsappMessage}`;

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.pselitehomestays.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Nearby Landmarks',
            item: 'https://www.pselitehomestays.com/near',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `Near ${attraction.name}`,
            item: `https://www.pselitehomestays.com/near/${attraction.id}`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `How far is PS Elite Homestay from ${attraction.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `PS Elite Homestay is situated just ${attraction.distanceKm} from ${attraction.name}, taking approximately ${attraction.travelTimeMin} via car or auto.`,
            },
          },
          {
            '@type': 'Question',
            name: `What is the best time to visit ${attraction.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The recommended timing for visiting ${attraction.name} is ${attraction.bestTime}. Our 24/7 reception desk can arrange early morning taxis and auto transfers.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Does PS Elite Homestay provide parking and elevator access for visiting pilgrims?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! PS Elite Homestay provides elevator access to all guest floors and secure parking for private cars, making it the ideal base for families with senior citizens.',
            },
          },
          ...(attraction.localTips ?? []).map((tip) => ({
            '@type': 'Question',
            name: tip.q,
            acceptedAnswer: { '@type': 'Answer', text: tip.a },
          })),
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />

      <div className="bg-[#111111] text-white pt-28 sm:pt-32 pb-24">
        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <nav className="flex items-center gap-2 text-xs text-neutral-400">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <Link href="/near" className="hover:text-[#D4AF37] transition-colors">
              Nearby Landmarks
            </Link>
            <span>/</span>
            <span className="text-[#D4AF37] font-semibold">{attraction.name}</span>
          </nav>
        </div>

        {/* Hero Header Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-neutral-900 to-[#181818] border border-white/10 relative overflow-hidden">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B8860B]/20 border border-[#B8860B]/40 text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-4">
                <Compass className="w-3.5 h-3.5" />
                <span>{attraction.badge}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-white leading-tight">
                Homestay Near{' '}
                <span className="font-semibold text-gold-gradient">{attraction.name}</span>
              </h1>
              <p className="mt-4 text-base sm:text-lg text-neutral-300 font-light leading-relaxed">
                Stay comfortably at PS Elite Homestay on Air Bypass Road, located just{' '}
                <strong className="text-white font-semibold">{attraction.distanceKm}</strong> (
                {attraction.travelTimeMin}) away.
              </p>

              {/* Transit Pill Highlights */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-200">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <span>Distance: {attraction.distanceKm}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-200">
                  <Clock className="w-4 h-4 text-[#D4AF37]" />
                  <span>Travel Time: {attraction.travelTimeMin}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-neutral-200">
                  <Car className="w-4 h-4 text-[#D4AF37]" />
                  <span>Best Time: {attraction.bestTime}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Proximity & Travel Guide Breakdown */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left 2 Cols: Guidance & Advantages */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">About {attraction.name}</h2>
                <p className="text-neutral-300 leading-relaxed font-light text-base">
                  {attraction.description}
                </p>
              </div>

              {attraction.localTips && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Arriving by Train: Practical Tips</h2>
                  <dl className="space-y-4">
                    {attraction.localTips.map((tip) => (
                      <div key={tip.q} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <dt className="font-semibold text-white">{tip.q}</dt>
                        <dd className="mt-1.5 text-sm text-neutral-300 leading-relaxed">{tip.a}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {attraction.type === 'transport' && attraction.id !== 'tirupati-airport' && attraction.id !== 'bus-stand' && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">Railway Stations Near PS Elite Homestay</h2>
                  <div className="overflow-x-auto rounded-2xl border border-white/10">
                    <table className="w-full min-w-[480px] text-sm">
                      <caption className="sr-only">Road distance from PS Elite Homestay to Tirupati-area railway stations</caption>
                      <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-neutral-400">
                        <tr>
                          <th scope="col" className="px-4 py-3">Station</th>
                          <th scope="col" className="px-4 py-3">Code</th>
                          <th scope="col" className="px-4 py-3">Road distance</th>
                          <th scope="col" className="px-4 py-3">Travel time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {RAIL_STATIONS.map((s) => (
                          <tr key={s.code} className="border-t border-white/10">
                            <th scope="row" className="px-4 py-3 text-left font-semibold text-white">
                              {s.href && s.href !== `/near/${attraction.id}` ? (
                                <Link href={s.href} className="text-[#D4AF37] hover:underline">
                                  {s.name}
                                </Link>
                              ) : (
                                s.name
                              )}
                            </th>
                            <td className="px-4 py-3 text-neutral-300 font-mono">{s.code}</td>
                            <td className="px-4 py-3 text-neutral-200">{s.distanceKm}</td>
                            <td className="px-4 py-3 text-neutral-200">{s.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Proximity Advantages Box */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-[#D4AF37]" />
                  <span>Why Stay at PS Elite Homestay for this Visit?</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-sm font-bold text-white block mb-1">
                      Direct Air Bypass Road Access
                    </span>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Avoid inner Tirupati bazaar congestion. Easy broad road connectivity directly leads toward the ghat road and pilgrim routes.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-sm font-bold text-white block mb-1">
                      Elevator Access for Elders
                    </span>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Senior citizens visiting holy temples enjoy effortless elevator transport across all homestay floors.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-sm font-bold text-white block mb-1">
                      24/7 Front Desk &amp; Auto Assistance
                    </span>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Our front desk arranges early morning autos (3:30 AM – 5:00 AM) and reliable cabs for Alipiri treks or darshan schedules.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                    <span className="text-sm font-bold text-white block mb-1">
                      1BHK &amp; 2BHK Family Suites
                    </span>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Big family pilgrimage groups can stay together with private living halls, kitchens, and attached western washrooms.
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommended Accommodations Grid */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">
                  Recommended Rooms for Pilgrims &amp; Visitors
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {ROOMS_DATA.slice(0, 4).map((room) => (
                    <div
                      key={room.id}
                      className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex flex-col justify-between"
                    >
                      <div className="relative h-44 overflow-hidden">
                        <img
                  loading="lazy"
                  decoding="async"
                          src={room.image}
                          alt={room.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-bold text-[#D4AF37]">
                          ₹{room.pricePerNight}/night
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-bold text-white">{room.name}</h3>
                          <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{room.tagline}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                          <span className="text-xs text-neutral-300 font-medium">Up to {room.guests} Guests</span>
                          <Link
                            href={`/rooms/${room.id}`}
                            className="text-xs font-bold text-[#D4AF37] hover:underline"
                          >
                            View Specs &rarr;
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Instant Booking & Landmark Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 p-6 rounded-2xl bg-neutral-900/90 border border-white/15 backdrop-blur-md shadow-2xl">
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
                  Location Proximity
                </span>
                <h3 className="text-xl font-bold text-white mb-4">Book Near This Landmark</h3>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 mb-6 space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Landmark:</span>
                    <span className="text-white font-semibold text-right">{attraction.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Road Distance:</span>
                    <span className="text-[#D4AF37] font-bold font-mono">{attraction.distanceKm}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Estimated Drive:</span>
                    <span className="text-white font-mono">{attraction.travelTimeMin}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Inquire via WhatsApp</span>
                  </a>

                  <a
                    href="tel:+919392739715"
                    className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/15 transition-all"
                  >
                    <Phone className="w-4 h-4 text-[#D4AF37]" />
                    <span>Call Desk: +91 93927 39715</span>
                  </a>

                  <Link
                    href="/#location"
                    className="w-full py-2.5 px-4 rounded-xl text-center text-xs text-neutral-400 hover:text-white transition-colors block"
                  >
                    View Interactive Google Map
                  </Link>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10 text-[11px] text-neutral-400 flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Address: 19-4-9/D/9A, Air Bypass Road, STV Nagar, Tirupati</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Other Nearby Attractions (pSEO Spoke-to-Spoke Linking) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-white/10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold block">
                Pilgrimage Exploration
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Other Key Landmarks Near PS Elite Homestay
              </h2>
            </div>
            <Link
              href="/near"
              className="text-xs font-bold text-[#D4AF37] hover:underline hidden sm:block"
            >
              View Full Guide &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherAttractions.map((other) => (
              <Link
                key={other.id}
                href={`/near/${other.id}`}
                className="group p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37] block mb-1">
                    {other.distanceKm} away
                  </span>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    {other.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{other.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-300">
                  <span>{other.travelTimeMin}</span>
                  <span className="text-[#D4AF37] font-semibold">View Guide &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

