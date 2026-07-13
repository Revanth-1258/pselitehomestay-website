'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NEARBY_ATTRACTIONS } from '@/data/templesData';
import { MapPin, Navigation, Clock, ExternalLink, Sparkles } from 'lucide-react';

export const NearbyTemplesSection: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'temple' | 'transport'>('all');

  const items =
    filter === 'all'
      ? NEARBY_ATTRACTIONS
      : NEARBY_ATTRACTIONS.filter((item) => item.type === filter);

  return (
    <section id="temples" className="py-24 bg-[#ECEBE7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#B8860B] text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Sacred Proximity Guide
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 uppercase">
            Nearby <span className="text-gold-gradient">Temples &amp; Hubs</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 font-medium">
            Located minutes from the Alipiri Footpath gateway and Kapila Theertham, PS Elite offers the fastest, least congested access route to Lord Sri Venkateswara at Tirumala.
          </p>

          {/* Filter tabs */}
          <div className="mt-8 inline-flex gap-2 p-1.5 rounded-full bg-white border border-neutral-200 shadow-sm">
            {[
              { id: 'all', label: 'All Locations' },
              { id: 'temple', label: 'Sacred Shrines' },
              { id: 'transport', label: 'Airport & Railway Station' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider font-bold transition-all ${
                  filter === tab.id
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black shadow-md'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((place, index) => (
            <motion.div
              key={place.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-md hover:shadow-xl hover:border-[#B8860B]/60 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#B8860B] text-[10px] font-bold uppercase tracking-wider">
                    {place.badge}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold font-mono">
                    <Navigation className="w-3.5 h-3.5 text-[#B8860B]" />
                    <span>{place.distanceKm}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-neutral-900 group-hover:text-[#B8860B] transition-colors">
                  {place.name}
                </h3>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed font-medium">
                  {place.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold">
                  <Clock className="w-4 h-4" />
                  <span>{place.travelTimeMin}</span>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    place.name + ' Tirupati'
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#B8860B] hover:underline font-bold"
                >
                  <span>Directions</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
