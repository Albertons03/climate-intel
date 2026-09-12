export type RssSource = {
  name: string;
  feedUrl: string;
  categoryHint: string;
};

export const RSS_SOURCES: RssSource[] = [
  {
    name: 'PV Magazine',
    feedUrl: 'https://www.pv-magazine.com/feed/',
    categoryHint: 'solar',
  },
  {
    name: 'Carbon Brief',
    feedUrl: 'https://www.carbonbrief.org/feed/',
    categoryHint: 'climate',
  },
];