"use client";

import { startTransition, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useLenis } from "lenis/react";
import { BadgePercent, Search, SlidersHorizontal, Store, X } from "@/components/ui/lucide";
import { TierIcon } from "@/components/art/tier-icon";
import { WauBulan } from "@/components/art/wau-bulan";
import { CategoryChip } from "@/components/category/category-chip";
import { ChipRow } from "@/components/category/chip-row";
import { EmptyState } from "@/components/feedback/empty-state";
import { Odometer } from "@/components/feedback/odometer";
import { LoadMore } from "@/components/product/load-more";
import { prefersLessMotion } from "@/components/providers/motion-pref";
import { Button } from "@/components/ui/button";
import { CountBubble } from "@/components/ui/count-bubble";
import { Segmented } from "@/components/ui/segmented";
import { Select } from "@/components/ui/select";
import { Sheet } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { chipPresence } from "@/lib/motion";
import { normalizeText } from "@/lib/search";
import { CATEGORY_BY_SLUG, TIER_BY_SLUG } from "@/lib/taxonomy";
import type { CategorySlug, TierSlug } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BrandCard, type BrandCardData } from "./brand-card";
import { BrandRow } from "./brand-row";
import "./directory.css";
import { headerOffset } from "./scroll-offset";

/* ------------------------------------------------------------------ */
/* Model                                                                */
/* ------------------------------------------------------------------ */

export type DirectorySort = "az" | "promo" | "baru";
type TierFilter = TierSlug | "all";

interface DirState {
  q: string;
  kat: CategorySlug[];
  tier: TierFilter;
  negeri: string;
  promo: boolean;
  susun: DirectorySort;
}

const DEFAULT: DirState = { q: "", kat: [], tier: "all", negeri: "", promo: false, susun: "az" };
const TIERS: TierSlug[] = ["cili-padi", "naik-daun", "ikon"];
const SORTS: { value: DirectorySort; label: string }[] = [
  { value: "az", label: "Jenama A–Z" },
  { value: "promo", label: "Paling banyak promo" },
  { value: "baru", label: "Paling banyak produk baru" },
];
const OWN_KEYS = ["q", "kat", "tier", "negeri", "promo", "susun", "page"];

export interface DirectoryFacets {
  total: number;
  categories: { slug: CategorySlug; count: number }[];
  states: string[];
  /** Letters present in the A–Z list (for the desktop rail). */
  letters: string[];
}

/** A brand card's data plus its precomputed A–Z letter and normalised search text. */
export interface DirectoryBrand extends BrandCardData {
  letter: string;
  /** normalizeText(name + subcategory + category + origin + tags) */
  hay: string;
}

/** Brands per "Muat lagi" chunk. */
const CHUNK = 24;

function parsePage(search: string): number {
  const n = Number(new URLSearchParams(search).get("page"));
  return Number.isInteger(n) && n > 1 ? Math.min(n, 20) : 1;
}

function parse(search: string, facets: DirectoryFacets): DirState {
  const sp = new URLSearchParams(search);
  const cats = new Set(facets.categories.map((c) => c.slug));
  const kat = (sp.get("kat") ?? "").split(",").filter((s): s is CategorySlug => cats.has(s as CategorySlug));
  const tierRaw = (sp.get("tier") ?? "").split(",")[0];
  const negeriRaw = sp.get("negeri") ?? sp.get("state") ?? "";
  const negeri = facets.states.find((s) => s.toLowerCase() === negeriRaw.toLowerCase()) ?? "";
  const susun = sp.get("susun");
  return {
    q: (sp.get("q") ?? "").slice(0, 60),
    kat: [...new Set(kat)],
    tier: (TIERS as string[]).includes(tierRaw) ? (tierRaw as TierSlug) : "all",
    negeri,
    promo: sp.get("promo") === "1",
    susun: susun === "promo" || susun === "baru" ? susun : "az",
  };
}

