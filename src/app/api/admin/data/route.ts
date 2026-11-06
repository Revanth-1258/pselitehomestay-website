import { NextResponse } from 'next/server';
import { currentRole } from '@/lib/server/auth';
import { readStore } from '@/lib/server/store';

// Full data (bookings with guest details) for the admin and owner portals only.
export async function GET() {
  const role = await currentRole();
  if (!role) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const data = await readStore();
  return NextResponse.json(
    { success: true, data: { inventory: data.inventory, bookings: data.bookings, updatedAt: data.updatedAt } },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
