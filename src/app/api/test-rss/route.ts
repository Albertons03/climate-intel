import { NextResponse } from 'next/server';

import { fetchAllRssSources } from '@/lib/rss/fetchAllRssSources';

export async function GET() {
  try {
    const { articles, errors } = await fetchAllRssSources();

    return NextResponse.json({ success: true, articles, errors });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ismeretlen hiba történt';

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}