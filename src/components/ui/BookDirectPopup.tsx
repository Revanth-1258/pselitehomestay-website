'use client';

import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BookDirectPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the popup
    const isDismissed = localStorage.getItem('pse_direct_popup_dismissed');
    if (isDismissed) return;

    // Show popup after 12 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 12000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('pse_direct_popup_dismissed', 'true');
  };

  const phoneUrl = 'tel:+919392739715';
  const whatsappUrl = 'https://wa.me/919392739715';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-24 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-[95] bg-[#121212]/95 border border-[#D4AF37]/40 backdrop-blur-md rounded-2xl shadow-2xl p-5 text-white print:hidden"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3.5 right-3.5 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-xl shrink-0">
              🎁
            </div>
            <div className="space-y-1.5 pr-4">
              <h4 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                Book Direct &amp; Save!
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Get an exclusive discount of up to <strong className="text-[#D4AF37]">15% Off</strong> when you reserve directly with us over call or WhatsApp.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-white/5 flex gap-2.5">
            <a
              href={phoneUrl}
              onClick={handleClose}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-extrabold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <Phone className="w-3 h-3 fill-current" />
              <span>Call Now</span>
            </a>
            <a
              href={whatsappUrl}
              onClick={handleClose}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 rounded-xl bg-[#25D366] text-white font-extrabold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <MessageCircle className="w-3 h-3 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
