"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpDown, BadgePercent, CalendarDays, Check, SlidersHorizontal, Wallet } from "lucide-react";
import { CategoryChip } from "@/components/category/category-chip";
import { Chip } from "@/components/ui/chip";
import { CountBubble } from "@/components/ui/count-bubble";
import { CATEGORY_SLUGS, DEFAULT_SORT, priceId, SORT_OPTIONS, activeCount } from "@/components/listing/listing-model";
import { cn } from "@/lib/utils";
import { toggle, type ControlProps } from "./filter-controls";

export interface FilterBarProps extends ControlProps {
  onOpenSheet: () => void;
  /** First pointer/focus on the bar: warm the sheet chunk and the full list. */
  onIntent?: () => void;
  className?: string;
}

const QUICK_DISCOUNT = 40;
const QUICK_PRICE = { min: 0, max: 50 };

/**
 * Mobile sticky filter bar (DESIGN §6.6, < 1024 px): part of the header sticky stack
 * (`.sticky-stack`, hides with the header on scroll down). [Tapis + count] · scrolling quick chips
 * (deal / price / time shortcuts, then categories with counts) · sort popover. A hairline fades in
 * once the bar is stuck.
 */
export function FilterBar({ kind, value, facets, onChange, onOpenSheet, onIntent, className }: FilterBarProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const sortId = `sort-${uid}`;
  const sentinel = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const n = activeCount(value);
  const sortChanged = value.susun !== DEFAULT_SORT[kind];

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    // The sentinel sits right above the bar: once it passes under the header, the bar is stuck.
    const io = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting && entry.boundingClientRect.top < 100), {
      rootMargin: "-100px 0px 0px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const quickDiscount = value.diskaun === QUICK_DISCOUNT;
  const quickPrice = value.harga != null && priceId(value.harga) === priceId(QUICK_PRICE);

  return (
    <>
      <div ref={sentinel} aria-hidden className="h-0 lg:hidden" />
      <div
        className={cn("sticky-stack lg:hidden", className)}
        onPointerDownCapture={onIntent}
        onFocusCapture={onIntent}
      >
        <div
          className={cn(
            "h-(--filterbar-h) border-b-2 bg-santan/96 transition-[border-color] duration-200",
            stuck ? "border-garis" : "border-transparent",
          )}
        >
          <div className="container-page flex h-full items-center gap-2">
            <button
              type="button"
              onClick={onOpenSheet}
              onPointerEnter={onIntent}
              aria-haspopup="dialog"
              aria-label={n > 0 ? `Tapis, ${n} tapisan aktif` : "Tapis"}
              className="pop group relative shrink-0"
              style={{ ["--pop-offset" as string]: "2px" }}
            >
              <span className="pop-face h-9 gap-1.5 bg-putih pl-2.5 pr-3 text-label text-ink">
                <SlidersHorizontal aria-hidden size={18} strokeWidth={2.25} />
                Tapis
              </span>
              <CountBubble count={n} className="absolute -right-1.5 -top-1.5 z-10" />
            </button>

            <div
              role="group"
              aria-label="Tapis pantas"
              data-lenis-prevent-horizontal=""
              className="no-scrollbar edge-fade flex min-w-0 flex-1 snap-x snap-proximity items-center gap-2 overflow-x-auto px-1 py-1 [--fade:16px] *:snap-start"
            >
              {kind === "promos" ? (
                <Chip
                  dense
                  icon={<BadgePercent strokeWidth={2.25} />}
                  selected={quickDiscount}
                  onClick={() => onChange({ diskaun: quickDiscount ? 0 : QUICK_DISCOUNT })}
                >
                  Diskaun 40%+
                </Chip>
              ) : (
                <Chip
                  dense
                  icon={<CalendarDays strokeWidth={2.25} />}
                  selected={value.masa === "minggu"}
                  count={facets?.masa.minggu}
                  onClick={() => onChange({ masa: value.masa === "minggu" ? "bulan" : "minggu" })}
                >
                  Minggu ni
                </Chip>
              )}
              <Chip dense icon={<Wallet strokeWidth={2.25} />} selected={quickPrice} onClick={() => onChange({ harga: quickPrice ? null : QUICK_PRICE })}>
                Bawah RM50
              </Chip>
              <span aria-hidden className="mx-0.5 h-5 w-px shrink-0 bg-garis-kuat" />
              {CATEGORY_SLUGS.map((slug) => (
                <CategoryChip
                  key={slug}
                  dense
                  category={slug}
                  selected={value.kat.includes(slug)}
                  count={facets ? (facets.kat[slug] ?? 0) : undefined}
                  onToggle={() => onChange({ kat: toggle(value.kat, slug) })}
                />
              ))}
            </div>

            <button
              type="button"
              popoverTarget={sortId}
              aria-label={`Susun: ${SORT_OPTIONS[kind].find((o) => o.value === value.susun)?.label ?? ""}`}
              className="relative grid size-10 shrink-0 place-items-center rounded-full border-[1.5px] border-garis-kuat bg-putih text-ink transition-transform active:scale-[.92]"
              style={{ ["anchorName" as string]: `--${sortId}` }}
            >
              <ArrowUpDown aria-hidden size={18} strokeWidth={2.25} />
              {sortChanged && <span aria-hidden className="absolute right-0.5 top-0.5 size-2.5 rounded-full border-[1.5px] border-santan bg-bandung" />}
            </button>
            <div
              id={sortId}
              popover="auto"
              role="dialog"
              aria-label="Susun"
              data-align="end"
              className="pop-panel anchored-panel w-[min(280px,calc(100vw-32px))] rounded-card-lg border-2 border-ink bg-putih p-2 text-ink shadow-float"
              style={{ ["positionAnchor" as string]: `--${sortId}` }}
            >
              <p className="px-3 pb-1 pt-2 text-overline uppercase text-ink-soft">Susun ikut</p>
              <div role="radiogroup" aria-label="Susun">
                {SORT_OPTIONS[kind].map((o) => {
                  const on = o.value === value.susun;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => {
                        onChange({ susun: o.value });
                        document.getElementById(sortId)?.hidePopover?.();
                      }}
                      className={cn(
                        "flex min-h-11 w-full items-center gap-2.5 rounded-thumb px-3 text-left text-body-sm transition-colors",
                        on ? "bg-bandung-tint font-semibold text-ink" : "text-ink-2 hover:bg-kapas",
                      )}
                    >
                      <span aria-hidden className="grid size-5 shrink-0 place-items-center">
                        {on && <Check size={18} strokeWidth={2.5} className="animate-pop-in" />}
                      </span>
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
