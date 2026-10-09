import type { Metadata } from "next";
import { Check, CircleDot, X } from "@/components/ui/lucide";
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
import { dictionaryFor, getDictionary, getLocale, getMessages } from "@/i18n/server";
import { MessagesProvider } from "@/i18n/client";
import { rich } from "@/i18n/rich";
import { MAKER, pageMetadata } from "@/lib/site";
import { suggestMode } from "./suggest-validate";
import { TIERS } from "@/lib/taxonomy";
import type { TierSlug } from "@/lib/types";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = dictionaryFor(locale).about.meta;
  return pageMetadata({
    locale,
    title: t.title,
    description: t.description,
    socialDescription: t.socialDescription,
    path: "/about",
  });
}

export default async function AboutPage() {
  const [stats, dict, formMessages] = await Promise.all([getStats(), getDictionary(), getMessages("about")]);
  const t = dict.about;
  const tierCounts = Object.fromEntries(TIERS.map((t) => [t.slug, brandsInTier(t.slug).length])) as Record<TierSlug, number>;
  const mode = suggestMode();

  return (
    <PageTransition>
      <ReadingProgress />

      {/* 1. Hero */}
      <Band as="header" tone="gula-kapas" className="mt-3 md:mt-5 md:px-12 md:py-12" labelledBy="about-title">
        <div className="grid items-center gap-8 md:grid-cols-[1.25fr_1fr] md:gap-12">
          <div className="min-w-0">
            <p className="text-overline uppercase text-ink-2">{t.hero.eyebrow}</p>
            <h1 id="about-title" className="mt-2 max-w-[18ch] text-title-1 text-ink">
              {rich(t.hero.title, { accent: <Accent>{t.hero.accent}</Accent> })}
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
          eyebrow={t.sync.eyebrow}
          title={rich(t.sync.title, { accent: <Accent>{t.sync.accent}</Accent> })}
        />
        <SyncExplainer className="mt-8" liveBrands={stats.liveBrands} brands={stats.brands} syncedAt={stats.syncedAt} />
      </section>

      {/* 3. Tier */}
      <section id="tier" aria-labelledby="tier-title" className="container-page scroll-mt-28 pt-(--section-y)">
        <SectionHeader
          id="tier-title"
          eyebrow={t.tiers.eyebrow}
          title={rich(t.tiers.title, { accent: <Accent>{t.tiers.accent}</Accent> })}
          sub={t.tiers.sub}
        />
        <div className="mt-8">
          <TierCards counts={tierCounts} />
        </div>
      </section>

      {/* 4. Siapa kami */}
      <section aria-labelledby="siapa-title" className="container-page pt-(--section-y)">
        <div className="flex items-end justify-between gap-4">
          <SectionHeader id="siapa-title" title={t.who.title} />
          <Seal size={64} spin className="hidden shrink-0 sm:block" />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div data-reveal="" className="rounded-card-lg border-2 border-ink bg-pandan-tint p-5">
            <h3 className="text-title-3 text-ink">{t.who.weAre}</h3>
            <ul className="mt-3 flex flex-col gap-2.5">
              {t.who.weAreList.map((line) => (
                <li key={line} className="flex gap-2.5 text-body text-ink-2">
                  <Check aria-hidden="true" size={20} strokeWidth={2.5} className="mt-0.5 shrink-0 text-pandan-pekat" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal="" style={{ ["--i" as string]: 1 }} className="rounded-card-lg border-2 border-ink bg-kapas p-5">
            <h3 className="text-title-3 text-ink">{t.who.weAreNot}</h3>
            <ul className="mt-3 flex flex-col gap-2.5">
              {t.who.weAreNotList.map((line) => (
                <li key={line} className="flex gap-2.5 text-body text-ink-2">
                  <X aria-hidden="true" size={20} strokeWidth={2.5} className="mt-0.5 shrink-0 text-sambal-pekat" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-2 text-body-sm text-ink-soft">
          <p>{t.who.prices}</p>
          <p>{t.who.trademarks}</p>
          <p>
            {rich(t.who.owners, {
              form: (
                <a href="#cadang" className="font-semibold text-telang underline underline-offset-4">
                  {t.who.ownersForm}
                </a>
              ),
            })}
          </p>
          <p>
            {rich(t.who.maker, {
              maker: (
                <a href={MAKER.url} target="_blank" rel="noopener" className="font-semibold text-telang underline underline-offset-4">
                  {MAKER.name}
                  <span className="sr-only"> {t.who.newTab}</span>
                </a>
              ),
            })}
          </p>
        </div>
      </section>

      {/* 5. FAQ */}
      <section id="soalan" aria-labelledby="faq-title" className="container-page scroll-mt-28 pt-(--section-y)">
        <SectionHeader id="faq-title" eyebrow={t.faq.eyebrow} title={t.faq.title} />
        <div className="mt-6 max-w-[820px]">
          <Faq syncedAt={stats.syncedAt} />
        </div>
      </section>

      {/* 6. Cadang jenama */}
      <section id="cadang" aria-labelledby="cadang-title" className="scroll-mt-28 pb-4 pt-(--section-y)">
        <Band tone="bandung-fizz" as="div" className="md:px-12 md:py-12">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr] lg:gap-12">
            <div>
              <p className="text-overline uppercase text-ink">{t.suggest.eyebrow}</p>
              <h2 id="cadang-title" className="mt-1 text-title-1 text-ink">
                {t.suggest.title}
              </h2>
              <p className="mt-2 max-w-[40ch] text-lead text-ink">{t.suggest.sub}</p>
              {mode === "email" && (
                <p className="mt-4 flex max-w-[44ch] items-start gap-2 text-body-sm text-ink">
                  <CircleDot aria-hidden="true" size={18} className="mt-0.5 shrink-0" />
                  {t.suggest.emailNote}
                </p>
              )}
              <div aria-hidden="true" className="mt-10 hidden lg:block">
                <span className="relative grid size-40 place-items-center">
                  <span className="absolute inset-0 rounded-full bg-sunburst opacity-60" />
                  <Oyen mood="idle" size={128} className="relative" />
                </span>
                <p className="hand text-hand mt-2 ml-6">{t.suggest.handNote}</p>
              </div>
            </div>
            <div className="rounded-card-lg border-2 border-ink bg-putih p-5 shadow-pop md:p-7">
              {mode === "closed" ? (
                <div role="note" className="flex flex-col items-center py-6 text-center">
                  <Oyen mood="idle" size={96} />
                  <p className="mt-4 text-title-3 text-ink">{t.suggest.closedTitle}</p>
                  <p className="mt-2 max-w-[42ch] text-body text-ink-2">
                    {rich(t.suggest.closedBody, {
                      maker: (
                        <a href={MAKER.url} target="_blank" rel="noopener" className="font-semibold text-telang underline underline-offset-4">
                          {MAKER.name}
                          <span className="sr-only"> {t.who.newTab}</span>
                        </a>
                      ),
                    })}
                  </p>
                </div>
              ) : (
                <MessagesProvider messages={formMessages}>
                  <SuggestForm mode={mode} />
                </MessagesProvider>
              )}
            </div>
          </div>
        </Band>
      </section>
    </PageTransition>
  );
}
