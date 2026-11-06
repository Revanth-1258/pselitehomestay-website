'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Crown, ShieldAlert, CalendarCheck, PhoneCall } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { rooms, openBookingModalWithRoom } = useBooking();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Rooms & Suites', href: '/#rooms' },
    { label: 'Amenities', href: '/#amenities' },
    { label: 'Why Us', href: '/#why-us' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'Customer Gallery', href: '/#customer-gallery' },
    { label: 'Discover Tirupati', href: '/#discover-tirupati' },
    { label: 'Contact', href: '/#location' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md py-3 shadow-md border-b border-neutral-200/80'
          : 'bg-white/90 backdrop-blur-sm py-3.5 border-b border-neutral-200/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Luxury Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <img
            src="/ps-elite-logo-96.webp" width={40} height={40}
            alt="PS Elite Homestay Logo"
            className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
          />
          <div>
            <span className="block text-sm sm:text-base font-bold tracking-[0.16em] uppercase text-neutral-900 leading-tight">
              PS Elite
            </span>
            <span className="block text-[9px] tracking-[0.22em] uppercase text-[#B8860B] font-semibold">
              Homestay &bull; Tirupati
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[11px] xl:text-xs font-bold tracking-wider uppercase text-neutral-700 hover:text-[#B8860B] transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Book Now Gold CTA */}
          <button
            onClick={() => openBookingModalWithRoom(rooms[0])}
            className="relative group overflow-hidden rounded-full px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-xs tracking-wider uppercase shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4" />
              Book Now
            </span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 text-neutral-800 hover:text-[#B8860B]"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="xl:hidden bg-white border-b border-neutral-200 px-6 py-6 mt-3 space-y-4 shadow-xl"
          >
            <div className="grid grid-cols-2 gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-semibold uppercase tracking-wider text-neutral-800 py-2 border-b border-neutral-100 hover:text-[#B8860B]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="pt-3 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openBookingModalWithRoom(rooms[0]);
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg"
              >
                <CalendarCheck className="w-4 h-4" />
                Book Your Stay Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
