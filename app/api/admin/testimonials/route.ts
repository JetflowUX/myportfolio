import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { removeTestimonial, upsertTestimonial } from '@/lib/blob-content';
import type { Testimonial } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const entry = (await request.json()) as Partial<Testimonial>;

    if (!entry.id || !entry.quote?.trim() || !entry.name?.trim()) {
      return NextResponse.json({ error: 'A testimonial needs the quote and the name of who said it.' }, { status: 400 });
    }

    await upsertTestimonial(entry as Testimonial);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to save the testimonial.';
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
    await removeTestimonial(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to delete the testimonial.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
