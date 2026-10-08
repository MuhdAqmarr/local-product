import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Info } from "lucide-react";
import { BestDeal } from "@/components/brand/best-deal";
import { BrandHero } from "@/components/brand/brand-hero";
import { BrandTabs } from "@/components/brand/brand-tabs";
import { pickSimilar, SimilarBrands } from "@/components/brand/similar-brands";
import { EmptyState } from "@/components/feedback/empty-state";
import { ContentIn, PageTransition, SkeletonOut } from "@/components/motion/page-transition";
import { ProductGrid } from "@/components/product/product-grid";
import { BrandHeroSkeleton } from "@/components/skeletons/brand-hero-skeleton";
import { getBrandProducts, getBrandSummaries, type BrandProducts } from "@/lib/catalog";
import { BRANDS, getBrand } from "@/lib/brands";
import { outboundUrl } from "@/lib/format";
import { CATEGORY_BY_SLUG, NEW_WINDOW_DAYS, TIER_BY_SLUG } from "@/lib/taxonomy";
import type { Brand, ProductCardData } from "@/lib/types";

export function generateStaticParams() {
  return BRANDS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/brands/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) return { title: "Jenama tak jumpa", robots: { index: false } };
  const cat = CATEGORY_BY_SLUG[brand.category];
  const tail = brand.feed
    ? ` Promo dan produk baru ${brand.name} dari kedai rasmi, disemak lebih kurang setiap 3 jam.`
    : ` ${TIER_BY_SLUG[brand.tier].name} · ${cat.nameMs}${brand.state ? ` · ${brand.state}` : ""}.`;
  const description = `${brand.description}${tail}`;
  return {
    title: `${brand.name}: jenama ${cat.nameMs.toLowerCase()} lokal`,
    description,
    alternates: { canonical: `/brands/${brand.slug}` },
    openGraph: { type: "website", title: `${brand.name} · LokalLah!`, description, url: `/brands/${brand.slug}` },
    twitter: { title: `${brand.name} · LokalLah!`, description },
  };
}

export default function BrandPage({ params }: PageProps<"/brands/[slug]">) {
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

async function BrandContent({ params }: { params: PageProps<"/brands/[slug]">["params"] }) {
  const { slug } = await params;
  const brand = getBrand(slug);
  if (!brand) notFound();

  const [data, summaries] = await Promise.all([getBrandProducts(slug), getBrandSummaries()]);
  const { promos, newest, status, syncedAt } = data;
  const now = Date.parse(syncedAt);
  const fresh = newest.filter((p) => p.available && p.publishedAt && now - Date.parse(p.publishedAt) <= NEW_WINDOW_DAYS * DAY);
  const hasProducts = Boolean(brand.feed) && newest.length > 0;
  const checkedAt = status?.fetchedAt ?? syncedAt;

  return (
    <>
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

      <SimilarBrands brands={pickSimilar(brand, summaries)} />

      <Disclaimer brand={brand} />
    </>
  );
}

function PriceNote({ brand }: { brand: Brand }) {
  return (
    <p className="mt-5 text-caption text-ink-soft">
      Harga dan stok boleh berubah bila-bila masa. Confirm kat{" "}
      <a href={outboundUrl(brand.website)} target="_blank" rel="noopener noreferrer" className="font-semibold text-telang underline-offset-2 hover:underline">
        kedai rasmi {brand.name}
        <span className="sr-only"> (tab baru)</span>
      </a>{" "}
      sebelum bayar ya.
    </p>
  );
}

function PromoPanel({ brand, promos, syncedAt, checkedAt }: { brand: Brand; promos: ProductCardData[]; syncedAt: string; checkedAt: string }) {
  if (!promos.length) {
    return (
      <EmptyState
        as="h3"
        mood="tidur"
        title={`${brand.name} tengah takde promo.`}
        body="Tapi produk diorang still best. Tengok yang baru!"
        primary={{ label: "Tengok Baru", href: "#baru", trailing: "arrow" }}
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
            Promo lain <span className="font-num text-ink-soft">({rest.length})</span>
          </h3>
          <ProductGrid products={rest} syncedAt={syncedAt} checkedAt={checked} emphasis="promo" eagerCount={2} priorityFirst={false} />
        </>
      )}
      <PriceNote brand={brand} />
    </>
  );
}

function BaruPanel({
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
  const checked = { [brand.slug]: checkedAt };
  if (fresh.length) {
    return (
      <>
        <ProductGrid products={fresh} syncedAt={syncedAt} checkedAt={checked} emphasis="baru" eagerCount={hasPromos ? 0 : 2} priorityFirst={false} />
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
          Takde launch baru dari {brand.name} dalam {NEW_WINDOW_DAYS} hari lepas.
          {latest.length > 0 ? " Ni produk terkini yang ada kat kedai diorang:" : " Check balik lepas sync seterusnya!"}
        </p>
      </div>
      {latest.length > 0 && (
        <>
          <ProductGrid products={latest} syncedAt={syncedAt} checkedAt={checked} className="mt-5" eagerCount={0} priorityFirst={false} />
          <PriceNote brand={brand} />
        </>
      )}
    </>
  );
}

function Disclaimer({ brand }: { brand: Brand }) {
  return (
    <aside aria-label="Penafian" className="container-page mt-(--section-y) pb-(--section-y)">
      <div className="flex gap-3 rounded-card-lg border-2 border-garis bg-putih p-5 md:p-6">
        <Info aria-hidden size={20} strokeWidth={2.25} className="mt-0.5 shrink-0 text-ink-soft" />
        <div className="grid gap-2 text-caption text-ink-soft lg:grid-cols-2 lg:gap-x-10">
          {brand.feed && <p>Harga, promo dan produk diambil secara automatik dari kedai online rasmi {brand.name}, dan disemak lebih kurang setiap 3 jam.</p>}
          <p>
            LokalLah! ialah direktori bebas. Kami tak jual apa-apa dan tak bergabung dengan, ditaja atau disahkan oleh {brand.name}. Nama jenama, tanda dagangan dan
            gambar produk adalah milik pemilik masing-masing.
          </p>
          <p>Link keluar ada tag utm_source=lokallah supaya jenama tahu trafik datang dari sini. Ini bukan link affiliate.</p>
          <p>
            Pemilik {brand.name}? Nak kemas kini info atau keluar dari senarai?{" "}
            <Link href={`/about?nama=${encodeURIComponent(brand.name)}#cadang`} className="font-semibold text-telang underline-offset-2 hover:underline">
              Hubungi kami
            </Link>
            .
          </p>
        </div>
      </div>
    </aside>
  );
}
