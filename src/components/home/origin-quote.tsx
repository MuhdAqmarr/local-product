import { BadgePercent, RefreshCw, Sparkles } from "@/components/ui/lucide";
import { InfoPill } from "@/components/ui/info-pill";
import { getDictionary } from "@/i18n/server";

const PROMISES = [
  { icon: <RefreshCw aria-hidden strokeWidth={2.5} />, key: "sync" },
  { icon: <BadgePercent aria-hidden strokeWidth={2.5} />, key: "promos" },
  { icon: <Sparkles aria-hidden strokeWidth={2.5} />, key: "launches" },
] as const;

/**
 * The Threads post that started it all (DESIGN §9.4): a speech bubble with a generic avatar (the
 * author stays anonymous: no name, handle, logo or metrics), then our answer and three promises.
 * The post itself is quoted as written (Manglish) in both languages, marked with its `lang`.
 */
export async function OriginQuote() {
  const t = (await getDictionary()).home.origin;
  return (
    <figure data-reveal="" className="flex flex-col">
      <div className="flex items-end gap-3">
        <span aria-hidden className="mb-1 grid size-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-garis">
          <span className="mt-1.5 size-3.5 rounded-full bg-faint" />
        </span>
        <blockquote className="relative rounded-card-lg rounded-bl-[6px] border-2 border-ink bg-putih p-4 text-[17px] leading-[1.55] text-ink shadow-pop-sm">
          <p lang={t.quoteLang}>“{t.quote}”</p>
        </blockquote>
      </div>
      <figcaption className="mt-2 pl-[52px] text-caption text-ink-2">{t.source}</figcaption>

      <div className="mt-6" style={{ ["--i" as string]: 1 }}>
        <p className="font-num text-[40px] leading-none text-ink">
          {t.answer}
          <span className="text-bandung-pekat">.</span>
        </p>
        <p className="mt-2 max-w-[34ch] text-body text-ink-2">{t.answerSub}</p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label={t.promisesLabel}>
          {PROMISES.map((p) => (
            <li key={p.key}>
              <InfoPill tone="neutral" icon={p.icon} className="h-8 border-[1.5px] border-ink bg-putih px-3 text-[13px]">
                {t.promises[p.key]}
              </InfoPill>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
