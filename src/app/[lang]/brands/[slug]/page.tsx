import type { Metadata } from "next";
import { Suspense } from "react";
import { Link } from "@/i18n/link";
import { notFound } from "next/navigation";
import { Info } from "@/components/ui/lucide";
import { BestDeal } from "@/components/brand/best-deal";
import { BrandHero } from "@/components/brand/brand-hero";
import { BrandTabs } from "@/components/brand/brand-tabs";
import { pickSimilar, SimilarBrands } from "@/components/brand/similar-brands";
import { EmptyState } from "@/components/feedback/empty-state";
import { ContentIn, PageTransition, SkeletonOut } from "@/components/motion/page-transition";
import { ProductGrid } from "@/components/product/product-grid";
import { BrandHeroSkeleton } from "@/components/skeletons/brand-hero-skeleton";
import { getBrandProducts, getBrandSummaries, type BrandProducts } from "@/lib/catalog";
import { BRANDS, brandDescription, getBrand } from "@/lib/brands";
import { outboundUrl } from "@/lib/format";
import { MessagesProvider } from "@/i18n/client";
import { fmt } from "@/i18n/format";
import { rich } from "@/i18n/rich";
import { dictionaryFor, getDictionary, getLocale, getMessages } from "@/i18n/server";
import { pageMetadata } from "@/lib/site";
import { categoryInline, categoryLabel, NEW_WINDOW_DAYS, TIER_BY_SLUG } from "@/lib/taxonomy";
import type { Brand, ProductCardData } from "@/lib/types";

export function generateStaticParams() {
  return BRANDS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/brands/[slug]">): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const t = dictionaryFor(locale).brands.meta;
  const brand = getBrand(slug);
  if (!brand) return { title: t.notFound, robots: { index: false } };
  const category = categoryLabel(brand.category, locale);
  const tail = brand.feed
    ? fmt(t.feedTail, { brand: brand.name })
    : `${[TIER_BY_SLUG[brand.tier].name, category, brand.state].filter(Boolean).join(" · ")}.`;
  const description = `${brandDescription(brand, locale)} ${tail}`;
  // Images come from ./opengraph-image.tsx and ./twitter-image.tsx (file convention wins).
  return pageMetadata({
    locale,
    title: fmt(t.brandTitle, { brand: brand.name, category: categoryInline(brand.category, locale) }),
    socialTitle: fmt(t.socialTitle, { brand: brand.name }),
    description,
    path: `/brands/${brand.slug}`,
    defaultImage: false,
  });
}

export default function BrandPage({ params }: PageProps<"/[lang]/brands/[slug]">) {
  return (
    <PageTransition>
      <Suspense
        fallback={
          <SkeletonOut>
            <BrandHeroSkeleton />
          </SkeletonOut>
        }
      >
        <ContentIn>
          <BrandContent params={params} />
        </ContentIn>
      </Suspense>
    </PageTransition>
  );
}

const DAY = 86_400_000;

async function BrandContent({ params }: { params: PageProps<"/[lang]/brands/[slug]">["params"] }) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const [data, summaries, locale, messages] = await Promise.all([getBrandProducts(slug), getBrandSummaries(), getLocale(), getMessages("brands")]);
  const { promos, newest, status, syncedAt } = data;
  const now = Date.parse(syncedAt);
  const fresh = newest.filter((p) => p.available && p.publishedAt && now - Date.parse(p.publishedAt) <= NEW_WINDOW_DAYS * DAY);
  const hasProducts = Boolean(brand.feed) && newest.length > 0;
  const checkedAt = status?.fetchedAt ?? syncedAt;

  return (
    <MessagesProvider messages={messages}>
      <BrandHero
        brand={brand}
        syncedAt={syncedAt}
        status={status}
        stats={{ promos: promos.length, fresh: fresh.length, maxDiscount: promos[0]?.discount ?? 0, products: newest.length }}
      />

      {hasProducts && (
        <div className="container-page mt-8 md:mt-10">
          <BrandTabs
            initial={promos.length ? "promo" : "baru"}
            promoCount={promos.length}
            baruCount={fresh.length}
            promo={<PromoPanel brand={brand} promos={promos} syncedAt={syncedAt} checkedAt={checkedAt} />}
            baru={<BaruPanel brand={brand} fresh={fresh} newest={newest} syncedAt={syncedAt} checkedAt={checkedAt} hasPromos={promos.length > 0} />}
          />
        </div>
      )}

      <SimilarBrands brands={pickSimilar(brand, summaries).map((b) => ({ ...b, description: brandDescription(b, locale) }))} />

      <Disclaimer brand={brand} />
    </MessagesProvider>
  );
}

