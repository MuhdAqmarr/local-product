import { Baby, Bike, Coffee, Cookie, Droplets, Gift, Handbag, Headphones, HeartPulse, Shirt, Sofa, type LucideIcon } from "lucide-react";
import type { CategorySlug } from "@/lib/types";

/** Category → lucide icon (DESIGN §2.3). `Sparkles` is reserved for "Baru". */
export const CATEGORY_ICONS: Record<CategorySlug, LucideIcon> = {
  beauty: Droplets,
  fashion: Shirt,
  accessories: Handbag,
  food: Cookie,
  drinks: Coffee,
  home: Sofa,
  health: HeartPulse,
  kids: Baby,
  tech: Headphones,
  crafts: Gift,
  lifestyle: Bike,
};

/** Hook-free: safe in Server and Client Components. Decorative; pair with a text label. */
export function CategoryGlyph({ category, size = 18, className }: { category: CategorySlug; size?: number; className?: string }) {
  const Icon = CATEGORY_ICONS[category];
  return <Icon size={size} strokeWidth={size <= 14 ? 2.5 : size >= 22 ? 2.25 : 2} className={className} aria-hidden="true" focusable="false" />;
}
