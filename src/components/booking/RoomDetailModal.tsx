'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Users, Maximize2, BedDouble, Bath, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';

export const RoomDetailModal: React.FC = () => {
  const { isRoomDetailOpen, selectedRoomForDetail, closeRoomDetail, openBookingModalWithRoom } = useBooking();
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!isRoomDetailOpen || !selectedRoomForDetail) return null;

  const room = selectedRoomForDetail;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={closeRoomDetail}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel rounded-2xl border border-[#B8860B]/40 shadow-2xl text-neutral-900 p-6 md:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={closeRoomDetail}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-neutral-100/80 border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-black hover:border-[#B8860B] transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Category Badge */}
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-[#B8860B]/15 border border-[#B8860B]/40 text-[#D4AF37] text-xs font-semibold tracking-wider uppercase mb-2">
              {room.category === 'penthouse' ? 'Penthouse' : room.category === 'apartment' ? 'Luxury Apartment' : 'Deluxe Room'}
            </span>
            <h2 className="text-2xl md:text-3xl font-light tracking-wide text-neutral-900">
              {room.name}
            </h2>
            <p className="text-sm text-neutral-600 mt-1">{room.tagline}</p>
          </div>

          {/* Image Gallery Carousel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-3 relative rounded-xl overflow-hidden h-72 md:h-96 border border-white/10">
              <img
                src={room.gallery[activePhotoIdx] || room.image}
                alt={room.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-black/70 border border-white/20 text-xs text-white">
                  Photo {activePhotoIdx + 1} of {room.gallery.length}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible">
              {room.gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIdx(idx)}
                  className={`relative w-24 md:w-full h-20 md:h-28 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    activePhotoIdx === idx
                      ? 'border-[#D4AF37] scale-[1.02]'
                      : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Specs Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-[#F8F7F4]/90 border border-[#B8860B]/20 mb-8">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#B8860B]" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-500">Capacity</p>
                <p className="text-sm font-semibold text-neutral-900">Up to {room.guests} Guests</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Maximize2 className="w-5 h-5 text-[#B8860B]" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-500">Floor Area</p>
                <p className="text-sm font-semibold text-neutral-900">{room.areaSqFt} sq. ft.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BedDouble className="w-5 h-5 text-[#B8860B]" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-500">Bedrooms</p>
                <p className="text-sm font-semibold text-neutral-900">{room.bedrooms} Bedroom{room.bedrooms > 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Bath className="w-5 h-5 text-[#B8860B]" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-neutral-500">Bathrooms</p>
                <p className="text-sm font-semibold text-neutral-900">{room.bathrooms} Marble Bath{room.bathrooms > 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          {/* Description & Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2 space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-[#B8860B]">
                Sanctuary Overview
              </h3>
              <p className="text-sm text-neutral-700 leading-relaxed">
                {room.description}
              </p>

              <h3 className="text-sm font-semibold uppercase tracking-widest text-[#B8860B] pt-2">
                Included Amenities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {room.amenities.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs text-neutral-700">
                    <Check className="w-4 h-4 text-[#B8860B] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price & Action Panel */}
            <div className="glass-gold p-6 rounded-xl border border-[#B8860B]/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#B8860B]" />
                  <span className="text-[11px] uppercase tracking-wider text-neutral-600">
                    Verified Luxury Pricing
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-semibold text-neutral-900 font-mono">
                    ₹{room.pricePerNight.toLocaleString()}
                  </span>
                  <span className="text-xs text-neutral-500 line-through">
                    ₹{room.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-neutral-600">/ night</span>
                </div>
                <p className="text-[11px] text-neutral-600 mt-1">
                  Includes complimentary herbal tea kit &amp; high-speed WiFi.
                </p>

                <div className="mt-4 pt-4 border-t border-[#B8860B]/20 space-y-2">
                  {room.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700">
                      <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  closeRoomDetail();
                  openBookingModalWithRoom(room);
                }}
                className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-semibold text-xs tracking-widest uppercase hover:opacity-95 transition-all shadow-lg shadow-[#B8860B]/30 flex items-center justify-center gap-2"
              >
                <span>Reserve This Sanctuary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
