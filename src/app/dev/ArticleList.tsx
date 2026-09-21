import type { StoredArticle } from '@/lib/supabase/getLatestArticles';

type ArticleListProps = {
  articles: StoredArticle[];
};

export default function ArticleList({ articles }: ArticleListProps) {
  if (articles.length === 0) {
    return <p className="text-zinc-600">Még nincs elmentett cikk.</p>;
  }

  return (
    <div className="grid gap-4">
      {articles.map((article) => (
        <article
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200"
          key={article.id}
        >
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-medium text-zinc-500">{article.source}</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-950">{article.title}</h2>
            </div>
            <p className="text-sm text-zinc-500">{formatPublishedDate(article.publishedAt)}</p>
            {article.excerpt && <p className="leading-7 text-zinc-700">{article.excerpt}</p>}
            <a
              className="w-fit font-medium text-zinc-950 underline underline-offset-4 hover:text-zinc-600"
              href={article.url}
              rel="noopener noreferrer"
              target="_blank"
            >
              Eredeti cikk megnyitása
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}

function formatPublishedDate(value: string | null) {
  if (value === null) {
    return 'Nincs dátum';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Nincs dátum';
  }

  return new Intl.DateTimeFormat('hu-HU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
