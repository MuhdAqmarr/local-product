# LokalLah! — Shared components (foundation reference)

The foundation (shell + commerce + art) is merged. This file lists what page builders can import
today, with the real props. `docs/DESIGN.md` wins on visuals, motion and copy;
`docs/ENGINEERING.md` wins on data, caching and framework rules. If a prop here disagrees with the
source, the source is right. Fix this file in the same change.


S = Server Component (hook-free, safe anywhere). C = `"use client"`. Server Components can render
C components, but must pass only serialisable props (no functions).

---

## 0. Rules that bite

1. **`cn()` lives in `@/lib/utils`.** It is a token-aware tailwind-merge, so
   `cn("text-caption text-ink-soft")` keeps both and `bg-bandung bg-bandung-fizz` keeps both.
   Do not use plain `twMerge`. Plain `clsx` is fine when you don't need merging.
2. **No CSS modules.** `next.config.ts` sends every `*.css` file through the Tailwind loader as global
   CSS, so `*.module.css` class maps come back empty. Use Tailwind classes. If you must write CSS,
   use a plain `.css` file next to the component with a prefixed class (`brand.css` → `.kedai-*`)
   and add one `@import "../components/…/my-thing.css";` line at the top of `src/app/globals.css`.
   Never import CSS from a component: every extra import becomes its own render-blocking stylesheet
   (Lighthouse counted 4–7 per page) and prefetched routes inject preloads for it.
3. **One `<main>`.** The root layout already renders `<main id="main">`, the header, footer, tab bar,
   back-to-top, toast region, search provider and RevealObserver. A page returns its content only,
   wrapped in `<PageTransition>`.
4. **Motion in client code:** `import * as m from "motion/react-m"` and use `<m.div>`. `motion.div` throws
   because `LazyMotion` is strict. Hooks come from `"motion/react"`. Shared timings are in `@/lib/motion`.
5. **No `searchParams` in pages, and no `Date.now()`, `new Date()` or `Math.random()` in Server
   Components.** Server time math uses the catalog `syncedAt`. URL state is client-only: read it after
   mount and write it with `history.replaceState` or `router.replace` inside `startTransition`.
   For an example, see `usePageParam()`.
6. **Never mutate server-rendered DOM before it has hydrated.** If you set classes or attributes on
   streamed HTML before its Suspense segment hydrates, React logs a hydration mismatch.
   `RevealObserver` handles `data-reveal` and `data-ambient` for you. Do the same in your own code:
   use React state, or wait until after mount.
7. **`LivePill` renders a `<div>`.** Never put it inside a `<p>`.
8. **Unknown slugs** call `notFound()` inside a `<Suspense>`d component. Next 16 then keeps HTTP 200
   and adds `noindex`. This is documented behaviour, and the 404 UI still renders.
9. **Honesty.** Don't invent facts. Copy must never claim "all Malaysian brands", partnerships or ratings.
   Near prices, say they can change and link to the brand's store with `outboundUrl()`.

---

## 1. Layout tokens and CSS hooks (globals.css)

