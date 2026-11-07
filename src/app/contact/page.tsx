import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, MapPin, Phone, Mail, MessageCircle, Clock } from 'lucide-react';

const SITE_URL = 'https://www.pselitehomestays.com';
const ADDRESS = '19-4-9/D/9A, Air Bypass Rd, behind Easy Buy, STV Nagar, Tirupati, Andhra Pradesh 517501, India';

export const metadata: Metadata = {
  title: 'Contact PS Elite Homestay, Tirupati | Phone & WhatsApp',
  description:
    'Call +91 93927 39715 or WhatsApp to book. PS Elite Homestay, Air Bypass Rd, behind Easy Buy, STV Nagar, Tirupati 517501. Front desk open 24/7.',
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': `${SITE_URL}/contact#page`,
        url: `${SITE_URL}/contact`,
        name: 'Contact PS Elite Homestay',
        about: { '@id': `${SITE_URL}/#hotel` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Contact', item: `${SITE_URL}/contact` },
        ],
      },
    ],
  };

  const row = 'flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10';

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="bg-[#111111] text-white pt-28 sm:pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
            <Link href="/" className="hover:text-[#D4AF37] flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="text-[#D4AF37] font-semibold">Contact</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl font-light tracking-tight">
            Contact <span className="font-semibold text-gold-gradient">PS Elite Homestay</span>
          </h1>
          <p className="mt-4 text-neutral-300">
            The fastest way to book is WhatsApp or a call. Send your dates and number of guests and the front desk
            will confirm availability.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={row}>
              <Phone className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-semibold text-neutral-400">Phone (24/7 front desk)</h2>
                <a href="tel:+919392739715" className="block py-1 text-lg font-bold hover:text-[#D4AF37]">
                  +91 93927 39715
                </a>
                <a href="tel:+919440311716" className="block py-1 text-neutral-300 hover:text-white">
                  +91 94403 11716
                </a>
              </div>
            </div>
            <div className={row}>
              <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-semibold text-neutral-400">WhatsApp</h2>
                <a
                  href="https://wa.me/919392739715?text=Hello%20PS%20Elite%20Homestay%2C%20I%20would%20like%20to%20check%20availability."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-1 px-4 py-2 rounded-lg bg-[#25D366] text-black font-bold text-sm"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
            <div className={row}>
              <MapPin className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-semibold text-neutral-400">Address</h2>
                <address className="not-italic text-neutral-200">{ADDRESS}</address>
                <a
                  href="https://g.page/r/CUrLKvmEc7ihEAE"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block py-1 text-sm text-[#D4AF37] hover:underline"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>
            <div className={row}>
              <Mail className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-semibold text-neutral-400">Email</h2>
                <a href="mailto:pselitehomestays@gmail.com" className="block py-1 hover:text-[#D4AF37]">
                  pselitehomestays@gmail.com
                </a>
              </div>
            </div>
            <div className={`${row} md:col-span-2`}>
              <Clock className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-sm font-semibold text-neutral-400">Check-in &amp; check-out</h2>
                <p className="text-neutral-200">Check-in from 12:00 PM · Check-out by 11:00 AM</p>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl overflow-hidden border border-white/10 h-80">
            <iframe
              title="Map: PS Elite Homestay, Tirupati"
              src="https://maps.google.com/maps?q=PS+Elite+Homestay,+Air+Bypass+Rd,+STV+Nagar,+Tirupati,+Andhra+Pradesh+517501&z=15&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <p className="mt-8 text-sm text-neutral-400">
            See <Link href="/rooms" className="text-[#D4AF37] hover:underline">rooms &amp; tariffs</Link> or{' '}
            <Link href="/near" className="text-[#D4AF37] hover:underline">distances to Tirumala and Alipiri</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
