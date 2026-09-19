import type { Article } from '../rss/article';

export type ClimateArticleInsertRow = {
  title: string;
  url: string;
  published_at: string | null;
  source: string;
  excerpt: string | null;
};

export function mapArticleToRow(article: Article): ClimateArticleInsertRow {
  const publishedAt = article.publishedAt === null ? null : new Date(article.publishedAt);

  return {
    title: article.title,
    url: article.url,
    published_at: publishedAt === null || Number.isNaN(publishedAt.getTime())
      ? null
      : publishedAt.toISOString(),
    source: article.source,
    excerpt: article.excerpt,
  };
}
