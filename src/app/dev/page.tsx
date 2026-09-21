import { notFound } from 'next/navigation';

import { getLatestArticles } from '@/lib/supabase/getLatestArticles';

import ArticleList from './ArticleList';
import ImportPanel from './ImportPanel';

export default async function DevPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  const articles = await getLatestArticles();

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-950">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <ImportPanel />
        <ArticleList articles={articles} />
      </div>
    </main>
  );
}
