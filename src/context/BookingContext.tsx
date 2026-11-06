'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROOMS_DATA, RoomType } from '@/data/roomsData';

export interface BookingDetails {
  bookingId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  room: RoomType;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  nights: number;
  needTemplePickup: boolean;
  needExtraBed: boolean;
  couponCode?: string;
  discountAmount: number;
  subtotal: number;
  gstTaxes: number;
  totalAmount: number;
  status: 'Confirmed' | 'Checked In' | 'Pending' | 'Cancelled';
  paymentMethod?: string;
  utrNumber?: string;
  advancePaid?: number;
  balanceDue?: number;
  paymentPlan?: 'ADVANCE' | 'FULL';
  createdAt: string;
}

interface BookingContextType {
  // Dynamic Rooms state (editable via admin panel)
  rooms: RoomType[];
  updateRoomPrice: (roomId: string, newPrice: number) => void;

  // Search parameters state
  searchParams: {
    checkIn: string;
    checkOut: string;
    guests: number;
    roomCategory: string;
  };
  setSearchParams: React.Dispatch<React.SetStateAction<{
    checkIn: string;
    checkOut: string;
    guests: number;
    roomCategory: string;
  }>>;

  // UI Modal controllers
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  selectedRoomForBooking: RoomType | null;
  openBookingModalWithRoom: (room: RoomType) => void;

  isRoomDetailOpen: boolean;
  selectedRoomForDetail: RoomType | null;
  openRoomDetail: (room: RoomType) => void;
  closeRoomDetail: () => void;

  isInvoiceModalOpen: boolean;
  setIsInvoiceModalOpen: (open: boolean) => void;
  currentBookingInvoice: BookingDetails | null;
  setCurrentBookingInvoice: (booking: BookingDetails | null) => void;

  // Bookings list (for Admin + active session)
  bookings: BookingDetails[];
  addBooking: (booking: BookingDetails) => void;
  updateBookingStatus: (bookingId: string, status: BookingDetails['status']) => void;
  /** Admin/owner portals: load all bookings via the session-protected API. */
  loadAllBookings: () => Promise<boolean>;

  // Coupon helper
  applyCoupon: (code: string, subtotal: number) => { valid: boolean; discount: number; message: string };
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

import {
  syncBookingToCloud,
  fetchCloudData,
  fetchPrivateData,
  syncBookingStatusToCloud,
} from '@/services/cloudSync';

// Public visitors only keep bookings made on this device. The old key held a copy of
// every guest booking and is wiped on load.
const MY_BOOKINGS_KEY = 'ps_my_bookings';
const LEGACY_BOOKINGS_KEY = 'ps_bookings_live';

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<RoomType[]>(ROOMS_DATA);
  const [searchParams, setSearchParams] = useState({
    checkIn: '2026-07-15',
    checkOut: '2026-07-17',
    guests: 2,
    roomCategory: 'all',
  });

  // Default the search to tonight → tomorrow (local date). Done after mount so the
  // statically built HTML never carries a stale, already-past date.
  useEffect(() => {
    const toISO = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    setSearchParams((prev) => ({ ...prev, checkIn: toISO(today), checkOut: toISO(tomorrow) }));
  }, []);

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<RoomType | null>(ROOMS_DATA[0]);

  const [isRoomDetailOpen, setIsRoomDetailOpen] = useState(false);
  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState<RoomType | null>(null);

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [currentBookingInvoice, setCurrentBookingInvoice] = useState<BookingDetails | null>(null);

  const [bookings, setBookings] = useState<BookingDetails[]>([]);

  // When true, `bookings` holds every guest booking (admin/owner portal) and must not be cached locally.
  const [privateView, setPrivateView] = useState(false);

  // Load this device's own bookings + public availability on mount
  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_BOOKINGS_KEY);
      const saved = localStorage.getItem(MY_BOOKINGS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setBookings(parsed);
        }
      }
    } catch (e) {}

    fetchCloudData().then((cloud) => {
      if (cloud && cloud.inventory && Object.keys(cloud.inventory).length > 0) {
        try {
          const existing = JSON.parse(localStorage.getItem('ps_date_inventory') || '{}');
          const mergedInv = { ...existing, ...cloud.inventory };
          localStorage.setItem('ps_date_inventory', JSON.stringify(mergedInv));
          window.dispatchEvent(new Event('ps_inventory_updated'));
        } catch (e) {}
      }
    });
  }, []);

  // Persist only this device's own bookings (never the full admin list)
  useEffect(() => {
    if (privateView) return;
    try {
      localStorage.setItem(MY_BOOKINGS_KEY, JSON.stringify(bookings));
    } catch (e) {}
  }, [bookings, privateView]);

  const loadAllBookings = async () => {
    const data = await fetchPrivateData<BookingDetails>();
    if (!data) return false;
    setPrivateView(true);
    setBookings(Array.isArray(data.bookings) ? data.bookings : []);
    return true;
  };

  const updateRoomPrice = (roomId: string, newPrice: number) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, pricePerNight: newPrice } : r))
    );
  };

  const openBookingModalWithRoom = (room: RoomType) => {
    setSelectedRoomForBooking(room);
    setIsBookingModalOpen(true);
  };

  const openRoomDetail = (room: RoomType) => {
    setSelectedRoomForDetail(room);
    setIsRoomDetailOpen(true);
  };

  const closeRoomDetail = () => {
    setIsRoomDetailOpen(false);
    setSelectedRoomForDetail(null);
  };

  const addBooking = (booking: BookingDetails) => {
    syncBookingToCloud(booking);
    setBookings((prev) => [booking, ...prev]);
    setCurrentBookingInvoice(booking);
  };

  const updateBookingStatus = (bookingId: string, status: BookingDetails['status']) => {
    syncBookingStatusToCloud(bookingId, status);
    setBookings((prev) => prev.map((b) => (b.bookingId === bookingId ? { ...b, status } : b)));
  };

  const applyCoupon = (code: string, subtotal: number) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'PSELITE15') {
      const discount = Math.round(subtotal * 0.15);
      return { valid: true, discount, message: '🎉 15% VIP Luxury Discount applied!' };
    } else if (cleanCode === 'PILGRIM10') {
      const discount = Math.min(1000, subtotal);
      return { valid: true, discount, message: '🛕 ₹1,000 Pilgrim Special Discount applied!' };
    }
    return { valid: false, discount: 0, message: 'Invalid promo code. Try PSELITE15 or PILGRIM10' };
  };

  return (
    <BookingContext.Provider
      value={{
        rooms,
        updateRoomPrice,
        searchParams,
        setSearchParams,
        isBookingModalOpen,
        setIsBookingModalOpen,
        selectedRoomForBooking,
        openBookingModalWithRoom,
        isRoomDetailOpen,
        selectedRoomForDetail,
        openRoomDetail,
        closeRoomDetail,
        isInvoiceModalOpen,
        setIsInvoiceModalOpen,
        currentBookingInvoice,
        setCurrentBookingInvoice,
        bookings,
        addBooking,
        updateBookingStatus,
        loadAllBookings,
        applyCoupon,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
