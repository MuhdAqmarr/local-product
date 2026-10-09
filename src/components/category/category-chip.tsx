"use client";

import { useRef } from "react";
import { LayoutGrid } from "@/components/ui/lucide";
import { Chip } from "@/components/ui/chip";
import { CategoryGlyph } from "@/components/product/category-glyph";
import { useI18n } from "@/i18n/client";
import { categoryLabel } from "@/lib/taxonomy";
import type { CategorySlug } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface CategoryChipProps {
  /** A category, or "all" for the "All" chip that clears the filter. */
  category: CategorySlug | "all";
  selected?: boolean;
  /** Toggle handler (button mode). */
  onToggle?: (category: CategorySlug | "all", selected: boolean) => void;
  /** Link mode (navigation shortcuts): renders a Link with aria-current instead of aria-pressed. */
  href?: string;
  /** Override the label (default: the category label in the page language, or "All"). */
  label?: string;
  count?: number;
  dense?: boolean;
  className?: string;
}

const WIGGLE: Keyframe[] = [{ rotate: "0deg" }, { rotate: "-8deg", offset: 0.25 }, { rotate: "6deg", offset: 0.75 }, { rotate: "0deg" }];

/**
 * Category filter chip (DESIGN §6.5): `aria-pressed` toggle, category icon that swaps to a popping
 * Check when selected (width never changes), category tint + ink ring when on, one wiggle on select.
 */
export function CategoryChip({ category, selected = false, onToggle, href, label, count, dense, className }: CategoryChipProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const all = category === "all";
  const { m, locale } = useI18n();
  const text = label ?? (all ? m.common.category.all : categoryLabel(category, locale));
  const icon = all ? <LayoutGrid aria-hidden="true" strokeWidth={2} /> : <CategoryGlyph category={category} size={18} />;

  const wiggle = () => {
    const el = ref.current?.firstElementChild;
    if (el && !document.documentElement.dataset.motion && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.animate(WIGGLE, { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
    }
  };

  return (
    <span ref={ref} data-cat={all ? undefined : category} className={cn("contents", className)}>
      {href ? (
        <Chip href={href} selected={selected} icon={icon} count={count} dense={dense}>
          {text}
        </Chip>
      ) : (
        <Chip
          selected={selected}
          icon={icon}
          count={count}
          dense={dense}
          onClick={() => {
            if (!selected) wiggle();
            onToggle?.(category, !selected);
          }}
        >
          {text}
        </Chip>
      )}
    </span>
  );
}
