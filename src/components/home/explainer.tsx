import { ArrowUpRight, RefreshCw, Search } from "@/components/ui/lucide";
import type { ReactNode } from "react";
import { fmt } from "@/i18n/format";
import { rich } from "@/i18n/rich";
import { getDictionary } from "@/i18n/server";
import { Band } from "@/components/ui/band";
import { Accent, SectionHeader } from "@/components/ui/section-header";
import { displayPrice } from "@/components/product/price-text";
import type { ProductCardData } from "@/lib/types";
import { ScrollStations } from "./explainer-progress";
import { OriginQuote } from "./origin-quote";

function Step({ label, icon, title, children }: { label: string; icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 pb-8 lg:flex-col lg:gap-4 lg:pr-8 lg:pb-0">
      <span className="home-xp-dot relative z-[1] grid size-14 shrink-0 place-items-center rounded-full border-2 border-ink bg-putih text-ink shadow-pop-sm">
        {icon}
      </span>
      <div className="min-w-0 pt-1 lg:pt-0">
        <p className="text-overline text-ink-2 uppercase">{label}</p>
        <h3 className="mt-1 text-title-3 text-ink">{title}</h3>
        {children}
      </div>
    </div>
  );
}

/**
 * "How do we stay up to date?" / "Macam mana kami sentiasa up to date?" (DESIGN §8.1 #6, §9.3, §7.5 #7). The three steps teach the
 * freshness promise: the sync icon spins once, a real price gets struck through and the new price
 * pops in with its sticker, the outbound arrow nudges twice. Scroll-linked, once; a replay button.
 * The price demo uses a real promo from the catalog (never made-up numbers).
 */
export async function Explainer({ liveBrands, example, id = "cara-sync" }: { liveBrands: number; example?: ProductCardData; id?: string }) {
  const t = (await getDictionary()).home.explainer;
  const steps = [
    <Step key="sync" label={fmt(t.step, { n: 1 })} title={t.syncTitle} icon={<RefreshCw aria-hidden size={24} strokeWidth={2.25} className="home-xp-sync" />}>
      <p className="mt-1.5 max-w-[34ch] text-body-sm text-ink-2">{fmt(t.syncBody, { liveBrands })}</p>
    </Step>,
    <Step key="kesan" label={fmt(t.step, { n: 2 })} title={t.trackTitle} icon={<Search aria-hidden size={24} strokeWidth={2.25} />}>
      <p className="mt-1.5 max-w-[34ch] text-body-sm text-ink-2">{t.trackBody}</p>
      {example?.compareAt && example.discount ? (
        <div className="mt-3">
          <p className="inline-flex items-center gap-2.5 rounded-[16px] border-2 border-garis bg-putih py-2 pr-2.5 pl-3">
            <span className="relative font-num text-[15px] text-ink-soft">
              {displayPrice(example.compareAt, example.currency)}
              <span aria-hidden className="home-xp-strike absolute inset-x-[-2px] top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-bandung-pekat" />
            </span>
            <span className="home-xp-new inline-block font-num text-price text-bandung-pekat">{displayPrice(example.price, example.currency)}</span>
            <span className={example.discount >= 20 ? "home-xp-sticker deal-2" : "home-xp-sticker deal-1"}>−{example.discount}%</span>
          </p>
          <p className="mt-1.5 text-caption text-ink-2">{fmt(t.example, { brand: example.brandName })}</p>
        </div>
      ) : null}
    </Step>,
    <Step key="beli" label={fmt(t.step, { n: 3 })} title={t.buyTitle} icon={<ArrowUpRight aria-hidden size={26} strokeWidth={2.25} className="home-xp-arrow" />}>
      <p className="mt-1.5 max-w-[34ch] text-body-sm text-ink-2">{t.buyBody}</p>
    </Step>,
  ];

  return (
    <Band tone="gula-kapas" id={id} labelledBy={`${id}-title`} className="scroll-mt-28 md:py-12">
      <SectionHeader
        id={`${id}-title`}
        title={rich(t.title, { accent: <Accent>{t.accent}</Accent> })}
      />
      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <OriginQuote />
        </div>
        <ScrollStations
          label={t.stepsLabel}
          className="lg:col-span-8 lg:pt-6"
          steps={steps}
          replay={t.replay}
          connectorClassName="left-[26px] top-[62px] -bottom-1.5 w-1 lg:left-[66px] lg:right-2.5 lg:top-[26px] lg:bottom-auto lg:h-1 lg:w-auto"
        />
      </div>
    </Band>
  );
}
