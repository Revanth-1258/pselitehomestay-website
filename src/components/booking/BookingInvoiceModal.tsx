'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, Download, CheckCircle2, Crown, MapPin, Calendar, Phone, Mail } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';

export const BookingInvoiceModal: React.FC = () => {
  const { isInvoiceModalOpen, setIsInvoiceModalOpen, currentBookingInvoice } = useBooking();

  if (!isInvoiceModalOpen || !currentBookingInvoice) return null;

  const invoice = currentBookingInvoice;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        onClick={() => setIsInvoiceModalOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto glass-panel rounded-2xl border border-[#B8860B]/60 shadow-2xl bg-[#111111] text-white p-6 md:p-10 print:bg-white print:text-black print:border-none print:shadow-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button (hidden in print) */}
          <button
            onClick={() => setIsInvoiceModalOpen(false)}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 border border-white/15 flex items-center justify-center text-neutral-300 hover:text-white print:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Confirmed Banner */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 mb-8 print:hidden">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <p className="text-sm font-semibold">Stay Receipt Ready!</p>
              <p className="text-xs text-emerald-300/80">
                Official reservation receipt for {invoice.guestName} ({invoice.guestPhone}).
              </p>
            </div>
          </div>

          {/* INVOICE PAPER */}
          <div className="bg-[#181818] rounded-xl p-6 md:p-8 border border-white/10 print:bg-white print:border-neutral-300 print:text-black">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-white/10 print:border-neutral-300 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                  <Crown className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="text-lg font-light tracking-[0.2em] uppercase text-white print:text-black">
                    PS Elite <span className="font-semibold text-[#D4AF37] print:text-[#B8860B]">Homestay</span>
                  </h3>
                  <p className="text-[10px] tracking-widest uppercase text-neutral-400 print:text-neutral-600">
                    No:19, 19-4-9/D/9A, Air Bypass Road, STV Nagar, Tirupati &bull; 517501
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="inline-block px-3 py-1 rounded-full bg-[#B8860B]/20 text-[#D4AF37] print:bg-neutral-100 print:text-black text-[10px] font-bold uppercase tracking-widest">
                  Official Stay Receipt
                </span>
                <p className="text-xs font-mono text-neutral-400 mt-1">
                  Booking ID: <strong className="text-white print:text-black">{invoice.bookingId}</strong>
                </p>
                <p className="text-[10px] text-neutral-500">
                  Issued: {new Date(invoice.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Guest & Room Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-white/10 print:border-neutral-300 text-xs">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-2">
                  Primary Guest Information
                </p>
                <p className="text-sm font-semibold text-white print:text-black">{invoice.guestName}</p>
                <p className="text-neutral-400 mt-1">{invoice.guestPhone}</p>
                <p className="text-neutral-400 mt-1">Total Guests: {invoice.guestsCount} Pilgrims</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-semibold mb-2">
                  Reserved Accommodation
                </p>
                <p className="text-sm font-semibold text-white print:text-black">{invoice.room.name}</p>
                <p className="text-neutral-400 mt-0.5">
                  Check-In: <strong className="text-white print:text-black">{invoice.checkIn}</strong> (After 12:00 PM)
                </p>
                <p className="text-neutral-400">
                  Check-Out: <strong className="text-white print:text-black">{invoice.checkOut}</strong> (Before 11:00 AM)
                </p>
                <p className="text-neutral-400 mt-1">Duration: {invoice.nights} Night(s)</p>
              </div>
            </div>

            {/* Itemized Billing Table */}
            <div className="py-6">
              <h4 className="text-[10px] uppercase tracking-widest text-neutral-400 mb-3">
                Itemized Stay Invoice
              </h4>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10 print:border-neutral-300 text-neutral-400 text-left">
                    <th className="pb-2">Description</th>
                    <th className="pb-2 text-right">Rate</th>
                    <th className="pb-2 text-right">Qty</th>
                    <th className="pb-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 print:divide-neutral-200">
                  <tr>
                    <td className="py-3 font-medium text-white print:text-black">
                      {invoice.room.name} ({invoice.nights} nights)
                    </td>
                    <td className="py-3 text-right font-mono">₹{invoice.room.pricePerNight.toLocaleString()}</td>
                    <td className="py-3 text-right">{invoice.nights}</td>
                    <td className="py-3 text-right font-mono">
                      ₹{(invoice.room.pricePerNight * invoice.nights).toLocaleString()}
                    </td>
                  </tr>
                  {invoice.needTemplePickup && (
                    <tr>
                      <td className="py-3 font-medium text-white print:text-black">
                        Tirupati Airport / Station VIP Cab &amp; Alipiri Drop
                      </td>
                      <td className="py-3 text-right font-mono">₹1,200</td>
                      <td className="py-3 text-right">1</td>
                      <td className="py-3 text-right font-mono">₹1,200</td>
                    </tr>
                  )}
                  {invoice.needExtraBed && (
                    <tr>
                      <td className="py-3 font-medium text-white print:text-black">
                        Extra Orthopaedic Folding Bed ({invoice.nights} nights)
                      </td>
                      <td className="py-3 text-right font-mono">₹800</td>
                      <td className="py-3 text-right">{invoice.nights}</td>
                      <td className="py-3 text-right font-mono">
                        ₹{(800 * invoice.nights).toLocaleString()}
                      </td>
                    </tr>
                  )}
                  {invoice.discountAmount > 0 && (
                    <tr>
                      <td className="py-3 text-emerald-400 font-medium">
                        Promo Coupon Applied ({invoice.couponCode})
                      </td>
                      <td className="py-3 text-right font-mono">—</td>
                      <td className="py-3 text-right">1</td>
                      <td className="py-3 text-right font-mono text-emerald-400">
                        -₹{invoice.discountAmount.toLocaleString()}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Totals Box */}
              <div className="mt-6 pt-4 border-t border-white/10 print:border-neutral-300 flex flex-col items-end space-y-1.5 text-xs">
                <div className="flex justify-between w-64 text-neutral-400">
                  <span>Taxable Subtotal:</span>
                  <span className="font-mono">₹{invoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-64 text-neutral-400">
                  <span>GST Luxury Stay Tax (12%):</span>
                  <span className="font-mono">₹{invoice.gstTaxes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between w-64 pt-2 border-t border-white/10 print:border-neutral-300 text-sm font-bold text-white print:text-black">
                  <span>Total Stay Value:</span>
                  <span className="text-lg font-mono text-[#D4AF37] print:text-black">
                    ₹{invoice.totalAmount.toLocaleString()}
                  </span>
                </div>
                {invoice.advancePaid && invoice.advancePaid > 0 ? (
                  <>
                    <div className="flex justify-between w-64 text-emerald-400 font-bold">
                      <span>Online Payment Verified:</span>
                      <span className="font-mono">₹{invoice.advancePaid.toLocaleString()}</span>
                    </div>
                    {invoice.balanceDue !== undefined && invoice.balanceDue > 0 && (
                      <div className="flex justify-between w-64 text-amber-400 font-semibold">
                        <span>Balance Due at Check-In:</span>
                        <span className="font-mono">₹{invoice.balanceDue.toLocaleString()}</span>
                      </div>
                    )}
                  </>
                ) : null}
                {invoice.paymentMethod && (
                  <div className="text-right pt-1 text-[11px] text-neutral-400 print:text-neutral-600">
                    <p>Payment Plan: <span className="text-[#D4AF37] font-semibold print:text-black">{invoice.paymentMethod}</span></p>
                    {invoice.utrNumber && <p className="font-mono text-emerald-400 font-bold">UTR Ref: {invoice.utrNumber} ✅</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Note */}
            <div className="pt-6 border-t border-white/10 print:border-neutral-300 text-[11px] text-neutral-400 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <p className="font-semibold text-[#D4AF37] print:text-black">
                  Concierge Support &amp; Temple Assistance:
                </p>
                <p>Call / WhatsApp: +91 93927 39715 / +91 94403 11716 &bull; Email: pselitehomestays@gmail.com</p>
              </div>
              <div className="text-center sm:text-right">
                <p className="italic">Authorized PS Elite Digital Signature</p>
                <p className="text-[10px] uppercase tracking-widest text-neutral-500">Verified Homestay</p>
              </div>
            </div>
          </div>

          {/* Action buttons (hidden in print) */}
          <div className="mt-6 flex flex-wrap justify-between items-center gap-3 print:hidden">
            <button
              type="button"
              onClick={() => {
                const waText = `*🌟 PS ELITE HOMESTAY — OFFICIAL BOOKING RECEIPT 🌟*\n\n*Booking ID:* ${invoice.bookingId}\n*Guest Name:* ${invoice.guestName}\n*Phone Number:* ${invoice.guestPhone}\n*Suite Reserved:* ${invoice.room.name}\n*Check-in:* ${invoice.checkIn} | *Check-out:* ${invoice.checkOut}\n*Total Stay Value:* ₹${invoice.totalAmount.toLocaleString()}\n*Payment Status:* ${invoice.paymentMethod || 'Confirmed'}\n*UTR / Transaction Reference:* ${invoice.utrNumber || 'Settle at Check-In'}\n\n_Please confirm receipt of this stay receipt._`;
                window.open(
                  `https://wa.me/919392739715?text=${encodeURIComponent(waText)}`,
                  '_blank'
                );
              }}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-lg shadow-emerald-600/30 transition-all"
            >
              <span className="text-base">📲</span>
              <span>Send Receipt to Homestay WhatsApp</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsInvoiceModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-white/20 text-xs font-medium uppercase tracking-wider text-neutral-300 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={handlePrint}
                className="px-6 py-2.5 rounded-xl bg-[#B8860B]/20 border border-[#B8860B] text-[#D4AF37] font-semibold text-xs uppercase tracking-wider hover:bg-[#B8860B]/30 flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print / PDF Receipt</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
