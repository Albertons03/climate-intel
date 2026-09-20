import type { Article } from '../rss/article';
import { mapArticleToRow } from './mapArticleToRow';
import { supabaseAdmin } from './server';

export async function saveArticles(articles: Article[]): Promise<number> {
  if (articles.length === 0) {
    return 0;
  }

  const rows = articles.map(mapArticleToRow);
  const { data, error } = await supabaseAdmin
    .from('clima_articles')
    .upsert(rows, { onConflict: 'url', ignoreDuplicates: true })
    .select('id');

  if (error) {
    throw new Error('Failed to save articles.');
  }

  return data?.length ?? 0;
}
