'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Maximize2,
  BedDouble,
  Play,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  CalendarCheck,
  Eye,
  Film,
} from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { RoomType } from '@/data/roomsData';

interface RoomCardProps {
  room: RoomType;
  onWatchVideo: (room: RoomType) => void;
  onBookNow: (room: RoomType) => void;
  onDetails: (room: RoomType) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  onWatchVideo,
  onBookNow,
  onDetails,
}) => {
  const images = room.gallery && room.gallery.length > 0 ? room.gallery : [room.image];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 40) {
      setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    } else if (diff < -40) {
      setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
    setTouchStart(null);
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col group">
      {/* Swipeable Image Gallery Carousel */}
      <div
        className="relative h-72 sm:h-80 overflow-hidden bg-neutral-900 select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[currentIdx]}
          alt={`${room.name} photo ${currentIdx + 1}`}
          className="w-full h-full object-cover transition-all duration-500"
        />

        {/* Top-Left Crisp Price Badge */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md z-10 border border-neutral-100">
          <span className="text-xs sm:text-sm font-extrabold text-neutral-900 tracking-wide">
            ₹{room.pricePerNight.toLocaleString()}{' '}
            <span className="text-[10px] text-neutral-500 font-bold uppercase">/ Night</span>
          </span>
        </div>

        {/* Top-Right Category / Popular Badge */}
        {room.isPopular && (
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider shadow-lg border border-[#D4AF37]/40">
            Pilgrim Choice
          </div>
        )}

        {/* Left / Right Carousel Arrow Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 z-10 shadow-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 z-10 shadow-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Dot Indicators at Bottom of Photo */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIdx(i);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentIdx ? 'w-5 bg-[#D4AF37]' : 'w-1.5 bg-white/60 hover:bg-white'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-bold text-neutral-900 group-hover:text-[#B8860B] transition-colors leading-snug">
              {room.name}
            </h3>
          </div>
          <p className="text-xs text-neutral-600 font-medium mt-1.5 line-clamp-2">
            {room.tagline}
          </p>

          {/* Clean Horizontal Specs Bar */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-neutral-700 border-b border-neutral-200 pb-4">
            <div className="flex items-center gap-1.5 bg-neutral-100 px-2.5 py-1 rounded-lg">
              <Users className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>{room.guests} Guests</span>
            </div>
            <div className="flex items-center gap-1.5 bg-neutral-100 px-2.5 py-1 rounded-lg">
              <BedDouble className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>{room.bedrooms} Bed</span>
            </div>
            <div className="flex items-center gap-1.5 bg-neutral-100 px-2.5 py-1 rounded-lg">
              <Maximize2 className="w-3.5 h-3.5 text-[#B8860B]" />
              <span>{room.bathrooms} Bath</span>
            </div>
          </div>

          {/* Key Room Features */}
          <div className="mt-3.5 space-y-1.5">
            {room.highlights.slice(0, 3).map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-medium text-neutral-700">
                <Sparkles className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
                <span className="truncate">{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons Row matching User UI Reference */}
        <div className="mt-6 pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center gap-2.5">
          {/* Watch Video Button */}
          {room.videoUrl && (
            <button
              onClick={() => onWatchVideo(room)}
              className="w-full sm:w-1/2 py-2.5 px-3 rounded-xl border-2 border-rose-600/80 bg-rose-50/70 hover:bg-rose-600 hover:text-white text-rose-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch Video</span>
            </button>
          )}

          {/* Book Now Button */}
          <button
            onClick={() => onBookNow(room)}
            className={`${
              room.videoUrl ? 'w-full sm:w-1/2' : 'w-full'
            } py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#B8860B] hover:opacity-95 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md transition-all`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Book Now</span>
          </button>
        </div>

        {/* Details Link */}
        <button
          onClick={() => onDetails(room)}
          className="mt-2.5 w-full py-1.5 text-center text-xs font-semibold text-neutral-500 hover:text-[#B8860B] transition-colors flex items-center justify-center gap-1"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Complete Room Amenities & Specs</span>
        </button>
      </div>
    </div>
  );
};

export const RoomsSection: React.FC = () => {
  const { rooms, openBookingModalWithRoom, openRoomDetail } = useBooking();
  const [activeVideoRoom, setActiveVideoRoom] = useState<RoomType | null>(null);

  return (
    <section id="rooms" className="py-24 bg-[#ECEBE7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-14">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-[#B8860B] text-xs font-bold tracking-[0.2em] uppercase mb-3 shadow-sm">
            Tirupati Pilgrim Accommodations
          </span>

          {/* SINGLE HEADING: Room Types and Prices replacing subtabs */}
          <div className="mt-2 inline-block bg-white/90 border border-neutral-300/80 px-8 py-4 rounded-3xl shadow-md">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 uppercase">
              Room Types <span className="text-gold-gradient">&amp; Prices</span>
            </h2>
          </div>

          <p className="mt-5 text-sm sm:text-base text-neutral-700 font-medium max-w-2xl mx-auto">
            Swipe through real photos of each sanctuary or click <span className="font-bold text-rose-700">Watch Video</span> for a live walk-through tour of our immaculate AC &amp; Non-AC rooms and spacious family apartments.
          </p>
        </div>

        {/* Accommodation Cards Grid with Swipe Gallery & Video CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onWatchVideo={(r) => setActiveVideoRoom(r)}
              onBookNow={(r) => openBookingModalWithRoom(r)}
              onDetails={(r) => openRoomDetail(r)}
            />
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {activeVideoRoom && activeVideoRoom.videoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6"
            onClick={() => setActiveVideoRoom(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-neutral-950 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {activeVideoRoom.name}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      ₹{activeVideoRoom.pricePerNight.toLocaleString()} / Night • Live Video Tour
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveVideoRoom(null)}
                  className="p-2 rounded-full bg-neutral-800 hover:bg-rose-600 text-neutral-300 hover:text-white transition-all"
                  aria-label="Close Video"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Player Container */}
              <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                <video
                  src={activeVideoRoom.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Bottom Book Now Bar in Video Modal */}
              <div className="px-6 py-4 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-xs sm:text-sm text-neutral-300 font-medium">
                  Ready to reserve {activeVideoRoom.name}?
                </span>
                <button
                  onClick={() => {
                    const r = activeVideoRoom;
                    setActiveVideoRoom(null);
                    openBookingModalWithRoom(r);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-extrabold text-xs uppercase tracking-wider shadow-lg hover:opacity-90 transition-all flex items-center gap-1.5"
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Book This Room Now</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