| Thing | Use |
|---|---|
| `container-page` | Page width (`--container` 1240) + gutter (`--gutter` 16/24/32). |
| `--section-y` | Vertical rhythm between sections: `py-(--section-y)` or `mt-(--section-y)`. |
| `--header-h`, `--awning-h`, `--awning-block`, `--header-total`, `--tabbar-h`, `--filterbar-h` | Shell measurements. `--tabbar-h` is 0 at ≥ 1024. |
| `.sticky-stack` | Page-level sticky bars (filter bar, brand tabs): sticks under the header and moves with it (awning tuck, hide on scroll on mobile). |
| `.sticky-sub` | Second-level sticky headers under header + filter bar, also moving with the stack. `--sub-top` sets the extra offset (default `--filterbar-h`). Where no filter bar shows, set `--filterbar-h: 0px` on a wrapper (e.g. `lg:[--filterbar-h:0px]`). |
| `data-cat="{slug}"` | Scopes `--cat-tint / --cat-mid / --cat-pop / --cat-ink` (use `bg-(--cat-tint)`, `text-(--cat-ink)`). |
| `data-tier="{slug}"` | Scopes `--tier-tint / --tier-pop / --tier-ink / --tier-grad` (`bg-tier`). |
| `data-reveal` (+ `style={{"--i": n}}`) | Generic fade-up when scrolled into view (RevealObserver). Content is visible without JS and while hydrating. Don't put a className that changes after mount on a reveal target. |
| `data-ambient` | Marks a container with CSS loops (`.ambient` children, `.mesh-blob`, `.marquee-track`). It is auto-paused offscreen and in hidden tabs via `data-paused`. Oyen, WauBulan (`sway`) and Seal (`spin`) set it themselves. |
| `data-saved-target` | Fly-to-Simpan destination. The header heart (desktop) and tab bar Simpan (mobile) already carry it. |
| `data-tier-trigger` | On a parent of `TierIcon`: plays the tier micro-animation on hover, focus-visible or `data-active="true"`. |
| `data-lenis-prevent` | On any scrollable panel inside the page (Sheet bodies already have it). |
| Gradients | `bg-gula-kapas`, `bg-bandung-fizz`, `bg-mangga-lassi`, `bg-cendol`, `bg-senja`, `bg-teh-tarik`, `bg-kuih-lapis`, `bg-sunburst`, `bg-tier`, `bg-cover-cat`; `text-grad-lokal` (accent word). |
| Utilities | `no-scrollbar`, `edge-fade` (`--fade`), `stretched-link`, `hand` (Gochi annotation, max one per viewport). |
| Component classes | `.pop` + `.pop-face` (hard-shadow press), `.awning`/`.awning-wrap`, `.mesh` + 3 × `.mesh-blob`, `.skeleton`/`.bone`, `.deal-1/2/3`, `.baru-je`, `.baru`, `.habis`, `.cop`/`.cop-lg`, `.count-bubble`, `.live-dot[data-ping]`, `.plate`, `.card`, `.odo`, `.marquee`/`.marquee-track`, `.pucuk`, `.kuih-strip`, `.songket`, `.batik`, `.dots`, `.progress-indeterminate`. |
| Hero intro (CSS, once per session) | `.intro-rise`, `.intro-slap`, `.intro-swash`, `.intro-peek` with `style={{"--d": "120ms"}}`. Mount `<HeroIntroGuard />` once on Home. |
| Type scale | `text-display`, `text-title-1/2/3`, `text-lead`, `text-body`, `text-body-sm`, `text-label`, `text-button`, `text-label-sm`, `text-tab`, `text-caption`, `text-overline`, `text-price`, `text-price-lg`, `text-deal`, `text-deal-lg`, `text-stat`, `text-hand`. Fonts: `font-sans` (Poppins), `font-num` (Fredoka numerals and stickers), `font-hand` (Gochi). |
| Radii | `rounded-xs` 6 · `tag` 8 · `thumb` 12 · `plate`/`input` 14 · `card` 20 · `tile` 22 · `card-lg` 24 · `sheet` 28 · `panel` 32. |
| Shadows | `shadow-xs`, `card`, `card-hover` (never animate it: `.card` crossfades a layer), `pop-sm` 2px, `pop` 4px, `pop-lg` 6px, `sticker`, `diecut`, `float`, `sheet`, `up`. |
| Border convention | Product surfaces: `border-2 border-garis` + `rounded-card`. Big "sticker" surfaces (Band, brand cards, buttons): `border-2 border-ink` + a pop shadow. Inputs and unselected chips: `border-garis-kuat`. |

Only palette tokens exist (`--color-*: initial`). There is no `gray-500`. Text colours: `ink`, `ink-2`
(over gradients), `ink-soft` (meta), `ink-dim` (on ink only), `bandung-pekat`, `telang`,
`pandan-pekat`, `kunyit-pekat`, `sambal-pekat`.

---

## 2. Motion helpers

`@/lib/motion` (Appendix B): `dur`, `ease`, `spring` (`snappy`, …), `dist`, `gap`, `MAX_STAGGERED` (6),
`viewportOnce`, `defaultTransition`. Variants: `fadeUp`, `fadeIn`, `slideInX`, `staggerContainer(interval?, delay?)`,
`pop`, `stampIn`, `wiggle`, `heartSave`, `bump`, `toast`, `chipPresence`, `fab`. Also `nudgeX`,
`nudgeKeyframes`, `FLY_TEACH_LIMIT`, `flightPath`, `flightTransition`.

```tsx
"use client";
import * as m from "motion/react-m";
import { fadeUp, viewportOnce } from "@/lib/motion";
<m.div variants={fadeUp} initial="hidden" whileInView="show" viewport={viewportOnce} />
```

