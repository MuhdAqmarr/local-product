import { Link } from "@/i18n/link";
import { Seal } from "@/components/art/seal";
import { getStats } from "@/lib/catalog";
import { BRANDS } from "@/lib/brands";
import { getDictionary, getLocale } from "@/i18n/server";
import { formatDateTime } from "@/lib/freshness";
import { MAKER } from "@/lib/site";
import { CATEGORIES, categoryLabel } from "@/lib/taxonomy";
import { FooterOyen } from "./footer-oyen";
import { LanguageToggle } from "./language-toggle";
import { Logo } from "./logo";
import { MotionToggle } from "./motion-toggle";
import { RandomBrandLink } from "./random-brand-link";

const linkClass = "inline-flex min-h-9 items-center text-body-sm text-santan underline-offset-4 decoration-2 decoration-jambu hover:underline";

/**
 * Site footer (DESIGN §6.15): rebung strip + sleeping Oyen, ink band, 4 columns, disclaimers,
 * language + motion switches, MaqmarX credit. Hrefs are language-neutral (Link localizes them).
 */
export async function Footer() {
  const [stats, locale, t] = await Promise.all([getStats(), getLocale(), getDictionary()]);
  const f = t.common.footer;
  const nav = t.common.nav;
  const slugs = BRANDS.map((b) => b.slug);
  const explore = [
    { href: "/promos", label: nav.promos },
    { href: "/new", label: nav.new },
    { href: "/brands", label: nav.brands },
  ];
  const us = [
    { href: "/about", label: f.about },
    { href: "/about#sync", label: f.howWeSync },
    { href: "/about#cadang", label: f.suggest },
    { href: "/about#cadang", label: f.forOwners },
  ];
  return (
    <footer className="footer-wrap relative mt-[var(--section-y)] [contain-intrinsic-size:auto_560px] [content-visibility:auto]">
      <div aria-hidden className="h-16 bg-teh-tarik" />
      <div className="relative">
        <div className="pucuk" aria-hidden />
        <FooterOyen />
      </div>
      <div className="on-ink bg-ink pb-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+24px)] text-santan lg:pb-10">
        <div className="container-page grid grid-cols-2 gap-x-6 gap-y-10 pt-12 lg:grid-cols-[1.3fr_1fr_1.4fr_1fr]">
          <div className="col-span-2 lg:col-span-1">
            <Logo onInk />
            <p className="mt-3 max-w-[34ch] text-body-sm text-ink-dim">{f.tagline}</p>
            <Seal size={64} className="mt-5" />
          </div>

          <nav aria-labelledby="footer-teroka">
            <h2 id="footer-teroka" className="text-overline uppercase text-ink-dim">
              {f.explore}
            </h2>
            <ul className="mt-3 space-y-1">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="#kategori-footer" className={linkClass}>
                  {f.categories}
                </a>
              </li>
              <li>
                <RandomBrandLink slugs={slugs} className={linkClass} />
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="kategori-footer" className="col-span-2 row-start-3 lg:col-span-1 lg:row-start-auto">
            <h2 id="kategori-footer" className="text-overline uppercase text-ink-dim">
              {f.categories}
            </h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/categories/${c.slug}`} className={linkClass}>
                    {categoryLabel(c, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-kami">
            <h2 id="footer-kami" className="text-overline uppercase text-ink-dim">
              LokalLah!
            </h2>
            <ul className="mt-3 space-y-1">
              {us.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="container-page mt-12">
          <div className="max-w-[70ch] space-y-2 text-caption text-ink-dim">
            <p>{f.disclaimers.source}</p>
            <p>{f.disclaimers.prices}</p>
            <p>{f.disclaimers.independent}</p>
            <p>{f.disclaimers.trademarks}</p>
            <p>{f.disclaimers.outbound}</p>
            <p>
              {f.disclaimers.owners}{" "}
              <Link href="/about#cadang" className="text-santan underline decoration-jambu decoration-2 underline-offset-4">
                {f.disclaimers.contact}
              </Link>
              .
            </p>
          </div>
          <div aria-hidden className="kuih-strip mt-8 rounded-full" />
          <div className="mt-6 flex flex-col gap-4 text-caption text-ink-dim lg:flex-row lg:items-center lg:justify-between">
            <p>
              {f.copyright} · {f.madeWith}{" "}
              <span role="img" aria-label={f.flower}>
                🌺
              </span>{" "}
              {f.by}{" "}
              <a
                href={MAKER.url}
                target="_blank"
                rel="noopener"
                className="font-semibold text-santan underline decoration-jambu decoration-2 underline-offset-4 hover:decoration-mangga"
              >
                {MAKER.name}<span className="sr-only"> {f.newTab}</span>
              </a>
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <p>
                {f.lastSync} <time dateTime={stats.syncedAt}>{formatDateTime(stats.syncedAt, locale)}</time>
              </p>
              <LanguageToggle variant="footer" />
              <MotionToggle variant="footer" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
