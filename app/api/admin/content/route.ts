import { NextResponse } from 'next/server';
import { getSiteContentPayload } from '@/lib/blob-content';

// Public — this is what every visitor's browser fetches to render the
// live projects/companies/resume data, so it must not require auth.
// force-dynamic keeps this from being statically frozen at build time,
// since admin edits should show up without a redeploy.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const payload = await getSiteContentPayload();
    return NextResponse.json(payload, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load site content.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
