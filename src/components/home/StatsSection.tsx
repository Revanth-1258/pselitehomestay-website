'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Star, Clock, Sparkles, MapPin } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const stats = [
    {
      value: '5,000+',
      label: 'Happy Pilgrims & Guests',
      icon: Users,
      desc: 'Trusted by families across India & NRI visitors',
    },
    {
      value: '4.8 / 5',
      label: 'Google Guest Rating',
      icon: Star,
      desc: 'From 550+ guest reviews on Google',
    },
    {
      value: '24 / 7',
      label: 'Support Desk',
      icon: Clock,
      desc: 'Round-the-clock check-in & travel assistance',
    },
    {
      value: '100%',
      label: 'Sanitized & Clean Rooms',
      icon: Sparkles,
      desc: 'Spotless hygienic linen & organic toiletries',
    },
    {
      value: '8 Mins',
      label: 'Alipiri & Padmavathi Amma Temple',
      icon: MapPin,
      desc: '8 Mins drive to Alipiri Footpath & Tiruchanur Padmavathi Amma Temple',
    },
  ];

  return (
    <section className="py-16 bg-[#F8F7F4] border-y border-neutral-200 relative z-10" aria-label="Key Proximity and Guest Highlights">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="sr-only">Key Proximity and Guest Highlights</h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-md hover:shadow-xl hover:border-[#B8860B]/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-[#B8860B]" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900 tracking-tight">
                  {item.value}
                </p>
                <p className="text-xs uppercase tracking-widest text-[#B8860B] font-bold mt-1">
                  {item.label}
                </p>
                <p className="text-[11px] text-neutral-600 mt-2 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
