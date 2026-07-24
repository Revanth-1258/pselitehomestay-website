'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Sparkles, Navigation, Compass } from 'lucide-react';

interface AttractionItem {
  name: string;
  distance: string;
  image: string;
  tag?: string;
  objectPosition?: string;
}

const ATTRACTIONS_DATA: AttractionItem[] = [
  {
    name: 'Alipiri Foot Path Gateway',
    distance: '4.7 Km',
    image: '/images/attractions/alipiri.jpg',
    tag: 'Sacred Trek Gateway',
  },
  {
    name: 'Sri Kapilatheertham Waterfalls & Temple',
    distance: '4.4 Km',
    image: '/images/attractions/kapiltheertham.jpg',
    tag: 'Divine Waterfall',
  },
  {
    name: 'ISKCON Tirupati Temple',
    distance: '4.2 Km',
    image: '/images/attractions/iscon.jpg',
    tag: 'Radha Krishna Temple',
  },
  {
    name: 'Tiruchanur Sri Padmavati Ammavaari Temple',
    distance: '4 km',
    image: '/images/attractions/padmavati.jpg',
    tag: 'Goddess Padmavati',
    objectPosition: 'top',
  },
  {
    name: 'Govindharajula Swamy Temple',
    distance: '2 km',
    image: '/images/attractions/govindharaja.jpg',
    tag: 'Historic City Center Shrine',
  },
  {
    name: 'Tirupati Main Railway Station',
    distance: '1.5 km',
    image: '/images/attractions/railway.jpg',
    tag: 'Railway Transit Hub',
  },
  {
    name: 'Tirupati Bus Stand (APSRTC Hub)',
    distance: '1.0 km',
    image: '/images/attractions/busstand.jpg',
    tag: 'Central Bus Station',
  },
  {
    name: 'SV Zoological Park',
    distance: '9 km',
    image: '/images/attractions/zoo.jpg',
    tag: 'Nature & Wildlife',
  },
  {
    name: 'Chandragiri Fort & Palace',
    distance: '16.5 Km',
    image: '/images/attractions/chandragiri.jpg',
    tag: 'Heritage Monument',
  },
  {
    name: 'Tirumala Sacred Hills Darshan',
    distance: '24 Km',
    image: '/images/attractions/tirumala.jpg',
    tag: 'Lord Venkateswara Shrine',
    objectPosition: 'top',
  },
  {
    name: 'Srikalahasthi Shiva Temple',
    distance: '36 Km',
    image: '/images/attractions/kalahasthi.jpg',
    tag: 'Vayu Linga Kshetram',
  },
];

export const DiscoverTirupatiSection: React.FC = () => {
  return (
    <section id="discover-tirupati" className="py-24 bg-[#111111] text-white relative border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Hero Banner */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#B8860B]/15 border border-[#B8860B]/40 text-[#D4AF37] text-xs font-bold tracking-[0.2em] uppercase mb-4 shadow-sm">
            Discover Tirupati
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase text-white">
            Welcome to PS Elite — <span className="text-gold-gradient">Your Gateway to Divine Tirupati</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-300 max-w-3xl mx-auto font-light leading-relaxed">
            Experience the serene beauty of nature and the spiritual grace of Tirupati, all in one place. Explore top attractions, find peace in the hills, and plan your temple journey with ease.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://ttdevasthanams.ap.gov.in/home/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#B8860B] text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:opacity-95 transition-all"
            >
              <span>Learn More About Temple Booking</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* TRIP PLANNING & COMPLETE TRAVEL ASSISTANCE CARD */}
        <motion.div
          id="trip-assistance"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 rounded-3xl bg-gradient-to-br from-neutral-900 via-[#161616] to-neutral-900 border border-[#D4AF37]/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden scroll-mt-28"
        >
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Complete Pilgrim Trip Assistance</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-extrabold text-white uppercase tracking-wide leading-tight">
                Planning Your Trip Around Tirupati? <span className="text-gold-gradient">We&apos;ve Got You Covered!</span>
              </h3>
              <p className="mt-3 text-sm sm:text-base text-neutral-300 font-light leading-relaxed">
                Just a click away to get a personalized travel itinerary, transparent cab prices, and complete temple tour guidance for a smooth trip experience along with your luxury stay.
              </p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-300 font-medium">
                <div className="flex items-center gap-2 bg-black/40 px-3 py-2.5 rounded-xl border border-white/10">
                  <span className="text-[#D4AF37]">🛕</span>
                  <span>Tirumala Darshan Cab Packages</span>
                </div>
                <div className="flex items-center gap-2 bg-black/40 px-3 py-2.5 rounded-xl border border-white/10">
                  <span className="text-[#D4AF37]">🗺️</span>
                  <span>Local Multi-Temple Itineraries</span>
                </div>
                <div className="flex items-center gap-2 bg-black/40 px-3 py-2.5 rounded-xl border border-white/10">
                  <span className="text-[#D4AF37]">💰</span>
                  <span>Transparent Package Rates</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <a
                href="https://wa.me/919392739715?text=Namaste%20PS%20Elite%20Homestay!%20%F0%9F%99%8F%20I%20am%20planning%20my%20trip%20to%20Tirupati%20and%20would%20like%20a%20customized%20travel%20plan%20and%20cab%20package%20prices%20along%20with%20my%20stay."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  try {
                    const prev = parseInt(localStorage.getItem('ps_trip_package_clicks') || '0', 10);
                    localStorage.setItem('ps_trip_package_clicks', String(prev + 1));
                    const logs = JSON.parse(localStorage.getItem('ps_trip_package_logs') || '[]');
                    logs.push({ source: 'WhatsApp Assistance Card', timestamp: new Date().toISOString() });
                    localStorage.setItem('ps_trip_package_logs', JSON.stringify(logs.slice(-100)));
                  } catch (err) {}
                }}
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-extrabold text-sm uppercase tracking-wider shadow-xl hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2.5"
              >
                <span>Plan My Trip &amp; Travel Prices</span>
                <span>💬</span>
              </a>
              <a
                href="tel:+919392739715"
                className="px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2"
              >
                <span>📞 Call For Support</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Catalog: What's around PS Elite Homestay */}
        <div className="mb-12 text-center">
          <h3 className="text-xs uppercase font-extrabold tracking-[0.25em] text-[#D4AF37]">
            WHAT&apos;S AROUND PS ELITE HOMESTAY
          </h3>
          <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-2"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ATTRACTIONS_DATA.map((item, idx) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="group bg-neutral-900/90 rounded-2xl overflow-hidden border border-neutral-800 hover:border-[#D4AF37]/50 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden bg-neutral-950">
                <img
                  src={item.image}
                  alt={item.name}
                  style={item.objectPosition ? { objectPosition: item.objectPosition } : undefined}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold">
                  {item.distance}
                </div>
                {item.tag && (
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-2.5 py-0.5 rounded-md text-neutral-300 text-[10px] uppercase tracking-wider">
                    {item.tag}
                  </div>
                )}
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h4 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                  {item.name}
                </h4>
                <div className="mt-3 flex items-center justify-between text-xs text-neutral-400 pt-3 border-t border-neutral-800">
                  <span className="flex items-center gap-1 text-[#D4AF37]">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Direct Access</span>
                  </span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      item.name + ' Tirupati'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white font-semibold flex items-center gap-1"
                  >
                    <span>Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
