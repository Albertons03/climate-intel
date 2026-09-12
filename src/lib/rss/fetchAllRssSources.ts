import 'server-only';

import type { Article } from './article';
import { fetchRss } from './fetchRss';
import { prepareArticles } from './prepareArticles';
import { RSS_SOURCES } from './sources';

export type RssSourceError = {
  source: string;
  message: string;
};

export type FetchAllRssResult = {
  articles: Article[];
  errors: RssSourceError[];
};

export async function fetchAllRssSources(): Promise<FetchAllRssResult> {
  const results = await Promise.allSettled(RSS_SOURCES.map((source) => fetchRss(source)));
  const articles: Article[] = [];
  const errors: RssSourceError[] = [];

  results.forEach((result, index) => {
    const source = RSS_SOURCES[index];

    if (result.status === 'fulfilled') {
      articles.push(...result.value);
      return;
    }

    const message = result.reason instanceof Error ? result.reason.message : 'Ismeretlen RSS-lekérési hiba';
    errors.push({ source: source.name, message });
  });

  return { articles: prepareArticles(articles), errors };
}