import type { ReactNode } from "react";
import { EmptyRak } from "@/components/art/empty-rak";
import { Oyen, type OyenMood } from "@/components/art/oyen";
import { WauBulan } from "@/components/art/wau-bulan";
import { cn } from "@/lib/utils";

/**
 * The 404 / error frame (DESIGN §8.10): bg-senja panel, an empty rak with Oyen on the top plank,
 * a wau with a cut string drifting away. Hook-free: used by not-found (server) and error (client).
 */
export function ErrorFrame({ mood, title, body, children, kite = true, className }: { mood: OyenMood; title: ReactNode; body: ReactNode; children?: ReactNode; kite?: boolean; className?: string }) {
  return (
    <section className={cn("error-frame relative isolate mx-3 mt-3 overflow-hidden rounded-[28px] border-2 border-ink bg-senja px-5 pb-10 pt-8 shadow-pop-lg md:mx-6 md:mt-5 md:rounded-panel md:px-10 md:pb-14", className)}>
      <div className="mx-auto grid max-w-[980px] items-center gap-8 md:grid-cols-[1fr_1.1fr]">
        <div aria-hidden className="relative mx-auto w-[240px] md:order-2 md:w-[300px]">
          {kite && (
            <span className="lost-kite absolute -right-2 -top-6 md:-right-8">
              <WauBulan size={64} string="cut" />
            </span>
          )}
          <div className="relative pt-16">
            <EmptyRak size={240} className="block w-full" />
            <span className="absolute left-1/2 top-[18px] -translate-x-1/2 md:top-[22px]">
              <Oyen mood={mood} pose="loaf" size={104} />
            </span>
          </div>
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-title-1 text-ink">{title}</h1>
          <p className="mx-auto mt-3 max-w-[42ch] text-lead text-ink-2 md:mx-0">{body}</p>
          {children && <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">{children}</div>}
        </div>
      </div>
    </section>
  );
}
