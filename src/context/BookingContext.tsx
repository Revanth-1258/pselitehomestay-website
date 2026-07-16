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

  // Coupon helper
  applyCoupon: (code: string, subtotal: number) => { valid: boolean; discount: number; message: string };
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

import { syncBookingToCloud, fetchCloudData, syncBookingsListToCloud } from '@/services/cloudSync';

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<RoomType[]>(ROOMS_DATA);
  const [searchParams, setSearchParams] = useState({
    checkIn: '2026-07-15',
    checkOut: '2026-07-17',
    guests: 2,
    roomCategory: 'all',
  });

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<RoomType | null>(ROOMS_DATA[0]);

  const [isRoomDetailOpen, setIsRoomDetailOpen] = useState(false);
  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState<RoomType | null>(null);

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [currentBookingInvoice, setCurrentBookingInvoice] = useState<BookingDetails | null>(null);

  const [bookings, setBookings] = useState<BookingDetails[]>([]);

  // Load persisted bookings from localStorage & Cloud on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ps_bookings_live');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setBookings(parsed);
        }
      }
    } catch (e) {}

    // Fetch from free universal cloud storage API
    fetchCloudData().then((cloud) => {
      if (cloud && cloud.bookings && Array.isArray(cloud.bookings) && cloud.bookings.length > 0) {
        setBookings((prev) => {
          const map = new Map();
          [...(cloud.bookings || []), ...prev].forEach((b) => {
            if (b && b.bookingId) map.set(b.bookingId, b);
          });
          const merged = Array.from(map.values());
          try {
            localStorage.setItem('ps_bookings_live', JSON.stringify(merged));
          } catch (e) {}
          return merged;
        });
      }
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

  // Sync bookings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('ps_bookings_live', JSON.stringify(bookings));
    } catch (e) {}
  }, [bookings]);

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
    setBookings((prev) => {
      const next = [booking, ...prev];
      try {
        localStorage.setItem('ps_bookings_live', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    setCurrentBookingInvoice(booking);
  };

  const updateBookingStatus = (bookingId: string, status: BookingDetails['status']) => {
    setBookings((prev) => {
      const next = prev.map((b) => (b.bookingId === bookingId ? { ...b, status } : b));
      try {
        localStorage.setItem('ps_bookings_live', JSON.stringify(next));
      } catch (e) {}
      syncBookingsListToCloud(next);
      return next;
    });
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
