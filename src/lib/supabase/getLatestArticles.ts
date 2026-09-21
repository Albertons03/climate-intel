import 'server-only';

import { supabaseAdmin } from './server';

export type StoredArticle = {
  id: string;
  title: string;
  url: string;
  publishedAt: string | null;
  source: string;
  excerpt: string | null;
  createdAt: string;
};

type DatabaseArticleRow = {
  id: string;
  title: string;
  url: string;
  published_at: string | null;
  source: string;
  excerpt: string | null;
  created_at: string;
};

export async function getLatestArticles(): Promise<StoredArticle[]> {
  const { data, error } = await supabaseAdmin
    .from('clima_articles')
    .select('id, title, url, published_at, source, excerpt, created_at')
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(20);

  if (error) {
    throw new Error('Failed to load latest articles.');
  }

  const rows = (data ?? []) as DatabaseArticleRow[];

  return rows.map((article) => ({
    id: article.id,
    title: article.title,
    url: article.url,
    publishedAt: article.published_at,
    source: article.source,
    excerpt: article.excerpt,
    createdAt: article.created_at,
  }));
}
