import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { notFound } from "next/navigation";
import { WauBulan } from "@/components/art/wau-bulan";
import type { BrandCardData } from "@/components/brand/brand-card";
import { CategoryHero } from "@/components/category/category-hero";
import { ChipRow } from "@/components/category/chip-row";
import { LivePill } from "@/components/feedback/live-pill";
import { LiveTime } from "@/components/feedback/live-time";
import { ContentIn, PageTransition, SkeletonOut } from "@/components/motion/page-transition";
import { CategoryGlyph } from "@/components/product/category-glyph";
import { ProductCard } from "@/components/product/product-card";
import { gridColumns } from "@/components/product/product-grid";
import { Rail } from "@/components/rail/rail";
import { Chip } from "@/components/ui/chip";
import { Accent, SectionHeader } from "@/components/ui/section-header";
import { getBrandSummaries, getCategorySummaries, getNewLaunches, getPromos, getStats } from "@/lib/catalog";
import { formatCount } from "@/lib/format";
import { CATEGORIES, CATEGORY_BY_SLUG, isCategorySlug, TIER_BY_SLUG, TIERS } from "@/lib/taxonomy";
import type { CategorySlug, ProductCardData, TierSlug } from "@/lib/types";
import { CategoryBrands } from "./category-brands";
import CategoryLoading from "./loading";
import { TierScope, type Scope } from "./tier-scope";

const PROMO_SHOWN = 8;
const RAIL_SHOWN = 12;
const SCOPES: readonly Scope[] = ["all", ...TIERS.map((t) => t.slug)];

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/categories/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!isCategorySlug(slug)) return { title: "Kategori tak jumpa", robots: { index: false } };
  const c = CATEGORY_BY_SLUG[slug];
  const description = `${c.blurb} Promo live dan produk baru dari jenama ${c.nameMs.toLowerCase()} Malaysia, terus dari kedai rasmi.`;
  return {
    title: `${c.name} (${c.nameMs})`,
    description,
    alternates: { canonical: `/categories/${slug}` },
    openGraph: { title: `${c.name} · LokalLah!`, description, url: `/categories/${slug}` },
  };
}

export default function CategoryPage({ params }: PageProps<"/categories/[slug]">) {
  return (
    <PageTransition>
      <Suspense
        fallback={
          <SkeletonOut>
            <CategoryLoading />
          </SkeletonOut>
        }
      >
        <ContentIn>
          <CategoryContent params={params} />
        </ContentIn>
      </Suspense>
    </PageTransition>
  );
}

/** First `n` items of every scope, merged in feed order, each tagged with the scopes it shows in. */
function scoped(list: ProductCardData[], n: number) {
  const picked = new Map<string, Set<Scope>>();
  const counts = {} as Record<Scope, number>;
  for (const scope of SCOPES) {
    const inScope = scope === "all" ? list : list.filter((p) => p.brandTier === scope);
    counts[scope] = inScope.length;
    for (const p of inScope.slice(0, n)) {
      const set = picked.get(p.id) ?? new Set<Scope>();
      set.add(scope);
      picked.set(p.id, set);
    }
  }
  const items = list.filter((p) => picked.has(p.id)).map((p) => ({ product: p, scopes: [...picked.get(p.id)!].join(" ") }));
  return { items, counts };
}

/** One span per scope; scope.css shows only the current one. */
function PerScope({ render }: { render: (scope: Scope) => ReactNode }) {
  return (
    <>
      {SCOPES.map((scope) => (
        <span key={scope} data-in={scope}>
          {render(scope)}
        </span>
      ))}
    </>
  );
}

function tierLabel(scope: Scope) {
  return scope === "all" ? "" : ` ${TIER_BY_SLUG[scope as TierSlug].name}`;
}

function EmptyNote({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-card border-2 border-dashed border-garis-kuat bg-putih/70 p-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-body text-ink-2">{children}</p>
      {action}
    </div>
  );
}

