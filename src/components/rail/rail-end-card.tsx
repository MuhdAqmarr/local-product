import { Link } from "@/i18n/link";
import { ArrowRight } from "@/components/ui/lucide";
import type { Locale } from "@/i18n/config";
import { commonFor } from "@/i18n/shared";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface RailEndCardProps {
  href: string;
  /** Total behind the link ("See all 38 promos →"). */
  count?: number;
  /** The noun already in the right form ("promos", "new products"…). */
  noun: string;
  /** Page language. */
  locale: Locale;
  className?: string;
}

/** The mangga sticker tile at the end of a rail (DESIGN §6.11). Full rail-cell height. */
export function RailEndCard({ href, count, noun, locale, className }: RailEndCardProps) {
  return (
    <Link href={href} transitionTypes={["nav-forward"]} className={cn("pop group h-full w-full [--pop-offset:4px] [--pop-radius:20px]", className)}>
      <span className="pop-face flex-col gap-3 rounded-card bg-mangga px-4 text-center text-ink">
        <span className="text-label leading-snug">
          {commonFor(locale).rail.seeAll}
          {count != null && (
            <>
              <br />
              <span className="font-num text-stat leading-none">{formatCount(count)}</span>
              <br />
            </>
          )}{" "}
          {noun}
        </span>
        <span className="grid size-11 place-items-center rounded-full border-2 border-ink bg-putih">
          <ArrowRight aria-hidden="true" size={20} strokeWidth={2.25} className="transition-transform duration-200 group-hover:translate-x-[3px]" />
        </span>
      </span>
    </Link>
  );
}
