"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { BadgePercent, CircleAlert, Heart, PackageX, Store, TrendingDown, TrendingUp, Trash2 } from "lucide-react";
import { Monogram } from "@/components/brand/monogram";
import { SaveBrandButton } from "@/components/brand/save-brand-button";
import { TierCop } from "@/components/brand/tier-cop";
import { EmptyState } from "@/components/feedback/empty-state";
import { useNow } from "@/components/feedback/live-time";
import { Odometer } from "@/components/feedback/odometer";
import { toast } from "@/components/feedback/toast-store";
import { ProductCard } from "@/components/product/product-card";
import { gridColumns } from "@/components/product/product-grid";
import { displayPrice } from "@/components/product/price-text";
import { loadSearchIndex } from "@/components/search/search-provider";
import { GridSkeleton } from "@/components/skeletons/grid-skeleton";
import { Band } from "@/components/ui/band";
import { Button } from "@/components/ui/button";
import { InfoPill } from "@/components/ui/info-pill";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { panelId, tabId, Tabs } from "@/components/ui/tabs";
import type { SearchItem } from "@/lib/catalog";
import { formatCount, timeAgo } from "@/lib/format";
import { useSaved, type SavedBrand, type SavedItem, type SavedProduct } from "@/lib/saved";
import { CATEGORY_BY_SLUG } from "@/lib/taxonomy";
import type { ProductCardData } from "@/lib/types";
import { cn } from "@/lib/utils";

const STORE_KEY = "lokallah:saved:v1";
const TABS_BASE = "simpan";

type Tab = "produk" | "jenama";
type Sort = "baru" | "turun" | "diskaun";

const SORTS = [
  { value: "baru", label: "Baru disimpan" },
  { value: "turun", label: "Harga turun dulu" },
  { value: "diskaun", label: "Diskaun terbesar" },
] as const;

type Fresh =
  | { kind: "drop"; amount: number }
  | { kind: "up"; amount: number }
  | { kind: "ended" }
  | { kind: "gone" }
  | { kind: "same" };

interface ProductEntry {
  saved: SavedProduct;
  product: ProductCardData;
  fresh: Fresh | null;
}

const noop = () => () => {};
/** true after hydration; the store's server snapshot is empty, so nothing real renders before. */
function useMounted() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

/** Freshness check (DESIGN §8.7, §0.3 #24): the search index already has price + discount per product id. */
function useFreshIndex(enabled: boolean) {
  const [state, setState] = useState<{ map: Map<string, SearchItem> | null; error: boolean }>({ map: null, error: false });
  useEffect(() => {
    if (!enabled || state.map) return;
    let alive = true;
    loadSearchIndex()
      .then((items) => alive && setState({ map: new Map(items.map((i) => [i.kind === "brand" ? `brand:${i.id}` : i.id, i])), error: false }))
      .catch(() => alive && setState({ map: null, error: true }));
    return () => {
      alive = false;
    };
  }, [enabled, state.map]);
  return state;
}

function compare(saved: ProductCardData, now: SearchItem | undefined): { product: ProductCardData; fresh: Fresh } {
  // Not in the live index (sold out or removed): show the last known price, no stale promo sticker.
  if (!now || now.price == null) return { product: { ...saved, discount: undefined, compareAt: undefined, available: false }, fresh: { kind: "gone" } };
  const product: ProductCardData = {
    ...saved,
    price: now.price,
    discount: now.discount,
    // Keep the struck price only while the same promo still runs; never invent one.
    compareAt: now.discount && now.discount === saved.discount && now.price === saved.price ? saved.compareAt : undefined,
    available: true,
  };
  const diff = Math.round((saved.price - now.price) * 100) / 100;
  if (diff >= 0.01) return { product, fresh: { kind: "drop", amount: diff } };
  if (saved.discount && !now.discount) return { product, fresh: { kind: "ended" } };
  if (diff <= -0.01) return { product, fresh: { kind: "up", amount: -diff } };
  return { product, fresh: { kind: "same" } };
}

