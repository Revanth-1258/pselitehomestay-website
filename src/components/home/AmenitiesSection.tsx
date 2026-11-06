'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AMENITIES_DATA } from '@/data/amenitiesData';
import * as Icons from 'lucide-react';

export const AmenitiesSection: React.FC = () => {
  return (
    <section id="amenities" className="py-24 bg-[#F8F7F4] border-y border-neutral-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#8C6514] text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Bespoke Comfort &amp; Pilgrim Services
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 uppercase">
            Luxury <span className="text-gold-gradient">Amenities</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 font-medium">
            Designed to elevate your stay in Tirupati—from 300 Mbps fiber internet and 24/7 hot water for early morning Suprabhatam darshan to covered parking and executive housekeeping.
          </p>
        </div>

        {/* 12 Amenities Luxury Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {AMENITIES_DATA.map((item, idx) => {
            const LucideIcon = (Icons as any)[item.iconName] || Icons.Sparkles;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-md hover:shadow-xl hover:border-[#B8860B]/60 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-5 group-hover:bg-[#B8860B] group-hover:text-white group-hover:scale-110 transition-all text-[#B8860B]">
                    <LucideIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 group-hover:text-[#B8860B] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-[#B8860B] font-bold">
                    {item.category}
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
