import { fetchOgData } from '@/lib/og';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 });
  }

  try {
    new URL(url); // valida se é uma URL válida
  } catch {
    return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
  }

  try {
    const data = await fetchOgData(url);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
  }
}