| Import | Kind | API |
|---|---|---|
| `@/components/motion/page-transition` | S | `PageTransition` (wrap every page body; Links pass `transitionTypes={["nav-forward"\|"nav-back"\|"nav-tab"]}`), `SkeletonOut` (wrap a Suspense fallback), `ContentIn` (wrap Suspense content). React `<ViewTransition>` works in 16.4 without any config; unsupported browsers just render. |
| `@/components/motion/rail-stagger` | C | `RailStagger({ label, children, className?, itemClassName?, hint?, style?, id? })`. Used inside `Rail`; reach for it only for a custom horizontal track. |
| `@/components/motion/hero-intro-guard` | C | `<HeroIntroGuard />`: marks the CSS hero intro as played (`html[data-intro=done]`, sessionStorage). |
| `@/components/motion/ambient-pause` | C | `<AmbientPause />` inside a `[data-ambient]` element. Optional now that RevealObserver auto-tracks `[data-ambient]`. |
| `@/components/motion/use-ambient-pause` | C | `useAmbientPause(ref)`, `trackAmbient(el) → cleanup`. |
| `@/components/providers/motion-pref` | C | `useMotionPref(): "user" \| "always"`, `useSiteMotionReduced()`, `prefersLessMotion()` (for event handlers), `setMotionPref(reduce)`. |

Lenis: `useLenis()` from `"lenis/react"` for programmatic scroll. It is `undefined` on touch-only devices and under
reduced motion (Lenis is mounted only for a fine pointer with full motion), so every caller falls back to
`window.scrollTo`. Lenis's frame loop runs only while it smooth-scrolls (`lenis.scrollTo` starts it). `<dialog>`s lock scroll through
`html:has(dialog[open])`.

---

## 3. UI primitives — `@/components/ui/*`

| Component | Kind | Props |
|---|---|---|
| `Button` (`button.tsx`) | S | `variant?: "primary"\|"secondary"\|"outbound"\|"soft"\|"ghost"\|"danger"`, `size?: "lg"\|"md"\|"sm"`, `icon?`, `trailing?: ReactNode\|"arrow"\|"outbound"`, `loading?`, `fullWidth?`, `faceClassName?`. Renders a `<button>`, a `Link` (`href`) or an external `<a target=_blank>` (`href` + `external`). Also `buttonClasses(variant,size)` and `Dots`. |
| `IconButton` | S | `label` (required aria), `icon`, `size?: 44\|40\|36`, `variant?: "pop"\|"plain"`, `href?`, `faceClassName?`, plus button attributes. |
| `Pop`, `popStyle()` | S | Generic `.pop` wrapper: `offset?` (4 buttons / 2 chips / 6 cards), `radius?`, `color?`, `faceClassName?`. |
| `Chip`, `chipClasses()` | S* | `children`, `icon?`, `selected?`, `count?`, `dense?`. Button mode (`aria-pressed`, needs a client parent for `onClick`) or Link mode (`href`, `prefetch?`, `transitionTypes?`). Colour comes from the nearest `data-cat`. |
| `Field`, `Input`, `Textarea`, `Select` | S | All take `id` (required), `label?`, `helper?`, `error?`, `fieldClassName?`, plus native attributes. `Input` also takes `icon?`; `Select` takes `options: {value,label}[]` and `placeholder?`. Helpers: `describedBy`, `controlClasses`, `helperId`, `errorId`. |
| `Switch` | C | `checked`, `onCheckedChange`, `label?` or `aria-label`, `description?`, `disabled?`, `labelAfter?`, `onInk?`. |
| `Segmented<V>` | C | `options: {value,label,icon?,ariaLabel?}[]`, `value`, `onChange`, `label`, `size?: "md"\|"sm"`, `fit?: "equal"\|"content"`, `wrap?`. Cells are equal width. `equal` (default) truncates labels; `content` (`auto-cols-[1fr]`) never shrinks a cell below its label, so give the control room (`w-max min-w-[540px]`). `wrap` hides icons below 640 px and lets labels wrap to two centred lines (full tier names in a phone-width h-11). |
| `Tabs<V>` | C | `base`, `items: {value,label,count?,icon?}[]`, `value`, `onChange`, `label`. Panels: `<div role="tabpanel" id={panelId(base,v)} aria-labelledby={tabId(base,v)} className="tab-panel" hidden={v!==value}>`. |
| `Sheet`, `Modal` | C | `DialogBaseProps`: `open`, `onClose`, `title`, `hideTitle?`, `description?`, `children`, `footer?`, `className?`, `bodyClassName?`, `initialFocusRef?`, `id?`. Native `<dialog>` + CSS enter/exit. The body is `data-lenis-prevent`. |
| `PopoverTrigger`, `PopoverPanel` | S | Native `popover`: `<PopoverTrigger target="x">` + `<PopoverPanel id="x" label? align?: "start"\|"end"\|"center">`. Zero JS. |
| `SectionHeader`, `Accent`, `Highlight` | S | `title`, `eyebrow?`, `sub?`, `meta?`, `href?`, `linkLabel?` ("Tengok semua"), `as?: "h1"\|"h2"`, `id?`, `aside?`, `noReveal?` (use above the fold). `Accent` = one gradient word that pops in on reveal; `Highlight` = mangga marker bar. |
| `Band` | S | `tone?: "gula-kapas"\|"bandung-fizz"\|"mangga-lassi"\|"cendol"\|"senja"\|"teh-tarik"\|"putih"`, `as?: "section"\|"div"\|"header"`, `id?`, `labelledBy?`. Ink-outlined gradient panel (`rounded-sheet` → `md:rounded-panel`, `shadow-pop-lg`). |
| `InfoPill` | S | `tone?: "promo"\|"baru"\|"info"\|"neutral"\|"cat"`, `icon?`. |
| `CountBubble` | S | `count`, `showZero?` (caps at 99+). |
| `Kbd` | S | `children`. |
| `StretchedLink` | S | Link props + `external?`. Whole-card click target; put other controls above it with `relative z-10`. |

