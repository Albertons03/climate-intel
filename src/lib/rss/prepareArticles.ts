import type { Article } from './article';

export function prepareArticles(articles: Article[]): Article[] {
  const seenUrls = new Set<string>();
  const preparedArticles: Article[] = [];

  for (const article of articles) {
    const title = article.title.trim();
    const url = article.url.trim();

    if (!title || !url || seenUrls.has(url)) {
      continue;
    }

    seenUrls.add(url);
    preparedArticles.push({
      ...article,
      title,
      url,
    });
  }

  return preparedArticles;
}