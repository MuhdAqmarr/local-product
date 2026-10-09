import Link from "next/link";
import { ArrowUpRight, Clock3, Sparkles } from "@/components/ui/lucide";
import { TierIcon } from "@/components/art/tier-icon";
import { Monogram } from "@/components/brand/monogram";
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

export interface ProductCardProps {
  product: ProductCardData;
  /** Catalog `syncedAt` (ISO): the clock for "Baru" and the server-rendered relative times. */
  syncedAt: string;
  /** When this brand's prices were last checked (`FeedStatus.fetchedAt`); defaults to `syncedAt`. */
  checkedAt?: string;
  /** The LCP image: eager + fetchpriority high, never fades. */
  priority?: boolean;
  /** Above the fold but not the LCP: eager, never fades. */
  eager?: boolean;
  /** `grid` (default) or `rail` for the matching `sizes`. */
  context?: "grid" | "rail";
  /** Which story the card tells first. Default: promo when discounted, else baru. */
  emphasis?: "promo" | "baru";
  /** Brand pages: show the brand name as plain text (a link back to the current page is a wasted tab stop). */
  hideBrandLink?: boolean;
  className?: string;
}

/**
 * Product card (DESIGN §6.7). Hook-free and server-renderable; also safe to import from client
 * listing components. Islands: PlateImage, SaveButton, RelTime. The whole card is one outbound
 * link (stretched link on the title) to the brand's official store; the brand name and the heart
 * are separate controls above it.
 */
export function ProductCard({ product: p, syncedAt, checkedAt, priority, eager, context = "grid", emphasis, hideBrandLink, className }: ProductCardProps) {
  const level = dealLevel(p.discount);
  const baru = baruKind(p.publishedAt, syncedAt);
  const showPromo = level != null && (emphasis !== "baru" || !baru);
  const tier = TIER_BY_SLUG[p.brandTier];
  const alt = p.title || `Produk ${p.brandName}`;

  const labelParts = [p.title, priceSentence(p)];
  if (baru) labelParts.push("baru dilancar");
  if (!p.available) labelParts.push("habis stok");
  labelParts.push(`buka kedai rasmi ${p.brandName} (tab baru)`);

  return (
    <article
      data-cat={p.brandCategory}
      data-tier={p.brandTier}
      className={cn(
        "card group/card @container flex h-full flex-col rounded-card border-2 border-garis bg-putih p-1.5 shadow-card [contain:layout] md:p-2",
        className,
      )}
    >
      <div className="relative">
        <div className="plate" data-eager={priority || eager ? "" : undefined}>
          <PlateImage
            src={p.image}
            alt={alt}
            width={p.imageW}
            height={p.imageH}
            category={p.brandCategory}
            sizes={PLATE_SIZES[context]}
            priority={priority}
            eager={eager}
            className={p.available ? undefined : "opacity-50"}
          />
          {!p.available && <span className="habis absolute bottom-2 left-2 z-[2]">Habis</span>}
        </div>

        {showPromo ? (
          <DealSticker
            discount={p.discount}
            className={cn(
              "pointer-events-none absolute z-[2] transition-[rotate] duration-200 ease-(--ease-pop)",
              level === 3 ? "-top-2 -left-1.5 group-hover/card:rotate-[-12deg]" : "top-2 left-2",
              level === 2 && "group-hover/card:rotate-[-5deg]",
              level === 1 && "group-hover/card:rotate-[-2deg]",
            )}
          />
        ) : (
          baru && <BaruSticker publishedAt={p.publishedAt} syncedAt={syncedAt} className="pointer-events-none absolute top-2 left-2 z-[2]" />
        )}

        <div className="absolute top-1.5 right-1.5 z-10">
          <SaveButton product={p} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 px-1 pt-2 pb-1">
        <div className="flex min-w-0 items-center gap-1.5">
          <Monogram slug={p.brand} name={p.brandName} category={p.brandCategory} size={20} />
          {hideBrandLink ? (
            <span className="min-w-0 truncate text-label-sm text-ink-soft">{p.brandName}</span>
          ) : (
            <Link
              href={`/brands/${p.brand}`}
              prefetch={false}
              // Padding cancelled by negative margin makes a 44 px tall tap target with no layout change
              // (QA F17); it grows mostly upward so the title link below keeps ≥24 px (axe target-size).
              // Not a ::before: `truncate` clips overflow. It stays well below the save heart.
              className="relative z-10 -mt-[22px] -mb-2 min-w-0 truncate pt-[22px] pb-2 text-label-sm text-ink-soft decoration-2 underline-offset-2 hover:text-ink hover:underline"
            >
              {p.brandName}
            </Link>
          )}
          <TierIcon tier={p.brandTier} size={14} className="shrink-0" />
          <span className="sr-only">Tier: {tier.name}</span>
        </div>

        <h3 className="line-clamp-2 min-h-[2.7em] text-body-sm [overflow-wrap:anywhere] text-ink-2 supports-[height:1lh]:min-h-[2lh]">
          <a href={outboundUrl(p.url)} target="_blank" rel="noopener noreferrer" className="stretched-link block min-h-[inherit]" aria-label={labelParts.join(", ")}>
            {p.title}
          </a>
        </h3>

        <Price price={p.price} compareAt={p.compareAt} discount={p.discount} currency={p.currency} announce={false} />

        <p className="mt-auto flex min-w-0 items-center gap-1 pt-0.5 text-caption text-ink-soft">
          {showPromo ? (
            <>
              {baru && <span className="baru mr-0.5 h-[18px] px-1.5 text-[10px]">Baru</span>}
              <Clock3 size={12} strokeWidth={2.5} aria-hidden="true" className="shrink-0" />
              <RelTime iso={checkedAt ?? syncedAt} base={syncedAt} className="truncate" />
            </>
          ) : baru && p.publishedAt ? (
            <>
              <Sparkles size={12} strokeWidth={2.5} aria-hidden="true" className="shrink-0" />
              <RelTime iso={p.publishedAt} base={syncedAt} prefix="Lancar " className="truncate" />
            </>
          ) : (
            <>
              <Clock3 size={12} strokeWidth={2.5} aria-hidden="true" className="shrink-0" />
              <RelTime iso={checkedAt ?? syncedAt} base={syncedAt} className="truncate" />
            </>
          )}
          <ArrowUpRight size={12} strokeWidth={2.5} aria-hidden="true" className="ml-auto hidden shrink-0 @[180px]:block" />
        </p>
      </div>
    </article>
  );
}
