import { NextResponse } from 'next/server';

import { fetchAllRssSources } from '@/lib/rss/fetchAllRssSources';
import { saveArticles } from '@/lib/supabase/saveArticles';

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ ok: false, error: 'Not found.' }, { status: 404 });
  }

  try {
    const { articles, errors } = await fetchAllRssSources();
    const savedCount = await saveArticles(articles);

    return NextResponse.json({
      ok: true,
      preparedCount: articles.length,
      savedCount,
      sourceErrors: errors,
    });
  } catch (error: unknown) {
    console.error('RSS import failed:', error);

    return NextResponse.json({ ok: false, error: 'RSS import failed.' }, { status: 500 });
  }
}
