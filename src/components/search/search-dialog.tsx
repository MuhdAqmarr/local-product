"use client";

import { Link } from "@/i18n/link";
import { useI18n, useLocaleRouter } from "@/i18n/client";
import type { SearchMessages } from "@/i18n/dictionaries/en/search";
import { useDeferredValue, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useLenis } from "lenis/react";
import { Clock3, Flame, Search, Sparkles, X } from "@/components/ui/lucide";
import { Oyen } from "@/components/art/oyen";
import { CategoryGlyph } from "@/components/product/category-glyph";
import { SearchRowSkeleton } from "@/components/skeletons/search-row-skeleton";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import type { SearchItem } from "@/lib/catalog";
import { fmt } from "@/i18n/format";
import { outboundUrl } from "@/lib/format";
import { normalizeText, prepareIndex, search, type PreparedItem } from "@/lib/search";
import { CATEGORIES, categoryLabel, type Category } from "@/lib/taxonomy";
import type { Locale } from "@/i18n/config";
import type { CategorySlug } from "@/lib/types";
import { cn } from "@/lib/utils";
import { loadSearchIndex, type SearchDialogProps } from "./search-provider";
import { queryWords, SearchBrandRow, SearchCategoryChip, SearchProductRow, type SearchBrandExtras } from "./search-row";

/* ------------------------------------------------------------------ */
/* Module caches: the index is fetched + normalised once per page life  */
/* ------------------------------------------------------------------ */

let prepared: PreparedItem[] | null = null;
let preparing: Promise<PreparedItem[]> | null = null;

function loadPrepared(): Promise<PreparedItem[]> {
  if (prepared) return Promise.resolve(prepared);
  preparing ??= loadSearchIndex()
    .then((items) => (prepared = prepareIndex(items)))
    .finally(() => {
      preparing = null;
    });
  return preparing;
}

/** Categories match in either language ("kopi" and "coffee" both find Drinks). */
const CATEGORY_INDEX = CATEGORIES.map((c) => ({ c, hay: normalizeText(`${c.nameMs} ${c.name} ${c.nameShort} ${c.blurb} ${c.blurbMs}`) }));

/* ------------------------------------------------------------------ */
/* Recent searches (guarded localStorage)                               */
/* ------------------------------------------------------------------ */

const RECENT_KEY = "lokallah:recent:v1";
const RECENT_MAX = 6;

function readRecent(): string[] {
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string").slice(0, RECENT_MAX) : [];
  } catch {
    return [];
  }
}

function writeRecent(list: string[]) {
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    // Blocked storage: recent searches just don't persist.
  }
}

/** Example queries (per language, `search.examples`) are offered only when they have 3+ product hits. */
const EXAMPLE_MIN_PRODUCTS = 3;

const PRODUCTS_STEP = 8;

type Option =
  | { kind: "brand"; key: string; item: SearchItem & SearchBrandExtras }
  | { kind: "category"; key: string; category: Category }
  | { kind: "product"; key: string; item: SearchItem };

/**
 * Search dialog (DESIGN §6.4 / §8.9). Native `<dialog class="modal">` opened with showModal():
 * free focus trap, Esc and focus return. Full-screen sheet on phones, centred card from 640 px.
 * The index (`/api/feed/search`) loads once; ranking runs locally on a deferred query, so typing
 * never waits for the network. APG combobox + listbox: ↑/↓ move `aria-activedescendant`
 * (wrapping), Enter opens, Esc closes.
 */