```tsx
<Button href="/promos" trailing="arrow">Tengok promo hari ni</Button>
<Button href={outboundUrl(brand.website)} external variant="outbound" trailing="outbound">Lawat kedai rasmi</Button>
<SectionHeader title={<>Promo <Accent>panas</Accent> sekarang</>} sub="Harga turun, dikesan terus dari kedai rasmi." meta={`${n} promo`} href="/promos" />
```

---

## 4. Feedback — `@/components/feedback/*`

| Component | Kind | Props |
|---|---|---|
| `LivePill` (`live-pill.tsx`) | S | Site mode: `syncedAt`, `source`, `liveBrands?`, `brands?`, `watch?` (refresh on focus and toast new syncs), `promos?`. Brand mode: `syncedAt` + `brand: {name, hasFeed, status?: FeedStatus}`. Also `size?: "md"\|"sm"`, `className?`. Includes the "how syncing works" popover. **Renders a div.** |
| `LiveTime` | C | `iso`, `initial?`, `className?`. The server prints the clock time; after mount it shows relative time, updated every 60 s. Also `useNow(intervalMs?)`. |
| `Odometer` | S | `value`, `prefix?`, `suffix?`, `roll?: "intro"\|"reveal"\|"none"`, `srText?`. `reveal` needs a `data-reveal` ancestor that starts below the fold. |
| `toast`, `useToast`, `announce`, `dismissToast` (`toast-region.tsx` or `toast-store.ts`) | C | `toast({ message, tone?: "save"\|"success"\|"error"\|"offline"\|"info", action?: {label, onClick?\|href?}, duration? })`. `announce(text)` = screen-reader only. `ToastRegion` is already mounted; auto-dismiss pauses while hovered **or** while focus is inside the toast (tracked separately), and resumes with at least 1.5 s left. |
| `EmptyState` | S | `mood?` (Oyen), `title`, `body?`, `primary?`/`secondary?: {label, href?, external?, onClick?, trailing?}`, `note?` (Gochi), `as?`, `children?`. |
| `ErrorFrame` | S | `mood`, `title`, `body`, `children?`, `kite?`. Used by 404 and error pages. |
| `LoadingLine` | C | `start?`, `className?`. Rotating Gochi lines (`LOADING_LINES`). Text renders on the client only (prerendered fallbacks never show it, and it kept Gochi Hand off the first paint). |

Freshness (`@/lib/freshness`): `syncState(iso, source, now)` → `"fresh"|"stale"|"old"|"none"`
(4 h / 24 h), `brandSyncState(hasFeed, status, fallbackIso, now)`, `SYNC_COPY`, `formatClock(iso)`
("3:40 PTG"), `formatDate(iso)` ("9 Okt 2026"). On the server, pass `now = Date.parse(syncedAt)`.

---

## 5. Skeletons — `@/components/skeletons`

