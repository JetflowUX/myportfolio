import { createHmac, timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminCookieOptions,
  getAdminCredentials,
} from '@/lib/admin-auth';

// Constant-time string compare. HMAC-ing both sides to a fixed-length digest
// means neither the outcome nor the input length leaks through timing —
// unlike a plain `===`, which short-circuits on the first differing byte.
function safeEqual(a: string, b: string): boolean {
  const key = 'admin-login-compare';
  const da = createHmac('sha256', key).update(a).digest();
  const db = createHmac('sha256', key).update(b).digest();
  return timingSafeEqual(da, db);
}

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const credentials = getAdminCredentials();
    const normalizedEmail = email?.trim().toLowerCase() ?? '';
    const isValidLogin =
      safeEqual(normalizedEmail, credentials.email) &&
      safeEqual(password ?? '', credentials.password);

    if (!isValidLogin) {
      return NextResponse.json({ error: 'Invalid login details.' }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(
      ADMIN_SESSION_COOKIE,
      createAdminSessionToken(),
      getAdminCookieOptions(),
    );

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to login.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}