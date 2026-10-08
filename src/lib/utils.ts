import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * `cn()` that knows the LokalLah! design tokens (src/app/globals.css `@theme`).
 * Stock tailwind-merge treats unknown `text-*` utilities as colours, so without this
 * `cn("text-caption text-ink-soft")` would DROP the font size, and `bg-bandung bg-bandung-fizz`
 * would drop one of the two. Keep these lists in sync with the theme tokens.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "display", "title-1", "title-2", "title-3", "lead", "body", "body-sm", "label", "button",
        "label-sm", "tab", "caption", "overline", "price", "price-lg", "deal", "deal-lg", "stat", "hand",
      ],
      radius: ["xs", "tag", "thumb", "plate", "input", "tile", "card", "card-lg", "sheet", "panel"],
      shadow: [
        "xs", "card", "card-hover", "pop-sm", "pop", "pop-lg", "sticker", "diecut", "float", "sheet", "up",
      ],
      font: ["sans", "num", "hand"],
    },
    classGroups: {
      "bg-image": [
        {
          bg: [
            "gula-kapas", "bandung-fizz", "mangga-lassi", "cendol", "senja", "teh-tarik",
            "kuih-lapis", "sunburst", "tier", "cover-cat",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
