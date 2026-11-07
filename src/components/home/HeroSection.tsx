'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Crown, ArrowRight, Sparkles, Compass, CheckCircle2, ChevronDown, Phone } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';

export const HeroSection: React.FC = () => {
  const { rooms, openBookingModalWithRoom, searchParams, setSearchParams } = useBooking();

  const handleSearchBook = (e: React.FormEvent) => {
    e.preventDefault();
    const targetRoom =
      rooms.find((r) => r.category === searchParams.roomCategory) || rooms[0];
    openBookingModalWithRoom(targetRoom);
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center pt-36 sm:pt-40 lg:pt-44 pb-20 overflow-hidden">
      {/* Background image & luxury overlay */}
      <div className="absolute inset-0 z-0">
        <img
          fetchPriority="high"
          src="/images/rooms/hospitality-w1.webp"
          srcSet="/images/rooms/hospitality-w1-828.webp 828w, /images/rooms/hospitality-w1.webp 1920w"
          sizes="100vw"
          alt="PS Elite Homestay Luxury Living"
          className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[12000ms]"
        />
        {/* Clean Natural Luxury Overlay inspired by MyHomestayz */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-[#F8F7F4]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Brand Proximity Badge */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#B8860B]/40 bg-black/60 backdrop-blur-md mb-6"
        >
          <Crown className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#D4AF37]">
            PS ELITE HOMESTAY
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </motion.div>

        {/* Hero Heading */}
        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white max-w-4xl leading-[1.08]"
        >
          PS Elite Homestay Tirupati –{' '}
          <span className="font-semibold text-gold-gradient">Luxury Stays Near Tirumala</span>
        </motion.h1>

        {/* Sub Heading */}
        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg lg:text-xl text-neutral-300 max-w-3xl leading-relaxed font-light"
        >
          Premium Homestay Near Tirumala Temple with Deluxe Rooms, 1BHK & 2BHK Service Apartments and a Penthouse Terrace Suite.
        </motion.p>

        {/* Rating & Trust Badges */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold"
        >
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-neutral-200">
            <span className="text-[#D4AF37]">★</span>
            <span>4.8/5 on Google · 550+ reviews</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-neutral-200">
            <span className="text-[#D4AF37]">✓</span>
            <span>Trusted by 5,000+ Guests</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/35 backdrop-blur-md text-[#D4AF37]">
            <span className="text-[#D4AF37]">🎁</span>
            <span>Direct Booking Discount</span>
          </div>
        </motion.div>

        {/* Hero Action Buttons */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={() => openBookingModalWithRoom(rooms[0])}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-xs sm:text-sm tracking-widest uppercase shadow-xl shadow-[#B8860B]/30 hover:shadow-[#B8860B]/50 transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            <span>Book Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#rooms"
            className="px-8 py-4 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white font-medium text-xs sm:text-sm tracking-widest uppercase hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#D4AF37]" />
            <span>Explore Rooms</span>
          </a>

          <a
            href="#trip-assistance"
            onClick={() => {
              try {
                const prev = parseInt(localStorage.getItem('ps_trip_package_clicks') || '0', 10);
                localStorage.setItem('ps_trip_package_clicks', String(prev + 1));
                const logs = JSON.parse(localStorage.getItem('ps_trip_package_logs') || '[]');
                logs.push({ source: 'Hero CTA', timestamp: new Date().toISOString() });
                localStorage.setItem('ps_trip_package_logs', JSON.stringify(logs.slice(-100)));
              } catch (err) {}
            }}
            className="px-8 py-4 rounded-full border border-[#D4AF37]/50 bg-gradient-to-r from-[#D4AF37]/15 to-emerald-500/15 backdrop-blur-md text-white font-semibold text-xs sm:text-sm tracking-widest uppercase hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all flex items-center gap-2 shadow-lg shadow-[#D4AF37]/10"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Explore Trip Packages</span>
          </a>
        </motion.div>

        {/* Highlight Perks */}
        <motion.div
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.45 }}
          className="mt-10 flex flex-wrap items-center gap-6 text-xs text-neutral-300"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
            <span>8 Mins to Alipiri Footpath &amp; Padmavathi Ammavari Temple, Tiruchanoor</span>
          </div>
        </motion.div>

        {/* Animated Booking Search Bar - Crisp White Card inspired by MyHomestayz */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="mt-12 bg-white rounded-2xl p-4 sm:p-6 shadow-2xl border border-neutral-200/90 max-w-5xl"
        >
          <form onSubmit={handleSearchBook} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            {/* Check-In */}
            <div>
              <label htmlFor="hero-checkin" className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>Check-In</span>
              </label>
              <input
                type="date"
                id="hero-checkin"
                value={searchParams.checkIn}
                onChange={(e) => setSearchParams((prev) => ({ ...prev, checkIn: e.target.value }))}
                className="w-full min-w-0 appearance-none bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-semibold focus:outline-none focus:border-[#B8860B]"
              />
            </div>

            {/* Check-Out */}
            <div>
              <label htmlFor="hero-checkout" className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>Check-Out</span>
              </label>
              <input
                type="date"
                id="hero-checkout"
                value={searchParams.checkOut}
                onChange={(e) => setSearchParams((prev) => ({ ...prev, checkOut: e.target.value }))}
                className="w-full min-w-0 appearance-none bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-semibold focus:outline-none focus:border-[#B8860B]"
              />
            </div>

            {/* Guests */}
            <div>
              <label htmlFor="hero-guests" className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>Guests</span>
              </label>
              <div className="relative w-full">
                <select
                  id="hero-guests"
                  value={searchParams.guests}
                  onChange={(e) => setSearchParams((prev) => ({ ...prev, guests: Number(e.target.value) }))}
                  className="w-full appearance-none bg-neutral-50 border border-neutral-300 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-neutral-900 font-semibold focus:outline-none focus:border-[#B8860B]"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <option key={num} value={num} className="bg-white text-neutral-900">
                      {num} Guest{num > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500">
                  <ChevronDown className="w-4 h-4 text-[#B8860B]" />
                </div>
              </div>
            </div>

            {/* Room Type */}
            <div>
              <label htmlFor="hero-roomtype" className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1.5 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-[#B8860B]" />
                <span>Room Type</span>
              </label>
              <div className="relative w-full">
                <select
                  id="hero-roomtype"
                  value={searchParams.roomCategory}
                  onChange={(e) => setSearchParams((prev) => ({ ...prev, roomCategory: e.target.value }))}
                  className="w-full appearance-none bg-neutral-50 border border-neutral-300 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-neutral-900 font-semibold focus:outline-none focus:border-[#B8860B]"
                >
                  <option value="all" className="bg-white text-neutral-900">All Luxury Categories</option>
                  <option value="room" className="bg-white text-neutral-900">Standard &amp; Deluxe Rooms</option>
                  <option value="apartment" className="bg-white text-neutral-900">1BHK &amp; 2BHK Apartments</option>
                  <option value="penthouse" className="bg-white text-neutral-900">Penthouse</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500">
                  <ChevronDown className="w-4 h-4 text-[#B8860B]" />
                </div>
              </div>
            </div>

            {/* Submit CTA - Sleek Black Button */}
            <div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-lg flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Check Availability</span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* Signature Crimson Red Callout Banner inspired by MyHomestayz */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65 }}
          className="mt-6 bg-[#DC2626] rounded-2xl p-5 sm:p-6 shadow-xl max-w-5xl w-full flex flex-col sm:flex-row items-center justify-between gap-4 border border-red-500"
        >
          <p className="text-white font-medium text-sm sm:text-base text-center sm:text-left">
            Finding your ideal pilgrimage homestay in Tirupati should be easy, we&apos;re here to help!
          </p>
          <a
            href="tel:+919392739715"
            className="flex-shrink-0 px-6 py-3 rounded-xl bg-black hover:bg-neutral-900 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-md transition-all transform hover:scale-105"
          >
            <Phone className="w-4 h-4 text-[#D4AF37] fill-current" />
            <span>Request Callback</span>
          </a>
        </motion.div>


      </div>
    </section>
  );
};
