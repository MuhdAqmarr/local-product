"use client";

import { announce, toast } from "@/components/feedback/toast-store";
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
  const saved = isSaved(product.id);
  const item = { kind: "product", id: product.id, product } as const;

  return (
    <HeartToggle
      saved={saved}
      size={size}
      tone={tone}
      className={className}
      label={{ save: `Simpan ${product.title}`, unsave: `Buang ${product.title} dari simpanan` }}
      onToggle={() => toggle(item)}
      onChange={(now) => {
        if (now) {
          if (firstSaveOfSession()) {
            toast({ message: "Masuk Simpan! Semua ada kat tab Simpan.", tone: "save", action: { label: "Tengok", href: "/saved" } });
          } else {
            announce("Disimpan");
          }
        } else {
          toast({ message: "Dah buang dari Simpan.", tone: "save", action: { label: "Undo", onClick: () => toggle(item) } });
        }
      }}
    />
  );
}
