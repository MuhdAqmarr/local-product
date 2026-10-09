import type { ReactNode } from "react";
import { Link } from "@/i18n/link";
import { ChevronDown } from "@/components/ui/lucide";
import { formatDateTime } from "@/lib/freshness";
import { getDictionary, getLocale } from "@/i18n/server";
import { rich } from "@/i18n/rich";

interface Item {
  q: string;
  a: ReactNode;
}

/**
 * FAQ (DESIGN §8.8 #5): native exclusive accordion (`<details name="faq">`), chevron rotates, the
 * answer fades in. Facts are limited to what is true of the product today (sync, honesty, links).
 */
export async function Faq({ syncedAt }: { syncedAt: string }) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const t = dict.about.faq;
  const items: Item[] = [
    t.source,
    { q: t.frequency.q, a: rich(t.frequency.a, { when: <time dateTime={syncedAt}>{formatDateTime(syncedAt, locale)}</time> }) },
    t.prices,
    t.affiliation,
    t.utm,
    { q: t.tiers.q, a: rich(t.tiers.a, { link: <Link href="#tier">{t.tiers.link}</Link> }) },
    t.saved,
    { q: t.owners.q, a: rich(t.owners.a, { link: <Link href="#cadang">{t.owners.link}</Link> }) },
  ];

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <details key={item.q} name="faq" className="about-faq group rounded-card border-2 border-ink bg-putih shadow-pop-sm open:shadow-pop" open={i === 0}>
          <summary className="flex min-h-14 cursor-pointer items-center gap-3 rounded-card px-4 py-3 text-label text-ink [@media(hover:hover)]:hover:bg-kapas">
            <span className="flex-1 text-[16px]">{item.q}</span>
            <span className="about-chev grid size-8 shrink-0 place-items-center rounded-full bg-kapas">
              <ChevronDown aria-hidden="true" size={18} strokeWidth={2.5} />
            </span>
          </summary>
          <div className="about-faq-body px-4 pb-4 text-body text-ink-2 [&_a]:font-semibold [&_a]:text-telang [&_a]:underline [&_a]:underline-offset-4">
            <p className="max-w-[65ch]">{item.a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
