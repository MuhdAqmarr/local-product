import { cn } from "@/lib/utils";

/** Mangga count bubble (tab bar Promo/Simpan, Tapis). Caps at "99+". Hidden when `count` is 0 unless `showZero`. */
export function CountBubble({ count, className, showZero = false }: { count: number; className?: string; showZero?: boolean }) {
  if (!showZero && count <= 0) return null;
  return (
    <span aria-hidden className={cn("count-bubble", className)}>
      {count > 99 ? "99+" : count}
    </span>
  );
}