export default function SearchDialog({ open, onClose, initialQuery }: SearchDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const silent = useRef(false);
  const router = useLocaleRouter();
  const { m, locale, plural } = useI18n();
  const t = m.search;
  const lenis = useLenis();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const listboxId = `${uid}-listbox`;

  const [query, setQuery] = useState(initialQuery ?? "");
  const [index, setIndex] = useState<PreparedItem[] | null>(prepared);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(prepared ? "ready" : "loading");
  const [slow, setSlow] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [recent, setRecent] = useState<string[]>(() => (typeof window === "undefined" ? [] : readRecent()));
  const [active, setActive] = useState(-1);
  const [more, setMore] = useState<{ q: string; n: number }>({ q: "", n: PRODUCTS_STEP });

  // Re-opening: start from the trigger's prefill (or empty), no stale highlight.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setQuery(initialQuery ?? "");
      setActive(-1);
    }
  }

  const deferred = useDeferredValue(query);
  const q = deferred.trim();
  const words = useMemo(() => queryWords(q), [q]);

  // Keep the selection in range when the query changes.
  const [activeFor, setActiveFor] = useState(q);
  if (activeFor !== q) {
    setActiveFor(q);
    setActive(-1);
  }

  /* ---- native dialog sync + Lenis ---- */
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
      inputRef.current?.select();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open || !lenis) return;
    lenis.stop();
    return () => lenis.start();
  }, [open, lenis]);

  useEffect(() => {
    const dialog = ref.current;
    return () => {
      if (dialog?.open) {
        silent.current = true;
        dialog.close();
      }
    };
  }, []);

  /* ---- index ---- */
  useEffect(() => {
    if (!open || index) return;
    let alive = true;
    const timer = window.setTimeout(() => alive && setSlow(true), 150);
    loadPrepared()
      .then((list) => {
        if (!alive) return;
        setIndex(list);
        setStatus("ready");
      })
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [open, index, attempt]);

  /* ---- results ---- */
  const results = useMemo(() => (index && q ? search(index, q, 60) : []), [index, q]);
  const brands = useMemo(() => results.filter((r) => r.kind === "brand").slice(0, 5) as Array<SearchItem & SearchBrandExtras>, [results]);
  const products = useMemo(() => results.filter((r) => r.kind === "product"), [results]);
  const categories = useMemo(() => (words.length ? CATEGORY_INDEX.filter(({ hay }) => words.every((w) => hay.includes(w))).map(({ c }) => c).slice(0, 4) : []), [words]);
  const productLimit = more.q === q ? more.n : PRODUCTS_STEP;
  const shownProducts = products.slice(0, productLimit);

  const options: Option[] = useMemo(
    () => [
      ...brands.map((item) => ({ kind: "brand" as const, key: `b:${item.id}`, item })),
      ...categories.map((category) => ({ kind: "category" as const, key: `c:${category.slug}`, category })),
      ...shownProducts.map((item) => ({ kind: "product" as const, key: `p:${item.id}`, item })),
    ],
    [brands, categories, shownProducts],
  );
  const optionId = (i: number) => `${uid}-opt-${i}`;

  /* ---- empty-query helpers (computed once per index) ---- */
  const hot = useMemo(() => {
    if (!index) return [] as CategorySlug[];
    const counts = new Map<CategorySlug, number>();
    for (const { item } of index) if (item.kind === "product" && item.discount) counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([slug]) => slug);
  }, [index]);
  // A brand-name hit alone (e.g. "sambal" → Sambal Nyet) is not a useful example: require product hits.
  const examples = useMemo(
    () => (index ? t.examples.filter((e) => search(index, e, 20).filter((hit) => hit.kind === "product").length >= EXAMPLE_MIN_PRODUCTS).slice(0, 6) : []),
    [index, t.examples],
  );

  /* ---- actions ---- */
  const remember = (text: string) => {
    const t = text.trim();
    if (t.length < 2) return;
    const next = [t, ...recent.filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, RECENT_MAX);
    setRecent(next);
    writeRecent(next);
  };

  const forget = (text: string) => {
    const next = recent.filter((r) => r !== text);
    setRecent(next);
    writeRecent(next);
  };

  const close = () => ref.current?.close();

  const choose = (option: Option) => {
    remember(q);
    if (option.kind === "product") {
      // Store links open in a new tab; the dialog stays so the list is still here on return.
      window.open(outboundUrl(option.item.href), "_blank", "noopener,noreferrer");
      return;
    }
    const href = option.kind === "brand" ? option.item.href : `/categories/${option.category.slug}`;
    close();
    router.push(href);
  };

  const runQuery = (text: string) => {
    setQuery(text);
    inputRef.current?.focus();
  };

  const moveTo = (i: number) => {
    setActive(i);
    document.getElementById(optionId(i))?.scrollIntoView({ block: "nearest" });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const n = options.length;
    if (event.key === "ArrowDown" && n) {
      event.preventDefault();
      moveTo(active < 0 ? 0 : (active + 1) % n);
    } else if (event.key === "ArrowUp" && n) {
      event.preventDefault();
      moveTo(active <= 0 ? n - 1 : active - 1);
    } else if (event.key === "Enter") {
      if (event.nativeEvent.isComposing) return;
      event.preventDefault();
      const pick = options[active >= 0 ? active : 0];
      if (pick) choose(pick);
      else remember(query);
    } else if (event.key === "Home" && active >= 0 && n) {
      event.preventDefault();
      moveTo(0);
    } else if (event.key === "End" && active >= 0 && n) {
      event.preventDefault();
      moveTo(n - 1);
    }
  };

  const hasResults = options.length > 0;
  const showLoading = status === "loading" && slow;
  const resultCount = brands.length + categories.length + products.length;

  let offset = 0;
  const brandStart = offset;
  offset += brands.length;
  const catStart = offset;
  offset += categories.length;
  const productStart = offset;

  return (
    <dialog
      ref={ref}
      data-search-dialog=""
      aria-label={t.label}
      onClose={() => {
        if (silent.current) silent.current = false;
        else onClose();
      }}
      onClick={(e) => e.target === ref.current && close()}
      className={cn(
        "modal m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-putih p-0 text-ink open:flex open:flex-col",
        "[--enter-from:translateY(24px)] [--exit-to:translateY(16px)]",
        "sm:bottom-auto sm:mx-auto sm:mt-[12vh] sm:h-auto sm:max-h-[76vh] sm:w-[min(640px,92vw)] sm:rounded-card-lg sm:border-2 sm:border-ink sm:shadow-float",
        "sm:[--enter-from:translateY(-8px)_scale(.97)] sm:[--exit-to:translateY(-6px)]",
      )}
    >
      {/* Header strip */}
      <div className="flex shrink-0 items-center gap-2 border-b-2 border-ink bg-gula-kapas pl-4 pr-2 pt-[env(safe-area-inset-top)] sm:pr-3">
        <Search aria-hidden="true" size={22} strokeWidth={2.25} className="shrink-0 text-ink" />
        <input
          ref={inputRef}
          type="text"
          inputMode="search"
          role="combobox"
          aria-expanded={hasResults}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? optionId(active) : undefined}
          aria-label={t.label}
          enterKeyHint="search"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t.placeholder}
          className="h-[52px] min-w-0 flex-1 bg-transparent text-[16px] text-ink outline-none placeholder:text-ink-soft focus-visible:outline-none sm:h-16 sm:text-[18px]"
        />
        {query && (
          <button
            type="button"
            aria-label={t.clear}
            onClick={() => runQuery("")}
            className="grid size-11 shrink-0 place-items-center rounded-full text-ink transition-colors hover:bg-white/60"
          >
            <X aria-hidden="true" size={20} strokeWidth={2.25} />
          </button>
        )}
        <Kbd className="hidden shrink-0 sm:inline-flex">Esc</Kbd>
        <button type="button" onClick={close} className="h-11 shrink-0 rounded-full px-3 text-label text-telang sm:hidden">
          {t.cancel}
        </button>
      </div>

      <p className="sr-only" aria-live="polite">
        {status === "ready" && q ? (resultCount ? plural(resultCount, t.results, { query: q }) : fmt(t.noResultsSr, { query: q })) : ""}
      </p>

      {/* Body */}
      <div data-lenis-prevent="" className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[calc(16px+env(safe-area-inset-bottom))] sm:pb-3">
        {status === "error" ? (
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <Oyen mood="terkejut" size={64} />
            <p className="mt-3 text-title-3 text-ink">{t.error.title}</p>
            <p className="mt-1 max-w-[34ch] text-body-sm text-ink-soft">{t.error.body}</p>
            <Button
              className="mt-5"
              variant="secondary"
              size="sm"
              onClick={() => {
                setStatus("loading");
                setAttempt((a) => a + 1);
              }}
            >
              {t.error.retry}
            </Button>
          </div>
        ) : status === "loading" ? (
          <div aria-busy="true" className="px-2 py-3">
            <span className="sr-only">{t.loading}</span>
            {showLoading && [0, 1, 2].map((i) => <SearchRowSkeleton key={i} i={i} />)}
          </div>
        ) : !q ? (
          <EmptyQuery t={t} locale={locale} recent={recent} hot={hot} examples={examples} onRun={runQuery} onForget={forget} onNavigate={close} />
        ) : hasResults ? (
          <div id={listboxId} role="listbox" aria-label={t.listbox} className="flex flex-col gap-1 px-2 py-2">
            {brands.length > 0 && (
              <div role="group" aria-labelledby={`${uid}-g-brand`}>
                <GroupLabel id={`${uid}-g-brand`}>{t.groups.brands}</GroupLabel>
                {brands.map((item, i) => (
                  <SearchBrandRow
                    key={item.id}
                    id={optionId(brandStart + i)}
                    item={item}
                    words={words}
                    active={active === brandStart + i}
                    onHover={() => setActive(brandStart + i)}
                    onSelect={() => choose(options[brandStart + i])}
                  />
                ))}
              </div>
            )}
            {categories.length > 0 && (
              <div role="group" aria-labelledby={`${uid}-g-cat`}>
                <GroupLabel id={`${uid}-g-cat`}>{t.groups.categories}</GroupLabel>
                <div className="flex flex-wrap gap-2 px-3 pb-2 pt-1">
                  {categories.map((category, i) => (
                    <SearchCategoryChip
                      key={category.slug}
                      id={optionId(catStart + i)}
                      category={category}
                      words={words}
                      active={active === catStart + i}
                      onHover={() => setActive(catStart + i)}
                      onSelect={() => choose(options[catStart + i])}
                    />
                  ))}
                </div>
              </div>
            )}
            {products.length > 0 && (
              <div role="group" aria-labelledby={`${uid}-g-prod`}>
                <GroupLabel id={`${uid}-g-prod`} count={products.length}>
                  {t.groups.products}
                </GroupLabel>
                {shownProducts.map((item, i) => (
                  <SearchProductRow
                    key={item.id}
                    id={optionId(productStart + i)}
                    item={item}
                    words={words}
                    active={active === productStart + i}
                    onHover={() => setActive(productStart + i)}
                    onSelect={() => choose(options[productStart + i])}
                  />
                ))}
              </div>
            )}
            {products.length > shownProducts.length && (
              <div className="px-3 pt-1">
                <button
                  type="button"
                  onClick={() => setMore({ q, n: productLimit + PRODUCTS_STEP * 2 })}
                  className="inline-flex min-h-11 items-center gap-1 text-label text-telang underline-offset-4 hover:underline"
                >
                  {fmt(t.showMore, { count: products.length - shownProducts.length })}
                </button>
              </div>
            )}
            <p className="px-3 pt-2 text-caption text-ink-soft">{t.priceNote}</p>
          </div>
        ) : (
          <NoResults t={t} locale={locale} query={q} hot={hot} onNavigate={close} />
        )}
      </div>

      {/* Desktop keyboard hint */}
      <div className="hidden shrink-0 items-center justify-end gap-3 border-t-2 border-garis bg-santan px-4 py-2 text-caption text-ink-soft sm:flex">
        <span className="inline-flex items-center gap-1">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> {t.keys.move}
        </span>
        <span aria-hidden="true">·</span>
        <span className="inline-flex items-center gap-1">
          <Kbd>Enter</Kbd> {t.keys.open}
        </span>
        <span aria-hidden="true">·</span>
        <span className="inline-flex items-center gap-1">
          <Kbd>Esc</Kbd> {t.keys.close}
        </span>
      </div>
    </dialog>
  );
}

