# LokalLah! — Final design direction: **"Kedai Oyen: Comel & Laju"**

**This document is the single source of truth.** Engineers implement it as written. Where it is silent, follow the closest rule here; do not reopen a decision recorded in §0.3.

**Checked against the repo on 9 Oct 2026:** next 16.4.0 (`cacheComponents: true`, `partialPrefetching: true`), react 19.3.0, motion 14.0.0, lenis 1.3.26, lucide-react 1.53.0, tailwindcss 4.3.3. Data shapes are the real ones in `src/lib/types.ts` and `src/lib/catalog.ts` (`ProductCardData`, `BrandSummary`, `CategorySummary`, `SiteStats`, `FeedStatus`, `SearchItem`), slugs come from `src/lib/taxonomy.ts` (`beauty`, `fashion`, `accessories`, `food`, `drinks`, `home`, `health`, `kids`, `tech`, `crafts`, `lifestyle`; tiers `cili-padi`, `naik-daun`, `ikon`), and helpers are the existing ones (`formatPrice`, `timeAgo`, `formatCount`, `outboundUrl`, `sizedImage`, `imageSrcSet`, `useSaved`, `prepareIndex`/`search`).

**Verified while writing:**
- The `@theme` block in Appendix A compiles with the installed Tailwind 4.3.3 (`@tailwindcss/node`). `font-bold` and `text-gray-500` correctly do not exist.
- `src/lib/motion.ts` (Appendix B) and `src/app/fonts.ts` (Appendix C) pass `tsc --strict` against the installed `motion` and `next` types.
- `motion/react` exports `arc`, `stagger`, `frame`, `cancelFrame`, `usePageInView`. Lenis 1.3.26 has `autoToggle`, `anchors`, `stopInertiaOnNavigate`, `respectReducedMotion`.
- Every lucide icon named here exists in 1.53 (there are no brand logos in lucide 1.x).
- Every contrast ratio in §2.5 was computed with the WCAG 2.x formula for this final palette.

---

## 0. Verdict

### 0.1 Scores (1–10)

| Criterion | A "Kawaii Kedai Runcit" (Kedai Oyen) | B "Pop Warisan" (Kedai Gemilang) | C "Comel & Laju" (Ais Kacang) |
|---|---|---|---|
| Cuteness and brand fit | **9**: candy palette, ink-outlined stickers, Oyen, kawaii tier faces | 7: retro Shrikhand and navy ink read "vintage poster" more than "comel" | 7: deliberately restrained; cute in details, calm overall |
| Malaysian authenticity | 9: kedai runcit, Oyen meme cat, kad harga, wau, songket, kuih lapis | **10**: richest and most careful (multi-ethnic motifs, cop stamps, kalendar koyak, explicit cultural guardrails) | 7: ais kacang is lovely, but one food metaphor carries less of the shop story |
| Usability (scanning many products on a phone) | 7: 2 px ink outline + hard shadow on every card is noisy in a 2-col grid; Malay slugs don't match the repo | 8: raised thumb-zone Cari, live-count sheet CTA, fixed card rhythm | **10**: deal size readable before reading (L1/L2/L3), grouped promos, list mode, fixed price baseline, instant directory filter |
| Meaningful motion | 8: every animation answers a question; the hero card stack autoplays | 8: explicit job table; stamps and wau tell the tier and "baru" stories | **9**: teach-once save flight, explainer that *teaches* price-drop detection, Activity-safe intros |
| Performance feasibility | 7: pop-shadow layers and blend mode on every grid card, 3 hero loops, `pathLength` exception | 8: CSS-first, but ships 11 pattern masks and `staggerChildren` (deprecated) | **10**: no Motion inside grids, async features, SSR-visible reveals, Lenis on Motion's frame loop, measured budgets |
| Implementability in the fixed stack | 8: solid, but category slugs are invented | 6: large token surface (40+ scale steps, 11 patterns, Shrikhand mixing rules) | **9**: tight token set, native `<dialog>`/`popover`, server-first cards |
| **Total** | **48** | **47** | **52** |

### 0.2 Synthesis: what came from where

**Base: C** (structure, card anatomy, deal levels, photo plate rule, the three-engine motion system, Activity hygiene, SSR-visible reveals, performance rules, native `<dialog>`/`popover`).

**Skin: A** (the candy palette and ink, sticker-solid controls with the transform-only "pop" press, Fredoka candy numerals, the striped awning, the kad harga starburst, Oyen the tauke cat, kawaii tier faces, the live ticker, odometers, most of the Manglish voice).

**Soul: B** (the kedai runcit story shared with A, cop-stamp tier badges, the raised **Cari** button in the tab bar, kalendar koyak date headers on /new, the "100% Buatan Malaysia" seal, category tiles on shelf planks, the wau that "brings the deals", the CSS-only RevealObserver and pre-hydration odometer, and the cultural guardrails).

### 0.3 Conflicts resolved (final, do not reopen)

| # | Question | Decision | Why |
|---|---|---|---|
| 1 | Metaphor | **Kedai runcit run by Oyen** (A+B). C's "ais dulu, sirap kemudian" survives as a colour rule (§2.6 R1). | Every UI object maps to a shop object; one metaphor, not two. |
| 2 | Primary pink | **Candy `bandung` #FF6FB5 with ink text + ink outline** (A), not deep pink with white text. | Cuter; 6.41:1 with ink. |
| 3 | Ink | `#2B1736` (A). | Purple-black reads softer than navy; 15.6:1 on santan. |
| 4 | Minor fonts | **Fredoka 600** (numerals/stickers) + **Gochi Hand 400** (marker notes, not preloaded). Shrikhand rejected. | Rounded = cute; one Fredoka weight covers 11–48 px. |
| 5 | Poppins weights | **400 / 600 / 800** only. | 3 files (23.7 KB). 500 and 700 are not loaded and do not exist as utilities. |
| 6 | Ink outlines | On **controls and stickers only** (buttons, chips when selected, search pill, deal L2/L3, Baru je, brand cards, tier cop-lg). **Product cards use a soft pastel border.** | Cute signature without grid noise. |
| 7 | Brand cards | "Kedai card": awning on top, 2 px ink border, `pop` shadow (A/B). | Brands are shops; products are goods on the shelf. |
| 8 | Discount sticker | 3 levels (C): **L1** 5–19 % soft pill, **L2** 20–39 % candy pill, **L3** ≥ 40 % mangga 16-point kad harga burst (A shape). | Deal size is scannable pre-attentively. |
| 9 | "Baru" | **Baru je** (≤ 3 days, loud pandan sticker) / **Baru** (4–30 days, calm). If promo + new, the promo sticker wins and "Baru" becomes a text chip in the meta row. | One saturated sticker per card. |
| 10 | Tier badge | **Cop** (rubber stamp, dashed inner outline, B) with A's kawaii tier icons. Profile: rotating ring stamp (A). | "Cop" is a real kedai object. |
| 11 | Mascot | **Oyen** (A). Cil (B) and Si Kacang (C) are dropped. | The meme ginger cat is instantly Malaysian-internet and very cute. |
| 12 | Tab bar | **Utama · Promo · ( Cari ) · Baru · Simpan**, raised centre Cari (B). Jenama and Kategori live in the mobile header. | Search is the #1 task; Simpan stays as the save-flight target. |
| 13 | Tab bar breakpoint | Tab bar **< 1024 px**; desktop header ≥ 1024 px. | iPad portrait gets thumb navigation. |
| 14 | Header blur | **No `backdrop-filter` anywhere.** Solid `santan/96`. | Mobile GPUs. |
| 15 | Dialogs / sheets / popovers | **Native `<dialog>` + `popover` + `@starting-style`** (C). Motion is not used for them. | Free focus trap, Esc, inert, zero animation JS. |
| 16 | Reveals | **One `RevealObserver` + `data-reveal` CSS** (B) for generic fade-ups. Motion `whileInView` only for orchestrated pieces (rail cascade, tier stamps, explainer). | Cheapest; content visible without JS. |
| 17 | Product photos | Plain `<img>` with `sizedImage`/`imageSrcSet` (no next/image optimiser). Plate = category tint. **Cover if 0.8 ≤ w/h ≤ 1.25, else contain + 8 % padding + `mix-blend-mode: multiply` + floor shadow.** Unknown size = contain. | Cohesive shelf look; blend only on the minority of images. |
| 18 | Hero product stack | **Static fan, no autoplay cycling** (B/C). | No autoplay carousels, ever. |
| 19 | Pagination | **"Muat lagi" button**, 24 per chunk, `?page=` in the URL. No infinite scroll. | Footer reachable, DOM bounded, Back works. |
| 20 | Toasts | **One at a time**; first save of a session only (later saves use flight + bump). | Calm. |
| 21 | Sync freshness | **fresh ≤ 4 h** (cron runs every 3 h), **stale 4–24 h or `source: "snapshot"`**, **old > 24 h or feed `error`**. Live ping plays **3 times**, never infinite. | Honest, and WCAG 2.2.2-friendly. |
| 22 | Patterns | Only 4: songket diamond, batik bunga (mask tinted with `--cat-pop`), pucuk rebung strip, kuih lapis strip. B's 11 per-category patterns are dropped. | Authentic, cheap, implementable. |
| 23 | Reduced motion | OS setting **and** in-site "Kurangkan animasi" switch (footer + Kategori sheet), plus `saveData`. | WCAG 2.2.2 pause mechanism. |
| 24 | Saved price check | Reuse **`/api/feed/search`** (already returns price + discount per product id). No new endpoint. | Fewer moving parts. |
| 25 | Hero headline | **"Semua jenama lokal, sentiasa up to date."** | Answers the Threads post word for word. |

---

## 1. Concept — "Kedai Oyen: Comel & Laju"

**Story.** Every Malaysian grew up with a kedai runcit: the striped awning, sweet jars on the counter, star-shaped *kad harga* written in marker, a rubber *cop* by the till, a tear-off calendar on the wall, and Oyen the orange cat asleep next to the cash register. LokalLah! is that kedai rebuilt for the phone: one cheerful shop with shelf space for every Malaysian-made brand, from a home baker's sambal (Cili Padi) to the jenama everyone's mak trusts (Jenama Ikon). The shelves restock themselves every few hours. The kad harga stickers are real price drops spotted at the last sync, and the "Baru je!" stickers mark products that really did launch this week. Oyen is the tauke: he sleeps when a shelf is empty, perks up when you search, and is happy when you save something.

**It answers the Threads post literally.** "Compile all local brand products … MUST BE UP TO DATE." All brands, all categories, and freshness that is *visible*: odometers roll, live dots ping, the ticker scrolls real sync events, and every price shows when it was checked.

**Comel & Laju (cute and fast).** The cuteness lives in colour, stickers, mascot and motion, never in extra weight. Cards are Server Components, motion is mostly CSS, and photos are the only images.

