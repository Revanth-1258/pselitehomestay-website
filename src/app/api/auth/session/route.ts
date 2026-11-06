import { NextResponse } from 'next/server';
import { currentRole } from '@/lib/server/auth';

export async function GET() {
  const role = await currentRole();
  return NextResponse.json({ authenticated: Boolean(role), role }, { headers: { 'Cache-Control': 'no-store' } });
}
