"use client";

import { useRef, type KeyboardEvent, type ReactNode } from "react";
import { Check, Search, X } from "@/components/ui/lucide";
import { TierIcon } from "@/components/art/tier-icon";
import { TIER_COPY } from "@/components/brand/tier-cop";
import { CategoryChip } from "@/components/category/category-chip";
import { CategoryGlyph } from "@/components/product/category-glyph";
import { chipClasses } from "@/components/ui/chip";
import { Segmented } from "@/components/ui/segmented";
import {
  CATEGORY_SLUGS,
  DISCOUNT_STEPS,
  discountLabel,
  PRICE_PRESETS,
  priceId,
  priceLabel,
  SORT_OPTIONS,
  TIER_SLUGS,
  type Facets,
  type FilterState,
  type ListingKind,
  type Masa,
  type PriceRange,
  type SortKey,
} from "@/components/listing/listing-model";
import { formatCount } from "@/lib/format";
import { CATEGORY_BY_SLUG, TIER_BY_SLUG } from "@/lib/taxonomy";
import type { CategorySlug, TierSlug } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface ControlProps {
  kind: ListingKind;
  value: FilterState;
  facets: Facets | null;
  onChange: (patch: Partial<FilterState>, options?: { animate?: boolean }) => void;
}

export const NOUN: Record<ListingKind, string> = { promos: "promo", new: "produk" };

export function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

/* ------------------------------------------------------------------ */
/* Section shell                                                       */
/* ------------------------------------------------------------------ */

