'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Sparkles, MapPin } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  badge?: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    badge: 'Proximity & Location',
    question: 'How far is PS Elite Homestay from Tirupati Railway Station, Bus Stand, Padmavathi Temple & Alipiri?',
    answer:
      'PS Elite Homestay is centrally located on Air Bypass Road (STV Nagar): just 1.4 km from Tirupati Bus Stand, 1.5 km from Tirupati Railway Station, 3.5 km from the famous Padmavathi Ammavari Temple (Tiruchanur), and only an 8-minute drive to the Alipiri Footpath entry gate to Tirumala sacred hills.',
  },
  {
    badge: 'Stays & Pricing',
    question: 'Do you offer budget-friendly rooms as well as luxury family apartments?',
    answer:
      'Yes! We cater to all travelers—from solo pilgrims and couples seeking our spotless Budget & Standard AC/Non-AC Rooms, to large families and groups desiring our spacious 1BHK & 2BHK Family Service Apartments or Signature Penthouse.',
  },
  {
    badge: 'Senior Citizen Comfort',
    question: 'Is elevator access available for elders and senior citizens?',
    answer:
      'Absolutely. We provide smooth, high-speed elevator access across all floors to ensure effortless mobility for elders, senior citizens, and luggage transport.',
  },
  {
    badge: 'Darshan Assistance',
    question: 'How do we contact the 24/7 Support Desk or book a stay instantly?',
    answer:
      'Our dedicated 24/7 check-in and travel support desk is available round the clock. You can book directly via WhatsApp or call our booking desk at +91 93927 39715 / +91 94403 11716 for instant confirmation.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-[#0F0F0F] relative overflow-hidden border-t border-white/10" id="faq">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Pilgrim &amp; Guest FAQs</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white uppercase">
            Frequently Asked <span className="font-semibold text-gold-gradient">Questions</span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
            Everything you need to know about our prime location, family rooms, senior citizen access, and darshan concierge.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? 'bg-white/[0.04] border-[#D4AF37]/50 shadow-[0_0_20px_rgba(212,175,55,0.1)]'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 focus:outline-none"
                >
                  <div>
                    {item.badge && (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-1.5">
                        {item.badge}
                      </span>
                    )}
                    <h3 className="text-sm sm:text-base font-semibold text-white leading-snug">
                      {item.question}
                    </h3>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-transform duration-300 ${
                      isOpen
                        ? 'bg-[#D4AF37] text-black border-[#D4AF37] rotate-180'
                        : 'bg-white/5 text-neutral-300 border-white/15'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 sm:px-6 pt-1 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-white/5">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Location Highlights Badges */}
        <div className="mt-12 p-5 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-wrap items-center justify-center gap-6 text-center text-xs text-neutral-300">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            <span><strong>1.4 km</strong> to Tirupati Bus Stand</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            <span><strong>1.5 km</strong> to Railway Station</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            <span><strong>3.5 km</strong> to Padmavathi Ammavari Temple</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            <span><strong>10 Mins</strong> to Alipiri Footpath</span>
          </div>
        </div>
      </div>
    </section>
  );
};