/** Put a cleared list back exactly as it was (savedAt and order), then tell the store to re-read. */
function restore(snapshot: SavedItem[], toggle: ReturnType<typeof useSaved>["toggle"]) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(snapshot));
    window.dispatchEvent(new StorageEvent("storage", { key: STORE_KEY }));
  } catch {
    // Storage blocked: fall back to re-adding (order kept, save times reset).
    [...snapshot].reverse().forEach((item) => {
      const { savedAt: _savedAt, ...rest } = item;
      void _savedAt;
      toggle(rest as Parameters<typeof toggle>[0]);
    });
  }
}

export function SavedView({ syncedAt }: { syncedAt: string }) {
  const mounted = useMounted();
  const { items, count, clear, toggle } = useSaved();
  const now = useNow();
  const [tab, setTab] = useState<Tab>("produk");
  const [sort, setSort] = useState<Sort>("baru");
  const [confirm, setConfirm] = useState(false);
  const { map, error } = useFreshIndex(mounted && count > 0);

  const savedProducts = useMemo(() => items.filter((i): i is SavedProduct => i.kind === "product"), [items]);
  const savedBrands = useMemo(() => items.filter((i): i is SavedBrand => i.kind === "brand"), [items]);

  // Opening /saved with only brands saved lands on the Jenama tab.
  const [autoTab, setAutoTab] = useState(false);
  if (mounted && !autoTab && count > 0) {
    setAutoTab(true);
    if (savedProducts.length === 0 && savedBrands.length > 0) setTab("jenama");
  }

  const entries: ProductEntry[] = useMemo(() => {
    const list = savedProducts.map((saved) => {
      if (!map) return { saved, product: saved.product, fresh: null };
      const { product, fresh } = compare(saved.product, map.get(saved.id));
      return { saved, product, fresh };
    });
    const dropOf = (e: ProductEntry) => (e.fresh?.kind === "drop" ? e.fresh.amount : 0);
    if (sort === "turun") list.sort((a, b) => dropOf(b) - dropOf(a) || b.saved.savedAt - a.saved.savedAt);
    else if (sort === "diskaun") list.sort((a, b) => (b.product.discount ?? 0) - (a.product.discount ?? 0) || b.saved.savedAt - a.saved.savedAt);
    else list.sort((a, b) => b.saved.savedAt - a.saved.savedAt);
    return list;
  }, [savedProducts, map, sort]);

  const drops = entries.filter((e) => e.fresh?.kind === "drop").length;

  const promoByBrand = useMemo(() => {
    const m = new Map<string, number>();
    if (map) for (const item of map.values()) if (item.kind === "product" && item.discount) m.set(item.brand, (m.get(item.brand) ?? 0) + 1);
    return m;
  }, [map]);

  const clearAll = () => {
    const snapshot = items;
    clear();
    setConfirm(false);
    toast({ message: "Simpanan dah dikosongkan.", tone: "info", action: { label: "Undo", onClick: () => restore(snapshot, toggle) } });
  };

  return (
    <>
      <Band as="header" tone="gula-kapas" className="mt-3 md:mt-5" labelledBy="saved-title">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-overline uppercase text-ink-2">
              <Heart aria-hidden="true" size={14} strokeWidth={2.5} /> Simpan
            </p>
            <h1 id="saved-title" className="mt-1 flex flex-wrap items-baseline gap-x-3 text-title-1 text-ink">
              Simpanan kau
              <span className={cn("transition-opacity duration-200", mounted ? "opacity-100" : "opacity-0")}>
                <Odometer value={mounted ? count : 0} className="font-num text-ink-2" srText={`${count} item`} />
              </span>
            </h1>
            <p className="mt-2 max-w-[48ch] text-body text-ink-2">Disimpan dalam phone ni je, tak perlu login.</p>
          </div>
          {mounted && count > 0 && (
            <Button variant="ghost" size="sm" icon={<Trash2 aria-hidden="true" />} onClick={() => setConfirm(true)}>
              Kosongkan semua
            </Button>
          )}
        </div>
      </Band>

      <div className="container-page mt-6 md:mt-8">
        {!mounted ? (
          <GridSkeleton count={4} />
        ) : (
          <>
            {drops > 0 && (
              <div role="status" className="mb-5 flex items-center gap-3 rounded-card border-2 border-ink bg-cendol px-4 py-3 shadow-pop-sm">
                <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-ink bg-pandan">
                  <TrendingDown aria-hidden="true" size={18} strokeWidth={2.5} />
                </span>
                <p className="text-body text-ink">
                  <span className="font-semibold">Psst!</span> <span className="font-num">{drops}</span> barang simpanan kau turun harga.
                </p>
              </div>
            )}

            <Tabs
              base={TABS_BASE}
              label="Jenis simpanan"
              value={tab}
              onChange={setTab}
              className="max-w-[420px]"
              items={[
                { value: "produk", label: "Produk", count: savedProducts.length },
                { value: "jenama", label: "Jenama", count: savedBrands.length },
              ]}
            />

            <div role="tabpanel" id={panelId(TABS_BASE, "produk")} aria-labelledby={tabId(TABS_BASE, "produk")} className="tab-panel mt-5" hidden={tab !== "produk"}>
              {entries.length === 0 ? (
                <EmptyState
                  mood="tidur"
                  title="Simpanan kau kosong lagi."
                  body="Tekan ♥ kat mana-mana produk, nanti Oyen simpankan sini (dalam phone kau je)."
                  primary={{ label: "Jom usha promo", href: "/promos", trailing: "arrow" }}
                  secondary={{ label: "Tengok yang baru", href: "/new" }}
                />
              ) : (
                <>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-body-sm text-ink-2" aria-live="polite">
                      {map ? (
                        <>
                          Harga disemak dengan sync terakhir. <span className="text-ink-soft">Confirm kat kedai rasmi sebelum bayar ya.</span>
                        </>
                      ) : error ? (
                        <span className="inline-flex items-center gap-1.5 text-kunyit-pekat">
                          <CircleAlert aria-hidden="true" size={16} /> Tak dapat semak harga terkini. Harga ni masa kau simpan.
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-ink-soft">
                          <span className="dots inline-flex" aria-hidden="true">
                            <i />
                            <i />
                            <i />
                          </span>
                          Tengah semak harga terkini…
                        </span>
                      )}
                    </p>
                    <Select
                      id="saved-sort"
                      aria-label="Susun"
                      value={sort}
                      onChange={(e) => setSort(e.target.value as Sort)}
                      options={SORTS}
                      className="h-11 w-auto min-w-[200px] text-body-sm"
                    />
                  </div>
                  <ul role="list" className={gridColumns()}>
                    {entries.map((e) => (
                      <li key={e.saved.id} className="flex min-w-0 flex-col gap-1.5">
                        <ProductCard product={e.product} syncedAt={syncedAt} className="h-auto flex-1" />
                        <SavedMeta fresh={e.fresh} savedAt={e.saved.savedAt} now={now} currency={e.product.currency} />
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div role="tabpanel" id={panelId(TABS_BASE, "jenama")} aria-labelledby={tabId(TABS_BASE, "jenama")} className="tab-panel mt-5" hidden={tab !== "jenama"}>
              {savedBrands.length === 0 ? (
                <EmptyState
                  mood="tidur"
                  title="Belum ada jenama kegemaran."
                  body="Simpan jenama yang kau suka, senang nak check promo dia nanti."
                  primary={{ label: "Jelajah jenama", href: "/brands", trailing: "arrow" }}
                />
              ) : (
                <ul role="list" className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[...savedBrands]
                    .sort((a, b) => b.savedAt - a.savedAt)
                    .map((b) => (
                      <li key={b.id} className="min-w-0">
                        <SavedBrandRow item={b} promos={map ? (promoByBrand.get(b.brand.slug) ?? 0) : null} now={now} />
                      </li>
                    ))}
                </ul>
              )}
            </div>

            <p className="mt-10 max-w-[70ch] text-caption text-ink-soft">Simpanan disimpan dalam browser ni je. Clear data browser, hilanglah dia.</p>
          </>
        )}
      </div>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Kosongkan semua simpanan?"
        description={`${formatCount(count)} produk dan jenama akan dibuang dari phone ni.`}
        footer={
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="secondary" size="sm" onClick={() => setConfirm(false)}>
              Batal
            </Button>
            <Button variant="danger" size="sm" onClick={clearAll}>
              Kosongkan semua
            </Button>
          </div>
        }
      >
        <p className="text-body text-ink-2">Lepas kosongkan, kau masih boleh tekan Undo sekejap.</p>
      </Modal>
    </>
  );
}

function SavedMeta({ fresh, savedAt, now, currency }: { fresh: Fresh | null; savedAt: number; now: number | null; currency: string }) {
  return (
    <div className="flex min-h-[44px] flex-col items-start gap-1 px-1">
      {fresh?.kind === "drop" && (
        <span className="inline-flex animate-wiggle items-center gap-1 rounded-full border-[1.5px] border-pandan-pekat bg-pandan-tint px-2 py-0.5 text-[12px] font-semibold leading-tight text-pandan-pekat">
          <TrendingDown aria-hidden="true" size={14} strokeWidth={2.5} className="shrink-0" />
          Turun lagi {displayPrice(fresh.amount, currency)} sejak kau simpan!
        </span>
      )}
      {fresh?.kind === "up" && (
        <span className="inline-flex items-center gap-1 text-caption text-ink-soft">
          <TrendingUp aria-hidden="true" size={13} strokeWidth={2.5} /> Naik {displayPrice(fresh.amount, currency)} sejak kau simpan
        </span>
      )}
      {fresh?.kind === "ended" && (
        <span className="inline-flex items-center gap-1 text-caption text-ink-soft">
          <BadgePercent aria-hidden="true" size={13} strokeWidth={2.5} /> Promo dah tamat
        </span>
      )}
      {fresh?.kind === "gone" && (
        <span className="inline-flex items-center gap-1 text-caption text-ink-soft">
          <PackageX aria-hidden="true" size={13} strokeWidth={2.5} /> Dah tak dijual (atau habis stok)
        </span>
      )}
      <span className="text-caption text-ink-soft">
        <Heart aria-hidden="true" size={11} strokeWidth={2.5} className="mr-1 inline align-[-1px]" />
        Disimpan {now == null ? "" : timeAgo(new Date(savedAt).toISOString(), now)}
      </span>
    </div>
  );
}

function SavedBrandRow({ item, promos, now }: { item: SavedBrand; promos: number | null; now: number | null }) {
  const b = item.brand;
  const cat = CATEGORY_BY_SLUG[b.category];
  return (
    <article data-cat={b.category} className="card relative flex min-h-[96px] items-center gap-3 rounded-card border-2 border-garis bg-putih p-3 shadow-card">
      <Monogram slug={b.slug} name={b.name} category={b.category} size={56} tier={b.tier} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="truncate text-[16px] font-semibold leading-tight text-ink">
          <Link href={`/brands/${b.slug}`} transitionTypes={["nav-forward"]} className="stretched-link">
            {b.name}
          </Link>
        </h3>
        <div className="relative z-10 flex flex-wrap items-center gap-1.5">
          <TierCop tier={b.tier} />
          {promos != null &&
            (promos > 0 ? (
              <InfoPill tone="promo" icon={<BadgePercent aria-hidden="true" />}>
                {promos} promo sekarang
              </InfoPill>
            ) : (
              <InfoPill tone="neutral" icon={<Store aria-hidden="true" />}>
                Takde promo sekarang
              </InfoPill>
            ))}
        </div>
        <p className="truncate text-caption text-ink-soft">
          {cat?.nameMs}
          {now != null && ` · Disimpan ${timeAgo(new Date(item.savedAt).toISOString(), now)}`}
        </p>
      </div>
      <div className="relative z-10 shrink-0">
        <SaveBrandButton brand={b} />
      </div>
    </article>
  );
}
