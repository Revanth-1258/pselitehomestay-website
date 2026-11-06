'use client';

import React from 'react';
import Link from 'next/link';
import { Crown, MapPin, Phone, Mail, Clock, ExternalLink, MessageCircle, Navigation, Globe } from 'lucide-react';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const YouTubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10 text-neutral-300 pt-16 pb-10" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Proximity */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                  loading="lazy"
                  decoding="async"
                src="/ps-elite-logo-96.webp" width={40} height={40}
                alt="PS Elite Logo"
                className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]"
              />
              <span className="text-lg font-light tracking-[0.22em] uppercase text-white">
                PS Elite <span className="font-semibold text-gold-gradient">Homestay</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed mb-6">
              Experience serene luxury living minutes from Tirumala sacred hills. Featuring designer deluxe rooms, pilgrim family suites, modular 1BHK/2BHK apartments, and our signature Penthouse.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#D4AF37] bg-[#B8860B]/10 px-3 py-1.5 rounded-full border border-[#B8860B]/30 w-fit">
              <Clock className="w-3.5 h-3.5" />
              <span>Only 8 Mins to Alipiri Footpath &amp; Padmavathi Ammavari Temple, Tiruchanoor</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-5">
              Explore Residence
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/#rooms" className="hover:text-white transition-colors">
                  Standard &amp; Deluxe Rooms
                </Link>
              </li>
              <li>
                <Link href="/#rooms" className="hover:text-white transition-colors">
                  1 BHK &amp; 2 BHK Family Apartments
                </Link>
              </li>
              <li>
                <Link href="/#rooms" className="hover:text-white transition-colors">
                  PS Elite Penthouse
                </Link>
              </li>
              <li>
                <Link href="/#location" className="hover:text-white transition-colors">
                  Live Map &amp; Directions
                </Link>
              </li>
              <li>
                <Link href="/#amenities" className="hover:text-white transition-colors">
                  Luxury Amenities &amp; WiFi
                </Link>
              </li>
              <li>
                <Link href="/#discover-tirupati" className="hover:text-white transition-colors">
                  Discover Tirupati Attractions
                </Link>
              </li>
              <li>
                <Link href="/#customer-gallery" className="hover:text-white transition-colors">
                  Customer Video Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-5">
              Contact
            </h4>
            <ul className="space-y-3.5 text-xs text-neutral-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <address className="not-italic">
                  19-4-9/D/9A, Air Bypass Rd, behind Easy Buy, STV Nagar, Tirupati, Andhra Pradesh 517501, India
                </address>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <div className="flex flex-col gap-1 font-mono">
                  <a href="tel:+919392739715" className="inline-block py-1.5 text-white hover:text-[#D4AF37] font-bold transition-colors">
                    +91 93927 39715
                  </a>
                  <a href="tel:+919440311716" className="inline-block py-1.5 text-neutral-400 hover:text-white transition-colors">
                    +91 94403 11716
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href="mailto:pselitehomestays@gmail.com" className="hover:text-white transition-colors font-mono text-white">
                  pselitehomestays@gmail.com
                </a>
              </li>
            </ul>
            <div className="mt-5">
              <a
                href="https://wa.me/919392739715?text=Hello%20PS%20Elite%20Homestay,%20I%20would%20like%20to%20inquire%20about%20a%20stay."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/40 text-xs font-semibold hover:bg-[#25D366]/25 transition-all shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Chat</span>
              </a>
            </div>
          </div>

          {/* Col 4: Interactive Live Google Map Preview */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37] mb-5 flex items-center justify-between">
              <span>Location Map Preview</span>
              <span className="text-[10px] text-emerald-400 font-normal">Live Navigation</span>
            </h4>
            <div className="rounded-xl overflow-hidden border border-white/15 glass-panel p-2">
              <div className="relative h-44 w-full rounded-lg overflow-hidden bg-neutral-900">
                <iframe
                  title="PS Elite Homestay Footer Interactive Map"
                  src="https://maps.google.com/maps?q=PS+Elite+Homestay,+Air+Bypass+Rd,+STV+Nagar,+Tirupati,+Andhra+Pradesh+517501&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 filter contrast-125 saturate-110"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Action Navigation Buttons */}
              <div className="mt-2.5 space-y-1.5">
                <a
                  href="https://www.google.com/maps/dir//19-4-9%2FD%2F9A,+Air+Bypass+Road,+STV+Nagar,+Tirupati,+Andhra+Pradesh+517501"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:opacity-95 transition-all shadow"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Start Live GPS Navigation</span>
                </a>

                <Link
                  href="/#location"
                  className="w-full py-1.5 px-3 rounded-lg border border-white/15 bg-neutral-900 text-neutral-200 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all block text-center"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>View Exact Landmark Guide</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Social Icons & Copyright Bar (CharterStays Reference Style) */}
        <div className="pt-10 flex flex-col items-center justify-center gap-6">
          {/* Clickable Social & Media Icons */}
          <div className="flex items-center justify-center gap-5">
            <a
              href="https://instagram.com/ps_elite_homestay"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-11 h-11 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white hover:border-[#D4AF37] hover:text-[#D4AF37] hover:scale-110 transition-all shadow-md"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>

            <a
              href="https://wa.me/919392739715"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="w-11 h-11 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white hover:border-[#25D366] hover:text-[#25D366] hover:scale-110 transition-all shadow-md"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
            </a>

            <a
              href="https://www.youtube.com/@PSEliteHomestay"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube Channel"
              className="w-11 h-11 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-white hover:border-red-500 hover:text-red-500 hover:scale-110 transition-all shadow-md"
            >
              <YouTubeIcon className="w-5 h-5" />
            </a>
          </div>

          {/* Copyright Centered Below Icons */}
          <p className="text-[11px] text-neutral-400 text-center">
            &copy; 2026 PS Elite Homestay. All rights reserved. Premium Luxury Pilgrimage Sanctuary.
          </p>
        </div>
      </div>
    </footer>
  );
};
