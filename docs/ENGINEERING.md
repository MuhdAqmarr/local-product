# LokalLah! — Engineering guide

Read this before writing code. The visual/motion/copy source of truth is `docs/DESIGN.md`.

## What we are building

A Malaysian local-brand discovery site: a curated directory of Malaysian brands (small
"Cili Padi" makers → "Naik Daun" rising stars → "Jenama Ikon" household names) plus
**live** promos and new launches read from each brand's official store (Shopify
`products.json` / WooCommerce Store API). Freshness is the product: every page should make
it obvious that data is live and when it was last synced.

## Stack (exact versions — this is NOT the Next.js in your training data)

- **Next.js 16.4 App Router** with `cacheComponents: true` and `partialPrefetching: true`.
  When unsure, read the bundled docs in `node_modules/next/dist/docs/` (start with
  `01-app/01-getting-started/08-caching.md` and
  `01-app/02-guides/incremental-static-regeneration-cache-components.md`).
- React 19.3, TypeScript strict.
- Tailwind CSS 4.3 via `@tailwindcss/turbopack`; CSS-first config in `src/app/globals.css`
  (`@theme`). Use the design tokens — no raw hex values in components.
- Motion 14 (`motion` package; re-exports framer-motion 14).
- Lenis 1.3 (`lenis/react`).
- Icons: import from `@/components/ui/lucide` (server-safe wrappers over the vanilla `lucide`
  icon data, same props as lucide-react). Do not install lucide-react: its components are
  `"use client"`, so every icon in a Server Component became a client island. Add new icons
  to the `ICONS` map in that file.
- clsx + tailwind-merge via `cn()` in `@/lib/utils`.

## Next.js 16 + Cache Components rules (build breaks if ignored)

1. **No route segment config**: never `export const dynamic | revalidate | fetchCache | runtime`.
2. **Data only through `@/lib/catalog`** (every selector is already `'use cache'` +
   `cacheLife('catalog')` + `cacheTag('catalog')`) and the static modules `@/lib/brands`,
   `@/lib/taxonomy`. Never `fetch()` a store from a component.
3. `@/lib/catalog` is `server-only`. Client components may only `import type` from it.
4. **Server Components by default.** `"use client"` only on interactive leaves; pass slim,
   serialisable props (never the whole catalog).
5. `params` is a Promise. Dynamic routes (`/brands/[slug]`, `/categories/[slug]`) must export
   `generateStaticParams` (all slugs) and `await params` inside a component rendered within
   `<Suspense>`; unknown slug → `notFound()`.
6. **Do not read `searchParams`** in pages (it would make them dynamic). Filtering/sorting is
   client-side state.
7. **No `Date.now()`, `new Date()` or `Math.random()` in Server Components.** For server time
   math use `syncedAt` from the catalog. In client components, anything time-relative
   (e.g. `timeAgo`) must render a stable value on the server and update after mount
   (`useEffect`) to avoid hydration mismatches.
8. `generateMetadata` / `metadata` on every page (title, description, openGraph).
9. Internal links: `next/link`. Store links: `<a href={outboundUrl(url)} target="_blank" rel="noopener noreferrer">`.

## Data API (server)

`src/lib/catalog.ts`:

| Function | Returns |
| --- | --- |
| `getStats()` | `{ brands, liveBrands, products, promos, newLaunches, maxDiscount, syncedAt, source }` |
| `getPromos({ category?, brand?, limit?, perBrand?, order? })` | `ProductCardData[]` — available items with a real discount. `order: "mixed"` (default) interleaves brands; `"ranked"` = biggest discount first |
| `getNewLaunches({ … })` | `ProductCardData[]` — published within `NEW_WINDOW_DAYS` (30) of the last sync, newest first |
| `getBrandProducts(slug)` | `{ promos, newest, status?: FeedStatus, syncedAt }` |
| `getBrandSummaries()` | `BrandSummary[]` — every brand + `live`, `promoCount`, `newCount`, `maxDiscount`, `previews` (≤3 photo URLs) |
| `getCategorySummaries()` | `CategorySummary[]` — per category counts + ≤4 preview photos |
| `getSearchIndex()` | `SearchItem[]` — brands then products, compact |

