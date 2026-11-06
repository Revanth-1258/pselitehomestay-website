'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Heart, Star, Film, MessageCircleHeart } from 'lucide-react';

interface CustomerReviewVideo {
  id: string;
  guestName: string;
  stayType: string;
  videoUrl: string;
  thumbnailUrl: string;
  comment: string;
  rating: number;
}

const CUSTOMER_VIDEOS: CustomerReviewVideo[] = [
  {
    id: 'rev-1',
    guestName: 'Guests from Kerala',
    stayType: '2BHK Family Double Room',
    videoUrl: '/videos/customer-review-1.mp4',
    thumbnailUrl: '/images/reviews/review-thumb-1.webp',
    comment: 'Wonderful family stay just minutes from Alipiri Footpath! Exceptional hygiene and helpful concierge.',
    rating: 5,
  },
  {
    id: 'rev-2',
    guestName: 'Guests from North',
    stayType: 'Superior Terrace 1BHK',
    videoUrl: '/videos/customer-review-2.mp4',
    thumbnailUrl: '/images/reviews/review-thumb-2.webp',
    comment: 'Guest reviews that speak for us! Comfort, care, and memorable stays in Tirupati.',
    rating: 5,
  },
  {
    id: 'rev-3',
    guestName: 'Surendra & Family',
    stayType: 'Deluxe King Room',
    videoUrl: '/videos/customer-review-3.mp4',
    thumbnailUrl: '/images/reviews/review-thumb-3.webp',
    comment: 'Thank you PS Elite Homestay for making our pilgrimage so comfortable. Loved the spacious rooms!',
    rating: 5,
  },
  {
    id: 'rev-4',
    guestName: 'Couple from Italy',
    stayType: 'Standard AC Room',
    videoUrl: '/videos/customer-review-4.mp4',
    thumbnailUrl: '/images/reviews/review-thumb-4.webp',
    comment: 'Peaceful mornings, warm smiles, happy guests and unforgettable memories at PS Elite Homestay.',
    rating: 5,
  },
  {
    id: 'rev-5',
    guestName: 'Rajesh & Family',
    stayType: 'PS Elite Penthouse',
    videoUrl: '/videos/customer-review-5.mp4',
    thumbnailUrl: '/images/reviews/review-thumb-5.webp',
    comment: 'Amazing scenic views from the terrace and truly premium service throughout our stay.',
    rating: 5,
  },
  {
    id: 'rev-6',
    guestName: 'Kameshwaramma & Elder Couple',
    stayType: '2BHK Family Suite',
    videoUrl: '/videos/customer-review-6.mp4',
    thumbnailUrl: '/images/reviews/review-thumb-6.webp',
    comment: 'Customer love alert! So thrilled with our stay. Clean rooms, great staff, and easy temple darshan access.',
    rating: 5,
  },
];

export const CustomerGallerySection: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<CustomerReviewVideo | null>(null);

  return (
    <section id="customer-gallery" className="py-24 bg-[#F8F7F4] text-neutral-900 relative border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header inspired by user screenshot */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block px-3.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-[#8C6514] text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Real Guest Experiences
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900">
            Customer <span className="text-gold-gradient">Gallery</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-600 font-medium">
            Moments captured by our guests during their stay — Click on any story to watch our real guest video reviews.
          </p>
        </div>

        {/* Video Cards Grid matching charter stays / review layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CUSTOMER_VIDEOS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="group relative rounded-3xl overflow-hidden bg-white border border-neutral-200 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col"
              onClick={() => setActiveVideo(item)}
            >
              {/* Thumbnail / Video Preview Box */}
              <div className="relative h-72 sm:h-80 overflow-hidden bg-neutral-900">
                <img
                  loading="lazy"
                  decoding="async"
                  src={item.thumbnailUrl}
                  alt={item.guestName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />

                {/* Top-Right Pill Badge */}
                <div className="absolute top-4 right-4 bg-[#D4AF37] text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Story</span>
                </div>

                {/* Center Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37] text-[#D4AF37] group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:text-black transition-all flex items-center justify-center shadow-2xl">
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </div>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 text-white">
                  <div className="flex items-center gap-1 text-amber-400 mb-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    {item.guestName}
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1 line-clamp-2">
                    &ldquo;{item.comment}&rdquo;
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-3xl bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 bg-neutral-950 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <MessageCircleHeart className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {activeVideo.guestName}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Stayed in: {activeVideo.stayType}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-2 rounded-full bg-neutral-800 hover:bg-rose-600 text-neutral-300 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Container */}
              <div className="relative aspect-[9/16] sm:aspect-video max-h-[75vh] w-full bg-black flex items-center justify-center">
                <video
                  src={activeVideo.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
