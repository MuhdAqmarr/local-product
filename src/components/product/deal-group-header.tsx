import { DEAL_GROUPS, type DealLevel } from "@/lib/deal";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/utils";
import { DealSticker } from "./deal-sticker";

export interface DealGroupHeaderProps {
  level: DealLevel;
  count?: number;
  /**
   * Omit: sticks under header + filter bar and moves with the header stack (`.sticky-sub`).
   * A CSS length: sticky at that `top` instead. `null`: not sticky (e.g. in a kitchen or sidebar).
   */
  stickyTop?: string | null;
  id?: string;
  className?: string;
}

const STICKER_LABEL: Record<DealLevel, string> = { 3: "40%+", 2: "20%+", 1: "5%+" };

/**
 * /promos sticky 32 px sub-header that uses the sticker itself as the legend (DESIGN §8.2):
 * L3 burst mini + "≥ 40% · Jimat gila", L2 pill + "20–39% · Berbaloi", L1 pill + "5–19% · Ada la sikit".
 */
export function DealGroupHeader({ level, count, stickyTop, id, className }: DealGroupHeaderProps) {
  const g = DEAL_GROUPS[level];
  return (
    <h2
      id={id}
      className={cn(
        stickyTop === undefined ? "sticky-sub" : stickyTop !== null && "sticky z-20",
        "-mx-(--gutter) flex h-11 items-center gap-2.5 bg-santan/96 px-(--gutter) text-label text-ink",
        className,
      )}
      style={stickyTop != null ? { top: stickyTop } : undefined}
    >
      <span className="grid min-w-11 shrink-0 place-items-center">
        <DealSticker level={level} label={STICKER_LABEL[level]} size="mini" className={level === 3 ? "text-[11px]" : undefined} />
      </span>
      <span className="truncate">
        <span className="font-num">{g.range}</span> · {g.label}
      </span>
      {count != null && (
        <span className="ml-auto shrink-0 text-caption text-ink-soft">
          <span className="font-num text-ink">{formatCount(count)}</span> promo
        </span>
      )}
    </h2>
  );
}