async function PriceNote({ brand }: { brand: Brand }) {
  const t = (await getDictionary()).brands.profile;
  return (
    <p className="mt-5 text-caption text-ink-soft">
      {rich(t.priceNote, {
        link: (
          <a href={outboundUrl(brand.website)} target="_blank" rel="noopener noreferrer" className="font-semibold text-telang underline-offset-2 hover:underline">
            {fmt(t.priceNoteLink, { brand: brand.name })}
            <span className="sr-only"> {t.newTab}</span>
          </a>
        ),
      })}
    </p>
  );
}

async function PromoPanel({ brand, promos, syncedAt, checkedAt }: { brand: Brand; promos: ProductCardData[]; syncedAt: string; checkedAt: string }) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const t = dict.brands.profile;
  if (!promos.length) {
    return (
      <EmptyState
        as="h3"
        mood="tidur"
        title={fmt(t.noPromoTitle, { brand: brand.name })}
        body={t.noPromoBody}
        primary={{ label: t.noPromoCta, href: "#baru", trailing: "arrow" }}
      />
    );
  }
  const [best, ...rest] = promos;
  const checked = { [brand.slug]: checkedAt };
  return (
    <>
      <BestDeal product={best} syncedAt={syncedAt} checkedAt={checkedAt} />
      {rest.length > 0 && (
        <>
          <h3 className="mt-8 mb-3 text-title-3 text-ink">
            {t.morePromos} <span className="font-num text-ink-soft">({rest.length})</span>
          </h3>
          <ProductGrid locale={locale} products={rest} syncedAt={syncedAt} checkedAt={checked} emphasis="promo" eagerCount={2} priorityFirst={false} />
        </>
      )}
      <PriceNote brand={brand} />
    </>
  );
}

async function BaruPanel({
  brand,
  fresh,
  newest,
  syncedAt,
  checkedAt,
  hasPromos,
}: {
  brand: Brand;
  fresh: ProductCardData[];
  newest: BrandProducts["newest"];
  syncedAt: string;
  checkedAt: string;
  hasPromos: boolean;
}) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const t = dict.brands.profile;
  const checked = { [brand.slug]: checkedAt };
  if (fresh.length) {
    return (
      <>
        <ProductGrid locale={locale} products={fresh} syncedAt={syncedAt} checkedAt={checked} emphasis="baru" eagerCount={hasPromos ? 0 : 2} priorityFirst={false} />
        <PriceNote brand={brand} />
      </>
    );
  }
  // Nothing launched in the window: say so, then show what is on their shelf now (honestly labelled).
  const latest = newest.filter((p) => p.available).slice(0, 8);
  return (
    <>
      <div className="flex items-start gap-3 rounded-card border-2 border-garis bg-putih p-4">
        <Info aria-hidden size={20} strokeWidth={2.25} className="mt-0.5 shrink-0 text-telang" />
        <p className="text-body-sm text-ink-2">
          {fmt(t.noFresh, { brand: brand.name, days: NEW_WINDOW_DAYS })} {latest.length > 0 ? t.noFreshLatest : t.noFreshLater}
        </p>
      </div>
      {latest.length > 0 && (
        <>
          <ProductGrid locale={locale} products={latest} syncedAt={syncedAt} checkedAt={checked} className="mt-5" eagerCount={0} priorityFirst={false} />
          <PriceNote brand={brand} />
        </>
      )}
    </>
  );
}

async function Disclaimer({ brand }: { brand: Brand }) {
  const t = (await getDictionary()).brands.profile;
  return (
    <aside aria-label={t.disclaimer} className="container-page mt-(--section-y) pb-(--section-y)">
      <div className="flex gap-3 rounded-card-lg border-2 border-garis bg-putih p-5 md:p-6">
        <Info aria-hidden size={20} strokeWidth={2.25} className="mt-0.5 shrink-0 text-ink-soft" />
        <div className="grid gap-2 text-caption text-ink-soft lg:grid-cols-2 lg:gap-x-10">
          {brand.feed && <p>{fmt(t.disclaimerSource, { brand: brand.name })}</p>}
          <p>{fmt(t.disclaimerIndependent, { brand: brand.name })}</p>
          <p>{t.disclaimerOutbound}</p>
          <p>
            {rich(fmt(t.disclaimerOwner, { brand: brand.name }), {
              link: (
                <Link href={`/about?nama=${encodeURIComponent(brand.name)}#cadang`} className="font-semibold text-telang underline-offset-2 hover:underline">
                  {t.disclaimerContact}
                </Link>
              ),
            })}
          </p>
        </div>
      </div>
    </aside>
  );
}
