import { ArrowUpRight, RefreshCw, Search } from "@/components/ui/lucide";
import type { ReactNode } from "react";
import { Band } from "@/components/ui/band";
import { Accent, SectionHeader } from "@/components/ui/section-header";
import { displayPrice } from "@/components/product/price-text";
import type { ProductCardData } from "@/lib/types";
import { ScrollStations } from "./explainer-progress";
import { OriginQuote } from "./origin-quote";

function Step({ n, icon, title, children }: { n: number; icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 pb-8 lg:flex-col lg:gap-4 lg:pr-8 lg:pb-0">
      <span className="home-xp-dot relative z-[1] grid size-14 shrink-0 place-items-center rounded-full border-2 border-ink bg-putih text-ink shadow-pop-sm">
        {icon}
      </span>
      <div className="min-w-0 pt-1 lg:pt-0">
        <p className="text-overline text-ink-2 uppercase">Langkah {n}</p>
        <h3 className="mt-1 text-title-3 text-ink">{title}</h3>
        {children}
      </div>
    </div>
  );
}

/**
 * "Macam mana kami sentiasa up to date?" (DESIGN §8.1 #6, §9.3, §7.5 #7). The three steps teach the
 * freshness promise: the sync icon spins once, a real price gets struck through and the new price
 * pops in with its sticker, the outbound arrow nudges twice. Scroll-linked, once; "Main semula".
 * The price demo uses a real promo from the catalog (never made-up numbers).
 */
export function Explainer({ liveBrands, example, id = "cara-sync" }: { liveBrands: number; example?: ProductCardData; id?: string }) {
  const steps = [
    <Step key="sync" n={1} title="Sync dari kedai rasmi" icon={<RefreshCw aria-hidden size={24} strokeWidth={2.25} className="home-xp-sync" />}>
      <p className="mt-1.5 max-w-[34ch] text-body-sm text-ink-2">
        Robot kecil kami ronda kedai online {liveBrands} jenama, lebih kurang setiap 3 jam.
      </p>
    </Step>,
    <Step key="kesan" n={2} title="Kesan harga turun & produk baru" icon={<Search aria-hidden size={24} strokeWidth={2.25} />}>
      <p className="mt-1.5 max-w-[34ch] text-body-sm text-ink-2">
        Harga asal vs harga sekarang? Kami kira diskaun untuk kau. Produk baru terus naik rak.
      </p>
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
          <p className="mt-1.5 text-caption text-ink-2">Contoh sebenar: {example.brandName}, masa sync terakhir.</p>
        </div>
      ) : null}
    </Step>,
    <Step key="beli" n={3} title="Klik terus ke kedai" icon={<ArrowUpRight aria-hidden size={26} strokeWidth={2.25} className="home-xp-arrow" />}>
      <p className="mt-1.5 max-w-[34ch] text-body-sm text-ink-2">
        Kami tak jual apa-apa. Kau beli terus dari jenama, duit sampai kat diorang.
      </p>
    </Step>,
  ];

  return (
    <Band tone="gula-kapas" id={id} labelledBy={`${id}-title`} className="scroll-mt-28 md:py-12">
      <SectionHeader
        id={`${id}-title`}
        title={
          <>
            Macam mana kami sentiasa <Accent>up to date</Accent>?
          </>
        }
      />
      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <OriginQuote />
        </div>
        <ScrollStations
          label="Tiga langkah"
          className="lg:col-span-8 lg:pt-6"
          steps={steps}
          replay
          connectorClassName="left-[26px] top-[62px] -bottom-1.5 w-1 lg:left-[66px] lg:right-2.5 lg:top-[26px] lg:bottom-auto lg:h-1 lg:w-auto"
        />
      </div>
    </Band>
  );
}
