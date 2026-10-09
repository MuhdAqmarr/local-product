import Link from "next/link";
import { MapPin } from "@/components/ui/lucide";
import { CategoryGlyph } from "@/components/product/category-glyph";
import { PlateImage } from "@/components/product/plate-image";
import { PLATE_SIZES } from "@/components/product/plate-sizes";
import { CATEGORY_BY_SLUG } from "@/lib/taxonomy";
import type { CategorySlug, TierSlug } from "@/lib/types";
import { cn } from "@/lib/utils";
import "./brand.css";
import { Monogram } from "./monogram";
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
  live: boolean;
  promoCount: number;
  newCount: number;
  previews: string[];
}

export interface BrandCardProps {
  brand: BrandCardData;
  /** Monogram morphs into the brand profile. Only where this brand is unique on the page. */
  morph?: boolean;
  /** Prefetch the brand page (default: Next's viewport prefetch). */
  prefetch?: boolean;
  className?: string;
}

/** "{n} promo · {m} baru" counts + live dot (shared by card and row). */
export function BrandCounts({ brand, className }: { brand: Pick<BrandCardData, "promoCount" | "newCount" | "live">; className?: string }) {
  if (!brand.live && !brand.promoCount && !brand.newCount) {
    return <p className={cn("text-caption text-ink-soft", className)}>Kedai ni belum boleh disync</p>;
  }
  return (
    <p className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {brand.promoCount > 0 && (
        <span className="inline-flex h-6 items-center rounded-full bg-bandung-tint px-2.5 text-label-sm text-bandung-pekat">
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

/** Three 1:1 preview thumbs; tint tiles with the category icon where a photo is missing. */
export function BrandCollage({ previews, category, name, size = "card" }: { previews: string[]; category: CategorySlug; name: string; size?: "card" | "row" }) {
  const cells = [0, 1, 2];
  return (
    <ul className={cn("grid shrink-0 grid-cols-3", size === "card" ? "gap-1.5" : "w-[144px] gap-1")} aria-hidden="true">
      {cells.map((i) => (
        <li key={i} className={cn("plate", size === "card" ? "rounded-thumb" : "rounded-[10px]")}>
          {previews[i] ? (
            <PlateImage src={previews[i]} alt={`Produk ${name}`} category={category} sizes={size === "card" ? PLATE_SIZES.collage : "44px"} glyph={size === "card" ? 22 : 16} />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-(--cat-ink) opacity-40">
              <CategoryGlyph category={category} size={size === "card" ? 22 : 16} />
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
 */
export function BrandCard({ brand: b, morph, prefetch, className }: BrandCardProps) {
  const cat = CATEGORY_BY_SLUG[b.category];
  return (
    <article data-cat={b.category} data-tier={b.tier} className={cn("pop", "kedai-card", className)}>
      <div className={cn("pop-face rounded-card-lg border-2 border-ink bg-putih", "kedai-face")}>
        <div className="relative h-[68px] shrink-0 bg-(--cat-tint)">
          <span className="songket" aria-hidden="true" />
          <div className={cn("awning-wrap absolute inset-x-0 top-0 border-t-0", "kedai-awning")} aria-hidden="true">
            <div className="awning" style={{ "--awning": "var(--cat-pop)", "--awning-h": "20px" } as React.CSSProperties} />
          </div>
          <div className="absolute top-6 right-2.5 z-10">
            <SaveBrandButton brand={{ slug: b.slug, name: b.name, category: b.category, tier: b.tier }} />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2.5 px-4 pb-4">
          <div className="-mt-7 flex items-end gap-2">
            <Monogram slug={b.slug} name={b.name} category={b.category} size={56} tier={b.tier} morph={morph} className={"kedai-mono"} />
          </div>
          <div className="flex min-w-0 flex-col gap-1.5">
            <h3 className="truncate text-title-3 text-ink">
              <Link href={`/brands/${b.slug}`} prefetch={prefetch} transitionTypes={["nav-forward"]} className={cn("stretched-link", "kedai-link")}>
                {b.name}
              </Link>
            </h3>
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
              <TierCop tier={b.tier} />
              <span className="inline-flex min-w-0 items-center gap-1 text-caption text-ink-soft">
                <MapPin aria-hidden="true" size={14} strokeWidth={2.5} className="shrink-0" />
                <span className="truncate">
                  {cat.nameMs}
                  {b.state ? ` · ${b.state}` : ""}
                </span>
              </span>
            </div>
          </div>
          <p className="line-clamp-2 min-h-[2.7em] text-body-sm text-ink-2">{b.description}</p>
          <BrandCollage previews={b.previews} category={b.category} name={b.name} />
          <BrandCounts brand={b} className="mt-auto pt-0.5" />
        </div>
      </div>
    </article>
  );
}
