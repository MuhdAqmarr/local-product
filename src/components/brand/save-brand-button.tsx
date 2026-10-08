"use client";

import { HeartToggle } from "@/components/product/heart-toggle";
import { toast } from "@/components/feedback/toast-store";
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

  return (
    <HeartToggle
      saved={isSaved(id)}
      tone={tone}
      size={size}
      className={className}
      label={{ save: `Simpan jenama ${brand.name}`, unsave: `Buang jenama ${brand.name} dari simpanan` }}
      onToggle={() => toggle({ kind: "brand", id, brand })}
      onChange={(now) => {
        if (now) {
          toast({ message: "Jenama disimpan. Senang nak check promo dia nanti.", tone: "save", action: { label: "Tengok", href: "/saved" } });
        } else {
          toast({
            message: "Dah buang dari Simpan.",
            tone: "save",
            action: { label: "Undo", onClick: () => toggle({ kind: "brand", id, brand }) },
          });
        }
      }}
    />
  );
}