function GroupLabel({ id, children, count }: { id: string; children: string; count?: number }) {
  return (
    <div id={id} role="presentation" className="flex items-baseline gap-2 px-3 pb-1 pt-3 text-overline uppercase text-ink-soft">
      {children}
      {count != null && <span className="font-num text-[12px] normal-case tracking-normal">{count > 40 ? "40+" : count}</span>}
    </div>
  );
}

function HotChips({ t, locale, hot, onNavigate }: { t: SearchMessages; locale: Locale; hot: CategorySlug[]; onNavigate: () => void }) {
  if (!hot.length) return null;
  return (
    <section aria-labelledby="search-hot" className="px-5 pt-4">
      <h3 id="search-hot" className="flex items-center gap-1.5 text-overline uppercase text-ink-soft">
        <Flame aria-hidden="true" size={14} strokeWidth={2.5} /> {t.empty.hot}
      </h3>
      <ul className="mt-2 flex flex-wrap gap-2">
        {hot.map((slug) => (
          <li key={slug} data-cat={slug}>
            <Link
              href={`/categories/${slug}`}
              onClick={onNavigate}
              className="inline-flex h-10 items-center gap-2 rounded-full border-[1.5px] border-garis-kuat bg-putih pl-2.5 pr-3.5 text-label text-ink transition-colors hover:bg-(--cat-tint) active:scale-[.96]"
            >
              <span aria-hidden="true" className="text-(--cat-ink)">
                <CategoryGlyph category={slug} size={18} />
              </span>
              {categoryLabel(slug, locale)}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function EmptyQuery({
  t,
  locale,
  recent,
  hot,
  examples,
  onRun,
  onForget,
  onNavigate,
}: {
  t: SearchMessages;
  locale: Locale;
  recent: string[];
  hot: CategorySlug[];
  examples: string[];
  onRun: (q: string) => void;
  onForget: (q: string) => void;
  onNavigate: () => void;
}) {
  return (
    <div className="pb-4">
      <div className="flex items-center gap-3 px-5 pt-5">
        <Oyen mood="idle" size={64} className="shrink-0 animate-pop-in" />
        <div>
          <p className="text-title-3 text-ink">{t.empty.title}</p>
          <p className="text-body-sm text-ink-soft">{t.empty.body}</p>
        </div>
      </div>

      {recent.length > 0 && (
        <section aria-labelledby="search-recent" className="px-5 pt-5">
          <h3 id="search-recent" className="flex items-center gap-1.5 text-overline uppercase text-ink-soft">
            <Clock3 aria-hidden="true" size={14} strokeWidth={2.5} /> {t.empty.recent}
          </h3>
          <ul className="mt-1 flex flex-col">
            {recent.map((r) => (
              <li key={r} className="-mx-2 flex items-center rounded-thumb hover:bg-kapas">
                <button type="button" onClick={() => onRun(r)} className="flex min-h-11 min-w-0 flex-1 items-center gap-2 px-2 text-left text-body text-ink">
                  <Search aria-hidden="true" size={16} className="shrink-0 text-ink-soft" />
                  <span className="truncate">{r}</span>
                </button>
                <button
                  type="button"
                  aria-label={fmt(t.empty.forget, { query: r })}
                  onClick={() => onForget(r)}
                  className="grid size-11 shrink-0 place-items-center rounded-full text-ink-soft hover:text-ink"
                >
                  <X aria-hidden="true" size={16} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <HotChips t={t} locale={locale} hot={hot} onNavigate={onNavigate} />

      {examples.length > 0 && (
        <section aria-labelledby="search-try" className="px-5 pt-5">
          <h3 id="search-try" className="flex items-center gap-1.5 text-overline uppercase text-ink-soft">
            <Sparkles aria-hidden="true" size={14} strokeWidth={2.5} /> {t.empty.tryThese}
          </h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {examples.map((e) => (
              <li key={e}>
                <button
                  type="button"
                  onClick={() => onRun(e)}
                  className="inline-flex h-9 items-center rounded-full bg-kapas px-3.5 text-label text-ink transition-[background-color,transform] hover:bg-bandung-tint active:scale-[.96]"
                >
                  {e}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function NoResults({ t, locale, query, hot, onNavigate }: { t: SearchMessages; locale: Locale; query: string; hot: CategorySlug[]; onNavigate: () => void }) {
  return (
    <div className="pb-4">
      <div className="flex flex-col items-center px-6 pt-8 text-center">
        <Oyen mood="cari" size={64} className="animate-pop-in" />
        <p className="mt-3 text-title-3 text-ink [overflow-wrap:anywhere]">{fmt(t.noResults.title, { query })}</p>
        <p className="mt-1 max-w-[36ch] text-body-sm text-ink-soft">{t.noResults.body}</p>
        <Button className="mt-5" variant="secondary" size="sm" trailing="arrow" href={`/about?nama=${encodeURIComponent(query)}#cadang`} onClick={onNavigate}>
          {t.noResults.suggest}
        </Button>
      </div>
      <HotChips t={t} locale={locale} hot={hot} onNavigate={onNavigate} />
    </div>
  );
}
