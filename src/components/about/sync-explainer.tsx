import type { CSSProperties } from "react";
import { ArrowUpRight, BadgePercent, RefreshCw } from "lucide-react";
import { formatClock, formatDate } from "@/lib/freshness";
import { cn } from "@/lib/utils";
import "./about.css";

const STEPS = [
  {
    icon: RefreshCw,
    title: "Sync dari kedai rasmi",
    body: "Robot kecil kami ronda kedai online setiap jenama, lebih kurang setiap 3 jam, dan sekali lagi setiap pagi sekitar pukul 6.",
    tone: "bg-pandan",
  },
  {
    icon: BadgePercent,
    title: "Kesan harga turun & produk baru",
    body: "Harga asal vs harga sekarang? Kami kira diskaun untuk kau. Produk baru terus naik rak.",
    tone: "bg-bandung",
  },
  {
    icon: ArrowUpRight,
    title: "Klik terus ke kedai",
    body: "Kami tak jual apa-apa. Kau beli terus dari jenama, duit sampai kat diorang.",
    tone: "bg-mangga",
  },
] as const;

/**
 * "Cara kami sync" (DESIGN §9.3), the /about version of the Home explainer: three numbered steps
 * joined by a dashed line (vertical on phones, horizontal from 768 px) that rise in on reveal,
 * plus the real numbers from the catalog.
 */
export function SyncExplainer({ liveBrands, brands, syncedAt, className }: { liveBrands: number; brands: number; syncedAt: string; className?: string }) {
  return (
    <div className={className}>
      <ol className="about-steps relative grid gap-6 md:grid-cols-3 md:gap-5">
        <span aria-hidden="true" className="absolute bottom-6 left-[27px] top-6 border-l-2 border-dashed border-ink/40 md:bottom-auto md:left-[16%] md:right-[16%] md:top-[27px] md:border-l-0 md:border-t-2" />
        {STEPS.map((s, i) => (
          <li key={s.title} data-reveal="" style={{ "--i": i } as CSSProperties} className="relative flex gap-4 md:flex-col md:items-center md:text-center">
            <span className={cn("about-step-dot relative grid size-14 shrink-0 place-items-center rounded-full border-2 border-ink text-ink shadow-pop-sm", s.tone)}>
              <s.icon aria-hidden="true" size={24} strokeWidth={2.25} />
              <span className="absolute -right-1.5 -top-1.5 grid size-6 place-items-center rounded-full border-[1.5px] border-ink bg-putih font-num text-[13px] leading-none">{i + 1}</span>
            </span>
            <div className="min-w-0 pt-1 md:pt-0">
              <h3 className="text-title-3 text-ink">{s.title}</h3>
              <p className="mt-1 max-w-[36ch] text-body text-ink-2 md:mx-auto">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-8 rounded-card border-2 border-dashed border-garis-kuat bg-putih/70 px-4 py-3 text-body-sm text-ink-2">
        Sekarang, <span className="font-num text-ink">{liveBrands}</span> daripada <span className="font-num text-ink">{brands}</span> jenama ada kedai online yang
        kami boleh baca terus. Yang lain kami senaraikan dengan link rasmi diorang je. Sync terakhir:{" "}
        <time dateTime={syncedAt} className="text-ink">
          {formatDate(syncedAt)}, {formatClock(syncedAt)}
        </time>
        .
      </p>
    </div>
  );
}
