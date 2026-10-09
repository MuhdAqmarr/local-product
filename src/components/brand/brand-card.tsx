import Link from "next/link";
import { MapPin } from "@/components/ui/lucide";
import { CategoryGlyph } from "@/components/product/category-glyph";
import { PlateImage } from "@/components/product/plate-image";
import { PLATE_SIZES } from "@/components/product/plate-sizes";
import { CATEGORY_BY_SLUG } from "@/lib/taxonomy";
import type { CategorySlug, TierSlug } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BrandLink } from "./brand-link";
import { Monogram } from "./monogram";
import { unpackPreview } from "./preview-url";
import { SaveBrandButton } from "./save-brand-button";
import { TierCop } from "./tier-cop";

/** The BrandSummary fields a card needs (import type only from `@/lib/catalog`). */
export interface BrandCardData {
  slug: string;
  name: string;
  category: CategorySlug;
  tier: TierSlug;
  description: string;
  state?: string;
  /** We can read this brand's store (it may still list zero products right now). */
  hasFeed: boolean;
  live: boolean;
  promoCount: number;
  newCount: number;
  /** Full URLs, or Shopify file paths packed with `packPreview` (see ./preview-url). */
  previews: string[];
}

export interface BrandCardProps {
  brand: BrandCardData;
  /**
   * `card` (default): the kedai card at every width (rails, spotlight).
   * `auto`: one DOM that renders as the compact brand row below 480 px and as the kedai card from
   * 480 px (directory and category grids; brand.css `.kedai-auto`).
   */
  layout?: "card" | "auto";
  /** Monogram morphs into the brand profile. Only where this brand is unique on the page. */
  morph?: boolean;
  /** `true` = Next's viewport prefetch. Default: prefetch on intent only (hover, touch, focus). */
  prefetch?: boolean;
  className?: string;
}

/** "{n} promo · {m} baru" counts + live dot (shared by card and row). */
export function BrandCounts({
  brand,
  className,
}: {
  brand: Pick<BrandCardData, "promoCount" | "newCount" | "live"> & { hasFeed?: boolean };
  className?: string;
}) {
  if (!brand.live && !brand.promoCount && !brand.newCount) {
    return (
      <p className={cn("text-caption text-ink-soft", className)}>
        {brand.hasFeed ? "Rak online kosong buat masa ni" : "Kedai ni belum boleh disync"}
      </p>
    );
  }
  return (
    <p className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {brand.promoCount > 0 && (
        <span className="kedai-promo inline-flex h-6 items-center rounded-full bg-bandung-tint px-2.5 text-label-sm text-bandung-pekat">
          <span className="font-num mr-1 text-[13px] leading-none">{brand.promoCount}</span>promo
        </span>
      )}
      {brand.newCount > 0 && (
        <span className="inline-flex h-6 items-center rounded-full bg-pandan-tint px-2.5 text-label-sm text-pandan-pekat">
          <span className="font-num mr-1 text-[13px] leading-none">{brand.newCount}</span>baru
        </span>
      )}
      {brand.live && (
        <span className="inline-flex h-6 items-center gap-1.5 px-1 text-label-sm text-pandan-pekat">
          <span className="live-dot" aria-hidden="true" />
          Live
        </span>
      )}
    </p>
  );
}

/** Directory / category grids: 44 px row thumbs below 480 px, ~80 px card thumbs from 1024 px. */
const AUTO_SIZES = "(max-width:479.98px) 44px, (min-width:1024px) 80px, 16vw";

/** Three 1:1 preview thumbs; tint tiles with the category icon where a photo is missing. */
export function BrandCollage({
  previews,
  category,
  name,
  sizes = PLATE_SIZES.collage,
  className,
}: {
  previews: string[];
  category: CategorySlug;
  name: string;
  sizes?: string;
  className?: string;
}) {
  return (
    <ul className={cn("grid shrink-0 grid-cols-3 gap-1.5", className)} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <li key={i} className="plate rounded-thumb">
          {previews[i] ? (
            <PlateImage src={unpackPreview(previews[i])} alt={`Produk ${name}`} category={category} sizes={sizes} glyph={22} />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-(--cat-ink) opacity-40">
              <CategoryGlyph category={category} size={22} />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * Brand "kedai card" (DESIGN §6.8): awning, songket band, die-cut monogram, tier cop, meta,
 * 2-line description, photo collage, live counts. Brands are shops; the whole card links to
 * /brands/{slug} via a stretched link on the name; heart and cop are separate controls.
 * `layout="auto"` turns the same DOM into the compact brand row below 480 px (QA F03).
 */
export function BrandCard({ brand: b, layout = "card", morph, prefetch, className }: BrandCardProps) {
  const cat = CATEGORY_BY_SLUG[b.category];
  const auto = layout === "auto";
  const href = `/brands/${b.slug}`;
  const linkClass = cn("stretched-link", "kedai-link");
  return (
    <article
      data-cat={b.category}
      data-tier={b.tier}
      className={cn("pop", "kedai-card", auto && "kedai-auto", auto && !b.promoCount && "kedai-nopromo", className)}
    >
      <div className={cn("pop-face rounded-card-lg border-2 border-ink bg-putih", "kedai-face")}>
        <div className={cn("relative h-[68px] shrink-0 bg-(--cat-tint)", "kedai-band")}>
          <span className="songket" aria-hidden="true" />
          <div className={cn("awning-wrap absolute inset-x-0 top-0 border-t-0", "kedai-awning")} aria-hidden="true">
            <div className="awning" style={{ "--awning": "var(--cat-pop)", "--awning-h": "20px" } as React.CSSProperties} />
          </div>
          <div className="absolute top-6 right-2.5 z-10">
            <SaveBrandButton brand={{ slug: b.slug, name: b.name, category: b.category, tier: b.tier }} />
          </div>
        </div>

        <div className={cn("flex flex-1 flex-col gap-2.5 px-4 pb-4", "kedai-body")}>
          <div className={cn("-mt-7 flex items-end gap-2", "kedai-monowrap")}>
            <Monogram slug={b.slug} name={b.name} category={b.category} size={56} tier={b.tier} morph={morph} className={"kedai-mono"} />
          </div>
          <div className={cn("flex min-w-0 flex-col gap-1.5", "kedai-text")}>
            <h3 className={cn("truncate text-title-3 text-ink", "kedai-name")}>
              {prefetch ? (
                <Link href={href} prefetch transitionTypes={["nav-forward"]} className={linkClass}>
                  {b.name}
                </Link>
              ) : (
                <BrandLink href={href} transitionTypes={["nav-forward"]} className={linkClass}>
                  {b.name}
                </BrandLink>
              )}
            </h3>
            <div className={cn("flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5", "kedai-meta")}>
              <TierCop tier={b.tier} className="max-w-full" />
              <span className="inline-flex max-w-full min-w-0 items-center gap-1 text-caption text-ink-soft">
                <MapPin aria-hidden="true" size={14} strokeWidth={2.5} className="shrink-0" />
                <span className="truncate">
                  {cat.nameMs}
                  {b.state ? ` · ${b.state}` : ""}
                </span>
              </span>
            </div>
          </div>
          <p className={cn("line-clamp-2 min-h-[2.7em] text-body-sm text-ink-2", "kedai-desc")}>{b.description}</p>
          <BrandCollage
            previews={b.previews}
            category={b.category}
            name={b.name}
            sizes={auto ? AUTO_SIZES : PLATE_SIZES.collage}
            className="kedai-collage"
          />
          <BrandCounts brand={b} className="kedai-counts mt-auto pt-0.5" />
        </div>
      </div>
    </article>
  );
}
