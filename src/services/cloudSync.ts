// Universal Persistent Cloud Sync Service for PS Elite Homestays Tirupati
// Syncs inventory, custom prices, passkeys, and guest bookings across mobile & desktop devices

export async function syncBookingToCloud(booking: any): Promise<void> {
  try {
    await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking }),
    });
  } catch (error) {
    console.warn('Cloud sync offline, saved locally:', error);
  }
}

export async function syncBookingsListToCloud(bookings: any[]): Promise<void> {
  try {
    await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookings }),
    });
  } catch (error) {
    console.warn('Cloud sync offline, saved locally:', error);
  }
}


export async function syncInventoryToCloud(inventory: Record<string, any>): Promise<void> {
  try {
    await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inventory }),
    });
  } catch (error) {
    console.warn('Inventory cloud sync offline, saved locally:', error);
  }
}

export async function syncPasskeysToCloud(passkeys: Record<string, string>): Promise<void> {
  try {
    await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passkeys }),
    });
  } catch (error) {
    console.warn('Passkeys cloud sync offline, saved locally:', error);
  }
}

export async function fetchCloudData(): Promise<{
  inventory?: Record<string, any>;
  bookings?: any[];
  passkeys?: Record<string, string>;
} | null> {
  try {
    const res = await fetch('/api/sync', { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (error) {
    console.warn('Could not fetch cloud data:', error);
  }
  return null;
}
