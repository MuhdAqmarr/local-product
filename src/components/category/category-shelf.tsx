import type { CategorySlug } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CategoryTile } from "./category-tile";

/** The CategorySummary fields the shelf needs (import type only from `@/lib/catalog`). */
export interface ShelfCategory {
  slug: CategorySlug;
  brands: number;
  promos: number;
}

export interface CategoryShelfProps {
  categories: ShelfCategory[];
  /** Total brands for the trailing "Semua jenama" tile; omit to hide that tile. */
  allBrands?: number;
  /** Morph tile icons into the category hero (only one shelf per page should). */
  morph?: boolean;
  className?: string;
}

/**
 * "Rak kategori" (DESIGN §6.5 / §8.1 #3): tiles standing on wooden planks, 4 × 3 on phones,
 * 6 × 2 on desktop, with "Semua jenama" as the 12th tile.
 */
export function CategoryShelf({ categories, allBrands, morph = true, className }: CategoryShelfProps) {
  return (
    <ul className={cn("cat-shelf", "px-2", className)} role="list">
      {categories.map((c) => (
        <li key={c.slug} className={"cat-cell"}>
          <CategoryTile slug={c.slug} promos={c.promos} brands={c.brands} morph={morph} onShelf />
        </li>
      ))}
      {allBrands != null && (
        <li className={"cat-cell"}>
          <CategoryTile slug="all" brands={allBrands} onShelf />
        </li>
      )}
    </ul>
  );
}
