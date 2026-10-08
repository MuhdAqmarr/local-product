import { Megaphone } from "lucide-react";
import { Oyen } from "@/components/art/oyen";
import { Band } from "@/components/ui/band";
import { Button } from "@/components/ui/button";

/**
 * "Kenal jenama lokal yang best?" (DESIGN §8.1 #10): bandung-fizz CTA band, Oyen (happy) holding a
 * megaphone, one ink button to the suggest form on /about.
 */
export function SuggestBand() {
  return (
    <Band tone="bandung-fizz" labelledBy="cadang-band-title" className="[contain-intrinsic-size:auto_320px] [content-visibility:auto] md:px-12 md:py-10">
      <div className="flex flex-col items-center gap-5 text-center md:flex-row md:gap-8 md:text-left">
        <span aria-hidden className="relative shrink-0">
          <Oyen mood="happy" size={112} className="md:size-[132px]" />
          <span className="absolute -right-4 bottom-2 grid size-12 -rotate-12 place-items-center rounded-full border-2 border-ink bg-mangga text-ink shadow-pop-sm">
            <Megaphone size={24} strokeWidth={2.25} />
          </span>
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="cadang-band-title" className="text-title-2 text-ink">
            Kenal jenama lokal yang best?
          </h2>
          <p className="mt-2 text-lead text-ink">Cadang la. Oyen catat, kami semak.</p>
        </div>
        <Button
          href="/about#cadang"
          variant="outbound"
          size="lg"
          trailing="arrow"
          className="shrink-0"
          style={{ ["--pop-offset" as string]: "4px", ["--pop-color" as string]: "var(--color-putih)" }}
        >
          Cadang jenama
        </Button>
      </div>
    </Band>
  );
}
