import 'server-only';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

// Server-side sessions for the admin and owner portals.
// Passkeys live ONLY in env vars (ADMIN_PASSKEY, OWNER_PASSKEY); there are no defaults.
// The session is an HMAC-signed, httpOnly cookie, so it can't be forged or read by page scripts.

export type Role = 'admin' | 'owner';

export const SESSION_COOKIE = 'ps_session';
const SESSION_TTL_SECONDS = 12 * 60 * 60; // 12 hours

function secret(): string | null {
  const s = process.env.SESSION_SECRET;
  return s && s.length >= 32 ? s : null;
}

const sha256 = (v: string) => createHash('sha256').update(v).digest();

/** Constant-time passkey comparison against the env var for that role. */
export function passkeyMatches(role: Role, input: string): boolean {
  const expected = role === 'admin' ? process.env.ADMIN_PASSKEY : process.env.OWNER_PASSKEY;
  if (!expected || !input) return false;
  return timingSafeEqual(sha256(input), sha256(expected));
}

export function authConfigured(): boolean {
  return Boolean(secret() && (process.env.ADMIN_PASSKEY || process.env.OWNER_PASSKEY));
}

function sign(payload: string, key: string) {
  return createHmac('sha256', key).update(payload).digest('base64url');
}

export function createSessionValue(role: Role): string | null {
  const key = secret();
  if (!key) return null;
  const payload = Buffer.from(JSON.stringify({ role, exp: Date.now() + SESSION_TTL_SECONDS * 1000 })).toString(
    'base64url'
  );
  return `${payload}.${sign(payload, key)}`;
}

function verifySessionValue(value: string | undefined): Role | null {
  const key = secret();
  if (!key || !value) return null;
  const [payload, sig] = value.split('.');
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload, key));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const { role, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { role: Role; exp: number };
    if ((role !== 'admin' && role !== 'owner') || typeof exp !== 'number' || exp < Date.now()) return null;
    return role;
  } catch {
    return null;
  }
}

/** Role of the current request's session, or null. */
export async function currentRole(): Promise<Role | null> {
  const store = await cookies();
  return verifySessionValue(store.get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: SESSION_TTL_SECONDS,
};
