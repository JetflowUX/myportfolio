import { NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminCookieOptions,
  getAdminCredentials,
} from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const credentials = getAdminCredentials();
    const normalizedEmail = email?.trim().toLowerCase() ?? '';

    if (normalizedEmail !== credentials.email || password !== credentials.password) {
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