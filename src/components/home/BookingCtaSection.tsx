'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CalendarCheck, PhoneCall, MessageCircle, Crown, Sparkles } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';

export const BookingCtaSection: React.FC = () => {
  const { rooms, openBookingModalWithRoom } = useBooking();

  return (
    <section className="py-24 bg-[#F8F7F4] relative overflow-hidden">
      {/* Subtle Warm Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl p-8 sm:p-14 border border-neutral-200 shadow-xl text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Crown className="w-7 h-7 text-[#B8860B]" />
          </div>

          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#B8860B]">
            Tirupati Pilgrimage &amp; Residence Concierge
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 mt-2 uppercase">
            Book Your Stay <span className="text-gold-gradient">Today</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Reserve your deluxe room, family pilgrim suite, or terrace room. Enjoy instant confirmation, transparent rates, and our 24/7 Tirumala darshan concierge.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {/* Book Online button */}
            <button
              onClick={() => openBookingModalWithRoom(rooms[0])}
              className="px-8 py-4 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Book Online Instantly</span>
            </button>

            {/* WhatsApp Concierge */}
            <a
              href="https://wa.me/919392739715?text=Hello%20PS%20Elite%20Concierge,%20I%20would%20like%20to%20book%20a%20luxury%20room%20for%20Tirumala%20darshan."
              target="_blank"
              rel="noreferrer"
              className="px-7 py-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>

            {/* Call Now */}
            <a
              href="tel:+919392739715"
              className="px-7 py-4 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-900 font-bold text-xs sm:text-sm tracking-wider uppercase shadow-sm transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-[#B8860B]" />
              <span>Call +91 93927 39715</span>
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs font-semibold text-neutral-500">
            <Sparkles className="w-4 h-4 text-[#B8860B]" />
            <span>Fast confirmation &amp; verified hygienic family rooms</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
