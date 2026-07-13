'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  X,
  ShieldCheck,
  MapPin,
  Sparkles,
  Wifi,
  Tv,
  Wind,
  BedDouble,
  Bath,
  Zap,
  ArrowUpRight,
  Car,
  Video,
  Home,
  Utensils,
  HeartHandshake,
  Smartphone,
  Sparkle,
  Moon,
  Users,
} from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const reasons = [
    {
      title: 'Spacious Luxury Living',
      tagline: 'Feel at Home in Tirupati',
      description:
        'Unlike standard hotel rooms, our accommodations provide spacious layouts with beautifully designed interiors, comfortable living areas, premium furnishings, and a relaxing atmosphere that feels like your own home.',
      image: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/6dNsNboQCT9IyPR6',
      icon: Home,
      highlight: '340 - 2,100 Sq. Ft. Private Layouts',
    },
    {
      title: 'Prime Location Near Tirumala',
      tagline: 'Fast & Convenient Temple Gateway',
      description:
        'Stay just minutes away from Tirumala Temple, Alipiri Footpath, Railway Station, Bus Station, Airport, shopping streets, and popular attractions, making every journey faster and more convenient.',
      image: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/wp6bJRaoBf92FZgA',
      icon: MapPin,
      highlight: 'Minutes to Alipiri & Railway Station',
    },
    {
      title: 'Family-Friendly Accommodation',
      tagline: 'Designed for Every Traveler & Group',
      description:
        'Traveling with family or large groups? Choose from Deluxe Rooms, Family Suites, 1BHK Apartments, 2BHK Apartments, and Luxury Penthouse options designed for every type of traveler.',
      image: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/zdnwEAsMlgYjuDJ2',
      icon: Users,
      highlight: '1BHK & 2BHK Family Suites Up to 8 Guests',
    },
    {
      title: 'Premium Hospitality',
      tagline: '24×7 Dedicated Guest Support',
      description:
        'Our dedicated hospitality team is available around the clock to ensure every guest enjoys a seamless and memorable experience from arrival to departure.',
      image: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/uYmPqpRZ5GPsIihb',
      icon: HeartHandshake,
      highlight: 'Personalized Concierge & Temple Cab Assistance',
    },
    {
      title: 'Smart Digital Experience',
      tagline: 'Fast Check-In & WhatsApp Assistance',
      description:
        'Enjoy fast online booking, instant confirmation, digital check-in, secure payments, WhatsApp assistance, and personalized guest support.',
      image: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/s7AZxPxOo3FcmvUY',
      icon: Smartphone,
      highlight: 'Instant Confirmation & Digital Support',
    },
    {
      title: 'Cleanliness Beyond Expectations',
      tagline: 'Sanitized & Inspected Before Check-In',
      description:
        'Every room is professionally cleaned, sanitized, and inspected before every check-in to ensure a fresh and hygienic stay.',
      image: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/EkaCFEEfQsKmxRhn',
      icon: Sparkle,
      highlight: '100% Hygienic & Sanitized Linen',
    },
    {
      title: 'Peaceful Ambience',
      tagline: 'Escape Overcrowded Commercial Hotels',
      description:
        'Escape the crowded commercial hotel environment and relax in a peaceful setting designed for comfort, privacy, and quality family time.',
      image: 'https://yralcgckodgemrozhvhn.supabase.co/storage/v1/object/public/websites-data/logo/X3lLj6QKrUKzVLN7',
      icon: Moon,
      highlight: 'Serene Sanctuary Under Seshachalam Hills',
    },
  ];

  const modernComforts = [
    { label: 'High-Speed Wi-Fi', icon: Wifi },
    { label: 'Smart TV', icon: Tv },
    { label: 'Air Conditioning', icon: Wind },
    { label: 'Premium Beds', icon: BedDouble },
    { label: 'Spacious Bathrooms', icon: Bath },
    { label: 'Power Backup', icon: Zap },
    { label: 'Elevator Access', icon: ArrowUpRight },
    { label: 'Secure Parking', icon: Car },
    { label: '24×7 CCTV Security', icon: Video },
    { label: 'Housekeeping', icon: Sparkles },
    { label: 'Kitchen (Selected Apartments)', icon: Utensils },
  ];

  return (
    <section id="why-us" className="py-24 bg-[#F8F7F4] relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-100/40 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section requested by User */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#B8860B] text-xs font-bold tracking-[0.2em] uppercase mb-4">
            The PS Elite Distinction
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 uppercase">
            Why Choose <span className="text-gold-gradient">PS Elite Homestay</span>
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-[#B8860B] font-bold tracking-wide">
            Experience More Than a Stay—Feel at Home in Tirupati
          </p>
          <p className="mt-4 text-sm sm:text-base text-neutral-600 font-medium leading-relaxed">
            Whether you&apos;re visiting for a sacred pilgrimage, a family vacation, or a business trip, PS Elite Homestay is designed to deliver comfort, privacy, and premium hospitality that traditional hotels simply cannot match.
          </p>
        </div>

        {/* Interactive Feature Showcase with Attractive Images */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-20">
          {/* Left Feature Selector Tabs */}
          <div className="lg:col-span-5 space-y-3">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;
              const isActive = activeTab === index;
              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 group ${
                    isActive
                      ? 'bg-amber-50/80 border-[#B8860B] shadow-md'
                      : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-sm'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#B8860B] text-white font-bold'
                        : 'bg-neutral-100 text-[#B8860B] group-hover:bg-amber-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-sm sm:text-base font-bold truncate transition-colors ${
                        isActive ? 'text-neutral-900' : 'text-neutral-700 group-hover:text-neutral-900'
                      }`}
                    >
                      {reason.title}
                    </h3>
                    <p className="text-xs text-neutral-500 font-medium truncate mt-0.5">{reason.tagline}</p>
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full transition-all ${
                      isActive ? 'bg-[#B8860B] scale-125' : 'bg-transparent'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Interactive Image & Detail Preview Card */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {reasons.map((reason, index) => {
                if (index !== activeTab) return null;
                const Icon = reason.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35 }}
                    className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xl relative group"
                  >
                    {/* Attractive Image Container */}
                    <div className="relative h-72 sm:h-96 w-full overflow-hidden">
                      <img
                        src={reason.image}
                        alt={reason.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Interactive Highlight Pill on Image */}
                      <div className="absolute top-5 left-5 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-neutral-200 text-xs text-neutral-900 font-bold uppercase tracking-wider flex items-center gap-2 shadow-md">
                        <Icon className="w-4 h-4 text-[#B8860B]" />
                        <span>{reason.highlight}</span>
                      </div>
                    </div>

                    {/* Detailed Content Panel below image */}
                    <div className="p-7 sm:p-9">
                      <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 uppercase tracking-tight">
                        {reason.title}
                      </h3>
                      <p className="mt-3 text-sm sm:text-base text-neutral-600 font-medium leading-relaxed">
                        {reason.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Modern Comforts Interactive Grid */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-[0.2em] text-[#B8860B] font-bold">
              All-Inclusive Luxury Amenities
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 uppercase mt-2">
              Modern <span className="text-gold-gradient">Comforts</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {modernComforts.map((comfort, i) => {
              const Icon = comfort.icon;
              return (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-[#B8860B]/60 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#B8860B] group-hover:scale-110 transition-transform mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-neutral-800 group-hover:text-[#B8860B] transition-colors">
                    {comfort.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
