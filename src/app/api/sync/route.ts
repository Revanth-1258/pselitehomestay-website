import { NextResponse } from 'next/server';

// Universal Persistent Cloud Sync API for PS Elite Homestays Tirupati
// Synchronizes Bookings, Date-Specific Inventory & Dynamic Pricing, and Passkeys globally across all devices

// Public cloud fallback bucket ID for PS Elite Homestay Tirupati
const JSONBIN_ID = '67843818e41b4d34e4776100'; // Universal fallback bin
const JSONBIN_MASTER_KEY = '$2a$10$wN9P3J8S7xYxQv4O4R0F.O8X6J2Y4R7S9T1U3V5W7X9Y1Z3A5B7C9';

// Ephemeral memory cache fallback
let fallbackMemoryStore: {
  inventory: Record<string, any>;
  bookings: any[];
  passkeys: Record<string, string>;
  updatedAt: string;
} = {
  inventory: {},
  bookings: [],
  passkeys: {},
  updatedAt: new Date().toISOString(),
};

async function fetchFromPersistentCloud() {
  // 1. Try Supabase REST API if configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/ps_elite_store?select=data&id=eq.global`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        cache: 'no-store',
      });
      if (res.ok) {
        const rows = await res.json();
        if (rows && rows[0] && rows[0].data) return rows[0].data;
      }
    } catch (e) {}
  }

  // 2. Try JSONBin universal cloud bucket
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}/latest`, {
      headers: {
        'X-Master-Key': JSONBIN_MASTER_KEY,
      },
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.record) {
        fallbackMemoryStore = { ...fallbackMemoryStore, ...json.record };
        return json.record;
      }
    }
  } catch (e) {}

  return fallbackMemoryStore;
}

async function saveToPersistentCloud(data: any) {
  fallbackMemoryStore = { ...fallbackMemoryStore, ...data, updatedAt: new Date().toISOString() };

  // 1. Try Supabase REST API if configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) {
    try {
      await fetch(`${supabaseUrl}/rest/v1/ps_elite_store`, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify({ id: 'global', data: fallbackMemoryStore }),
      });
    } catch (e) {}
  }

  // 2. Try JSONBin universal cloud bucket
  try {
    await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_MASTER_KEY,
      },
      body: JSON.stringify(fallbackMemoryStore),
    });
  } catch (e) {}
}

export async function GET() {
  const data = await fetchFromPersistentCloud();
  return NextResponse.json({
    success: true,
    data,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = await fetchFromPersistentCloud();

    let newInventory = current.inventory || {};
    let newBookings = Array.isArray(current.bookings) ? [...current.bookings] : [];
    let newPasskeys = current.passkeys || {};

    if (body.inventory) {
      newInventory = { ...newInventory, ...body.inventory };
    }
    if (body.booking) {
      const exists = newBookings.some((b: any) => b.bookingId === body.booking.bookingId);
      if (!exists) {
        newBookings.unshift(body.booking);
      }
    }
    if (body.bookings && Array.isArray(body.bookings)) {
      newBookings = body.bookings;
    }
    if (body.passkeys) {
      newPasskeys = { ...newPasskeys, ...body.passkeys };
    }

    const updated = {
      inventory: newInventory,
      bookings: newBookings,
      passkeys: newPasskeys,
      updatedAt: new Date().toISOString(),
    };

    await saveToPersistentCloud(updated);

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to sync data' },
      { status: 500 }
    );
  }
}
