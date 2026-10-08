/**
 * Product photo plate fit rule (DESIGN §5.5).
 * Near-square photos fill the plate; tall/wide or unknown-size photos sit inside it
 * (padded + multiply-blended so white packshot backgrounds melt into the category tint).
 */
export type PhotoFit = "cover" | "contain";

export function photoFit(w?: number, h?: number): PhotoFit {
  if (!w || !h) return "contain";
  const r = w / h;
  return r >= 0.8 && r <= 1.25 ? "cover" : "contain";
}
