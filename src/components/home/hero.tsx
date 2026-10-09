import { Link } from "@/i18n/link";
import type { CSSProperties, ReactNode } from "react";
import { BadgePercent, Sparkles, Tag } from "@/components/ui/lucide";
import { ArrowDoodle } from "@/components/art/arrow-doodle";
import { BungaRaya } from "@/components/art/bunga-raya";
import { Oyen } from "@/components/art/oyen";
import { Sparkle } from "@/components/art/sparkle";
import { Squiggle } from "@/components/art/squiggle";
import { Starburst } from "@/components/art/starburst";
import { TierIcon } from "@/components/art/tier-icon";
import { LivePill } from "@/components/feedback/live-pill";
import { Odometer } from "@/components/feedback/odometer";
import { HeroIntroGuard } from "@/components/motion/hero-intro-guard";
import { HeroSearchPill } from "@/components/search/hero-search-pill";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { ChipRow } from "@/components/category/chip-row";
import { fmt, plural, pluralForm } from "@/i18n/format";
import { rich } from "@/i18n/rich";
import { getDictionary } from "@/i18n/server";
import type { HomeMessages } from "@/i18n/dictionaries/en/home";
import type { SiteStats } from "@/lib/catalog";
import type { ProductCardData } from "@/lib/types";
import { HeroDealStack } from "./hero-deal-stack";
import { HeroParallax } from "./hero-parallax";

const d = (ms: number) => ({ ["--d" as string]: `${ms}ms` }) as CSSProperties;

const QUICK: { href: string; key: keyof HomeMessages["hero"]["quick"]; icon: ReactNode }[] = [
  { href: "/promos?diskaun=40", key: "discount", icon: <BadgePercent strokeWidth={2} /> },
  { href: "/new?masa=minggu", key: "thisWeek", icon: <Sparkles strokeWidth={2} /> },
  { href: "/brands?tier=cili-padi", key: "ciliPadi", icon: <TierIcon tier="cili-padi" size={18} /> },
  { href: "/promos?harga=0-30", key: "under30", icon: <Tag strokeWidth={2} /> },
];

export interface HeroProps {
  stats: SiteStats;
  /** Up to 3 live cards for the desktop fan (biggest discount first, else newest launches). */
  deals: ProductCardData[];
  dealKind: "promo" | "baru";
}

/**
 * Home hero "Kedai Oyen" (DESIGN §8.1 #1, §7.4). The H1 text is the LCP and paints in the first
 * frame with no animation; everything around it plays the CSS-only intro once per session.
 * No raster images on phones: mesh, stickers and Oyen are CSS + inline SVG.
 */
