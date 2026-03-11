import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const bookmark = await db('bookmarks').where({ id }).first();

  if (!bookmark) {
    return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 });
  }

  await db('bookmarks').where({ id }).increment('click_count', 1);

  return NextResponse.json({ success: true });
}

// ← adiciona GET para redirect
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const redirect = req.nextUrl.searchParams.get('redirect');

  const bookmark = await db('bookmarks').where({ id }).first();

  if (!bookmark || !redirect) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await db('bookmarks').where({ id }).increment('click_count', 1);

  return NextResponse.redirect(redirect);
}
