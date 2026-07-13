'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { REVIEWS_DATA, ReviewItem } from '@/data/reviewsData';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Quote,
  Pause,
  Play,
  CheckCircle2,
} from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Auto-scroll loop every 4.5 seconds
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      scrollNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, activeCardIndex]);

  const scrollNext = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth >= 768 ? 420 : 320;
    if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 20) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
      setActiveCardIndex(0);
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setActiveCardIndex((prev) => (prev + 1) % REVIEWS_DATA.length);
    }
  };

  const scrollPrev = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth >= 768 ? 420 : 320;
    if (container.scrollLeft <= 20) {
      container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
      setActiveCardIndex(REVIEWS_DATA.length - 1);
    } else {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setActiveCardIndex((prev) => (prev - 1 + REVIEWS_DATA.length) % REVIEWS_DATA.length);
    }
  };

  return (
    <section
      id="reviews"
      className="py-24 bg-[#F8F7F4] border-y border-neutral-200 relative overflow-hidden"
    >
      {/* Background Subtle Divine Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-100/50 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#B8860B] text-xs font-bold tracking-[0.2em] uppercase mb-3">
              Verified Pilgrim Stories &amp; Testimonials
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 uppercase">
              Guest <span className="text-gold-gradient">Reviews</span> &amp; Praise
            </h2>
            <p className="mt-4 text-sm sm:text-base text-neutral-600 font-medium">
              Interactive scrolling testimonials from family groups, NRI visitors, and devotional seekers who experienced luxury living at PS Elite Homestay.
            </p>
          </div>

          {/* Interactive Scroll Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              title={isAutoPlaying ? 'Pause Auto-Scroll' : 'Resume Auto-Scroll'}
              className="p-3 rounded-xl bg-white hover:bg-amber-50 border border-neutral-200 hover:border-[#B8860B] text-neutral-700 hover:text-[#B8860B] transition-all shadow-sm"
            >
              {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <button
              onClick={() => {
                setIsAutoPlaying(false);
                scrollPrev();
              }}
              className="p-3 rounded-xl bg-white hover:bg-amber-50 border border-neutral-200 hover:border-[#B8860B] text-neutral-700 hover:text-[#B8860B] transition-all flex items-center justify-center shadow-sm"
              aria-label="Previous Review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setIsAutoPlaying(false);
                scrollNext();
              }}
              className="p-3 rounded-xl bg-white hover:bg-amber-50 border border-neutral-200 hover:border-[#B8860B] text-neutral-700 hover:text-[#B8860B] transition-all flex items-center justify-center shadow-sm"
              aria-label="Next Review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrolling Reviews Track */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#B8860B]/40 scrollbar-track-neutral-100"
          style={{ scrollBehavior: 'smooth' }}
        >
          {REVIEWS_DATA.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="flex-shrink-0 w-[88vw] sm:w-[410px] lg:w-[440px] snap-start bg-white p-7 sm:p-8 rounded-3xl border border-neutral-200 hover:border-[#B8860B]/60 transition-all duration-300 flex flex-col justify-between relative group shadow-md hover:shadow-xl"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-[#B8860B]/15 group-hover:text-[#B8860B]/30 transition-colors pointer-events-none" />

              <div>
                {/* Rating & Verified Tag */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#B8860B] fill-[#B8860B]" />
                    ))}
                  </div>

                  {review.verified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-700 font-bold tracking-wider uppercase">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified Stay
                    </span>
                  )}
                </div>

                {/* Comment */}
                <p className="text-sm sm:text-base text-neutral-800 font-medium leading-relaxed italic mb-6">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              {/* Author & Room Details */}
              <div className="border-t border-neutral-200 pt-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={review.avatarUrl}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#B8860B]"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 leading-tight">
                      {review.name}
                    </h3>
                    <p className="text-[11px] text-neutral-600 font-medium">{review.origin}</p>
                    <p className="text-[11px] text-[#B8860B] font-bold mt-0.5">
                      {review.pilgrimType}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Stayed in</span>
                  <span className="text-xs font-bold text-neutral-900 block truncate max-w-[140px]">
                    {review.roomBooked}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-medium">{review.stayDate}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll Progress Bar / Indicator */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {REVIEWS_DATA.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsAutoPlaying(false);
                if (scrollRef.current) {
                  const cardWidth = scrollRef.current.clientWidth >= 768 ? 440 : 340;
                  scrollRef.current.scrollTo({ left: idx * (cardWidth + 24), behavior: 'smooth' });
                  setActiveCardIndex(idx);
                }
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeCardIndex
                  ? 'w-8 bg-[#B8860B]'
                  : 'w-2 bg-neutral-300 hover:bg-neutral-400'
              }`}
            />
          ))}
        </div>

        {/* Official Google Review CTA Banner */}
        <div className="mt-14 max-w-2xl mx-auto bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 fill-[#B8860B] text-[#B8860B]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                Stayed at PS Elite Homestay?
              </h4>
              <p className="text-xs text-neutral-600">
                Share your Tirupati Stay experience on Google Maps to help fellow pilgrim families.
              </p>
            </div>
          </div>
          <a
            href="https://g.page/r/CUrLKvmEc7ihEAE/review"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>Write a Google Review</span>
            <span>⭐</span>
          </a>
        </div>
      </div>
    </section>
  );
};
