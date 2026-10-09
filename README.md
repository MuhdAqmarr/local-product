# LokalLah! 🌺

**Semua jenama lokal, sentiasa up to date.** A directory of Malaysian-made brands, from tiny
*Cili Padi* home-grown makers to *Jenama Ikon* household names, with **live promos** and
**new launches** read straight from each brand's official online store.

Built in answer to a viral Threads wish: *"boleh tak ada sorang buat website yang compile all
local brand products… and MUST BE UP TO DATE dari segi promotion and new products they launched"*.

Live: https://lokallah.vercel.app

## What it does

- **207 curated Malaysian brands** across 11 categories, each researched and fact-checked for
  Malaysian origin, tiered as Cili Padi 🌶️ (small & indie), Naik Daun 🌿 (rising) or Jenama Ikon 👑.
- **Live store data** for the brands that run their own Shopify or WooCommerce store: every
  promo (price below the store's own compare-at price) and every product launched in the last
  30 days, linking out to the brand's official store.
- Search (⌘K), filters, a brand directory, brand profiles, a saved list (kept on your device),
  and a cute, fast UI: Lenis smooth scroll, meaningful motion, skeletons, lazy images.

## How the data stays fresh

1. `npm run sync` reads every brand store and writes `src/data/snapshot.json`.
   - Shopify: `/products.json` (latest 250 products), `/meta.json` (store country) and
     `/cart.js` (presentment currency). Requests ask for the **Malaysian market** explicitly,
     because Shopify Markets otherwise localises prices to wherever the request comes from.
   - WooCommerce: the public Store API (`/wp-json/wc/store/v1/products`).
   - One request per store per refresh, honest `LokalLahBot` user agent, 429 back-off.
2. Every deploy runs the sync first (`prebuild`, Vercel/CI only), so each build ships fresh data.
3. On Vercel the catalog is a `'use cache'` function with a custom `catalog` cache life:
   pages refresh in the background about every 3 hours, and a daily cron
   (`/api/cron/refresh`, 06:00 MYT) marks everything stale. If a store fails, its last good
   data stays up with an honest timestamp.

Brands that only sell on marketplaces (Shopee, TikTok Shop, Lazada) are listed with links
but no live products; we do not scrape marketplaces.

## Stack

Next.js 16.4 (App Router, Cache Components, Partial Prefetching) · React 19.3 · TypeScript ·
Tailwind CSS 4.3 · Motion 14 · Lenis 1.3 · lucide-react · deployed on Vercel (functions in `sin1`).

## Develop

```bash
npm install
npm run dev          # http://localhost:3000 — renders the committed snapshot
npm run sync         # refresh src/data/snapshot.json from the live stores
LOKAL_LIVE=1 npm run dev   # read stores live at runtime, like production
npm run build        # production build (sync runs first on Vercel/CI only)
npm run typecheck && npm run lint
```

Rebuild the brand list from research files (and re-detect store platforms):
`npm run brands -- <research-dir>`. Manual corrections that must survive re-runs live in
`src/data/brand-overrides.json`.

### Environment

| Variable | Where | Purpose |
| --- | --- | --- |
| `CRON_SECRET` | Vercel (production) | Protects `/api/cron/refresh` (Vercel Cron sends it) |
| `NEXT_PUBLIC_SITE_URL` | Vercel (production) | Canonical URL for metadata, sitemap, OG |
| `SUGGEST_WEBHOOK_URL` | optional | Where "Cadang jenama" suggestions are POSTed |
| `SUGGEST_EMAIL` | optional | Without a webhook, the form hands the visitor a prefilled email to this address; with neither, the About page shows a "suggestions open soon" note instead of the form |
| `LOKAL_LIVE` | local, optional | `1` reads stores live at runtime, `0` forces the snapshot |

## Project map

- `src/lib/feeds/` — store readers, normalisation, refresh with snapshot fallback
- `src/lib/catalog.ts` — cached selectors (promos, new launches, brand products, stats, search index)
- `src/data/` — `brands.json`, `brand-overrides.json`, `snapshot.json`
- `src/components/` — UI ("Kedai Oyen" design system: Oyen the ginger-cat tauke, stickers, rails…)
- `docs/DESIGN.md` · `docs/ENGINEERING.md` · `docs/COMPONENTS.md` — design spec, engineering rules, component API

## Honesty

LokalLah! is an independent directory, not affiliated with the brands, with no paid placements
or commission. Product names, prices and photos belong to their brands and come from their
public stores; prices can change, so always confirm on the brand's store. Outbound links carry
`utm_source=lokallah` so brands can see the visits. Brand owners can ask for corrections or
removal through the suggest form on the About page.
