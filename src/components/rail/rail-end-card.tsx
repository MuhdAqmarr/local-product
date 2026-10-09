import Link from "next/link";
import { ArrowRight } from "@/components/ui/lucide";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface RailEndCardProps {
  href: string;
  /** Total behind the link ("Tengok semua 38 promo →"). */
  count?: number;
  /** "promo", "produk baru", "jenama"… */
  noun: string;
  className?: string;
}

/** The mangga sticker tile at the end of a rail (DESIGN §6.11). Full rail-cell height. */
export function RailEndCard({ href, count, noun, className }: RailEndCardProps) {
  return (
    <Link href={href} transitionTypes={["nav-forward"]} className={cn("pop group h-full w-full [--pop-offset:4px] [--pop-radius:20px]", className)}>
      <span className="pop-face flex-col gap-3 rounded-card bg-mangga px-4 text-center text-ink">
        <span className="text-label leading-snug">
          Tengok semua
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
