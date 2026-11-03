import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { removeExperience, upsertExperience } from '@/lib/blob-content';
import type { Experience } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const entry = (await request.json()) as Partial<Experience>;

    if (!entry.id || !entry.role || !entry.when) {
      return NextResponse.json({ error: 'A work history entry needs a role and its dates.' }, { status: 400 });
    }

    await upsertExperience(entry as Experience);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save the work history entry.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id.' }, { status: 400 });
  }

  try {
    await removeExperience(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to delete the work history entry.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
