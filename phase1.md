ClimateIntel — Fázis 1 MVP terv + Claude Code prompt
Architektúra áttekintés
[RSS/scraping forrás] 
      ↓ (cron, óránta/naponta)
[fetch script] → nyers cikkek DB-be (raw_articles tábla)
      ↓
[szűrő/kategorizáló Claude hívás - Haiku] 
      ↓ (relevance_score >= 6)
[összefoglaló Claude hívás - Sonnet]
      ↓
[digest_items tábla]
      ↓ (napi cron, pl. 07:00)
[digest összeállító script] → email küldés (Resend)

Nincs agent framework, nincs orchestration réteg — sima szekvenciális Node/TS scriptek, Supabase Edge Functions vagy Vercel Cron triggerrel.

Supabase séma (kezdő verzió)
sql
create table sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  feed_url text not null,
  category_hint text,
  active boolean default true,
  created_at timestamptz default now()
);

create table raw_articles (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references sources(id),
  title text not null,
  url text not null unique,
  raw_content text,
  published_at timestamptz,
  fetched_at timestamptz default now(),
  processed boolean default false
);

create table digest_items (
  id uuid primary key default gen_random_uuid(),
  article_id uuid references raw_articles(id),
  category text,
  relevance_score int,
  summary text,
  digest_date date default current_date,
  created_at timestamptz default now()
);

create table subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  active boolean default true,
  created_at timestamptz default now()
);
Cron feladatok (Fázis 1)
fetch-articles (óránta) — végigmegy a sources táblán, RSS parse, új cikkeket beszúr raw_articles-be (url unique constraint véd a duplikátumok ellen)
process-articles (óránta, fetch után) — a processed = false cikkeken végigmegy: szűrő prompt → ha releváns, összefoglaló prompt → beszúrás digest_items-be → processed = true
send-digest (naponta 07:00) — aznapi digest_items lekérdezése, kategóriánként rendezés, email összeállítás, kiküldés subscribers listának
Claude Code prompt (ezt másold be neki)
Építs egy MVP-t egy klímatech/energiapiaci hírösszefoglaló szolgáltatáshoz.

STACK:
- Next.js 14 (App Router) + TypeScript
- Supabase (DB + Edge Functions a cron jobokhoz)
- Claude API (Anthropic SDK) az összefoglaláshoz
- Resend az email digest kiküldéshez

FÁZIS 1 CÉL: működő end-to-end pipeline, ami RSS forrásokból cikkeket
gyűjt, Claude-dal szűri és összefoglalja, majd napi email digestet küld.
Még nincs dashboard, nincs fizetős előfizetés — csak a mag-pipeline.

ADATBÁZIS SÉMA:
[ide másold be a fenti SQL-t]

FELADATOK SORRENDBEN:

1. Hozd létre a Supabase projekt struktúrát, futtasd le a fenti sémát
   migrationként.

2. Írj egy `fetchArticles` Edge Function-t (vagy Node scriptet, ha
   egyszerűbb lokálisan tesztelni), ami:
   - végigmegy az aktív `sources` rekordokon
   - RSS parse (használj egy könnyű RSS parser libet, pl. rss-parser npm)
   - beszúrja az új cikkeket a `raw_articles`-be, url alapján dedupe-olva

3. Írj egy `processArticles` funkciót, ami:
   - lekérdezi a `processed = false` cikkeket
   - minden cikkre meghívja a Claude API-t egy szűrő prompttal (Haiku
     modellel), ami JSON-t ad vissza: relevant, category, relevance_score
   - ha relevance_score >= 6, meghívja az összefoglaló promptot (Sonnet
     modellel), és beszúrja a digest_items táblába
   - jelöli a cikket processed = true-ra

4. Írj egy `sendDigest` funkciót, ami:
   - lekérdezi az aznapi digest_items-eket, kategória szerint csoportosítva
   - összeállít egy egyszerű HTML emailt (kategóriánként listázva)
   - kiküldi Resend-en keresztül minden aktív subscriber-nek

5. Adj hozzá egy egyszerű seed scriptet 10-15 kezdő RSS forrással
   (Canary Media, PV Magazine, Recharge News, Energy Storage News,
   Carbon Brief, Utility Dive, CleanTechnica).

6. Írj egy minimális admin oldalt (/admin), ahol látom a legutóbb
   feldolgozott cikkeket és a digest_items táblát — ez a saját
   debug/ellenőrző felületem, nem a végfelhasználói dashboard.

FONTOS:
- A szűrő és összefoglaló promptokat külön, jól nevezett fájlokba tedd
  (pl. /lib/prompts/filter.ts, /lib/prompts/summarize.ts), hogy könnyen
  iterálhassak rajtuk.
- Ne implementálj agent orchestration frameworket (LangGraph, CrewAI) —
  egyszerű szekvenciális function hívások elegendők ebben a fázisban.
- Környezeti változókba tedd az API kulcsokat (.env.local), ne hardcode-old.
- Kezeld a hibákat úgy, hogy egy sikertelen cikk-feldolgozás ne állítsa
  le a teljes batch-et.
Prompt fájlok tartalma (a Claude Code-nak átadandó fájlokhoz)

/lib/prompts/filter.ts és /lib/prompts/summarize.ts tartalma a korábban kidolgozott két prompt (szűrő + összefoglaló) — ezeket a Claude Code közvetlenül be tudja illeszteni a kódba, ha bemásolod neki a terv mellett.

Következő lépés Fázis 1 után

Ha a pipeline megbízhatóan fut 1-2 hétig és a teszt-digestek minősége jó, jöhet Fázis 2: dashboard + Stripe. Addig nem érdemes rá időt fordítani.