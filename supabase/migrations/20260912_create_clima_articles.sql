create table public.clima_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text not null unique,
  published_at timestamptz,
  source text not null,
  excerpt text,
  created_at timestamptz not null default now()
);

alter table public.clima_articles enable row level security;