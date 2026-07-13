'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LuxuryLoader: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 400);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 8;
      });
    }, 90);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[99999] bg-[#0A0A0A] flex flex-col items-center justify-center px-4"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
        >
          {/* Subtle gold glow backdrop */}
          <div className="absolute w-96 h-96 bg-[#B8860B]/10 rounded-full blur-3xl pointer-events-none" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center relative z-10"
          >
            <div className="inline-block px-3 py-1 rounded-full border border-[#B8860B]/40 bg-[#B8860B]/10 text-[#D4AF37] text-xs font-medium tracking-widest uppercase mb-4">
              Tirumala Pilgrimage Sanctuary
            </div>
            <h1 className="text-3xl md:text-5xl font-light tracking-[0.2em] uppercase text-white mb-2">
              PS Elite <span className="font-semibold text-gold-gradient">Homestay</span>
            </h1>
            <p className="text-sm tracking-widest text-neutral-400 uppercase">
              Tirupati &bull; Andhra Pradesh
            </p>

            {/* Elegant Progress bar */}
            <div className="mt-8 w-56 mx-auto h-0.5 bg-neutral-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B]"
                style={{ width: `${Math.min(100, progress)}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
            <p className="mt-3 text-xs tracking-widest text-neutral-500 font-mono">
              {Math.min(100, progress)}%
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
