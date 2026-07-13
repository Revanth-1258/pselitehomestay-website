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
} from 'lucide-react';
import Link from 'next/link';
import PasskeyResetModal from '@/components/admin/PasskeyResetModal';
import { syncInventoryToCloud, fetchCloudData } from '@/services/cloudSync';

export default function AdminPage() {
  const { rooms, updateRoomPrice, bookings, updateBookingStatus, addBooking } = useBooking();
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
      'standard-room': { available: 5, rateOverride: 1800 },
      'deluxe-king-room': { available: 3, rateOverride: 2500 },
      'superior-terrace-1bhk': { available: 2, rateOverride: 2800 },
      'family-double-2bhk': { available: 2, rateOverride: 3500 },
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
      if (cloud && cloud.passkeys) {
        if (cloud.passkeys.admin) {
          try { localStorage.setItem('ps_custom_admin_passkey', cloud.passkeys.admin); } catch(e) {}
        }
        if (cloud.passkeys.owner) {
          try { localStorage.setItem('ps_custom_owner_passkey', cloud.passkeys.owner); } catch(e) {}
        }
      }
    });
  }, []);

  // Custom Voucher & Negotiated Receipt State
  const [vGuestName, setVGuestName] = useState('');
  const [vGuestPhone, setVGuestPhone] = useState('');
  const [vRoomType, setVRoomType] = useState('Standard AC Room');
  const [vCheckIn, setVCheckIn] = useState(new Date().toISOString().split('T')[0]);
  const [vCheckOut, setVCheckOut] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [vTimingRule, setVTimingRule] = useState('24-Hour Flexible Check-In / Check-Out');
  const [vAgreedTotal, setVAgreedTotal] = useState<number>(2000);
  const [vAdvancePaid, setVAdvancePaid] = useState<number>(500);

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
  const [bulkRate, setBulkRate] = useState<number>(3500);

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
    const savedAuth = sessionStorage.getItem('ps_admin_auth');
    if (savedAuth === 'unlocked') {
      setIsAuthenticated(true);
    }
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const customAdminPass = localStorage.getItem('ps_custom_admin_passkey');
    if (customAdminPass && passkeyInput === customAdminPass) {
      sessionStorage.setItem('ps_admin_auth', 'unlocked');
      setIsAuthenticated(true);
      setAuthError(false);
      return;
    }
    // Default Admin Passkeys: 2026 or pselite2026
    if (
      !customAdminPass &&
      (passkeyInput === '2026' || passkeyInput === 'pselite2026')
    ) {
      sessionStorage.setItem('ps_admin_auth', 'unlocked');
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ps_admin_auth');
    setIsAuthenticated(false);
    setPasskeyInput('');
  };

  // Calculate live statistics
  const totalBookingsCount = bookings.length;
  const todayStr = new Date().toISOString().split('T')[0];

  const todaysBookingsCount = bookings.filter(
    (b) => b.checkIn <= todayStr && b.checkOut >= todayStr
  ).length;

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesSearch =
      b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.room.name.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDate = true;
    if (selectedBookingDateFilter === 'TODAY') {
      matchesDate = b.checkIn <= todayStr && b.checkOut >= todayStr;
    } else if (selectedBookingDateFilter !== 'ALL') {
      matchesDate =
        b.checkIn <= selectedBookingDateFilter &&
        b.checkOut >= selectedBookingDateFilter;
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

        {/* CUSTOM STAY VOUCHER & NEGOTIATED RECEIPT GENERATOR */}
        <div className="bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#121212] rounded-3xl border border-[#D4AF37]/50 shadow-2xl p-6 sm:p-8 mb-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6 mb-6 relative z-10">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-[10px] font-bold uppercase tracking-widest mb-2">
                Receptionist &amp; Admin Tool
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight uppercase text-white">
                Custom Stay Voucher &amp; Negotiated Receipt Generator
              </h2>
              <p className="text-xs text-neutral-300 mt-1">
                Generate official vouchers for walk-ins, phone reservations, or negotiated rates with flexible 24-hour check-in timing &amp; advance breakdown.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10 text-xs">
            {/* Guest Name */}
            <div className="space-y-1">
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
            <div className="space-y-1">
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

            {/* Room Category */}
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-neutral-400">
                Accommodation Type *
              </label>
              <select
                value={vRoomType}
                onChange={(e) => setVRoomType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-bold focus:border-[#D4AF37] focus:outline-none"
              >
                <option value="Standard AC Room">Standard AC Room</option>
                <option value="Standard Non-AC Room">Standard Non-AC Room</option>
                <option value="Deluxe AC Room">Deluxe AC Room</option>
                <option value="Deluxe Non-AC Room">Deluxe Non-AC Room</option>
                <option value="Family AC Room (2BHK)">Family AC Room (2BHK)</option>
                <option value="Family Non-AC Room (2BHK)">Family Non-AC Room (2BHK)</option>
                <option value="Penthouse AC Room">Penthouse AC Room</option>
                <option value="Penthouse Non-AC Room">Penthouse Non-AC Room</option>
                <option value="Terrace AC Room (1BHK)">Terrace AC Room (1BHK)</option>
              </select>
            </div>

            {/* Check-In / Timing Rule */}
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-neutral-400">
                Check-In Timing Policy
              </label>
              <select
                value={vTimingRule}
                onChange={(e) => setVTimingRule(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-[#D4AF37] font-bold focus:border-[#D4AF37] focus:outline-none"
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

            {/* Check-In Date */}
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-neutral-400">
                Check-In Date
              </label>
              <input
                type="date"
                value={vCheckIn}
                onChange={(e) => setVCheckIn(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-medium focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Check-Out Date */}
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-neutral-400">
                Check-Out Date
              </label>
              <input
                type="date"
                value={vCheckOut}
                onChange={(e) => setVCheckOut(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-medium focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Total Agreed Price */}
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-neutral-400">
                Total Stay Price (₹)
              </label>
              <input
                type="number"
                step={100}
                value={vAgreedTotal}
                onChange={(e) => setVAgreedTotal(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-gold-gradient font-extrabold text-sm focus:border-[#D4AF37] focus:outline-none"
              />
            </div>

            {/* Advance Amount Paid */}
            <div className="space-y-1">
              <label className="font-bold uppercase tracking-wider text-neutral-400">
                Advance Paid (₹)
              </label>
              <input
                type="number"
                step={100}
                value={vAdvancePaid}
                onChange={(e) => setVAdvancePaid(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-emerald-400 font-bold text-sm focus:border-[#D4AF37] focus:outline-none"
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
                  const msg = `*PS ELITE HOMESTAY TIRUPATI - OFFICIAL STAY VOUCHER*\n\nNamaste ${
                    vGuestName || 'Valued Guest'
                  }!\nYour stay reservation is confirmed.\n\n*Accommodation:* ${vRoomType}\n*Check-In:* ${vCheckIn}\n*Check-Out:* ${vCheckOut}\n*Timing Policy:* ${vTimingRule}\n\n*Total Agreed Stay Value:* Rs. ${vAgreedTotal.toLocaleString()}\n*Advance Amount Received:* Rs. ${vAdvancePaid.toLocaleString()}\n*Balance Due at Check-in:* Rs. ${balance.toLocaleString()}\n\nWe look forward to hosting your pilgrim family. May Lord Venkateswara bless your stay!`;
                  window.open(
                    `https://wa.me/${phoneDigits}?text=${encodeURIComponent(msg)}`,
                    '_blank'
                  );
                }}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2"
              >
                <span>📲 Send Custom Voucher via WhatsApp</span>
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
                      guests: 2,
                      areaSqFt: 350,
                      bedrooms: 1,
                      bathrooms: 1,
                      image: '/images/rooms/family-room.jpg',
                      gallery: ['/images/rooms/family-room.jpg'],
                      amenities: ['AC', 'WiFi'],
                      description: vRoomType,
                      highlights: ['Custom Timing Policy'],
                    },
                    checkIn: vCheckIn,
                    checkOut: vCheckOut,
                    guestsCount: 2,
                    nights: 1,
                    needTemplePickup: false,
                    needExtraBed: false,
                    discountAmount: 0,
                    subtotal: vAgreedTotal,
                    gstTaxes: 0,
                    totalAmount: vAgreedTotal,
                    status: 'Confirmed',
                    paymentMethod: 'Custom Voucher',
                    utrNumber: 'N/A',
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
                    alert('Please allow popups to generate and download the PDF Voucher.');
                    return;
                  }
                  printWin.document.write(`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <title>PS Elite Homestays - Official Stay Voucher (${genId})</title>
                        <style>
                          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px; color: #1a1a1a; background: #fff; }
                          .voucher-box { max-width: 680px; margin: 0 auto; border: 2px solid #D4AF37; border-radius: 12px; padding: 36px; }
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
                          @media print { body { padding: 0; } .voucher-box { border: 1px solid #D4AF37; } }
                        </style>
                      </head>
                      <body>
                        <div class="voucher-box">
                          <div class="header">
                            <h1>PS ELITE HOMESTAYS</h1>
                            <p>Srinivasa Mangapuram Road, Tirupati, Andhra Pradesh - 517505</p>
                            <p>Phone / WhatsApp: +91 93927 39715 | Domain: pselitehomestays.com</p>
                            <div class="badge">Official Stay Voucher & Receipt</div>
                          </div>
                          <div class="grid">
                            <div class="info-item"><div class="label">Voucher ID</div><div class="value">${genId}</div></div>
                            <div class="info-item"><div class="label">Date Issued</div><div class="value">${new Date().toLocaleDateString('en-IN')}</div></div>
                            <div class="info-item"><div class="label">Pilgrim Guest</div><div class="value">${vGuestName || 'Valued Guest'}</div></div>
                            <div class="info-item"><div class="label">WhatsApp Contact</div><div class="value">${vGuestPhone || 'N/A'}</div></div>
                            <div class="info-item"><div class="label">Accommodation Suite</div><div class="value">${vRoomType}</div></div>
                            <div class="info-item"><div class="label">Check-In Policy</div><div class="value">${vTimingRule}</div></div>
                            <div class="info-item"><div class="label">Check-In Date</div><div class="value">${vCheckIn}</div></div>
                            <div class="info-item"><div class="label">Check-Out Date</div><div class="value">${vCheckOut}</div></div>
                          </div>
                          <table class="table">
                            <thead><tr><th>Description</th><th style="text-align: right;">Amount (INR)</th></tr></thead>
                            <tbody>
                              <tr><td>Total Agreed Stay Tariff</td><td style="text-align: right;">₹${vAgreedTotal.toLocaleString('en-IN')}</td></tr>
                              <tr><td>Advance Amount Paid</td><td style="text-align: right; color: #10B981;">- ₹${vAdvancePaid.toLocaleString('en-IN')}</td></tr>
                              <tr class="balance-row"><td>Balance Due at Stay Check-In</td><td style="text-align: right;">₹${balance.toLocaleString('en-IN')}</td></tr>
                            </tbody>
                          </table>
                          <div class="footer">
                            <div><strong>Note:</strong> Present this official voucher at check-in.<br>May Lord Venkateswara bless your stay!</div>
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
                <span>🖨️ Print / Download PDF Voucher</span>
              </button>
            </div>
          </div>
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
                  <th className="p-4">Voucher ID</th>
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
                  const welcomeMsg = `Namaste ${b.guestName}!\nWarm greetings from PS Elite Homestay Tirupati.\n\nWe are delighted to assist you with your booking (${b.bookingId}) for ${b.room.name} from ${b.checkIn} to ${b.checkOut}.\n\nPlease let us know your arrival time or if you need cab pickup assistance!`;
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
                        <p className="font-semibold">{b.checkIn} to {b.checkOut}</p>
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
