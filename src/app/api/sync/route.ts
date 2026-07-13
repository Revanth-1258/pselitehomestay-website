import { NextResponse } from 'next/server';

// Lightweight server-side cache & cloud proxy for PS Elite Homestay
// Syncs rates, inventory, and bookings across devices
let memoryStore: {
  inventory: Record<string, any>;
  bookings: any[];
  updatedAt: string;
} = {
  inventory: {},
  bookings: [],
  updatedAt: new Date().toISOString(),
};

export async function GET() {
  return NextResponse.json({
    success: true,
    data: memoryStore,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.inventory) {
      memoryStore.inventory = { ...memoryStore.inventory, ...body.inventory };
    }
    if (body.booking) {
      // Avoid duplicate booking IDs
      const exists = memoryStore.bookings.some(
        (b: any) => b.bookingId === body.booking.bookingId
      );
      if (!exists) {
        memoryStore.bookings.unshift(body.booking);
      }
    }
    if (body.bookings && Array.isArray(body.bookings)) {
      memoryStore.bookings = body.bookings;
    }
    memoryStore.updatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      data: memoryStore,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to sync data' },
      { status: 500 }
    );
  }
}
