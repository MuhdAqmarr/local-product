import type { CSSProperties } from "react";
import { BungaRaya } from "@/components/art/bunga-raya";
import { Seal } from "@/components/art/seal";
import { WauBulan } from "@/components/art/wau-bulan";
import { ProductCard } from "@/components/product/product-card";
import type { ProductCardData } from "@/lib/types";
import { HeroParallax } from "./hero-parallax";

/**
 * Resting fan: rotation, placement and intro delay per card (DESIGN §7.4: −6° / 3° / −2°, 360/440/520 ms).
 * Cards are anchored by `bottom` so they always end inside the panel, whatever their height, and
 * the left card is inset so its −6° corner and sticker clear the panel border (QA F13).
 * Below xl only the first two show (each ≥150 px wide, so titles never break mid-word).
 */
const FAN = [
  { r: -6, d: 360, bottom: 56, z: 1, pos: "left-[4%] xl:left-[3%]" },
  { r: 3, d: 440, bottom: 72, z: 3, pos: "right-[4%] xl:right-auto xl:left-[calc(50%-var(--cw)/2)]" },
  { r: -2, d: 520, bottom: 24, z: 2, pos: "right-[3%] hidden xl:block" },
] as const;

/**
 * Desktop "Rak Promo Live" (DESIGN §8.1 #1, right 5 cols): 3 real cards fanned on a white panel,
 * the wau that "brings the deals" with its string trailing down to them, a bunga raya behind and
 * the static "100% Buatan Malaysia" seal. Hidden below 1024 px (its images never load on phones).
 */
export function HeroDealStack({ deals, kind, syncedAt }: { deals: ProductCardData[]; kind: "promo" | "baru"; syncedAt: string }) {
  return (
    <div className="relative hidden h-[540px] self-center lg:col-span-5 lg:block">
      <BungaRaya size={96} className="intro-slap absolute -top-2 right-[-18px]"
        style={{ transform: "rotate(12deg)", ["--d" as string]: "500ms", ["--r" as string]: "12deg", ["--r-from" as string]: "-8deg" }} />

      <HeroParallax layer="fan" className="absolute inset-x-0 top-[92px] bottom-2">
        <div className="absolute inset-0 rounded-panel border-2 border-ink bg-putih/75 shadow-pop" />
        <h2 className="absolute top-4 right-6 flex items-center gap-2 text-overline text-ink-2 uppercase">
          <span className="live-dot" aria-hidden />
          {kind === "promo" ? "Rak promo live" : "Baru sampai, live"}
        </h2>
        {deals.length > 0 && (
          <ul
            aria-label={kind === "promo" ? "Promo paling besar sekarang" : "Launch terbaru"}
            // --cw: card width, ≥150 px (titles never break mid-word) and ≤208 px; the fan itself
            // is capped at 640 px and centred so wide screens keep an overlapping fan.
            className="absolute inset-x-6 top-12 bottom-0 mx-auto max-w-[640px] [--cw:clamp(150px,44%,208px)] xl:[--cw:clamp(150px,34%,208px)]"
          >
            {deals.slice(0, 3).map((p, i) => {
              const f = FAN[i];
              const style = {
                bottom: f.bottom,
                zIndex: f.z,
                transform: `rotate(${f.r}deg)`,
                ["--r" as string]: `${f.r}deg`,
                ["--r-from" as string]: `${f.r - 10}deg`,
                ["--d" as string]: `${f.d}ms`,
              } as CSSProperties;
              return (
                <li key={p.id} className={`intro-slap absolute w-(--cw) ${f.pos}`} style={style}>
                  <ProductCard product={p} syncedAt={syncedAt} context="rail" emphasis={kind} />
                </li>
              );
            })}
          </ul>
        )}
      </HeroParallax>

      <HeroParallax layer="wau" className="pointer-events-none absolute -top-8 left-[2%] z-[4] origin-[50%_20%]">
        <span className="home-wau-in block">
          <WauBulan size={140} />
        </span>
      </HeroParallax>

      <Seal size={84} className="absolute -bottom-10 -left-6 z-[5] -rotate-12 xl:-left-10" />
    </div>
  );
}
