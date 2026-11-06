'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GALLERY_PHOTOS, GALLERY_CATEGORIES, GalleryPhoto } from '@/data/galleryData';
import { Maximize2, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export const MasonryGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxPhoto, setLightboxPhoto] = useState<GalleryPhoto | null>(null);

  const filteredPhotos =
    activeCategory === 'All'
      ? GALLERY_PHOTOS
      : GALLERY_PHOTOS.filter((p) => p.category === activeCategory);

  const currentIndex = lightboxPhoto
    ? filteredPhotos.findIndex((p) => p.id === lightboxPhoto.id)
    : -1;

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentIndex < filteredPhotos.length - 1) {
      setLightboxPhoto(filteredPhotos[currentIndex + 1]);
    } else {
      setLightboxPhoto(filteredPhotos[0]);
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (currentIndex > 0) {
      setLightboxPhoto(filteredPhotos[currentIndex - 1]);
    } else {
      setLightboxPhoto(filteredPhotos[filteredPhotos.length - 1]);
    }
  };

  return (
    <section id="gallery" className="py-24 bg-[#0A0A0A] border-y border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#B8860B]/15 border border-[#B8860B]/40 text-[#D4AF37] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            Explore Residence Interiors
          </span>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white uppercase">
            Building &amp; <span className="font-semibold text-gold-gradient">Rooms Gallery</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-400 font-light">
            Explore high-definition photos of our luxury bedrooms, living lounges, penthouse terrace, and scenic Tirumala hill views.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {GALLERY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all border ${
                  activeCategory === cat
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black border-[#B8860B] shadow-lg'
                    : 'border-white/15 text-neutral-300 hover:border-[#D4AF37] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Pinterest Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              onClick={() => setLightboxPhoto(photo)}
              className="group relative rounded-2xl overflow-hidden border border-white/10 cursor-pointer break-inside-avoid bg-neutral-900"
            >
              <img
                  loading="lazy"
                  decoding="async"
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6" />

              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#B8860B]/80 text-black text-[10px] font-bold uppercase tracking-wider mb-2">
                  {photo.category}
                </span>
                <h3 className="text-base font-semibold text-white">{photo.title}</h3>
                <p className="text-xs text-neutral-300 mt-1 line-clamp-2">{photo.description}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Expand Photo</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-lg flex items-center justify-center p-4"
            onClick={() => setLightboxPhoto(null)}
          >
            {/* Close */}
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-6 right-6 z-30 w-10 h-10 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-[#B8860B]"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev */}
            <button
              aria-label="Previous photo"
              onClick={handlePrev}
              className="absolute left-4 z-30 w-12 h-12 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next */}
            <button
              aria-label="Next photo"
              onClick={handleNext}
              className="absolute right-4 z-30 w-12 h-12 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:border-[#D4AF37] hover:text-[#D4AF37]"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-5xl max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                  loading="lazy"
                  decoding="async"
                src={lightboxPhoto.imageUrl}
                alt={lightboxPhoto.title}
                className="max-h-[70vh] rounded-2xl object-contain border border-white/20 shadow-2xl"
              />
              <div className="mt-4 text-center max-w-xl">
                <span className="inline-block px-3 py-1 rounded-full bg-[#B8860B]/20 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-2">
                  {lightboxPhoto.category}
                </span>
                <h3 className="text-xl font-light text-white">{lightboxPhoto.title}</h3>
                <p className="text-xs text-neutral-400 mt-1">{lightboxPhoto.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
