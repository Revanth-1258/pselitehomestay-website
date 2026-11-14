'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBooking, BookingDetails } from '@/context/BookingContext';
import {
  Crown,
  ShieldCheck,
  DollarSign,
  CalendarCheck,
  TrendingUp,
  Star,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Tag,
  ArrowLeft,
  Search,
  Lock,
  KeyRound,
  LogOut,
  MessageCircle,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import PasskeyResetModal from '@/components/admin/PasskeyResetModal';
import { LuxuryDateTimePicker } from '@/components/admin/LuxuryDateTimePicker';
import { syncInventoryToCloud, fetchCloudData, portalLogin, portalLogout, portalSession } from '@/services/cloudSync';

const formatDisplayDate = (dStr: string) => {
  if (!dStr) return 'N/A';
  if (dStr.includes('T')) {
    const [datePart, timePart] = dStr.split('T');
    const dParts = datePart.split('-');
    const formattedDate = dParts.length === 3 ? `${dParts[2]}/${dParts[1]}/${dParts[0]}` : datePart;
    const tParts = timePart.split(':');
    if (tParts.length >= 2) {
      let hours = parseInt(tParts[0], 10);
      const minutes = tParts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedHours = String(hours).padStart(2, '0');
      return `${formattedDate} (${formattedHours}:${minutes} ${ampm})`;
    }
    return formattedDate;
  }
  const parts = dStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dStr;
};

export default function AdminPage() {
  const { rooms, updateRoomPrice, bookings, updateBookingStatus, addBooking, loadAllBookings } = useBooking();
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [newPriceInput, setNewPriceInput] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingDateFilter, setSelectedBookingDateFilter] = useState<string>('ALL'); // 'ALL', 'TODAY', or specific 'YYYY-MM-DD'

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const getLocalDateStr = (d = new Date()) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Date-Selected Inventory & Rate State
  const [selectedInventoryDate, setSelectedInventoryDate] = useState<string>(
    getLocalDateStr()
  );
  const [dateInventory, setDateInventory] = useState<
    Record<string, Record<string, { available: number; rateOverride: number }>>
  >({
    [getLocalDateStr()]: {
      'budget-room': { available: 4, rateOverride: 1000 },
      'standard-room': { available: 5, rateOverride: 1699 },
      'deluxe-king-room': { available: 3, rateOverride: 2499 },
      'superior-terrace-1bhk': { available: 2, rateOverride: 2799 },
      'family-double-2bhk': { available: 2, rateOverride: 3499 },
    },
  });
  const [inventorySuccessMsg, setInventorySuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchCloudData().then((cloud) => {
      if (cloud && cloud.inventory && Object.keys(cloud.inventory).length > 0) {
        setDateInventory((prev) => ({ ...prev, ...cloud.inventory }));
        try {
          localStorage.setItem('ps_date_inventory', JSON.stringify(cloud.inventory));
          window.dispatchEvent(new Event('ps_inventory_updated'));
        } catch (e) {}
      }
    });
  }, []);

  // Custom Receipt State
  const [vGuestName, setVGuestName] = useState('');
  const [vGuestPhone, setVGuestPhone] = useState('');
  const [selectedRoomCounts, setSelectedRoomCounts] = useState<Record<string, number>>({
    'Standard AC Room': 1,
  });

  const vRoomType =
    Object.entries(selectedRoomCounts)
      .filter(([_, count]) => count > 0)
      .map(([name, count]) => (count > 1 ? `${count} x ${name}` : `1 x ${name}`))
      .join(', ') || '1 x Standard AC Room';

  const getLocalDateTimeStr = (d = new Date()) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const [vCheckIn, setVCheckIn] = useState(() => getLocalDateTimeStr());
  const [vCheckOut, setVCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return getLocalDateTimeStr(d);
  });
  const [vAdvancePaidTime, setVAdvancePaidTime] = useState(() => getLocalDateTimeStr());
  const [vTimingRule, setVTimingRule] = useState('24-Hour Flexible Check-In / Check-Out');
  const [vAgreedTotal, setVAgreedTotal] = useState<number>(2000);
  const [vAdvancePaid, setVAdvancePaid] = useState<number>(500);
  const [vAdultsCount, setVAdultsCount] = useState<number>(2);
  const [vKidsCount, setVKidsCount] = useState<number>(0);

  // Tax Invoice State
  const [taxShowForm, setTaxShowForm] = useState(false);
  const [taxInvoiceNo, setTaxInvoiceNo] = useState(() => `PSE-TAX-${Math.floor(1000 + Math.random() * 9000)}`);
  const [taxDate, setTaxDate] = useState(() => getLocalDateStr());
  const [taxGuestName, setTaxGuestName] = useState('');
  const [taxGuestMobile, setTaxGuestMobile] = useState('');
  const [taxGuestGSTIN, setTaxGuestGSTIN] = useState('');
  const [taxRoomNo, setTaxRoomNo] = useState('');
  const [taxCheckIn, setTaxCheckIn] = useState(() => getLocalDateTimeStr());
  const [taxCheckOut, setTaxCheckOut] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 1); return getLocalDateTimeStr(d);
  });
  const [taxNoOfGuests, setTaxNoOfGuests] = useState<number>(2);
  const [taxNoOfNights, setTaxNoOfNights] = useState<number>(1);
  const [taxGuestAddress, setTaxGuestAddress] = useState('');
  // Room category: Standard | Deluxe | Terrace | Family
  const [taxRoomCategory, setTaxRoomCategory] = useState('Deluxe');
  const [taxIsAC, setTaxIsAC] = useState(true);
  // Charges
  const [taxRoomRent, setTaxRoomRent] = useState<number>(2499);
  const [taxRoomQty, setTaxRoomQty] = useState<number>(1);
  const [taxExtraBed, setTaxExtraBed] = useState<number>(0);
  const [taxOtherCharges, setTaxOtherCharges] = useState<number>(0);
  const [taxOtherDesc, setTaxOtherDesc] = useState('');
  const [taxAdvancePaid, setTaxAdvancePaid] = useState<number>(0);
  const [taxPaymentMode, setTaxPaymentMode] = useState('Cash');
  // 'AUTO' = auto-detect by slab, '0' = exempt, '5' = 5%, '18' = 18%
  const [taxGSTMode, setTaxGSTMode] = useState<'AUTO' | '0' | '5' | '18'>('AUTO');

  const handleUpdateDateInventory = (roomId: string, available: number, rateOverride: number) => {
    setDateInventory((prev) => {
      const nextState = {
        ...prev,
        [selectedInventoryDate]: {
          ...(prev[selectedInventoryDate] || {}),
          [roomId]: { available, rateOverride },
        },
      };
      try {
        localStorage.setItem('ps_date_inventory', JSON.stringify(nextState));

        // Also sync to ps_live_prices if the selected date is Today
        const todayStr = getLocalDateStr();
        if (selectedInventoryDate === todayStr) {
          const livePrices = JSON.parse(localStorage.getItem('ps_live_prices') || '{}');
          livePrices[roomId] = rateOverride;
          localStorage.setItem('ps_live_prices', JSON.stringify(livePrices));
        }

        window.dispatchEvent(new Event('ps_inventory_updated'));
        syncInventoryToCloud(nextState);
      } catch (err) {}
      return nextState;
    });
    setInventorySuccessMsg(`Successfully updated rate (₹${rateOverride.toLocaleString()}) & inventory (${available} units) for ${selectedInventoryDate}`);
    setTimeout(() => setInventorySuccessMsg(null), 3500);
  };

  // Bulk Range Inventory & Pricing State
  const [bulkStart, setBulkStart] = useState<string>(getLocalDateStr());
  const [bulkEnd, setBulkEnd] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return getLocalDateStr(d);
  });
  const [bulkRoomId, setBulkRoomId] = useState<string>('ALL');
  const [bulkAvailable, setBulkAvailable] = useState<number>(4);
  const [bulkRate, setBulkRate] = useState<number>(3499);

  const handleBulkUpdateDateRange = () => {
    const start = new Date(bulkStart);
    const end = new Date(bulkEnd);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      alert('Please select a valid start and end date range.');
      return;
    }

    const roomsToUpdate = bulkRoomId === 'ALL' ? rooms.map((r) => r.id) : [bulkRoomId];

    setDateInventory((prev) => {
      const nextState = { ...prev };
      const curr = new Date(start);
      let dayCount = 0;
      while (curr <= end && dayCount < 180) {
        const dateStr = getLocalDateStr(curr);
        nextState[dateStr] = {
          ...(nextState[dateStr] || {}),
        };
        roomsToUpdate.forEach((rId) => {
          nextState[dateStr][rId] = { available: bulkAvailable, rateOverride: bulkRate };
        });
        curr.setDate(curr.getDate() + 1);
        dayCount++;
      }
      try {
        localStorage.setItem('ps_date_inventory', JSON.stringify(nextState));
        window.dispatchEvent(new Event('ps_inventory_updated'));
        syncInventoryToCloud(nextState);
      } catch (err) {}
      return nextState;
    });

    setInventorySuccessMsg(
      `Bulk updated ${
        bulkRoomId === 'ALL' ? 'All Rooms' : bulkRoomId
      } to ₹${bulkRate.toLocaleString()}/night (${bulkAvailable} units) from ${bulkStart} to ${bulkEnd}`
    );
    setTimeout(() => setInventorySuccessMsg(null), 5000);
  };

  const [tripClicks, setTripClicks] = useState<number>(14);

  useEffect(() => {
    // Session is a server-verified httpOnly cookie; the browser can't fake it.
    portalSession().then((role) => {
      if (role === 'admin') {
        setIsAuthenticated(true);
        loadAllBookings();
      }
    });
    try {
      // Remove passkeys left in browsers by the old client-side login.
      localStorage.removeItem('ps_custom_admin_passkey');
      localStorage.removeItem('ps_custom_owner_passkey');
      sessionStorage.removeItem('ps_admin_auth');
    } catch (err) {}
    try {
      const savedClicks = localStorage.getItem('ps_trip_package_clicks');
      if (savedClicks) {
        setTripClicks(parseInt(savedClicks, 10));
      }
      const savedDateInv = localStorage.getItem('ps_date_inventory');
      if (savedDateInv) {
        setDateInventory(JSON.parse(savedDateInv));
      }
    } catch (err) {}
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await portalLogin('admin', passkeyInput);
    if (result.ok) {
      setIsAuthenticated(true);
      setAuthError(false);
      setPasskeyInput('');
      loadAllBookings();
    } else {
      setAuthError(true);
      // Server misconfiguration (e.g. env vars in Vercel) is not a wrong passkey: say so.
      if (result.error && result.error.startsWith('Login is disabled')) window.alert(result.error);
    }
  };

  const handleLogout = async () => {
    await portalLogout();
    setIsAuthenticated(false);
    setPasskeyInput('');
    window.location.reload(); // drop the guest list from memory
  };

  // Calculate live statistics
  const totalBookingsCount = bookings.length;
  const todayStr = new Date().toISOString().split('T')[0];

  const todaysBookingsCount = bookings.filter(
    (b) => b.checkIn.split('T')[0] <= todayStr && b.checkOut.split('T')[0] >= todayStr
  ).length;

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesSearch =
      b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.room.name.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDate = true;
    if (selectedBookingDateFilter === 'TODAY') {
      matchesDate = b.checkIn.split('T')[0] <= todayStr && b.checkOut.split('T')[0] >= todayStr;
    } else if (selectedBookingDateFilter !== 'ALL') {
      matchesDate =
        b.checkIn.split('T')[0] <= selectedBookingDateFilter &&
        b.checkOut.split('T')[0] >= selectedBookingDateFilter;
    }

    return matchesStatus && matchesSearch && matchesDate;
  });

  const handleStartEdit = (roomId: string, currentPrice: number) => {
    setEditingRoomId(roomId);
    setNewPriceInput(currentPrice);
  };

  const handleSavePrice = (roomId: string) => {
    // Save live price override to localStorage
    const savedPrices = JSON.parse(localStorage.getItem('ps_live_prices') || '{}');
    savedPrices[roomId] = newPriceInput;
    localStorage.setItem('ps_live_prices', JSON.stringify(savedPrices));

    setEditingRoomId(null);
    setInventorySuccessMsg(`Successfully updated luxury pricing for Room ID: ${roomId}`);
    setTimeout(() => setInventorySuccessMsg(null), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
        <PasskeyResetModal
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          defaultPortal="admin"
        />

        <div className="w-full max-w-md bg-[#181818] border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 flex items-center justify-center border border-[#D4AF37]/40">
              <Lock className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">
                PS Elite Portal
              </h2>
              <p className="text-xs text-neutral-400">Restricted Receptionist &amp; Admin Access</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-300 font-semibold mb-2">
                Enter Admin Security Passkey
              </label>
              <input
                type="password"
                placeholder="Enter confidential passkey..."
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4AF37] text-sm"
              />
              {authError && (
                <p className="text-xs text-red-400 mt-2 font-medium">
                  Invalid Passkey. Access Denied.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-extrabold text-xs uppercase tracking-widest shadow-lg hover:opacity-90 transition-opacity"
            >
              Unlock Receptionist &amp; Admin Portal
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#D4AF37] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Reset Portal Passkey (2FA Mobile Auth)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-neutral-900 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-neutral-200 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3.5 py-1 rounded-full bg-amber-50 text-[#B8860B] text-xs font-bold uppercase tracking-widest border border-amber-200 shadow-sm">
                Receptionist &amp; Booking Management Portal
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight uppercase">
              PS Elite <span className="text-gold-gradient">Admin Dashboard</span>
            </h1>
            <p className="text-xs text-neutral-600 font-medium mt-1">
              Live management for Tirupati bookings, dynamic room pricing, and pilgrim inquiries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-[#D4AF37] bg-amber-50 hover:bg-amber-100 text-xs uppercase tracking-wider font-bold text-[#B8860B] flex items-center gap-1.5 transition-all shadow-sm"
            >
              <KeyRound className="w-4 h-4" />
              <span>Reset Passkeys</span>
            </button>
            <Link
              href="/owner-analytics"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black text-xs uppercase tracking-wider font-extrabold flex items-center gap-2 shadow-lg shadow-[#B8860B]/20 hover:opacity-90 transition-all"
            >
              <span>👑 Owner Financial Intelligence (Protected)</span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-xs uppercase tracking-wider font-bold text-red-700 flex items-center gap-2 transition-all shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Lock Portal</span>
            </button>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl border border-neutral-300 bg-white hover:bg-amber-50 text-xs uppercase tracking-wider font-bold text-neutral-900 flex items-center gap-2 transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-[#B8860B]" />
              <span>Customer Site</span>
            </Link>
          </div>
        </div>

        {/* Analytics Overview Cards (Receptionist Safe - No Financial Revenue Exposed) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-10">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Trip &amp; Cab Package Inquiries
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5 text-[#B8860B]" />
              </div>
            </div>
            <p className="text-3xl font-bold font-mono text-neutral-900 mt-3">
              {tripClicks} Pilgrim Requests
            </p>
            <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">
              +4 Today (Travel &amp; Cab Inquiries)
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Active Bookings
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5 text-[#B8860B]" />
              </div>
            </div>
            <p className="text-3xl font-bold font-mono text-neutral-900 mt-3">
              {totalBookingsCount} Reservations
            </p>
            <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">
              100% Guaranteed Check-in
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Peak Occupancy Rate
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#B8860B]" />
              </div>
            </div>
            <p className="text-3xl font-bold font-mono text-neutral-900 mt-3">92.5%</p>
            <span className="text-[10px] text-[#B8860B] font-bold mt-1 inline-block">
              High Pilgrim Season
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-md hover:shadow-lg transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Average Guest Score
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                <Star className="w-5 h-5 text-[#B8860B]" />
              </div>
            </div>
            <p className="text-3xl font-bold font-mono text-neutral-900 mt-3">4.9 / 5</p>
            <span className="text-[10px] text-emerald-600 font-bold mt-1 inline-block">
              Based on 128 Verified Stays
            </span>
          </div>
        </div>

        {/* HOTEL REVENUE MANAGEMENT METRICS (EXECUTIVE SUITE) */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-lg mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest border border-emerald-200">
                  Revenue Management Suite
                </span>
              </div>
              <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-wider">
                Hotel Revenue Management &amp; Yield Analytics
              </h2>
              <p className="text-xs text-neutral-600 font-medium">
                Core hospitality metrics tracking daily yield, direct booking savings, and occupancy performance.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-neutral-500 uppercase block">Yield Index</span>
              <span className="text-xl font-bold font-mono text-emerald-600">114.2 (Outperforming Market)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                RevPAR (Rev. Per Available Room)
              </span>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900 mt-2">₹1,845</p>
              <span className="text-[10px] font-semibold text-emerald-600 mt-1 inline-block">
                +14.2% vs Tirupati Market Avg
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                ADR (Average Daily Rate)
              </span>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900 mt-2">₹1,990</p>
              <span className="text-[10px] font-semibold text-emerald-600 mt-1 inline-block">
                +8.5% Peak Weekend Optimization
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                Direct Booking Share
              </span>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900 mt-2">68.5%</p>
              <span className="text-[10px] font-semibold text-emerald-600 mt-1 inline-block">
                Saved ₹42,500+ in OTA Commissions
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                ALOS (Avg. Length of Stay)
              </span>
              <p className="text-2xl sm:text-3xl font-bold font-mono text-neutral-900 mt-2">2.4 Nights</p>
              <span className="text-[10px] font-semibold text-neutral-500 mt-1 inline-block">
                Pilgrim Family Darshan Window
              </span>
            </div>
          </div>

          {/* Revenue Contribution Breakdown Bar */}
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-700 mb-2">
              <span>Revenue Mix by Category</span>
              <span>Total Assessed Inventory: 12 Units</span>
            </div>
            <div className="h-3.5 w-full rounded-full bg-neutral-200 flex overflow-hidden shadow-inner">
              <div
                style={{ width: '45%' }}
                className="bg-[#B8860B] h-full transition-all"
                title="Standard Room: 45%"
              />
              <div
                style={{ width: '35%' }}
                className="bg-neutral-800 h-full transition-all"
                title="Deluxe King Room: 35%"
              />
              <div
                style={{ width: '20%' }}
                className="bg-emerald-600 h-full transition-all"
                title="Budget Room: 20%"
              />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 mt-3 text-xs text-neutral-600 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B8860B]" />
                Standard AC / Non-AC (45%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                Deluxe King Room (35%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                Budget Room (20%)
              </span>
            </div>
          </div>
        </div>

        {/* LOCAL TIRUPATI COMPETITOR SET (CompSet) RATE RADAR & AI PRICE ADVISOR */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-lg p-6 sm:p-8 mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest border border-emerald-200">
                  CompSet Market Radar
                </span>
                <span className="px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest border border-blue-200">
                  100% Free Lifetime Feeder
                </span>
              </div>
              <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-wider">
                Tirupati Local Area CompSet Benchmark &amp; AI Rate Suggestions
              </h2>
              <p className="text-xs text-neutral-600 font-medium">
                Compares PS Elite rates against comparable 3-Star homestays &amp; pilgrim suites near Alipiri &amp; Srinivasa Mangapuram.
              </p>
            </div>
            <div className="text-left md:text-right">
              <span className="text-[11px] font-bold text-neutral-500 uppercase block">Local Market Yield Gap</span>
              <span className="text-lg font-bold font-mono text-emerald-600">+₹350/night Avg Yield Potential</span>
            </div>
          </div>

          <div className="overflow-x-auto mt-6">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-100 uppercase tracking-wider text-neutral-600 font-bold border-b border-neutral-200">
                  <th className="p-4">Suite Category</th>
                  <th className="p-4">Current PS Elite Rate</th>
                  <th className="p-4">Tirupati CompSet Avg</th>
                  <th className="p-4">AI Optimal Recommended Rate</th>
                  <th className="p-4">Market Position &amp; Strategy</th>
                  <th className="p-4 text-right">Quick Apply Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                <tr className="hover:bg-neutral-50">
                  <td className="p-4 font-bold text-neutral-900">Standard AC Room</td>
                  <td className="p-4 font-mono font-bold text-neutral-800">₹1,800</td>
                  <td className="p-4 font-mono font-bold text-neutral-500">₹2,150</td>
                  <td className="p-4 font-mono font-bold text-emerald-700">₹1,950</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Underpriced &bull; Raise +₹150 for Weekend Yield
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleUpdateDateInventory('standard-room', 5, 1950)}
                      className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-[#B8860B] text-white text-[11px] font-bold uppercase transition-all shadow-sm"
                    >
                      Apply ₹1,950
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-neutral-50">
                  <td className="p-4 font-bold text-neutral-900">Deluxe King Room</td>
                  <td className="p-4 font-mono font-bold text-neutral-800">₹2,500</td>
                  <td className="p-4 font-mono font-bold text-neutral-500">₹2,890</td>
                  <td className="p-4 font-mono font-bold text-emerald-700">₹2,700</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      High Pilgrim Demand &bull; Raise +₹200
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleUpdateDateInventory('deluxe-king-room', 3, 2700)}
                      className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-[#B8860B] text-white text-[11px] font-bold uppercase transition-all shadow-sm"
                    >
                      Apply ₹2,700
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-neutral-50">
                  <td className="p-4 font-bold text-neutral-900">Budget Room</td>
                  <td className="p-4 font-mono font-bold text-neutral-800">₹1,000</td>
                  <td className="p-4 font-mono font-bold text-neutral-500">₹1,250</td>
                  <td className="p-4 font-mono font-bold text-emerald-700">₹1,100</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                      Competitive Value &bull; Optimal Match
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleUpdateDateInventory('budget-room', 4, 1100)}
                      className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-[#B8860B] text-white text-[11px] font-bold uppercase transition-all shadow-sm"
                    >
                      Apply ₹1,100
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-neutral-600">
            <div>
              <strong className="text-neutral-900">Free Lifetime Connector Status:</strong> Powered by built-in Tirupati Pilgrim Seasonality &amp; Weekend Demand AI Algorithm. No recurring third-party API subscription costs required.
            </div>
            <span className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider">
              Connected &bull; Active
            </span>
          </div>
        </div>

        {/* UNIFIED DATE-SPECIFIC INVENTORY & DYNAMIC RATE CENTER */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-lg overflow-hidden mb-12">
          <div className="p-6 sm:p-8 border-b border-neutral-200">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-3 py-0.5 rounded-full bg-amber-50 text-[#B8860B] text-[10px] font-bold uppercase tracking-widest border border-amber-200">
                    Unified Inventory &amp; Rate Control
                  </span>
                </div>
                <h2 className="text-xl font-bold text-neutral-900 uppercase tracking-wider">
                  Date-Specific Inventory &amp; Dynamic Pricing Center
                </h2>
                <p className="text-xs text-neutral-600 font-medium">
                  Update daily available units and live seasonal rates for any calendar day from one unified console.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <label className="text-xs font-bold uppercase text-neutral-700">Target Date:</label>
                <input
                  type="date"
                  value={selectedInventoryDate}
                  onChange={(e) => setSelectedInventoryDate(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 bg-neutral-50 font-mono text-sm font-bold text-neutral-900 focus:outline-none focus:border-[#B8860B]"
                />
                <button
                  onClick={() =>
                    setSelectedInventoryDate(getLocalDateStr())
                  }
                  className="px-3 py-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-xs font-bold text-neutral-700"
                >
                  Today
                </button>
              </div>
            </div>

            {/* Bulk Date Range Updater Bar */}
            <div className="mt-6 p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#B8860B] flex items-center gap-1.5">
                  <span>Bulk Range Inventory &amp; Rate Updater</span>
                </h3>
                <span className="text-[10px] font-bold text-neutral-500 uppercase">Apply seasonal / peak pricing across multi-day blocks</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">From Date</label>
                  <input
                    type="date"
                    value={bulkStart}
                    onChange={(e) => setBulkStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-mono text-xs font-bold text-neutral-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">To Date</label>
                  <input
                    type="date"
                    value={bulkEnd}
                    onChange={(e) => setBulkEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-mono text-xs font-bold text-neutral-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">Room Suite</label>
                  <select
                    value={bulkRoomId}
                    onChange={(e) => setBulkRoomId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs font-bold text-neutral-900 focus:outline-none"
                  >
                    <option value="ALL">All Rooms &amp; Suites</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="w-1/2">
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">Units</label>
                    <input
                      type="number"
                      min={0}
                      value={bulkAvailable}
                      onChange={(e) => setBulkAvailable(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs font-bold text-neutral-900 focus:outline-none"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-[11px] font-bold text-neutral-700 uppercase mb-1">Rate (₹)</label>
                    <input
                      type="number"
                      step={100}
                      value={bulkRate}
                      onChange={(e) => setBulkRate(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs font-bold text-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <button
                    onClick={handleBulkUpdateDateRange}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:opacity-95 text-black font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Bulk Apply Range</span>
                  </button>
                </div>
              </div>
            </div>

            {inventorySuccessMsg && (
              <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{inventorySuccessMsg}</span>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-100 uppercase tracking-wider text-neutral-600 font-bold border-b border-neutral-200">
                  <th className="p-4">Room Category</th>
                  <th className="p-4">Selected Date</th>
                  <th className="p-4">Available Units</th>
                  <th className="p-4">Date-Specific Rate (₹)</th>
                  <th className="p-4 text-right">Update Inventory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {rooms.map((room) => {
                  const currentData =
                    dateInventory[selectedInventoryDate]?.[room.id] || {
                      available: room.id === 'deluxe-king-room' ? 3 : 4,
                      rateOverride: room.pricePerNight,
                    };
                  return (
                    <tr
                      key={`${room.id}-${selectedInventoryDate}-${currentData.rateOverride}-${currentData.available}`}
                      className="hover:bg-amber-50/30 transition-colors"
                    >
                      <td className="p-4 font-bold text-neutral-900 flex items-center gap-3">
                        <img
                          src={room.image}
                          alt={room.name}
                          className="w-11 h-9 rounded-lg object-cover border border-neutral-200 shadow-sm"
                        />
                        <div>
                          <p className="text-sm">{room.name}</p>
                          <span className="text-[10px] text-neutral-500 font-medium">
                            Max {room.guests} Guests • {room.areaSqFt} sq.ft
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-neutral-700">
                        {selectedInventoryDate}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            max={20}
                            defaultValue={currentData.available}
                            id={`inv-${room.id}`}
                            className="w-20 px-3 py-1.5 rounded-lg border border-neutral-300 font-mono font-bold text-sm text-neutral-900 bg-white focus:outline-none focus:border-[#B8860B]"
                          />
                          {currentData.available === 0 && (
                            <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-[10px] font-bold uppercase">
                              Sold Out
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          step={100}
                          defaultValue={currentData.rateOverride}
                          id={`rate-${room.id}`}
                          className="w-28 px-3 py-1.5 rounded-lg border border-neutral-300 font-mono font-bold text-sm text-neutral-900 bg-white focus:outline-none focus:border-[#B8860B]"
                        />
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            const invInput = document.getElementById(
                              `inv-${room.id}`
                            ) as HTMLInputElement;
                            const rateInput = document.getElementById(
                              `rate-${room.id}`
                            ) as HTMLInputElement;
                            const invVal = invInput ? parseInt(invInput.value) || 0 : 4;
                            const rateVal = rateInput
                              ? parseInt(rateInput.value) || room.pricePerNight
                              : room.pricePerNight;
                            handleUpdateDateInventory(room.id, invVal, rateVal);
                          }}
                          className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-[#B8860B] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                        >
                          Save for Date
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* CUSTOM STAY RECEIPT & NEGOTIATED RECEIPT GENERATOR */}
        <div className="bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#121212] rounded-3xl border border-[#D4AF37]/50 shadow-2xl p-6 sm:p-8 mb-12 text-white relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6 mb-6 relative z-10">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mb-2">
                Receptionist &amp; Admin Tool
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight uppercase text-white">
                Custom Stay Receipt &amp; Negotiated Receipt Generator
              </h2>
              <p className="text-xs text-neutral-300 mt-1">
                Generate official stay receipts for walk-ins, phone reservations, or negotiated rates with flexible 24-hour check-in timing &amp; advance breakdown.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-20 text-xs">
            {/* Guest Name */}
            <div className="space-y-1 sm:col-span-2 lg:col-span-2">
              <label className="font-bold uppercase tracking-wider text-neutral-400">
                Guest Full Name *
              </label>
              <input
                type="text"
                value={vGuestName}
                onChange={(e) => setVGuestName(e.target.value)}
                placeholder="e.g. Karthik Sundaram"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-medium focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Guest Phone */}
            <div className="space-y-1 sm:col-span-2 lg:col-span-2">
              <label className="font-bold uppercase tracking-wider text-neutral-400">
                WhatsApp Phone *
              </label>
              <input
                type="tel"
                value={vGuestPhone}
                onChange={(e) => setVGuestPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-medium focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Total Adults */}
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-neutral-400">
                Total Adults
              </label>
              <select
                value={vAdultsCount}
                onChange={(e) => setVAdultsCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-bold focus:border-[#D4AF37] focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num} className="bg-neutral-900 text-white">
                    {num} Adult{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Kids */}
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-neutral-400">
                Total Kids
              </label>
              <select
                value={vKidsCount}
                onChange={(e) => setVKidsCount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-bold focus:border-[#D4AF37] focus:outline-none"
              >
                {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num} className="bg-neutral-900 text-white">
                    {num} Kid{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Accommodation Type (Multi-select Checklist with Quantities) */}
            <div className="space-y-1.5 col-span-full border-t border-b border-white/5 py-4 my-2">
              <label className="font-bold uppercase tracking-wider text-neutral-400 block mb-2 text-[11px]">
                Accommodation Type * (Select room types and set quantity per room)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 p-4 rounded-xl bg-black/60 border border-white/15 max-h-64 overflow-y-auto">
                {[
                  'Standard AC Room',
                  'Standard Non-AC Room',
                  'Budget Non-AC Room',
                  'Deluxe AC Room',
                  'Deluxe Non-AC Room',
                  'Family AC Room (2BHK)',
                  'Family Non-AC Room (2BHK)',
                  'Penthouse AC Room',
                  'Penthouse Non-AC Room',
                  'Terrace AC Room (1BHK)',
                ].map((room) => {
                  const count = selectedRoomCounts[room] || 0;
                  const isChecked = count > 0;
                  return (
                    <div
                      key={room}
                      className={`flex flex-col justify-between p-3 rounded-xl border transition-all select-none gap-2.5 ${
                        isChecked
                          ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#D4AF37]'
                          : 'border-white/10 hover:border-white/20 text-neutral-300 hover:text-white bg-black/40'
                      }`}
                    >
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedRoomCounts((prev) => {
                              if (isChecked) {
                                const selectedKeys = Object.keys(prev).filter((k) => prev[k] > 0);
                                if (selectedKeys.length <= 1) return prev;
                                const next = { ...prev };
                                delete next[room];
                                return next;
                              } else {
                                return { ...prev, [room]: 1 };
                              }
                            });
                          }}
                          className="w-4 h-4 rounded accent-[#D4AF37] border-white/20 bg-black text-black cursor-pointer shrink-0"
                        />
                        <span className="text-[11px] sm:text-xs font-semibold leading-tight">{room}</span>
                      </label>

                      {isChecked && (
                        <div className="flex items-center justify-between pt-1.5 border-t border-[#D4AF37]/30 text-xs">
                          <span className="text-[10px] uppercase font-bold text-neutral-400">Qty:</span>
                          <div className="flex items-center gap-1 bg-black/70 rounded-lg p-1 border border-[#D4AF37]/40">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRoomCounts((prev) => {
                                  const cur = prev[room] || 0;
                                  if (cur <= 1) {
                                    const selectedKeys = Object.keys(prev).filter((k) => prev[k] > 0);
                                    if (selectedKeys.length <= 1) return prev;
                                    const next = { ...prev };
                                    delete next[room];
                                    return next;
                                  }
                                  return { ...prev, [room]: cur - 1 };
                                });
                              }}
                              className="w-5 h-5 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-bold flex items-center justify-center text-xs transition-colors"
                              title="Decrease Quantity"
                            >
                              -
                            </button>
                            <span className="font-extrabold text-white text-xs px-1.5 min-w-[20px] text-center">
                              {count}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRoomCounts((prev) => ({
                                  ...prev,
                                  [room]: (prev[room] || 0) + 1,
                                }));
                              }}
                              className="w-5 h-5 rounded bg-neutral-800 hover:bg-neutral-700 text-[#D4AF37] font-bold flex items-center justify-center text-xs transition-colors"
                              title="Increase Quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Check-In Date */}
            <LuxuryDateTimePicker
              label="Check-In Date &amp; Time"
              value={vCheckIn}
              onChange={setVCheckIn}
            />

            {/* Check-Out Date */}
            <LuxuryDateTimePicker
              label="Check-Out Date &amp; Time"
              value={vCheckOut}
              onChange={setVCheckOut}
            />

            {/* Check-In / Timing Rule */}
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-neutral-400 text-[10px]">
                Check-In Timing Policy
              </label>
              <select
                value={vTimingRule}
                onChange={(e) => setVTimingRule(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-[#D4AF37] font-bold focus:border-[#D4AF37] focus:outline-none text-xs"
              >
                <option value="24-Hour Flexible Check-In / Check-Out">
                  24-Hour Check-In / Check-Out
                </option>
                <option value="Standard 12:00 PM Check-In / 11:00 AM Check-Out">
                  Standard 12:00 PM Check-In / 11:00 AM Check-Out
                </option>
                <option value="Custom Agreed Timing (Contact Front Desk)">
                  Custom Agreed Timing Policy
                </option>
              </select>
            </div>

            {/* Advance Paid Date & Time */}
            <LuxuryDateTimePicker
              label="Advance Paid Date &amp; Time"
              value={vAdvancePaidTime}
              onChange={setVAdvancePaidTime}
            />

            {/* Total Agreed Price */}
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-neutral-400 text-[10px]">
                Total Stay Price (₹)
              </label>
              <input
                type="number"
                step={100}
                value={vAgreedTotal}
                onChange={(e) => setVAgreedTotal(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-gold-gradient font-extrabold text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Advance Amount Paid */}
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-neutral-400 text-[10px]">
                Advance Paid (₹)
              </label>
              <input
                type="number"
                step={100}
                value={vAdvancePaid}
                onChange={(e) => setVAdvancePaid(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-emerald-400 font-bold text-xs focus:border-[#D4AF37] focus:outline-none"
              />
            </div>
          </div>

          {/* Action Bar & Balance Calculation */}
          <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-neutral-400 text-xs uppercase font-bold block">
                  Total Agreed:
                </span>
                <span className="font-extrabold text-white">₹{vAgreedTotal.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-neutral-400 text-xs uppercase font-bold block">
                  Advance Paid:
                </span>
                <span className="font-extrabold text-emerald-400">
                  ₹{vAdvancePaid.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 text-xs uppercase font-bold block">
                  Balance Due at Stay:
                </span>
                <span className="font-extrabold text-[#D4AF37]">
                  ₹{Math.max(0, vAgreedTotal - vAdvancePaid).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const phoneDigits = vGuestPhone.replace(/\D/g, '') || '919392739715';
                  const balance = Math.max(0, vAgreedTotal - vAdvancePaid);
                  const msg = `*PS ELITE HOMESTAY TIRUPATI - OFFICIAL STAY RECEIPT*\n\nNamaste ${
                    vGuestName || 'Valued Guest'
                  }!\nYour stay reservation is confirmed.\n\n*Guest Contact:* ${
                    vGuestPhone || 'N/A'
                  }\n*Accommodation:* ${vRoomType}\n*Check-In:* ${formatDisplayDate(vCheckIn)}\n*Check-Out:* ${formatDisplayDate(vCheckOut)}\n*Timing Policy:* ${vTimingRule}\n*Guests:* ${vAdultsCount} Adult(s), ${vKidsCount} Kid(s)\n\n*Total Agreed Stay Value:* Rs. ${vAgreedTotal.toLocaleString()}\n*Advance Amount Paid:* Rs. ${vAdvancePaid.toLocaleString()} (Paid on ${formatDisplayDate(
                    vAdvancePaidTime
                  )})\n*Balance Due at Check-in:* Rs. ${balance.toLocaleString()}\n\nWe look forward to hosting your pilgrim family. May Lord Venkateswara bless your stay!`;
                  window.open(
                    `https://wa.me/${phoneDigits}?text=${encodeURIComponent(msg)}`,
                    '_blank'
                  );
                }}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2"
              >
                <span>📲 Send Custom Receipt via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const genId = `PSE-${Math.floor(1000 + Math.random() * 9000)}`;
                  addBooking({
                    bookingId: genId,
                    guestName: vGuestName || 'Valued Guest',
                    guestEmail: 'guest@pselite.com',
                    guestPhone: vGuestPhone || '919392739715',
                    room: {
                      id: 'custom-suite',
                      name: vRoomType,
                      category: 'room',
                      tagline: 'Custom Pilgrim Reservation',
                      pricePerNight: vAgreedTotal,
                      originalPrice: vAgreedTotal,
                      guests: vAdultsCount + vKidsCount,
                      areaSqFt: 350,
                      bedrooms: 1,
                      bathrooms: 1,
                      image: '/images/rooms/family-room.webp',
                      gallery: ['/images/rooms/family-room.webp'],
                      amenities: ['AC', 'WiFi'],
                      description: vRoomType,
                      highlights: ['Custom Timing Policy'],
                    },
                    checkIn: vCheckIn,
                    checkOut: vCheckOut,
                    guestsCount: vAdultsCount + vKidsCount,
                    nights: 1,
                    needTemplePickup: false,
                    needExtraBed: false,
                    discountAmount: 0,
                    subtotal: vAgreedTotal,
                    gstTaxes: 0,
                    totalAmount: vAgreedTotal,
                    status: 'Confirmed',
                    paymentMethod: 'Custom Receipt',
                    utrNumber: `Advance Paid on ${formatDisplayDate(vAdvancePaidTime)}`,
                    advancePaid: vAdvancePaid,
                    balanceDue: Math.max(0, vAgreedTotal - vAdvancePaid),
                    paymentPlan: 'ADVANCE',
                    createdAt: new Date().toISOString(),
                  });
                  alert(`Successfully registered ${vGuestName || 'Guest'} (${genId}) into Live Bookings Table!`);
                }}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
              >
                <span>+ Register into Live Bookings Table</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const genId = `PSE-${Math.floor(1000 + Math.random() * 9000)}`;
                  const balance = Math.max(0, vAgreedTotal - vAdvancePaid);
                  const printWin = window.open('', '_blank', 'width=800,height=950');
                  if (!printWin) {
                    alert('Please allow popups to generate and download the PDF Receipt.');
                    return;
                  }
                  printWin.document.write(`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <title>PS Elite Homestays - Official Stay Receipt (${genId})</title>
                        <style>
                          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px; color: #1a1a1a; background: #fff; }
                          .receipt-box { max-width: 680px; margin: 0 auto; border: 2px solid #D4AF37; border-radius: 12px; padding: 36px; }
                          .header { text-align: center; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 24px; }
                          .header h1 { margin: 0; font-size: 26px; color: #111; letter-spacing: 2px; }
                          .header p { margin: 6px 0 0; color: #666; font-size: 13px; }
                          .badge { display: inline-block; background: #FFF9E6; color: #B8860B; border: 1px solid #D4AF37; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; margin-top: 10px; text-transform: uppercase; }
                          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 16px; }
                          .info-item { background: #f9f9f9; border: 1px solid #eee; border-radius: 8px; padding: 12px; }
                          .label { font-size: 11px; color: #777; text-transform: uppercase; margin-bottom: 4px; }
                          .value { font-size: 14px; font-weight: bold; color: #111; }
                          .table { width: 100%; border-collapse: collapse; margin-top: 24px; }
                          .table th, .table td { padding: 12px 14px; border-bottom: 1px solid #eee; text-align: left; font-size: 14px; }
                          .table th { background: #fcfcfc; color: #666; font-size: 12px; text-transform: uppercase; }
                          .balance-row { background: #FFF9E6; font-weight: bold; font-size: 16px; color: #B8860B; }
                          .footer { margin-top: 36px; padding-top: 20px; border-top: 1px dashed #ccc; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #666; }
                          @media print { body { padding: 0; } .receipt-box { border: 1px solid #D4AF37; } }
                        </style>
                      </head>
                      <body>
                        <div class="receipt-box">
                          <div class="header">
                            <h1>PS ELITE HOMESTAYS</h1>
                            <p>Srinivasa Mangapuram Road, Tirupati, Andhra Pradesh - 517505</p>
                            <p>Phone / WhatsApp: +91 93927 39715 | Domain: pselitehomestays.com</p>
                            <div class="badge">Official Stay Receipt</div>
                          </div>
                          <div class="grid">
                            <div class="info-item"><div class="label">Receipt ID</div><div class="value">${genId}</div></div>
                            <div class="info-item"><div class="label">Date Issued</div><div class="value">${new Date().toLocaleDateString('en-IN')}</div></div>
                            <div class="info-item"><div class="label">Pilgrim Guest</div><div class="value">${vGuestName || 'Valued Guest'}</div></div>
                            <div class="info-item"><div class="label">Guest Phone</div><div class="value">${vGuestPhone || 'N/A'}</div></div>
                            <div class="info-item"><div class="label">Accommodation Suites</div><div class="value">${vRoomType}</div></div>
                            <div class="info-item"><div class="label">Check-In Policy</div><div class="value">${vTimingRule}</div></div>
                            <div class="info-item"><div class="label">Check-In Date/Time</div><div class="value">${formatDisplayDate(vCheckIn)}</div></div>
                            <div class="info-item"><div class="label">Check-Out Date/Time</div><div class="value">${formatDisplayDate(vCheckOut)}</div></div>
                            <div class="info-item"><div class="label">Advance Paid Date &amp; Time</div><div class="value">${formatDisplayDate(vAdvancePaidTime)}</div></div>
                            <div class="info-item"><div class="label">Guests</div><div class="value">${vAdultsCount} Adult(s), ${vKidsCount} Kid(s)</div></div>
                          </div>
                          <table class="table">
                            <thead><tr><th>Description</th><th style="text-align: right;">Amount (INR)</th></tr></thead>
                            <tbody>
                              <tr><td>Total Agreed Stay Tariff</td><td style="text-align: right;">₹${vAgreedTotal.toLocaleString('en-IN')}</td></tr>
                              <tr><td>Advance Amount Paid (Paid on ${formatDisplayDate(vAdvancePaidTime)})</td><td style="text-align: right; color: #10B981;">- ₹${vAdvancePaid.toLocaleString('en-IN')}</td></tr>
                              <tr class="balance-row"><td>Balance Due at Stay Check-In</td><td style="text-align: right;">₹${balance.toLocaleString('en-IN')}</td></tr>
                            </tbody>
                          </table>
                          <div class="footer">
                            <div><strong>Note:</strong> Present this official receipt at check-in.<br>May Lord Venkateswara bless your stay!</div>
                            <div style="text-align: right;"><div style="width: 140px; border-bottom: 1px solid #333; margin-bottom: 4px;"></div>Authorized Signatory<br><span style="font-size: 10px; color: #888;">PS Elite Front Desk</span></div>
                          </div>
                        </div>
                        <script>window.onload = function() { window.print(); };</script>
                      </body>
                    </html>
                  `);
                  printWin.document.close();
                }}
                className="px-6 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#c59b27] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
              >
                <span>🖨️ Print / Download PDF Receipt</span>
              </button>
            </div>
          </div>
        </div>

        {/* TAX INVOICE GENERATOR */}
        <div className="bg-white rounded-3xl border-2 border-[#1a2744] shadow-2xl mb-12 overflow-hidden">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-[#1a2744] to-[#2c3e6b] px-6 sm:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-[9px] font-bold uppercase tracking-widest">
                    SAC 996311 · GSTIN: 37ASOPP1099G1Z7
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold tracking-tight uppercase text-white">
                  GST Tax Invoice Generator
                </h2>
                <p className="text-xs text-blue-200 mt-0.5">
                  Accommodation Services · 12% GST (6% CGST + 6% SGST) for tariffs ₹1,001–₹7,500/night
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setTaxShowForm((v) => !v)}
              className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c59b27] text-black font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 shrink-0"
            >
              <FileText className="w-4 h-4" />
              <span>{taxShowForm ? 'Hide Form' : '+ New Tax Invoice'}</span>
            </button>
          </div>

          {taxShowForm && (
            <div className="p-6 sm:p-8">
              {/* GST Slab Info Banner */}
              <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-800">
                <span className="font-bold uppercase tracking-wide">India Hospitality GST Slabs (SAC 996311):</span>
                <div className="mt-2 flex flex-wrap gap-3">
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 font-bold">≤ ₹7,500/night → <span className="text-blue-900">5% GST</span> (2.5% CGST + 2.5% SGST)</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 font-bold">&gt; ₹7,500/night → <span className="text-orange-700">18% GST</span> (9% CGST + 9% SGST)</span>
                </div>
                <p className="mt-2 text-blue-600">PS Elite Homestay rates (₹1,699–₹3,499/night) → <strong>5% GST auto-applied</strong>. You can override below.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                {/* Invoice No */}
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-neutral-500">Invoice No.</label>
                  <input type="text" value={taxInvoiceNo} onChange={(e) => setTaxInvoiceNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 font-mono font-bold text-neutral-900 focus:border-[#1a2744] focus:outline-none" />
                </div>
                {/* Date */}
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-neutral-500">Invoice Date</label>
                  <input type="date" value={taxDate} onChange={(e) => setTaxDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 font-bold text-neutral-900 focus:border-[#1a2744] focus:outline-none" />
                </div>
                {/* Guest Name */}
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-neutral-500">Guest Name *</label>
                  <input type="text" value={taxGuestName} onChange={(e) => setTaxGuestName(e.target.value)}
                    placeholder="e.g. Karthik Reddy"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 font-bold text-neutral-900 focus:border-[#1a2744] focus:outline-none" />
                </div>
                {/* Mobile */}
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-neutral-500">Mobile</label>
                  <input type="tel" value={taxGuestMobile} onChange={(e) => setTaxGuestMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 font-bold text-neutral-900 focus:border-[#1a2744] focus:outline-none" />
                </div>
                {/* Guest GSTIN */}
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-neutral-500">Guest GSTIN (if any)</label>
                  <input type="text" value={taxGuestGSTIN} onChange={(e) => setTaxGuestGSTIN(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 font-mono text-neutral-900 focus:border-[#1a2744] focus:outline-none" />
                </div>
                {/* Room No */}
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-neutral-500">Room No.</label>
                  <input type="text" value={taxRoomNo} onChange={(e) => setTaxRoomNo(e.target.value)}
                    placeholder="e.g. 101"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 font-bold text-neutral-900 focus:border-[#1a2744] focus:outline-none" />
                </div>
                {/* Check-In */}
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-neutral-500">Check-In (Date / Time)</label>
                  <input type="datetime-local" value={taxCheckIn} onChange={(e) => setTaxCheckIn(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 font-bold text-neutral-900 focus:border-[#1a2744] focus:outline-none" />
                </div>
                {/* Check-Out */}
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-neutral-500">Check-Out (Date / Time)</label>
                  <input type="datetime-local" value={taxCheckOut} onChange={(e) => setTaxCheckOut(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 font-bold text-neutral-900 focus:border-[#1a2744] focus:outline-none" />
                </div>
                {/* No. of Guests */}
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-neutral-500">No. of Guests</label>
                  <input type="number" min={1} max={20} value={taxNoOfGuests} onChange={(e) => setTaxNoOfGuests(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 font-bold text-neutral-900 focus:border-[#1a2744] focus:outline-none" />
                </div>
                {/* No. of Nights */}
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-neutral-500">No. of Nights</label>
                  <input type="number" min={1} max={365} value={taxNoOfNights} onChange={(e) => setTaxNoOfNights(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 font-bold text-neutral-900 focus:border-[#1a2744] focus:outline-none" />
                </div>
                {/* Guest Address */}
                <div className="space-y-1 sm:col-span-2 lg:col-span-1">
                  <label className="font-bold uppercase tracking-wider text-neutral-500">Guest Address</label>
                  <input type="text" value={taxGuestAddress} onChange={(e) => setTaxGuestAddress(e.target.value)}
                    placeholder="City, State"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 font-bold text-neutral-900 focus:border-[#1a2744] focus:outline-none" />
                </div>

                {/* Room Category */}
                <div className="space-y-1 col-span-full">
                  <label className="font-bold uppercase tracking-wider text-neutral-500 block mb-2">Room Category &amp; Type</label>
                  <div className="flex flex-wrap gap-3">
                    {['Standard', 'Deluxe', 'Terrace', 'Family'].map((cat) => (
                      <label key={cat} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer font-bold text-xs transition-all ${
                        taxRoomCategory === cat
                          ? 'bg-[#1a2744] text-white border-[#1a2744]'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-300 hover:border-[#1a2744]'
                      }`}>
                        <input type="radio" name="taxRoomCat" value={cat} checked={taxRoomCategory === cat}
                          onChange={() => setTaxRoomCategory(cat)} className="sr-only" />
                        {cat}
                      </label>
                    ))}
                    <div className="flex items-center gap-1 ml-4">
                      <label className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer font-bold text-xs transition-all ${
                        taxIsAC ? 'bg-blue-700 text-white border-blue-700' : 'bg-neutral-50 text-neutral-700 border-neutral-300'
                      }`}>
                        <input type="checkbox" checked={taxIsAC} onChange={() => setTaxIsAC(true)} className="sr-only" />
                        AC
                      </label>
                      <label className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer font-bold text-xs transition-all ${
                        !taxIsAC ? 'bg-neutral-700 text-white border-neutral-700' : 'bg-neutral-50 text-neutral-700 border-neutral-300'
                      }`}>
                        <input type="checkbox" checked={!taxIsAC} onChange={() => setTaxIsAC(false)} className="sr-only" />
                        Non-AC
                      </label>
                    </div>
                  </div>
                </div>

                {/* Charges */}
                <div className="col-span-full border-t border-neutral-200 pt-4">
                  <label className="font-bold uppercase tracking-wider text-neutral-500 block mb-3 text-[11px]">Charges (Taxable)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-500">Room Rent / Night (₹)</label>
                      <input type="number" step={1} value={taxRoomRent} onChange={(e) => setTaxRoomRent(parseInt(e.target.value) || 0)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 font-bold text-neutral-900 focus:border-[#1a2744] focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-500">Rooms × Nights</label>
                      <div className="flex gap-2">
                        <input type="number" min={1} value={taxRoomQty} onChange={(e) => setTaxRoomQty(parseInt(e.target.value) || 1)}
                          placeholder="Rooms"
                          className="w-1/2 px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 font-bold text-neutral-900 focus:border-[#1a2744] focus:outline-none" />
                        <input type="number" min={1} value={taxNoOfNights} onChange={(e) => setTaxNoOfNights(parseInt(e.target.value) || 1)}
                          placeholder="Nights"
                          className="w-1/2 px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 font-bold text-neutral-900 focus:border-[#1a2744] focus:outline-none" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-500">Extra Bed Charges (₹)</label>
                      <input type="number" step={50} value={taxExtraBed} onChange={(e) => setTaxExtraBed(parseInt(e.target.value) || 0)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 font-bold text-neutral-900 focus:border-[#1a2744] focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-500">Other Charges (₹)</label>
                      <input type="number" step={50} value={taxOtherCharges} onChange={(e) => setTaxOtherCharges(parseInt(e.target.value) || 0)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 font-bold text-neutral-900 focus:border-[#1a2744] focus:outline-none" />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-semibold text-neutral-500">Other Charges Description</label>
                      <input type="text" value={taxOtherDesc} onChange={(e) => setTaxOtherDesc(e.target.value)}
                        placeholder="e.g. Laundry, Food, etc."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-neutral-900 focus:border-[#1a2744] focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-500">Advance Paid (₹)</label>
                      <input type="number" step={100} value={taxAdvancePaid} onChange={(e) => setTaxAdvancePaid(parseInt(e.target.value) || 0)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 font-bold text-emerald-700 focus:border-[#1a2744] focus:outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-neutral-500">Payment Mode</label>
                      <select value={taxPaymentMode} onChange={(e) => setTaxPaymentMode(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 font-bold text-neutral-900 focus:border-[#1a2744] focus:outline-none">
                        <option>Cash</option>
                        <option>UPI</option>
                        <option>Card</option>
                        <option>Bank Transfer</option>
                        <option>Cash + UPI</option>
                        <option>Cash + Card</option>
                      </select>
                    </div>
                    {/* GST Rate Override */}
                    <div className="space-y-1 col-span-full sm:col-span-1">
                      <label className="font-semibold text-neutral-500 flex items-center gap-1.5">
                        GST Rate
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold uppercase tracking-wide">Configurable</span>
                      </label>
                      <select value={taxGSTMode} onChange={(e) => setTaxGSTMode(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border-2 border-blue-300 font-bold text-[#1a2744] focus:border-blue-500 focus:outline-none">
                        <option value="AUTO">Auto (5% ≤₹7,500 / 18% &gt;₹7,500)</option>
                        <option value="5">5% — 2.5% CGST + 2.5% SGST (≤₹7,500)</option>
                        <option value="18">18% — 9% CGST + 9% SGST (&gt;₹7,500)</option>
                        <option value="0">0% — Exempt (Special / Government)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Tax Calculation Summary */}
              {(() => {
                const roomTotal = taxRoomRent * taxRoomQty * taxNoOfNights;
                const subtotal = roomTotal + taxExtraBed + taxOtherCharges;
                const autoRate = taxRoomRent <= 7500 ? 0.05 : 0.18;
                const gstRate = taxGSTMode === 'AUTO' ? autoRate : (taxGSTMode === '0' ? 0 : taxGSTMode === '5' ? 0.05 : 0.18);
                const halfRate = gstRate / 2;
                const cgst = Math.round(subtotal * halfRate * 100) / 100;
                const sgst = cgst;
                const grandTotal = subtotal + cgst + sgst;
                const balance = Math.max(0, grandTotal - taxAdvancePaid);
                const pct = Math.round(gstRate * 100);
                const halfPct = pct / 2;
                return (
                  <div className="mt-6 p-5 rounded-2xl bg-[#1a2744]/5 border border-[#1a2744]/20">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1a2744] mb-3">Live Tax Calculation Preview</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-white border border-neutral-200">
                        <span className="text-neutral-500 font-bold uppercase block">Room Rent Total</span>
                        <span className="text-lg font-extrabold font-mono text-neutral-900">₹{roomTotal.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-neutral-400 block">{taxRoomQty} room(s) × {taxNoOfNights} night(s)</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-neutral-200">
                        <span className="text-neutral-500 font-bold uppercase block">Subtotal (Taxable)</span>
                        <span className="text-lg font-extrabold font-mono text-neutral-900">₹{subtotal.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-neutral-400 block">incl. extra bed &amp; other charges</span>
                      </div>
                      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                        <span className="text-blue-700 font-bold uppercase block">CGST ({halfPct}%) + SGST ({halfPct}%)</span>
                        <span className="text-lg font-extrabold font-mono text-blue-800">₹{(cgst + sgst).toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-blue-500 block">
                          {pct === 0 ? '0% Exempt' : `${pct}% GST ${taxGSTMode === 'AUTO' ? '(Auto)' : '(Manual)'}`}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#1a2744] border border-[#1a2744]">
                        <span className="text-blue-200 font-bold uppercase block">Grand Total</span>
                        <span className="text-lg font-extrabold font-mono text-[#D4AF37]">₹{grandTotal.toLocaleString('en-IN')}</span>
                        <span className="text-[10px] text-blue-300 block">Balance: ₹{balance.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Print Button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const roomTotal = taxRoomRent * taxRoomQty * taxNoOfNights;
                    const subtotal = roomTotal + taxExtraBed + taxOtherCharges;
                    const autoRate = taxRoomRent <= 7500 ? 0.05 : 0.18;
                    const gstRate = taxGSTMode === 'AUTO' ? autoRate : (taxGSTMode === '0' ? 0 : taxGSTMode === '5' ? 0.05 : 0.18);
                    const halfRate = gstRate / 2;
                    const cgst = Math.round(subtotal * halfRate * 100) / 100;
                    const sgst = cgst;
                    const grandTotal = subtotal + cgst + sgst;
                    const balance = Math.max(0, grandTotal - taxAdvancePaid);
                    const pct = Math.round(gstRate * 100);
                    const halfPct = pct / 2;

                    // Amount in Words helper
                    const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
                    const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
                    const toWords = (n: number): string => {
                      if (n === 0) return 'Zero';
                      if (n < 20) return ones[n];
                      if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? ' ' + ones[n%10] : '');
                      if (n < 1000) return ones[Math.floor(n/100)] + ' Hundred' + (n%100 ? ' ' + toWords(n%100) : '');
                      if (n < 100000) return toWords(Math.floor(n/1000)) + ' Thousand' + (n%1000 ? ' ' + toWords(n%1000) : '');
                      if (n < 10000000) return toWords(Math.floor(n/100000)) + ' Lakh' + (n%100000 ? ' ' + toWords(n%100000) : '');
                      return toWords(Math.floor(n/10000000)) + ' Crore' + (n%10000000 ? ' ' + toWords(n%10000000) : '');
                    };
                    const amtWords = toWords(Math.floor(grandTotal)) + ' Rupees Only';

                    const printWin = window.open('', '_blank', 'width=900,height=1100');
                    if (!printWin) { alert('Please allow popups to print the Tax Invoice.'); return; }
                    printWin.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Tax Invoice - ${taxInvoiceNo} - PS Elite Homestay</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background: #fff; color: #1a1a1a; font-size: 12px; }
    .page { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 0; }
    /* TOP HEADER */
    .top-header { background: #1a2744; display: flex; align-items: center; justify-content: space-between; padding: 18px 28px; }
    .logo-area { display: flex; align-items: center; gap: 14px; }
    .logo-box { width: 56px; height: 56px; background: #D4AF37; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 22px; font-weight: 900; color: #1a2744; letter-spacing: -1px; }
    .logo-text h1 { color: #fff; font-size: 20px; font-weight: 900; letter-spacing: 1px; line-height: 1.1; }
    .logo-text p { color: #93c5fd; font-size: 10px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px; }
    .invoice-title-area { text-align: right; }
    .invoice-title-area h2 { color: #D4AF37; font-size: 28px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }
    .invoice-title-area p { color: #93c5fd; font-size: 10px; font-weight: 600; letter-spacing: 1px; }
    .invoice-title-area .original { color: #fcd34d; font-style: italic; font-size: 10px; }
    /* ADDRESS STRIP */
    .address-strip { display: flex; justify-content: space-between; align-items: flex-start; padding: 14px 28px 10px; border-bottom: 2px solid #1a2744; gap: 20px; }
    .address-left h3 { font-size: 13px; font-weight: 800; color: #1a2744; letter-spacing: 0.5px; margin-bottom: 3px; }
    .address-left p { font-size: 10.5px; color: #374151; line-height: 1.6; }
    .address-right { text-align: right; }
    .address-right p { font-size: 10.5px; color: #374151; line-height: 1.7; }
    /* SECTION HEADER */
    .section-header { background: #1a2744; color: #fff; font-size: 11px; font-weight: 800; letter-spacing: 1.5px; text-transform: uppercase; padding: 7px 28px; }
    /* GUEST DETAILS GRID */
    .guest-grid { display: grid; grid-template-columns: 1fr 1fr; border-left: 1px solid #d1d5db; margin: 0 28px; }
    .guest-cell { border-right: 1px solid #d1d5db; border-bottom: 1px solid #d1d5db; padding: 7px 12px; }
    .guest-cell.full { grid-column: span 2; }
    .cell-label { font-size: 10px; color: #6b7280; font-weight: 600; margin-bottom: 2px; }
    .cell-value { font-size: 12px; font-weight: 700; color: #111; }
    /* ROOM CATEGORY */
    .cat-row { display: flex; align-items: center; gap: 24px; padding: 10px 28px; border-bottom: 1px solid #e5e7eb; }
    .cat-row span { font-size: 11px; font-weight: 700; color: #374151; text-transform: uppercase; letter-spacing: 0.5px; margin-right: 8px; }
    .cat-box { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; color: #374151; }
    .cat-box .chk { width: 13px; height: 13px; border: 1.5px solid #374151; display: inline-block; border-radius: 2px; position: relative; }
    .cat-box.selected .chk::after { content: '✓'; position: absolute; top: -2px; left: 1px; font-size: 10px; color: #1a2744; font-weight: 900; }
    /* CHARGES TABLE */
    .charges-section { margin: 0 28px 0; }
    .charges-table { width: 100%; border-collapse: collapse; }
    .charges-table th { background: #1a2744; color: #fff; font-size: 11px; font-weight: 700; padding: 8px 12px; text-align: left; letter-spacing: 0.5px; }
    .charges-table th:last-child, .charges-table td:last-child { text-align: right; }
    .charges-table td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-size: 12px; color: #1a1a1a; }
    .charges-table tr:nth-child(even) td { background: #f9fafb; }
    /* TOTALS */
    .totals-section { display: flex; gap: 0; margin: 0 28px; border: 1px solid #d1d5db; border-top: none; }
    .amount-words { flex: 1; border-right: 1px solid #d1d5db; padding: 10px 12px; }
    .amount-words .aw-label { font-size: 10px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .amount-words .aw-value { font-size: 11.5px; font-weight: 700; color: #1a2744; font-style: italic; }
    .totals-right { width: 300px; }
    .total-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 12px; border-bottom: 1px solid #e5e7eb; font-size: 12px; }
    .total-row .tl { font-weight: 600; color: #374151; }
    .total-row .tv { font-weight: 700; color: #111; font-family: monospace; }
    .grand-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: #1a2744; }
    .grand-row .gl { font-size: 13px; font-weight: 900; color: #fff; letter-spacing: 0.5px; text-transform: uppercase; }
    .grand-row .gv { font-size: 14px; font-weight: 900; color: #D4AF37; font-family: monospace; }
    .adv-row { display: flex; justify-content: space-between; padding: 7px 12px; border-bottom: 1px solid #e5e7eb; }
    .adv-row .tl { font-size: 11px; font-weight: 600; color: #374151; }
    .adv-row .tv { font-size: 12px; font-weight: 700; color: #059669; font-family: monospace; }
    .bal-row { display: flex; justify-content: space-between; padding: 7px 12px; }
    .bal-row .tl { font-size: 11px; font-weight: 700; color: #1a2744; }
    .bal-row .tv { font-size: 12px; font-weight: 900; color: #dc2626; font-family: monospace; }
    /* PAYMENT MODE */
    .payment-section { display: flex; align-items: center; gap: 20px; padding: 10px 28px; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; margin: 0; }
    .payment-section .pm-label { font-size: 11px; font-weight: 800; text-transform: uppercase; color: #374151; letter-spacing: 0.5px; }
    /* SIGNATURES */
    .sig-section { display: flex; justify-content: space-between; align-items: flex-end; padding: 20px 28px 14px; }
    .sig-box { text-align: center; }
    .sig-line { width: 160px; border-bottom: 1px solid #374151; margin-bottom: 5px; }
    .sig-label { font-size: 10.5px; color: #374151; font-weight: 600; }
    .sig-label strong { display: block; font-size: 11px; font-weight: 800; color: #1a2744; }
    /* FOOTER */
    .footer-bar { background: #1a2744; padding: 12px 28px; display: flex; justify-content: center; align-items: center; gap: 20px; }
    .footer-bar p { color: #93c5fd; font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-align: center; }
    .thank-you { text-align: center; padding: 10px 28px 6px; background: #f0f4ff; }
    .thank-you p { color: #1a2744; font-size: 11px; font-weight: 700; }
    .disclaimer { padding: 6px 28px 8px; }
    .disclaimer p { font-size: 9.5px; color: #9ca3af; }
    @media print { body { margin: 0; } .page { width: 100%; } }
  </style>
</head>
<body>
<div class="page">
  <!-- TOP HEADER -->
  <div class="top-header">
    <div class="logo-area">
      <div class="logo-box">PS</div>
      <div class="logo-text">
        <h1>PS ELITE HOME STAY</h1>
        <p>Feels Like Home</p>
      </div>
    </div>
    <div class="invoice-title-area">
      <h2>TAX INVOICE</h2>
      <p>Accommodation Services &nbsp;|&nbsp; SAC 996311</p>
      <p class="original">Original for Recipient</p>
    </div>
  </div>

  <!-- ADDRESS STRIP -->
  <div class="address-strip">
    <div class="address-left">
      <h3>PS ELITE HOMESTAY</h3>
      <p>19-4-8/D/9A, STV Nagar, Air Bypass Road, Near PLR Convention Hall,<br>Behind Jawalnidhi, Tirupati - 517501, Andhra Pradesh</p>
    </div>
    <div class="address-right">
      <p><strong>GSTIN: 37ASOPP1099G1Z7</strong></p>
      <p>Email: pselitehomestays@gmail.com</p>
      <p>Phone: 9392739715</p>
    </div>
  </div>

  <!-- GUEST & STAY DETAILS -->
  <div class="section-header">Guest &amp; Stay Details</div>
  <div class="guest-grid">
    <div class="guest-cell"><div class="cell-label">Invoice No.</div><div class="cell-value">${taxInvoiceNo}</div></div>
    <div class="guest-cell"><div class="cell-label">Date</div><div class="cell-value">${new Date(taxDate).toLocaleDateString('en-IN', {day:'2-digit',month:'2-digit',year:'numeric'})}</div></div>
    <div class="guest-cell"><div class="cell-label">Guest Name</div><div class="cell-value">${taxGuestName || '—'}</div></div>
    <div class="guest-cell"><div class="cell-label">Mobile</div><div class="cell-value">${taxGuestMobile || '—'}</div></div>
    <div class="guest-cell"><div class="cell-label">Guest GSTIN (if any)</div><div class="cell-value">${taxGuestGSTIN || '—'}</div></div>
    <div class="guest-cell"><div class="cell-label">Room No.</div><div class="cell-value">${taxRoomNo || '—'}</div></div>
    <div class="guest-cell"><div class="cell-label">Check-In (Date / Time)</div><div class="cell-value">${formatDisplayDate(taxCheckIn)}</div></div>
    <div class="guest-cell"><div class="cell-label">Check-Out (Date / Time)</div><div class="cell-value">${formatDisplayDate(taxCheckOut)}</div></div>
    <div class="guest-cell"><div class="cell-label">No. of Guests</div><div class="cell-value">${taxNoOfGuests}</div></div>
    <div class="guest-cell"><div class="cell-label">No. of Nights</div><div class="cell-value">${taxNoOfNights}</div></div>
    <div class="guest-cell full"><div class="cell-label">Guest Address</div><div class="cell-value">${taxGuestAddress || '—'}</div></div>
  </div>

  <!-- ROOM CATEGORY -->
  <div class="cat-row">
    <span>Room Category</span>
    ${['Standard','Deluxe','Terrace','Family'].map(cat => `<div class="cat-box ${taxRoomCategory === cat ? 'selected' : ''}"><span class="chk"></span>${cat}</div>`).join('')}
    &nbsp;&nbsp;
    <span>AC / Non-AC</span>
    <div class="cat-box ${taxIsAC ? 'selected' : ''}"><span class="chk"></span>AC</div>
    <div class="cat-box ${!taxIsAC ? 'selected' : ''}"><span class="chk"></span>Non-AC</div>
  </div>

  <!-- CHARGES TABLE -->
  <div class="charges-section">
    <table class="charges-table">
      <thead>
        <tr>
          <th>Particulars</th>
          <th>Date</th>
          <th>Rate (Rs.)</th>
          <th>Qty</th>
          <th>Amount (Rs.)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Room Rent (${taxRoomCategory} ${taxIsAC ? 'AC' : 'Non-AC'}) × ${taxNoOfNights} Night(s)</td>
          <td>${new Date(taxDate).toLocaleDateString('en-IN')}</td>
          <td>₹${taxRoomRent.toLocaleString('en-IN')}</td>
          <td>${taxRoomQty}</td>
          <td>₹${roomTotal.toLocaleString('en-IN')}</td>
        </tr>
        <tr>
          <td>Extra Bed Charges</td>
          <td></td>
          <td></td>
          <td></td>
          <td>${taxExtraBed > 0 ? '₹' + taxExtraBed.toLocaleString('en-IN') : '—'}</td>
        </tr>
        <tr>
          <td>Other Charges${taxOtherDesc ? ': ' + taxOtherDesc : ''}</td>
          <td></td>
          <td></td>
          <td></td>
          <td>${taxOtherCharges > 0 ? '₹' + taxOtherCharges.toLocaleString('en-IN') : '—'}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- TOTALS + AMOUNT IN WORDS -->
  <div class="totals-section">
    <div class="amount-words">
      <div class="aw-label">Amount In Words</div>
      <div class="aw-value">${amtWords}</div>
      <div style="margin-top:12px;">
        <div class="aw-label" style="margin-bottom:6px;">Payment Mode</div>
        <div style="display:flex;gap:14px;">
          ${['Cash','UPI','Card','Bank Transfer'].map(pm => `<div class="cat-box ${taxPaymentMode === pm || taxPaymentMode.includes(pm) ? 'selected' : ''}"><span class="chk"></span><span style="font-size:11px;font-weight:700;">${pm}</span></div>`).join('')}
        </div>
      </div>
    </div>
    <div class="totals-right">
      <div class="total-row"><span class="tl">Subtotal / Taxable Amount</span><span class="tv">₹${subtotal.toLocaleString('en-IN')}</span></div>
      <div class="total-row"><span class="tl">CGST @ ${halfPct}%</span><span class="tv">₹${cgst.toLocaleString('en-IN')}</span></div>
      <div class="total-row"><span class="tl">SGST @ ${halfPct}%</span><span class="tv">₹${sgst.toLocaleString('en-IN')}</span></div>
      <div class="grand-row"><span class="gl">Grand Total</span><span class="gv">Rs. ${grandTotal.toLocaleString('en-IN')}</span></div>
      <div class="adv-row"><span class="tl">Advance Paid</span><span class="tv">₹${taxAdvancePaid.toLocaleString('en-IN')}</span></div>
      <div class="bal-row"><span class="tl">Balance Paid</span><span class="tv">₹${balance.toLocaleString('en-IN')}</span></div>
    </div>
  </div>

  <!-- DISCLAIMER -->
  <div class="disclaimer">
    <p>SAC 996311 — Accommodation services. GST as applicable on tariff.</p>
    <p>E. &amp; O.E. &nbsp; This is a computer-generated tax invoice.</p>
  </div>

  <!-- SIGNATURES -->
  <div class="sig-section">
    <div class="sig-box">
      <div class="sig-line"></div>
      <div class="sig-label">Customer Signature</div>
    </div>
    <div class="sig-box" style="text-align:right;">
      <div class="sig-line" style="margin-left:auto;"></div>
      <div class="sig-label">Authorized Signature<strong>For PS Elite Homestay</strong></div>
    </div>
  </div>

  <!-- FOOTER -->
  <div class="thank-you">
    <p>Thank you for choosing PS Elite Homestay. We look forward to welcoming you again!</p>
  </div>
  <div class="footer-bar">
    <p>FEELS LIKE HOME &nbsp;|&nbsp; pselitehomestays@gmail.com &nbsp;|&nbsp; GSTIN 37ASOPP1099G1Z7</p>
  </div>
</div>
<script>window.onload = function() { window.print(); };<\/script>
</body>
</html>`);
                    printWin.document.close();
                  }}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#1a2744] to-[#2c3e6b] hover:from-[#2c3e6b] hover:to-[#1a2744] text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-lg shadow-[#1a2744]/30 flex items-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>🖨️ Print / Download GST Tax Invoice (PDF)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* BOOKINGS MANAGEMENT TABLE */}
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-neutral-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 uppercase tracking-wider">
                Live Bookings &amp; Pilgrim Reservations
              </h2>
              <p className="text-xs text-neutral-600 font-medium">
                Filter by stay status and update guest check-in records.
              </p>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Today's Quick Filter */}
              <button
                type="button"
                onClick={() => setSelectedBookingDateFilter('TODAY')}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 border ${
                  selectedBookingDateFilter === 'TODAY'
                    ? 'bg-[#B8860B] text-white border-[#B8860B] shadow-md'
                    : 'bg-amber-50 text-[#B8860B] border-amber-200 hover:bg-amber-100'
                }`}
              >
                <span>🌟 Today&apos;s Active ({todaysBookingsCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBookingDateFilter('ALL')}
                className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                  selectedBookingDateFilter === 'ALL'
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 border-neutral-300 hover:bg-neutral-200'
                }`}
              >
                <span>All Dates</span>
              </button>

              {/* Specific Date Picker */}
              <div className="flex items-center gap-1.5 bg-neutral-100 px-2.5 py-1.5 rounded-xl border border-neutral-300">
                <span className="text-[10px] font-bold text-neutral-500 uppercase">Date:</span>
                <input
                  type="date"
                  value={
                    selectedBookingDateFilter === 'ALL' || selectedBookingDateFilter === 'TODAY'
                      ? ''
                      : selectedBookingDateFilter
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedBookingDateFilter(val || 'ALL');
                  }}
                  className="bg-transparent text-xs font-bold text-neutral-800 focus:outline-none"
                />
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search guest or booking ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white border border-neutral-300 rounded-xl pl-9 pr-4 py-2 text-xs text-neutral-900 font-medium focus:outline-none focus:border-[#B8860B] shadow-sm"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs text-neutral-900 font-bold focus:outline-none focus:border-[#B8860B] shadow-sm"
              >
                <option value="All">All Statuses</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Checked In">Checked In</option>
                <option value="Pending">Pending</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-100 uppercase tracking-wider text-neutral-600 font-bold border-b border-neutral-200">
                  <th className="p-4">Receipt ID</th>
                  <th className="p-4">Pilgrim Guest</th>
                  <th className="p-4">Sanctuary</th>
                  <th className="p-4">Dates</th>
                  <th className="p-4">Add-ons</th>
                  <th className="p-4">Total Paid</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">WhatsApp Communication</th>
                  <th className="p-4 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredBookings.map((b) => {
                  const phoneDigits = b.guestPhone.replace(/\D/g, '') || '919392739715';
                  const welcomeMsg = `Namaste ${b.guestName}!\nWarm greetings from PS Elite Homestay Tirupati.\n\nWe are delighted to assist you with your booking (${b.bookingId}) for ${b.room.name} from ${formatDisplayDate(b.checkIn)} to ${formatDisplayDate(b.checkOut)}.\n\nPlease let us know your arrival time or if you need any other assistance!`;
                  const reviewMsg = `Namaste ${b.guestName}!\nWe hope you had a blessed darshan and a peaceful stay at PS Elite Homestay Tirupati.\n\nCould you please take 30 seconds to share your review on Google? Your review helps pilgrim families discover our homestay!\n\nClick here to Review: https://g.page/r/CUrLKvmEc7ihEAE/review\n\nMay Lord Venkateswara bless your family!`;

                  return (
                    <tr key={b.bookingId} className="hover:bg-amber-50/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#B8860B]">{b.bookingId}</td>
                      <td className="p-4">
                        <p className="font-bold text-neutral-900">{b.guestName}</p>
                        <p className="text-neutral-500 font-medium">{b.guestPhone}</p>
                      </td>
                      <td className="p-4 font-bold text-neutral-800">{b.room.name}</td>
                      <td className="p-4 text-neutral-700">
                        <p className="font-semibold">{formatDisplayDate(b.checkIn)} to {formatDisplayDate(b.checkOut)}</p>
                        <p className="text-neutral-500">{b.nights} night(s) &bull; {b.guestsCount} guests</p>
                      </td>
                      <td className="p-4">
                        {b.needTemplePickup ? (
                          <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                            VIP Cab Pickup
                          </span>
                        ) : (
                          <span className="text-neutral-400 font-medium">—</span>
                        )}
                      </td>
                      <td className="p-4 font-mono font-bold text-neutral-900 text-sm">
                        ₹{b.totalAmount.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            b.status === 'Confirmed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : b.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : b.status === 'Checked In'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : b.status === 'Cancelled'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-neutral-100 text-neutral-700 border border-neutral-300'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1.5 min-w-[170px]">
                          <a
                            href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(welcomeMsg)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm transition-all"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Chat on WhatsApp</span>
                          </a>
                          <a
                            href={`https://wa.me/${phoneDigits}?text=${encodeURIComponent(reviewMsg)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-[#B8860B] font-bold text-[11px] transition-all"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>Ask Next-Day Review</span>
                          </a>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={b.status}
                          onChange={(e) => updateBookingStatus(b.bookingId, e.target.value as any)}
                          className="bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-neutral-900 focus:border-[#B8860B] shadow-sm"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Checked In">Checked In</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
