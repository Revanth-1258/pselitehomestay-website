import 'server-only';

// Private persistent store for inventory + bookings. Server-only: never import from client code.
//
// Backends, first configured wins:
//   1. Upstash Redis / Vercel KV (REST)  KV_REST_API_URL + KV_REST_API_TOKEN
//                                        (or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN)
//   2. Firebase Firestore (Admin SDK)    FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY
//   3. Supabase (service role, server)   SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
//
// The old public ExtendsClass bin is READ ONCE to migrate existing data into the private store,
// and is never written to again. Once migrated, empty that bin (see SECURITY notes in the PR).

export type InventoryMap = Record<string, Record<string, { available: number; rateOverride: number }>>;

export interface StoreData {
  inventory: InventoryMap;
  bookings: Record<string, unknown>[];
  updatedAt: string;
}

const STORE_KEY = 'ps_elite_store';
const LEGACY_EXTENDSCLASS_URL = 'https://extendsclass.com/api/json-storage/bin/fedabbd';

const empty = (): StoreData => ({ inventory: {}, bookings: [], updatedAt: new Date().toISOString() });

// Dev-only fallback when no backend is configured. Not persistent across serverless instances.
let memoryStore: StoreData = empty();

type Backend = 'kv' | 'firebase' | 'supabase' | 'none';

function kvConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ''), token } : null;
}

export function activeBackend(): Backend {
  if (kvConfig()) return 'kv';
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)
    return 'firebase';
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) return 'supabase';
  return 'none';
}

/** Keep only the fields we own; drops legacy `passkeys` and anything else injected. */
function normalize(raw: unknown): StoreData | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const inventory = r.inventory && typeof r.inventory === 'object' ? (r.inventory as InventoryMap) : {};
  const bookings = Array.isArray(r.bookings) ? (r.bookings as Record<string, unknown>[]) : [];
  if (!Object.keys(inventory).length && !bookings.length) return null;
  return { inventory, bookings, updatedAt: typeof r.updatedAt === 'string' ? r.updatedAt : new Date().toISOString() };
}

async function firestore() {
  const admin = (await import('firebase-admin')).default;
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      }),
    });
  }
  return admin.firestore();
}

async function readBackend(backend: Backend): Promise<StoreData | null> {
  if (backend === 'kv') {
    const { url, token } = kvConfig()!;
    const res = await fetch(`${url}/get/${STORE_KEY}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`KV read failed: ${res.status}`);
    const { result } = (await res.json()) as { result: string | null };
    return result ? normalize(JSON.parse(result)) : null;
  }
  if (backend === 'firebase') {
    const doc = await (await firestore()).collection(STORE_KEY).doc('global').get();
    return doc.exists ? normalize(doc.data()?.data) : null;
  }
  if (backend === 'supabase') {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${STORE_KEY}?select=data&id=eq.global`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Supabase read failed: ${res.status}`);
    const rows = (await res.json()) as { data?: unknown }[];
    return normalize(rows?.[0]?.data);
  }
  return memoryStore;
}

async function writeBackend(backend: Backend, data: StoreData): Promise<void> {
  if (backend === 'kv') {
    const { url, token } = kvConfig()!;
    const res = await fetch(`${url}/set/${STORE_KEY}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`KV write failed: ${res.status}`);
    return;
  }
  if (backend === 'firebase') {
    await (await firestore()).collection(STORE_KEY).doc('global').set({ data, updatedAt: data.updatedAt });
    return;
  }
  if (backend === 'supabase') {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${STORE_KEY}`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({ id: 'global', data }),
    });
    if (!res.ok) throw new Error(`Supabase write failed: ${res.status}`);
    return;
  }
  memoryStore = data;
}

/** One-time import from the legacy public bin into the private store. */
async function migrateFromLegacy(backend: Backend): Promise<StoreData | null> {
  if (backend === 'none' || process.env.DISABLE_LEGACY_MIGRATION === 'true') return null;
  try {
    const res = await fetch(LEGACY_EXTENDSCLASS_URL, { cache: 'no-store' });
    if (!res.ok) return null;
    const legacy = normalize(await res.json());
    if (legacy) {
      await writeBackend(backend, legacy);
      console.info(`[store] Migrated ${legacy.bookings.length} bookings from legacy bin to ${backend}.`);
    }
    return legacy;
  } catch {
    return null;
  }
}

export async function readStore(): Promise<StoreData> {
  const backend = activeBackend();
  if (backend === 'none') {
    if (process.env.NODE_ENV === 'production') {
      console.error('[store] No private storage configured. Set KV/Firebase/Supabase env vars.');
    }
    return memoryStore;
  }
  const data = await readBackend(backend);
  if (data) return data;
  return (await migrateFromLegacy(backend)) ?? empty();
}

export async function writeStore(data: StoreData): Promise<void> {
  await writeBackend(activeBackend(), { ...data, updatedAt: new Date().toISOString() });
}
