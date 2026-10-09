"use client";

import { announce, toast } from "@/components/feedback/toast-store";
import { useI18n } from "@/i18n/client";
import { useSaved } from "@/lib/saved";
import type { ProductCardData } from "@/lib/types";
import { HeartToggle } from "./heart-toggle";

const FIRST_SAVE_KEY = "lokallah:first-save";

/** True only for the first save of this browser session (teach-once toast, DESIGN §7.6 step 6). */
function firstSaveOfSession(): boolean {
  try {
    if (window.sessionStorage.getItem(FIRST_SAVE_KEY)) return false;
    window.sessionStorage.setItem(FIRST_SAVE_KEY, "1");
    return true;
  } catch {
    return false;
  }
}

export interface SaveButtonProps {
  product: ProductCardData;
  size?: "md" | "lg";
  tone?: "float" | "solid";
  className?: string;
}

/**
 * Product heart (DESIGN §7.6 "Masuk Simpan"). Stores the full ProductCardData so /saved can
 * render the card and compare prices later. First save of a session shows the teaching toast;
 * later saves are announced to screen readers only. Unsave offers Undo.
 */
export function SaveButton({ product, size, tone, className }: SaveButtonProps) {
  const { isSaved, toggle } = useSaved();
  const { m, fmt, href } = useI18n();
  const t = m.common.save;
  const saved = isSaved(product.id);
  const item = { kind: "product", id: product.id, product } as const;

  return (
    <HeartToggle
      saved={saved}
      size={size}
      tone={tone}
      className={className}
      label={{ save: fmt(t.save, { title: product.title }), unsave: fmt(t.unsave, { title: product.title }) }}
      onToggle={() => toggle(item)}
      onChange={(now) => {
        if (now) {
          if (firstSaveOfSession()) {
            toast({ message: t.firstSave, tone: "save", action: { label: t.view, href: href("/saved") } });
          } else {
            announce(t.saved);
          }
        } else {
          toast({ message: t.removed, tone: "save", action: { label: t.undo, onClick: () => toggle(item) } });
        }
      }}
    />
  );
}
