'use client';

import React from 'react';
import { Phone, MessageCircle, MapPin } from 'lucide-react';

export const FloatingContactBar: React.FC = () => {
  const phoneUrl = 'tel:+919392739715';
  const whatsappUrl = 'https://wa.me/919392739715';
  const mapsUrl = 'https://www.google.com/maps/dir//19-4-9%2FD%2F9A,+Air+Bypass+Road,+STV+Nagar,+Tirupati,+Andhra+Pradesh+517501';

  return (
    <>
      {/* Mobile Floating Bar */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden z-[100] bg-black/85 backdrop-blur-lg border border-white/10 p-2.5 rounded-2xl shadow-2xl flex justify-around items-center gap-2">
        <a
          href={phoneUrl}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          <Phone className="w-3.5 h-3.5 fill-current" />
          <span>Call Now</span>
        </a>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] text-white font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-current" />
          <span>WhatsApp</span>
        </a>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 px-4 rounded-xl bg-neutral-800 text-white font-extrabold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 shadow-md active:scale-95 transition-all"
        >
          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Maps</span>
        </a>
      </div>

      {/* Desktop Floating Bar */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-3.5 z-[100]">
        {/* Call Now */}
        <div className="group relative">
          <a
            href={phoneUrl}
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-black flex items-center justify-center shadow-xl hover:shadow-[#B8860B]/50 hover:scale-110 transition-all duration-300"
          >
            <Phone className="w-5 h-5 fill-current" />
          </a>
          <div className="absolute right-14 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-[#D4AF37] text-xs font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto translate-x-2 group-hover:translate-x-0 transition-all duration-300 shadow-md">
            Call Now: +91 93927 39715
          </div>
        </div>

        {/* WhatsApp */}
        <div className="group relative">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl hover:shadow-[#25D366]/50 hover:scale-110 transition-all duration-300"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
          </a>
          <div className="absolute right-14 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-[#25D366] text-xs font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto translate-x-2 group-hover:translate-x-0 transition-all duration-300 shadow-md">
            Chat on WhatsApp
          </div>
        </div>

        {/* Google Maps Directions */}
        <div className="group relative">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-neutral-900 border border-white/15 text-white flex items-center justify-center shadow-xl hover:bg-neutral-800 hover:scale-110 transition-all duration-300"
          >
            <MapPin className="w-5 h-5 text-[#D4AF37]" />
          </a>
          <div className="absolute right-14 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs font-bold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto translate-x-2 group-hover:translate-x-0 transition-all duration-300 shadow-md">
            Google Maps Directions
          </div>
        </div>
      </div>
    </>
  );
};
