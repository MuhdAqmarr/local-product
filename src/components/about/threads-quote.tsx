import { BadgePercent, RefreshCw, Sparkles } from "@/components/ui/lucide";
import { InfoPill } from "@/components/ui/info-pill";
import { getDictionary } from "@/i18n/server";
import { cn } from "@/lib/utils";

/** The original post, always shown as written (Malay/Manglish); English pages add a gloss below it. */
const QUOTE =
  "boleh tak ada sorang buat website yang compile all local brand products daripada skincare, fashion, food to all other things yang Malaysian buat? and MUST BE UP TO DATE dari segi promotion and new products they launched";

/**
 * Origin quote (DESIGN §9.4): the Threads post as a speech bubble. The author stays anonymous:
 * a generic avatar circle, no name, handle, logo or metrics.
 */
export async function ThreadsQuote({ className }: { className?: string }) {
  const t = (await getDictionary()).about.quote;
  return (
    <figure className={cn("flex flex-col gap-4", className)}>
      <figcaption className="flex items-center gap-2.5">
        <span aria-hidden="true" className="grid size-10 place-items-center rounded-full border-2 border-ink bg-garis">
          <span className="mt-2.5 block h-3 w-5 rounded-t-full bg-ink-soft/50" />
        </span>
        <span className="text-label-sm text-ink-2">{t.who}</span>
      </figcaption>
      <blockquote lang="ms" className="about-bubble rounded-card-lg border-2 border-ink bg-putih p-5 text-[17px] leading-relaxed text-ink shadow-pop">
        <p>&ldquo;{QUOTE}&rdquo;</p>
      </blockquote>
      {t.gloss && (
        <p className="max-w-[60ch] text-body-sm text-ink-2">
          <span className="font-semibold text-ink">{t.glossLabel}</span> {t.gloss}
        </p>
      )}
    </figure>
  );
}

/** "Boleh. Ni dia." / "Sure can." answer + the three promise chips. */
export async function QuoteAnswer({ className }: { className?: string }) {
  const t = (await getDictionary()).about.quote;
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="text-ink">
        <span className="block font-num text-[48px] leading-none md:text-[64px]">{t.answer}</span>
        <span className="mt-2 block text-lead text-ink-2">{t.answerSub}</span>
      </p>
      <ul className="flex flex-wrap gap-2 md:justify-center">
        <li>
          <InfoPill tone="baru" icon={<RefreshCw aria-hidden="true" />} className="h-8 px-3 text-[13px]">
            {t.chips.sync}
          </InfoPill>
        </li>
        <li>
          <InfoPill tone="promo" icon={<BadgePercent aria-hidden="true" />} className="h-8 px-3 text-[13px]">
            {t.chips.promos}
          </InfoPill>
        </li>
        <li>
          <InfoPill tone="info" icon={<Sparkles aria-hidden="true" />} className="h-8 px-3 text-[13px]">
            {t.chips.launches}
          </InfoPill>
        </li>
      </ul>
    </div>
  );
}
