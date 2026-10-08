import Link from "next/link";
import { ArrowUpRight, Clock3, Sparkles } from "lucide-react";
import { TierIcon } from "@/components/art/tier-icon";
import { dealLevel } from "@/lib/deal";
import { outboundUrl } from "@/lib/format";
import { TIER_BY_SLUG } from "@/lib/taxonomy";
import type { ProductCardData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BaruSticker, baruKind } from "./baru-sticker";
import { DealSticker } from "./deal-sticker";
import { PlateImage } from "./plate-image";
import { PLATE_SIZES } from "./plate-sizes";
import { Price } from "./price";
import { priceSentence } from "./price-text";
import { RelTime } from "./rel-time";
import { SaveButton } from "./save-button";

export interface ProductRowProps {
  product: ProductCardData;
  syncedAt: string;
  checkedAt?: string;
  eager?: boolean;
  emphasis?: "promo" | "baru";
  className?: string;
}

/**
 * "Senarai" list row (DESIGN §6.7): 88 px, 72 px plate, text right, sticker inline before the
 * price. About 6 rows per phone screen for power scanners. Hook-free like ProductCard.
 */
export function ProductRow({ product: p, syncedAt, checkedAt, eager, emphasis, className }: ProductRowProps) {
  const level = dealLevel(p.discount);
  const baru = baruKind(p.publishedAt, syncedAt);
  const showPromo = level != null && (emphasis !== "baru" || !baru);
  const tier = TIER_BY_SLUG[p.brandTier];

  const label = [p.title, priceSentence(p), baru ? "baru dilancar" : null, p.available ? null : "habis stok", `buka kedai rasmi ${p.brandName} (tab baru)`]
    .filter(Boolean)
    .join(", ");

  return (
    <article
      data-cat={p.brandCategory}
      className={cn(
        "card group/card flex min-h-[88px] items-center gap-3 rounded-card border-2 border-garis bg-putih py-1.5 pr-1.5 pl-1.5 shadow-card",
        className,
      )}
    >
      <div className="relative shrink-0">
      <div className="plate w-[72px] rounded-thumb" data-eager={eager ? "" : undefined}>
        <PlateImage
          src={p.image}
          alt={p.title || `Produk ${p.brandName}`}
          width={p.imageW}
          height={p.imageH}
          category={p.brandCategory}
          sizes={PLATE_SIZES.row}
          eager={eager}
          glyph={24}
          className={p.available ? undefined : "opacity-50"}
        />
      </div>
        {showPromo && level === 3 && (
          <DealSticker discount={p.discount} size="mini" className="pointer-events-none absolute -top-2 -left-2 z-[2] text-[12px]" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5 py-0.5">
        <div className="flex min-w-0 items-center gap-1">
          <Link
            href={`/brands/${p.brand}`}
            prefetch={false}
            className="relative z-10 -my-1 min-w-0 truncate py-1 text-label-sm text-ink-soft decoration-2 underline-offset-2 hover:text-ink hover:underline"
          >
            {p.brandName}
          </Link>
          <TierIcon tier={p.brandTier} size={14} className="shrink-0" />
          <span className="sr-only">Tier: {tier.name}</span>
        </div>
        <h3 className="line-clamp-1 text-body-sm [overflow-wrap:anywhere] text-ink-2 xs:line-clamp-2">
          <a href={outboundUrl(p.url)} target="_blank" rel="noopener noreferrer" className="stretched-link" aria-label={label}>
            {p.title}
          </a>
        </h3>
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          {showPromo ? (
            level !== 3 && <DealSticker discount={p.discount} size="mini" />
          ) : (
            baru && <BaruSticker publishedAt={p.publishedAt} syncedAt={syncedAt} />
          )}
          <Price price={p.price} compareAt={p.compareAt} discount={p.discount} currency={p.currency} announce={false} jimat="never" />
          {!p.available && <span className="habis">Habis</span>}
        </div>
        <p className="flex min-w-0 items-center gap-1 text-caption text-ink-soft">
          {showPromo || !baru || !p.publishedAt ? (
            <>
              <Clock3 size={12} strokeWidth={2.5} aria-hidden="true" className="shrink-0" />
              <RelTime iso={checkedAt ?? syncedAt} base={syncedAt} className="truncate" />
            </>
          ) : (
            <>
              <Sparkles size={12} strokeWidth={2.5} aria-hidden="true" className="shrink-0" />
              <RelTime iso={p.publishedAt} base={syncedAt} prefix="Lancar " className="truncate" />
            </>
          )}
          <ArrowUpRight size={12} strokeWidth={2.5} aria-hidden="true" className="shrink-0" />
        </p>
      </div>

      <div className="relative z-10 shrink-0 self-start">
        <SaveButton product={p} />
      </div>
    </article>
  );
}
