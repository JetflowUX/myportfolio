import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { clearResumeUrl, setResumeUrl } from '@/lib/blob-content';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { resumeUrl } = (await request.json()) as { resumeUrl?: string };

    if (!resumeUrl || !resumeUrl.trim()) {
      return NextResponse.json({ error: 'Missing resumeUrl.' }, { status: 400 });
    }

    await setResumeUrl(resumeUrl);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save resume link.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await clearResumeUrl();
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to reset resume link.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