export function FilterSection({ title, children, className, id }: { title: ReactNode; children: ReactNode; className?: string; id?: string }) {
  return (
    <section aria-labelledby={id} className={cn("flex flex-col gap-2.5", className)}>
      <h3 id={id} className="text-overline uppercase text-ink-soft">
        {title}
      </h3>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Radio pills (role="radiogroup", chip look, roving focus)            */
/* ------------------------------------------------------------------ */

export interface RadioPillOption<V extends string> {
  value: V;
  label: ReactNode;
  icon?: ReactNode;
  count?: number;
}

export function RadioPills<V extends string>({
  options,
  value,
  onChange,
  label,
  className,
  dense,
  check = true,
}: {
  options: RadioPillOption<V>[];
  value: V;
  onChange: (v: V) => void;
  label: string;
  className?: string;
  dense?: boolean;
  /** Show the popping Check on the selected pill (off for tight equal-width grids). */
  check?: boolean;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  const onKeyDown = (event: KeyboardEvent) => {
    const step: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(event.key in step)) return;
    event.preventDefault();
    const next = (index + step[event.key] + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  };
  return (
    <div role="radiogroup" aria-label={label} onKeyDown={onKeyDown} className={cn("flex flex-wrap gap-2", className)}>
      {options.map((o, i) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(o.value)}
            className={cn(chipClasses(on, dense), !o.icon && !(on && check) && "pl-3.5")}
          >
            {(o.icon || (on && check)) && (
              <span aria-hidden className="grid size-[18px] shrink-0 place-items-center [&>svg]:size-[18px]">
                {on && check ? <Check strokeWidth={2.5} className="animate-pop-in" /> : o.icon}
              </span>
            )}
            <span className="leading-tight">{o.label}</span>
            {o.count != null && <span className="font-num text-[13px] text-ink-soft">{formatCount(o.count)}</span>}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Checkbox rows (desktop sidebar)                                     */
/* ------------------------------------------------------------------ */

export function CheckRow({
  checked,
  onChange,
  icon,
  children,
  count,
  type = "checkbox",
  name,
  dataCat,
  dataTier,
}: {
  checked: boolean;
  onChange: () => void;
  icon?: ReactNode;
  children: ReactNode;
  count?: number;
  type?: "checkbox" | "radio";
  name?: string;
  dataCat?: string;
  dataTier?: string;
}) {
  const muted = count === 0 && !checked;
  return (
    <label
      data-cat={dataCat}
      data-tier={dataTier}
      className={cn(
        "group/row -mx-2 flex min-h-10 cursor-pointer items-center gap-2.5 rounded-thumb px-2 text-body-sm text-ink transition-colors duration-150 hover:bg-kapas",
        muted && "text-ink-soft",
      )}
    >
      <input type={type} name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden
        className={cn(
          "grid size-5 shrink-0 place-items-center border-2 transition-[background-color,border-color] duration-150",
          type === "radio" ? "rounded-full" : "rounded-[6px]",
          checked ? "border-ink bg-bandung" : "border-garis-kuat bg-putih group-hover/row:border-ink",
          "peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-telang",
        )}
      >
        {checked &&
          (type === "radio" ? (
            <span className="size-2 rounded-full bg-ink animate-pop-in" />
          ) : (
            <Check size={14} strokeWidth={3} className="text-ink animate-pop-in" />
          ))}
      </span>
      {icon && <span className="grid size-5 shrink-0 place-items-center text-(--cat-ink,var(--color-ink))">{icon}</span>}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {count != null && <span className="font-num text-[13px] text-ink-soft tabular-nums">{formatCount(count)}</span>}
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Text filter                                                         */
/* ------------------------------------------------------------------ */

export function TextFilter({ id, value, onChange, placeholder, className }: { id: string; value: string; onChange: (q: string) => void; placeholder: string; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-3.5 grid place-items-center text-ink-soft">
        <Search size={20} />
      </span>
      <input
        id={id}
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        value={value}
        maxLength={60}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-input border-[1.5px] border-garis-kuat bg-putih pl-11 pr-11 text-[16px] text-ink placeholder:text-ink-soft focus:border-telang focus:shadow-[0_0_0_4px_rgb(91_43_201/.18)] focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          aria-label="Kosongkan carian"
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-1 my-auto grid size-10 place-items-center rounded-full text-ink-soft hover:bg-kapas hover:text-ink"
        >
          <X size={18} strokeWidth={2.5} aria-hidden />
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Facet controls                                                      */
/* ------------------------------------------------------------------ */

export function SortControl({ kind, value, onChange, dense }: ControlProps & { dense?: boolean }) {
  return (
    <RadioPills<SortKey>
      label="Susun"
      dense={dense}
      options={SORT_OPTIONS[kind].map((o) => ({ value: o.value, label: o.label }))}
      value={value.susun}
      onChange={(susun) => onChange({ susun })}
    />
  );
}

export function SortRows({ kind, value, onChange, name }: ControlProps & { name: string }) {
  return (
    <div role="radiogroup" aria-label="Susun" className="flex flex-col">
      {SORT_OPTIONS[kind].map((o) => (
        <CheckRow key={o.value} type="radio" name={name} checked={value.susun === o.value} onChange={() => onChange({ susun: o.value })}>
          {o.label}
        </CheckRow>
      ))}
    </div>
  );
}

const DISCOUNT_OPTIONS = DISCOUNT_STEPS.map((d) => ({ value: String(d), label: d === 0 ? "Semua" : `${d}%+`, ariaLabel: d === 0 ? "Semua diskaun" : `Diskaun ${d}% ke atas` }));

export function DiscountControl({ value, onChange }: ControlProps) {
  return (
    <Segmented
      label="Diskaun minimum"
      size="sm"
      options={DISCOUNT_OPTIONS}
      value={String(value.diskaun)}
      onChange={(v) => onChange({ diskaun: Number(v) })}
      className="[&_button]:px-0.5"
    />
  );
}

export function DiscountPills({ value, onChange }: ControlProps) {
  return (
    <RadioPills
      label="Diskaun minimum"
      dense
      check={false}
      className="grid grid-cols-3 [&>button]:justify-center [&>button]:px-1"
      options={DISCOUNT_STEPS.map((d) => ({ value: String(d), label: discountLabel(d) }))}
      value={String(value.diskaun)}
      onChange={(v) => onChange({ diskaun: Number(v) })}
    />
  );
}

const MASA_LABEL: Record<Masa, string> = { minggu: "Minggu ni", bulan: "Bulan ni" };

export function MasaControl({ value, onChange, size = "md", className }: ControlProps & { size?: "md" | "sm"; className?: string }) {
  return (
    <Segmented<Masa>
      label="Tempoh launch"
      size={size}
      className={className}
      options={(["minggu", "bulan"] as const).map((m) => ({ value: m, label: MASA_LABEL[m] }))}
      value={value.masa}
      onChange={(masa) => onChange({ masa })}
    />
  );
}

/** 2-column chip grid with counts (Tapis sheet). */
export function CategoryGrid({ value, onChange, facets }: ControlProps) {
  return (
    <div role="group" aria-label="Kategori" className="grid grid-cols-2 gap-2 [&_a]:w-full [&_button]:w-full [&_button]:justify-start [&_button>span:nth-child(2)]:flex-1 [&_button>span:nth-child(2)]:truncate [&_button>span:nth-child(2)]:text-left">
      {CATEGORY_SLUGS.map((slug) => (
        <CategoryChip
          key={slug}
          category={slug}
          selected={value.kat.includes(slug)}
          count={facets ? (facets.kat[slug] ?? 0) : undefined}
          onToggle={() => onChange({ kat: toggle(value.kat, slug) })}
        />
      ))}
    </div>
  );
}

export function CategoryRows({ value, onChange, facets }: ControlProps) {
  return (
    <div role="group" aria-label="Kategori" className="flex flex-col">
      {CATEGORY_SLUGS.map((slug: CategorySlug) => (
        <CheckRow
          key={slug}
          dataCat={slug}
          checked={value.kat.includes(slug)}
          onChange={() => onChange({ kat: toggle(value.kat, slug) })}
          icon={<CategoryGlyph category={slug} size={18} />}
          count={facets ? (facets.kat[slug] ?? 0) : undefined}
        >
          {CATEGORY_BY_SLUG[slug].nameMs}
        </CheckRow>
      ))}
    </div>
  );
}

/** Three tall toggle cards with the kawaii tier icon + tagline (Tapis sheet). */
export function TierCards({ value, onChange, facets }: ControlProps) {
  return (
    <div role="group" aria-label="Saiz jenama" className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-3">
      {TIER_SLUGS.map((t: TierSlug) => {
        const on = value.tier.includes(t);
        const count = facets ? (facets.tier[t] ?? 0) : undefined;
        return (
          <button
            key={t}
            type="button"
            data-tier={t}
            data-tier-trigger=""
            data-active={on ? "true" : undefined}
            aria-pressed={on}
            onClick={() => onChange({ tier: toggle(value.tier, t) })}
            className={cn(
              "relative flex items-center gap-3 rounded-card p-3 text-left transition-[background-color,transform] duration-150 active:scale-[.97] min-[400px]:flex-col min-[400px]:items-start min-[400px]:gap-1.5",
              on ? "border-2 border-ink bg-(--tier-tint) shadow-pop-sm" : "border-[1.5px] border-garis-kuat bg-putih hover:bg-kapas",
            )}
          >
            <TierIcon tier={t} size={36} className="shrink-0" />
            <span className="flex min-w-0 flex-col">
              <span className="text-label text-ink">{TIER_BY_SLUG[t].name}</span>
              <span className="line-clamp-2 text-caption text-ink-soft">{TIER_COPY[t].line.split(".")[0]}.</span>
              {count != null && (
                <span className="mt-0.5 text-caption text-ink-soft">
                  <span className="font-num text-ink">{formatCount(count)}</span> item
                </span>
              )}
            </span>
            {on && (
              <span aria-hidden className="absolute right-2 top-2 grid size-5 place-items-center rounded-full border-2 border-ink bg-putih">
                <Check size={12} strokeWidth={3} className="animate-pop-in" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function TierRows({ value, onChange, facets }: ControlProps) {
  return (
    <div role="group" aria-label="Saiz jenama" className="flex flex-col">
      {TIER_SLUGS.map((t) => (
        <CheckRow
          key={t}
          dataTier={t}
          checked={value.tier.includes(t)}
          onChange={() => onChange({ tier: toggle(value.tier, t) })}
          icon={<TierIcon tier={t} size={20} />}
          count={facets ? (facets.tier[t] ?? 0) : undefined}
        >
          {TIER_BY_SLUG[t].name}
        </CheckRow>
      ))}
    </div>
  );
}

/** Preset ranges plus the active custom range from a link (e.g. Home's "Bawah RM30"). */
export function priceOptions(current: PriceRange | null): PriceRange[] {
  const list = PRICE_PRESETS.map((p) => p.range);
  if (current && !list.some((r) => priceId(r) === priceId(current))) list.push(current);
  return list.sort((a, b) => a.min - b.min || (a.max ?? Infinity) - (b.max ?? Infinity));
}

/** Honesty note under the Harga control: RM bands never match US$ items, so say how many are left out. */
function NonMyrNote({ value, facets }: Pick<ControlProps, "value" | "facets">) {
  const n = value.harga && facets ? facets.nonMyr : 0;
  if (!n) return null;
  return <p className="mt-2 text-caption text-ink-2">Produk dalam US$ ({formatCount(n)}) tak termasuk dalam tapisan harga RM.</p>;
}

export function PriceChips({ value, onChange, facets }: ControlProps) {
  const active = value.harga ? priceId(value.harga) : "";
  return (
    <>
      <RadioPills
        label="Harga"
        options={[{ value: "", label: "Semua harga" }, ...priceOptions(value.harga).map((r) => ({ value: priceId(r), label: priceLabel(r), count: facets ? (facets.harga[priceId(r)] ?? 0) : undefined }))]}
        value={active}
        onChange={(id) => onChange({ harga: id ? (priceOptions(value.harga).find((r) => priceId(r) === id) ?? null) : null })}
      />
      <NonMyrNote value={value} facets={facets} />
    </>
  );
}

export function PriceRows({ value, onChange, facets, name }: ControlProps & { name: string }) {
  const active = value.harga ? priceId(value.harga) : "";
  return (
    <>
      <div role="radiogroup" aria-label="Harga" className="flex flex-col">
        <CheckRow type="radio" name={name} checked={active === ""} onChange={() => onChange({ harga: null })}>
          Semua harga
        </CheckRow>
        {priceOptions(value.harga).map((r) => (
          <CheckRow key={priceId(r)} type="radio" name={name} checked={active === priceId(r)} onChange={() => onChange({ harga: r })} count={facets ? (facets.harga[priceId(r)] ?? 0) : undefined}>
            {priceLabel(r)}
          </CheckRow>
        ))}
      </div>
      <NonMyrNote value={value} facets={facets} />
    </>
  );
}