`Bone({ className?, i?, style? })`, `SkeletonRegion({ children, line?, label? })` (aria-busy +
LoadingLine), `plateTint(i, category?)`, `ProductCardSkeleton({ i?, category? })`,
`ProductRowSkeleton`, `BrandCardSkeleton({ i? })`, `BrandRowSkeleton`,
`GridSkeleton({ count?, category?, sidebar?, view?, line? })`,
`RailSkeleton({ count?, category?, header?, line? })`, `TileGridSkeleton({ count?, line? })`,
`BrandHeroSkeleton({ category? })`, `SearchRowSkeleton({ i? })`, `BrandGridSkeleton({ count?, line? })`,
`PageHead({ tone, eyebrow?, title, sub?, children? })` (real page head for `loading.tsx`, so the title
doesn't flash).

```tsx
// app/promos/loading.tsx
<PageTransition><PageHead tone="mangga-lassi" title="Promo panas" /><SkeletonOut><GridSkeleton count={8} /></SkeletonOut></PageTransition>
```

---

## 6. Product — `@/components/product/*`

| Component | Kind | Props |
|---|---|---|
| `ProductCard` | S | `product: ProductCardData`, `syncedAt`, `checkedAt?`, `priority?` (LCP), `eager?`, `context?: "grid"\|"rail"`, `emphasis?: "promo"\|"baru"`, `hideBrandLink?` (brand pages: brand name as plain text), `className?`. The brand link has a 44 px tall tap target (padding + negative margin). |
| `ProductRow` | S | `product`, `syncedAt`, `checkedAt?`, `eager?`, `emphasis?`. "Senarai" list row. |
| `ProductGrid` | S | `products`, `syncedAt`, `checkedAt?: Record<brandSlug, iso>`, `startIndex?`, `sidebar?` (max 4 columns), `view?: "grid"\|"list"`, `emphasis?`, `eagerCount?`, `priorityFirst?` (false when below the fold). Also `PAGE_SIZE` (24) and `gridColumns(sidebar?)`. |
| `ProductFeedMore` (`load-more.tsx`) | C | `endpoint` ("/api/feed/promos" \| "/api/feed/new"), `initialCount?`, `total`, `syncedAt`, `checkedAt?`, `sidebar?`, `view?`, `emphasis?`, `noun?`, `end?`. Place it directly under a server `ProductGrid` that shows the first `initialCount` items **in the same order as the feed** (`getPromos()` / `getNewLaunches()` with the same options). Syncs `?page=`. |
| `LoadMore`, `usePageParam()`, `loadFeed(endpoint)` | C | For client-filtered lists. `LoadMore({ shown, total, onMore, pending?, noun?, error?, onNear? })`. `error` shows the inline "Alamak, tak jadi. Cuba lagi?" alert and turns the button into "Cuba lagi" (the caller's `onMore` retries **without** advancing `?page=`). `onNear` prefetch: fires once when the button is within 800 px, armed only after the first user scroll, skipped on Save-Data. The "Kau dah tengok N daripada M" line is not a live region (the result count announces). `loadFeed` fetches, decodes (`feed-codec.ts`) and memoises a feed once per visit. |
| `PlateImage` | C | The only product `<img>` (ENGINEERING's "ProductImage"): `src?`, `alt`, `width?`, `height?`, `category`, `sizes?` (`PLATE_SIZES.grid\|rail\|row\|collage\|thumb\|search`), `priority?`, `eager?`, `glyph?`. Handles fit, srcset (96–800w, `IMAGE_WIDTHS`), fade-in and the missing-photo fallback. Always pass the `sizes` of the rendered slot: a 44 px thumb with `PLATE_SIZES.thumb` picks 96w/160w at DPR 2–3. |
| `SaveButton` | C | `product`, `size?: "md"\|"lg"`, `tone?: "float"\|"solid"`. Full "Masuk Simpan" reward: pop, ring, `<Particles>`, flight to `[data-saved-target]` for the first 3 saves of a session, bump, toast on the first save, Undo on unsave. |
| `HeartToggle` | C | Low-level heart: `saved`, `onToggle(): boolean`, `onChange?`, `label: {save, unsave}`, `size?`, `tone?`. ONE `svg.heart-ic` (lucide heart path); `.heart-on` fills it bandung in CSS (save-button.css), pop class on the same svg. |
| `DealSticker` | S | `discount?`, `size?: "card"\|"lg"\|"mini"`, `level?`, `label?`. L1/L2/L3 from `dealLevel()`. |
| `BaruSticker`, `baruKind(publishedAt, syncedAt)` | S | `publishedAt?`, `syncedAt`, `calm?`. "Baru je" ≤ 3 days, "Baru" ≤ 30 days, measured against `syncedAt`. |
| `Price`, `priceSentence`, `displayPrice`, `jimatText` | S | `price`, `compareAt?`, `discount?`, `currency`, `size?: "md"\|"lg"`, `jimat?: "auto"\|"always"\|"never"`, `announce?`. Use `displayPrice()` instead of `formatPrice()` when a price can exceed RM999 (it adds thousands separators). |
| `DealGroupHeader` | S | `level`, `count?`, `stickyTop?` (omit = `.sticky-sub`; string = custom top; `null` = static), `id?`. |
| `KalendarKoyak`, `dayLabel`, `myDay`, `myDayKey` | S | `date`, `reference` (= syncedAt), `count?`, `stickyTop?` (same modes). Group /new by `myDayKey(publishedAt)` (Malaysia time). |
| `RelTime` | C | `iso`, `base` (syncedAt), `prefix?`. Server text uses `base`; updates after mount. |
| `CategoryGlyph`, `CATEGORY_ICONS` | S | `category`, `size?`. |

```tsx
const [stats, promos] = await Promise.all([getStats(), getPromos({ limit: PAGE_SIZE })]);
<ProductGrid products={promos} syncedAt={stats.syncedAt} />
<ProductFeedMore endpoint="/api/feed/promos" initialCount={promos.length} total={stats.promos} syncedAt={stats.syncedAt} noun="promo"
  end={<p className="pt-6 text-center text-body text-ink-2">Dah habis! Kau dah tengok semua promo hari ni.</p>} />
```

`/api/feed/new` and `/api/feed/promos` hold **in-stock items only**, so there is no "show sold out" filter.
The three `/api/feed/*` routes send a slim wire format (brand table, path-only links, per-brand image
base, one-letter keys / tuples; see `listing/feed-codec.ts`) with `Cache-Control: public, max-age=300,
s-maxage=10800, stale-while-revalidate=594000`. Always read them through `loadFeed()` /
`loadSearchIndex()`, which decode back to `ProductCardData` / `SearchItem`. Listings fetch them **only on
interaction** (filter, sheet, "Muat lagi", or scrolling near "Muat lagi") or for URL filters / `?page=`;
never on load or idle. After a "Muat lagi" append, focus moves to the first new card's link.

---

## 7. Brand — `@/components/brand/*`

| Component | Kind | Props |
|---|---|---|
| `BrandCard` | S | `brand: BrandCardData` (any `BrandSummary` fits; needs `hasFeed`), `layout?: "card"\|"auto"`, `morph?` (monogram view-transition, only where the brand appears once on the page), `prefetch?` (`true` = viewport prefetch; default prefetches on intent via `BrandLink`). `layout="auto"` (directory and category grids) is ONE DOM that renders as the compact brand row below 480 px (name in 2 lines, cop on its own line, 2 thumbs < 400 px / 3 from 400 px / none < 340 px, promo pill) and as the kedai card from 480 px (brand.css `.kedai-auto`). Never render a second component per breakpoint. Also `BrandCounts` (no products: "Rak online kosong buat masa ni" when `hasFeed`, else "Kedai ni belum boleh disync"), `BrandCollage({ previews, sizes? })`. |
| `BrandLink` | C | Drop-in `next/link` for dense link grids: `prefetch={false}` plus `router.prefetch(href)` on pointer enter, touch start and focus (skipped under Save-Data). |
| `packPreview` / `unpackPreview` | lib | `brand/preview-url.ts`: strip / restore the `https://cdn.shopify.com/s/files/` prefix of preview photos in client payloads. `BrandCard` unpacks itself. `letterOf(name)` (A–Z rail letter) is in `brand/directory-letter.ts`. |
| `Monogram` | S | `slug`, `name`, `category`, `size?: 20\|36\|56\|96`, `tier?` (badge), `morph?` (VT name `brand-av-{slug}`). |
| `TierCop`, `TIER_COPY` | S | `tier`, `size?: "sm"\|"lg"`, `explain?` (popover explainer, default true). |
| `TierStamp` | S | `tier`, `size?` (112), `spin?`. |
| `BrandLinks` | S | `brand: Pick<Brand,"name"\|"website"\|"instagram"\|"tiktok"\|"shopee">`, `primary?`, `size?`. Adds UTM-tagged outbound links. |
| `SaveBrandButton` | C | `brand: {slug,name,category,tier}`, `tone?`, `size?`. |

Lib: `monogram(slug,name)`, `initials`, `fnv1a`, `MONO_SHAPES` (`@/lib/monogram`); `photoFit(w,h)` (`@/lib/photo-fit`);
`dealLevel`, `DEAL_THRESHOLDS`, `DEAL_GROUPS`, `formatDiscount`, `savedAmount` (`@/lib/deal`).

---

## 8. Category and rail

| Component | Kind | Props |
|---|---|---|
| `CategoryTile` | S | `slug: CategorySlug\|"all"`, `promos?`, `brands?`, `compact?`, `morph?` (VT `cat-ic-{slug}`, once per page), `onShelf?`. Links through `BrandLink` (no viewport prefetch, prefetch on intent). |
| `CategoryShelf` | S | `categories: {slug,brands,promos}[]` (`getCategorySummaries()`), `allBrands?`, `morph?`. |
| `CategoryChip` | C | `category: CategorySlug\|"all"`, `selected?`, `onToggle?(category, selected)` or `href?`, `label?`, `count?`, `dense?`. |
| `ChipRow` | S | `label` (group name), `wrapFrom?: "md"\|"lg"\|"never"`, `children`. Scrolls with edge fade. |
| `Rail` | S | `id`, `title`, `titleText?` (plain text when `title` has markup), `sub?`, `eyebrow?`, `art?`, `count?`, `noun?`, `href?` (adds the end card and "Tengok semua"), `hint?` (first Home rail only), `as?`, `children` (one cell per child). Desktop prev/next buttons included. |
| `RailControls`, `RailEndCard` | C / S | `RailControls({ trackId })`, `RailEndCard({ href, count?, noun })`. |

```tsx
<Rail id="promo-panas" title={<>Promo <Accent>panas</Accent> sekarang</>} titleText="Promo panas sekarang"
  count={stats.promos} noun="promo" href="/promos" hint>
  {promos.map((p) => <ProductCard key={p.id} product={p} syncedAt={stats.syncedAt} context="rail" />)}
</Rail>
```

---

## 9. Shell, search and layout (already mounted; reuse the pieces)

- **Search:** `useSearch()` → `{ open({ query? }), close, isOpen }`. `preloadSearch(withIndex?)` warms the
  chunk on intent, and `loadSearchIndex()` → `Promise<SearchItem[]>` (decoded from the slim feed). ⌘K / Ctrl+K and "/"
  do nothing while another `dialog[open]` (Tapis sheet, modal) is up. Empty-state examples show only terms with 3+ product
  hits. `SearchTrigger({ variant: "pill"|"icon"|"tab" })`.
  The dialog is lazy-loaded from `search/search-dialog.tsx`. Its default export
  `SearchDialog({ open, onClose, initialQuery })` is a **minimal stub**; keep that signature when you
  replace it. Ranking: `prepareIndex()` / `search()` in `@/lib/search`.
- **Saved store:** `useSaved()` → `{ items, count, isSaved(id), toggle(item) → boolean, remove(id), clear() }`;
  `brandSavedId(slug)`. Items: `{kind:"product", id, product}` or `{kind:"brand", id, brand}` (+ `savedAt`).
- **Layout parts:** `Logo({ onInk?, size? })`, `Awning({ color?, height?, outlined? })`, `MotionToggle({ variant?: "switch"|"footer" })`,
  `NavLink`, `PendingDots`, `NavSquiggle`, `isActivePath`, `KategoriTrigger`, `CategoryTiles`/`TierLinks`,
  `RandomBrandLink({ slugs })`, `SavedLink`, `BackToTop` (Home and list pages only: `/`, `/promos`, `/new`, `/brands*`, `/categories/*`; hidden on error/404 frames and while the footer is in view; no listeners elsewhere), `SkipLink`.
  `ShellLink` (C): `next/link` for the header, tab bar and logo. Default viewport prefetch, but only after the first
  page has loaded and gone idle (`useAfterLoad()` from `@/lib/after-load`), so ~40–100 KB of shell prefetches no longer
  compete with the first paint. Use it for any link that sits on every page; use `BrandLink` in dense grids.
  `HeaderScroll` and `BackToTop` read `window.scrollY` from one passive `scroll` listener, once per frame (no Motion
  `useScroll` for threshold checks). `PendingDots`/tab dots render their `<i>`s only while the link is pending.
  The Kategori sheet renders its body on first open. `InitialRevealScript` (root `<head>`) lets the first page load
  reveal outlined Suspense content without a view transition (React would otherwise hold it back for fonts and photos);
  client-side navigations keep every transition.
- **Art** (`@/components/art/*`; all take `size`, `className`, `style`, `title`, and are `aria-hidden` unless `title` is set):
  `LogoMark`, `BungaRaya` (+ `BungaRayaShape`, `PETAL`), `Starburst` (`BURST_16`, keep the label as HTML on top),
  `Sparkle({ tone: "candy"|"ink" })`, `WauBulan({ sway?, string?: "long"|"cut" })`, `TierIcon({ tier, face? })`,
  `Squiggle({ variant: "nav"|"swash", height? })`, `Oyen({ mood, pose: "head"|"peek"|"loaf", still? })`
  (on ink add `text-jambu` so the z's show), `Seal({ spin? })`, `ArrowDoodle({ flip? })` (colour via `text-*`),
  `EmptyRak`, and `Particles({ burst, preset: "save"|"celebrate", onDone? })` (C; the parent must be `relative`;
  bump `burst` to fire, e.g. on suggest-form success).
  Hero peek: Oyen's wrapper must stack above the search pill (`relative z-10`) so the paws overlap its top edge.

---

## 10. Data and lib quick reference

Server (`@/lib/catalog`, server-only): `getStats()`, `getPromos(opts)`, `getNewLaunches(opts)`
(`{category?, brand?, limit?, perBrand?, order?: "mixed"|"ranked"}`), `getBrandProducts(slug)`,
`getBrandSummaries()`, `getCategorySummaries()`, `getSearchIndex()`. Static: `BRANDS`, `getBrand`,
`brandsInCategory`, `brandsInTier` (`@/lib/brands`); `CATEGORIES`, `CATEGORY_BY_SLUG`, `isCategorySlug`,
`TIERS`, `TIER_BY_SLUG`, `STATES`, `NEW_WINDOW_DAYS`, `MIN_PROMO_DISCOUNT` (`@/lib/taxonomy`).
Client and shared: `formatPrice`, `timeAgo(iso, now)`, `formatCount`, `outboundUrl` (`@/lib/format`);
`sizedImage`, `imageSrcSet`, `IMAGE_WIDTHS` (`@/lib/images`: Shopify `?width=` and Jetpack Photon `i0–i3.wp.com` `?w=&quality=80`; other hosts pass through untouched); `SITE_NAME`, `SITE_URL`, `REPO_URL`, `pageMetadata({ title, description, path, socialDescription?, absolute?, defaultImage? })` and the `ogBase` / `twitterBase` spreads (`@/lib/site`): a page's `openGraph`/`twitter` replaces the layout's wholesale, so always build them from these (default OG image + `summary_large_image`); routes with their own `opengraph-image` file use `defaultImage: false` / `ogBaseNoImage`.
Week picks ("Cili Padi minggu ni") derive from `syncedAt` (e.g. an ISO week number from it), never from the clock.

---

## 11. Still to build (page builders own these)

| Area | Files (DESIGN Appendix E) |
|---|---|
| Home | `home/hero.tsx`, `hero-deal-stack.tsx`, `hero-parallax.tsx` (C), `live-ticker.tsx`, `ticker-pause.tsx` (C), `explainer.tsx`, `explainer-progress.tsx` (C), `origin-quote.tsx`, `tier-journey.tsx`, `tier-journey-progress.tsx` (C), `spotlight.tsx`, `state-chips.tsx`, `suggest-band.tsx`; `search/hero-search-pill.tsx`; replace the `app/page.tsx` stub. |
| Filters (/promos, /new, /brands, /categories) | `filters/filter-bar.tsx` (C, put it in `.sticky-stack`), `filter-sheet.tsx` (C, lazy), `filter-sidebar.tsx` (C), `active-filters.tsx` (C), `use-filter-url.ts` (client-only URL ↔ state; keep the server list visible and crossfade on apply). |
| Brand profile and directory | `brand/brand-hero.tsx`, `brand-tabs.tsx` (C, hash sync, `.sticky-stack`), `directory-filter.tsx` (C), `random-brand-button.tsx` (C; `layout/random-brand-link.tsx` already exists for the footer); flesh out `brands/[slug]/page.tsx` and `brands/page.tsx`. |
| Search | Full `search/search-dialog.tsx` (same default export and props) + `search/search-row.tsx` (`<mark>` highlights). |
| Category | `category/category-hero.tsx`; `categories/[slug]/page.tsx` body. |
| About | `about/suggest-form.tsx` (C, lazy) + `app/about/actions.ts` (`suggestBrand`: validate, POST JSON to `SUGGEST_WEBHOOK_URL`; when it is unset, return the GitHub fallback `REPO_URL/issues/new?title=…&body=…` with honest copy), `about/faq.tsx` (`<details name="faq">`, facts limited to the brief). |
| Saved | `saved/saved-view.tsx` (C: tabs, freshness check via `/api/feed/search`, sort, clear-all with `Modal`). A saved product missing from the index (or an index that failed) is **"unknown"**, never "sold out": no Habis, no grey, only the promo sticker/struck price drop, plus "Tak dapat semak harga terkini. Harga masa simpan: RM…" and a store link. Removing from /saved moves focus to the next card's heart (or previous, or the tab) and the Undo toast says so; keyboard removals keep the toast 12 s. sr-only h2s "Produk disimpan" / "Jenama disimpan". |
