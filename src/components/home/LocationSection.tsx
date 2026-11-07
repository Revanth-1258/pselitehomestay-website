'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Phone, ExternalLink, Clock, Car, Compass } from 'lucide-react';

export const LocationSection: React.FC = () => {
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir//19-4-9%2FD%2F9A,+Air+Bypass+Road,+STV+Nagar,+Tirupati,+Andhra+Pradesh+517501`;
  const googleMapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=Air+Bypass+Road+STV+Nagar+Tirupati+517501`;

  const routeGuides = [
    {
      from: 'Alipiri Footpath & Padmavathi Ammavari Temple',
      time: '8 Mins Drive',
      distance: '3.5 KM',
      icon: Compass,
      routeUrl: `https://www.google.com/maps/dir/Alipiri+Footpath+Entry,+Tirupati/Air+Bypass+Road,+STV+Nagar,+Tirupati`,
    },
    {
      from: 'Tirupati Main Railway Station',
      time: '5 Mins Drive',
      distance: '1.5 KM',
      icon: Car,
      routeUrl: `https://www.google.com/maps/dir/Tirupati+Railway+Station/Air+Bypass+Road,+STV+Nagar,+Tirupati`,
    },
    {
      from: 'Tirupati Bus Stand (APSRTC Hub)',
      time: '3 Mins Drive',
      distance: '1.0 KM',
      icon: Car,
      routeUrl: `https://www.google.com/maps/dir/Tirupati+Bus+Stand/Air+Bypass+Road,+STV+Nagar,+Tirupati`,
    },
    {
      from: 'Tirupati International Airport (Renigunta)',
      time: '25 Mins Drive',
      distance: '16 KM',
      icon: Navigation,
      routeUrl: `https://www.google.com/maps/dir/Tirupati+Airport/Air+Bypass+Road,+STV+Nagar,+Tirupati`,
    },
  ];

  return (
    <section id="location" className="py-24 bg-[#ECEBE7] border-y border-neutral-200 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#8C6514] text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Exact Location &amp; Live Navigation
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 uppercase">
            How to Reach <span className="text-gold-gradient">PS Elite Homestay</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 font-medium">
            Conveniently located at No:19, 19-4-9/D/9A, Air Bypass Road, STV Nagar, Tirupati, offering quick 8 mins access to Lord Sri Venkateswara&apos;s Alipiri Footpath &amp; Kapila Theertham.
          </p>
          <p className="mt-3 text-sm text-neutral-600">
            Plan your route: our{' '}
            <Link href="/near/railway-station" className="font-semibold text-[#8C6514] underline underline-offset-2">
              homestay near Tirupati railway station
            </Link>
            ,{' '}
            <Link href="/near/bus-stand" className="font-semibold text-[#8C6514] underline underline-offset-2">
              stay near the bus stand
            </Link>{' '}
            and{' '}
            <Link href="/near/alipiri-footpath" className="font-semibold text-[#8C6514] underline underline-offset-2">
              rooms near Alipiri footpath
            </Link>{' '}
            guides, or see{' '}
            <Link href="/near" className="font-semibold text-[#8C6514] underline underline-offset-2">
              all distances
            </Link>
            .
          </p>
        </div>

        {/* Main Location & Interactive Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Interactive Embedded Google Map */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-3 sm:p-4 border border-neutral-200 shadow-xl overflow-hidden">
            <div className="relative w-full h-[400px] sm:h-[480px] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
              <iframe
                title="PS Elite Homestay Location Map Tirupati"
                src="https://maps.google.com/maps?q=PS+Elite+Homestay,+Air+Bypass+Rd,+STV+Nagar,+Tirupati,+Andhra+Pradesh+517501&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Floating Current Location Overlay */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-neutral-200 shadow-lg flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#B8860B] animate-bounce" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-900">PS Elite Homestay</p>
                  <p className="text-[10px] text-neutral-600 font-medium">Air Bypass Road, STV Nagar</p>
                </div>
              </div>

              {/* Floating Direct GPS Navigation Trigger */}
              <div className="absolute bottom-4 right-4 left-4 sm:left-auto">
                <a
                  href={googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Start Live GPS Navigation</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right: Routes, Exact Address & Phone Assistance */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-md">
              <h3 className="text-sm uppercase tracking-widest text-[#8C6514] font-bold mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Exact Homestay Address</span>
              </h3>
              <p className="text-sm font-bold text-neutral-900 leading-relaxed">
                19-4-9/D/9A, Air Bypass Road, STV Nagar, Tirupati, Andhra Pradesh 517501, India
              </p>
              <div className="mt-4 pt-4 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] text-neutral-500 font-semibold">Direct Navigation Support:</p>
                  <a
                    href="tel:+919392739715"
                    className="text-sm font-mono font-bold text-[#8C6514] hover:underline flex items-center gap-1.5 mt-0.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>+91 93927 39715</span>
                  </a>
                </div>
                <div>
                  <p className="text-[11px] text-neutral-500 font-semibold">Alternate Support:</p>
                  <a
                    href="tel:+919440311716"
                    className="text-sm font-mono font-bold text-neutral-800 hover:underline flex items-center gap-1.5 mt-0.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-neutral-500" />
                    <span>+91 94403 11716</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Route Guides */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-neutral-600">
                Key Landmark Distances
              </p>
              {routeGuides.map((guide, idx) => {
                const IconComponent = guide.icon;
                return (
                  <a
                    key={idx}
                    href={guide.routeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white p-4 rounded-2xl border border-neutral-200 hover:border-[#B8860B]/60 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 group-hover:bg-[#B8860B] flex items-center justify-center transition-colors">
                        <IconComponent className="w-5 h-5 text-[#B8860B] group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-neutral-900 group-hover:text-[#B8860B] transition-colors">
                          {guide.from}
                        </p>
                        <p className="text-[11px] text-neutral-600 font-medium">
                          {guide.time} &bull; <span className="text-[#8C6514] font-bold">{guide.distance}</span>
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-[#B8860B] transition-colors shrink-0" />
                  </a>
                );
              })}
            </div>

            {/* Google Maps Search Action */}
            <div className="pt-2">
              <a
                href={googleMapsSearchUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-2xl border border-neutral-300 bg-white hover:bg-amber-50 text-neutral-900 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>Open Location in Google Maps App</span>
                <ExternalLink className="w-4 h-4 text-[#B8860B]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
