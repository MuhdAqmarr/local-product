import { BadgePercent, RefreshCw, Sparkles } from "@/components/ui/lucide";
import { InfoPill } from "@/components/ui/info-pill";

const PROMISES = [
  { icon: <RefreshCw aria-hidden strokeWidth={2.5} />, label: "Auto-sync" },
  { icon: <BadgePercent aria-hidden strokeWidth={2.5} />, label: "Promo dikesan" },
  { icon: <Sparkles aria-hidden strokeWidth={2.5} />, label: "Launch baru ditangkap" },
] as const;

/**
 * The Threads post that started it all (DESIGN §9.4): a speech bubble with a generic avatar (the
 * author stays anonymous: no name, handle, logo or metrics), then our answer and three promises.
 */
export function OriginQuote() {
  return (
    <figure data-reveal="" className="flex flex-col">
      <div className="flex items-end gap-3">
        <span aria-hidden className="mb-1 grid size-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-garis">
          <span className="mt-1.5 size-3.5 rounded-full bg-faint" />
        </span>
        <blockquote className="relative rounded-card-lg rounded-bl-[6px] border-2 border-ink bg-putih p-4 text-[17px] leading-[1.55] text-ink shadow-pop-sm">
          <p>
            “boleh tak ada sorang buat website yang compile all local brand products daripada skincare, fashion, food to all other things yang
            Malaysian buat? and MUST BE UP TO DATE dari segi promotion and new products they launched”
          </p>
        </blockquote>
      </div>
      <figcaption className="mt-2 pl-[52px] text-caption text-ink-2">— seorang netizen kat Threads</figcaption>

      <div className="mt-6" style={{ ["--i" as string]: 1 }}>
        <p className="font-num text-[40px] leading-none text-ink">
          Boleh<span className="text-bandung-pekat">.</span>
        </p>
        <p className="mt-2 max-w-[34ch] text-body text-ink-2">Ni dia, dan kami pastikan sentiasa up to date.</p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Janji kami">
          {PROMISES.map((p) => (
            <li key={p.label}>
              <InfoPill tone="neutral" icon={p.icon} className="h-8 border-[1.5px] border-ink bg-putih px-3 text-[13px]">
                {p.label}
              </InfoPill>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