export async function Hero({ stats, deals, dealKind }: HeroProps) {
  const { hero: t, search } = (await getDictionary()).home;
  const stat = [
    { value: stats.brands, label: t.stats.brands, href: "/brands", d: 260 },
    { value: stats.promos, label: t.stats.promos, href: "/promos", d: 320 },
    { value: stats.newLaunches, label: t.stats.new, href: "/new", d: 380 },
  ];
  const discount = `−${stats.maxDiscount}%`;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate mx-3 mt-3 overflow-hidden rounded-sheet border-2 border-ink bg-gula-kapas shadow-pop-lg md:mx-6 md:rounded-panel"
    >
      <HeroIntroGuard />
      <HeroParallax layer="mesh" className="absolute inset-x-0 -top-24 bottom-0 -z-10">
        <div className="mesh" data-ambient="">
          <span className="mesh-blob" />
          <span className="mesh-blob" />
          <span className="mesh-blob" />
        </div>
      </HeroParallax>

      {/* Mobile decor: bunga raya bleeding off the right edge + 2 sparkles (desktop has the deal stack). */}
      <span aria-hidden className="pointer-events-none absolute top-3 -right-4 lg:hidden">
        <BungaRaya size={56} className="intro-slap block" style={{ transform: "rotate(-8deg)", ["--r" as string]: "-8deg", ...d(500) }} />
      </span>
      <Sparkle size={18} className="intro-slap pointer-events-none absolute top-6 right-[72px] lg:top-12 lg:right-[44%]" style={{ ["--r" as string]: "0deg", ...d(570) }} />
      <Sparkle size={14} className="intro-slap pointer-events-none absolute top-[132px] right-3 lg:top-auto lg:right-auto lg:bottom-16 lg:left-[52%]" style={{ ["--r" as string]: "0deg", ...d(640) }} />

      <div className="relative grid gap-10 px-4 pt-5 pb-7 sm:px-8 sm:pt-7 lg:grid-cols-12 lg:gap-8 lg:px-14 lg:pt-11 lg:pb-12 lg:pr-10">
        <div className="flex min-w-0 flex-col lg:col-span-7">
          <div className="flex items-center gap-3">
            <div className="intro-rise" style={d(0)}>
              <LivePill syncedAt={stats.syncedAt} source={stats.source} liveBrands={stats.liveBrands} brands={stats.brands} promos={stats.promos} watch />
            </div>
            <p aria-hidden className="intro-rise hidden items-center gap-1 lg:flex" style={d(420)}>
              <ArrowDoodle size={52} flip className="-mt-2" />
              <span className="hand text-hand">{t.note}</span>
            </p>
          </div>

          <div className="relative mt-4 sm:w-fit lg:mt-5">
            <h1 id="hero-title" className="max-w-[13ch] text-display text-ink lg:max-w-[12.5ch]">
              {rich(t.title, {
                local: (
                  <span className="relative inline-block">
                    <span className="text-grad-lokal">{t.local}</span>
                    <span aria-hidden className="intro-swash absolute inset-x-0 -bottom-[0.14em] block" style={d(120)}>
                      <Squiggle variant="swash" height={12} />
                    </span>
                  </span>
                ),
                fresh: (
                  <span className="relative isolate inline-block whitespace-nowrap">
                    <span aria-hidden className="intro-swash absolute inset-x-[-0.08em] bottom-[0.08em] -z-10 h-[38%] rounded-[4px] bg-mangga" style={d(280)} />
                    {t.fresh}
                  </span>
                ),
              })}
            </h1>

            {stats.maxDiscount > 0 && (
              // The Gochi "sampai!" note sits outside the link so the link's visible text is just
              // "−N%", which its name starts with (QA F28). Hidden below 390 px, where it would hit
              // "date." (QA F27).
              <span className="absolute right-0 -bottom-6 lg:-right-4 lg:-bottom-2">
                <Link href="/promos" transitionTypes={["nav-forward"]} aria-label={fmt(t.burstLabel, { discount })} className="group block">
                  <span
                    className="intro-slap relative grid size-16 place-items-center transition-transform duration-200 ease-pop group-hover:scale-105"
                    style={{ transform: "rotate(-10deg)", ["--r" as string]: "-10deg", ["--r-from" as string]: "-24deg", ...d(300) }}
                  >
                    <Starburst size={64} className="absolute inset-0" />
                    <span className="relative font-num text-[17px] leading-none text-ink">{discount}</span>
                  </span>
                </Link>
                <span
                  aria-hidden
                  className="hand intro-rise pointer-events-none absolute top-1/2 right-full mr-1 hidden -translate-y-1/2 text-hand whitespace-nowrap min-[390px]:block lg:hidden"
                  style={d(460)}
                >
                  {t.upTo}
                </span>
              </span>
            )}
          </div>

          <p className="mt-5 max-w-[40ch] text-lead text-ink-2 lg:max-w-[46ch]">
            {fmt(t.sub, { brands: stats.brands, liveBrands: stats.liveBrands })}
          </p>

          <HeroSearchPill
            className="mt-16 lg:max-w-[520px]"
            copy={search}
            peek={<Oyen mood="idle" pose="peek" size={76} />}
          />

          <div className="mt-5 hidden gap-4 lg:flex">
            <Button href="/promos" transitionTypes={["nav-forward"]} trailing="arrow">
              {t.ctaPromos}
            </Button>
            <Button href="/new" variant="secondary" transitionTypes={["nav-forward"]} trailing="arrow">
              {t.ctaNew}
            </Button>
          </div>

          <div className="intro-rise mt-4 lg:hidden" style={d(200)}>
            <ChipRow label={t.quickLabel} wrapFrom="never">
              {QUICK.map((q) => (
                <Chip key={q.href} href={q.href} icon={q.icon} prefetch={false} transitionTypes={["nav-forward"]} className="bg-putih/90">
                  {t.quick[q.key]}
                </Chip>
              ))}
            </ChipRow>
          </div>

          <ul className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3 lg:mt-7 lg:max-w-[520px]">
            {stat.map((s) => (
              <li key={s.href} className="intro-rise" style={d(s.d)}>
                <Link
                  href={s.href}
                  transitionTypes={["nav-forward"]}
                  className="group flex h-full flex-col rounded-[18px] border-2 border-ink bg-putih/85 px-3 pt-2.5 pb-2 shadow-pop-sm transition-transform duration-150 ease-out-soft hover:-translate-y-0.5 active:translate-y-px"
                >
                  <Odometer value={s.value} roll="intro" className="text-stat text-ink" srText={plural(s.value, `{count} ${pluralForm(s.value, s.label)}`)} />
                  <span aria-hidden className="mt-1 text-caption font-semibold text-ink-2">
                    {pluralForm(s.value, s.label)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <HeroDealStack deals={deals} kind={dealKind} syncedAt={stats.syncedAt} />
      </div>
    </section>
  );
}
