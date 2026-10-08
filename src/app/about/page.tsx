import type { Metadata } from "next";
import { Check, CircleDot, X } from "lucide-react";
import { Oyen } from "@/components/art/oyen";
import { Seal } from "@/components/art/seal";
import { Faq } from "@/components/about/faq";
import { ReadingProgress } from "@/components/about/reading-progress";
import { SuggestForm } from "@/components/about/suggest-form";
import { SyncExplainer } from "@/components/about/sync-explainer";
import { QuoteAnswer, ThreadsQuote } from "@/components/about/threads-quote";
import { TierCards } from "@/components/about/tier-cards";
import { PageTransition } from "@/components/motion/page-transition";
import { Band } from "@/components/ui/band";
import { Accent, SectionHeader } from "@/components/ui/section-header";
import { brandsInTier } from "@/lib/brands";
import { getStats } from "@/lib/catalog";
import { REPO_URL } from "@/lib/site";
import { TIERS } from "@/lib/taxonomy";
import type { TierSlug } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tentang",
  description: "Kenapa LokalLah! wujud, cara kami sync data dari kedai rasmi, apa maksud tier jenama, dan cara cadang jenama lokal.",
  alternates: { canonical: "/about" },
  openGraph: { title: "Tentang · LokalLah!", description: "Kenapa LokalLah! wujud dan cara kami sync data dari kedai rasmi.", url: "/about" },
};

const WE_ARE = [
  "Direktori bebas jenama Malaysia, dari Cili Padi sampai Jenama Ikon.",
  "Harga, promo dan produk dibaca terus dari kedai online rasmi setiap jenama.",
  "Link keluar ada tag utm_source=lokallah supaya jenama tahu trafik datang dari sini.",
];
const WE_ARE_NOT = [
  "Kedai. Kami tak jual apa-apa; kau beli terus dari jenama.",
  "Rakan rasmi, penaja atau wakil mana-mana jenama.",
  "Link affiliate, komisen atau tempat berbayar.",
];

