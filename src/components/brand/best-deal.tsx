import { ArrowUpRight, Clock3 } from "@/components/ui/lucide";
import { DealSticker } from "@/components/product/deal-sticker";
import { PlateImage } from "@/components/product/plate-image";
import { Price } from "@/components/product/price";
import { priceSentence } from "@/components/product/price-text";
import { RelTime } from "@/components/product/rel-time";
import { SaveButton } from "@/components/product/save-button";
import { outboundUrl } from "@/lib/format";
import type { ProductCardData } from "@/lib/types";
import { fmt } from "@/i18n/format";
import { getDictionary, getLocale } from "@/i18n/server";

export interface BestDealProps {
  product: ProductCardData;
  syncedAt: string;
  /** When this brand's prices were last checked. */
  checkedAt?: string;
}

/**
 * "Best deal" / "Deal terbaik" (DESIGN §8.5 #6): the brand's biggest live discount, featured above the Promo grid
 * with a kraft-style tag and the 64 px deal sticker. Algorithmic (biggest % off) and labelled so.
 * The whole card is one outbound link (stretched title link); the heart sits above it.
 */
export async function BestDeal({ product: p, syncedAt, checkedAt }: BestDealProps) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const t = dict.brands.bestDeal;
  const c = dict.common.product;
  const alt = p.title || fmt(c.photoAlt, { brand: p.brandName });
  const label = [p.title, priceSentence(p, locale), fmt(t.srBest, { brand: p.brandName }), fmt(c.srOpen, { brand: p.brandName })].join(", ");
  return (
    <article data-cat={p.brandCategory} data-tier={p.brandTier} className="best-deal group/deal relative mt-3">
      <span className="best-deal-tag" aria-hidden="true">
        {t.tag}
      </span>
      <div className="best-deal-face grid grid-cols-[minmax(0,116px)_minmax(0,1fr)] items-center gap-3.5 rounded-card-lg border-2 border-ink bg-putih p-2.5 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)] sm:gap-6 sm:p-3">
        <div className="relative">
          <div className="plate" data-eager="">
            <PlateImage src={p.image} alt={alt} width={p.imageW} height={p.imageH} category={p.brandCategory} sizes="(min-width:640px) 200px, 116px" eager />
          </div>
          <DealSticker discount={p.discount} size="lg" className="pointer-events-none absolute -top-3 -left-3 z-[2] scale-[.82] sm:scale-100" />
        </div>
        <div className="flex min-w-0 flex-col gap-1.5 py-1 pr-1 sm:gap-2.5 sm:pr-4">
          <p className="pr-11 text-overline text-ink-soft uppercase sm:pr-14">{t.overline}</p>
          <h3 className="line-clamp-2 text-body-sm font-semibold [overflow-wrap:anywhere] text-ink sm:text-title-3">
            <a href={outboundUrl(p.url)} target="_blank" rel="noopener noreferrer" className="stretched-link" aria-label={label}>
              {p.title}
            </a>
          </h3>
          <Price locale={locale} price={p.price} compareAt={p.compareAt} discount={p.discount} currency={p.currency} size="lg" jimat="always" announce={false} />
          <p className="flex min-w-0 items-center gap-1 text-caption text-ink-soft">
            <Clock3 size={12} strokeWidth={2.5} aria-hidden="true" className="shrink-0" />
            <span className="truncate">
              <RelTime iso={checkedAt ?? syncedAt} base={syncedAt} template={t.checked} />
            </span>
          </p>
          <span aria-hidden="true" className="best-deal-cta mt-1 hidden items-center gap-1.5 self-start rounded-full bg-ink px-4 py-2.5 text-[14px] leading-none font-semibold text-santan sm:inline-flex">
            {t.cta}
            <ArrowUpRight size={18} strokeWidth={2.25} className="transition-transform duration-200 group-hover/deal:translate-x-[2px] group-hover/deal:-translate-y-[2px]" />
          </span>
        </div>
      </div>
      <div className="absolute top-3.5 right-3.5 z-10">
        <SaveButton product={p} tone="solid" />
      </div>
    </article>
  );
}
