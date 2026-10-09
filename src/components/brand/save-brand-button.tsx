"use client";

import { HeartToggle } from "@/components/product/heart-toggle";
import { toast } from "@/components/feedback/toast-store";
import { useI18n } from "@/i18n/client";
import { brandSavedId, useSaved, type SavedBrand } from "@/lib/saved";

export interface SaveBrandButtonProps {
  brand: SavedBrand["brand"];
  /** `float` (on a tinted band) or `solid` (2 px ink, on surfaces such as the brand hero). */
  tone?: "float" | "solid";
  size?: "md" | "lg";
  className?: string;
}

/** Brand heart (DESIGN §6.8 / §9.8): saves to the same "Simpan" list as products. */
export function SaveBrandButton({ brand, tone = "float", size = "md", className }: SaveBrandButtonProps) {
  const { isSaved, toggle } = useSaved();
  const id = brandSavedId(brand.slug);
  const { m, fmt, href } = useI18n();
  const t = m.common.save;

  return (
    <HeartToggle
      saved={isSaved(id)}
      tone={tone}
      size={size}
      className={className}
      label={{ save: fmt(t.saveBrand, { name: brand.name }), unsave: fmt(t.unsaveBrand, { name: brand.name }) }}
      onToggle={() => toggle({ kind: "brand", id, brand })}
      onChange={(now) => {
        if (now) {
          toast({ message: t.brandSaved, tone: "save", action: { label: t.view, href: href("/saved") } });
        } else {
          toast({
            message: t.removed,
            tone: "save",
            action: { label: t.undo, onClick: () => toggle({ kind: "brand", id, brand }) },
          });
        }
      }}
    />
  );
}
