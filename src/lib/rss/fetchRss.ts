import 'server-only';

import Parser from 'rss-parser';

import type { Article } from './article';
import type { RssSource } from './sources';

const parser = new Parser();

export async function fetchRss(source: RssSource): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(source.feedUrl);

    return feed.items.slice(0, 5).map((item) => ({
      title: item.title ?? '',
      url: item.link ?? '',
      publishedAt: item.isoDate ?? item.pubDate ?? null,
      source: source.name,
      excerpt: item.contentSnippet ?? item.content ?? null,
    }));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Ismeretlen RSS-lekérési hiba';
    throw new Error(`Az RSS feed nem kérhető le: ${message}`);
  }
}