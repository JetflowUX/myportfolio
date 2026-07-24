import { NextRequest, NextResponse } from 'next/server';
import { getSiteContentPayload } from '@/lib/blob-content';

// Public — this is what every visitor's browser fetches to render the
// live projects/companies/resume data, so it must not require auth.
// force-dynamic keeps this from being statically frozen at build time,
// since admin edits should show up without a redeploy.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Default path (every visitor, every page load): read through Vercel
    // Blob's CDN cache and let Vercel's edge cache this response too — a
    // live Blob fetch on every single page view was adding ~1s to every
    // page. ?fresh=1 (used only by the admin dashboard's own post-save
    // refresh) skips both caches so an edit is visible immediately.
    const fresh = request.nextUrl.searchParams.get('fresh') === '1';
    const payload = await getSiteContentPayload({ fresh });
    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': fresh
          ? 'no-store'
          : 'public, s-maxage=30, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load site content.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
