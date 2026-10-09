import Link from "next/link";
import { MapPin } from "@/components/ui/lucide";
import { CATEGORY_BY_SLUG } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";
import { BrandCollage, type BrandCardData } from "./brand-card";
import { Monogram } from "./monogram";
import { TierCop } from "./tier-cop";

export interface BrandRowProps {
  brand: BrandCardData;
  /** Show the 3 photo thumbs at the right (default). */
  thumbs?: boolean;
  prefetch?: boolean;
  className?: string;
}

/**
 * Compact brand row (mobile directory < 480 px, DESIGN §6.8): 88 px, soft border, no pop shadow,
 * 56 px monogram, name + cop + meta, three 44 px thumbs. Links to /brands/{slug}.
 */
export function BrandRow({ brand: b, thumbs = true, prefetch, className }: BrandRowProps) {
  const cat = CATEGORY_BY_SLUG[b.category];
  return (
    <article
      data-cat={b.category}
      data-tier={b.tier}
      className={cn(
        "card group/card flex min-h-[88px] items-center gap-3 rounded-card border-2 border-garis bg-putih py-2 pr-2 pl-2.5 shadow-card",
        className,
      )}
    >
      <Monogram slug={b.slug} name={b.name} category={b.category} size={56} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="truncate text-[16px] leading-tight font-semibold text-ink">
          <Link href={`/brands/${b.slug}`} prefetch={prefetch} transitionTypes={["nav-forward"]} className="stretched-link">
            {b.name}
          </Link>
        </h3>
        <div className="flex min-w-0 items-center gap-1.5">
          <TierCop tier={b.tier} />
        </div>
        <p className="flex min-w-0 items-center gap-1 text-caption text-ink-soft">
          <MapPin aria-hidden="true" size={12} strokeWidth={2.5} className="shrink-0" />
          <span className="truncate">
            {cat.nameMs}
            {b.state ? ` · ${b.state}` : ""}
            {b.promoCount > 0 ? ` · ${b.promoCount} promo` : ""}
          </span>
        </p>
      </div>
      {thumbs && (
        <div className="hidden min-[360px]:block">
          <BrandCollage previews={b.previews} category={b.category} name={b.name} size="row" />
        </div>
      )}
    </article>
  );
}
