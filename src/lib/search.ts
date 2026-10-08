import type { SearchItem } from "./catalog";

export function normalizeText(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export interface PreparedItem {
  item: SearchItem;
  title: string;
  haystack: string;
}

/** Normalise once when the index loads, not on every keystroke. */
export function prepareIndex(items: SearchItem[]): PreparedItem[] {
  return items.map((item) => {
    const title = normalizeText(item.title);
    return { item, title, haystack: `${title} ${normalizeText(item.brandName)}` };
  });
}

/**
 * Brands rank above products. Every query word must appear somewhere;
 * prefix matches beat substring matches; promos get a small nudge.
 */
export function search(index: PreparedItem[], query: string, limit = 40): SearchItem[] {
  const q = normalizeText(query);
  if (!q) return [];
  const words = q.split(" ");
  const scored: Array<{ item: SearchItem; score: number }> = [];

  for (const entry of index) {
    if (!words.every((w) => entry.haystack.includes(w))) continue;
    let score: number;
    if (entry.item.kind === "brand") {
      score = entry.title === q ? 100 : entry.title.startsWith(q) ? 85 : 60;
    } else {
      score = entry.title.startsWith(q) ? 40 : entry.title.includes(q) ? 32 : 24;
      if (entry.item.discount) score += 2;
    }
    scored.push({ item: entry.item, score });
  }

  return scored
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, limit)
    .map((s) => s.item);
}
