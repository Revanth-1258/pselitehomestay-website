'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Calendar,
  Users,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Download,
  AlertCircle,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBooking, BookingDetails } from '@/context/BookingContext';

export const BookingModal: React.FC = () => {
  const {
    isBookingModalOpen,
    setIsBookingModalOpen,
    selectedRoomForBooking,
    rooms,
    addBooking,
    setIsInvoiceModalOpen,
  } = useBooking();

  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [checkIn, setCheckIn] = useState('2026-07-17');
  const [checkOut, setCheckOut] = useState('2026-07-18');
  const [guestsCount, setGuestsCount] = useState(2);

  // Guest Form
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isWhatsAppSame, setIsWhatsAppSame] = useState(true);
  const [is18OrAbove, setIs18OrAbove] = useState(false);

  // Status
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState('');

  // Always determine current room & nights unconditionally for top-level Hooks
  const currentRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0];

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const nights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Dynamic price & date inventory check MUST be called before any conditional return
  const [dynamicPrice, setDynamicPrice] = useState<number>(currentRoom.pricePerNight);
  const [isRoomSoldOut, setIsRoomSoldOut] = useState<boolean>(false);

  useEffect(() => {
    if (selectedRoomForBooking) {
      setSelectedRoomId(selectedRoomForBooking.id);
      setGuestsCount(selectedRoomForBooking.guests || 2);
    }
  }, [selectedRoomForBooking]);

  const getRoomPriceForDate = (room: typeof currentRoom, targetDate: string) => {
    try {
      const dateInvRaw = localStorage.getItem('ps_date_inventory');
      if (dateInvRaw) {
        const dateInv = JSON.parse(dateInvRaw);
        const dayEntry = dateInv[targetDate]?.[room.id];
        if (dayEntry && dayEntry.rateOverride && Number(dayEntry.rateOverride) > 0) {
          return Number(dayEntry.rateOverride);
        }
      }
    } catch (err) {}
    return room.pricePerNight;
  };

  useEffect(() => {
    const refreshPricing = () => {
      let price = getRoomPriceForDate(currentRoom, checkIn);
      let soldOut = false;
      try {
        const dateInvRaw = localStorage.getItem('ps_date_inventory');
        if (dateInvRaw) {
          const dateInv = JSON.parse(dateInvRaw);
          const dayEntry = dateInv[checkIn]?.[currentRoom.id];
          if (dayEntry && dayEntry.available !== undefined && Number(dayEntry.available) <= 0) {
            soldOut = true;
          }
        }
      } catch (err) {}
      setDynamicPrice(price);
      setIsRoomSoldOut(soldOut);
    };

    refreshPricing();
    window.addEventListener('storage', refreshPricing);
    window.addEventListener('ps_inventory_updated', refreshPricing);

    const interval = setInterval(refreshPricing, 400);

    return () => {
      window.removeEventListener('storage', refreshPricing);
      window.removeEventListener('ps_inventory_updated', refreshPricing);
      clearInterval(interval);
    };
  }, [checkIn, currentRoom, isBookingModalOpen]);

  if (!isBookingModalOpen) return null;

  // Calculate pricing
  const roomCost = dynamicPrice * nights;
  const gstTaxes = Math.round(roomCost * 0.12); // 12% Luxury Stay Tax
  const totalAmount = roomCost + gstTaxes;

  const getWhatsAppConfirmationUrl = (bookingId: string) => {
    const text = encodeURIComponent(
      `Hello PS Elite Homestay Tirupati,\n\nI have submitted my reservation request:\nBooking ID: ${bookingId}\nSuite: ${currentRoom.name}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nGuests: ${guestsCount}\nNights: ${nights}\nRate/Night: ₹${dynamicPrice.toLocaleString()}\nTotal Amount: ₹${totalAmount.toLocaleString()}\n\nName: ${guestName}\nPhone: ${guestPhone}\n\nPlease confirm my reservation.`
    );
    return `https://wa.me/919392739715?text=${text}`;
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRoomSoldOut) {
      setErrorMessage('This suite is sold out for the selected check-in date. Please select another date or suite.');
      return;
    }
    setErrorMessage('');

    if (!guestName.trim()) {
      setErrorMessage('Please enter your Full Name.');
      return;
    }
    if (!guestPhone.trim() || guestPhone.trim().length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!is18OrAbove) {
      setErrorMessage('You must confirm that you are 18 years or older to book a suite.');
      return;
    }

    const genBookingId = `PSE-${Math.floor(1000 + Math.random() * 9000)}`;
    setConfirmedBookingId(genBookingId);

    const newBooking: BookingDetails = {
      bookingId: genBookingId,
      guestName: guestName.trim(),
      guestEmail: 'guest@pselite.com',
      guestPhone: guestPhone.trim(),
      room: { ...currentRoom, pricePerNight: dynamicPrice },
      checkIn,
      checkOut,
      guestsCount,
      nights,
      needTemplePickup: false,
      needExtraBed: false,
      couponCode: undefined,
      discountAmount: 0,
      subtotal: roomCost,
      gstTaxes,
      totalAmount,
      status: 'Pending',
      paymentMethod: 'Pay at Check-in (WhatsApp Confirmed)',
      utrNumber: 'N/A',
      advancePaid: 0,
      balanceDue: totalAmount,
      paymentPlan: 'FULL',
      createdAt: new Date().toISOString(),
    };

    addBooking(newBooking);

    // Send Mail Notification to Admin Portal Desk
    try {
      fetch('https://formsubmit.co/ajax/pselitehomestays@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `Coming from PS Elite website - New Booking Inquiry [ID: ${genBookingId}]`,
          _template: 'table',
          _captcha: 'false',
          Booking_ID: genBookingId,
          Guest_Name: guestName.trim(),
          Guest_Phone: guestPhone.trim(),
          Suite: currentRoom.name,
          Check_In: checkIn,
          Check_Out: checkOut,
          Total_Amount: `₹${totalAmount.toLocaleString()}`,
          Action_Required: 'Please login to PS Elite Admin Portal (/admin) to verify and confirm this pending booking.',
        }),
      }).catch(() => {});
    } catch (err) {}

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
    });

    setIsSubmitted(true);

    // Automatically open WhatsApp with confirmation details
    if (typeof window !== 'undefined') {
      const waUrl = getWhatsAppConfirmationUrl(genBookingId);
      window.open(waUrl, '_blank');
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setGuestName('');
    setGuestPhone('');
    setIs18OrAbove(false);
    setErrorMessage('');
    setIsBookingModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleResetAndClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-xl bg-[#111111] border border-white/15 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto text-white"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-start justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3.5">
              <img
                src="/ps-elite-logo.png"
                alt="PS Elite Logo"
                className="w-11 h-11 object-contain drop-shadow-[0_0_8px_rgba(212,175,55,0.4)] flex-shrink-0"
              />
              <div>
                <h2 className="text-xl sm:text-2xl font-light tracking-tight text-white">
                  Book <span className="font-semibold text-gold-gradient">{currentRoom.name}</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  ₹{dynamicPrice.toLocaleString()}/night + 12% Luxury Stay Tax (₹{gstTaxes.toLocaleString()})
                </p>
              </div>
            </div>
            <button
              onClick={handleResetAndClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {!isSubmitted ? (
              <form onSubmit={handleConfirmBooking} className="space-y-6">
                {/* Suite Selector (if user wants to switch) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Selected Suite / Residence
                  </label>
                  <select
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                  >
                    {rooms.map((room) => {
                      const rPrice = getRoomPriceForDate(room, checkIn);
                      return (
                        <option key={room.id} value={room.id} className="bg-neutral-900">
                          {room.name} — ₹{rPrice.toLocaleString()}/night
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Dates Section with Quick Calendar Presets */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Select Stay Dates
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const today = new Date();
                          const tomorrow = new Date(today);
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          setCheckIn(today.toISOString().split('T')[0]);
                          setCheckOut(tomorrow.toISOString().split('T')[0]);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#D4AF37] hover:text-black text-[10px] font-bold uppercase tracking-wider text-white transition-all"
                      >
                        Tonight (1N)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const tomorrow = new Date();
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          const dayAfter = new Date(tomorrow);
                          dayAfter.setDate(dayAfter.getDate() + 1);
                          setCheckIn(tomorrow.toISOString().split('T')[0]);
                          setCheckOut(dayAfter.toISOString().split('T')[0]);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#D4AF37] hover:text-black text-[10px] font-bold uppercase tracking-wider text-white transition-all"
                      >
                        Tomorrow (1N)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const today = new Date();
                          const fri = new Date(today);
                          const dayOfWeek = today.getDay();
                          const daysUntilFri = (5 - dayOfWeek + 7) % 7 || 7;
                          fri.setDate(today.getDate() + daysUntilFri);
                          const sun = new Date(fri);
                          sun.setDate(fri.getDate() + 2);
                          setCheckIn(fri.toISOString().split('T')[0]);
                          setCheckOut(sun.toISOString().split('T')[0]);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-[#D4AF37] hover:text-black text-[10px] font-bold uppercase tracking-wider text-white transition-all"
                      >
                        Weekend (2N)
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className="space-y-1.5 cursor-pointer group"
                      onClick={() => {
                        const el = document.getElementById('modal-checkin') as HTMLInputElement;
                        try {
                          el?.showPicker?.();
                        } catch (err) {}
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 cursor-pointer group-hover:text-[#D4AF37] transition-colors">
                          <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Check-In</span>
                        </label>
                        <span className="text-[10px] text-[#D4AF37] font-semibold flex items-center gap-1">
                          <span>📅 Choose</span>
                        </span>
                      </div>
                      <input
                        id="modal-checkin"
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        onClick={(e) => {
                          try {
                            (e.target as HTMLInputElement).showPicker?.();
                          } catch (err) {}
                        }}
                        style={{ colorScheme: 'dark' }}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 hover:border-[#D4AF37] text-white text-sm focus:border-[#D4AF37] focus:outline-none font-mono font-bold cursor-pointer transition-all shadow-inner"
                      />
                    </div>

                    <div
                      className="space-y-1.5 cursor-pointer group"
                      onClick={() => {
                        const el = document.getElementById('modal-checkout') as HTMLInputElement;
                        try {
                          el?.showPicker?.();
                        } catch (err) {}
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 cursor-pointer group-hover:text-[#D4AF37] transition-colors">
                          <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Check-Out</span>
                        </label>
                        <span className="text-[10px] text-[#D4AF37] font-semibold flex items-center gap-1">
                          <span>📅 Choose</span>
                        </span>
                      </div>
                      <input
                        id="modal-checkout"
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        onClick={(e) => {
                          try {
                            (e.target as HTMLInputElement).showPicker?.();
                          } catch (err) {}
                        }}
                        style={{ colorScheme: 'dark' }}
                        min={checkIn}
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 hover:border-[#D4AF37] text-white text-sm focus:border-[#D4AF37] focus:outline-none font-mono font-bold cursor-pointer transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  {/* VISUAL INTERACTIVE CALENDAR STRIP */}
                  <div className="pt-2">
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Quick Date Selector (Tap to set Check-In / Check-Out)</span>
                      <span className="text-[#D4AF37]">Next 10 Days</span>
                    </p>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                      {Array.from({ length: 10 }).map((_, idx) => {
                        const d = new Date();
                        d.setDate(d.getDate() + idx);
                        const dateStr = d.toISOString().split('T')[0];
                        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                        const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        const isCheckIn = dateStr === checkIn;
                        const isCheckOut = dateStr === checkOut;
                        const isBetween = dateStr > checkIn && dateStr < checkOut;

                        return (
                          <button
                            key={dateStr}
                            type="button"
                            onClick={() => {
                              if (dateStr <= checkIn) {
                                setCheckIn(dateStr);
                                const nextD = new Date(d);
                                nextD.setDate(nextD.getDate() + 1);
                                setCheckOut(nextD.toISOString().split('T')[0]);
                              } else {
                                setCheckOut(dateStr);
                              }
                            }}
                            className={`min-w-[76px] p-2.5 rounded-xl border text-center transition-all shrink-0 ${
                              isCheckIn || isCheckOut
                                ? 'bg-[#D4AF37] border-[#D4AF37] text-black shadow-md scale-105 font-bold'
                                : isBetween
                                ? 'bg-[#D4AF37]/20 border-[#D4AF37]/40 text-white'
                                : 'bg-black/60 border-white/10 hover:border-[#D4AF37] text-neutral-300'
                            }`}
                          >
                            <span className="block text-[10px] uppercase font-bold tracking-wider opacity-80">
                              {dayName}
                            </span>
                            <span className="block text-xs font-extrabold my-0.5">
                              {monthDay}
                            </span>
                            <span className="block text-[9px] uppercase font-semibold">
                              {isCheckIn ? 'IN' : isCheckOut ? 'OUT' : isBetween ? 'STAY' : 'Select'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Sold Out Notice Banner if date-specific admin inventory is 0 */}
                {isRoomSoldOut && (
                  <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-medium flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-rose-400 uppercase tracking-wider">
                        Suite Sold Out for {checkIn}
                      </p>
                      <p className="mt-1">
                        We apologize, but {currentRoom.name} is fully booked on this check-in date. Please select another date or choose a different suite category above.
                      </p>
                    </div>
                  </div>
                )}

                {/* Price Breakdown Summary Card */}
                <div className="p-5 rounded-2xl bg-[#1A1A1A] border border-white/10 space-y-3 text-sm">
                  <div className="flex items-center justify-between text-neutral-300">
                    <span>
                      {nights} night(s) × ₹{dynamicPrice.toLocaleString()}
                    </span>
                    <span className="font-medium text-white">₹{roomCost.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-neutral-300">
                    <span>Luxury Stay Tax (12%)</span>
                    <span className="font-medium text-white">₹{gstTaxes.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="font-bold text-base text-white">Total Amount</span>
                    <span className="font-extrabold text-xl text-gold-gradient">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 italic">
                    * No online advance payment required. Pay directly at the property after confirmation.
                  </p>
                </div>

                {/* Guest Details Form */}
                <div className="space-y-4 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      maxLength={15}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isWhatsAppSame}
                        onChange={(e) => setIsWhatsAppSame(e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 bg-black text-[#D4AF37] focus:ring-0"
                      />
                      <span className="text-xs text-neutral-300">
                        WhatsApp number is same as mobile
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={is18OrAbove}
                        onChange={(e) => setIs18OrAbove(e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 bg-black text-[#D4AF37] focus:ring-0"
                      />
                      <span className="text-xs text-neutral-300">
                        I confirm I am 18 years or above *
                      </span>
                    </label>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Total Number of Guests *</span>
                    </label>
                    <select
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white text-sm focus:border-[#D4AF37] focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n} className="bg-neutral-900">
                          {n} {n === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isRoomSoldOut}
                  className={`w-full py-4 rounded-2xl font-extrabold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    isRoomSoldOut
                      ? 'bg-neutral-800 text-neutral-500 border border-neutral-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#D4AF37] via-[#f3e5ab] to-[#B8860B] text-black hover:opacity-95 shadow-xl shadow-[#B8860B]/40'
                  }`}
                >
                  <span>
                    {isRoomSoldOut ? 'Suite Sold Out for Selected Date' : 'Confirm Booking & Pay Later'}
                  </span>
                  {!isRoomSoldOut && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
            ) : (
              /* SUCCESS STATE — INSTANT CONFIRMATION & WHATSAPP REDIRECTION */
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-6 text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                </div>

                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                    <Check className="w-3.5 h-3.5" />
                    <span>Booking Confirmed</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white pt-1">
                    Reservation Registered!
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Booking ID: <strong className="text-[#D4AF37]">{confirmedBookingId}</strong> — Pay directly at check-in.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-left text-xs space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Suite Booked:</span>
                    <span className="font-semibold text-white">{currentRoom.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Guest Name:</span>
                    <span className="font-semibold text-white">{guestName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Stay Duration:</span>
                    <span className="font-semibold text-white">
                      {checkIn} → {checkOut} ({nights} {nights === 1 ? 'Night' : 'Nights'})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Total Payable at Stay:</span>
                    <span className="font-bold text-[#D4AF37] text-sm">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-white/10 text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                    <span>📧 Mail notification automatically sent to admin portal desk to check &amp; review this booking.</span>
                  </div>
                </div>

                {/* WhatsApp Action Button */}
                <div className="space-y-3 pt-2">
                  <a
                    href={getWhatsAppConfirmationUrl(confirmedBookingId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-extrabold text-sm uppercase tracking-widest transition-all shadow-xl shadow-[#25D366]/30 flex items-center justify-center gap-2.5"
                  >
                    <MessageCircle className="w-5 h-5 fill-black" />
                    <span>Send Confirmation via WhatsApp →</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white font-semibold text-xs uppercase tracking-wider transition-colors"
                  >
                    Close &amp; Return to Homepage
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