function writeUrl(s: DirState, page = 1) {
  try {
    const url = new URL(window.location.href);
    for (const k of [...OWN_KEYS, "state"]) url.searchParams.delete(k);
    if (s.q.trim()) url.searchParams.set("q", s.q.trim());
    if (s.kat.length) url.searchParams.set("kat", s.kat.join(","));
    if (s.tier !== "all") url.searchParams.set("tier", s.tier);
    if (s.negeri) url.searchParams.set("negeri", s.negeri);
    if (s.promo) url.searchParams.set("promo", "1");
    if (s.susun !== "az") url.searchParams.set("susun", s.susun);
    if (page > 1) url.searchParams.set("page", String(page));
    const next = url.pathname + (url.searchParams.size ? `?${url.searchParams.toString()}` : "") + url.hash;
    if (next !== window.location.pathname + window.location.search + window.location.hash) {
      window.history.replaceState(window.history.state, "", next);
    }
  } catch {
    /* URL sync is a convenience; filtering still works without it. */
  }
}

function matches(b: DirectoryBrand, s: DirState, words: string[], ignore?: "kat") {
  if (ignore !== "kat" && s.kat.length && !s.kat.includes(b.category)) return false;
  if (s.tier !== "all" && b.tier !== s.tier) return false;
  if (s.negeri && b.state !== s.negeri) return false;
  if (s.promo && b.promoCount < 1) return false;
  return words.every((w) => b.hay.includes(w));
}

/* Phones under 480 px get compact rows, wider screens kedai cards. The server (and hydration)
   renders both and lets CSS pick; after mount only the matching one is kept. */
