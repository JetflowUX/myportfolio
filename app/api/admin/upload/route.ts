import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { isAdminAuthenticated } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const MAX_BYTES = 15 * 1024 * 1024; // 15MB

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'File storage is not configured yet. Add a Blob store to this Vercel project.' },
      { status: 503 },
    );
  }

  try {
    const form = await request.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File is too large (max 15MB).' }, { status: 413 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '-') || 'upload';
    const blob = await put(`uploads/${safeName}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to upload file.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
