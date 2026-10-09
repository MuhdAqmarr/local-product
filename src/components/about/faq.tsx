import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronDown } from "@/components/ui/lucide";
import { formatClock, formatDate } from "@/lib/freshness";
import { REPO_URL } from "@/lib/site";
import "./about.css";

interface Item {
  q: string;
  a: ReactNode;
}

/**
 * FAQ (DESIGN §8.8 #5): native exclusive accordion (`<details name="faq">`), chevron rotates, the
 * answer fades in. Facts are limited to what is true of the product today (sync, honesty, links).
 */
export function Faq({ syncedAt }: { syncedAt: string }) {
  const items: Item[] = [
    {
      q: "Data harga dan promo ni datang dari mana?",
      a: (
        <>
          Terus dari kedai online rasmi setiap jenama. Kami baca senarai produk kedai tu, kira diskaun dari harga asal vs harga sekarang, dan tandakan produk
          yang baru dilancar. Jenama yang kedainya belum boleh dibaca automatik tetap disenaraikan, dengan link rasmi diorang.
        </>
      ),
    },
    {
      q: "Berapa kerap data dikemas kini?",
      a: (
        <>
          Lebih kurang setiap 3 jam di belakang tabir, dan sekali lagi setiap hari sekitar pukul 6 pagi. Sync terakhir:{" "}
          <time dateTime={syncedAt}>
            {formatDate(syncedAt)}, {formatClock(syncedAt)}
          </time>
          . Setiap kad produk tunjuk bila harganya disemak.
        </>
      ),
    },
    {
      q: "Harga kat sini confirm sama dengan kat kedai?",
      a: "Harga dan stok boleh berubah bila-bila masa, termasuk antara dua sync. Sila sahkan harga akhir kat kedai rasmi jenama sebelum bayar.",
    },
    {
      q: "LokalLah! ada kaitan dengan jenama-jenama ni?",
      a: "Tak ada. LokalLah! ialah direktori bebas. Kami tak bergabung dengan, ditaja atau disahkan oleh mana-mana jenama yang disenaraikan. Kami tak ambil komisen, dan tak ada tempat berbayar: susunan jenama dan produk bukan untuk dijual.",
    },
    {
      q: "Kenapa link keluar ada utm_source=lokallah?",
      a: "Supaya jenama boleh nampak dalam analitik diorang yang lawatan tu datang dari LokalLah!. Ini bukan link affiliate dan kami tak dapat apa-apa bila kau beli.",
    },
    {
      q: "Apa beza Cili Padi, Naik Daun dan Jenama Ikon?",
      a: (
        <>
          Tier ni cerita saiz jenama: Cili Padi untuk pembuat kecil dan home-grown, Naik Daun untuk jenama yang tengah makin dikenali, Jenama Ikon untuk nama
          yang satu Malaysia kenal. <Link href="#tier">Tengok tier</Link>.
        </>
      ),
    },
    {
      q: "Simpanan aku disimpan kat mana?",
      a: "Dalam browser kau je (localStorage). Tak perlu login dan kami tak nampak apa yang kau simpan. Clear data browser, hilanglah dia.",
    },
    {
      q: "Aku pemilik jenama. Nak betulkan info atau keluar dari senarai?",
      a: (
        <>
          Boleh. Guna <Link href="#cadang">borang cadangan</Link> kat bawah, atau buka isu terus kat{" "}
          <a href={`${REPO_URL}/issues`} target="_blank" rel="noopener noreferrer">
            GitHub kami<span className="sr-only"> (tab baru)</span>
          </a>
          . Bagitahu nama jenama dan apa yang perlu diubah.
        </>
      ),
    },
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
