import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  authConfigured,
  createSessionValue,
  passkeyMatches,
  SESSION_COOKIE,
  sessionCookieOptions,
  type Role,
} from '@/lib/server/auth';

export async function POST(request: Request) {
  if (!authConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'Login is not configured on the server (SESSION_SECRET / passkey env vars missing).' },
      { status: 503 }
    );
  }

  let body: { role?: string; passkey?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const role = body.role === 'admin' || body.role === 'owner' ? (body.role as Role) : null;
  const passkey = typeof body.passkey === 'string' ? body.passkey.slice(0, 200) : '';

  // Small fixed delay on every attempt slows down passkey guessing.
  await new Promise((r) => setTimeout(r, 600));

  if (!role || !passkeyMatches(role, passkey)) {
    return NextResponse.json({ ok: false, error: 'Invalid passkey' }, { status: 401 });
  }

  const value = createSessionValue(role);
  if (!value) return NextResponse.json({ ok: false }, { status: 503 });
  (await cookies()).set(SESSION_COOKIE, value, sessionCookieOptions);
  return NextResponse.json({ ok: true, role });
}