export default async function AboutPage() {
  const stats = await getStats();
  const tierCounts = Object.fromEntries(TIERS.map((t) => [t.slug, brandsInTier(t.slug).length])) as Record<TierSlug, number>;
  const webhook = Boolean(process.env.SUGGEST_WEBHOOK_URL);

  return (
    <PageTransition>
      <ReadingProgress />

      {/* 1. Hero */}
      <Band as="header" tone="gula-kapas" className="mt-3 md:mt-5 md:px-12 md:py-12" labelledBy="about-title">
        <div className="grid items-center gap-8 md:grid-cols-[1.25fr_1fr] md:gap-12">
          <div className="min-w-0">
            <p className="text-overline uppercase text-ink-2">Tentang LokalLah!</p>
            <h1 id="about-title" className="mt-2 max-w-[18ch] text-title-1 text-ink">
              Semuanya bermula dengan satu <Accent>soalan</Accent>.
            </h1>
            <ThreadsQuote className="mt-6" />
          </div>
          <div className="flex flex-col items-start gap-4 md:items-center md:text-center">
            <span className="relative grid size-36 place-items-center">
              <span aria-hidden="true" className="absolute inset-0 rounded-full bg-sunburst opacity-60" />
              <Oyen mood="happy" size={120} className="relative animate-pop-in" />
            </span>
            <QuoteAnswer className="md:items-center" />
          </div>
        </div>
      </Band>

      {/* 2. Cara kami sync */}
      <section id="sync" aria-labelledby="sync-title" className="container-page scroll-mt-28 pt-(--section-y)">
        <SectionHeader
          id="sync-title"
          eyebrow="Cara kami sync"
          title={
            <>
              Macam mana kami sentiasa <Accent>up to date</Accent>?
            </>
          }
        />
        <SyncExplainer className="mt-8" liveBrands={stats.liveBrands} brands={stats.brands} syncedAt={stats.syncedAt} />
      </section>

      {/* 3. Tier */}
      <section id="tier" aria-labelledby="tier-title" className="container-page scroll-mt-28 pt-(--section-y)">
        <SectionHeader
          id="tier-title"
          eyebrow="Saiz jenama"
          title={
            <>
              Dari Cili Padi ke Jenama <Accent>Ikon</Accent>
            </>
          }
          sub="Setiap jenama besar pernah bermula kecil."
        />
        <div className="mt-8">
          <TierCards counts={tierCounts} />
        </div>
      </section>

      {/* 4. Siapa kami */}
      <section aria-labelledby="siapa-title" className="container-page pt-(--section-y)">
        <div className="flex items-end justify-between gap-4">
          <SectionHeader id="siapa-title" title="Siapa kami (dan siapa kami bukan)" />
          <Seal size={64} spin className="hidden shrink-0 sm:block" />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div data-reveal="" className="rounded-card-lg border-2 border-ink bg-pandan-tint p-5">
            <h3 className="text-title-3 text-ink">Kami ni…</h3>
            <ul className="mt-3 flex flex-col gap-2.5">
              {WE_ARE.map((t) => (
                <li key={t} className="flex gap-2.5 text-body text-ink-2">
                  <Check aria-hidden="true" size={20} strokeWidth={2.5} className="mt-0.5 shrink-0 text-pandan-pekat" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal="" style={{ ["--i" as string]: 1 }} className="rounded-card-lg border-2 border-ink bg-kapas p-5">
            <h3 className="text-title-3 text-ink">Kami bukan…</h3>
            <ul className="mt-3 flex flex-col gap-2.5">
              {WE_ARE_NOT.map((t) => (
                <li key={t} className="flex gap-2.5 text-body text-ink-2">
                  <X aria-hidden="true" size={20} strokeWidth={2.5} className="mt-0.5 shrink-0 text-sambal-pekat" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-2 text-body-sm text-ink-soft">
          <p>Harga dan stok boleh berubah bila-bila masa. Sila sahkan harga akhir di kedai rasmi sebelum membeli.</p>
          <p>Nama jenama, tanda dagangan dan gambar produk adalah milik pemilik masing-masing.</p>
          <p>
            Pemilik jenama? Nak kemas kini info atau keluar dari senarai?{" "}
            <a href="#cadang" className="font-semibold text-telang underline underline-offset-4">
              Guna borang kat bawah
            </a>{" "}
            atau{" "}
            <a href={`${REPO_URL}/issues`} target="_blank" rel="noopener noreferrer" className="font-semibold text-telang underline underline-offset-4">
              buka isu kat GitHub<span className="sr-only"> (tab baru)</span>
            </a>
            .
          </p>
        </div>
      </section>

      {/* 5. FAQ */}
      <section id="soalan" aria-labelledby="faq-title" className="container-page scroll-mt-28 pt-(--section-y)">
        <SectionHeader id="faq-title" eyebrow="FAQ" title="Soalan yang selalu orang tanya" />
        <div className="mt-6 max-w-[820px]">
          <Faq syncedAt={stats.syncedAt} />
        </div>
      </section>

      {/* 6. Cadang jenama */}
      <section id="cadang" aria-labelledby="cadang-title" className="scroll-mt-28 pb-4 pt-(--section-y)">
        <Band tone="bandung-fizz" as="div" className="md:px-12 md:py-12">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr] lg:gap-12">
            <div>
              <p className="text-overline uppercase text-ink-2">Cadang jenama</p>
              <h2 id="cadang-title" className="mt-1 text-title-1 text-ink">
                Kenal jenama lokal yang best?
              </h2>
              <p className="mt-2 max-w-[40ch] text-lead text-ink-2">Cadang la. Oyen catat, kami semak.</p>
              {!webhook && (
                <p className="mt-4 flex max-w-[44ch] items-start gap-2 text-body-sm text-ink-2">
                  <CircleDot aria-hidden="true" size={18} className="mt-0.5 shrink-0" />
                  Cadangan dihantar sebagai isu GitHub yang dah siap diisi; kau cuma tekan hantar kat sana.
                </p>
              )}
              <div aria-hidden="true" className="mt-10 hidden lg:block">
                <span className="relative grid size-40 place-items-center">
                  <span className="absolute inset-0 rounded-full bg-sunburst opacity-60" />
                  <Oyen mood="idle" size={128} className="relative" />
                </span>
                <p className="hand text-hand mt-2 ml-6">Oyen dah sedia pen!</p>
              </div>
            </div>
            <div className="rounded-card-lg border-2 border-ink bg-putih p-5 shadow-pop md:p-7">
              <SuggestForm mode={webhook ? "webhook" : "github"} />
            </div>
          </div>
        </Band>
      </section>
    </PageTransition>
  );
}