`ProductCardData` = `Product` + `brandName`, `brandCategory`, `brandTier`. `Product` has
`id, brand, title, url, image?, imageW?, imageH?, price, compareAt?, discount?, currency,
publishedAt?, available, type?` (see `src/lib/types.ts`).

Static: `BRANDS`, `getBrand(slug)` (`@/lib/brands`); `CATEGORIES`, `CATEGORY_BY_SLUG`,
`TIERS`, `TIER_BY_SLUG`, `STATES`, `NEW_WINDOW_DAYS` (`@/lib/taxonomy`).

JSON endpoints (prerendered, refreshed with the catalog) for client-side "load more",
filters and search: `GET /api/feed/promos`, `GET /api/feed/new`, `GET /api/feed/search`.

Brands may have zero live products (no readable store). Every product surface needs a
graceful empty state, and brand pages must still look complete without products.

## Client helpers

- `useSaved()` (`@/lib/saved`) — localStorage "Simpan" list: `{ items, count, isSaved(id), toggle(item), remove(id), clear() }`. Brand ids: `brandSavedId(slug)`.
- `prepareIndex()` / `search()` (`@/lib/search`) — search ranking over `SearchItem[]`.
- `formatPrice(amount, currency)`, `timeAgo(iso, now, locale)`, `formatCount(n)`, `outboundUrl(url)` (`@/lib/format`). Copy and links follow docs/I18N.md.
- `sizedImage(src, width)`, `imageSrcSet(src)` (`@/lib/images`) — Shopify CDN resizing.

## Motion & scrolling

- Root providers render `<MotionConfig reducedMotion="user">` + `<LazyMotion features={domAnimation} strict>`.
  Therefore in client components use `import * as m from "motion/react-m"` and `<m.div>`;
  **`motion.div` throws under `strict`**. Hooks and helpers come from `"motion/react"`
  (`useScroll`, `useTransform`, `useInView`, `useReducedMotion`, `AnimatePresence`, `animate`, `stagger`).
- Shared durations/easings/springs/variants live in `@/lib/motion` — reuse them.
- Animate `transform`/`opacity` only (filter sparingly). In-view reveals use
  `viewport={{ once: true, margin: "0px 0px -10% 0px" }}`. No `layout` animations on grids
  with more than ~12 items. Scroll-linked effects only on a few hero/story elements.
- Lenis runs via `<ReactLenis root>` in providers. Inside modals, drawers or any scrollable
  panel add `data-lenis-prevent`. Programmatic scrolling: `useLenis()` from `"lenis/react"`.
  Stop Lenis while a modal is open (`lenis?.stop()` / `lenis?.start()`).
- Every animated component must look correct with `prefers-reduced-motion: reduce`.

## Images

Product photos only via `<ProductImage>` (plain `<img>` + Shopify `srcset`; no Vercel image
optimisation costs). Always reserve space (aspect-ratio box) to avoid CLS. `loading="lazy"`
except the first few above-the-fold items (`priority`). Photos come in mixed sizes and
backgrounds: present them on a consistent tinted tile with `object-cover`.

## Accessibility & UX baseline

- Visible focus rings (`:focus-visible`), skip link, landmarks (`header`, `nav`, `main`, `footer`).
- Icon-only buttons get `aria-label`. Product image `alt` = product title.
- Body text meets WCAG AA contrast. Touch targets ≥ 44px.
- Every list has loading (skeleton), empty and error states.

## Honesty rules

Never invent products, prices, promos, ratings or partnerships. Product data comes only
from the catalog. Copy must not overclaim ("all Malaysian brands", "official partner").
Prices can change — say so near prices and link to the brand's store.

## Working agreements for agents

- Stay inside the files your task owns; if you need a change elsewhere, note it in your report.
- Verify with `npx tsc --noEmit` and `npx eslint <your files>`.
- A shared dev server runs at `http://localhost:3100` — do not start another `next dev`, and
  do not run `next build` unless your task says so.
- Visual check: `node <scratch>/qa/shoot.mjs http://localhost:3100 <outDir> /your-path` writes
  mobile + desktop screenshots you can open with the Read tool.