async function CategoryContent({ params }: { params: PageProps<"/categories/[slug]">["params"] }) {
  const { slug } = await params;
  if (!isCategorySlug(slug)) notFound();
  const c = CATEGORY_BY_SLUG[slug];

  const [stats, summaries, promos, launches, brandSummaries] = await Promise.all([
    getStats(),
    getCategorySummaries(),
    getPromos({ category: slug }),
    getNewLaunches({ category: slug, perBrand: 2 }),
    getBrandSummaries(),
  ]);
  const summary = summaries.find((s) => s.slug === slug);
  const promoGrid = scoped(promos, PROMO_SHOWN);
  const rail = scoped(launches, RAIL_SHOWN);
  const newTotal = summary?.newLaunches ?? launches.length;

  const brands: BrandCardData[] = brandSummaries
    .filter((b) => b.category === slug)
    .sort((a, b) => Number(b.live) - Number(a.live) || a.name.localeCompare(b.name))
    .map((b) => ({
      slug: b.slug,
      name: b.name,
      category: b.category,
      tier: b.tier,
      description: b.description,
      state: b.state,
      live: b.live,
      promoCount: b.promoCount,
      newCount: b.newCount,
      previews: b.previews,
    }));
  const brandCounts = Object.fromEntries(SCOPES.map((s) => [s, s === "all" ? brands.length : brands.filter((b) => b.tier === s).length])) as Record<Scope, number>;

  const siblings = CATEGORIES.filter((x) => x.slug !== slug);

  return (
    <div data-cat={slug} className="pt-3 md:pt-5">
      <CategoryHero slug={slug} brands={summary?.brands ?? brands.length} promos={summary?.promos ?? promos.length} newLaunches={newTotal}>
        <LivePill syncedAt={stats.syncedAt} source={stats.source} liveBrands={stats.liveBrands} brands={stats.brands} size="sm" />
      </CategoryHero>

      <nav aria-label="Kategori lain" className="container-page mt-4">
        <ChipRow label="Kategori lain">
          {siblings.map((s) => (
            <span key={s.slug} data-cat={s.slug} className="contents">
              <Chip href={`/categories/${s.slug}`} transitionTypes={["nav-tab"]} icon={<CategoryGlyph category={s.slug as CategorySlug} size={18} />} dense>
                {s.nameMs}
              </Chip>
            </span>
          ))}
        </ChipRow>
      </nav>

      <div className="mt-2">
        <TierScope label="Saiz jenama">
          {/* Promo panas */}
          <section id="promo" aria-labelledby="promo-title" className="container-page scroll-mt-40 pt-6">
            <SectionHeader
              id="promo-title"
              noReveal
              title={
                <>
                  Promo <Accent>panas</Accent> dalam {c.nameMs}
                </>
              }
              sub="Harga turun, dikesan terus dari kedai rasmi."
              meta={<PerScope render={(s) => (promoGrid.counts[s] > 0 ? `${formatCount(promoGrid.counts[s])} promo` : null)} />}
              href={`/promos?kat=${slug}`}
            />
            <div className="mt-5">
              {promoGrid.items.length > 0 && (
                <ul role="list" className={gridColumns(true)}>
                  {promoGrid.items.map(({ product, scopes }, i) => (
                    <li key={product.id} data-in={scopes} className="min-w-0">
                      <ProductCard product={product} syncedAt={stats.syncedAt} emphasis="promo" priority={i === 0} eager={i < 4} />
                    </li>
                  ))}
                </ul>
              )}
              {SCOPES.filter((s) => promoGrid.counts[s] === 0).map((s) => (
                <div key={s} data-in={s}>
                  <EmptyNote
                    action={
                      <a href="#baru" className="inline-flex min-h-11 items-center text-label text-telang underline-offset-4 hover:underline">
                        Tengok yang baru
                      </a>
                    }
                  >
                    Takde promo{tierLabel(s)} dalam {c.nameMs} buat masa ni. Oyen tengah jaga. Bila harga turun, keluar sini dulu.
                  </EmptyNote>
                </div>
              ))}
              {promos.length > 0 && (
                <p className="mt-4 text-caption text-ink-soft">
                  Harga disemak <LiveTime iso={stats.syncedAt} />. Confirm kat kedai rasmi sebelum bayar ya.
                </p>
              )}
            </div>
          </section>

          {/* Baru sampai */}
          <div id="baru" className="scroll-mt-40 pt-(--section-y)">
            {launches.length > 0 ? (
              <Rail
                id={`baru-${slug}`}
                title={
                  <>
                    Baru dalam <Accent>{c.nameMs}</Accent>
                  </>
                }
                titleText={`Baru dalam ${c.nameMs}`}
                sub="Fresh dari oven: produk yang baru launch."
                art={<WauBulan size={48} />}
                count={newTotal}
                noun="produk baru"
                href={`/new?kat=${slug}`}
              >
                {[
                  ...SCOPES.filter((s) => rail.counts[s] === 0).map((s) => (
                    <div key={`none-${s}`} data-in={s} className="grid h-full place-items-center rounded-card border-2 border-dashed border-garis-kuat bg-putih/70 p-4 text-center">
                      <p className="text-body-sm text-ink-2">Senyap je. Takde produk baru{tierLabel(s)} bulan ni.</p>
                    </div>
                  )),
                  ...rail.items.map(({ product, scopes }) => (
                    <div key={product.id} data-in={scopes} className="h-full">
                      <ProductCard product={product} syncedAt={stats.syncedAt} context="rail" emphasis="baru" />
                    </div>
                  )),
                ]}
              </Rail>
            ) : (
              <section aria-labelledby="baru-empty" className="container-page">
                <h2 id="baru-empty" className="text-title-2 text-ink">
                  Baru dalam {c.nameMs}
                </h2>
                <div className="mt-4">
                  <EmptyNote>Senyap je bulan ni. Jenama tengah masak produk baru. Check balik esok!</EmptyNote>
                </div>
              </section>
            )}
          </div>

          {/* Jenama */}
          <section id="jenama" aria-labelledby="jenama-title" className="container-page scroll-mt-40 pt-(--section-y)">
            <SectionHeader
              id="jenama-title"
              title={
                <>
                  Jenama <Accent>{c.nameMs}</Accent>
                </>
              }
              sub="Yang kedainya boleh disync dulu, lepas tu ikut A–Z."
              meta={<PerScope render={(s) => `${formatCount(brandCounts[s])} jenama`} />}
            />
            <div className="mt-5">
              <CategoryBrands brands={brands} nameMs={c.nameMs} />
            </div>
          </section>
        </TierScope>
      </div>
    </div>
  );
}
