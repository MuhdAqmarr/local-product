import { BrandCard } from "@/components/brand/brand-card";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Accent, SectionHeader } from "@/components/ui/section-header";
import { brandDescription } from "@/lib/brands";
import type { BrandSummary } from "@/lib/catalog";
import { fnv1a } from "@/lib/monogram";
import type { ProductCardData } from "@/lib/types";
import { fmt } from "@/i18n/format";
import { rich } from "@/i18n/rich";
import { getDictionary, getLocale } from "@/i18n/server";

/** ISO-8601 week of a timestamp, e.g. "2026-W41" (Monday-based, UTC). Pure: derived from data, not the clock. */
export function isoWeek(iso: string): string {
  const at = new Date(Date.parse(iso));
  const d = new Date(Date.UTC(at.getUTCFullYear(), at.getUTCMonth(), at.getUTCDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7)); // the Thursday of this ISO week
  const week = Math.ceil(((d.getTime() - Date.UTC(d.getUTCFullYear(), 0, 1)) / 86_400_000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

/**
 * The week's Cili Padi pick: live cili-padi shops (A–Z, so the list is stable), picked by
 * `fnv1a(isoWeek(syncedAt)) % n`. Same pick all week, a new one when the sync crosses Monday.
 */
export function pickCiliPadi(brands: BrandSummary[], syncedAt: string): BrandSummary | undefined {
  const pool = brands.filter((b) => b.tier === "cili-padi" && b.live).sort((a, b) => a.slug.localeCompare(b.slug));
  if (!pool.length) return undefined;
  return pool[fnv1a(isoWeek(syncedAt)) % pool.length];
}

/**
 * "Cili Padi of the week" / "Cili Padi minggu ni" (DESIGN §8.1 #8): one small maker in a big kedai card (unique on the page,
 * so its monogram morphs into the profile) + a 2 × 2 of its latest products.
 */
export async function Spotlight({ brand, products, syncedAt }: { brand: BrandSummary; products: ProductCardData[]; syncedAt: string }) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const t = dict.home.spotlight;
  return (
    <section aria-labelledby="spotlight-title" data-tier="cili-padi" className="container-page">
      <SectionHeader
        id="spotlight-title"
        eyebrow={t.eyebrow}
        title={rich(t.title, { accent: <Accent>{t.accent}</Accent> })}
        sub={t.sub}
      />
      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-start lg:grid-cols-4 lg:items-stretch lg:gap-8">
        <div data-reveal="" className="flex flex-col gap-4">
          <BrandCard locale={locale} brand={{ ...brand, description: brandDescription(brand, locale) }} morph prefetch />
          <Button href={`/brands/${brand.slug}`} variant="secondary" trailing="arrow" transitionTypes={["nav-forward"]} className="self-start">
            {fmt(t.visit, { brand: brand.name })}
          </Button>
        </div>
        {products.length > 0 && (
          <ul className="grid grid-cols-2 gap-x-2.5 gap-y-3.5 sm:gap-4 lg:col-span-3 lg:grid-cols-3" aria-label={fmt(t.productsLabel, { brand: brand.name })}>
            {products.slice(0, 4).map((p, i) => (
              <li key={p.id} className={i === 3 ? "min-w-0 lg:hidden" : "min-w-0"}>
                <ProductCard locale={locale} product={p} syncedAt={syncedAt} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
