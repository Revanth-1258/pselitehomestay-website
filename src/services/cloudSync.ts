// Client helpers for the sync API.
// Public pages only ever receive room availability/prices. Guest bookings are readable only
// with an admin/owner session (httpOnly cookie set by /api/auth/login).

type Inventory = Record<string, Record<string, { available: number; rateOverride: number }>>;

async function post(body: unknown): Promise<boolean> {
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch (error) {
    console.warn('Cloud sync offline:', error);
    return false;
  }
}

/** Adds one new booking (public booking form or admin receipt). */
export const syncBookingToCloud = (booking: unknown) => post({ booking });

/** Admin only: change one booking's status without touching any other booking. */
export const syncBookingStatusToCloud = (bookingId: string, status: string) =>
  post({ statusUpdate: { bookingId, status } });

/** Admin only: merge date-specific availability and rates. */
export const syncInventoryToCloud = (inventory: Inventory) => post({ inventory });

/** Public: room availability & rates. */
export async function fetchCloudData(): Promise<{ inventory?: Inventory } | null> {
  try {
    const res = await fetch('/api/sync', { cache: 'no-store' });
    if (res.ok) return (await res.json()).data;
  } catch (error) {
    console.warn('Could not fetch availability:', error);
  }
  return null;
}

/** Admin/owner session only: all bookings + inventory. Returns null when not logged in. */
export async function fetchPrivateData<B = unknown>(): Promise<{ inventory: Inventory; bookings: B[] } | null> {
  try {
    const res = await fetch('/api/admin/data', { cache: 'no-store' });
    if (res.ok) return (await res.json()).data;
  } catch (error) {
    console.warn('Could not fetch private data:', error);
  }
  return null;
}

export type PortalRole = 'admin' | 'owner';

export async function portalLogin(role: PortalRole, passkey: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, passkey }),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok && data.ok === true, error: data.error };
  } catch {
    return { ok: false, error: 'Network error' };
  }
}

export async function portalLogout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch {}
}

export async function portalSession(): Promise<PortalRole | null> {
  try {
    const res = await fetch('/api/auth/session', { cache: 'no-store' });
    const data = await res.json();
    return data.authenticated ? data.role : null;
  } catch {
    return null;
  }
}
