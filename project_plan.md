# ClimateIntel – Technical Spike

## Mai cél

Egyetlen RSS-feed lekérése és normalizálása Next.js 16 alatt.

## Adatfolyam

RSS URL
→ rss-parser
→ nyers RSS-elemek
→ saját Article típus
→ normalizált JSON response

## Nem része a mai munkának

- Supabase
- Claude API
- Resend
- cron
- scraping
- dashboard
- authentication

## Késznek tekintjük, ha

- egy API route sikeresen lekéri az RSS-feedet;
- maximum 5 cikket ad vissza;
- minden cikk azonos struktúrájú;
- van hibakezelés;
- böngészőben látjuk a JSON-választ.