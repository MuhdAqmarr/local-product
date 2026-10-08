import type { ReactNode } from "react";
import { Band, type BandTone } from "@/components/ui/band";

/**
 * Static page head for loading.tsx files (§8.11: "header band real, H1 real"). Same band the
 * page renders, so the swap to real content does not jump.
 */
export function PageHead({ tone, eyebrow, title, sub, children }: { tone: BandTone; eyebrow?: ReactNode; title: ReactNode; sub?: ReactNode; children?: ReactNode }) {
  return (
    <Band as="header" tone={tone} className="mt-3 md:mt-5">
      {eyebrow && <p className="mb-2 flex items-center gap-1.5 text-overline uppercase text-ink">{eyebrow}</p>}
      <h1 className="text-title-1 text-ink">{title}</h1>
      {sub && <p className="mt-2 max-w-[56ch] text-body text-ink-2">{sub}</p>}
      {children}
    </Band>
  );
}
