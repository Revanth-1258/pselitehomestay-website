import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Users,
  BedDouble,
  Maximize2,
  CheckCircle2,
  ArrowLeft,
  CalendarCheck,
  MessageCircle,
  Phone,
  Clock,
  MapPin,
  Sparkles,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { ROOMS_DATA, RoomType } from '@/data/roomsData';

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return ROOMS_DATA.map((room) => ({
    slug: room.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const room = ROOMS_DATA.find((r) => r.id === slug);

  if (!room) {
    return {
      title: 'Room Not Found | PS Elite Homestay Tirupati',
    };
  }

  const price = room.pricePerNight.toLocaleString('en-IN');
  const name = room.seoName ?? room.name;
  // Keep titles within ~60 chars so Google doesn't truncate them.
  const longTitle = `${name} in Tirupati – ₹${price}/night | PS Elite`;
  const title = longTitle.length <= 60 ? longTitle : `${name} in Tirupati – ₹${price} | PS Elite`;
  const description = `${name} for up to ${room.guests} guests, 1.5 km from Tirupati railway station. Lift, parking & 24/7 desk. ₹${price}/night when you book direct.`;
  const canonicalUrl = `https://www.pselitehomestays.com/rooms/${room.id}`;
  const ogImageUrl = `https://www.pselitehomestays.com/images/og/${room.id}.jpg`;

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
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${room.name} - PS Elite Homestay Tirupati`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function RoomPage({ params }: Props) {
  const { slug } = await params;
  const room = ROOMS_DATA.find((r) => r.id === slug);

  if (!room) {
    notFound();
  }

  const otherRooms = ROOMS_DATA.filter((r) => r.id !== room.id);

  const whatsappMessage = encodeURIComponent(
    `Hello PS Elite Homestay, I would like to check availability and book the "${room.name}" (₹${room.pricePerNight}/night).`
  );
  const whatsappUrl = `https://wa.me/919392739715?text=${whatsappMessage}`;

  // Structured Data (HotelRoom + BreadcrumbList)
  const roomSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HotelRoom',
        '@id': `https://www.pselitehomestays.com/rooms/${room.id}#room`,
        name: room.name,
        description: room.description,
        url: `https://www.pselitehomestays.com/rooms/${room.id}`,
        containedInPlace: {
          '@id': 'https://www.pselitehomestays.com/#hotel',
        },
        bed: {
          '@type': 'BedDetails',
          numberOfBeds: room.bedrooms,
        },
        occupancy: {
          '@type': 'QuantitativeValue',
          maxValue: room.guests,
          unitText: 'person',
        },
        floorSize: {
          '@type': 'QuantitativeValue',
          value: room.areaSqFt,
          unitCode: 'FTK',
        },
        amenityFeature: room.amenities.map((amenity) => ({
          '@type': 'LocationFeatureSpecification',
          name: amenity,
          value: true,
        })),
        image: room.gallery.map((img) => `https://www.pselitehomestays.com${img}`),
        offers: {
          '@type': 'Offer',
          price: room.pricePerNight,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: `https://www.pselitehomestays.com/rooms/${room.id}`,
        },
      },
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
            name: 'Rooms & Tariffs',
            item: 'https://www.pselitehomestays.com/rooms',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: room.name,
            item: `https://www.pselitehomestays.com/rooms/${room.id}`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `What is the tariff for ${room.name} at PS Elite Homestay?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `The direct booking price for ${room.name} is ₹${room.pricePerNight} per night (discounted from original tariff of ₹${room.originalPrice}). Zero booking commissions apply when reserving directly with the front desk.`,
            },
          },
          {
            '@type': 'Question',
            name: `How many guests can stay in ${room.name}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${room.name} is designed to comfortably accommodate up to ${room.guests} guests, featuring ${room.bedrooms} bedroom(s) and ${room.bathrooms} bathroom(s).`,
            },
          },
          {
            '@type': 'Question',
            name: 'Is elevator access available to this room?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, PS Elite Homestay features an elevator serving all guest floors, ensuring comfortable access for elders, senior citizens, and luggage transport.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(roomSchema) }}
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
            <Link href="/rooms" className="hover:text-[#D4AF37] transition-colors">
              Rooms &amp; Tariffs
            </Link>
            <span>/</span>
            <span className="text-[#D4AF37] font-semibold">{room.name}</span>
          </nav>
        </div>

        {/* Room Header Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8860B]/15 border border-[#B8860B]/30 text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{room.category === 'penthouse' ? 'Penthouse Service Apartment' : room.category === 'apartment' ? 'Family Service Apartment' : 'Pilgrim Sanctuary'}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-white">
                {room.name} <span className="font-semibold text-gold-gradient">in Tirupati</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-neutral-300 font-light max-w-2xl leading-relaxed">
                {room.tagline}
              </p>
            </div>

            {/* Pricing Card Header */}
            <div className="bg-white/5 border border-white/15 p-5 rounded-2xl backdrop-blur-md shrink-0 flex items-center justify-between sm:justify-start gap-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-neutral-400 block">Direct Price</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#D4AF37]">₹{room.pricePerNight}</span>
                  <span className="text-xs text-neutral-400 line-through">₹{room.originalPrice}</span>
                  <span className="text-[11px] text-neutral-400">/ night</span>
                </div>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[#B8860B]/50 transition-all flex items-center gap-2"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Book Direct</span>
              </a>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative h-80 sm:h-[480px] rounded-2xl overflow-hidden border border-white/15 group">
              <img
                  loading="lazy"
                  decoding="async"
                src={room.gallery[0] || room.image}
                alt={`${room.name} Master View`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#D4AF37] border border-white/10">
                Primary Master View
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              {room.gallery.slice(1, 3).map((img, i) => (
                <div key={i} className="relative h-40 sm:h-[232px] rounded-2xl overflow-hidden border border-white/15 group">
                  <img
                  loading="lazy"
                  decoding="async"
                    src={img}
                    alt={`${room.name} Detail ${i + 2}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specifications & Overview */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left 2 Cols: Room Specs & Description */}
            <div className="lg:col-span-2 space-y-10">
              {/* Quick Specs Pill Bar */}
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-black/40">
                  <Users className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 block font-semibold">Capacity</span>
                    <span className="text-sm font-bold text-white">{room.guests} Guests</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-black/40">
                  <BedDouble className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 block font-semibold">Bedrooms</span>
                    <span className="text-sm font-bold text-white">{room.bedrooms} Bed</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-black/40">
                  <Maximize2 className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <span className="text-[10px] uppercase text-neutral-400 block font-semibold">Living Area</span>
                    <span className="text-sm font-bold text-white">{room.areaSqFt} sq.ft</span>
                  </div>
                </div>
              </div>

              {/* Room Description */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">About This Accommodation</h2>
                <p className="text-neutral-300 leading-relaxed font-light text-base">
                  {room.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {room.highlights.map((highlight, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-[#B8860B]/10 border border-[#B8860B]/30 text-[#D4AF37] text-xs font-medium"
                    >
                      ✦ {highlight}
                    </span>
                  ))}
                </div>
              </div>

              {/* Complete Amenities Checklist */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-5">Included Amenities &amp; Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {room.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs sm:text-sm text-neutral-200">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location Highlights for Pilgrims */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/20 to-neutral-900 border border-[#B8860B]/30">
                <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  <span>Prime Location on Air Bypass Road, STV Nagar</span>
                </h2>
                <ul className="space-y-2 text-xs sm:text-sm text-neutral-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    <span><strong>1.5 km</strong> to Tirupati Main Railway Station (5 mins)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    <span><strong>1.4 km</strong> to Tirupati Central Bus Stand (3 mins)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    <span><strong>8 mins</strong> to Alipiri Footpath entry gate for Tirumala ascent</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    <span><strong>3.5 km</strong> to Sri Padmavathi Ammavari Temple (Tiruchanur)</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Direct Reservation Sticky Box */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 p-6 rounded-2xl bg-neutral-900/90 border border-white/15 backdrop-blur-md shadow-2xl">
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
                  Guaranteed Best Tariff
                </span>
                <h3 className="text-xl font-bold text-white mb-4">Direct Reservation</h3>

                <div className="p-4 rounded-xl bg-black/40 border border-white/10 mb-6">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-neutral-400">Regular Tariff:</span>
                    <span className="text-neutral-400 line-through font-mono">₹{room.originalPrice}</span>
                  </div>
                  <div className="flex justify-between items-center text-base font-bold">
                    <span className="text-neutral-200">Direct Booking Rate:</span>
                    <span className="text-[#D4AF37] text-xl font-mono">₹{room.pricePerNight}</span>
                  </div>
                  <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Zero booking fees &bull; Instant confirmation</span>
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
                    <span>Reserve via WhatsApp</span>
                  </a>

                  <a
                    href="tel:+919392739715"
                    className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-white/15 transition-all"
                  >
                    <Phone className="w-4 h-4 text-[#D4AF37]" />
                    <span>Call Front Desk: +91 93927 39715</span>
                  </a>

                  <Link
                    href="/rooms"
                    className="w-full py-2.5 px-4 rounded-xl text-center text-xs text-neutral-400 hover:text-white transition-colors block"
                  >
                    &larr; Compare with all room types
                  </Link>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10 space-y-2 text-[11px] text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Check-in: 12:00 PM | Check-out: 11:00 AM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Elevator access available to all floors</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cross-linking to Other Rooms (Spoke-to-Spoke pSEO Architecture) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-white/10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold block">
                Explore More Sanctuaries
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Other Accommodations at PS Elite
              </h2>
            </div>
            <Link
              href="/rooms"
              className="text-xs font-bold text-[#D4AF37] hover:underline hidden sm:block"
            >
              View All Tariffs &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherRooms.map((other) => (
              <Link
                key={other.id}
                href={`/rooms/${other.id}`}
                className="group rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-[#D4AF37]/60 transition-all flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden bg-neutral-900">
                  <img
                  loading="lazy"
                  decoding="async"
                    src={other.image}
                    alt={other.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-[#D4AF37]">
                    ₹{other.pricePerNight} <span className="text-[10px] text-neutral-300 font-normal">/ night</span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                      {other.name}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{other.tagline}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-300">
                    <span>{other.guests} Guests</span>
                    <span className="text-[#D4AF37] font-semibold">Explore &rarr;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

