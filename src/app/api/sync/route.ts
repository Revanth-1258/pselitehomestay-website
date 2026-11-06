import { NextResponse } from 'next/server';
import { currentRole } from '@/lib/server/auth';
import { readStore, writeStore, activeBackend, type InventoryMap } from '@/lib/server/store';
import { ROOMS_DATA } from '@/data/roomsData';

// Public sync endpoint.
//   GET  -> room availability & prices only (no guest data, ever).
//   POST { booking }                      -> anyone: adds ONE new booking (validated, always "Pending").
//   POST { inventory }                    -> admin session only.
//   POST { statusUpdate: {bookingId,status} } -> admin session only.
// Replacing the whole bookings list and changing passkeys are no longer possible through this API.

const MAX_BODY_BYTES = 20_000;
const STATUSES = ['Confirmed', 'Checked In', 'Pending', 'Cancelled'] as const;
type Status = (typeof STATUSES)[number];

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : Number(v) || 0);
const isoDate = (v: unknown) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : '');

function sanitizeBooking(raw: unknown, isAdmin: boolean): Record<string, unknown> | null {
  if (!raw || typeof raw !== 'object') return null;
  const b = raw as Record<string, unknown>;
  const bookingId = str(b.bookingId, 64);
  if (!/^[A-Za-z0-9_-]{4,64}$/.test(bookingId)) return null;

  const rawRoom = (b.room && typeof b.room === 'object' ? b.room : {}) as Record<string, unknown>;
  const canonicalRoom = ROOMS_DATA.find((r) => r.id === rawRoom.id);
  // Public bookings must reference a real room; admin custom receipts may use a custom room entry.
  if (!canonicalRoom && !isAdmin) return null;
  const room = canonicalRoom ?? {
    id: str(rawRoom.id, 64),
    name: str(rawRoom.name, 120),
    pricePerNight: num(rawRoom.pricePerNight),
    image: str(rawRoom.image, 200),
  };

  const status: Status = isAdmin && STATUSES.includes(b.status as Status) ? (b.status as Status) : 'Pending';

  return {
    bookingId,
    guestName: str(b.guestName, 120),
    guestEmail: str(b.guestEmail, 160),
    guestPhone: str(b.guestPhone, 24),
    room,
    checkIn: isoDate(b.checkIn),
    checkOut: isoDate(b.checkOut),
    guestsCount: num(b.guestsCount),
    nights: num(b.nights),
    needTemplePickup: Boolean(b.needTemplePickup),
    needExtraBed: Boolean(b.needExtraBed),
    couponCode: str(b.couponCode, 40) || undefined,
    discountAmount: num(b.discountAmount),
    subtotal: num(b.subtotal),
    gstTaxes: num(b.gstTaxes),
    totalAmount: num(b.totalAmount),
    status,
    paymentMethod: str(b.paymentMethod, 40) || undefined,
    utrNumber: str(b.utrNumber, 40) || undefined,
    advancePaid: num(b.advancePaid),
    balanceDue: num(b.balanceDue),
    paymentPlan: b.paymentPlan === 'FULL' ? 'FULL' : 'ADVANCE',
    createdAt: new Date().toISOString(),
  };
}

function sanitizeInventory(raw: unknown): InventoryMap | null {
  if (!raw || typeof raw !== 'object') return null;
  const out: InventoryMap = {};
  for (const [date, rooms] of Object.entries(raw as Record<string, unknown>)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !rooms || typeof rooms !== 'object') continue;
    out[date] = {};
    for (const [roomId, v] of Object.entries(rooms as Record<string, unknown>)) {
      if (!/^[a-z0-9-]{1,64}$/.test(roomId) || !v || typeof v !== 'object') continue;
      const e = v as Record<string, unknown>;
      out[date][roomId] = { available: Math.max(0, num(e.available)), rateOverride: Math.max(0, num(e.rateOverride)) };
    }
  }
  return out;
}

const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function GET() {
  const data = await readStore();
  return json({ success: true, data: { inventory: data.inventory, updatedAt: data.updatedAt } });
}

export async function POST(request: Request) {
  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return json({ success: false, error: 'Payload too large' }, 413);

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(text);
  } catch {
    return json({ success: false, error: 'Invalid JSON' }, 400);
  }

  if ('bookings' in body || 'passkeys' in body) {
    return json({ success: false, error: 'Not allowed' }, 403);
  }

  const isAdmin = (await currentRole()) === 'admin';
  const wantsPrivileged = 'inventory' in body || 'statusUpdate' in body;
  if (wantsPrivileged && !isAdmin) return json({ success: false, error: 'Unauthorized' }, 401);

  if (activeBackend() === 'none' && process.env.NODE_ENV === 'production') {
    return json({ success: false, error: 'Storage not configured' }, 503);
  }

  try {
    const store = await readStore();

    if ('booking' in body) {
      const booking = sanitizeBooking(body.booking, isAdmin);
      if (!booking) return json({ success: false, error: 'Invalid booking' }, 400);
      if (!store.bookings.some((b) => b.bookingId === booking.bookingId)) {
        store.bookings.unshift(booking);
      }
    }

    if (isAdmin && 'inventory' in body) {
      const inv = sanitizeInventory(body.inventory);
      if (!inv) return json({ success: false, error: 'Invalid inventory' }, 400);
      store.inventory = { ...store.inventory, ...inv };
    }

    if (isAdmin && 'statusUpdate' in body) {
      const u = (body.statusUpdate || {}) as Record<string, unknown>;
      const status = u.status as Status;
      if (!STATUSES.includes(status)) return json({ success: false, error: 'Invalid status' }, 400);
      const target = store.bookings.find((b) => b.bookingId === u.bookingId);
      if (!target) return json({ success: false, error: 'Booking not found' }, 404);
      target.status = status;
    }

    await writeStore(store);
    // Only ever echo public data back.
    return json({ success: true, data: { inventory: store.inventory } });
  } catch (e) {
    console.error('[sync] write failed', e);
    return json({ success: false, error: 'Failed to sync data' }, 500);
  }
}
