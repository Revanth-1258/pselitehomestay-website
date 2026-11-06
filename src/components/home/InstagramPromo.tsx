'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';

export const InstagramPromo: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-br from-[#121212] via-[#181818] to-[#121212] border-y border-white/5 relative overflow-hidden print:hidden">
      {/* Subtle background overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center shadow-lg shrink-0">
            <Crown className="w-6 h-6 text-black" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Follow Our Journey on Instagram
            </h3>
            <p className="text-neutral-300 text-xs mt-1 font-medium">
              Join <span className="text-[#D4AF37] font-semibold">@ps_elite_homestay</span> for exclusive room discounts, Tirupati pilgrim updates, and darshan tips!
            </p>
          </div>
        </div>
        <a
          href="https://instagram.com/ps_elite_homestay"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-extrabold text-xs uppercase tracking-wider transition-all transform hover:scale-105 shadow-md shadow-[#B8860B]/20 shrink-0"
        >
          Follow @ps_elite_homestay
        </a>
      </div>
    </section>
  );
};
