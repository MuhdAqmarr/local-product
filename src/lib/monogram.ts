/**
 * Brand monograms (brands have no logos; DESIGN §5.6 + Appendix D #8).
 * Deterministic per slug: same brand → same shape + tilt on every page and every render.
 */
export const MONO_SHAPES = [
  "M50 10A17.8 17.8 0 0 1 78.3 21.7A17.8 17.8 0 0 1 90 50A17.8 17.8 0 0 1 78.3 78.3A17.8 17.8 0 0 1 50 90A17.8 17.8 0 0 1 21.7 78.3A17.8 17.8 0 0 1 10 50A17.8 17.8 0 0 1 21.7 21.7A17.8 17.8 0 0 1 50 10Z", // bunga-8
  "M50 4C88 4 96 12 96 50C96 88 88 96 50 96C12 96 4 88 4 50C4 12 12 4 50 4Z", // squircle
  "M54 4C76 2 97 18 97 42C98 64 88 92 60 96C36 100 6 90 4 62C2 38 30 6 54 4Z", // blob
  "M50 12A22 22 0 0 1 82.9 31A22 22 0 0 1 82.9 69A22 22 0 0 1 50 88A22 22 0 0 1 17.1 69A22 22 0 0 1 17.1 31A22 22 0 0 1 50 12Z", // bunga-6
  "M50 8A12.6 12.6 0 0 1 71 13.6A12.6 12.6 0 0 1 86.4 29A12.6 12.6 0 0 1 92 50A12.6 12.6 0 0 1 86.4 71A12.6 12.6 0 0 1 71 86.4A12.6 12.6 0 0 1 50 92A12.6 12.6 0 0 1 29 86.4A12.6 12.6 0 0 1 13.6 71A12.6 12.6 0 0 1 8 50A12.6 12.6 0 0 1 13.6 29A12.6 12.6 0 0 1 29 13.6A12.6 12.6 0 0 1 50 8Z", // biskut-12
] as const;

const STOP = new Set(["by", "the", "and", "&", "co", "sdn", "bhd", "official", "store", "shop", "my", "malaysia", "enterprise"]);

/** "Kopi Tenom" → "KT"; "Hanis" → "Ha". */
export function initials(name: string): string {
  const words = name
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((x) => x && !STOP.has(x.toLowerCase()));
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  const one = words[0] ?? name.trim();
  if (!one) return "?";
  const chars = Array.from(one);
  return chars[0].toUpperCase() + (chars[1] ?? "").toLowerCase();
}

/** FNV-1a 32-bit hash: stable across server/client, cheap. */
export function fnv1a(s: string): number {
  let h = 0x811c9dc5;
  for (const c of s) {
    h ^= c.codePointAt(0)!;
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export interface MonogramSpec {
  initials: string;
  shape: (typeof MONO_SHAPES)[number];
  /** Resting tilt in degrees, −6…6. */
  rotate: number;
}

export function monogram(slug: string, name: string): MonogramSpec {
  const h = fnv1a(slug);
  return { initials: initials(name), shape: MONO_SHAPES[h % MONO_SHAPES.length], rotate: ((h >>> 8) % 13) - 6 };
}
