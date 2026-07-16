import { NextResponse } from 'next/server';

// Universal Persistent Cloud Sync API for PS Elite Homestays Tirupati
// Synchronizes Bookings, Date-Specific Inventory & Dynamic Pricing, and Passkeys globally across all devices

// Free public cloud fallback bucket ID for PS Elite Homestay Tirupati (ExtendsClass)
const EXTENDSCLASS_ID = 'fedabbd';

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

  // 2. Try Firebase Admin SDK if configured
  const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY;
  const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  if (firebaseProjectId && firebasePrivateKey && firebaseClientEmail) {
    try {
      const admin = (await import('firebase-admin')).default;
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: firebaseProjectId,
            clientEmail: firebaseClientEmail,
            privateKey: firebasePrivateKey.replace(/\\n/g, '\n'),
          }),
        });
      }
      const db = admin.firestore();
      const doc = await db.collection('ps_elite_store').doc('global').get();
      if (doc.exists) {
        const docData = doc.data();
        if (docData && docData.data) {
          fallbackMemoryStore = { ...fallbackMemoryStore, ...docData.data };
          return docData.data;
        }
      }
    } catch (e) {
      console.warn('Firebase read error:', e);
    }
  }

  // 3. Try ExtendsClass universal cloud bucket (free zero-config fallback)
  try {
    const res = await fetch(`https://extendsclass.com/api/json-storage/bin/${EXTENDSCLASS_ID}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const json = await res.json();
      if (json && (json.bookings || json.inventory || json.passkeys)) {
        fallbackMemoryStore = { ...fallbackMemoryStore, ...json };
        return json;
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

  // 2. Try Firebase Admin SDK if configured
  const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY;
  const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  if (firebaseProjectId && firebasePrivateKey && firebaseClientEmail) {
    try {
      const admin = (await import('firebase-admin')).default;
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: firebaseProjectId,
            clientEmail: firebaseClientEmail,
            privateKey: firebasePrivateKey.replace(/\\n/g, '\n'),
          }),
        });
      }
      const db = admin.firestore();
      await db.collection('ps_elite_store').doc('global').set({
        data: fallbackMemoryStore,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      console.warn('Firebase write error:', e);
    }
  }

  // 3. Try ExtendsClass universal cloud bucket (free zero-config fallback)
  try {
    await fetch(`https://extendsclass.com/api/json-storage/bin/${EXTENDSCLASS_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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
