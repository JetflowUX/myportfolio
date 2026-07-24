import { NextRequest, NextResponse } from 'next/server';
import { getSiteContentPayload } from '@/lib/blob-content';

// Public — this is what every visitor's browser fetches to render the
// live projects/companies/resume data, so it must not require auth.
// force-dynamic keeps this from being statically frozen at build time,
// since admin edits should show up without a redeploy.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Read straight from the Blob origin (bypassing Blob's own ~60s CDN
    // cache) so admin edits surface quickly. The short s-maxage below still
    // lets Vercel's edge cache coalesce bursts, so not every page view pays
    // for a live Blob fetch — at most one origin read per ~10s per region.
    // ?fresh=1 (the admin dashboard's own post-save refresh) additionally
    // sends no-store so the editor sees their change instantly.
    const adminFresh = request.nextUrl.searchParams.get('fresh') === '1';
    const payload = await getSiteContentPayload({ fresh: true });
    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': adminFresh
          ? 'no-store'
          : 'public, s-maxage=10, stale-while-revalidate=20',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load site content.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
