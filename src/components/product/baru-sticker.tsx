import { Sparkle } from "@/components/art/sparkle";
import { NEW_WINDOW_DAYS } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

const DAY = 86_400_000;
export const BARU_JE_DAYS = 3;

export type BaruKind = "je" | "calm";

/**
 * "Baru je" (≤ 3 days) / "Baru" (≤ NEW_WINDOW_DAYS), measured against the catalog's `syncedAt`,
 * the same clock the catalog uses to decide what counts as new. Never Date.now() on the server.
 */
export function baruKind(publishedAt: string | undefined, syncedAt: string): BaruKind | null {
  if (!publishedAt) return null;
  const age = Date.parse(syncedAt) - Date.parse(publishedAt);
  if (!Number.isFinite(age) || age > NEW_WINDOW_DAYS * DAY) return null;
  return age <= BARU_JE_DAYS * DAY ? "je" : "calm";
}

export interface BaruStickerProps {
  publishedAt?: string;
  syncedAt: string;
  /** Force the calm chip (used in the meta row when a promo sticker already owns the plate). */
  calm?: boolean;
  className?: string;
}

/** Decorative (`aria-hidden`); the card's accessible name says "baru, dilancar …". */
export function BaruSticker({ publishedAt, syncedAt, calm, className }: BaruStickerProps) {
  const kind = baruKind(publishedAt, syncedAt);
  if (!kind) return null;
  if (kind === "je" && !calm) {
    return (
      <span aria-hidden="true" className={cn("baru-je select-none", className)}>
        <Sparkle size={10} tone="ink" />
        Baru je
      </span>
    );
  }
  return (
    <span aria-hidden="true" className={cn("baru select-none", className)}>
      Baru
    </span>
  );
}
