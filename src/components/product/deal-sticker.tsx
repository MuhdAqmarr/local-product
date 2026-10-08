import { Starburst } from "@/components/art/starburst";
import { dealLevel, formatDiscount, type DealLevel } from "@/lib/deal";
import { cn } from "@/lib/utils";

export interface DealStickerProps {
  discount?: number;
  /** `card` 56 px burst · `lg` 64 px (hero, brand best deal) · `mini` 40 px (search, list rows, group headers). */
  size?: "card" | "lg" | "mini";
  /** Force a level (group headers show the level's sticker with a range label). */
  level?: DealLevel;
  /** Override the label (e.g. "40%+" in a group header). */
  label?: string;
  className?: string;
}

const BURST_PX = { card: 56, lg: 64, mini: 40 } as const;

/**
 * Deal size sticker (DESIGN §5.4): L1 soft pill, L2 candy pill, L3 kad harga starburst.
 * Decorative (`aria-hidden`): the card's sr-only price sentence carries "diskaun 30%".
 */
export function DealSticker({ discount, size = "card", level, label, className }: DealStickerProps) {
  const lvl = level ?? dealLevel(discount);
  if (!lvl) return null;
  const text = label ?? (discount != null ? formatDiscount(discount) : "");

  if (lvl === 3) {
    const px = BURST_PX[size];
    return (
      <span
        aria-hidden="true"
        className={cn("deal-3 select-none", className)}
        style={{ width: px, fontSize: size === "mini" ? 12 : size === "lg" ? 18 : undefined }}
      >
        <Starburst size={px + 12} />
        <span className="relative tracking-[-0.02em]">{text}</span>
      </span>
    );
  }
  return (
    <span aria-hidden="true" className={cn(lvl === 2 ? "deal-2" : "deal-1", "select-none", className)}>
      {text}
    </span>
  );
}
