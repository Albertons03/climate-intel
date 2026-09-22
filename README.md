
# ClimateIntel

ClimateIntel is a learning and development MVP that collects climate and energy articles from RSS sources, validates and deduplicates them, stores them in Supabase, and displays the latest stored articles.

## Current status

This is a learning/development MVP. The first vertical slice is complete, and the project is intentionally parked after this milestone.

## Implemented features

- Multiple RSS sources fetched in parallel.
- `Promise.allSettled` source resilience and partial source-error reporting.
- Article normalization, validation, trimming, and URL deduplication.
- Supabase persistence with URL-conflict-safe inserts.
- Database-level unique protection on `public.clima_articles.url`.
- Server-only Supabase admin client.
- Development-only manual RSS import from `/dev`.
- Display of the latest 20 stored articles.
- Automatic UI refresh after a successful import.

## Architecture

```text
RSS sources
	-> fetchRss()
	-> fetchAllRssSources() / Promise.allSettled
	-> prepareArticles()
	-> mapArticleToRow()
	-> saveArticles()
	-> public.clima_articles
	-> getLatestArticles()
	-> /dev / ArticleList
```

The development page also contains the client-side `ImportPanel`, which calls the development import route and refreshes the server-rendered article list after a successful import.

## Technology stack

- Next.js 16 App Router
- React 19
- TypeScript
- Supabase JavaScript client
- `rss-parser`
- Tailwind CSS
- ESLint

## Local setup

Install dependencies:

```bash
npm install
```

Create `.env.local` with these variable names:

```text
SUPABASE_URL=
SUPABASE_SECRET_KEY=
```

Start the development server:

```bash
npm run dev
```

Open `/dev` in the local application.

## Database setup

Apply the existing migration in `supabase/migrations/20260912_create_clima_articles.sql` to the Supabase project. The migration is the source of truth for the `public.clima_articles` table, its unique URL constraint, generated fields, and RLS configuration.

## Security

- Never expose or commit `SUPABASE_SECRET_KEY`.
- Keep secret values in local environment configuration, which is ignored by Git.
- The `supabaseAdmin` client is server-only and uses the secret key, so it bypasses Row Level Security. It must never be imported into client components.
- `/dev` and `/api/dev/import-rss` return HTTP 404 in production.
- The obsolete test RSS and Supabase endpoints have been removed.

## Important files

- `src/app/dev/page.tsx`: development page and server-side article loading.
- `src/app/dev/ImportPanel.tsx`: manual RSS import control and result status.
- `src/app/dev/ArticleList.tsx`: latest stored article display.
- `src/app/api/dev/import-rss/route.ts`: development-only RSS import endpoint.
- `src/lib/rss/`: RSS sources, fetching, normalization, validation, and deduplication.
- `src/lib/supabase/server.ts`: server-only Supabase admin client.
- `src/lib/supabase/mapArticleToRow.ts`: application-to-database row mapping.
- `src/lib/supabase/saveArticles.ts`: article persistence.
- `src/lib/supabase/getLatestArticles.ts`: latest article query and mapping.
- `supabase/migrations/20260912_create_clima_articles.sql`: database migration.

## Available scripts

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run start     # Start the production build
npm run lint      # Run ESLint
```

## Limitations and future directions

The project currently has two configured RSS sources, manual development-only importing, no authentication, no scheduled jobs, no AI analysis, no search or filtering, no pagination, and no automated test suite. Error handling and observability are intentionally minimal.

Possible future directions include adding more sources, scheduled ingestion, authentication, search and filtering, pagination, automated tests, improved observability, and AI-assisted classification or summarization.
