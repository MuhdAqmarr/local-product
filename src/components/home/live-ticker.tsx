import { Link } from "@/i18n/link";
import { BungaRaya } from "@/components/art/bunga-raya";
import { RelTime } from "@/components/product/rel-time";
import { getDictionary } from "@/i18n/server";
import type { HomeMessages } from "@/i18n/dictionaries/en/home";
import type { ProductCardData } from "@/lib/types";
import { TickerPause } from "./ticker-pause";

type TickerEvent = { kind: "promo" | "baru"; product: ProductCardData };

/** Interleave the latest promos and launches: promo, baru, promo, baru… (max 12, one entry per product). */
function interleave(promos: ProductCardData[], launches: ProductCardData[]): TickerEvent[] {
  const out: TickerEvent[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < Math.max(promos.length, launches.length); i++) {
    for (const [kind, list] of [["promo", promos], ["baru", launches]] as const) {
      const p = list[i];
      if (p && !seen.has(p.id)) {
        seen.add(p.id);
        out.push({ kind, product: p });
      }
    }
  }
  return out.slice(0, 12);
}

function Items({ events, syncedAt, copy, t }: { events: TickerEvent[]; syncedAt: string; copy: 0 | 1; t: HomeMessages["ticker"] }) {
  return (
    <ul className={copy ? "home-ticker-dup flex shrink-0 items-center" : "flex shrink-0 items-center"} aria-hidden={copy ? true : undefined} inert={copy === 1}>
      {events.map(({ kind, product: p }) => (
        <li key={p.id} className="flex shrink-0 items-center">
          <Link
            href={`/brands/${p.brand}`}
            prefetch={false}
            transitionTypes={["nav-forward"]}
            className="flex h-11 items-center gap-1.5 rounded-full px-2 text-body-sm whitespace-nowrap text-santan underline-offset-4 decoration-jambu decoration-2 hover:underline"
          >
            <span className="font-semibold">{p.brandName}</span>
            {kind === "promo" ? (
              <>
                <span className="text-ink-dim">·</span>
                <span className="max-w-[26ch] truncate">{p.title}</span>
                <span className="text-ink-dim">{t.now}</span>
                <span className="font-num text-[15px] text-mangga">−{p.discount}%</span>
              </>
            ) : (
              <>
                <span className="text-ink-dim">{t.launched}</span>
                <span className="max-w-[26ch] truncate">{p.title}</span>
                {p.publishedAt && (
                  <>
                    <span className="text-ink-dim">·</span>
                    <RelTime iso={p.publishedAt} base={syncedAt} className="text-jambu" />
                  </>
                )}
              </>
            )}
          </Link>
          <BungaRaya size={10} className="mx-4 shrink-0" />
        </li>
      ))}
    </ul>
  );
}

/**
 * Live board / "Papan tanda live" (DESIGN §6.19): full-bleed ink band with a LIVE tag, the latest 12 real
 * events (promos + launches, each linking to its brand), a Pause/Play toggle, and a static,
 * scrollable single copy under reduced motion. Never claims when a promo started.
 */
export async function LiveTicker({ promos, launches, syncedAt }: { promos: ProductCardData[]; launches: ProductCardData[]; syncedAt: string }) {
  const events = interleave(promos, launches);
  if (!events.length) return null;
  const t = (await getDictionary()).home.ticker;
  return (
    <section aria-label={t.label} className="home-ticker on-ink mt-6 bg-ink md:mt-8" data-ambient="">
      <div className="mx-auto flex h-11 max-w-[1600px] items-center gap-3 pr-3 pl-3 md:pr-6 md:pl-6">
        <span className="flex h-7 shrink-0 items-center gap-1.5 rounded-full border-[1.5px] border-santan bg-mangga px-2.5 font-num text-[13px] leading-none tracking-[0.06em] text-ink uppercase">
          <span className="live-dot" data-ping="" aria-hidden />
          {t.tag}
        </span>
        <TickerPause duration={events.length * 4} label={t.pause}>
          <div className="marquee-track">
            <Items events={events} syncedAt={syncedAt} copy={0} t={t} />
            <Items events={events} syncedAt={syncedAt} copy={1} t={t} />
          </div>
        </TickerPause>
      </div>
    </section>
  );
}
