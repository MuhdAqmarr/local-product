import Link from "next/link";
import { Seal } from "@/components/art/seal";
import { getStats } from "@/lib/catalog";
import { BRANDS } from "@/lib/brands";
import { formatClock, formatDate } from "@/lib/freshness";
import { CATEGORIES } from "@/lib/taxonomy";
import { REPO_URL } from "@/lib/site";
import { FooterOyen } from "./footer-oyen";
import { Logo } from "./logo";
import { MotionToggle } from "./motion-toggle";
import { RandomBrandLink } from "./random-brand-link";

const linkClass = "inline-flex min-h-9 items-center text-body-sm text-santan underline-offset-4 decoration-2 decoration-jambu hover:underline";

const TEROKA = [
  { href: "/promos", label: "Promo" },
  { href: "/new", label: "Baru" },
  { href: "/brands", label: "Jenama" },
] as const;

const KAMI = [
  { href: "/about", label: "Tentang" },
  { href: "/about#sync", label: "Cara kami sync" },
  { href: "/about#cadang", label: "Cadang jenama" },
  { href: "/about#cadang", label: "Untuk pemilik jenama" },
] as const;

/** Site footer (DESIGN §6.15): rebung strip + sleeping Oyen, ink band, 4 columns, disclaimers, motion switch. */
export async function Footer() {
  const stats = await getStats();
  const slugs = BRANDS.map((b) => b.slug);
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
            <p className="mt-3 max-w-[34ch] text-body-sm text-ink-dim">Kedai runcit digital untuk jenama lokal Malaysia. Sokong lokal, satu klik je.</p>
            <Seal size={64} className="mt-5" />
          </div>

          <nav aria-labelledby="footer-teroka">
            <h2 id="footer-teroka" className="text-overline uppercase text-ink-dim">
              Teroka
            </h2>
            <ul className="mt-3 space-y-1">
              {TEROKA.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="#kategori-footer" className={linkClass}>
                  Kategori
                </a>
              </li>
              <li>
                <RandomBrandLink slugs={slugs} className={linkClass} />
              </li>
            </ul>
          </nav>

          <nav aria-labelledby="kategori-footer" className="col-span-2 row-start-3 lg:col-span-1 lg:row-start-auto">
            <h2 id="kategori-footer" className="text-overline uppercase text-ink-dim">
              Kategori
            </h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1">
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <Link href={`/categories/${c.slug}`} className={linkClass}>
                    {c.nameMs}
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
              {KAMI.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Kod sumber (GitHub)
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="container-page mt-12">
          <div className="max-w-[70ch] space-y-2 text-caption text-ink-dim">
            <p>Harga, promo dan produk diambil secara automatik dari kedai online rasmi setiap jenama, dan disemak lebih kurang setiap 3 jam.</p>
            <p>Harga dan stok boleh berubah bila-bila masa. Sila sahkan harga akhir di kedai rasmi sebelum membeli.</p>
            <p>LokalLah! ialah direktori bebas. Kami tak jual apa-apa dan tak bergabung dengan, ditaja atau disahkan oleh mana-mana jenama yang disenaraikan.</p>
            <p>Nama jenama, tanda dagangan dan gambar produk adalah milik pemilik masing-masing.</p>
            <p>Link keluar ada tag utm_source=lokallah supaya jenama tahu trafik datang dari sini. Ini bukan link affiliate.</p>
            <p>
              Pemilik jenama? Nak kemas kini info atau keluar dari senarai?{" "}
              <Link href="/about#cadang" className="text-santan underline decoration-jambu decoration-2 underline-offset-4">
                Hubungi kami
              </Link>
              .
            </p>
          </div>
          <div aria-hidden className="kuih-strip mt-8 rounded-full" />
          <div className="mt-6 flex flex-col gap-4 text-caption text-ink-dim lg:flex-row lg:items-center lg:justify-between">
            <p>© 2026 LokalLah! · Direktori bebas · Dibuat dengan sayang di Malaysia</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <p>
                Sync terakhir:{" "}
                <time dateTime={stats.syncedAt}>
                  {formatDate(stats.syncedAt)}, {formatClock(stats.syncedAt)}
                </time>
              </p>
              <MotionToggle variant="footer" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