const NARROW = "(max-width: 479.98px)";
function subscribeNarrow(cb: () => void) {
  const mq = window.matchMedia(NARROW);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const useNarrow = () =>
  useSyncExternalStore<boolean | null>(
    subscribeNarrow,
    () => window.matchMedia(NARROW).matches,
    () => null,
  );

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export interface DirectoryFilterProps {
  /** Every brand, A–Z (slim card data). */
  brands: DirectoryBrand[];
  facets: DirectoryFacets;
}

/**
 * /brands instant directory (DESIGN §8.4). Filtering, sorting and the count are pure client state
 * over the slim brand list (no network). The server renders the default A–Z view (first chunk);
 * URL state (`?q= &kat= &tier= &negeri= &promo=1 &susun= &page=`) is read after mount and written
 * with `history.replaceState`. Brands render in chunks of 24 behind "Muat lagi" so the DOM stays
 * small on phones; each cell uses `content-visibility: auto`.
 */
export function DirectoryFilter({ brands, facets }: DirectoryFilterProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const pendingJump = useRef<string | null>(null);
  const [s, setS] = useState<DirState>(DEFAULT);
  const [pages, setPages] = useState(1);
  const [ready, setReady] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const narrow = useNarrow();
  const lenis = useLenis();

  /* Cheap crossfade so a filter swap reads as "the shelf changed", not a jump. */
  const fade = useCallback(() => {
    const el = listRef.current;
    if (!el || prefersLessMotion()) return;
    el.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 220, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
  }, []);

  /* Bring the top of the results back under the header when the list shrinks below the reader. */
  const keepInView = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const bar = barRef.current?.offsetParent ? barRef.current.offsetHeight : 0;
    const edge = headerOffset() + bar + 12;
    const top = list.getBoundingClientRect().top;
    if (top >= edge) return;
    const y = window.scrollY + top - edge;
    if (lenis) lenis.scrollTo(y, { immediate: prefersLessMotion(), duration: 0.5 });
    else window.scrollTo({ top: y });
  }, [lenis]);

  // Mount (and every Activity re-show): read the URL.
  useEffect(() => {
    const fromUrl = parse(window.location.search, facets);
    const page = parsePage(window.location.search);
    const changed = JSON.stringify(fromUrl) !== JSON.stringify(DEFAULT) || page > 1;
    /* eslint-disable react-hooks/set-state-in-effect -- URL state is client-only (server pages never read searchParams) */
    setS(fromUrl);
    setPages(page);
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    if (changed) fade();
    // Bring the first selected category chip into its scrolling row (phones).
    if (fromUrl.kat.length) {
      requestAnimationFrame(() => {
        for (const chip of document.querySelectorAll<HTMLElement>(".dir [role=group] [aria-pressed=true]")) {
          const row = chip.closest<HTMLElement>("[role=group]");
          if (!row || row.scrollWidth <= row.clientWidth || chip.textContent?.startsWith("Semua")) continue;
          row.scrollLeft += chip.getBoundingClientRect().left - row.getBoundingClientRect().left - 16;
          break;
        }
      });
    }
  }, [facets, fade]);

  const words = useMemo(() => normalizeText(s.q).split(" ").filter(Boolean), [s.q]);

  const filtered = useMemo(() => {
    const list = brands.filter((b) => matches(b, s, words));
    if (s.susun === "promo") list.sort((a, b) => b.promoCount - a.promoCount || a.name.localeCompare(b.name));
    else if (s.susun === "baru") list.sort((a, b) => b.newCount - a.newCount || a.name.localeCompare(b.name));
    return list;
  }, [brands, s, words]);
  const visible = filtered.length;
  const shown = filtered.slice(0, pages * CHUNK);

  const catCounts = useMemo(() => {
    const counts = new Map<CategorySlug, number>();
    for (const b of brands) if (matches(b, s, words, "kat")) counts.set(b.category, (counts.get(b.category) ?? 0) + 1);
    return counts;
  }, [brands, s, words]);

  const lettersVisible = useMemo(() => new Set(filtered.map((b) => b.letter)), [filtered]);

  const update = useCallback(
    (patch: Partial<DirState>, opts: { animate?: boolean } = {}) => {
      setS((prev) => {
        const next = { ...prev, ...patch };
        startTransition(() => writeUrl(next));
        return next;
      });
      setPages(1);
      if (opts.animate !== false) fade();
      requestAnimationFrame(keepInView);
    },
    [fade, keepInView],
  );

  const reset = useCallback(() => update({ ...DEFAULT }), [update]);

  const toggleCat = (cat: CategorySlug | "all", on: boolean) => {
    if (cat === "all") return update({ kat: [] });
    update({ kat: on ? [...s.kat, cat] : s.kat.filter((k) => k !== cat) });
  };

  const sheetActive = (s.tier !== "all" ? 1 : 0) + (s.negeri ? 1 : 0) + (s.promo ? 1 : 0) + (s.susun !== "az" ? 1 : 0);
  const anyFilter = JSON.stringify(s) !== JSON.stringify(DEFAULT);

  const pills: { key: string; label: string }[] = [
    ...(s.q.trim() ? [{ key: "q", label: `“${s.q.trim()}”` }] : []),
    ...s.kat.map((k) => ({ key: `kat:${k}`, label: CATEGORY_BY_SLUG[k].nameMs })),
    ...(s.tier !== "all" ? [{ key: "tier", label: TIER_BY_SLUG[s.tier].name }] : []),
    ...(s.negeri ? [{ key: "negeri", label: s.negeri }] : []),
    ...(s.promo ? [{ key: "promo", label: "Ada promo je" }] : []),
  ];
  const clearPill = (key: string) => {
    if (key === "q") update({ q: "" });
    else if (key.startsWith("kat:")) update({ kat: s.kat.filter((x) => `kat:${x}` !== key) });
    else if (key === "tier") update({ tier: "all" });
    else if (key === "negeri") update({ negeri: "" });
    else if (key === "promo") update({ promo: false });
  };

  const tierOptions = useMemo(
    () => [
      { value: "all" as TierFilter, label: "Semua" },
      ...TIERS.map((t) => ({
        value: t as TierFilter,
        label: t === "ikon" ? <><span className="sm:hidden">Ikon</span><span className="hidden sm:inline">Jenama Ikon</span></> : TIER_BY_SLUG[t].name,
        ariaLabel: TIER_BY_SLUG[t].name,
        icon: <TierIcon tier={t} size={18} />,
      })),
    ],
    [],
  );
  const stateOptions = useMemo(() => facets.states.map((st) => ({ value: st, label: st })), [facets.states]);

  const scrollToLetter = useCallback(
    (letter: string) => {
      const el = listRef.current?.querySelector<HTMLElement>(`[data-letter="${letter}"]`);
      if (!el) return;
      // Offscreen cells are size-estimated (content-visibility), so re-aim once the scroll lands.
      const aim = () => window.scrollY + el.getBoundingClientRect().top - headerOffset() - 16;
      const settle = (left: number) => {
        const y = aim();
        if (Math.abs(y - window.scrollY) < 4 || left === 0) return;
        if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
        else window.scrollTo({ top: y });
        requestAnimationFrame(() => settle(left - 1));
      };
      if (lenis) lenis.scrollTo(aim(), { immediate: prefersLessMotion(), duration: 0.7, onComplete: () => settle(3) });
      else {
        window.scrollTo({ top: aim() });
        requestAnimationFrame(() => settle(3));
      }
      el.querySelector<HTMLAnchorElement>("a.stretched-link")?.focus({ preventScroll: true });
    },
    [lenis],
  );

  const jumpTo = (letter: string) => {
    const index = filtered.findIndex((b) => b.letter === letter);
    if (index < 0) return;
    const need = Math.floor(index / CHUNK) + 1;
    if (need > pages) {
      pendingJump.current = letter;
      setPages(need);
      startTransition(() => writeUrl(s, need));
    } else scrollToLetter(letter);
  };

  // A jump into a chunk that was not rendered yet: scroll once it is.
  useEffect(() => {
    const letter = pendingJump.current;
    if (!letter) return;
    pendingJump.current = null;
    requestAnimationFrame(() => scrollToLetter(letter));
  }, [pages, scrollToLetter]);

  const more = () => {
    const next = pages + 1;
    setPages(next);
    startTransition(() => writeUrl(s, next));
  };

  const q = s.q.trim();
  const searchField = (id: string, className?: string) => (
    <div className={cn("relative min-w-0", className)}>
      <label htmlFor={id} className="sr-only">
        Cari nama jenama
      </label>
      <Search aria-hidden size={20} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-soft" />
      <input
        id={id}
        type="search"
        inputMode="search"
        enterKeyHint="search"
        autoComplete="off"
        spellCheck={false}
        placeholder="Cari nama jenama…"
        value={s.q}
        maxLength={60}
        onChange={(e) => update({ q: e.target.value }, { animate: false })}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
        className={cn("dir-search h-12 w-full rounded-full border-2 border-ink bg-putih pl-11", s.q ? "pr-12" : "pr-4", " text-body text-ink shadow-pop-sm outline-none placeholder:text-ink-soft focus:shadow-[0_0_0_4px_rgb(91_43_201/.18)]")}
      />
      {s.q && (
        <button
          type="button"
          aria-label="Padam carian"
          onClick={() => update({ q: "" }, { animate: false })}
          className="absolute top-1/2 right-1 grid size-11 -translate-y-1/2 place-items-center rounded-full text-ink-soft hover:text-ink"
        >
          <X aria-hidden size={18} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );

  const chips = (
    <>
      <CategoryChip category="all" selected={s.kat.length === 0} onToggle={toggleCat} />
      {facets.categories.map((c) => (
        <CategoryChip key={c.slug} category={c.slug} selected={s.kat.includes(c.slug)} onToggle={toggleCat} count={catCounts.get(c.slug) ?? 0} />
      ))}
    </>
  );

  const tierControl = <Segmented label="Saiz jenama" options={tierOptions} value={s.tier} onChange={(v) => update({ tier: v })} />;
  const negeriControl = (id: string, label?: string) => (
    <Select id={id} label={label} aria-label={label ? undefined : "Negeri"} options={stateOptions} placeholder="Semua negeri" value={s.negeri} onChange={(e) => update({ negeri: e.target.value })} />
  );
  const sortControl = (id: string, label?: string) => (
    <Select id={id} label={label} aria-label={label ? undefined : "Susun"} options={SORTS} value={s.susun} onChange={(e) => update({ susun: e.target.value as DirectorySort })} />
  );
  const promoControl = (
    <Switch
      checked={s.promo}
      onCheckedChange={(v) => update({ promo: v })}
      label={
        <span className="inline-flex items-center gap-1.5">
          <BadgePercent aria-hidden size={18} className="text-bandung-pekat" />
          Ada promo je
        </span>
      }
    />
  );

  const empty = ready && visible === 0;

  return (
    <div className="dir">
      {/* Phones / tablets: sticky search + Tapis, part of the header stack. */}
      <div ref={barRef} className="sticky-stack dir-bar -mx-(--gutter) mt-4 bg-santan/96 px-(--gutter) py-2.5 lg:hidden">
        <div className="flex items-center gap-2.5">
          {searchField("dir-q-m", "flex-1")}
          <span className="relative shrink-0">
            <Button
              variant="secondary"
              size="md"
              icon={<SlidersHorizontal aria-hidden />}
              onClick={() => setSheetOpen(true)}
              aria-haspopup="dialog"
              aria-label={sheetActive ? `Tapis, ${sheetActive} aktif` : "Tapis"}
              faceClassName="px-4"
            >
              Tapis
            </Button>
            {sheetActive > 0 && <CountBubble count={sheetActive} className="pointer-events-none absolute -top-1.5 -right-1.5 z-10" />}
          </span>
        </div>
      </div>
      <div className="lg:hidden">
        <ChipRow label="Kategori" className="mt-1">
          {chips}
        </ChipRow>
      </div>

      {/* Desktop: everything in view, no sheet. */}
      <div className="mt-6 hidden rounded-card-lg border-2 border-garis bg-putih p-5 lg:block">
        <div className="flex items-center gap-4">
          {searchField("dir-q-d", "flex-1")}
          <div className="w-[540px] shrink-0">{tierControl}</div>
        </div>
        <ChipRow label="Kategori" className="mt-3">
          {chips}
        </ChipRow>
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3 border-t-2 border-dashed border-garis pt-4">
          <div className="w-56">{negeriControl("dir-negeri-d")}</div>
          {promoControl}
          <div className="ml-auto flex items-center gap-3">
            <span aria-hidden className="text-label text-ink-soft">
              Susun
            </span>
            <div className="w-64">{sortControl("dir-susun-d")}</div>
          </div>
        </div>
      </div>

      {/* Result summary + active filters */}
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 lg:mt-6">
        <p className="text-body-sm text-ink-2" aria-live="polite" aria-atomic="true">
          Tunjuk <Odometer value={visible} className="font-num text-[17px] text-ink" /> daripada {facets.total} jenama
        </p>
        <ul className="flex flex-wrap items-center gap-1.5" aria-label="Tapisan aktif">
          <AnimatePresence initial={false}>
            {pills.map((p) => (
              <m.li key={p.key} variants={chipPresence} initial="hidden" animate="show" exit="exit">
                <button
                  type="button"
                  onClick={() => clearPill(p.key)}
                  aria-label={`Buang tapisan ${p.label}`}
                  className="inline-flex h-8 max-w-[220px] items-center gap-1 rounded-full bg-kapas pr-1.5 pl-3 text-label-sm text-ink transition-transform active:scale-95"
                >
                  <span className="truncate">{p.label}</span>
                  <X aria-hidden size={16} strokeWidth={2.5} className="shrink-0" />
                </button>
              </m.li>
            ))}
          </AnimatePresence>
        </ul>
        {anyFilter && (
          <button type="button" onClick={reset} className="inline-flex min-h-11 items-center text-label text-telang underline-offset-4 hover:underline">
            Reset semua
          </button>
        )}
      </div>

      <div className="mt-3 lg:grid lg:grid-cols-[minmax(0,1fr)_28px] lg:gap-5">
        <div ref={listRef} className="min-w-0">
          {shown.length > 0 && (
            <ul role="list" aria-label="Senarai jenama" className="-m-1 grid grid-cols-1 xs:-m-1.5 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {shown.map((b, i) => {
                const appended = i >= CHUNK;
                return (
                  <li
                    key={b.slug}
                    className="dir-item"
                    data-letter={b.letter}
                    data-reveal={appended ? "" : undefined}
                    style={appended ? ({ "--i": i % 4 } as CSSProperties) : undefined}
                  >
                    {narrow !== false && (
                      <div className={narrow === null ? "xs:hidden" : undefined}>
                        <BrandRow brand={b} />
                      </div>
                    )}
                    {narrow !== true && (
                      <div className={cn("h-full", narrow === null ? "hidden xs:flex" : "flex")}>
                        <BrandCard brand={b} morph />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
          <LoadMore shown={shown.length} total={visible} onMore={more} noun="jenama" className="pt-8" />
          {ready && visible > CHUNK && shown.length >= visible && (
            <div data-reveal="" className="flex flex-col items-center gap-2 pt-10 text-center">
              <WauBulan size={56} sway />
              <p className="text-body text-ink-2">
                Dah habis! Kau dah tengok semua <span className="font-num text-ink">{visible}</span> jenama.
              </p>
            </div>
          )}
          {empty && (
            <EmptyState
              mood="cari"
              title={q ? <>Alamak, &ldquo;{q}&rdquo; tak jumpa.</> : "Takde yang padan semua tapisan ni."}
              body={q ? "Cuba ejaan lain, atau cari ikut kategori. Jenama ni belum ada?" : "Buang satu dua tapisan, confirm jumpa."}
              primary={q ? { label: "Cadang jenama ni", href: `/about?nama=${encodeURIComponent(q)}#cadang`, trailing: "arrow" } : { label: "Reset tapisan", onClick: reset }}
              secondary={q ? { label: "Reset tapisan", onClick: reset } : undefined}
            />
          )}
        </div>

        {/* Desktop A–Z rail: only meaningful while the list is A–Z. */}
        <nav
          aria-label="Lompat ikut huruf"
          aria-hidden={s.susun !== "az" || empty || undefined}
          inert={s.susun !== "az" || empty || undefined}
          className={cn("dir-rail hidden lg:block", (s.susun !== "az" || empty) && "is-off")}
        >
          <ol className="sticky top-[calc(var(--header-total)+16px)] flex flex-col items-center gap-px rounded-full border-[1.5px] border-garis-kuat bg-putih py-2">
            {facets.letters.map((l) => {
              const on = lettersVisible.has(l);
              return (
                <li key={l}>
                  <button
                    type="button"
                    disabled={!on}
                    onClick={() => jumpTo(l)}
                    aria-label={`Huruf ${l}`}
                    className="dir-letter grid h-[22px] w-7 place-items-center rounded-full font-num text-[12px] leading-none text-ink disabled:text-garis-kuat"
                  >
                    {l}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Tapis jenama"
        description="Senarai berubah terus bila kau pilih."
        footer={
          <div className="flex items-center justify-between gap-3">
            <Button variant="ghost" onClick={reset} disabled={!anyFilter}>
              Reset
            </Button>
            <Button variant="primary" onClick={() => setSheetOpen(false)} className="flex-1" fullWidth>
              Tunjuk <Odometer value={visible} className="font-num" /> jenama
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-6 pt-1">
          <fieldset>
            <legend className="mb-2 text-overline text-ink-soft uppercase">Saiz jenama</legend>
            <div role="radiogroup" aria-label="Saiz jenama" className="grid grid-cols-2 gap-2">
              {(["all", ...TIERS] as TierFilter[]).map((t) => {
                const on = s.tier === t;
                return (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    data-tier={t === "all" ? undefined : t}
                    data-tier-trigger=""
                    data-active={on || undefined}
                    onClick={() => update({ tier: t })}
                    className={cn(
                      "flex min-h-14 items-center gap-2.5 rounded-card px-3 text-left text-label transition-[background-color,transform] duration-150 active:scale-[.97]",
                      on ? "border-2 border-ink bg-(--tier-tint,var(--color-bandung-tint)) shadow-pop-sm" : "border-[1.5px] border-garis-kuat bg-putih",
                    )}
                  >
                    <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full border-[1.5px] border-ink bg-putih">
                      {t === "all" ? <Store size={16} strokeWidth={2.25} /> : <TierIcon tier={t} size={20} />}
                    </span>
                    {t === "all" ? "Semua saiz" : TIER_BY_SLUG[t].name}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-overline text-ink-soft uppercase">Negeri</legend>
            {negeriControl("dir-negeri-m")}
          </fieldset>
          <div className="rounded-card border-2 border-garis bg-putih p-3.5">{promoControl}</div>
          <fieldset>
            <legend className="mb-2 text-overline text-ink-soft uppercase">Susun</legend>
            <div role="radiogroup" aria-label="Susun" className="flex flex-col gap-2">
              {SORTS.map((o) => {
                const on = s.susun === o.value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => update({ susun: o.value })}
                    className={cn(
                      "flex min-h-12 items-center gap-3 rounded-input px-4 text-left text-label transition-colors",
                      on ? "border-2 border-ink bg-bandung-tint shadow-pop-sm" : "border-[1.5px] border-garis-kuat bg-putih",
                    )}
                  >
                    <span aria-hidden className={cn("grid size-5 shrink-0 place-items-center rounded-full border-2 border-ink", on ? "bg-bandung" : "bg-putih")}>
                      {on && <span className="size-2 rounded-full bg-ink" />}
                    </span>
                    {o.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </div>
      </Sheet>
    </div>
  );
}