**Design principles**
1. **Rak dulu, sticker kemudian** (shelf first, stickers second). A calm cream shelf and a strict grid come first. Colour and stickers are added only where they *mean* something: category, tier, deal size, freshness.
2. **Sticker-solid controls.** Anything you can press is a candy sticker: fill + 2 px ink outline + hard ink shadow that you press *into*. The ink outline is also the non-text contrast (WCAG 1.4.11).
3. **Data is the decoration.** The hero shows real live promos and the real biggest discount. Stickers carry real values. No fake numbers, no fake recency.
4. **Motion answers a question.** Every animation does one of: *Explain* (what is this?), *Guide* (look here), *Reward* (you did it), *Status* (it's live / loading / changed). If it does none, cut it.
5. **Teach once, then get out of the way.** Explanatory motion (fly-to-Simpan, rail swipe hint, hero intro) plays the first time(s) only.
6. **Manglish warmth, plain function.** Controls say "Simpan", "Tapis", "Cari". Jokes live in headings, empty states and loading lines, never on the button you need.
7. **Restraint budget per viewport:** ≤ 3 decorative illustrations, ≤ 1 Oyen, ≤ 1 Gochi Hand note, ≤ 3 ambient loops, ≤ 1 saturated sticker per card.

**Cultural guardrails (non-negotiable, from B).** Never draw the Jalur Gemilang, its crescent and star, the Jata Negara, or any state flag or crest. No religious symbols, no figurative people in ethnic dress, no sacred indigenous motifs. Motifs reduce to triangles, diamonds, circles, petals. Neutral Manglish, never mimicking a community's accent. The Threads author stays anonymous: quote the post, never her name, handle or avatar.

---

## 2. Colour system

Light theme only (`color-scheme: only light`, `<meta name="theme-color" content="#FFF8F1">`). Nicknames are the token names. The paste-ready block is Appendix A.

### 2.1 Core tokens

| Token | Hex | Role |
|---|---|---|
| `santan` | `#FFF8F1` | Page background (coconut cream) |
| `putih` | `#FFFFFF` | Cards, inputs, sheets, tab bar |
| `kapas` | `#FFEFF6` | Wells, skeleton bones, hover rows, search pill fill, segmented track |
| `garis` | `#EEDDE8` | Decorative hairlines, card borders (no contrast duty) |
| `garis-kuat` | `#8C7B98` | Functional borders: inputs, unselected chips, switch-off track (≥ 3:1) |
| `ink` | `#2B1736` | Headings, body, icons, outlines, pop shadows, dark bands (ticker, footer, toasts) |
| `ink-2` | `#4A3B5C` | Product titles; **all text over gradients and the mesh** |
| `ink-soft` | `#6B5577` | Meta, captions, placeholders, struck prices, inactive tab labels |
| `ink-dim` | `#C9B8D4` | Muted text **on ink surfaces only** |
| `faint` | `#B9ADC4` | Disabled glyphs and decoration. **Never text.** |

### 2.2 Brand candy

| Token | Hex | Role |
|---|---|---|
| `bandung` | `#FF6FB5` | **Primary fill** (primary button, saved heart fill, L2 sticker, awning stripe). Ink text only. |
| `bandung-tint` | `#FFE4F1` | Active tab pill, L1 sticker bg, selected search row |
| `bandung-pekat` | `#C0136A` | Pink **text**: promo price, L1 sticker text, "Lah!" in the logo |
| `jambu` | `#FF8FC8` | Decoration; accent text on ink (footer, ticker) |
| `keladi` / `keladi-tint` | `#BDA6FF` / `#F3EFFF` | Secondary fill (ink text) / lilac wash, info panels |
| `telang` | `#5B2BC9` | **Focus ring**, text links, Gochi notes, info text |
| `mangga` / `mangga-tint` | `#FFD54F` / `#FFF4C7` | L3 burst, count bubbles, focus ring on ink / search `<mark>`, stale pill bg |
| `kunyit-pekat` | `#7A5300` | Stale/warning text |
| `pandan` / `pandan-tint` / `pandan-pekat` | `#49D6A0` / `#DAF8EC` / `#0F7A53` | "Baru je" fill / "Baru" calm + "Jimat" bg / success + "Jimat" text |
| `sambal-tint` / `sambal-pekat` | `#FFE3E7` / `#B91C3B` | Error wash / error text + destructive button |
| `live` / `stale` | `#12A15A` / `#B7791F` | Status dots (always next to a text label) |
| `oyen` / `oyen-belang` | `#FFAA55` / `#E07020` | Mascot only |

### 2.3 Category accents (`data-cat`, slugs from `taxonomy.ts`)

`tint` = background (chips, plate, category hero, skeleton plate). `mid` = monogram fill and icon well. `pop` = decoration only (patterns, illustrations). `ink` = text and icons on tint and on white.

| `data-cat` | Nickname | tint | mid | pop | ink | lucide icon | Label (`nameMs`) |
|---|---|---|---|---|---|---|---|
| `beauty` | Jambu | `#FFE8EE` | `#FFB3C4` | `#FF8FA8` | `#AD1D45` | `Droplets` | Kecantikan |
| `fashion` | Baju Kurung | `#ECEAFF` | `#BDB6FF` | `#9D93FF` | `#4B3DC4` | `Shirt` | Fesyen |
| `accessories` | Keladi | `#F4E9FF` | `#D9BAF7` | `#C79BF2` | `#7333A6` | `Handbag` | Aksesori |
| `food` | Sambal | `#FFEBE2` | `#FFB99F` | `#FF9772` | `#AE3A10` | `Cookie` | Makanan |
| `drinks` | Teh Tarik | `#F8EEE3` | `#E5C0A1` | `#D8A275` | `#83461A` | `Coffee` | Minuman |
| `home` | Pudina | `#E1F6EA` | `#A3E3BF` | `#79D6A3` | `#17704A` | `Sofa` | Rumah |
| `health` | Air Kelapa | `#DEF5F2` | `#96DED7` | `#66CFC5` | `#0C6964` | `HeartPulse` | Kesihatan |
| `kids` | Pisang | `#FFF4D3` | `#FFDF8A` | `#FFD159` | `#7F5900` | `Baby` | Anak-anak |
| `tech` | Langit | `#E2F0FF` | `#A4CFFF` | `#7BB9FF` | `#0E5AA4` | `Headphones` | Teknologi |
| `crafts` | Batik | `#FBE7F7` | `#EEAFE3` | `#E58AD5` | `#922781` | `Gift` | Kraf & Hadiah |
| `lifestyle` | Pucuk | `#EDF7DA` | `#C2E395` | `#A6D667` | `#4A6611` | `Bike` | Gaya Hidup |

`Sparkles` is reserved for "Baru" (so beauty uses `Droplets`). A category is never identified by colour alone: icon + label always accompany it.

### 2.4 Tier tokens (`data-tier`)

| Tier | tint | pop (icon fill) | ink | Gradient (`--tier-grad`) | Icon |
|---|---|---|---|---|---|
| Cili Padi (`cili-padi`) | `#FFE5DF` | `#FF6B4A` | `#B0271B` | `#FFE9E4 → #FFCFC3` | custom chili with face (Appendix D) |
| Naik Daun (`naik-daun`) | `#DFF5E4` | `#4CC27A` | `#1B6D36` | `#E6F8EA → #B9EBC7` | custom sprout with face |
| Jenama Ikon (`ikon`) | `#FFF0C4` | `#F5B820` | `#7A5300` | `#FFE7A3 → #FFC94D → #F5A524` | custom crown with face |

The tiers tell a growth story: **chili seed → sprouting leaf → crown**. Motion acts it out (§7.5).

### 2.5 Contrast (computed for this palette)

| Pair | Ratio | Used for |
|---|---|---|
| ink on santan / putih | 15.60 / 16.42 | All body text |
| ink-2 on putih / santan | 10.14 / 9.63 | Product titles, hero sub |
| ink-soft on santan / putih / kapas | 6.25 / 6.58 / 5.93 | Meta, placeholders, struck price |
| ink-soft on any category tint (worst: fashion) | ≥ 5.57 | Captions on plates/heroes |
| ink on bandung / bandung-tint | 6.41 / 13.78 | Primary button, L2 sticker / tab pill |
| bandung-pekat on putih / santan / bandung-tint | 5.93 / 5.63 / 4.97 | Promo price, L1 sticker, logo "Lah!" |
| ink on mangga / mangga-tint | 11.64 / 14.87 | L3 burst, count bubble / `<mark>` |
| ink on pandan | 8.92 | "Baru je" sticker |
| pandan-pekat on pandan-tint / putih | 4.74 / 5.34 | Calm "Baru", "Jimat RM17" |
| telang on santan / putih / keladi-tint | 7.57 / 7.97 / 7.06 | Links, focus ring, info |
| sambal-pekat on putih / sambal-tint | 6.38 / 5.28 | Errors |
| kunyit-pekat on mangga-tint | 6.20 | Stale pill |
| santan / ink-dim / mangga / jambu on ink | 15.60 / 8.83 / 11.64 / 7.83 | Footer, ticker, toasts |
| Category ink on its tint (worst: food 5.34, home 5.38) | 5.34–6.52 | Chips, tiles, heroes |
| Category ink on white | 6.08–7.63 | Icons on white |
| ink on category mid (monogram initials) | 8.84–12.65 | Monograms |
| Tier ink on tier tint (cili / daun / ikon) | 5.56 / 5.57 / 6.04 | Cop badges |
| ink on tier pop / worst Ikon gradient stop | ≥ 5.83 / 8.05 | Big cop on gradient |
| ink on gradient stops (gula-kapas, bandung-fizz, mangga-lassi, senja; worst) | ≥ 7.83 | Band headings |
| ink-2 on worst gradient/mesh stop (senja start `#FFC2DD`) | 6.77 | Band sub-lines, hero lead |
| text-grad-lokal stops on santan | 4.70 → 5.84 | Display words ≥ 24 px only |
| *Non-text:* ink outline on putih | 16.42 | Every candy control |
| *Non-text:* garis-kuat on putih / santan | 3.89 / 3.69 | Inputs, unselected chips |
| *Non-text:* focus telang on santan / putih; mangga on ink | 7.57 / 7.97; 11.64 | Focus rings |
| *Non-text:* live / stale dot on putih | 3.35 / 3.64 | Status dots (+ text) |

### 2.6 Colour rules
- **R1 Rak dulu.** About 65 % santan + putih, 25 % pastel tints, 10 % candy + ink. If removing a colour loses no meaning, remove it.
- **R2 Candy fills carry ink text only.** White text is used only on `ink` (toasts, footer, Habis tag) and on `sambal-pekat` (destructive button). White on bandung measures 2.56: forbidden.
- **R3 Over gradients and the mesh, text is `ink` or `ink-2` only.** `ink-soft` over gradients is forbidden.
- **R4 Pink text is always `bandung-pekat`**, never `bandung`. `pop` colours, `jambu`, `faint` are never text and never the sole boundary of a control.
- **R5 Every candy-filled control has a 2 px ink outline** (1.5 px for stickers ≤ 24 px tall).
- **R6 Never colour alone.** Promo = pink family + "−30%" + shape; new = pandan + "BARU" text; tier = icon + name; live = dot + words; selected = colour + ring/check.
- **R7 Category colour is for wayfinding only** (chips, tiles, plates, monograms, awnings, category hero). Prices and status never use it.
- **R8 Never dim text with opacity** (disabled controls excepted). No pure black, no Tailwind default greys (the palette reset enforces it).
- **R9 `prefers-contrast: more`:** `garis` → `garis-kuat`, patterns and mesh blobs hidden (in Appendix A).

---

## 3. Gradients

Defined as `--grad-*` on `:root` and exposed as utilities (Appendix A). **Gradients are painted once and never animated** (no `background-position`, no `@property` tweening). Hover crossfades a gradient *layer* by opacity.

| Utility | CSS | Where | Text on it |
|---|---|---|---|
| `bg-gula-kapas` | `linear-gradient(160deg, #FFE3F1 0%, #F1E6FF 48%, #DDF3FF 100%)` | Hero panel base (under the mesh), /saved and /about headers, search dialog header strip | ink / ink-2 |
| `bg-bandung-fizz` | `linear-gradient(135deg, #FF8FC8 0%, #FF6FB5 50%, #FF9D7A 100%)` | Primary button hover overlay (opacity), "Cadang jenama" CTA band, back-to-top FAB | ink only |
| `bg-mangga-lassi` | `linear-gradient(135deg, #FFE36E 0%, #FFC94D 50%, #FFA45B 100%)` | Home "Promo panas" band, /promos header band | ink only |
| `bg-cendol` | `linear-gradient(135deg, #D7F9EA 0%, #A8EED8 50%, #BFE6FF 100%)` | Home "Baru sampai" band, /new header band | ink / ink-2 |
| `bg-senja` | `linear-gradient(170deg, #FFC2DD 0%, #D9C6FF 50%, #A9DCFF 100%)` | Tier-journey band, 404, Jenama Ikon tier card | ink / ink-2 |
| `bg-teh-tarik` | `linear-gradient(180deg, #FFF8F1 0%, #F7E6D5 100%)` | Wash above the footer, `drinks` category hero bottom | ink / ink-2 |
| `text-grad-lokal` | `linear-gradient(90deg, #D61F66 0%, #5F45E0 100%)` + `background-clip: text` | One accent word per page heading (display/title-1 only), logo never | — |
| `bg-kuih-lapis` | `repeating-linear-gradient(90deg, #FF8FC8 0 12px, #FFD54F 12px 24px, #86DFAA 24px 36px, #BDA6FF 36px 48px)` | Rail progress thumb, route/filter indeterminate bar, footer divider strip | decorative |
| `bg-tier` | `var(--tier-grad)` | Big cop sticker, tier cards | ink |
| `bg-cover-cat` | `linear-gradient(160deg, var(--cat-tint) 0%, #FFFFFF 78%)` | Category hero, brand profile cover | ink / ink-2 |
| `bg-sunburst` | `repeating-conic-gradient(from 0deg, #FFE88A 0deg 10deg, #FFF6CF 10deg 20deg)` | 160 px disc behind Oyen in empty states and 404 (60 % opacity) | decorative |
| body wash | `linear-gradient(180deg, #FFEFF6 0px, rgb(255 248 241 / 0) 360px)` | Top of every page | — |

### 3.1 Hero mesh ("Candy Mesh"): cheap by construction
- Markup: `<div class="mesh" aria-hidden data-ambient><span class="mesh-blob"/><span class="mesh-blob"/><span class="mesh-blob"/></div>` (CSS in Appendix A §6.3).
- The static base (gula-kapas + two radial puddles) is **one painted background**. Only 2 blobs (mobile) / 3 blobs (≥ 768 px) move, each a `radial-gradient(closest-side, …)` that fades to transparent by itself: **no `filter: blur()`**.
- Blobs drift with `transform` keyframes (18 s / 23 s / 29 s, alternate).
- `useAmbientPause` sets `data-paused` on the mesh when it is < 1 % visible or `document.hidden`.
- Scroll parallax (desktop only) moves the **`.mesh` wrapper**, never the blobs, so the two transforms never fight.
- Reduced motion: static.

---

## 4. Typography

### 4.1 Families (latin woff2, sizes measured by the proposals)

| Family | Weights | Size | Preload | Role |
|---|---|---|---|---|
| **Poppins** (main) | 400, 600, 800 | 23.7 KB | yes | Everything readable: headings 800, labels/buttons 600, body 400 |
| **Fredoka** (minor 1: candy numerals) | 600 | 16.5 KB | yes | Prices, discounts, counters/odometers, sticker numerals, count bubbles, monogram initials, wordmark, kalendar koyak day numbers. Never sentences. |
| **Gochi Hand** (minor 2: tauke's marker) | 400 | 19.6 KB | **no**, `display: optional` | One annotation per viewport ("psst… harga live!"), loading lines, Oyen speech. ≥ 18 px, rotated −4°, `telang` colour. Never the only carrier of information. |

Critical font payload **40.2 KB**; total 59.8 KB. Exact `next/font` config is Appendix C. If Gochi Hand misses the `optional` window, the fallback stack shows Fredoka, which still looks cute.

### 4.2 Fluid scale (360 → 1280 px)

| Utility | Font / weight | Size | LH | Tracking | Use |
|---|---|---|---|---|---|
| `text-display` | Poppins 800 | 38 → 70 px | 1.04 | −0.035em | Home H1 only |
| `text-title-1` | Poppins 800 | 30 → 44 | 1.1 | −0.025em | Page H1s |
| `text-title-2` | Poppins 800 | 24 → 34 | 1.15 | −0.02em | Section H2s |
| `text-title-3` | Poppins 600 | 18 → 22 | 1.3 | −0.01em | Brand names on cards/heroes, sheet titles, empty-state titles |
| `text-lead` | Poppins 400 | 17 → 19 | 1.55 | 0 | Hero sub, page intros (ink-2) |
| `text-body` | Poppins 400 | 16 | 1.6 | 0 | Paragraphs (max 62ch); all inputs (no iOS zoom) |
| `text-body-sm` | Poppins 400 | 14 | 1.35 | 0 | Product titles (2-line clamp, ink-2), card descriptions |
| `text-label` | Poppins 600 | 14 | 1.2 | 0.005em | Chips, tabs, form labels |
| `text-button` | Poppins 600 | 15 | 1.2 | 0 | Buttons |
| `text-label-sm` | Poppins 600 | 12 | 1.2 | 0.01em | Brand name in card, badges |
| `text-tab` | Poppins 600 | 11 | 1.2 | 0 | Tab bar labels |
| `text-overline` | Poppins 600 caps | 12 | 1.2 | 0.08em | Eyebrows ("RAK KATEGORI") |
| `text-caption` | Poppins 400 | 12 | 1.4 | 0 | Meta ("12 min lepas"). Minimum text size: 11 px |
| `text-price font-num` | Fredoka 600 | 18 (17 below 380 px) | 1 | −0.01em | Current price |
| `text-price-lg font-num` | Fredoka 600 | 24 | 1 | −0.01em | Hero stack cards, saved price diff |
| `text-deal font-num` / `text-deal-lg` | Fredoka 600 | 13 / 16 | 1 | 0 | L1/L2 stickers / L3 burst |
| `text-stat font-num` | Fredoka 600 | 28 → 44 | 1 | −0.02em | Odometers |
| `text-hand hand` | Gochi Hand 400 | 18 → 22 | 1.1 | 0.01em | Annotations |

### 4.3 Rules
- Only `font-normal`, `font-semibold`, `font-extrabold` exist (reset in `@theme`). `font-synthesis: none`: no faux bold, **no italics anywhere**.
- `text-wrap: balance` on h1–h4, `pretty` on paragraphs (in base layer). Chips and card titles add `overflow-wrap: anywhere` (Malay compounds are long).
- **Numerals:** neither font ships `tnum` (checked by A and C). Animated numbers use **fixed `0.62em` digit cells** (`.odo`). Static prices stay proportional.
- Currency via `formatPrice()` (`RM29`, `RM29.90`, no space). Discounts use a real minus sign `−` (U+2212): "−30%".
- **Mixed-font headlines:** one accent per heading, max. The accent is a word in Poppins 800 with `text-grad-lokal`, or a phrase with a mangga highlighter bar behind it (decorative `aria-hidden` span at 40 % height, not `<mark>`).
- **Casing:** sentence case everywhere. UPPERCASE only for overlines, "BARU JE", ticker "LIVE" tag.
- Logo wordmark: "Lokal" `ink` + "Lah!" `bandung-pekat`, Fredoka 600, 22 px mobile / 26 px desktop.

---

## 5. Shape language

### 5.1 Radii

| Token | Value | Applies to |
|---|---|---|
| `rounded-xs` | 6 px | kbd, `<mark>` (4), Habis tag |
| `rounded-tag` | 8 px | Cop stamps |
| `rounded-thumb` | 12 px | Search thumbs, brand-card collage thumbs, list-row plate |
| `rounded-plate` | 14 px | Product photo plate (card 20 − inset 6) |
| `rounded-input` | 14 px | Inputs, select, textarea |
| `rounded-card` | 20 px | Product cards, toasts (pill toasts use full) |
| `rounded-tile` | 22 px | Category tiles and icon squircles |
| `rounded-card-lg` | 24 px | Brand cards, popovers, desktop dialog |
| `rounded-sheet` | 28 px | Bottom-sheet top corners, CTA band |
| `rounded-panel` | 32 px | Hero panel, section band panels (mobile 28) |
| `rounded-full` | 9999 px | Buttons, chips, search pill, badges, tab pill |

Nested rule: inner radius = outer radius − inset.

### 5.2 Borders and shadows
- **Product cards:** `bg-putih border-2 border-garis rounded-card shadow-card`, padding 6 px (8 px ≥ md). Hover crossfades a `::before` with `shadow-card-hover` (pink-tinted) and lifts 3 px. **No ink outline, no hard shadow.**
- **Brand cards, primary/secondary buttons, search pill, selected chips, stickers:** 2 px ink outline + hard ink shadow (`pop`).
- **Inputs, unselected chips, outline buttons:** 1.5 px `garis-kuat`.
- **Stickers on photos:** `shadow-sticker` (2 px white die-cut + crisp drop) so they read on any photo.
- **Shadows never animate.** Lift = transform + opacity crossfade of a pre-rendered shadow layer.
- **The ink button's shadow is `bandung`** (`--pop-color`), so ink-on-ink never disappears.
- Elevation ladder: `shadow-card` < `shadow-float` (popover, toast, dialog) < `shadow-sheet`.

### 5.3 The "pop" press (transform-only)
The hard shadow is a **separate `::before` layer** behind a moving `.pop-face`. Hover (fine pointer): face lifts (−2, −2). Press: face sinks **into** the shadow (+offset, +offset) in 90 ms, like an arcade button. CSS is Appendix A §6.1. Rules:
- Structure: `<button class="pop" style="--pop-offset:4px"><span class="pop-face bg-bandung px-6 h-12">…</span></button>`.
- Offsets: buttons 4 px, chips/icon buttons 2 px, brand cards 6 px (`--pop-radius: 24px`).
- In rails and grids the face must be `h-full flex-col` so face and shadow match in height.
- iOS: add `document.addEventListener("touchstart", () => {}, { passive: true })` once (in `Providers`) so `:active` fires.
- Disabled: no shadow layer, face `bg-kapas text-ink-soft border-garis`, `aria-disabled`.

### 5.4 Stickers and badges

| Sticker | When | Spec |
|---|---|---|
| **Deal L1** `.deal-1` | `discount` 5–19 | 22 px pill, `bandung-tint` bg, `bandung-pekat` Fredoka 13, no outline, no rotation |
| **Deal L2** `.deal-2` | 20–39 | 24 px pill, `bandung` bg, ink Fredoka 13, 1.5 px ink outline, `shadow-sticker`, rotate −3° |
| **Deal L3 "kad harga"** `.deal-3` | ≥ 40 | 16-point starburst (Appendix D #3), 56 px on cards (64 px in hero/brand best deal), `mangga` fill, white 10-unit die-cut underlay + 4-unit ink stroke, ink Fredoka 16, rotate −10°. Overhangs the plate top-left at (−6, −8) |
| **Baru je** `.baru-je` | `publishedAt` ≤ 3 days | 22 px pill, `pandan` bg, ink Poppins 600 11 caps (+0.06em), 10 px ink `Sparkles` before text, 1.5 px ink outline, `shadow-sticker`, rotate 2° |
| **Baru** `.baru` | 4–30 days (`NEW_WINDOW_DAYS`) | 22 px pill, `pandan-tint` bg, `pandan-pekat` text, no outline, no rotation |
| **Habis** `.habis` | `available === false` | Plate bottom-left, ink bg, white 11/600, `rounded-xs`; image at static opacity .5 |
| **Cop** `.cop` | Tier in lists/cards | 24 px, `--tier-tint` bg, `--tier-ink` 12/600, 14 px tier icon, dashed inner outline (`outline: 1.5px dashed` at −4 px offset). No rotation in dense lists |
| **Cop-lg** `.cop .cop-lg` | Brand hero, tier cards | 36 px, `bg-tier` gradient, ink 14/600, 20 px icon, 2 px ink border, `shadow-sticker`, rotate −3° |
| **Tier stamp** | Brand profile hero | 112 px rubber stamp: tier-tint circle, 3 px ink ring, dashed inner ring (`stroke-dasharray="4 5"`), Fredoka 11 caps ring text on `<textPath>` with `textLength=276` ("KECIL-KECIL CILI PADI •" / "TENGAH NAIK DAUN •" / "JENAMA IKON MALAYSIA •"), 40 px kawaii tier icon in the centre. The ring alone rotates 360° / 30 s (ambient, paused offscreen) |
| **Count bubble** `.count-bubble` | Tab bar Promo, Simpan; Tapis | 18 px min, `mangga`, 1.5 px ink, Fredoka 11 |
| **Info pill** | "12 promo · 4 baru" | 24 px, tint bg + matching ink text, Poppins 600 12 |
| **Kraft tag "Deal terbaik"** | Best deal on a brand profile | `#F6E3C8` bg, ink 12/600, radius 8, punched hole `radial-gradient(circle at 10px 50%, var(--color-santan) 3px, #0000 3.5px)` |

Every sticker has a text equivalent: the sticker is `aria-hidden` and the card's sr-only price sentence carries "diskaun 30%" / "baru, dilancar 2 hari lepas".

### 5.5 Product photo plate: mixed photos made cohesive (`src/lib/photo-fit.ts`)
1. Every photo sits in a **1:1 plate**, `rounded-plate`, background `--cat-tint` from the **brand's** category. The tint doubles as the image skeleton.
2. Fit rule from real data:
   ```ts
   export function photoFit(w?: number, h?: number): "cover" | "contain" {
     if (!w || !h) return "contain";
     const r = w / h;
     return r >= 0.8 && r <= 1.25 ? "cover" : "contain";
   }
   ```
   - `cover`: `object-fit: cover; object-position: 50% 40%` (keeps heads in 4:5 model shots).
   - `contain`: `object-fit: contain; padding: 8%; mix-blend-mode: multiply` (white packshot backgrounds melt into the pastel plate), plus a soft floor shadow under the product.
3. A 1 px inner ring (`inset 0 0 0 1px rgb(43 23 54 / .06)`) gives every edge the same finish.
4. **No filters or colour grading.** Product truth beats aesthetics.
5. Loading: once JS runs (`html.reveal-ready`), a below-the-fold image is at opacity 0 until `PlateImage` sets `data-loaded` (on `load`, or immediately in the ref callback if `img.complete`), then fades in 240 ms. **Above-the-fold images never fade** (`data-eager` on the plate); without JS every image is simply visible.
6. Missing/broken image: category icon 40 px in `--cat-ink` at 40 % opacity on the tint, plus the 24 px monogram. Never a broken-image glyph.
7. `<img src={sizedImage(src, 480)} srcSet={imageSrcSet(src)} sizes=… loading decoding="async" alt={title}>`. Exact `sizes` in §7.8.

### 5.6 Monogram avatars (brands have no logos; `src/lib/monogram.ts`)
- **Initials:** strip stop words, two words → first letters ("Kopi Tenom" → "KT"); one word → first two letters ("Hanis" → "Ha").
  ```ts
  const STOP = new Set(["by","the","and","&","co","sdn","bhd","official","store","shop","my","malaysia","enterprise"]);
  export function initials(name: string) {
    const w = name.normalize("NFKD").replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter((x) => x && !STOP.has(x.toLowerCase()));
    if (w.length >= 2) return (w[0][0] + w[1][0]).toUpperCase();
    const one = w[0] ?? name; return one[0].toUpperCase() + (one[1] ?? "").toLowerCase();
  }
  export const fnv1a = (s: string) => { let h = 0x811c9dc5; for (const c of s) { h ^= c.codePointAt(0)!; h = Math.imul(h, 0x01000193); } return h >>> 0; };
  export function monogram(slug: string, name: string) {
    const h = fnv1a(slug);
    return { initials: initials(name), shape: MONO_SHAPES[h % MONO_SHAPES.length], rotate: ((h >>> 8) % 13) - 6 };
  }
  ```
- **Drawing** (viewBox 100): white die-cut underlay (stroke 6, only ≥ 48 px) → shape filled `--cat-mid` with ink stroke (2 px; 1.5 px under 32 px; `vector-effect="non-scaling-stroke"`) → white glossy ellipse `cx=32 cy=27 rx=9 ry=5 rotate(-30)` at 60 % → initials as `<text class="font-num">` ink, `font-size` 34 (2 letters) / 44 (1 letter), `dy=".35em"`, centred. Whole group rotated by `rotate`. Shapes in Appendix D #8.
- **Sizes:** 20 (product-card brand row, `aria-hidden`), 36 (search rows), 56 (brand card, brand row), 96 (brand profile, morph target). ≥ 56 px gets a 20 px white circle bottom-right holding the 14 px tier icon.

### 5.7 Iconography
- lucide-react only, plus custom SVG for tier icons, Oyen, logo mark and motifs (Appendix D). `strokeWidth={2}` at 14–20 px, `2.25` at 22–24 px, `2.5` at ≤ 14 px. Round caps/joins (default).
- Sizes: 14 (in badges), 16 (inline meta), 18 (chips), 20 (buttons, inputs), 24 (tab bar, header).
- Colour: `currentColor`; never lighter than its text. Candy colour goes in the *well* behind an icon, never on a line icon on white.
- Active tab: icon sits in a `bandung-tint` pill. **The heart is the only icon that fills** (`fill="currentColor"`, `bandung`) when active.
- Icon-only buttons (search, heart, close, share, arrows) have `aria-label`. Everything else pairs icon + text.
- **UI map:** Utama `House` · Promo `BadgePercent` · Baru `Sparkles` · Jenama `Store` · Kategori `LayoutGrid` · Simpan `Heart` · Cari `Search` · Tapis `SlidersHorizontal` · Susun `ArrowUpDown` · outbound `ArrowUpRight` · next `ArrowRight` · state `MapPin` · sync `RefreshCw` · time `Clock3` · share `Share2` · copy `Copy` · undo `Undo2` · ticker `Pause`/`Play` · close `X` · rail `ChevronLeft`/`ChevronRight` · disclosure `ChevronDown` · random `Dices` · recent `History` · trending `TrendingUp` · offline `WifiOff` · error `CircleAlert` · success `CircleCheck` · info `Info` · check `Check` · suggest `Megaphone` · grid/list view `LayoutGrid`/`List` · delete `Trash2` · keyboard hints `Command`, `CornerDownLeft`.
- **Social links** (no logos in lucide 1.x): Laman web `Globe` · Instagram `Camera` · TikTok `Music2` · Shopee `ShoppingBag`, always with the text label.
- **No emoji in UI** (the `emoji` fields in `taxonomy.ts` are for OG/meta only).

### 5.8 Mascot: Oyen the tauke
The meme-famous ginger cat recast as the shopkeeper. He reports system state, so he is never decoration for its own sake. Always `aria-hidden`; any speech is mirrored in real text. ≤ 140 px on mobile, max one per viewport, **never in product grids**. Construction in Appendix D #9.

| Mood | Look | Where |
|---|---|---|
| `idle` | open eyes, blinks | Hero paws-peek over the search pill (mobile + desktop), search dialog empty state |
| `cari` | magnifier, pupils shifted | No search results, filters too narrow |
| `happy` | ^ ^ eyes, blush | Suggest-form success, footer tap easter egg, first-save toast icon |
| `tidur` | closed eyes, floating "z" | Empty shelf states (saved empty, no promos), 404 (loaf on a plank), footer (loaf on the rebung strip) |
| `terkejut` | round eyes, "o" mouth | Error, sync failure, offline |

Idle life: eyes blink (`animate-blink`, 5.5 s); `zzz` only in `tidur`. Both are ambient loops, paused offscreen, off under reduced motion.

---

## 6. Components

### 6.1 Layout frame
- Container: `container-page` = `max-w-[1240px] mx-auto px-(--gutter)`; gutter 16 / 24 (≥ 640) / 32 (≥ 1024).
- Breakpoints: xs 480, sm 640, md 768, lg 1024, xl 1280.
- Section rhythm: `py-(--section-y)` (40 → 80 px). Band panels: `mx-3 md:mx-6 rounded-[28px] md:rounded-panel p-4 md:p-8 border-2 border-ink shadow-pop-lg` (bands are the only big ink-outlined surfaces).
- **Product grid:** 2 cols (< 640, gap 10 px, row-gap 14) → 3 (≥ 640, gap 16) → 4 (≥ 1024; with the 248 px sidebar) → 5 (≥ 1280 without sidebar; 4 with). Minimum card width 150 px.
- **Brand grid:** 1 col of compact brand rows (< 480) → 2 cards (≥ 480) → 3 (≥ 1024) → 4 (≥ 1280).
- Z-index: sticky filter 30, FAB 35, header and tab bar 40, popovers 50, toasts 60, flying heart 70. Dialogs use the native top layer.
- `viewport` export: `{ themeColor: "#FFF8F1", colorScheme: "only light", viewportFit: "cover" }`. `main` gets `pb-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+16px)]`.

### 6.2 Header
**Mobile (< 1024 px):** `<header style={{ viewTransitionName: "site-header" }} class="sticky top-0 z-40">` = awning (20 px) + 56 px bar on `santan/96` (no blur).
- Left: logo (22 px bunga raya mark + Fredoka wordmark 22 px).
- Right: a **"Jenama"** pill button (`Store` 18 + label, 40 px tall, secondary pop, `--pop-offset:2px`) → `/brands`, and a 44 px **Kategori** icon button (`LayoutGrid`) that opens the **Kategori sheet**.
- **Kategori sheet** (`<dialog class="sheet">`): 3-column category tiles → 3 tier cops (→ `/brands?tier=`) → links (Semua jenama, Tentang, Cadang jenama) → "Kurangkan animasi" switch.
- **Scroll behaviour** (`HeaderScroll` island, `useScroll` + `useMotionValueEvent`, flips attributes only on threshold/direction change): past 24 px the awning tucks (`translateY(-var(--awning-h))`) and a bottom hairline fades in (opacity). Past 120 px with a downward delta > 6 px, the header **and** the page's sticky filter bar (one sticky stack) translate up by the bar height; any upward scroll returns them (220 ms, `ease-out-soft`, transform only).

**Desktop (≥ 1024 px):** awning 26 px + 72 px bar.
- Left: logo (28 px mark + 26 px wordmark). On hover, the flower rotates 72° (one petal) with `ease-pop`, 400 ms.
- Nav (Poppins 600 15, gap 24): **Promo** (count bubble) · **Baru** · **Jenama** · **Kategori ▾** · **Tentang**.
  - Active: ink text with a pink squiggle underline (Appendix D #12) always visible. Hover: the squiggle draws in with `scaleX` 0 → 1 (200 ms, origin left).
  - Pending (`useLinkStatus` inside each `Link`): three 4 px dots after the label (`.dots`, opacity-toggled, always rendered so no layout shift).
  - **Kategori ▾** = native `popover` panel (`[popover].pop-panel`): `rounded-card-lg`, 2 px ink, `shadow-float`, 3 × 4 grid of compact tiles (11 categories + "Semua jenama", each with "{n} jenama") + a row of 3 tier cops. Opens on click; Esc/outside click closes.
- Right: search pill (300 × 44, white, 2 px ink, `shadow-pop-sm`, `Search` 18, "Cari jenama, produk…" in ink-soft 14, kbd chip "⌘K"/"Ctrl K" rendered after mount) and the **Simpan** icon button (44 px, `Heart`, count bubble, `data-saved-target`).
- Scroll: the awning tucks past 24 px; the bar stays (no hide on desktop).

### 6.3 Bottom tab bar (< 1024 px)
- `<nav aria-label="Navigasi utama" style={{ viewTransitionName: "tab-bar" }}>` fixed bottom, 64 px + `env(safe-area-inset-bottom)`, `bg-putih/96`, 2 px ink top border, `rounded-t-[24px]`, `shadow-up`.
- Five equal slots: **Utama** (`House`) · **Promo** (`BadgePercent` + count bubble of `stats.promos`, capped "99+") · **Cari** · **Baru** (`Sparkles`) · **Simpan** (`Heart` + count bubble, `data-saved-target`).
- **Cari (centre):** a raised 56 px circle, −16 px above the bar, `bg-bandung` with ink `Search` 24, 2 px ink outline + 4 px ink pop shadow; "Cari" label under it. Opens the search dialog.
- Labels `text-tab`, ink when active, ink-soft otherwise.
- **Active indicator:** one 52 × 32 `bandung-tint` pill with a 1.5 px ink border behind the active icon. It moves between the four non-centre slots with `translateX` (slots are equal width) using `spring.snappy`. Pressed: pill scales .9. **No `layoutId`.**
- Pending tap: `.dots` inside the pill while the route loads (`useLinkStatus`).
- Links use `transitionTypes={["nav-tab"]}`.

### 6.4 Search (trigger + dialog)
- **Triggers:** tab-bar Cari, desktop header pill, Home hero pill (56 px), ⌘/Ctrl+K, and "/" (ignored when focus is in a field).
- **Code-split:** `SearchDialog` is `next/dynamic(() => import(…), { ssr: false })`, prefetched on trigger `pointerenter`/`focus`/first keydown and on `requestIdleCallback` 3 s after load.
- **Data:** on first open, fetch `/api/feed/search` (existing route → `SearchItem[]`), run `prepareIndex()` once, then `search(index, deferredQuery, 40)` with `useDeferredValue`. No network per keystroke, no debounce needed.
- **Dialog:** native `<dialog class="modal">` opened with `showModal()`.
  - Desktop: `w-[min(640px,92vw)] mt-[12vh] max-h-[76vh] rounded-card-lg border-2 border-ink bg-putih shadow-float overflow-hidden`. Enter: opacity + `translateY(-8px) scale(.97)` → none (180/280 ms, CSS `@starting-style`). Exit 120 ms. Backdrop ink/45, no blur.
  - Mobile: full-screen sheet (`100dvh`, `--enter-from: translateY(24px)`), top row = 52 px input (16 px text) + "Batal" text button.
  - Header strip on `bg-gula-kapas`: `Search` 22, input (Poppins 400 18, `role="combobox"`), clear `X`, desktop "Esc" kbd.
  - Body: `overflow-y-auto overscroll-contain` + `data-lenis-prevent`.
- **States:**
  - Empty query: "Carian terkini" (≤ 6 from localStorage `lokallah:recent:v1`, each removable), "Tengah hangat" (top 6 categories by promo count, as chips), and Oyen `idle` (64 px) with "Nak cari apa, bos?".
  - Results grouped: **Jenama** (≤ 5 rows: 36 px monogram + name + tier icon + "Kecantikan · Selangor") · **Produk** (≤ 8 rows: 48 px plate + 1-line title + brand + price + mini deal sticker) · **Kategori** (chips). Matches wrapped in `<mark>`.
  - Index loading > 150 ms: 3 row skeletons. No results: Oyen `cari` + copy + "Cadang jenama ni" (prefilled `?nama=`). Fetch error: Oyen `terkejut` + "Cuba lagi".
- **Keyboard/ARIA:** APG combobox + listbox; ↑/↓ move `aria-activedescendant` (wraps), active row gets `bandung-tint` bg + a 3 px `bandung` left bar (`scaleY` 0 → 1, 120 ms); Enter opens; Esc closes and returns focus to the trigger. Footer hint (desktop): "↑↓ pilih · Enter buka · Esc tutup".
- Results never animate; only the active highlight moves.

### 6.5 Category chips, tiles and shelf
- **Chip** (`<button aria-pressed>`): 40 px tall (44 px hit area via `::before` inset −2 px), `pl-2.5 pr-3.5 gap-2`, pill, `putih` bg, 1.5 px `garis-kuat`, 18 px icon in `--cat-ink`, `text-label` ink.
  - Hover (fine pointer): `kapas` bg. Press: `scale(.94)` 90 ms.
  - **Selected:** `--cat-tint` bg, **2 px ink border + `shadow-pop-sm`**, the icon swaps to `Check` (pops in with `animate-pop-in`), so chip width never changes. One-shot `wiggle`.
  - "Semua" (`LayoutGrid`) chip is always first and clears the filter.
  - Row: `flex gap-2 overflow-x-auto no-scrollbar edge-fade scroll-px-4 px-4 -mx-4 py-2`, `scroll-snap-type: x proximity`, `data-lenis-prevent-horizontal`. Desktop wraps.
- **Category tile** (Home "Rak kategori", Kategori popover/sheet): a single link wrapping squircle + label.
  - Squircle `rounded-tile`, 64 px mobile / 80 px desktop, `bg-(--cat-mid)` with 2 px ink border; lucide icon 28/34 px ink. Top-right Fredoka 11 count pill (white, 1.5 px ink) = live promo count (`CategorySummary.promos`; hidden when 0).
  - Label below: `text-label-sm` ink, ≤ 2 lines, centred (`nameMs`). Desktop adds "{brands} jenama" in `text-caption` ink-soft.
  - The squircle sits inside `<ViewTransition name={`cat-ic-${slug}`} share="morph" default="none">` and morphs into the category hero icon. Tile links use `prefetch={true}` (11 links; makes the morph reliable) and `transitionTypes={["nav-forward"]}`.
  - Hover: tile hops (`translateY(-6px)`, 200 ms `ease-pop`) and its contact shadow does `scaleX(.85)` + opacity .6; the icon wiggles once. Press: `scale(1.06, .92)` squash, 90 ms (CSS `:active`).
- **Shelf plank** (B): each row of tiles sits on a 10 px `rounded-[6px]` plank, `#EBCFB5`, `box-shadow: 0 6px 0 -2px rgb(43 23 54 / .08)`, overhanging the row 8 px each side. Under each tile a contact shadow ellipse (`rgb(43 23 54 / .12)`, 70 % of tile width).

### 6.6 Filters
**URL is the source of truth:** `?kat=beauty,fashion&tier=cili-padi&negeri=Selangor&diskaun=30&harga=20-50&susun=diskaun&page=2&view=senarai`.

- **Mobile sticky filter bar** (52 px, part of the header sticky stack, `bg-santan/96`): `[Tapis (count bubble)]` · scrolling quick-chip row ("Diskaun 40%+", "20%+", category chips, "Bawah RM50") · sort icon button (`ArrowUpDown`) opening a small native popover of sort radios. A hairline fades in when stuck (sentinel IntersectionObserver).
- **Tapis sheet** (`<dialog class="sheet">`, `max-h-[88dvh]`, `rounded-t-sheet`, `shadow-sheet`, decorative 36 × 4 handle, **no drag**). Sections in order: **Susun** (radio pills) · **Kategori** (2-col chip grid) · **Tier** (3 tall toggle cards with kawaii icon + tagline) · **Negeri** (16 `STATES` chips) · **Diskaun** (segmented Semua / 10%+ / 20%+ / 30%+ / 50%+; promos only) · **Harga** (chips < RM20, RM20–50, RM50–100, > RM100). Sticky footer: "Reset" ghost + primary "Tunjuk **{n}** promo/jenama" whose number is an odometer computed client-side from the current result set (the page already holds the unfiltered list for its scope). Body `data-lenis-prevent`.
- **Desktop sidebar** (≥ 1024): 248 px, `sticky top-[calc(var(--header-h)+16px)]`, `max-h-[calc(100dvh-var(--header-h)-32px)] overflow-auto data-lenis-prevent`. Groups with `text-overline` headings, checkbox rows with counts ("Kecantikan · 124"), "Reset semua" link.
- **Active-filter pills** above results: `kapas` pill, ink label, 16 px `X` button; then "Reset semua". `AnimatePresence initial={false}` with `chipPresence`; siblings snap (no layout animation).
- **Applying:** `router.replace(url, { scroll: false })` inside `startTransition`. While pending: results get `data-pending` → `opacity .55` after a 120 ms delay (CSS), a 3 px `progress-indeterminate` bar at the top of results, `aria-busy`. Results arrive inside `<ViewTransition key={queryKey} name="results" share="auto" enter="auto" default="none">` (180 ms crossfade). The count rolls (odometer).
- **/brands filters client-side** (see §8.4); /promos and /new filter on the server.

### 6.7 Product card (Server Component; client islands: `SaveButton`, `PlateImage`)
```
article.card[data-cat={brandCategory}] rounded-card bg-putih border-2 border-garis shadow-card p-1.5 md:p-2 h-full flex flex-col
├─ div.plate (aspect-square, rounded-plate, bg --cat-tint)  [data-eager on above-fold cards]
│   ├─ img[data-fit]                                  (PlateImage: sets data-loaded on load / img.complete)
│   ├─ sticker  top-left 8/8 (L3 overhangs −6/−8)     DealSticker L1|L2|L3  or  BaruSticker (je|calm)
│   ├─ SaveButton top-right 6/6: 36 px white/92 circle, shadow-xs, 44 px hit area, z-10
│   └─ .habis bottom-left 8/8 when !available
└─ div.body px-1 pt-2 pb-1 flex-1 flex flex-col gap-1
    ├─ brand row: 20 px monogram + brandName (text-label-sm ink-soft, 1 line) → <Link href=/brands/{brand}> relative z-10, + 14 px tier icon (sr-only tier name)
    ├─ h3 > a.stretched-link: title (text-body-sm ink-2, line-clamp-2, min-h-[2lh] fallback 2.7em) → outboundUrl(url), target=_blank rel="noopener noreferrer"
    ├─ price row (flex flex-wrap items-baseline gap-x-1.5):
    │     <data value="29.90" class="font-num text-price text-bandung-pekat|text-ink">RM29.90</data>
    │     <s aria-hidden class="text-caption text-ink-soft decoration-bandung-pekat decoration-2">RM42.90</s>
    │     "Jimat RM13" pill (pandan-tint / pandan-pekat 11/600)  — promo only, ≥ 360 px card width only (@container)
    └─ meta mt-auto (text-caption ink-soft): Clock3 12 + "{timeAgo(feeds[brand].fetchedAt)}" (promo) | Sparkles 12 + "Lancar {timeAgo(publishedAt)}" (baru) + ArrowUpRight 12
```
- **Accessible name** of the stretched link: "{title}, {sr price sentence}, buka kedai rasmi {brandName} (tab baru)". The sr price sentence: "Harga sekarang RM29.90, harga asal RM42.90, diskaun 30%".
- **Focus:** `.card:has(.stretched-link:focus-visible)` draws a 3 px telang outline around the whole card.
- **Hover** (fine pointer): card lifts 3 px (180 ms), hover-shadow layer opacity 1, cover photos scale 1.04 (360 ms; contained/blended images don't zoom), the sticker rotates 2° further (`ease-pop`). **Press:** `scale(.98)` 90 ms.
- **Variants:** *promo* (deal sticker, pink price, struck `compareAt`), *baru* (Baru sticker, ink price, launch meta), *promo + baru* (promo sticker; a calm "Baru" chip prepended to meta), *habis*.
- **List row** (`ProductRow`, /promos & /new "Senarai" view): 88 px tall, 72 px plate (`rounded-thumb`), text right, sticker inline before the price; about 6 rows per phone screen.
- **Rail widths:** mobile `clamp(148px, 42vw, 188px)` (≈ 2.3 visible); desktop 216 px.
- `contain: layout paint` on every card. **No Motion component inside cards.**

### 6.8 Brand card ("kedai card") and brand row
- **Shell:** `article.pop[data-cat][data-tier]` with `--pop-radius: 24px; --pop-offset: 6px`. Face: `bg-putih border-2 border-ink rounded-card-lg overflow-hidden h-full flex flex-col`.
- **Awning** across the top (`.awning`, `--awning: var(--cat-pop)`, 20 px), then a 56 px band in `--cat-tint` with the `.songket` pattern at 0.28 and a 36 px save-brand heart top-right.
- **Monogram** 56 px with die-cut, overlapping the band by 28 px; wrapped in `<ViewTransition name={`brand-av-${slug}`} share="morph" default="none">` **only where the card is unique on the page** (directory grid, spotlight).
- Name `text-title-3` ink (1-line truncate), `.cop` tier badge, meta `MapPin` 14 + "{nameMs} · {state}" (`text-caption` ink-soft), 2-line description (`text-body-sm` ink-2).
- **Collage:** 3 × 1:1 thumbs from `BrandSummary.previews` (`rounded-thumb`, gap 6, `--cat-tint` plates, contain-blend rule). Missing previews: tint tiles with the category icon.
- Counts row: info pills "{promoCount} promo" (bandung-tint / bandung-pekat) and "{newCount} baru" (pandan-tint / pandan-pekat), hidden when 0, plus a `live` dot + "Live" when `live`.
- Link: stretched link on the name → `/brands/{slug}`, `transitionTypes={["nav-forward"]}`. Heart above it (`relative z-10`).
- **Hover:** face lifts (pop), the **awning flutters** (`scaleY 1 → 1.18 → 1` from the top, 500 ms `ease-pop`: "the shop is open"), the monogram does one wiggle.
- **Brand row** (mobile directory < 480 px): 88 px, `bg-putih border-2 border-garis rounded-card`, 56 px monogram left, name + cop + meta, three 44 px thumbs at the right. No pop shadow (density).

### 6.9 Tier badge interactions
Tapping any cop opens a native `popover` explainer (kawaii icon 40 px, name, Manglish tagline, one line of criteria, "Kenali tier →" `/about#tier`). Fade + `translateY(-6px)` (CSS). On the brand profile an "Apa ni?" `Info` 14 button sits next to the stamp.

### 6.10 Live-sync indicator (`LivePill` server + `LiveTime` client)
State from `SiteStats.syncedAt` + `SiteStats.source` (site) or `feeds[slug]` (`FeedStatus`, brand):

| State | Rule | Look | Copy |
|---|---|---|---|
| fresh | `source === "live"` and age ≤ 4 h (brand: `status === "live"`) | `pandan-tint` bg, `pandan-pekat` text, `live` dot pinging **3 times** on mount (`data-ping`) | "LIVE · dikemas kini {12 min lepas}" |
| stale | 4–24 h, or `source === "snapshot"` | `mangga-tint` / `kunyit-pekat`, `stale` dot, static | "Sync lambat sikit · {9 jam lepas}" |
| old / error | > 24 h or `status === "error"` | `kapas` / `ink-soft`, hollow dot | "Data mungkin lapuk · {2 hari lepas}" |
| no feed | `!brand.feed` | `kapas`, `RefreshCw` with a slash | "Kedai ni belum boleh disync" |

- Pill: 28 px, `rounded-full`, Poppins 600 12; "LIVE" in Fredoka 600 caps.
- `<time dateTime={iso}>`: the server prints an absolute time ("3:40 PTG"); `LiveTime` (≈ 0.6 KB) swaps in `timeAgo()` after mount and every 60 s (paused when hidden). No hydration mismatch.
- Tap opens a `popover`: "Kami semak kedai rasmi {liveBrands} jenama lebih kurang setiap 3 jam. Sync terakhir: {date, time}." with a 6 px proportion bar (`live` on `kapas`) of `liveBrands / brands`, and "Cara kami sync →" (`/about#sync`).
- On `visibilitychange → visible`, if the last check was > 20 min ago, `router.refresh()` inside `startTransition`; if `syncedAt` changed, the dot pings 3 more times and a toast says "Sync baru masuk: {n} promo baru!".
- Inline card variant: `Clock3` 12 + relative time.

### 6.11 Rails
- **Header row:** h2 (`text-title-2`, optional one accent word) + sub (`text-body-sm` ink-2) + live count ("38 promo") + "Tengok semua →" ghost link (arrow nudges +3 px on hover). Desktop: 40 px circular prev/next (`putih`, 1.5 px garis-kuat, `ChevronLeft/Right`), `disabled` at the ends, scroll by `0.85 × clientWidth` (`scrollBy({ behavior: "smooth" })`).
- **Track:** `grid grid-flow-col auto-cols-[var(--rail-col)] gap-3 overflow-x-auto overscroll-x-contain snap-x snap-mandatory no-scrollbar px-(--gutter) scroll-px-(--gutter) pt-3 pb-5` (padding keeps overhanging stickers unclipped), children `snap-start`, `data-lenis-prevent-horizontal`, `role="region" aria-label="{title}, skrol mendatar" tabIndex={0}`.
- **Progress thumb:** 6 px `kapas` track (w-24, centred) with a `bg-kuih-lapis` thumb scaled by a **CSS scroll-driven animation** (`scroll-timeline: --rail x` on the track, `timeline-scope` on the section, `animation: grow-x linear both; animation-timeline: --rail`), inside `@supports (animation-timeline: scroll())`, hidden otherwise. Zero JS.
- **End card:** a mangga sticker tile "Tengok semua **{n}** promo →" (pop, `--pop-offset:4px`).
- **Cascade:** `RailStagger` (client) animates only the first 6 items with `slideInX` + `staggerContainer(gap.rail, 0.05)`, using the SSR-visible pattern (starts "show"; flips to "hidden" only if below the fold at hydration; returns to "show" in view).
- **Swipe hint:** the first rail on Home, mobile only, once per session (`sessionStorage`): after the cascade, the track moves `x: [0, −28, 0]` (`nudgeX`).

### 6.12 Skeletons
- **Shape-exact** copies at real dimensions and radii (CLS 0). Skeleton cards use a 2 px `garis` border and **no shadow** (signals "not real yet").
- Product skeleton: plate in `--cat-tint` (if the category is known, else cycle `#FFE4F1`, `#F3EFFF`, `#FFF4C7` by index % 3), brand bone 10 px × 40 %, title bones 12 px × 90 % and 70 %, price bone 16 px × 35 %.
- Brand skeleton: static awning in `garis`, 56 px circle, 2 lines, 3 square thumbs, 2 pills.
- **Shimmer:** **one sweep per card** on `::after` (`.skeleton`), transform-only, **starts after 400 ms** (fast loads show a calm static block), delay `400ms + --i × 80ms` so it travels as a wave in reading order.
- A rotating Gochi Hand loading line (§9.6) sits under the first skeleton group, changing every 2.5 s with an opacity crossfade, `aria-hidden`. The region has `aria-busy="true"` and one sr-only "Sedang dimuatkan…".
- Reduced motion: static bones, fixed loading line.

### 6.13 Empty states (`EmptyState`)
Centred column, max 360 px, `py-12`: 160 px `bg-sunburst` disc at 60 % with Oyen (120 px, matching mood) → `text-title-3` title → `text-body` ink-soft body (max 34ch) → one primary + one ghost CTA. Optional one Gochi side note. Oyen enters with `animate-pop-in` once. Variants and copy in §9.5.

### 6.14 Toasts (`ToastRegion` + `useToast`)
- One region in the layout: `role="status" aria-live="polite"` (errors use `role="alert"`). **One toast at a time**; a new one replaces the old.
- Pill, min-h 48, `max-w-[min(92vw,420px)]`, `bg-ink`, santan Poppins 600 14, leading 28 px circle icon on a candy well (`Heart` on bandung, `CircleCheck` on pandan, `WifiOff`/`CircleAlert` on mangga) with a 2 px white ring; optional action in `mangga` underlined ("Tengok", "Undo"); 32 px `X`.
- Mobile bottom-centre at `calc(var(--tabbar-h) + env(safe-area-inset-bottom) + 12px)`; desktop bottom-right 24 px.
- Auto-dismiss 3.2 s (5 s with an action), paused on hover/focus. Motion: `toast` variants in `AnimatePresence`.

### 6.15 Footer
- Top edge: `.pucuk` strip (14 px). Oyen (`tidur`, loaf body, 96 px) sleeps **on** the strip at right 10 %, tail hanging. Tapping him wakes him (`happy`) with a 1.2 s "meow!" bubble, then he sleeps again (easter egg; `aria-hidden`, not focusable).
- `bg-ink`, santan text, `ink-dim` meta, links underline on hover; focus ring switches to mangga (`.on-ink`).
- Columns (mobile: 2-col lists; desktop: 4-col): **Brand** (wordmark: "Lokal" santan + "Lah!" jambu, tagline, small "100% Buatan Malaysia" seal, static) · **Teroka** (Promo, Baru, Jenama, Kategori, Jenama rawak) · **Kategori** (11, two sub-columns) · **LokalLah!** (Tentang, Cara kami sync, Cadang jenama, Untuk pemilik jenama).
- Bottom: disclaimers (§9.12, `text-caption` ink-dim, max 70ch), a `bg-kuih-lapis` 6 px divider, then "© 2026 LokalLah! · Direktori bebas · Dibuat dengan sayang di Malaysia" + "Sync terakhir: …" + the **"Animasi: Penuh / Kurang"** switch.
- `content-visibility: auto; contain-intrinsic-size: auto 560px`. Mobile padding-bottom includes the tab bar + safe area.

### 6.16 Buttons (`Button`, `IconButton`)

| Variant | Face | Text | Shadow (`--pop-color`) | Use |
|---|---|---|---|---|
| **Primary** | `bandung` + `bg-bandung-fizz` overlay fading in on hover (opacity) | ink | ink | One per view: "Tengok promo hari ni", "Hantar cadangan" |
| **Secondary** | `putih` | ink | ink | "Jumpa launch baru", "Jenama", Tapis |
| **Outbound (ink)** | `ink` | santan | **bandung** | "Lawat kedai rasmi ↗", "Beli kat kedai rasmi ↗" |
| **Soft** | `bandung-tint`, no shadow, 1.5 px ink | ink | none | Tertiary in dense UI ("Simpan jenama") |
| **Ghost** | transparent | `telang` + squiggle draws on hover | none | "Tengok semua →", "Reset" |
| **Danger** | `sambal-pekat` | white | ink | "Kosongkan semua" (in confirm dialog only) |
| **Icon** | 44 px `putih` circle, 2 px ink | ink icon | ink 2 px | Search, close, share, heart (on surfaces) |

- Sizes: `lg` h-14 px-7 16 px · `md` h-12 px-[22px] 15 px · `sm` h-10 px-4 14 px (hit area extended to 44 px). Icon 20 px, gap 8. All `rounded-full`.
- Hover nudges the trailing icon (`ArrowRight` x +3; `ArrowUpRight` +2/−2).
- Loading: label stays, icon becomes `.dots`, width locked, `aria-busy`.
- Focus: 3 px telang outline, 3 px offset, on the face.

### 6.17 Inputs, select, switch, segmented, tabs
- **Text input / textarea:** h-12 (textarea min-h 120), `rounded-input`, `putih`, 1.5 px `garis-kuat`, px-4, Poppins 400 16 px, placeholder ink-soft. Label above (`text-label` ink); helper 13 px ink-soft. Focus: `border-telang` + `box-shadow: 0 0 0 4px rgb(91 43 201 / .18)` (instant). Error: `sambal-pekat` border + `sambal-tint` bg + `CircleAlert` 14 + message (`aria-invalid`, `aria-describedby`). Validate on blur and submit.
- **Search input:** 52/56 px pill with leading `Search` 20 and trailing clear `X`.
- **Select:** native `<select>` (`appearance:none` + `ChevronDown`), styled like the input.
- **Switch** (`role="switch"`): 44 × 26 track (`garis-kuat` off / `bandung` on, 2 px ink border), 20 px white thumb with 1.5 px ink, `translateX(18px)` with `spring.snappy`.
- **Segmented control** (tier filter, discount, view toggle, time range): `kapas` track, `rounded-full p-1`, `grid grid-flow-col auto-cols-fr`, h-11. One absolutely positioned thumb (`w-[calc(100%/N)]`, `putih`, 1.5 px ink, `shadow-pop-sm`) moved with `translateX(i × 100%)` (`spring.snappy`). Labels `text-label` (+ 18 px tier icon for tiers). `role="radiogroup"`, arrow-key roving focus.
- **Tabs** (brand profile Promo | Baru, saved Produk | Jenama): same visuals with `role="tablist"`. Both panels are server-rendered; switching toggles `hidden` instantly and the new panel fades in via `@starting-style` (160 ms). State in the URL hash (`#promo` / `#baru`), `history.replaceState`. Default Promo if `promos.length`, else Baru. Sticky under the header on the brand profile.

### 6.18 Odometer (`Odometer`, Server Component)
- Renders `formatCount(value)` (+ prefix/suffix); each digit is a `.odo-d` cell holding a column 0–9, translated to `--d`; separators are plain spans. `<span class="sr-only">{text}</span>` + digits `aria-hidden`.
- **SSR renders the correct value** (no-JS users see it).
- `data-roll="intro"` (hero stats only): CSS keyframe roll from 0 at first paint, +70 ms per digit (`--p`), **before hydration**; disabled once `html[data-intro="done"]` (once per session, and no replay when Activity re-shows Home).
- `data-roll="reveal"` (all others; inside a `[data-reveal]` parent): digits sit at 0 until the RevealObserver adds `.is-in`, then roll via `transition` (transitions don't replay when Activity toggles `display`).
- Value changes (filter counts, Simpan badge) roll old → new via the same transition.

### 6.19 Live ticker ("Papan tanda live")
- Full-bleed `bg-ink` band, 44 px, `.on-ink`. A fixed left tag: "LIVE" Fredoka caps ink on a `mangga` pill with 1.5 px santan ring + live dot. Right: a 32 px `Pause`/`Play` toggle (`aria-pressed`, required by WCAG 2.2.2).
- Items: latest 12 events (mixed promos and launches), each a link to the brand page: "**{brandName}** · {title} sekarang −{d}%" (santan + mangga figure) or "**{brandName}** launch {title} · {timeAgo}". Never claim when a promo started. Separators: 10 px bunga raya glyph.
- `.marquee` + `.marquee-track` (two copies; the second `aria-hidden` + `inert`); `--marquee-dur = items × 4s`. Pauses on hover, focus-within, offscreen and the toggle. Reduced motion: static, horizontally scrollable, duplicate removed.

### 6.20 Back-to-top
48 px pop circle (`bg-bandung-fizz`, 2 px ink outline, ink `ArrowUp` 22), bottom-right above the tab bar. Appears after `scrollY > 1.5 × innerHeight` (`fab` variants, AnimatePresence). Click: `lenis.scrollTo(0, { duration: 0.9 })` (instant under reduced motion). `aria-label="Naik ke atas"`. List pages and Home only.

---

## 7. Motion system

### 7.1 Principles
- **Jobs:** every animation must *Explain*, *Guide*, *Reward* or show *Status* (§1 principle 4).
- **Speed:** feedback ≤ 150 ms; enters ≤ 320 ms; reveals ≈ 420 ms; hero choreography settles by ≈ 1.1 s; nothing blocks input.
- **Two materials:** *paper* (stickers, hearts, cops) pops and overshoots; *furniture* (sheets, pages, panels) glides without bounce.
- **Once:** in-view reveals run once per page view; the hero intro runs once per session; teach-once motion stops after it has taught.
- **Quiet loops:** ≥ 5 s periods, < 8 px / 8° travel, ≤ 3 visible, all paused offscreen and on hidden tabs.

### 7.2 Three engines, each where it is cheapest

| Engine | Owns |
|---|---|
| **CSS** (keyframes, transitions, `@starting-style`, scroll-driven) | Hero intro (pre-hydration), ambient loops (mesh, wau sway, Oyen blink, stamp ring), hover/press (pop, card lift), stickers, shimmer, odometers, marquee, live ping, dialogs/sheets/popovers, tab panels, rail progress, generic reveals (RevealObserver) |
| **Motion** (`m.*` under `LazyMotion` async `domAnimation`, `strict`) | Rail cascade, section-accent pops, tier stamps, explainer steps, `AnimatePresence` (toasts, FAB, active-filter pills), springs (tab pill, segmented thumb, switch), save heart + fly-to-Simpan (`animate()` + `arc()`), scroll-linked values (`useScroll`/`useTransform`) |
| **View Transitions** (React 19.3 `<ViewTransition>`, `<Link transitionTypes>`) | Route slides/fades, Suspense skeleton → content, filtered-results crossfade, shared morphs (brand monogram, category icon). Replaces `layoutId`. |

Tokens: Appendix B (`src/lib/motion.ts`) and the CSS mirror in Appendix A (`--dur-*`, `--ease-*`, `--animate-*`).

### 7.3 Root setup

```tsx
// src/components/providers/providers.tsx
"use client";
import { useEffect } from "react";
import { LazyMotion, MotionConfig } from "motion/react";
import { defaultTransition } from "@/lib/motion";
import { SmoothScroll } from "./smooth-scroll";
import { useMotionPref } from "./motion-pref";
const loadFeatures = () => import("./motion-features").then((m) => m.default); // export { domAnimation as default } from "motion/react"

export function Providers({ children }: { children: React.ReactNode }) {
  const pref = useMotionPref(); // "user" | "always"
  useEffect(() => { const f = () => {}; document.addEventListener("touchstart", f, { passive: true }); return () => document.removeEventListener("touchstart", f); }, []);
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion={pref} transition={defaultTransition}>
        <SmoothScroll reduce={pref === "always"} />
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}

// src/components/providers/smooth-scroll.tsx — one rAF: Lenis rides Motion's frame loop
"use client";
import { useEffect, useRef } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { frame, cancelFrame } from "motion/react";
export function SmoothScroll({ reduce }: { reduce: boolean }) {
  const ref = useRef<LenisRef>(null);
  useEffect(() => {
    const update = ({ timestamp }: { timestamp: number }) => ref.current?.lenis?.raf(timestamp);
    frame.update(update, true);
    return () => cancelFrame(update);
  }, []);
  return <ReactLenis root ref={ref} options={{
    autoRaf: false, lerp: reduce ? 1 : 0.12, smoothWheel: !reduce, syncTouch: false, // phones keep native momentum
    anchors: { offset: -96 }, allowNestedScroll: true, stopInertiaOnNavigate: true, autoToggle: true, respectReducedMotion: true,
  }} />;
}
```
- `useMotionPref()` = `useSyncExternalStore` over `matchMedia("(prefers-reduced-motion: reduce)")` and `html[data-motion]`; returns `"always"` if either asks for less motion; server snapshot `"user"`.
- A 3-line inline `<script>` in `<head>` (`MotionPrefScript`) sets `html[data-motion="reduce"]` from `localStorage["lokallah:motion"]` or `navigator.connection?.saveData`, and `html[data-intro="done"]` if `sessionStorage["lokallah:intro"]` exists, before first paint.
- Keep the tree shape constant: the toggle changes Lenis options, never remounts the page.
- Never call `scrollTo(0)` on pathname change (Next + Activity restore scroll).
- `RevealObserver` (client, mounted once in the layout): one IntersectionObserver (`rootMargin: "0px 0px -8% 0px"`, threshold .15) + a MutationObserver for streamed Suspense content; marks elements already within 92 % of the viewport `is-in` *before* adding `reveal-ready` to `<html>`, so nothing visible ever flickers; unobserves after reveal.
- `useAmbientPause(ref)`: one shared IntersectionObserver that sets `data-paused` on ambient containers (`[data-ambient]`) when offscreen or `document.hidden`.

### 7.4 Hero intro (Home; CSS only, once per session, LCP-safe)

| t (ms) | Element | Animation |
|---|---|---|
| 0 | H1 text, lead, search pill | **Painted in the first frame, no animation** (LCP element is the H1 text) |
| 0 | Mesh | Blobs already drifting (they sit behind text) |
| 0 | Live pill | `intro-rise` |
| 120 | Swash under "lokal", highlighter bar under "up to date" (+160) | `intro-swash` (`scaleX` 0 → 1, origin left) |
| 200 | Quick chips | `intro-rise` |
| 260 / 320 / 380 | Stat odometers | `intro-rise` + digit roll (`data-roll="intro"`) |
| 300 | L3 burst with the real `stats.maxDiscount` | `intro-slap` (`--r-from: -14deg` → `--r: -10deg`) |
| 360 / 440 / 520 (desktop) | Fanned live deal cards | `intro-slap` to −6°, 3°, −2° |
| 420 (desktop) | Wau bulan | from `translate(24px, 40px) rotate(10deg)` + opacity 0, 900 ms, then `animate-sway` |
| 500 | Bunga raya sticker + 2 sparkles | `intro-slap` staggered 70 ms (then static) |
| 650 | Oyen paws + head | `intro-peek` from behind the search pill (wrapper clips the bottom), then `animate-blink` |
| 1200 | Search placeholder examples | Cycle every 3 s: old example `y 0 → -100%`, new `100% → 0`, 380 ms; pauses on focus; the real `placeholder` stays static |

`HeroIntroGuard` (client) writes `sessionStorage["lokallah:intro"] = "1"` ≈ 1.5 s after mount; on later visits the head script sets `data-intro="done"` and every `.intro-*` class is `animation: none`. This also stops Activity (`display:none → block`) from replaying the intro.

### 7.5 Choreography catalogue

| # | Moment | Engine | Spec | Job |
|---|---|---|---|---|
| 1 | Section header reveal | CSS (RevealObserver) | `data-reveal` rise 16 px, 420 ms; accent word then `animate-pop-in` (+120 ms); "Tengok semua" fades in (+200 ms via `--i`) | Guide: a new aisle |
| 2 | Rail cascade | Motion | First 6 items `slideInX`, `stagger(0.045)`; rest static | Explain: more to the side |
| 3 | Rail swipe hint | Motion | §6.11, mobile, once per session | Explain: swipeable |
| 4 | Grids | CSS | **Items 0–7 never animate.** Items 8+ and "Muat lagi" batches: `data-reveal` with `--i = index % columns` (≤ 5 × 60 ms) | Guide |
| 5 | Tier journey | Motion + scroll | Section progress (`useScroll({ target, offset: ["start 75%", "end 55%"] })`) drives a dashed connector's `scaleY` (mobile, vertical) / `scaleX` (desktop). Thresholds .15 / .5 / .85 flip `data-active` on stations 1–3 (3 state changes total). An activating station: its `cop-lg` does `stampIn` while an ink ring behind it scales .6 → 1.25 and fades .5 → 0 (420 ms); its tier icon then plays its micro (#6). Fully drawn under reduced motion | Explain: small grows big |
| 6 | Tier icon micro (hover / tap / station activation) | CSS | **Chili** shakes ±12° ×3 over 420 ms ("pedas!") · **Sprout** rises −4 px and leans −8° ("naik daun") · **Crown** scales 1.15 + rotates −8° with `ease-pop` and its 3 jewels twinkle once ("ikon") | Explain each tier |
| 7 | How-it-works explainer | Motion + scroll | Same progress pattern drives a 3 px `bg-kuih-lapis` line. Step 1 (Sync): `RefreshCw` spins 360° once (600 ms). Step 2 (Kesan): "RM42.90" gets a strike line drawn (`scaleX`, 240 ms), then "RM29.90" pops in with an L2 sticker "−30%". Step 3 (Beli): `ArrowUpRight` nudges twice. Each plays once; "Main semula" replays | **Explain the "always up to date" promise** |
| 8 | Card hover / press | CSS | §6.7 | Feedback |
| 9 | Pop press | CSS | §5.3 | Feedback: physical |
| 10 | Chip toggle | CSS | Bg/ring 150 ms, `Check` pops, one wiggle | Status: selected |
| 11 | Category tile | CSS | Hop off the shelf; squash on press; icon morph to category hero | Feedback + Explain continuity |
| 12 | Brand card hover | CSS | Awning flutter, monogram wiggle | Delight with meaning: "kedai buka" |
| 13 | Save (signature) | Motion + CSS | §7.6 | Reward + Explain where it went |
| 14 | Filter change | CSS + VT | §6.6 | Status |
| 15 | Tabs / segmented / switch | Motion spring / CSS | Thumb `x` (`spring.snappy`); panel `@starting-style` fade 160 ms | Explain where you are |
| 16 | Route forward / back | VT | Old: fade 120 ms + slide ∓32 px 280 ms. New: fade 200 ms (100 ms delay) + slide from ±32 px 300 ms. Header + tab bar anchored | Explain hierarchy |
| 17 | Route tab switch | VT | Crossfade (120 out / 180 in, 60 ms delay), **no movement** | Same level |
| 18 | Skeleton → content | VT | Fallback `<ViewTransition exit="skeleton-out">` fades 120 ms; content `<ViewTransition enter="content-in">` fades 200 ms + rises 8 px over 280 ms; photos then fade per §5.5 | Status: loaded |
| 19 | Shared morph | VT `share="morph"` | `brand-av-{slug}` (card → profile), `cat-ic-{slug}` (tile → category hero), 340 ms `ease-out-soft`. Plays when the destination is prefetched; otherwise #18 handles the entrance | Explain continuity |
| 20 | Live dot | CSS | 3 pings on mount; 3 more on a newer `syncedAt` | Status |
| 21 | Odometers | CSS | §6.18 | Status: live counts |
| 22 | Ticker | CSS | §6.19 | Status: live feed |
| 23 | Toasts | Motion | `toast` variants | Status |
| 24 | Empty-state Oyen | CSS | `animate-pop-in` once, then blink | Status, warmth |
| 25 | Suggest success | Motion + CSS | Form replaced (opacity) by Oyen `happy` + a 12-particle bunga raya/sparkle burst from the submit button (same particle system as Save, 640 ms) | Reward |
| 26 | "Jenama rawak" | Motion | `Dices` rotates 360° (400 ms, `ease.out`), then navigates | Explain randomness |
| 27 | Back-to-top | Motion | `fab` presence | Guide |
| 28 | End of list | CSS | Small wau floats in (`data-reveal`) with "Dah habis! Kau dah tengok semua {n}." | Status / reward |
| 29 | Price-drop badge (/saved) | CSS | One `animate-wiggle` on mount | Guide attention |
| 30 | 404 kite | CSS | Wau drifts `translate(24px,-24px) rotate(6deg)` once over 2.4 s, then `animate-sway` | Delight |

### 7.6 Save reward ("Masuk Simpan") — the signature
1. **Pointerdown:** button scales .88 (90 ms, CSS `:active`).
2. **Fill:** the outline heart fades out; a filled `bandung` heart (ink stroke) plays `.heart-fill` (scale .4 → 1.25 → 1, 380 ms `ease-pop`); a `.heart-ring` in `jambu` scales .6 → 1.6 and fades.
3. **Burst:** 6 `.particle` spans (3 mini hearts `bandung`, 3 sparkles `mangga`), at 0/60/…/300° ± 10° jitter, each with `--dx/--dy` of 22–28 px and `--k` index (15 ms stagger), 520 ms. Mounted on click, removed on `animationend`.
4. **Teach-once flight:** for the **first 3 saves of a session** (`FLY_TEACH_LIMIT`), lazy-import `fly-to-saved.ts`: an 18 px ghost heart (`position:fixed`, z 70, `will-change: transform` only while flying) travels from the button to the visible `[data-saved-target]` (tab bar Simpan on mobile, header heart on desktop) with `animate(el, { x: dx, y: dy, scale: 0.6 }, flightTransition)` (`arc()` path, 560 ms). Rects are measured once, before any write.
5. **Catch:** the target plays `bump` (scale 1 → 1.22 → 1); its count bubble rolls +1 (odometer). From the 4th save on, only steps 1–3 + 5 play.
6. **Toast:** the first save ever in a session shows "Masuk Simpan! Semua ada kat tab Simpan." [Tengok]. Later saves: no toast (sr-only "Disimpan" announced via the status region).
7. `navigator.vibrate?.(8)` when available and motion is not reduced.
8. **Unsave:** filled heart shrinks 1 → .8 → 1 and crossfades to the outline (200 ms); toast "Dah buang dari Simpan." [Undo] for 5 s.
9. Reduced motion: instant fill + count update + (first-save) toast only.
10. Data: `useSaved().toggle({ kind: "product", id, product })` (existing store, `lokallah:saved:v1`).

### 7.7 Scroll-linked inventory (complete; everything else is time-based)

| # | Element | Source | Output |
|---|---|---|---|
| 1 | Header (mobile + desktop) | `useScroll()` + `useMotionValueEvent` | Threshold/direction flips only: awning tuck, mobile hide/show of the sticky stack, hairline opacity |
| 2 | Hero parallax (≥ 1024 px, fine pointer, motion allowed) | `useScroll({ target: hero, offset: ["start start", "end start"] })` | `.mesh` wrapper `y 0 → 80`; wau `y 0 → -140`, `rotate -4° → -14°` (it rises: *naik!*); deal-card fan `y 0 → -40` |
| 3 | Tier journey connector | §7.5 #5 | `scaleY`/`scaleX` + 3 thresholds |
| 4 | Explainer line | §7.5 #7 | `scaleY`/`scaleX` + 3 thresholds |
| 5 | Rail progress | CSS `scroll-timeline` | `scaleX` |
| 6 | Back-to-top | header listener | threshold → presence |
| 7 | /about reading progress | `useScroll()` | 3 px `bg-kuih-lapis` bar under the header, `scaleX = scrollYProgress` |

No scroll-jacking, no pinned sections, no scroll-linked opacity on body text. MotionValues never become React state per frame.

### 7.8 Performance rules (non-negotiable)
1. **Animate only `transform` (incl. `translate`/`scale`/`rotate`) and `opacity`.** Never width/height/top/left/margin, box-shadow, filter, backdrop-filter, clip-path, background-position or gradient stops. Static `filter: drop-shadow` is allowed only on the awning wrapper.
2. **No `layout` / `layoutId`** (`domAnimation` lacks them; `domMax` costs +13.7 KB gz). Indicators move with `x` on equal-width tracks.
3. **No Motion component inside product or brand grids.** Cards are Server Components; their only islands are `SaveButton` (≈ 1 KB, CSS-animated) and `PlateImage`.
4. `LazyMotion` loads `domAnimation` **asynchronously**, `strict`. Search dialog, filter sheet, suggest form and the flight module are `next/dynamic` / lazy `import()` on intent.
5. **LCP is never hidden.** Nothing above the fold has an SSR `opacity: 0`; Motion `initial` is never used above the fold (use CSS intro classes or `initial={false}`). Home LCP = H1 text. Listing/brand pages: the first product image gets `loading="eager" fetchPriority="high"`; the first 2 (mobile) / 4 (desktop) are eager; the rest `loading="lazy" decoding="async"`. Desktop hero deal-card images are `lazy` (hidden on phones, never downloaded there).
6. **Exact `sizes`:** grid `(min-width:1280px) 216px, (min-width:1024px) 22vw, (min-width:640px) 31vw, 46vw` · rail `(min-width:1024px) 216px, 42vw` · list row `72px` · brand collage `(min-width:1024px) 96px, 28vw` · search `48px`. `srcSet` from `imageSrcSet()` (240–800w); target ≤ 30 KB per card image.
7. **Containment:** `contain: layout paint` on cards; `content-visibility: auto; contain-intrinsic-size: auto 1400px` on every 24-card chunk and on Home sections below the second viewport that contain **no** named view transitions and no scroll-linked effect (Ikut negeri, spotlight, CTA band, footer).
8. **Ambient loops** pause offscreen and when hidden; ≤ 3 per viewport; `will-change` only on mesh blobs, the marquee track and the flying heart (while flying).
9. **One rAF:** Lenis runs on Motion's `frame.update`. Scroll listeners are Motion's passive `useScroll` only.
10. **INP:** tap handlers < 50 ms; filter navigation in `startTransition`; search uses `useDeferredValue`; the flight measures once then only writes.
11. **CLS:** fixed header/tab heights, `aspect-square` plates, absolutely positioned stickers, shape-exact skeletons, next/font metric fallbacks, odometer cells of fixed width.
12. **Activity hygiene** (`cacheComponents` keeps up to 3 hidden routes): one-shot intros guarded by `data-intro`; counters guarded by refs / transitions; dialogs, sheets, popovers and toasts close in a `useLayoutEffect` cleanup.
13. **Budgets (Lighthouse mobile CI, Moto G Power profile):** Performance ≥ 90 (target 95) on `/`, `/promos`, `/brands`, `/brands/[slug]`; LCP ≤ 2.0 s; CLS ≤ 0.05; TBT ≤ 150 ms; INP ≤ 150 ms; first-load JS on Home ≤ 150 KB gz; critical fonts 40.2 KB; zero non-product image files.

### 7.9 Reduced motion (`prefers-reduced-motion`, the "Kurang" switch, or `saveData`)

| System | Fallback |
|---|---|
| Lenis | `lerp: 1`, `smoothWheel: false`; `scrollTo` instant (`respectReducedMotion` also covers the OS setting) |
| Motion | `MotionConfig reducedMotion="always"/"user"`: transforms skipped, opacity kept. Islands also check `useReducedMotion()` to skip particles, flight, nudge, placeholder cycling and parallax |
| CSS | Global block (Appendix A §9): animations/transitions collapse to their end state in 1 ms; mesh, marquee, shimmer and pings are `none`; reveals are opacity-only |
| Hero | Final poses at first paint |
| Odometers | Final value |
| Tier journey / explainer | Fully drawn, all stations active |
| View transitions | Duration 0 (instant swap) |
| Marquee | Static, horizontally scrollable, duplicate removed |
| Oyen | Static pose |
| Save | Fill + count + toast only |
| `saveData` | Also uses the 240w image set |

---

## 8. Page blueprints

Every page wraps its content in `<ViewTransition enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", "nav-tab": "nav-tab", default: "none" }} exit={{ …same… }} default="none">` (page, not layout). Every live section is its own `<Suspense>` with a shape-exact skeleton fallback wrapped in `<ViewTransition exit="skeleton-out" default="none">` and content in `<ViewTransition enter="content-in" default="none">`. Data comes from the existing cached selectors in `src/lib/catalog.ts`.

### 8.1 Home `/`

| # | Section | Mobile (< 768) | Desktop (≥ 1024) | Data |
|---|---|---|---|---|
| 0 | Header + tab bar | §6.2, §6.3 | §6.2 | `getStats()` (Promo count) |
| 1 | **Hero "Kedai Oyen"** — `mx-3 rounded-[28px] border-2 border-ink shadow-pop-lg overflow-hidden` panel with `.mesh` | Live pill → H1 `text-display` over 3 lines: "Semua jenama **lokal**, sentiasa **up to date**." ("lokal" `text-grad-lokal` + pink squiggle swash; "up to date" on a mangga highlighter bar) → `text-lead` ink-2 sub → 56 px search pill (opens search) with Oyen's paws + head peeking over its top edge → quick chips ("Diskaun 40%+" → `/promos?diskaun=40`, "Baru minggu ni" → `/new?masa=minggu`, "Cili Padi" → `/brands?tier=cili-padi`, "Bawah RM30" → `/promos?harga=0-30`) → 3 stat tiles (odometers: **{brands}** jenama · **{promos}** promo live · **{newLaunches}** baru). Decor: L3 burst "−{maxDiscount}%" near the H1 end with Gochi "sampai!" (links `/promos`), bunga raya 56 px bleeding off the right edge, 2 sparkles. About 620 px tall; no raster images. | 12-col, padding 56, min-h 560. Left 7 cols: same stack, primary "Tengok promo hari ni" + secondary "Jumpa launch baru" side by side, Gochi note "psst… harga live!" with an arrow doodle to the live pill. Right 5 cols: **"Rak Promo Live"** = 3 real cards from `getPromos({ limit: 3, perBrand: 1 })` (biggest discount first; fall back to `getNewLaunches`, then illustration only) fanned at −6° / 3° / −2° on a white `rounded-panel` base, a 140 px wau above with its dashed string leading down to the cards ("the wau brings the deals"), bunga raya behind, static "100% Buatan Malaysia" seal bottom-left. Mesh 3 blobs. | `getStats()`, `getPromos()` |
| 2 | **Live ticker** | §6.19 | full-bleed | latest 12 from `getPromos({limit:6})` + `getNewLaunches({limit:6})`, interleaved |
| 3 | **"Nak usha apa hari ni?"** (overline "RAK KATEGORI") | 4 × 3 tiles (11 + "Semua jenama") on 3 shelf planks | 6 × 2 on 2 planks, with "{n} jenama" | `getCategorySummaries()` |
| 4 | **"Promo panas sekarang"** on a `bg-mangga-lassi` band | Rail of 12 promo cards + end card; swipe hint; band hem: `.pucuk`-style rebung strip in jambu on top | 5 visible + arrows + progress thumb | `getPromos({ limit: 12, perBrand: 2 })` |
| 5 | **"Baru sampai"** on a `bg-cendol` band | "Minggu ni" overline + rail of 12 baru cards + end card; a small wau beside the title | same | `getNewLaunches({ limit: 12, perBrand: 2 })` |
| 6 | **"Macam mana kami sentiasa up to date?"** (`bg-gula-kapas` band) | Origin quote card first (speech bubble, §9.4), then the 3-step explainer vertical with its progress line (§7.5 #7) | Quote left (4 cols), 3 horizontal steps right (8 cols) | `getStats()` (`liveBrands`) |
| 7 | **"Dari Cili Padi ke Jenama Ikon"** (`bg-senja` band) | Vertical dashed connector at x = 28 linking 3 stations: cop-lg + 96 px kawaii tier icon in a white circle + tagline + "{n} jenama" odometer + 3 overlapping 36 px monograms + "+{n}" + "Tengok semua {tier} →" | Horizontal connector across 3 columns | `getBrandSummaries()` |
| 8 | **"Cili Padi minggu ni"** spotlight | Big brand card (unique, morph-enabled) + 2 × 2 of its latest products | 2-col: brand left, products right | Brand = `cili-padi` brands with `live`, picked by `fnv1a(isoWeek) % n` (stable all week) |
| 9 | **"Jelajah ikut negeri"** | 16 `STATES` chips (`MapPin` + name + count) in a 2-row horizontal scroller; 0-count states shown muted with "Belum ada, cadangkan!" | Wrapped chips | `getBrandSummaries()` |
| 10 | **"Kenal jenama lokal yang best?"** (`bg-bandung-fizz` band) | Oyen `happy` holding a `Megaphone` + h2 + body (ink) + ink button "Cadang jenama" → `/about#cadang` | Horizontal | — |
| 11 | `bg-teh-tarik` wash → Footer | §6.15 | | |

### 8.2 `/promos`
- **Header band** (`bg-mangga-lassi`): overline `BadgePercent` "HARGA TURUN" · H1 `text-title-1` "Promo **panas**" · live pill · sub "{promos} produk tengah promo dari {n} jenama. Terus dari kedai rasmi." · big odometer "sampai −{maxDiscount}%" · inline disclaimer "Harga disemak {t}. Confirm kat kedai rasmi sebelum bayar ya."
- **Filters:** mobile sticky bar + Tapis sheet; desktop sidebar (§6.6). Discount segmented control lives in both. Sort: **Diskaun paling besar** (default) · Harga paling murah · Jimat paling banyak (RM) · Jenama A–Z. (No "terkini" sort: the data has no reliable "discount detected at" time.)
- **Toolbar:** "Jumpa **{n}** promo" (odometer, `aria-live`) · Grid/Senarai segmented (remembered in `localStorage["lokallah:view"]`).
- **Grouping:** when sorted by discount, results are grouped under sticky 32 px sub-headers that use the sticker itself: L3 burst mini + "≥ 40% · Jimat gila", L2 pill + "20–39% · Berbaloi", L1 pill + "5–19% · Ada la sikit".
- **Grid:** 2/3/4(+sidebar)/5 cols; 24 per chunk; "Muat lagi" (`?page=`), with a skeleton row appended while loading. End: "Dah habis! Kau dah tengok semua promo hari ni." + link to `/new`.
- Back-to-top FAB. Empty/filtered-empty states.

### 8.3 `/new`
- **Header band** (`bg-cendol`): the wau as hero art (sways), H1 "Baru **sampai**", sub "Produk yang baru launch kat kedai rasmi jenama lokal.", segmented **Minggu ni / Bulan ni** (`NEW_WINDOW_DAYS = 30`) + category chips + "Sorok yang habis stok" switch.
- **Kalendar koyak headers** (B): results grouped by day; each group has a sticky (below the filter bar) 64 × 72 tear-off calendar page: `bandung` top binding with two santan ring holes, day number in Fredoka `text-stat`, month in caps 11 px, Malay weekday (Isnin…Ahad); a zig-zag torn bottom edge (CSS mask). To its right: "Hari ni" / "Semalam" / "Khamis, 2 Okt" + "{n} produk".
- Grid of Baru cards ("Baru je" ≤ 3 days, "Baru" otherwise); Grid/Senarai toggle as /promos.
- If `?since=` (from the "Sejak lawatan lepas" chip), show a `keladi-tint` banner "{n} produk baru sejak kau datang last" with dismiss.

### 8.4 `/brands` — Direktori Jenama
- Head: H1 "Direktori jenama **lokal**" + odometer count; full-width search input "Cari nama jenama…" (`q`); "Jenama rawak" (`Dices`) secondary button.
- Filters: category chip row; tier segmented (Semua / Cili Padi / Naik Daun / Jenama Ikon, with icons); Negeri native select (16); "Ada promo je" switch; sort select (A–Z · Paling banyak promo · Paling banyak produk baru).
- **Instant client filtering, no network:** the page server-renders every brand card with `data-name/data-cat/data-tier/data-state/data-promos/data-new`; `DirectoryFilter` (≈ 1 KB) toggles `hidden`, reorders via CSS `order`, updates the live count, and syncs the URL with `history.replaceState`. Cards use `content-visibility: auto`.
- Layout: < 480 brand rows; ≥ 480 2-col kedai cards; ≥ 1024 3 cols; ≥ 1280 4 cols. Desktop A–Z letter rail sticks to the right edge when sorted A–Z.
- Empty: Oyen `cari` + "Cadang jenama ni" prefilled with the query.

### 8.5 `/brands/[slug]` — Profil jenama ("kedai")
1. **Cover** (`data-cat` root): 160 px mobile / 220 px desktop `bg-cover-cat` + `.batik` at .3, a full-bleed awning (`--awning: var(--cat-pop)`, 22 px stripes) on top, back link "← Semua jenama" (`nav-back`), share (`Share2`: Web Share, fallback copy + toast) and save-brand heart top-right.
2. **Identity card** (`putih`, 2 px ink, `shadow-pop`, overlapping the cover by −48 px): 96 px monogram (morph target `brand-av-{slug}`) · H1 `text-title-1` · the **tier stamp** (112 px rotating ring) overlapping the card's top-right corner · meta row (category chip link · `MapPin` origin/state · "Sejak {founded}") · description `text-body` (max 60ch, "Baca lagi" after 3 lines) · tag chips.
3. **Actions:** outbound ink button "Lawat kedai rasmi ↗" (full width on mobile, `outboundUrl(website)`), then secondary pop pills with labels: Instagram (`Camera`), TikTok (`Music2`), Shopee (`ShoppingBag`). Missing links are hidden.
4. **Live line** from `getBrandProducts(slug).status`: "Kedai disemak {t} · {promos} promo · {newest} baru".
5. **Desktop:** identity left, a right-hand stats card with 3 odometers (Promo · Baru · Diskaun tertinggi).
6. **Sticky tabs** "Promo ({n})" / "Baru ({n})" (§6.17). The best deal in Promo gets the kraft "Deal terbaik" tag and a 64 px L3/L2 sticker.
7. **Grid** 2/3/4 cols of product cards. Empty tab: Oyen `tidur` + suggestion to switch tabs.
8. **No feed** (`!brand.feed`): info panel (`keladi-tint`, 2 px ink) "Kedai jenama ni belum boleh di-sync automatik. Tengok terus kat kedai rasmi diorang ↗" + website/Instagram buttons.
9. Rail "Jenama serupa yang kau mungkin suka" (same category, same tier first, current excluded) + disclaimer box.

### 8.6 `/categories/[slug]`
- Root `data-cat={slug}`: the whole page adopts the accent (chips, underline, live pill tint).
- **Hero "papan tanda"** (enamel signboard): `bg-cover-cat` + `.batik` on the right half, a 2 px ink inner frame inset 8 px (`rounded-[28px]`), 96 px `--cat-mid` squircle with a 40 px ink icon (morph target `cat-ic-{slug}`), overline `nameMs`, H1 `name` ("Skincare & Beauty"), `blurb`, odometer row "{brands} jenama · {promos} promo · {newLaunches} baru".
- Sibling category chip scroller at the top (other 10). Switching category uses `nav-tab`.
- Tier segmented control (client `hidden` toggling) scoping every section below.
- Sections: "Promo panas dalam {nameMs}" (first 8 in a grid → "Tengok semua" `/promos?kat={slug}`), "Baru dalam {nameMs}" rail, "Jenama {nameMs}" brand grid with "Muat lagi".
- Data: `getPromos({ category })`, `getNewLaunches({ category })`, `getBrandSummaries()` filtered.

### 8.7 `/saved` — Simpan
- Header band `bg-gula-kapas`: H1 "Simpanan kau" + count, note "Disimpan dalam phone ni je, tak perlu login."
- Tabs **Produk** / **Jenama**. Renders skeletons until mount (the store's server snapshot is empty; no hydration mismatch).
- **Freshness check:** fetch `/api/feed/search` once (cached), map by product id, compare to the saved `product.price`:
  - cheaper now → `pandan-tint` sticker "Turun lagi RM{x} sejak kau simpan!" (wiggles once) and a `bg-cendol` banner "Psst! {n} barang simpanan kau turun harga." at the top;
  - promo ended (`discount` gone) → ink-soft "Promo dah tamat";
  - missing from the index → ink-soft "Dah tak dijual" + image at opacity .5.
- Each card meta: "Disimpan {timeAgo(savedAt)}". Sort: Baru disimpan · Harga turun dulu · Diskaun terbesar.
- "Kosongkan semua" → confirm `<dialog class="modal">` with a danger button → Undo toast. Changes sync across tabs (`storage` event, already in `useSaved`).
- Empty: Oyen `tidur` + §9.5 copy.

### 8.8 `/about` — Tentang + Cadang jenama
1. Hero `bg-gula-kapas`: H1 "Semuanya bermula dengan satu soalan." + the Threads quote bubble + Fredoka "**Boleh.** Ni dia." + Oyen waving (`happy`, 120 px). Reading-progress bar (§7.7 #7).
2. `#sync` "Cara kami sync": the explainer component (same as Home §6).
3. `#tier`: the three tier cards (cop-lg, kawaii icon, criteria, count).
4. "Siapa kami (dan siapa kami bukan)": full disclaimers (§9.12) + brand-owner contact line.
5. FAQ: native `<details name="faq">` (exclusive accordion); content fades in via `@starting-style`; `ChevronDown` rotates 180°. Answers for sync interval and commission policy come from config/owner; never invent them.
6. **`#cadang` form** (`SuggestForm`, `next/dynamic`): Nama jenama* · Link kedai / Instagram* (`inputmode="url"`) · Kategori (select) · Negeri (select) · Kenapa best? (textarea) · Email kau (optional, `inputmode="email"`) · honeypot (`aria-hidden`, `tabIndex=-1`). Prefill from `?nama=`. Submits via a Server Action `suggestBrand` (validates; POSTs JSON to `process.env.SUGGEST_WEBHOOK_URL` when set, otherwise `console.info`s it). Success: form replaced by Oyen `happy` + particle burst + "Terima kasih! Oyen dah catat cadangan kau." (`role="status"`).

### 8.9 Search dialog
§6.4. States: empty, typing/results, index loading, no results, error. Desktop centred dialog; mobile full-screen sheet.

### 8.10 404 (`not-found.tsx`)
- `bg-senja` panel. Art: an empty *rak* (two ink-outlined planks on brackets, Appendix D #14) with Oyen `tidur` loaf-curled on the top plank, tail hanging, "z" floating; a wau with a cut string drifting away top-right (§7.5 #30).
- H1 "Alamak, rak ni kosong!" + body (§9.7) + search pill + chips (Promo · Baru · Jenama · Kategori) + primary "Balik ke kedai".
- `error.tsx`: same frame, Oyen `terkejut`, "Alamak, ada benda tak kena kat pihak kami." + "Cuba lagi" (`reset()`) + "Balik ke kedai".

### 8.11 Loading skeletons (`loading.tsx` per segment)
- **Home:** hero is static/cached and renders real; each data section shows its header bone + 3 skeleton cards (rail) or 12 tile bones (categories) + one loading line.
- **/promos, /new, /categories/[slug]:** header band real (static), filter bar real, H1 real, 8 card skeletons (2 cols mobile).
- **/brands:** header + filters real, 6 brand skeletons.
- **/brands/[slug]:** cover in the category tint if known (from the link's `data-cat` via `transitionTypes` context, else `kapas`), awning real, monogram circle bone, 2 text bones, button-row bones, tab track, 6 cards.
- **/saved:** header band + 4 cards (client until the store is read).
- All use the 400 ms-delayed shimmer wave and the rotating loading line.

---

## 9. Copy deck (Manglish)

**Voice:** warm, cheeky, never rude. "Kau" (you), "korang" (you all). Malay-first with the loanwords young Malaysians actually use (promo, launch, update, sync, skincare, online). Sentence case. No emoji. Prices as "RM41.30"; product names exactly as the store writes them. Placeholders `{…}` come from data/config; never hard-code counts or the sync interval.

### 9.1 Hero
- **H1 (final):** "Semua jenama **lokal**, sentiasa **up to date**."
- Alternates (A/B tests only): "Dari kedai kecik sampai jenama **gempak**." · "Promo lokal? Kami dah **usha** dulu." · "Satu kedai runcit untuk **semua** jenama Malaysia." · "Sokong lokal, tapi jangan **terlepas** promo."
- **Sub:** "Promo dan produk terbaru dari kedai rasmi {brands} jenama Malaysia, dari skincare sampai sambal. Auto-update setiap beberapa jam, so kau tak terlepas apa-apa."
- **Search examples (cycling):** "Cari "sambal bilis"…" · "Cari "tudung bawal"…" · "Cari "kopi tenom"…" · "Cari "sunscreen"…" · "Cari "kasut sekolah"…" · "Cari "lilin wangi"…". Static placeholder: "Cari jenama, produk, kategori…"
- **Quick chips:** "Diskaun 40%+" · "Baru minggu ni" · "Cili Padi" · "Bawah RM30"
- **Stat labels:** "jenama" · "promo live" · "baru"
- **Gochi notes:** "psst… harga live!" · "sampai!" (beside the max-discount burst) · "jimat gila!"
- **CTAs:** "Tengok promo hari ni" · "Jumpa launch baru"

### 9.2 Section titles and subs

| Section | Title | Sub / eyebrow |
|---|---|---|
| Categories | Nak usha apa hari ni? | Eyebrow "RAK KATEGORI" · "{n} kategori, dari dapur sampai almari." |
| Promo rail | Promo panas sekarang | "Harga turun, dikesan terus dari kedai rasmi." |
| New rail | Baru sampai | "Fresh dari oven: produk yang baru launch." |
| Explainer | Macam mana kami sentiasa up to date? | — |
| Tiers | Dari Cili Padi ke Jenama Ikon | "Setiap jenama besar pernah bermula kecil." |
| Spotlight | Cili Padi minggu ni | "Kecil-kecil cili padi. Jom sokong yang baru bertatih." |
| States | Jelajah ikut negeri | "Dari Perlis sampai Sabah." |
| Suggest | Kenal jenama lokal yang best? | "Cadang la. Oyen catat, kami semak." |
| Similar | Jenama serupa yang kau mungkin suka | — |
| Ticker tag | LIVE | — |

### 9.3 Explainer steps
1. **"Sync dari kedai rasmi"**: "Robot kecil kami ronda kedai online setiap jenama, lebih kurang setiap 3 jam."
2. **"Kesan harga turun & produk baru"**: "Harga asal vs harga sekarang? Kami kira diskaun untuk kau. Produk baru terus naik rak."
3. **"Klik terus ke kedai"**: "Kami tak jual apa-apa. Kau beli terus dari jenama, duit sampai kat diorang."

### 9.4 Origin quote
Speech bubble (Poppins 400 17 px, ink, bubble tail, generic grey avatar circle, no handle/logo/metrics): *"boleh tak ada sorang buat website yang compile all local brand products daripada skincare, fashion, food to all other things yang Malaysian buat? and MUST BE UP TO DATE dari segi promotion and new products they launched"* — "seorang netizen kat Threads". Then Fredoka "**Boleh.**" + "Ni dia, dan kami pastikan sentiasa up to date." + 3 promise chips: `RefreshCw` "Auto-sync" · `BadgePercent` "Promo dikesan" · `Sparkles` "Launch baru ditangkap".

### 9.5 Empty states

| Where | Oyen | Title | Body | CTA |
|---|---|---|---|---|
| Saved: produk | tidur | Simpanan kau kosong lagi. | Tekan ♥ kat mana-mana produk, nanti Oyen simpankan sini (dalam phone kau je). | Jom usha promo |
| Saved: jenama | tidur | Belum ada jenama kegemaran. | Simpan jenama yang kau suka, senang nak check promo dia nanti. | Jelajah jenama |
| Search | cari | Alamak, "{q}" tak jumpa. | Cuba ejaan lain, atau cari ikut kategori. Jenama ni belum ada? | Cadang jenama ni |
| Filters | cari | Takde yang padan semua tapisan ni. | Buang satu dua tapisan, confirm jumpa. | Reset tapisan |
| Promos (scope) | tidur | Takde promo buat masa ni. | Oyen tengah jaga. Bila harga turun, keluar sini dulu. | Tengok yang baru |
| New (scope) | tidur | Senyap je minggu ni. | Jenama tengah masak produk baru. Check balik esok! | Tengok promo |
| Brand: no promo | tidur | {Brand} tengah takde promo. | Tapi produk diorang still best. Tengok yang baru! | Tengok Baru |
| Brand: no feed | cari | Kedai {Brand} belum boleh disync. | Tengok terus kat kedai rasmi diorang. Kami tengah usahakan. | Lawat kedai rasmi ↗ |
| Category | tidur | Rak ni kosong lagi. | Kenal jenama {nameMs} lokal? Cadangkan! | Cadang jenama |
| Offline | terkejut | Internet tengah merajuk. | Kau masih boleh tengok apa yang dah dimuat. Data mungkin bukan yang terkini. | Cuba lagi |
| Error | terkejut | Alamak, ada benda tak kena. | Bukan salah kau. Cuba lagi kejap? | Cuba lagi |

### 9.6 Loading lines (Gochi Hand, rotate every 2.5 s)
"Oyen tengah susun rak…" · "Kejap, tengah kira diskaun…" · "Tengah usha kedai rasmi…" · "Sabar jap, barang baru sampai…" · "Tengah tarik teh… jap." · "Tauke tengah tulis kad harga…"

### 9.7 404
"Alamak, rak ni kosong!" / "Page yang kau cari dah habis stok, atau memang tak pernah wujud. Oyen pun tertidur menunggu." [Balik ke kedai] [Cari barang]

### 9.8 Toasts
- First save: "Masuk Simpan! Semua ada kat tab Simpan." [Tengok]
- Unsave: "Dah buang dari Simpan." [Undo]
- Save brand: "Jenama disimpan. Senang nak check promo dia nanti."
- Link copied: "Link dah copy. Share dengan geng!"
- Suggestion sent: "Terima kasih! Oyen dah catat cadangan kau."
- New sync: "Sync baru masuk: {n} promo baru!"
- Price drop: "Psst! {n} barang simpanan kau turun harga."
- Offline / online: "Internet tengah merajuk. Data mungkin bukan yang terkini." / "Dah online balik!"
- Storage blocked: "Browser kau sekat storage, simpanan tak dapat disimpan lepas tutup tab."
- Motion switch: "Animasi dikurangkan." / "Animasi penuh dihidupkan."
- Cleared: "Simpanan dah dikosongkan." [Undo]
- Error: "Alamak, tak jadi. Cuba lagi?"

### 9.9 Live and time strings
- Pill: "LIVE · dikemas kini {t}" · "Sync lambat sikit · {t}" · "Data mungkin lapuk · {t}" · "Kedai ni belum boleh disync"
- Popover: "Kami semak kedai rasmi {liveBrands} jenama lebih kurang setiap 3 jam. Sync terakhir: {tarikh}, {masa}."
- Relative time: `timeAgo()` output ("baru tadi", "{n} min lepas", "{n} jam lepas", "{n} hari lepas"…); absolute date in the popover/tooltip.
- Card meta: "{t}" (price checked) · "Lancar {t}" · "Jimat RM{x}" · "Habis"

### 9.10 Tier copy
- **Cili Padi:** "Kecil-kecil cili padi. Home-grown, baru bertatih, tapi pedas!"
- **Naik Daun:** "Tengah naik daun. Makin ramai kenal, makin laju jalan."
- **Jenama Ikon:** "Nama yang satu Malaysia kenal. Kita membesar sama-sama."
- Stamp rings: "KECIL-KECIL CILI PADI •" · "TENGAH NAIK DAUN •" · "JENAMA IKON MALAYSIA •"
- Filter label: "Saiz jenama": "Semua" · "Cili Padi" · "Naik Daun" · "Jenama Ikon"

### 9.11 Controls and CTAs
"Tengok semua" · "Tengok semua {n} promo →" · "Lawat kedai rasmi ↗" · "Beli kat kedai rasmi ↗" · "Simpan" / "Disimpan" · "Simpan jenama" · "Tapis" · "Susun" · "Tunjuk {n} promo" / "Tunjuk {n} jenama" · "Reset" / "Reset semua" · "Muat lagi" · "Cari" · "Batal" · "Tutup" · "Kongsi" · "Copy link" · "Jenama rawak" · "Cadang jenama" · "Hantar cadangan" · "Balik ke kedai" · "Baca lagi" / "Tutup balik" · "Cuba lagi" · "Main semula" · "Jeda" / "Sambung" · "Naik ke atas" · "Kosongkan semua" · "Grid" / "Senarai" · sort labels "Diskaun paling besar" · "Harga paling murah" · "Jimat paling banyak" · "Jenama A–Z" · "Paling banyak promo" · "Paling banyak produk baru" · "Ada promo je" · "Sorok yang habis stok" · footer "Animasi: Penuh / Kurang".

### 9.12 Disclaimers
1. Data source: "Harga, promo dan produk diambil secara automatik dari kedai online rasmi setiap jenama, dan disemak lebih kurang setiap 3 jam."
2. Prices change: "Harga dan stok boleh berubah bila-bila masa. Sila sahkan harga akhir di kedai rasmi sebelum membeli."
3. Independent: "LokalLah! ialah direktori bebas. Kami tak jual apa-apa dan tak bergabung dengan, ditaja atau disahkan oleh mana-mana jenama yang disenaraikan."
4. Trademarks: "Nama jenama, tanda dagangan dan gambar produk adalah milik pemilik masing-masing."
5. Outbound: "Link keluar ada tag utm_source=lokallah supaya jenama tahu trafik datang dari sini. Ini bukan link affiliate." (accurate for the current `outboundUrl()`)
6. Brand owners: "Pemilik jenama? Nak kemas kini info atau keluar dari senarai? Hubungi kami."
7. Saved: "Simpanan disimpan dalam browser ni je. Clear data browser, hilanglah dia."
8. Inline (listing pages, `text-caption` ink-soft): "Harga disemak {t}. Confirm kat kedai rasmi sebelum bayar ya."
9. Footer tagline: "Kedai runcit digital untuk semua jenama Malaysia. Sokong lokal, satu klik je."

### 9.13 Accessible names
"Cari jenama atau produk" · "Tutup carian" · "Simpan {produk}" / "Buang {produk} dari simpanan" · "Simpan jenama {jenama}" · "{produk}, {harga}, buka kedai rasmi {jenama} (tab baru)" · "Tier: Cili Padi" · "Promo, {n} item" · "Simpan, {n} item" · "Skrol ke kiri" / "Skrol ke kanan" · "Naik ke atas" · "Jenama rawak" · "Jeda ticker" / "Sambung ticker" · "Navigasi utama" · "Langkau ke kandungan".

---

## 10. Accessibility and usability

**Perceivable**
- All text pairs in §2.5 pass AA (body ≥ 15.6:1). Non-text UI ≥ 3:1 (ink outlines, `garis-kuat`, focus rings, status dots + labels).
- Never colour alone (R6). Deal level = colour + shape + "−45%"; promo vs new = pink vs pandan + "%" vs "BARU" (very different lightness: colour-blind safe).
- Prices: `<data value>`; struck price `aria-hidden`; one sr-only sentence ("Harga sekarang RM29.90, harga asal RM42.90, diskaun 30%").
- Images: `alt` = product title (fallback "Produk {brandName}"). Monograms ≥ 56 px have `aria-label` = brand name; smaller ones are `aria-hidden` (name adjacent). Oyen, stickers' shapes, mesh, patterns, marquee duplicates are `aria-hidden`.
- `<html lang="ms-MY">`. Fluid type in rem + vw: 200 % zoom works; reflow at 320 px with no horizontal page scroll (only labelled rails scroll sideways).
- `prefers-contrast: more` supported (R9).

**Operable**
- Touch targets ≥ 44 × 44 (heart via extended hit area, chips 40 + `::before`, tab items, rail arrows), ≥ 8 px apart. Primary navigation and search sit in the bottom thumb zone.
- Keyboard: skip link "Langkau ke kandungan" first; DOM order = visual order; ⌘/Ctrl+K and "/" open search; combobox/listbox, tablist, radiogroup and disclosure follow APG; Esc closes overlays; native `<dialog>` traps focus and returns it to the trigger; rails are focusable regions; nothing is hover-only (Kategori opens on click; tooltips are tap/focus popovers).
- Focus: 3 px telang ring (mangga on ink), never removed; whole-card ring via `:has()`; `scroll-padding` keeps focused items clear of the sticky header and tab bar (WCAG 2.4.11).
- **WCAG 2.2.2:** ticker has a visible Pause; ambient loops stop offscreen; live pings run 3 times; no autoplay carousels; the footer "Animasi: Kurang" switch stops all ambient motion site-wide.
- Motion sensitivity: §7.9. No scroll-jacking; Lenis smooths the wheel only (`syncTouch: false`).

**Understandable**
- Plain, consistent labels (Utama, Promo, Cari, Baru, Simpan). Manglish never replaces the actual label.
- Outbound links always show `ArrowUpRight` and say "(tab baru)". Internal links never open new tabs.
- Honest data: every promo surface shows when prices were checked; stale/snapshot/error states say so; no fake recency sort; "Deal terbaik" and "Paling aktif" lists are algorithmic and labelled as such.
- Destructive actions: Undo (unsave, clear) or confirm (clear all). Forms validate on blur + submit with linked errors; success via `role="status"`.

**Robust**
- Toasts, result counts and search counts are `aria-live="polite"`; animated digits are `aria-hidden` with an sr-only final value; `aria-busy` while pending.
- localStorage access is wrapped in try/catch (existing store) with the "storage blocked" toast.
- No JS: hero, grids, counts and links still render correctly (SSR values; reveals only hide after `reveal-ready`).

**Usability for scanning hundreds of promos on a phone**
- Fixed card anatomy (photo → brand → title → price → meta) with `min-h-[2lh]` titles, so prices share one baseline across a row.
- The sticker is always top-left (first fixation) and steps up in size/colour with the discount; group headers by deal level let you stop at "Ada la sikit".
- "Senarai" mode shows ≈ 6 products per screen for power scanners. The header + filter stack hides on scroll down and returns on scroll up; back-to-top after 1.5 screens.
- Filters live in the URL (shareable, Back works). Activity keeps loaded pages and scroll position when returning from a brand page; product links open the store in a new tab, so the list is never lost.
- Saved items track price changes since saving, turning the wishlist into a lightweight price watcher: the "MUST BE UP TO DATE" promise in the user's own list.
- Low-end devices / Save-Data: reduced motion, smaller images, fonts and JS within budget.

---

## Appendix A — `src/app/globals.css` (paste-ready Tailwind v4)

Replaces the current create-next-app `globals.css` entirely. Compiles with the installed Tailwind 4.3.3. Contents: §1 `@theme static` tokens (every colour, radius, shadow, easing, type step and animation), `@theme inline` font families bound to the next/font variables, §2 non-utility tokens (durations, layout, z-index, gradients, patterns) + `data-cat` / `data-tier` scoping, §3 base, §4 keyframes, §5 utilities (gradient backgrounds, gradient text, edge fade, stretched link…), §6 component classes (`.pop`, `.awning`, `.mesh`, `.skeleton` shimmer, stickers/badges, `.plate`, `.card`, `.odo`, `.marquee`, patterns, particles, native dialog/popover transitions, intro classes), §7 reveal, §8 view transitions, §9 reduced motion.

Usage notes:
- Category/tier colours: put `data-cat={slug}` / `data-tier={slug}` on a wrapper, then `bg-(--cat-tint) text-(--cat-ink)`, `bg-(--tier-tint)`. Static utilities like `bg-beauty-tint` also exist.
- Fredoka text: `font-num font-semibold`. Gochi notes: `hand text-hand`.
- Durations in utilities: `duration-(--dur-fast)`; easings: `ease-out-soft`, `ease-pop`.

```css
/* src/app/globals.css — LokalLah! "Kedai Oyen: Comel & Laju" (light theme only) */
@import "tailwindcss";
@import "lenis/dist/lenis.css";

/* =====================================================================
   1. THEME TOKENS (generate Tailwind utilities; `static` = always emit vars)
   ===================================================================== */
@theme static {
  --color-*: initial;             /* only our palette exists: no gray-500, no off-brand colours */
  --font-weight-*: initial;       /* only the Poppins weights we load */
  --font-weight-normal: 400;
  --font-weight-semibold: 600;
  --font-weight-extrabold: 800;

  /* ---- Neutrals ---- */
  --color-white: #FFFFFF;
  --color-santan: #FFF8F1;        /* page background (coconut cream) */
  --color-putih: #FFFFFF;         /* cards, inputs, sheets, tab bar */
  --color-kapas: #FFEFF6;         /* wells, skeleton bones, hover rows, search pill fill */
  --color-garis: #EEDDE8;         /* decorative hairlines + card borders (no contrast duty) */
  --color-garis-kuat: #8C7B98;    /* functional borders: inputs, unselected chips (>= 3:1) */
  --color-ink: #2B1736;           /* text, outlines, pop shadows, dark bands */
  --color-ink-2: #4A3B5C;         /* product titles, any text over gradients / mesh */
  --color-ink-soft: #6B5577;      /* meta, captions, placeholders, struck prices */
  --color-ink-dim: #C9B8D4;       /* muted text ON INK SURFACES ONLY */
  --color-faint: #B9ADC4;         /* decoration only, never text */

  /* ---- Brand candy ---- */
  --color-bandung: #FF6FB5;       /* primary fill (ink text only) */
  --color-bandung-tint: #FFE4F1;
  --color-bandung-pekat: #C0136A; /* pink TEXT: promo price, links on pink */
  --color-jambu: #FF8FC8;         /* decoration, footer accents on ink */
  --color-keladi: #BDA6FF;        /* secondary fill (ink text only) */
  --color-keladi-tint: #F3EFFF;
  --color-telang: #5B2BC9;        /* focus ring, text links, info text */
  --color-mangga: #FFD54F;        /* highlight fill: L3 burst, count bubbles */
  --color-mangga-tint: #FFF4C7;   /* search <mark>, stale pill bg */
  --color-kunyit-pekat: #7A5300;  /* warning / stale TEXT */
  --color-pandan: #49D6A0;        /* "Baru je" fill (ink text) */
  --color-pandan-tint: #DAF8EC;
  --color-pandan-pekat: #0F7A53;  /* success / "Jimat" / calm "Baru" TEXT */
  --color-sambal-tint: #FFE3E7;
  --color-sambal-pekat: #B91C3B;  /* error text + destructive */
  --color-live: #12A15A;          /* live dot (always with a text label) */
  --color-stale: #B7791F;         /* stale dot */
  --color-oyen: #FFAA55;          /* mascot fur */
  --color-oyen-belang: #E07020;   /* mascot stripes */

  /* ---- Category accents: tint (bg) / mid (avatar, icon well) / pop (decor only) / ink (text) ---- */
  --color-beauty-tint: #FFE8EE;      --color-beauty-mid: #FFB3C4;      --color-beauty-pop: #FF8FA8;      --color-beauty-ink: #AD1D45;
  --color-fashion-tint: #ECEAFF;     --color-fashion-mid: #BDB6FF;     --color-fashion-pop: #9D93FF;     --color-fashion-ink: #4B3DC4;
  --color-accessories-tint: #F4E9FF; --color-accessories-mid: #D9BAF7; --color-accessories-pop: #C79BF2; --color-accessories-ink: #7333A6;
  --color-food-tint: #FFEBE2;        --color-food-mid: #FFB99F;        --color-food-pop: #FF9772;        --color-food-ink: #AE3A10;
  --color-drinks-tint: #F8EEE3;      --color-drinks-mid: #E5C0A1;      --color-drinks-pop: #D8A275;      --color-drinks-ink: #83461A;
  --color-home-tint: #E1F6EA;        --color-home-mid: #A3E3BF;        --color-home-pop: #79D6A3;        --color-home-ink: #17704A;
  --color-health-tint: #DEF5F2;      --color-health-mid: #96DED7;      --color-health-pop: #66CFC5;      --color-health-ink: #0C6964;
  --color-kids-tint: #FFF4D3;        --color-kids-mid: #FFDF8A;        --color-kids-pop: #FFD159;        --color-kids-ink: #7F5900;
  --color-tech-tint: #E2F0FF;        --color-tech-mid: #A4CFFF;        --color-tech-pop: #7BB9FF;        --color-tech-ink: #0E5AA4;
  --color-crafts-tint: #FBE7F7;      --color-crafts-mid: #EEAFE3;      --color-crafts-pop: #E58AD5;      --color-crafts-ink: #922781;
  --color-lifestyle-tint: #EDF7DA;   --color-lifestyle-mid: #C2E395;   --color-lifestyle-pop: #A6D667;   --color-lifestyle-ink: #4A6611;

  /* ---- Tiers ---- */
  --color-cili-tint: #FFE5DF; --color-cili-pop: #FF6B4A; --color-cili-ink: #B0271B;
  --color-daun-tint: #DFF5E4; --color-daun-pop: #4CC27A; --color-daun-ink: #1B6D36;
  --color-ikon-tint: #FFF0C4; --color-ikon-pop: #F5B820; --color-ikon-ink: #7A5300;

  /* ---- Breakpoints (Tailwind defaults kept; xs added) ---- */
  --breakpoint-xs: 30rem;         /* 480px: brand cards go 2-up */

  /* ---- Type scale (fluid 360 -> 1280px; rem + vw keeps browser zoom working) ---- */
  --text-display: clamp(2.375rem, 1.592rem + 3.478vw, 4.375rem);   /* 38 -> 70 */
  --text-display--line-height: 1.04; --text-display--letter-spacing: -0.035em; --text-display--font-weight: 800;
  --text-title-1: clamp(1.875rem, 1.533rem + 1.522vw, 2.75rem);    /* 30 -> 44 */
  --text-title-1--line-height: 1.1;  --text-title-1--letter-spacing: -0.025em; --text-title-1--font-weight: 800;
  --text-title-2: clamp(1.5rem, 1.255rem + 1.087vw, 2.125rem);     /* 24 -> 34 */
  --text-title-2--line-height: 1.15; --text-title-2--letter-spacing: -0.02em;  --text-title-2--font-weight: 800;
  --text-title-3: clamp(1.125rem, 1.027rem + 0.435vw, 1.375rem);   /* 18 -> 22 */
  --text-title-3--line-height: 1.3;  --text-title-3--letter-spacing: -0.01em;  --text-title-3--font-weight: 600;
  --text-lead: clamp(1.0625rem, 1.014rem + 0.217vw, 1.1875rem);    /* 17 -> 19 */
  --text-lead--line-height: 1.55;
  --text-body: 1rem;        --text-body--line-height: 1.6;
  --text-body-sm: 0.875rem; --text-body-sm--line-height: 1.35;
  --text-label: 0.875rem;   --text-label--line-height: 1.2;  --text-label--letter-spacing: 0.005em; --text-label--font-weight: 600;
  --text-button: 0.9375rem; --text-button--line-height: 1.2; --text-button--font-weight: 600;
  --text-label-sm: 0.75rem; --text-label-sm--line-height: 1.2; --text-label-sm--letter-spacing: 0.01em; --text-label-sm--font-weight: 600;
  --text-tab: 0.6875rem;    --text-tab--line-height: 1.2;    --text-tab--font-weight: 600;
  --text-caption: 0.75rem;  --text-caption--line-height: 1.4;
  --text-overline: 0.75rem; --text-overline--line-height: 1.2; --text-overline--letter-spacing: 0.08em; --text-overline--font-weight: 600;
  --text-price: 1.125rem;   --text-price--line-height: 1;    --text-price--letter-spacing: -0.01em;
  --text-price-lg: 1.5rem;  --text-price-lg--line-height: 1; --text-price-lg--letter-spacing: -0.01em;
  --text-deal: 0.8125rem;   --text-deal--line-height: 1;
  --text-deal-lg: 1rem;     --text-deal-lg--line-height: 1;
  --text-stat: clamp(1.75rem, 1.359rem + 1.739vw, 2.75rem);        /* 28 -> 44 */
  --text-stat--line-height: 1; --text-stat--letter-spacing: -0.02em;
  --text-hand: clamp(1.125rem, 1.0272rem + 0.4348vw, 1.375rem);    /* 18 -> 22 */
  --text-hand--line-height: 1.1; --text-hand--letter-spacing: 0.01em;

  /* ---- Radii ---- */
  --radius-xs: 6px;        /* kbd, <mark>, tiny tags */
  --radius-tag: 8px;       /* cop stamps, Habis tag */
  --radius-thumb: 12px;    /* search thumbs, collage thumbs, list-row plate */
  --radius-plate: 14px;    /* product photo plate (card 20 - inset 6) */
  --radius-input: 14px;    /* inputs, textarea, select */
  --radius-tile: 22px;     /* category tiles / icon squircles */
  --radius-card: 20px;     /* product cards */
  --radius-card-lg: 24px;  /* brand cards, popovers, desktop dialog */
  --radius-sheet: 28px;    /* bottom-sheet top corners, CTA band */
  --radius-panel: 32px;    /* hero + section band panels */

  /* ---- Shadows (never animated: crossfade a pre-rendered layer instead) ---- */
  --shadow-xs: 0 1px 2px rgb(43 23 54 / 0.06);
  --shadow-card: 0 1px 2px rgb(43 23 54 / 0.05), 0 4px 12px -4px rgb(43 23 54 / 0.08);
  --shadow-card-hover: 0 2px 4px rgb(43 23 54 / 0.06), 0 14px 28px -10px rgb(255 111 181 / 0.38);
  --shadow-pop-sm: 2px 2px 0 0 #2B1736;
  --shadow-pop: 4px 4px 0 0 #2B1736;
  --shadow-pop-lg: 6px 6px 0 0 #2B1736;
  --shadow-sticker: 0 0 0 2px #FFFFFF, 0 3px 0 2px rgb(43 23 54 / 0.14);
  --shadow-diecut: 0 0 0 3px #FFFFFF, 0 8px 18px -6px rgb(43 23 54 / 0.3);
  --shadow-float: 0 18px 40px -12px rgb(43 23 54 / 0.35), 0 4px 12px -4px rgb(43 23 54 / 0.15);
  --shadow-sheet: 0 -12px 40px -12px rgb(43 23 54 / 0.25);
  --shadow-up: 0 -8px 24px -12px rgb(43 23 54 / 0.14);

  /* ---- Easing ---- */
  --ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1);     /* arrivals, settles */
  --ease-in-soft: cubic-bezier(0.55, 0, 1, 0.45);      /* departures */
  --ease-in-out-soft: cubic-bezier(0.65, 0, 0.35, 1);  /* moves, shimmer */
  --ease-pop: cubic-bezier(0.34, 1.56, 0.64, 1);       /* sticker overshoot */
  --ease-sine: cubic-bezier(0.37, 0, 0.63, 1);         /* ambient loops */

  /* ---- Animations (keyframes are defined top-level in §4 so they are always emitted) ---- */
  --animate-shimmer: shimmer 1.4s var(--ease-in-out-soft) infinite;
  --animate-ping-3: ping-soft 1.8s var(--ease-out-soft) 3;
  --animate-pop-in: pop-in 420ms var(--ease-pop) both;
  --animate-rise-in: rise-in 320ms var(--ease-out-soft) both;
  --animate-slap: slap 460ms var(--ease-pop) both;
  --animate-wiggle: wiggle 420ms var(--ease-out-soft);
  --animate-grow-x: grow-x 480ms var(--ease-out-soft) both;
  --animate-peek: peek 520ms var(--ease-pop) both;
  --animate-float: float 6s var(--ease-sine) infinite alternate;
  --animate-sway: sway 5.5s var(--ease-in-out-soft) infinite alternate;
  --animate-blink: blink 5.5s linear infinite;
  --animate-zzz: zzz 2.4s var(--ease-out-soft) infinite;
  --animate-spin-slow: spin 30s linear infinite;
  --animate-marquee: marquee var(--marquee-dur, 48s) linear infinite;
  --animate-dots: dots 900ms var(--ease-sine) infinite;
  --animate-indeterminate: indeterminate 1s var(--ease-in-out-soft) infinite;
}

@theme inline {
  /* next/font sets these variables on <html> (see src/app/fonts.ts) */
  --font-sans: var(--font-poppins), ui-sans-serif, system-ui, "Segoe UI", Roboto, "Noto Sans", sans-serif;
  --font-num: var(--font-fredoka), var(--font-poppins), ui-rounded, system-ui, sans-serif;
  --font-hand: var(--font-gochi), var(--font-fredoka), "Comic Sans MS", cursive;
}

/* =====================================================================
   2. NON-UTILITY TOKENS: durations, layout, z-index, gradients, patterns
   ===================================================================== */
:root {
  color-scheme: only light;
  --dur-tap: 90ms; --dur-fast: 150ms; --dur-base: 220ms; --dur-slow: 320ms;
  --dur-reveal: 420ms; --dur-hero: 700ms; --dur-roll: 900ms;

  --header-h: 56px; --awning-h: 20px; --tabbar-h: 64px; --filterbar-h: 52px;
  --gutter: 16px; --container: 1240px;
  --section-y: clamp(2.5rem, 1.522rem + 4.348vw, 5rem);

  --z-sticky: 30; --z-fab: 35; --z-header: 40; --z-popover: 50; --z-toast: 60; --z-fly: 70;

  --grad-gula-kapas:   linear-gradient(160deg, #FFE3F1 0%, #F1E6FF 48%, #DDF3FF 100%);
  --grad-bandung-fizz: linear-gradient(135deg, #FF8FC8 0%, #FF6FB5 50%, #FF9D7A 100%);
  --grad-mangga-lassi: linear-gradient(135deg, #FFE36E 0%, #FFC94D 50%, #FFA45B 100%);
  --grad-cendol:       linear-gradient(135deg, #D7F9EA 0%, #A8EED8 50%, #BFE6FF 100%);
  --grad-senja:        linear-gradient(170deg, #FFC2DD 0%, #D9C6FF 50%, #A9DCFF 100%);
  --grad-teh-tarik:    linear-gradient(180deg, #FFF8F1 0%, #F7E6D5 100%);
  --grad-santan-wash:  linear-gradient(180deg, #FFEFF6 0px, rgb(255 248 241 / 0) 360px);
  --grad-text-lokal:   linear-gradient(90deg, #D61F66 0%, #5F45E0 100%);
  --grad-kuih-lapis:   repeating-linear-gradient(90deg, #FF8FC8 0 12px, #FFD54F 12px 24px, #86DFAA 24px 36px, #BDA6FF 36px 48px);
  --grad-sunburst:     repeating-conic-gradient(from 0deg, #FFE88A 0deg 10deg, #FFF6CF 10deg 20deg);
  --grad-tier-cili:    linear-gradient(135deg, #FFE9E4 0%, #FFCFC3 100%);
  --grad-tier-daun:    linear-gradient(135deg, #E6F8EA 0%, #B9EBC7 100%);
  --grad-tier-ikon:    linear-gradient(135deg, #FFE7A3 0%, #FFC94D 55%, #F5A524 100%);
  --grad-shimmer:      linear-gradient(100deg, rgb(255 255 255 / 0) 20%, rgb(255 255 255 / 0.75) 50%, rgb(255 255 255 / 0) 80%);

  /* Pattern tiles (used as masks or backgrounds; see §3 utilities) */
  --pat-songket: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M16 3 29 16 16 29 3 16Z' fill='none' stroke='%23000' stroke-width='2'/%3E%3Ccircle cx='16' cy='16' r='2.5'/%3E%3C/svg%3E");
  --pat-batik: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='2.2'/%3E%3Cellipse cx='24' cy='16.5' rx='2.6' ry='5'/%3E%3Cellipse cx='24' cy='31.5' rx='2.6' ry='5'/%3E%3Cellipse cx='16.5' cy='24' rx='5' ry='2.6'/%3E%3Cellipse cx='31.5' cy='24' rx='5' ry='2.6'/%3E%3Ccircle cx='0' cy='0' r='3'/%3E%3Ccircle cx='48' cy='0' r='3'/%3E%3Ccircle cx='0' cy='48' r='3'/%3E%3Ccircle cx='48' cy='48' r='3'/%3E%3Ccircle cx='12' cy='12' r='1.2'/%3E%3Ccircle cx='36' cy='12' r='1.2'/%3E%3Ccircle cx='12' cy='36' r='1.2'/%3E%3Ccircle cx='36' cy='36' r='1.2'/%3E%3C/svg%3E");
  --pat-rebung: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='14' viewBox='0 0 24 14'%3E%3Cpath d='M0 14 6 2l6 12z' fill='%23FFC2D6'/%3E%3Cpath d='M12 14l6-12 6 12z' fill='%23BDA6FF'/%3E%3Ccircle cx='12' cy='11' r='1.6' fill='%23FFD54F'/%3E%3Ccircle cx='0' cy='11' r='1.6' fill='%23FFD54F'/%3E%3Ccircle cx='24' cy='11' r='1.6' fill='%23FFD54F'/%3E%3C/svg%3E");
}
@media (min-width: 640px)  { :root { --gutter: 24px; } }
@media (min-width: 1024px) { :root { --header-h: 72px; --awning-h: 26px; --tabbar-h: 0px; --gutter: 32px; } }

/* Category + tier scoping: set data-cat / data-tier on any wrapper, then use bg-(--cat-tint) etc. */
[data-cat="beauty"]      { --cat-tint: var(--color-beauty-tint);      --cat-mid: var(--color-beauty-mid);      --cat-pop: var(--color-beauty-pop);      --cat-ink: var(--color-beauty-ink); }
[data-cat="fashion"]     { --cat-tint: var(--color-fashion-tint);     --cat-mid: var(--color-fashion-mid);     --cat-pop: var(--color-fashion-pop);     --cat-ink: var(--color-fashion-ink); }
[data-cat="accessories"] { --cat-tint: var(--color-accessories-tint); --cat-mid: var(--color-accessories-mid); --cat-pop: var(--color-accessories-pop); --cat-ink: var(--color-accessories-ink); }
[data-cat="food"]        { --cat-tint: var(--color-food-tint);        --cat-mid: var(--color-food-mid);        --cat-pop: var(--color-food-pop);        --cat-ink: var(--color-food-ink); }
[data-cat="drinks"]      { --cat-tint: var(--color-drinks-tint);      --cat-mid: var(--color-drinks-mid);      --cat-pop: var(--color-drinks-pop);      --cat-ink: var(--color-drinks-ink); }
[data-cat="home"]        { --cat-tint: var(--color-home-tint);        --cat-mid: var(--color-home-mid);        --cat-pop: var(--color-home-pop);        --cat-ink: var(--color-home-ink); }
[data-cat="health"]      { --cat-tint: var(--color-health-tint);      --cat-mid: var(--color-health-mid);      --cat-pop: var(--color-health-pop);      --cat-ink: var(--color-health-ink); }
[data-cat="kids"]        { --cat-tint: var(--color-kids-tint);        --cat-mid: var(--color-kids-mid);        --cat-pop: var(--color-kids-pop);        --cat-ink: var(--color-kids-ink); }
[data-cat="tech"]        { --cat-tint: var(--color-tech-tint);        --cat-mid: var(--color-tech-mid);        --cat-pop: var(--color-tech-pop);        --cat-ink: var(--color-tech-ink); }
[data-cat="crafts"]      { --cat-tint: var(--color-crafts-tint);      --cat-mid: var(--color-crafts-mid);      --cat-pop: var(--color-crafts-pop);      --cat-ink: var(--color-crafts-ink); }
[data-cat="lifestyle"]   { --cat-tint: var(--color-lifestyle-tint);   --cat-mid: var(--color-lifestyle-mid);   --cat-pop: var(--color-lifestyle-pop);   --cat-ink: var(--color-lifestyle-ink); }
[data-tier="cili-padi"]  { --tier-tint: var(--color-cili-tint); --tier-pop: var(--color-cili-pop); --tier-ink: var(--color-cili-ink); --tier-grad: var(--grad-tier-cili); }
[data-tier="naik-daun"]  { --tier-tint: var(--color-daun-tint); --tier-pop: var(--color-daun-pop); --tier-ink: var(--color-daun-ink); --tier-grad: var(--grad-tier-daun); }
[data-tier="ikon"]       { --tier-tint: var(--color-ikon-tint); --tier-pop: var(--color-ikon-pop); --tier-ink: var(--color-ikon-ink); --tier-grad: var(--grad-tier-ikon); }

/* =====================================================================
   3. BASE
   ===================================================================== */
@layer base {
  html {
    background: var(--color-santan); color: var(--color-ink);
    font-synthesis: none; -webkit-tap-highlight-color: transparent;
    scroll-padding-top: calc(var(--header-h) + var(--filterbar-h) + 12px);
    scroll-padding-bottom: calc(var(--tabbar-h) + 16px);
  }
  body {
    min-height: 100dvh; font-family: var(--font-sans);
    background: var(--grad-santan-wash), var(--color-santan); background-repeat: no-repeat;
    -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
  }
  h1, h2, h3, h4 { text-wrap: balance; }
  p, li, dd { text-wrap: pretty; }
  :focus-visible { outline: 3px solid var(--color-telang); outline-offset: 2px; }
  .on-ink :focus-visible { outline-color: var(--color-mangga); }
  ::selection { background: var(--color-mangga); color: var(--color-ink); }
  mark { background: var(--color-mangga-tint); color: var(--color-ink); border-radius: 4px; padding-inline: 1px; }
  html:has(dialog[open]) { overflow: hidden; }     /* Lenis autoToggle stops itself */
  dialog::backdrop { background: rgb(43 23 54 / 0.45); }
  img { -webkit-user-drag: none; }
}

/* =====================================================================
   4. KEYFRAMES (top-level so they are always emitted)
   ===================================================================== */
@keyframes shimmer   { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
@keyframes ping-soft { from { transform: scale(1); opacity: .55; } to { transform: scale(2.6); opacity: 0; } }
@keyframes pop-in    { from { opacity: 0; transform: scale(.6) rotate(-12deg); } }          /* "to" = element's own transform */
@keyframes rise-in   { from { opacity: 0; transform: translateY(10px); } }
@keyframes slap      { from { opacity: 0; transform: scale(1.3) rotate(var(--r-from, -14deg)); } to { opacity: 1; transform: scale(1) rotate(var(--r, -3deg)); } }
@keyframes wiggle    { 25% { rotate: -8deg; } 75% { rotate: 6deg; } }
@keyframes grow-x    { from { transform: scaleX(0); } }
@keyframes peek      { from { transform: translateY(105%); } to { transform: translateY(0); } }
@keyframes float     { from { translate: 0 0; } to { translate: 0 -8px; } }
@keyframes sway      { from { rotate: -4deg; translate: 0 0; } to { rotate: 4deg; translate: 0 -6px; } }
@keyframes blink     { 0%, 92%, 100% { transform: scaleY(1); } 95% { transform: scaleY(.1); } }
@keyframes zzz       { 0% { transform: translate(0, 0) scale(.6); opacity: 0; } 30% { opacity: 1; } 100% { transform: translate(10px, -28px) scale(1.1); opacity: 0; } }
@keyframes spin      { to { transform: rotate(360deg); } }
@keyframes marquee   { to { transform: translate3d(-50%, 0, 0); } }
@keyframes dots      { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-4px); } }
@keyframes indeterminate { from { transform: translateX(-100%); } to { transform: translateX(250%); } }
@keyframes drift-a   { from { transform: translate3d(-8%, -6%, 0) scale(1); } to { transform: translate3d(10%, 8%, 0) scale(1.15); } }
@keyframes drift-b   { from { transform: translate3d(6%, 4%, 0) scale(1.1); } to { transform: translate3d(-12%, -8%, 0) scale(.9); } }
@keyframes drift-c   { from { transform: translate3d(0, 10%, 0) scale(.95); } to { transform: translate3d(8%, -10%, 0) scale(1.12); } }
@keyframes fade-in   { from { opacity: 0; } }
@keyframes odo-roll  { from { transform: translateY(0); } }
@keyframes particle  { 0% { transform: translate(0, 0) scale(.5); opacity: 1; } 60% { opacity: 1; } 100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; } }
@keyframes heart-pop { 0% { transform: scale(.4); } 55% { transform: scale(1.25); } 100% { transform: scale(1); } }
@keyframes ring-out  { from { transform: scale(.6); opacity: .8; } to { transform: scale(1.6); opacity: 0; } }
@keyframes vt-fade   { from { opacity: 0; } }
@keyframes vt-slide  { from { translate: var(--vt-x) 0; } }
@keyframes vt-rise   { from { translate: 0 8px; } }

/* =====================================================================
   5. UTILITIES (@utility = tree-shaken, variant-aware)
   ===================================================================== */
@utility bg-gula-kapas   { background-image: var(--grad-gula-kapas); }
@utility bg-bandung-fizz { background-image: var(--grad-bandung-fizz); }
@utility bg-mangga-lassi { background-image: var(--grad-mangga-lassi); }
@utility bg-cendol       { background-image: var(--grad-cendol); }
@utility bg-senja        { background-image: var(--grad-senja); }
@utility bg-teh-tarik    { background-image: var(--grad-teh-tarik); }
@utility bg-kuih-lapis   { background-image: var(--grad-kuih-lapis); }
@utility bg-sunburst     { background-image: var(--grad-sunburst); }
@utility bg-tier         { background-image: var(--tier-grad); }
@utility bg-cover-cat    { background-image: linear-gradient(160deg, var(--cat-tint, #FFE4F1) 0%, #FFFFFF 78%); } /* inline: must resolve --cat-tint at the element */
@utility text-grad-lokal {
  background-image: var(--grad-text-lokal); -webkit-background-clip: text; background-clip: text; color: transparent;
  padding-inline-end: .04em; /* avoid clipping the last glyph */
  @media (forced-colors: active) { color: CanvasText; background: none; }
}
@utility no-scrollbar { scrollbar-width: none; &::-webkit-scrollbar { display: none; } }
@utility edge-fade {
  -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 var(--fade, 24px), #000 calc(100% - var(--fade, 24px)), transparent);
          mask-image: linear-gradient(90deg, transparent 0, #000 var(--fade, 24px), #000 calc(100% - var(--fade, 24px)), transparent);
}
@utility stretched-link { &::after { content: ""; position: absolute; inset: 0; z-index: 1; } }
@utility container-page { width: 100%; max-width: var(--container); margin-inline: auto; padding-inline: var(--gutter); }
@utility hand { font-family: var(--font-hand); font-weight: 400; rotate: -4deg; color: var(--color-telang); }

/* =====================================================================
   6. COMPONENT CLASSES (always emitted)
   ===================================================================== */
@layer components {
  /* ---- 6.1 Pop press: hard shadow is a separate layer; only the face moves (transform-only) ---- */
  .pop { position: relative; isolation: isolate; display: inline-flex; border-radius: var(--pop-radius, 9999px); }
  .pop::before { content: ""; position: absolute; inset: 0; z-index: -1; border-radius: inherit;
    background: var(--pop-color, var(--color-ink)); transform: translate(var(--pop-offset, 4px), var(--pop-offset, 4px)); }
  .pop > .pop-face { display: flex; flex: 1; align-items: center; justify-content: center; gap: 8px; height: 100%;
    border: 2px solid var(--color-ink); border-radius: inherit; transition: transform 160ms var(--ease-out-soft); }
  @media (hover: hover) and (pointer: fine) { .pop:hover > .pop-face { transform: translate(-2px, -2px); } }
  .pop:active > .pop-face { transform: translate(var(--pop-offset, 4px), var(--pop-offset, 4px)); transition-duration: 90ms; }
  .pop:focus-visible { outline: none; }
  .pop:focus-visible > .pop-face { outline: 3px solid var(--color-telang); outline-offset: 3px; }
  .pop[aria-disabled="true"]::before, .pop:disabled::before { display: none; }

  /* ---- 6.2 Awning (header, brand cards, brand profile) ---- */
  .awning { --w: 16px; --band: 10px; --r: 8px; height: var(--awning-h, 20px);
    background: repeating-linear-gradient(90deg, var(--awning, var(--color-bandung)) 0 var(--w), #FFFFFF var(--w) calc(var(--w) * 2));
    -webkit-mask: linear-gradient(#000 0 0) top / 100% var(--band) no-repeat,
                  radial-gradient(circle var(--r) at calc(var(--w) / 2) var(--band), #000 98%, #0000 100%) 0 0 / var(--w) 100% repeat-x;
            mask: linear-gradient(#000 0 0) top / 100% var(--band) no-repeat,
                  radial-gradient(circle var(--r) at calc(var(--w) / 2) var(--band), #000 98%, #0000 100%) 0 0 / var(--w) 100% repeat-x; }
  @media (min-width: 1024px) { .awning { --w: 20px; --band: 14px; --r: 10px; } }
  .awning-wrap { filter: drop-shadow(0 2px 0 var(--color-ink)); border-top: 2px solid var(--color-ink); } /* static filter: allowed */

  /* ---- 6.3 Hero mesh: radial blobs, transform-only drift, no blur ---- */
  .mesh { position: absolute; inset: 0; z-index: -1; overflow: clip; pointer-events: none; contain: strict;
    background: radial-gradient(40% 35% at 85% 15%, rgb(255 213 79 / .30), transparent 70%),
                radial-gradient(45% 40% at 10% 90%, rgb(138 208 255 / .35), transparent 70%), var(--grad-gula-kapas); }
  .mesh-blob { position: absolute; width: var(--s); aspect-ratio: 1; border-radius: 50%; will-change: transform;
    background: radial-gradient(closest-side, rgb(var(--c) / var(--a, .55)), rgb(var(--c) / 0)); }
  .mesh-blob:nth-child(1) { --s: min(62vmax, 820px); --c: 255 143 200; left: -22%; top: -28%; animation: drift-a 18s var(--ease-sine) infinite alternate; }
  .mesh-blob:nth-child(2) { --s: min(66vmax, 860px); --c: 189 166 255; --a: .5; right: -32%; top: 8%; animation: drift-b 23s var(--ease-sine) infinite alternate; }
  .mesh-blob:nth-child(3) { --s: min(48vmax, 640px); --c: 255 213 79; --a: .4; left: 18%; bottom: -36%; animation: drift-c 29s var(--ease-sine) infinite alternate; }
  @media (max-width: 767px) { .mesh-blob:nth-child(3) { display: none; } }
  [data-paused] .mesh-blob, [data-paused] .ambient { animation-play-state: paused; }

  /* ---- 6.4 Skeleton: one shimmer per block, starts after 400ms, travels as a wave via --i ---- */
  .skeleton { position: relative; overflow: hidden; isolation: isolate; background: var(--skel, var(--color-kapas)); }
  .skeleton::after { content: ""; position: absolute; inset: 0; transform: translateX(-100%); background: var(--grad-shimmer);
    animation: var(--animate-shimmer); animation-delay: calc(400ms + var(--i, 0) * 80ms); }
  .bone { display: block; border-radius: 9999px; background: var(--color-kapas); }

  /* ---- 6.5 Stickers & badges ---- */
  .deal-1 { display: inline-flex; align-items: center; height: 22px; padding-inline: 8px; border-radius: 9999px;
    background: var(--color-bandung-tint); color: var(--color-bandung-pekat); font: 600 var(--text-deal)/1 var(--font-num); }
  .deal-2 { display: inline-flex; align-items: center; height: 24px; padding-inline: 9px; border-radius: 9999px; rotate: -3deg;
    background: var(--color-bandung); color: var(--color-ink); border: 1.5px solid var(--color-ink); box-shadow: var(--shadow-sticker);
    font: 600 var(--text-deal)/1 var(--font-num); }
  .deal-3 { position: relative; isolation: isolate; display: grid; place-items: center; width: 56px; aspect-ratio: 1; rotate: -10deg;
    color: var(--color-ink); font: 600 var(--text-deal-lg)/1 var(--font-num); }
  .deal-3 > svg { position: absolute; inset: -6px; width: calc(100% + 12px); height: calc(100% + 12px); z-index: -1; overflow: visible; }
  .baru-je { display: inline-flex; align-items: center; gap: 4px; height: 22px; padding-inline: 8px; border-radius: 9999px; rotate: 2deg;
    background: var(--color-pandan); color: var(--color-ink); border: 1.5px solid var(--color-ink); box-shadow: var(--shadow-sticker);
    font: 600 11px/1 var(--font-sans); letter-spacing: .06em; text-transform: uppercase; }
  .baru { display: inline-flex; align-items: center; height: 22px; padding-inline: 8px; border-radius: 9999px;
    background: var(--color-pandan-tint); color: var(--color-pandan-pekat);
    font: 600 11px/1 var(--font-sans); letter-spacing: .06em; text-transform: uppercase; }
  .habis { display: inline-flex; align-items: center; height: 20px; padding-inline: 6px; border-radius: var(--radius-xs);
    background: var(--color-ink); color: #FFFFFF; font: 600 11px/1 var(--font-sans); }
  .cop { display: inline-flex; align-items: center; gap: 4px; height: 24px; padding: 0 9px 0 6px; border-radius: var(--radius-tag);
    background: var(--tier-tint); color: var(--tier-ink); font: 600 12px/1 var(--font-sans);
    outline: 1.5px dashed color-mix(in oklab, currentColor 55%, transparent); outline-offset: -4px; }
  .cop-lg { height: 36px; padding: 0 14px 0 10px; font-size: 14px; background: var(--tier-grad); color: var(--color-ink);
    border: 2px solid var(--color-ink); box-shadow: var(--shadow-sticker); rotate: -3deg; outline-offset: -6px; }
  .count-bubble { display: inline-grid; place-items: center; min-width: 18px; height: 18px; padding-inline: 4px; border-radius: 9999px;
    background: var(--color-mangga); color: var(--color-ink); border: 1.5px solid var(--color-ink); font: 600 11px/1 var(--font-num); }
  .live-dot { position: relative; width: 8px; height: 8px; border-radius: 50%; background: var(--dot, var(--color-live)); }
  .live-dot[data-ping]::after { content: ""; position: absolute; inset: 0; border-radius: inherit; background: inherit; animation: var(--animate-ping-3); }

  /* ---- 6.6 Photo plate: makes mixed store photos look like one shelf ---- */
  .plate { position: relative; aspect-ratio: 1; overflow: hidden; isolation: isolate; border-radius: var(--radius-plate);
    background: var(--cat-tint, var(--color-kapas)); }
  .plate > img { width: 100%; height: 100%; transition: opacity 240ms var(--ease-out-soft), scale 360ms var(--ease-out-soft); }
  /* fade-in only when JS is running (reveal-ready) and the image is below the fold; no-JS and eager images are always visible */
  .reveal-ready .plate:not([data-eager]) > img:not([data-loaded]) { opacity: 0; }
  .plate > img[data-fit="cover"]   { object-fit: cover; object-position: 50% 40%; }
  .plate > img[data-fit="contain"] { object-fit: contain; padding: 8%; mix-blend-mode: multiply; }
  .plate:has(> img[data-fit="contain"])::before { content: ""; position: absolute; left: 20%; right: 20%; bottom: 7%; height: 9%; z-index: -1;
    background: radial-gradient(closest-side, rgb(43 23 54 / .16), transparent); }  /* floor shadow */
  .plate::after { content: ""; position: absolute; inset: 0; border-radius: inherit; box-shadow: inset 0 0 0 1px rgb(43 23 54 / .06); pointer-events: none; }
  @media (hover: hover) and (pointer: fine) { .card:hover .plate > img[data-fit="cover"] { scale: 1.04; } }

  /* ---- 6.7 Product card hover layer (shadow crossfade, never animate box-shadow) ---- */
  .card { position: relative; isolation: isolate; transition: transform 180ms var(--ease-out-soft); contain: layout paint; }
  .card::before { content: ""; position: absolute; inset: 0; z-index: -1; border-radius: inherit; box-shadow: var(--shadow-card-hover);
    opacity: 0; transition: opacity 180ms var(--ease-out-soft); }
  @media (hover: hover) and (pointer: fine) { .card:hover { transform: translateY(-3px); } .card:hover::before { opacity: 1; } }
  .card:active { transform: scale(.98); transition-duration: 90ms; }
  .card:has(.stretched-link:focus-visible) { outline: 3px solid var(--color-telang); outline-offset: 2px; }
  .card .stretched-link:focus-visible { outline: none; }

  /* ---- 6.8 Odometer: fixed-width digit cells (Poppins/Fredoka ship no tnum) ---- */
  .odo { display: inline-flex; font-family: var(--font-num); font-weight: 600; }
  .odo-d { display: inline-block; width: .62em; height: 1.1em; overflow: hidden; text-align: center; }
  .odo-d > span { display: flex; flex-direction: column; transform: translateY(calc(var(--d) * -1.1em));
    transition: transform var(--dur-roll) var(--ease-out-soft); }
  .odo-d i { display: block; height: 1.1em; line-height: 1.1em; font-style: normal; }
  .odo[data-roll="intro"] .odo-d > span { animation: odo-roll var(--dur-roll) var(--ease-out-soft) calc(var(--p, 0) * 70ms) both; }
  .reveal-ready [data-reveal]:not(.is-in) .odo[data-roll="reveal"] .odo-d > span { transform: translateY(0); transition: none; }
  html[data-intro="done"] .odo[data-roll="intro"] .odo-d > span { animation: none; }

  /* ---- 6.9 Marquee (live ticker) ---- */
  .marquee { overflow: hidden; -webkit-mask-image: linear-gradient(90deg, #0000, #000 32px, #000 calc(100% - 32px), #0000);
             mask-image: linear-gradient(90deg, #0000, #000 32px, #000 calc(100% - 32px), #0000); }
  .marquee-track { display: flex; gap: 32px; width: max-content; will-change: transform; animation: var(--animate-marquee); }
  .marquee:hover .marquee-track, .marquee:focus-within .marquee-track,
  .marquee[data-paused] .marquee-track, [data-paused] .marquee-track { animation-play-state: paused; }

  /* ---- 6.10 Patterns & strips ---- */
  .pucuk { height: 14px; background: var(--color-ink) var(--pat-rebung) repeat-x bottom / 24px 14px; }
  .kuih-strip { height: 6px; background-image: var(--grad-kuih-lapis); }
  .songket { position: absolute; inset: 0; pointer-events: none; background: var(--cat-pop, var(--color-bandung)); opacity: var(--pat-o, .28);
    -webkit-mask: var(--pat-songket) 0 0 / 32px 32px repeat; mask: var(--pat-songket) 0 0 / 32px 32px repeat; }
  .batik { position: absolute; inset: 0; pointer-events: none; background: var(--cat-pop, var(--color-bandung)); opacity: var(--pat-o, .3);
    -webkit-mask: var(--pat-batik) 0 0 / 48px 48px repeat; mask: var(--pat-batik) 0 0 / 48px 48px repeat; }

  /* ---- 6.11 Save heart particles (mounted on click, removed on animationend) ---- */
  .particle { position: absolute; left: 50%; top: 50%; width: 8px; height: 8px; margin: -4px 0 0 -4px; pointer-events: none;
    animation: particle 520ms var(--ease-out-soft) calc(var(--k, 0) * 15ms) both; }
  .heart-ring { position: absolute; inset: -2px; border-radius: 50%; border: 2px solid var(--color-jambu); pointer-events: none;
    animation: ring-out 360ms var(--ease-out-soft) both; }
  .heart-fill { animation: heart-pop 380ms var(--ease-pop) both; }

  /* ---- 6.12 Native <dialog> + popover enter/exit (zero JS animation) ---- */
  dialog.sheet, dialog.modal, [popover].pop-panel {
    opacity: 1; transform: none;
    transition: opacity 180ms var(--ease-out-soft), transform 280ms var(--ease-out-soft),
                overlay 280ms allow-discrete, display 280ms allow-discrete;
    @starting-style { opacity: 0; transform: var(--enter-from, translateY(-8px) scale(.97)); }
  }
  dialog.sheet { --enter-from: translateY(100%); }
  dialog.sheet:not([open]), dialog.modal:not([open]), [popover].pop-panel:not(:popover-open) {
    opacity: 0; transform: var(--exit-to, translateY(-6px)); transition-duration: 120ms, 200ms, 200ms, 200ms; transition-timing-function: var(--ease-in-soft); }
  dialog.sheet:not([open]) { --exit-to: translateY(100%); }
  dialog::backdrop { transition: opacity 180ms var(--ease-out-soft), overlay 180ms allow-discrete, display 180ms allow-discrete; }
  dialog[open]::backdrop { opacity: 1; @starting-style { opacity: 0; } }

  /* ---- 6.13 Loading dots + indeterminate bar ---- */
  .dots > i { display: inline-block; width: 5px; height: 5px; margin-inline: 1px; border-radius: 50%; background: currentColor; animation: var(--animate-dots); }
  .dots > i:nth-child(2) { animation-delay: 120ms; } .dots > i:nth-child(3) { animation-delay: 240ms; }
  .progress-indeterminate { position: relative; height: 3px; overflow: hidden; }
  .progress-indeterminate::after { content: ""; position: absolute; inset: 0; width: 40%; background-image: var(--grad-kuih-lapis); animation: var(--animate-indeterminate); }

  /* ---- 6.14 One-shot hero intro (CSS, runs before hydration, once per session) ---- */
  .intro-rise  { animation: rise-in 320ms var(--ease-out-soft) var(--d, 0ms) both; }
  .intro-slap  { animation: slap 460ms var(--ease-pop) var(--d, 0ms) both; }
  .intro-swash { transform-origin: left; animation: grow-x 520ms var(--ease-out-soft) var(--d, 120ms) both; }
  .intro-peek  { animation: peek 520ms var(--ease-pop) var(--d, 650ms) both; }
  html[data-intro="done"] :is(.intro-rise, .intro-slap, .intro-swash, .intro-peek) { animation: none; }
}

/* =====================================================================
   7. SCROLL REVEAL (one IntersectionObserver: src/components/motion/reveal-observer.tsx)
   ===================================================================== */
.reveal-ready [data-reveal]:not(.is-in) { opacity: 0; translate: 0 16px; }
.reveal-ready [data-reveal].is-in {
  transition: opacity var(--dur-reveal) var(--ease-out-soft), translate var(--dur-reveal) var(--ease-out-soft);
  transition-delay: calc(min(var(--i, 0), 5) * 60ms);
}

/* =====================================================================
   8. VIEW TRANSITIONS (React <ViewTransition> + <Link transitionTypes>)
   ===================================================================== */
::view-transition { pointer-events: none; }
::view-transition-group(site-header), ::view-transition-group(tab-bar) { animation: none; z-index: 100; }
::view-transition-old(site-header), ::view-transition-old(tab-bar) { display: none; }
::view-transition-new(site-header), ::view-transition-new(tab-bar) { animation: none; }
::view-transition-old(.nav-forward) { --vt-x: -32px; animation: 120ms var(--ease-in-soft) both vt-fade reverse, 280ms var(--ease-in-out-soft) both vt-slide reverse; }
::view-transition-new(.nav-forward) { --vt-x: 32px;  animation: 200ms var(--ease-out-soft) 100ms both vt-fade, 300ms var(--ease-out-soft) both vt-slide; }
::view-transition-old(.nav-back)    { --vt-x: 32px;  animation: 120ms var(--ease-in-soft) both vt-fade reverse, 280ms var(--ease-in-out-soft) both vt-slide reverse; }
::view-transition-new(.nav-back)    { --vt-x: -32px; animation: 200ms var(--ease-out-soft) 100ms both vt-fade, 300ms var(--ease-out-soft) both vt-slide; }
::view-transition-old(.nav-tab)     { animation: 120ms var(--ease-in-soft) both vt-fade reverse; }
::view-transition-new(.nav-tab)     { animation: 180ms var(--ease-out-soft) 60ms both vt-fade; }
::view-transition-old(.skeleton-out){ animation: 120ms var(--ease-in-soft) both vt-fade reverse; }
::view-transition-new(.content-in)  { animation: 200ms var(--ease-out-soft) 80ms both vt-fade, 280ms var(--ease-out-soft) both vt-rise; }
::view-transition-old(results), ::view-transition-new(results) { animation-duration: 180ms; }
::view-transition-group(.morph)     { animation-duration: 340ms; animation-timing-function: var(--ease-out-soft); }

/* =====================================================================
   9. REDUCED MOTION (OS setting OR in-site "Kurangkan animasi" toggle)
   ===================================================================== */
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after { animation-duration: 1ms !important; animation-delay: 0ms !important; animation-iteration-count: 1 !important; transition-duration: 1ms !important; transition-delay: 0ms !important; }
  .marquee-track { animation: none !important; } .marquee { overflow-x: auto; }
  .mesh-blob, .ambient, .skeleton::after, .live-dot::after { animation: none !important; }
  .reveal-ready [data-reveal]:not(.is-in) { translate: none; }
  ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation-duration: 0s !important; animation-delay: 0s !important; }
}
html[data-motion="reduce"] *, html[data-motion="reduce"] ::before, html[data-motion="reduce"] ::after {
  animation-duration: 1ms !important; animation-delay: 0ms !important; animation-iteration-count: 1 !important; transition-duration: 1ms !important; transition-delay: 0ms !important; }
html[data-motion="reduce"] :is(.marquee-track, .mesh-blob, .ambient) { animation: none !important; }
html[data-motion="reduce"] .skeleton::after, html[data-motion="reduce"] .live-dot::after { animation: none !important; }
html[data-motion="reduce"] .marquee { overflow-x: auto; }
html[data-motion="reduce"].reveal-ready [data-reveal]:not(.is-in) { translate: none; }
html[data-motion="reduce"]::view-transition-group(*), html[data-motion="reduce"]::view-transition-old(*), html[data-motion="reduce"]::view-transition-new(*) { animation-duration: 0s !important; }

/* Hide-on-print & high-contrast niceties */
@media (prefers-contrast: more) { :root { --color-garis: #8C7B98; } .songket, .batik, .mesh-blob { display: none; } }
@media print { .mesh, .marquee, nav[aria-label="Navigasi utama"] { display: none !important; } }
```

## Appendix B — `src/lib/motion.ts`

Passes `tsc --strict` against the installed `motion` 14.0.0 types.

```ts
// src/lib/motion.ts — motion tokens + shared variants for LokalLah! ("Kedai Oyen: Comel & Laju")
// Import only from "motion/react". Components render `m.*` under <LazyMotion features={domAnimation} strict>.
// Never use `layout` / `layoutId` (not in domAnimation). Animate transform + opacity only.
import { arc, stagger, type Transition, type Variants } from "motion/react";

/** Seconds. CSS mirror: --dur-* in globals.css. */
export const dur = {
  tap: 0.09, // press-in feedback
  fast: 0.15, // hover, chip toggle, overlay fade, exits
  base: 0.22, // popovers, crossfades, tab panels
  slow: 0.32, // enters: toasts, sheets, filter pills
  reveal: 0.42, // in-view rises
  hero: 0.7, // hero pieces, rail nudge hint
  roll: 0.9, // odometer roll
} as const;

/** Cubic beziers. CSS mirror: --ease-* tokens. */
export const ease = {
  out: [0.22, 1, 0.36, 1], // arrivals, settles
  in: [0.55, 0, 1, 0.45], // departures
  inOut: [0.65, 0, 0.35, 1], // moves
  pop: [0.34, 1.56, 0.64, 1], // sticker overshoot
  sine: [0.37, 0, 0.63, 1], // ambient
} as const;

/** Two materials: PAPER (stickers, hearts, stamps) bounces; FURNITURE (sheets, pages, panels) glides. */
export const spring = {
  snappy: { type: "spring", visualDuration: 0.22, bounce: 0.15 }, // indicators, chips, header, FAB
  bouncy: { type: "spring", visualDuration: 0.36, bounce: 0.45 }, // paper: heart, stickers, toasts, badges
  wobble: { type: "spring", visualDuration: 0.5, bounce: 0.55 }, // tier cop slam, Oyen reactions
  gentle: { type: "spring", visualDuration: 0.4, bounce: 0.08 }, // furniture: sheets, modal, big panels
} as const satisfies Record<string, Transition>;

/** px */
export const dist = { micro: 8, reveal: 16, rail: 24, toast: 16, lift: 3, route: 32 } as const;

/** Stagger gaps (s). Never animate more than MAX_STAGGERED children in one group. */
export const gap = { rail: 0.045, group: 0.06, hero: 0.07, particles: 0.015 } as const;
export const MAX_STAGGERED = 6;

/** In-view animations run once. */
export const viewportOnce = { once: true, amount: 0.3, margin: "0px 0px -10% 0px" } as const;

/** Default for <MotionConfig transition>. */
export const defaultTransition: Transition = { duration: 0.36, ease: ease.out };

/* ------------------------------------------------------------------ */
/* Shared variants (state names are always "hidden" -> "show" [-> "exit"]) */
/* ------------------------------------------------------------------ */

/** Section headers, feature blocks. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: dist.reveal },
  show: { opacity: 1, y: 0, transition: { duration: dur.reveal, ease: ease.out } },
};

/** Opacity only (tab panels, result swaps, anything big). */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: dur.base, ease: ease.out } },
  exit: { opacity: 0, transition: { duration: dur.fast, ease: ease.in } },
};

/** Rail items (first 6 only): "there's more to the side". */
export const slideInX: Variants = {
  hidden: { opacity: 0, x: dist.rail },
  show: { opacity: 1, x: 0, transition: { duration: dur.slow + 0.04, ease: ease.out } },
};

/** Parent for any staggered group. Uses Motion 14 `delayChildren: stagger()` (staggerChildren is deprecated). */
export const staggerContainer = (interval: number = gap.group, startDelay = 0): Variants => ({
  hidden: {},
  show: { transition: { delayChildren: stagger(interval, { startDelay }) } },
});

/** Paper pop: stickers, badges, "Check" in chips. `custom` = resting rotation in degrees. */
export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -12 },
  show: (rotate: number = 0) => ({ opacity: 1, scale: 1, rotate, transition: spring.bouncy }),
  exit: { opacity: 0, scale: 0.85, transition: { duration: dur.fast, ease: ease.in } },
};

/** Tier "cop" stamp slam: an official stage is stamped. Pair with an ink ring scaling .6 -> 1.25, opacity .5 -> 0. */
export const stampIn: Variants = {
  hidden: { opacity: 0, scale: 1.35, rotate: -14 },
  show: { opacity: 1, scale: 1, rotate: -3, transition: spring.wobble },
};

/** One-shot wiggle: "this is tappable" (tier badge, monogram on card hover). Trigger with animate="wiggle". */
export const wiggle: Variants = {
  rest: { rotate: 0 },
  wiggle: { rotate: [0, -8, 6, -3, 0], transition: { duration: 0.5, ease: ease.out } },
};

/** Heart save: squash then overshoot; the fill swaps at the squash frame. */
export const heartSave: Variants = {
  off: { scale: 1, transition: spring.gentle },
  on: { scale: [1, 0.7, 1.3, 1], transition: { duration: 0.42, times: [0, 0.25, 0.65, 1], ease: ease.out } },
};

/** Catch bump on the Simpan target when the flying heart lands. */
export const bump: Variants = {
  rest: { scale: 1 },
  bump: { scale: [1, 1.22, 1], transition: { duration: 0.32, ease: ease.out } },
};

/** Toasts (AnimatePresence, one at a time). */
export const toast: Variants = {
  hidden: { opacity: 0, y: dist.toast, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: spring.bouncy },
  exit: { opacity: 0, y: 8, transition: { duration: 0.14, ease: ease.in } },
};

/** Active-filter pills and other removable chips. Siblings snap (no layout animation). */
export const chipPresence: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: spring.snappy },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.12, ease: ease.in } },
};

/** FAB / back-to-top. */
export const fab: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 8 },
  show: { opacity: 1, scale: 1, y: 0, transition: spring.snappy },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.12, ease: ease.in } },
};

/** Mobile one-time rail swipe hint (once per session, after the cascade). */
export const nudgeX: Transition = { duration: dur.hero, ease: ease.inOut, delay: 0.6 };
export const nudgeKeyframes = { x: [0, -28, 0] } as const;

/* ------------------------------------------------------------------ */
/* Fly-to-Simpan (first 3 saves per session; afterwards bump + count only) */
/* ------------------------------------------------------------------ */
export const FLY_TEACH_LIMIT = 3;
export const flightPath = arc({ strength: 0.5, peak: 0.35, rotate: 0.3 }); // create once, at module scope
export const flightTransition: Transition = { duration: 0.56, ease: ease.out, path: flightPath };
/** Usage: animate(ghostEl, { x: dx, y: dy, scale: 0.6 }, flightTransition) */
```

## Appendix C — `src/app/fonts.ts` and layout wiring

Poppins is the main font (`--font-sans`). Fredoka 600 and Gochi Hand 400 are the minor fonts (`--font-num`, `--font-hand`). Passes `tsc --strict` against the installed `next` types.

```ts
// src/app/fonts.ts — exact next/font/google configuration
import { Fredoka, Gochi_Hand, Poppins } from "next/font/google";

/** MAIN font: everything readable (UI, body, headings). 3 static weights, ~23.7 KB, preloaded. */
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  style: ["normal"],
  display: "swap",
  variable: "--font-poppins",
});

/** MINOR 1, the "candy numerals" voice: prices, discounts, counters, sticker labels, monogram initials, wordmark. ~16.5 KB, preloaded. */
export const fredoka = Fredoka({
  subsets: ["latin"],
  weight: "600",
  display: "swap",
  variable: "--font-fredoka",
});

/** MINOR 2, the tauke's marker pen: max 1 annotation per viewport, never essential info. ~19.6 KB, NOT preloaded. */
export const gochi = Gochi_Hand({
  subsets: ["latin"],
  weight: "400",
  display: "optional",
  preload: false,
  variable: "--font-gochi",
});

export const fontVariables = `${poppins.variable} ${fredoka.variable} ${gochi.variable}`;
```

```tsx
// src/app/layout.tsx (shape; keep existing metadata wiring)
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "./fonts";

export const viewport: Viewport = { themeColor: "#FFF8F1", colorScheme: "only light", viewportFit: "cover" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ms-MY" className={fontVariables} suppressHydrationWarning /* head script sets data-motion / data-intro */>
      <head><MotionPrefScript /></head>
      <body className="font-sans text-ink antialiased">
        <SkipLink />
        <Providers>
          <SiteHeader />
          <main id="kandungan" className="pb-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+16px)] lg:pb-0">{children}</main>
          <Footer />
          <TabBar />
          <ToastRegion />
          <RevealObserver />
        </Providers>
      </body>
    </html>
  );
}

// src/components/providers/motion-pref-script.tsx
const js = `try{var d=document.documentElement;if(localStorage.getItem("lokallah:motion")==="reduce"||(navigator.connection&&navigator.connection.saveData))d.dataset.motion="reduce";if(sessionStorage.getItem("lokallah:intro"))d.dataset.intro="done"}catch(e){}`;
export function MotionPrefScript() { return <script dangerouslySetInnerHTML={{ __html: js }} />; }
```

| Font | `next/font/google` import | weights | subsets | display | preload | CSS variable | Tailwind family |
|---|---|---|---|---|---|---|---|
| Poppins (main) | `Poppins` | 400, 600, 800 | latin | swap | yes | `--font-poppins` | `font-sans` (default) |
| Fredoka | `Fredoka` | 600 | latin | swap | yes | `--font-fredoka` | `font-num` |
| Gochi Hand | `Gochi_Hand` | 400 | latin | optional | **no** | `--font-gochi` | `font-hand` / `hand` |

---

## Appendix D — SVG motif list

All motifs are **Server Components in `src/components/art/`** rendering inline SVG with `aria-hidden="true" focusable="false"` (JSX camelCase attributes). Shared construction: ink `#2B1736` stroke, `stroke-linejoin="round" stroke-linecap="round"`, flat candy fills from tokens, at most one white highlight (55–70 % opacity). **No `<defs>`, gradients or `id`s inside motifs** (they repeat on a page). Use `className` for fonts inside SVG `<text>` (CSS variables don't work in presentation attributes). Budget: ≤ 3 decorative illustrations per viewport.

### D.1 Inventory

| # | Motif | File | viewBox / rendered sizes | Colours | Where it appears | Motion |
|---|---|---|---|---|---|---|
| 1 | **Logo mark** (mini bunga raya) | `logo-mark.tsx` | 100 / 22 px (mobile header), 28 px (desktop header), 20 px (footer) | petals `bandung` `#FF6FB5`, ink stroke 5, centre `mangga` `#FFD54F` | Header, footer, OG image | Hover: rotate 72°, 400 ms `ease-pop` |
| 2 | **Bunga raya** | `bunga-raya.tsx` | 100 / 56 px (mobile hero), 96 px (desktop hero), 40 px (seal centre), 10 px glyph (ticker separator, no veins/pollen) | petals `jambu` `#FF8FC8`, ink 2; veins white .7; centre `bandung-pekat` `#C0136A`; stamen `mangga` | Hero sticker, seal, CTA band, ticker separators, particles | `intro-slap` once |
| 3 | **Kad harga starburst** (L3) | `starburst.tsx` | `-6 -6 112 112` / 56 px (cards), 64 px (brand best deal, hero), 40 px (search/list mini) | fill `mangga`; white 10-unit die-cut underlay; ink 4-unit stroke | Deal L3 sticker, /promos group header, hero max-discount | Hero `intro-slap`; card hover +2° |
| 4 | **Sparkle** (bintang kecil) | `sparkle.tsx` | 24 / 10 px (in "Baru je"), 16–24 px (hero, particles) | fill `mangga`, ink 1.5 (plain ink fill inside stickers) | Hero, "Baru je", save particles, explainer | `intro-slap`; static after |
| 5 | **Wau bulan** (moon kite) | `wau-bulan.tsx` | `0 0 120 152` / 140 px (desktop hero), 92 px (/new header), 48 px (Baru rail title), 28 px (end-of-list) | wings `keladi` `#BDA6FF`; inner wing `#FFC2DD`; tail `mangga`; inner tail `#A8EED8`; head `jambu`; ink 2.5 | Desktop hero (string to deal cards), /new header, Baru rail, end-of-list, 404 (cut string) | `animate-sway` (ambient), parallax rise (desktop) |
| 6 | **Tier icons** (kawaii faces ≥ 28 px) | `tier-icon.tsx` (`tier` prop) | 48 / 14 px (cop, faces dropped), 20 px (cop-lg), 40 px (stamp, popover), 96 px (tier journey) | fills from `--tier-pop`; cili calyx `#4CC27A`; sprout pot `#E5C0A1`; crown jewels `jambu` + `#A4CFFF` | Cops, tier stamp, filter tier cards, tier journey, /about#tier | Micro per tier (§7.5 #6) |
| 7 | **Squiggle underline** | `squiggle.tsx` | `0 0 104 12` / width 100 % of the word, 8–12 px tall | stroke `bandung` 4 (nav), `jambu` 6 (hero swash) | Active desktop nav item, ghost-button hover, hero accent word | `scaleX` draw-in |
| 8 | **Monogram shapes** | `monogram.tsx` (+ `src/lib/monogram.ts`) | 100 / 20, 36, 56, 96 px | fill `--cat-mid`; ink stroke 1.5–2; white die-cut ≥ 48 px; highlight white .6; initials ink Fredoka | Product-card brand row, search, brand cards/rows, brand profile | Card-hover wiggle; morph between card and profile |
| 9 | **Oyen** (mascot) | `oyen.tsx` (`mood`, `pose: "head" \| "loaf" \| "peek"`) | 160 / 64 px (search), 96 px (footer loaf), 120 px (empty states), 140 px max mobile | fur `oyen` `#FFAA55`; stripes `oyen-belang` `#E07020`; inner ears + nose `bandung`; muzzle `#FFF3E6`; blush `bandung` .55; ink 3 | Hero peek, search empty, empty states, 404, footer, CTA band, suggest success | Blink (ambient), peek once, pop-in once, `zzz` in `tidur` |
| 10 | **"100% Buatan Malaysia" seal** | `seal.tsx` | 100 / 96 px (desktop hero), 64 px (footer, /about) | 24-scallop fill `mangga-tint` `#FFF4C7`, ink 2; ring text ink Poppins 600 7 caps; centre motif #2 at 40 % | Desktop hero, footer, /about | Static (ring spins only on /about, 30 s, paused offscreen) |
| 11 | **Arrow doodle** | `arrow-doodle.tsx` | `0 0 80 36` / 64–80 px wide | stroke `telang` 3 | Next to Gochi notes (hero, origin quote) | Draw-in with the note (`intro-rise`) |
| 12 | **Empty rak** (shelf) | `empty-rak.tsx` | `0 0 200 120` / 220 px (404) | planks `#EBCFB5`, brackets ink, ink 2.5 | 404 | Static (Oyen sits on it) |
| 13 | **Tier stamp** | `tier-stamp.tsx` | 112 / 112 px | ring `--tier-tint`, ink 3, dashed inner ring, ring text ink Fredoka 11 caps, icon #6 at 40 px | Brand profile hero | Ring rotates 360°/30 s (ambient) |
| 14 | **Awning** (CSS) | `awning.tsx` (+ `.awning` CSS) | 100 % × 20/26 px (header), 20 px (brand card), 22 px (brand cover) | stripes `--awning` (`bandung` default, `--cat-pop` on brands) + white; ink top line + 2 px ink drop shadow | Header, brand cards, brand profile cover | Tucks on scroll; flutters on brand-card hover |
| 15 | **Pucuk rebung strip** (CSS) | `.pucuk` | 100 % × 14 px, 24 × 14 tile | triangles `#FFC2D6` / `keladi`, dots `mangga`, on ink | Footer top edge, promo band hem (on jambu) | Static |
| 16 | **Songket diamond** (CSS mask) | `.songket` | 32 px tile | `--cat-pop` at .28 | Brand-card band, Kategori popover header | Static |
| 17 | **Batik bunga** (CSS mask) | `.batik` | 48 px tile | `--cat-pop` at .30 | Category hero, brand cover | Static |
| 18 | **Kuih lapis strip** (CSS) | `.kuih-strip`, `bg-kuih-lapis` | 6 px / progress thumbs | jambu / mangga / `#86DFAA` / keladi bands | Rail progress, indeterminate bars, footer divider, /about reading bar | Thumb `scaleX` |
| 19 | **Shelf plank** (CSS) | `category-shelf.tsx` | 100 % + 16 px × 10 px | `#EBCFB5`, shadow `0 6px 0 -2px rgb(43 23 54 / .08)` | Home category rak | Static |
| 20 | **Sunburst disc** (CSS) | `bg-sunburst` | 160 px circle at .6 | `#FFE88A` / `#FFF6CF` | Behind Oyen in empty states, 404 | Static |
| 21 | **Kalendar koyak** (HTML/CSS) | `kalendar-koyak.tsx` | 64 × 72 px | binding `bandung` + santan holes; page `putih`, 2 px ink; zig-zag bottom via `mask: conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) 50% / 8px 100%` | /new day headers | Static |

### D.2 Paths

**#1/#2 Bunga raya** (viewBox `0 0 100 100`; the logo mark omits veins and pollen and uses `strokeWidth={5}`, centre `#FFD54F`):
```tsx
const PETAL = "M50 50C34 46 22 30 30 17C35 9 45 10 50 18C55 10 65 9 70 17C78 30 66 46 50 50Z";
const R = [0, 72, 144, 216, 288];
<svg viewBox="0 0 100 100" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
  <g fill="#FF8FC8" stroke="#2B1736" strokeWidth="2">{R.map((a) => <path key={a} d={PETAL} transform={`rotate(${a} 50 50)`} />)}</g>
  <g stroke="#fff" strokeWidth="2" opacity=".7">{R.map((a) => <path key={a} d="M50 40V27" transform={`rotate(${a} 50 50)`} />)}</g>
  <circle cx="50" cy="50" r="11" fill="#C0136A" stroke="#2B1736" strokeWidth="2" />
  <path d="M50 50L64 27" stroke="#2B1736" strokeWidth="3" /><path d="M50 50L64 27" stroke="#FFD54F" strokeWidth="1.6" />
  <g fill="#FFD54F" stroke="#2B1736" strokeWidth="1"><circle cx="64.5" cy="26" r="2.6"/><circle cx="69" cy="28.5" r="2.1"/><circle cx="61" cy="22.5" r="2.1"/><circle cx="67.5" cy="22.5" r="1.9"/></g>
</svg>
```

**#3 Kad harga starburst** (16 points, outer 50, inner 42):
```ts
export const BURST_16 = "M50 0L58.2 8.8L69.1 3.8L73.3 15.1L85.4 14.6L84.9 26.7L96.2 30.9L91.2 41.8L100 50L91.2 58.2L96.2 69.1L84.9 73.3L85.4 85.4L73.3 84.9L69.1 96.2L58.2 91.2L50 100L41.8 91.2L30.9 96.2L26.7 84.9L14.6 85.4L15.1 73.3L3.8 69.1L8.8 58.2L0 50L8.8 41.8L3.8 30.9L15.1 26.7L14.6 14.6L26.7 15.1L30.9 3.8L41.8 8.8Z";
// <svg viewBox="-6 -6 112 112"><path d={BURST_16} fill="#FFD54F" stroke="#fff" strokeWidth={10} strokeLinejoin="round"/>
//   <path d={BURST_16} fill="#FFD54F" stroke="#2B1736" strokeWidth={4} strokeLinejoin="round"/></svg>
// The label "−45%" is HTML on top (Fredoka 600, ink), not SVG text.
```

**#4 Sparkle** (viewBox 24): `M12 1Q13.3 10.7 23 12Q13.3 13.3 12 23Q10.7 13.3 1 12Q10.7 10.7 12 1Z` (fill `#FFD54F`, ink 1.5).

**#5 Wau bulan** (viewBox `0 0 120 152`, ink stroke 2.5 unless stated):
```svg
<path d="M14 34Q60 -6 106 34" stroke-width="2" fill="none"/>                                                           <!-- busur (bow) -->
<path d="M60 28C44 20 20 22 6 42C20 48 42 52 60 58C78 52 100 48 114 42C100 22 76 20 60 28Z" fill="#BDA6FF"/>           <!-- sayap -->
<path d="M60 34C48 29 33 30 24 39C35 43 48 46 60 50C72 46 85 43 96 39C87 30 72 29 60 34Z" fill="#FFC2DD" stroke-width="1.5"/>
<path d="M60 74C38 74 20 92 16 118C30 104 46 101 60 110C74 101 90 104 104 118C100 92 82 74 60 74Z" fill="#FFD54F"/>  <!-- ekor bulan -->
<path d="M60 82C46 83 35 92 31 104C41 98 51 98 60 103C69 98 79 98 89 104C85 92 74 83 60 82Z" fill="#A8EED8" stroke-width="1.5"/>
<path d="M60 8L67 18L60 28L53 18Z" fill="#FF8FC8"/>                                                                     <!-- kepala -->
<path d="M60 28V112" fill="none"/>                                                                                      <!-- tulang -->
<path d="M60 112C62 128 78 134 94 148" stroke-width="2" stroke-dasharray="0.5 6" fill="none"/>                          <!-- tali -->
```
Wrap the body (all but the string) in `<g class="ambient" style="transform-box:fill-box;transform-origin:50% 20%;animation:var(--animate-sway)">`. 404 variant: string becomes `M60 112C62 122 66 126 70 128` + a 6 px zig-zag `l3 -3 l3 3`.

**#6 Tier icons** (viewBox 48; drop eyes/mouth below 28 px):
```svg
<!-- Cili Padi -->
<g stroke="#2B1736" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
  <path d="M24 12C25 7 28 5 32 4" fill="none" stroke-width="2.5"/>
  <path d="M18 15C14 24 12 34 7 44C18 41 27 30 31 16C27 12 22 12 18 15Z" fill="#FF6B4A"/>
  <path d="M16 16C20 10 28 10 32 16C28 18 20 18 16 16Z" fill="#4CC27A"/></g>
<circle cx="19.5" cy="24" r="1.6" fill="#2B1736"/><circle cx="25.5" cy="24.5" r="1.6" fill="#2B1736"/>
<path d="M21 28Q22.6 29.6 24.2 28" fill="none" stroke="#2B1736" stroke-width="1.4" stroke-linecap="round"/>
<path d="M27 18C27.5 20 27.4 22 27 24" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2" stroke-linecap="round"/>
<!-- Naik Daun -->
<g stroke="#2B1736" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
  <ellipse cx="24" cy="41" rx="13" ry="4.5" fill="#E5C0A1"/><path d="M24 40V20" fill="none" stroke-width="2.5"/>
  <path d="M24 27C16 29 8 23 8 14C16 12 23 17 24 27Z" fill="#4CC27A"/><path d="M24 21C25 12 33 6 42 8C42 18 33 23 24 21Z" fill="#4CC27A"/></g>
<circle cx="31.5" cy="14.5" r="1.4" fill="#2B1736"/><circle cx="36" cy="13.2" r="1.4" fill="#2B1736"/>
<path d="M33 17.3Q34.3 18.4 35.6 17" fill="none" stroke="#2B1736" stroke-width="1.2" stroke-linecap="round"/>
<!-- Jenama Ikon -->
<g stroke="#2B1736" stroke-width="2" stroke-linejoin="round">
  <path d="M9 33L6 14L16 22L24 8L32 22L42 14L39 33Z" fill="#F5B820"/><rect x="8" y="32" width="32" height="8" rx="3" fill="#F5B820"/>
  <circle cx="6" cy="13" r="3" fill="#FF8FC8"/><circle cx="24" cy="7" r="3" fill="#A4CFFF"/><circle cx="42" cy="13" r="3" fill="#FF8FC8"/></g>
<circle cx="20" cy="26" r="1.5" fill="#2B1736"/><circle cx="28" cy="26" r="1.5" fill="#2B1736"/>
<path d="M22.5 29Q24 30.4 25.5 29" fill="none" stroke="#2B1736" stroke-width="1.3" stroke-linecap="round"/>
<path d="M12 36H17" stroke="#fff" stroke-opacity=".7" stroke-width="2" stroke-linecap="round"/>
```
In cops the fills use `var(--tier-pop)` via `fill="currentColor"` on a wrapper with `color: var(--tier-pop)` for the main body shape.

**#7 Squiggle:** `<path d="M2 8Q12 0 22 8T42 8T62 8T82 8T102 8" fill="none" stroke="#FF6FB5" stroke-width="4" stroke-linecap="round"/>` (viewBox `0 0 104 12`, `preserveAspectRatio="none"`).

**#8 Monogram shapes** (viewBox 100):
```ts
export const MONO_SHAPES = [
  "M50 10A17.8 17.8 0 0 1 78.3 21.7A17.8 17.8 0 0 1 90 50A17.8 17.8 0 0 1 78.3 78.3A17.8 17.8 0 0 1 50 90A17.8 17.8 0 0 1 21.7 78.3A17.8 17.8 0 0 1 10 50A17.8 17.8 0 0 1 21.7 21.7A17.8 17.8 0 0 1 50 10Z", // bunga-8
  "M50 4C88 4 96 12 96 50C96 88 88 96 50 96C12 96 4 88 4 50C4 12 12 4 50 4Z",                                                                                        // squircle
  "M54 4C76 2 97 18 97 42C98 64 88 92 60 96C36 100 6 90 4 62C2 38 30 6 54 4Z",                                                                                         // blob
  "M50 12A22 22 0 0 1 82.9 31A22 22 0 0 1 82.9 69A22 22 0 0 1 50 88A22 22 0 0 1 17.1 69A22 22 0 0 1 17.1 31A22 22 0 0 1 50 12Z",                                        // bunga-6
  "M50 8A12.6 12.6 0 0 1 71 13.6A12.6 12.6 0 0 1 86.4 29A12.6 12.6 0 0 1 92 50A12.6 12.6 0 0 1 86.4 71A12.6 12.6 0 0 1 71 86.4A12.6 12.6 0 0 1 50 92A12.6 12.6 0 0 1 29 86.4A12.6 12.6 0 0 1 13.6 71A12.6 12.6 0 0 1 8 50A12.6 12.6 0 0 1 13.6 29A12.6 12.6 0 0 1 29 13.6A12.6 12.6 0 0 1 50 8Z", // biskut-12
] as const;
```

**#9 Oyen** (viewBox `0 0 160 160`, ink stroke 3, round joins; ≈ 2 KB markup):
- Ears `M40 58L34 18L70 38Z`, `M120 58L126 18L90 38Z` fill `#FFAA55`; inner ears `M42 50L39 28L60 40Z`, `M118 50L121 28L100 40Z` fill `#FF6FB5`, no stroke.
- Head `M28 76C28 46 52 32 80 32C108 32 132 46 132 76C132 106 110 122 80 122C50 122 28 106 28 76Z` fill `#FFAA55`.
- Stripes (stroke `#E07020` 4.5): `M70 38L72 50`, `M80 35V49`, `M90 38L88 50`, `M30 70H40`, `M130 70H120`.
- Muzzle `M56 104C60 112 100 112 104 104C98 116 62 116 56 104Z` fill `#FFF3E6`. Blush ellipses (50, 91) and (110, 91) rx 8.5 ry 5, `#FF6FB5` at .55.
- Nose `M76 86H84L80 91Z` fill `#FF6FB5`, ink 2. Mouth `M72 93Q76 98 80 93Q84 98 88 93` ink 2.5. Whiskers `M22 86L38 88`, `M24 96L38 94`, `M138 86L122 88`, `M136 96L122 94` ink 2.
- Eyes by mood (eye group gets `class="ambient" style="transform-box:fill-box;transform-origin:center;animation:var(--animate-blink)"` except `tidur`/`happy`):
  - `idle`: ellipses (61, 76) and (99, 76) rx 6 ry 7.5 ink + white highlights r 2.2 at (+2, −3).
  - `happy`: `M54 78Q61 69 68 78`, `M92 78Q99 69 106 78` (ink 3, no fill).
  - `tidur`: `M54 76Q61 82 68 76`, `M92 76Q99 82 106 76` + two Fredoka "z" (`class="font-num"`, `telang`, `animate-zzz`, second delayed 1.2 s).
  - `cari`: idle pupils shifted +3 px + magnifier circle (128, 118) r 14 fill `#E2F0FF` .85, ink 3; handle `M138 128L150 140` ink 6.
  - `terkejut`: white circles r 7 with ink pupils r 3.5; mouth ellipse (80, 97) rx 4 ry 5.
- `peek` pose: head + two paws, ovals (60, 124) and (100, 124) rx 12 ry 8 fill `#FFAA55` with two toe ticks each; paws overlap the search pill's top edge (wrapper `overflow: clip` on the bottom).
- `loaf` pose: body `M34 120C34 104 52 98 80 98C108 98 126 104 126 120V138C126 146 120 150 112 150H48C40 150 34 146 34 138Z` behind the head; tail `M126 136C146 136 152 118 142 110` drawn as ink stroke 14 under `#FFAA55` stroke 10.

**#10 Seal** (viewBox 100; 24 scallops): `M50 6A5.74 5.74 0 0 1 61.39 7.5A5.74 5.74 0 0 1 72 11.89A5.74 5.74 0 0 1 81.11 18.89A5.74 5.74 0 0 1 88.11 28A5.74 5.74 0 0 1 92.5 38.61A5.74 5.74 0 0 1 94 50A5.74 5.74 0 0 1 92.5 61.39A5.74 5.74 0 0 1 88.11 72A5.74 5.74 0 0 1 81.11 81.11A5.74 5.74 0 0 1 72 88.11A5.74 5.74 0 0 1 61.39 92.5A5.74 5.74 0 0 1 50 94A5.74 5.74 0 0 1 38.61 92.5A5.74 5.74 0 0 1 28 88.11A5.74 5.74 0 0 1 18.89 81.11A5.74 5.74 0 0 1 11.89 72A5.74 5.74 0 0 1 7.5 61.39A5.74 5.74 0 0 1 6 50A5.74 5.74 0 0 1 7.5 38.61A5.74 5.74 0 0 1 11.89 28A5.74 5.74 0 0 1 18.89 18.89A5.74 5.74 0 0 1 28 11.89A5.74 5.74 0 0 1 38.61 7.5A5.74 5.74 0 0 1 50 6Z` fill `#FFF4C7`, ink 2. Ring text "BUATAN MALAYSIA • SOKONG LOKAL •" on a circle path r 34 (`<textPath>` with `textLength="210" lengthAdjust="spacing"`; path id from `useId()`), Poppins 600 7 caps ink. Centre: motif #2 scaled to 40 %.

**#11 Arrow doodle** (viewBox `0 0 80 36`): `M4 30C20 10 50 4 76 14M66 6L77 14L66 22` stroke `#5B2BC9` 3, no fill.

**#12 Empty rak** (viewBox `0 0 200 120`, ink 2.5): planks `<rect x="10" y="40" width="180" height="12" rx="4" fill="#EBCFB5"/>` and `<rect x="10" y="96" width="180" height="12" rx="4" fill="#EBCFB5"/>`; brackets `M34 52V66L48 52` and `M166 52V66L152 52` and the same at y 108 (`M34 108V118L46 108`, `M166 108V118L154 108`), no fill; a dust line `M60 36H90` stroke `#C9B8D4` 2 dashed `2 5`.

---

## Appendix E — Component inventory (`src/components/`)

S = Server Component (default). C = `"use client"` island (keep tiny). D = loaded with `next/dynamic` / lazy `import()` on intent.

| Folder | File | Kind | Purpose |
|---|---|---|---|
| `providers/` | `providers.tsx` | C | `LazyMotion` (async) + `MotionConfig` + `SmoothScroll` + iOS `:active` listener |
| | `smooth-scroll.tsx` | C | `ReactLenis root`, driven by Motion `frame.update` |
| | `motion-features.ts` | — | `export { domAnimation as default } from "motion/react"` |
| | `motion-pref.ts` | C | `useMotionPref()` (`useSyncExternalStore` over media query + `html[data-motion]`), `setMotionPref()` |
| | `motion-pref-script.tsx` | S | Inline `<head>` script: `data-motion`, `data-intro` before paint |
| `motion/` | `reveal-observer.tsx` | C | One IO + MO; adds `reveal-ready`, `is-in` |
| | `use-ambient-pause.ts` | C | Shared IO → `data-paused` on `[data-ambient]` |
| | `rail-stagger.tsx` | C | SSR-visible cascade for the first 6 rail items + one-time nudge |
| | `hero-intro-guard.tsx` | C | Writes `sessionStorage["lokallah:intro"]` after the first play |
| `layout/` | `site-header.tsx` | S | Header shell (mobile + desktop variants), logo, nav links, Jenama pill |
| | `header-scroll.tsx` | C | Awning tuck, hide/show of the sticky stack, hairline |
| | `nav-link.tsx` | C | `Link` + `useLinkStatus` pending dots + squiggle active state |
| | `category-popover.tsx` | S | Desktop "Kategori ▾" native `popover` grid |
| | `category-sheet.tsx` | C | Mobile Kategori `<dialog>` (tiles, tier cops, links, motion switch) |
| | `tab-bar.tsx` | C | Bottom nav, raised Cari, sliding active pill, count bubbles, `data-saved-target` |
| | `awning.tsx` | S | `.awning` wrapper component (`color` prop) |
| | `logo.tsx` | S | Mark + Fredoka wordmark (`onInk` variant) |
| | `footer.tsx` | S | Footer columns, disclaimers, seal, sleeping Oyen |
| | `footer-oyen.tsx` | C | Tap-to-wake easter egg |
| | `motion-toggle.tsx` | C | "Animasi: Penuh / Kurang" switch |
| | `skip-link.tsx` | S | "Langkau ke kandungan" |
| | `back-to-top.tsx` | C | FAB + `lenis.scrollTo(0)` |
| `search/` | `search-trigger.tsx` | C | Header pill / icon / hero pill / tab Cari; ⌘K, Ctrl+K, "/"; prefetch on intent |
| | `search-dialog.tsx` | C, D | Native `<dialog>`, index fetch, combobox, results, states |
| | `search-row.tsx` | S/C | Brand / product / category rows with `<mark>` highlighting |
| | `hero-search-pill.tsx` | C | 56 px hero pill with cycling examples + Oyen peek slot |
| `product/` | `product-card.tsx` | S | Card anatomy §6.7 |
| | `product-row.tsx` | S | "Senarai" list row |
| | `plate-image.tsx` | C | `<img>` with fit, srcset, `data-loaded` on load/complete, error fallback |
| | `deal-sticker.tsx` | S | L1 / L2 / L3 from `discount` (`dealLevel()` in `src/lib/deal.ts`) |
| | `baru-sticker.tsx` | S | "Baru je" / "Baru" from `publishedAt` |
| | `price.tsx` | S | Fredoka price, struck price, sr sentence, "Jimat" pill |
| | `save-button.tsx` | C | Heart toggle, particles, ring, teach-once flight trigger |
| | `fly-to-saved.ts` | D | Ghost heart + `animate(…, flightTransition)` + target bump |
| | `product-grid.tsx` | S | Responsive grid, eager first images, `content-visibility` chunks |
| | `load-more.tsx` | C | "Muat lagi" → `?page=` in `startTransition` |
| | `deal-group-header.tsx` | S | /promos sticky sub-headers by deal level |
| | `kalendar-koyak.tsx` | S | /new tear-off date header |
| `brand/` | `brand-card.tsx` | S | Kedai card §6.8 |
| | `brand-row.tsx` | S | Compact mobile row |
| | `monogram.tsx` | S | Monogram SVG (sizes 20/36/56/96, optional tier badge, optional VT name) |
| | `tier-cop.tsx` | S | `.cop` / `.cop-lg` + native popover explainer |
| | `tier-stamp.tsx` | S | 112 px rotating ring stamp |
| | `brand-hero.tsx` | S | Cover, identity card, actions, live line, stats |
| | `brand-links.tsx` | S | Website / Instagram / TikTok / Shopee buttons |
| | `brand-tabs.tsx` | C | Promo / Baru tabs (hash sync, `hidden` toggling) |
| | `save-brand-button.tsx` | C | Brand heart |
| | `directory-filter.tsx` | C | /brands instant DOM filtering + URL sync |
| | `random-brand-button.tsx` | C | Dice spin + navigate |
| `category/` | `category-tile.tsx` | S | Squircle tile + count pill + VT morph name |
| | `category-shelf.tsx` | S | Rows of tiles on planks |
| | `category-chip.tsx` | C | `aria-pressed` chip with check swap + wiggle |
| | `chip-row.tsx` | S | Scrolling chip row with edge fade |
| | `category-hero.tsx` | S | "Papan tanda" hero |
| `filters/` | `filter-bar.tsx` | C | Mobile sticky bar (Tapis, quick chips, sort popover) |
| | `filter-sheet.tsx` | C, D | Tapis `<dialog>` + live count CTA |
| | `filter-sidebar.tsx` | C | Desktop sticky sidebar |
| | `active-filters.tsx` | C | Removable pills (`AnimatePresence`, `chipPresence`) |
| | `use-filter-url.ts` | C | Parse/serialise filters ↔ URL, `startTransition` replace |
| `home/` | `hero.tsx` | S | Hero layout, stats, stickers, CSS intro classes |
| | `hero-deal-stack.tsx` | S | Desktop fanned live cards + wau + seal |
| | `hero-parallax.tsx` | C | Desktop scroll-linked parallax wrapper |
| | `live-ticker.tsx` | S | Marquee markup (two copies) |
| | `ticker-pause.tsx` | C | Pause/Play toggle |
| | `explainer.tsx` | S | 3-step "how we stay up to date" markup |
| | `explainer-progress.tsx` | C | Scroll-linked line + step activation + "Main semula" |
| | `origin-quote.tsx` | S | Threads speech bubble + promise chips |
| | `tier-journey.tsx` | S | 3 tier stations markup |
| | `tier-journey-progress.tsx` | C | Connector scale + `stampIn` activation |
| | `spotlight.tsx` | S | Cili Padi minggu ni |
| | `state-chips.tsx` | S | Jelajah ikut negeri |
| | `suggest-band.tsx` | S | CTA band with Oyen |
| `rail/` | `rail.tsx` | S | Header row + track + progress thumb + end card |
| | `rail-controls.tsx` | C | Desktop prev/next, disabled at ends |
| | `rail-end-card.tsx` | S | "Tengok semua {n} →" sticker tile |
| `feedback/` | `live-pill.tsx` | S | Sync state pill + popover |
| | `live-time.tsx` | C | Relative-time upgrade every 60 s; refresh on visibility |
| | `odometer.tsx` | S | Digit-cell odometer (`intro` / `reveal` modes) |
| | `toast-region.tsx` | C | Single toast region, `useToast()` |
| | `empty-state.tsx` | S | Oyen + sunburst + copy + CTAs |
| | `loading-line.tsx` | C | Rotating Gochi line |
| `skeletons/` | `product-card-skeleton.tsx`, `product-row-skeleton.tsx`, `brand-card-skeleton.tsx`, `brand-row-skeleton.tsx`, `rail-skeleton.tsx`, `grid-skeleton.tsx`, `tile-grid-skeleton.tsx`, `brand-hero-skeleton.tsx`, `search-row-skeleton.tsx` | S | Shape-exact skeletons (`.skeleton`, `--i`) |
| `ui/` | `button.tsx`, `icon-button.tsx`, `pop.tsx` (pop wrapper), `chip.tsx`, `input.tsx`, `textarea.tsx`, `select.tsx`, `switch.tsx` (C), `segmented.tsx` (C), `tabs.tsx` (C), `sheet.tsx` (C, `<dialog>` wrapper with Lenis-safe scroll body), `modal.tsx` (C), `kbd.tsx`, `count-bubble.tsx`, `info-pill.tsx`, `section-header.tsx`, `band.tsx` (gradient band panel), `stretched-link.tsx` | mixed | Primitives |
| `art/` | `logo-mark.tsx`, `bunga-raya.tsx`, `starburst.tsx`, `sparkle.tsx`, `wau-bulan.tsx`, `tier-icon.tsx`, `squiggle.tsx`, `oyen.tsx`, `seal.tsx`, `arrow-doodle.tsx`, `empty-rak.tsx`, `particles.tsx` (C) | S | Appendix D |
| `about/` | `suggest-form.tsx` | C, D | Form + Server Action `suggestBrand` (`src/app/about/actions.ts`) + success burst |
| | `faq.tsx` | S | `<details name="faq">` |
| `saved/` | `saved-view.tsx` | C | Tabs, freshness check via `/api/feed/search`, sort, clear-all |

**New lib files:** `src/lib/motion.ts` (Appendix B), `src/lib/photo-fit.ts` (§5.5), `src/lib/monogram.ts` (§5.6 + `MONO_SHAPES`), `src/lib/deal.ts` (`dealLevel(discount): 1 | 2 | 3`, thresholds 5/20/40), `src/lib/freshness.ts` (`syncState(iso, source | status)` → `"fresh" | "stale" | "old" | "none"`, thresholds 4 h / 24 h), `src/app/fonts.ts` (Appendix C).

**Routes:** `src/app/page.tsx`, `promos/page.tsx`, `new/page.tsx`, `brands/page.tsx`, `brands/[slug]/page.tsx`, `categories/[slug]/page.tsx`, `saved/page.tsx`, `about/page.tsx` (+ `actions.ts`), `not-found.tsx`, `error.tsx`, and a `loading.tsx` in every segment above.

---

## Appendix F — Ship checklist
- [ ] `globals.css` replaced with Appendix A (the create-next-app dark-mode block and Arial body are gone); `layout.tsx` uses Appendix C; `lang="ms-MY"`.
- [ ] Lighthouse mobile ≥ 90 on `/`, `/promos`, `/brands`, `/brands/[slug]` (throttled 4G, 4× CPU); LCP ≤ 2.0 s, CLS ≤ 0.05, TBT ≤ 150 ms.
- [ ] DevTools Performance → every animation compositor-only; no layout/paint inside loops; ≤ 3 ambient loops visible anywhere.
- [ ] No `layout`/`layoutId`/`motion.*` (only `m.*`); `LazyMotion strict` throws on violations.
- [ ] Reduced motion (OS), "Animasi: Kurang" and Save-Data all verified: Lenis smoothing off, VT instant, marquee static.
- [ ] Hero intro plays once per session and never replays when returning to Home (Activity).
- [ ] axe: 0 violations. Keyboard-only run: search → filter → save → brand page → outbound link.
- [ ] 320 px width, 200 % zoom, iOS safe areas, Android Chrome with forced dark mode (`color-scheme: only light`).
- [ ] No emoji in UI; no national/state emblems, flags or religious imagery; Threads author anonymous.
- [ ] Every product surface shows when prices were checked; stale/snapshot/error states render honestly.
