import 'server-only';

import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_SESSION_COOKIE = 'admin-session';

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type AdminSessionPayload = {
	sub: 'admin';
	exp: number;
};

function getRequiredEnv(name: 'ADMIN_LOGIN_EMAIL' | 'ADMIN_LOGIN_PASSWORD' | 'ADMIN_SESSION_SECRET'): string {
	const value = process.env[name];

	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
}

function sign(value: string): string {
	const secret = getRequiredEnv('ADMIN_SESSION_SECRET');
	return createHmac('sha256', secret).update(value).digest('base64url');
}

function encodePayload(payload: AdminSessionPayload): string {
	return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

function decodePayload(value: string): AdminSessionPayload | null {
	try {
		return JSON.parse(Buffer.from(value, 'base64url').toString('utf8')) as AdminSessionPayload;
	} catch {
		return null;
	}
}

export function getAdminCredentials() {
	return {
		email: getRequiredEnv('ADMIN_LOGIN_EMAIL').trim().toLowerCase(),
		password: getRequiredEnv('ADMIN_LOGIN_PASSWORD'),
	};
}

export function createAdminSessionToken(): string {
	const payload = encodePayload({
		sub: 'admin',
		exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
	});

	return `${payload}.${sign(payload)}`;
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
	if (!token) {
		return false;
	}

	const [payload, signature] = token.split('.');
	if (!payload || !signature) {
		return false;
	}

	const expectedSignature = sign(payload);
	const provided = Buffer.from(signature);
	const expected = Buffer.from(expectedSignature);

	if (provided.length !== expected.length) {
		return false;
	}

	if (!timingSafeEqual(provided, expected)) {
		return false;
	}

	const decoded = decodePayload(payload);
	if (!decoded || decoded.sub !== 'admin') {
		return false;
	}

	return decoded.exp > Math.floor(Date.now() / 1000);
}

export function getAdminCookieOptions() {
	return {
		httpOnly: true,
		sameSite: 'lax' as const,
		secure: process.env.NODE_ENV === 'production',
		path: '/',
		maxAge: SESSION_TTL_SECONDS,
	};
}

export function isAdminAuthenticated(): boolean {
	const token = cookies().get(ADMIN_SESSION_COOKIE)?.value;
	return verifyAdminSessionToken(token);
}
