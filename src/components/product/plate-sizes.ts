/**
 * `sizes` strings for <PlateImage> (DESIGN §7.8), measured against the rendered plates
 * (plain module: importable from server and client). The srcset offers 96–800w
 * (`IMAGE_WIDTHS` in lib/images), so a thumbnail at DPR 2–3 picks 96w or 160w.
 */
export const PLATE_SIZES = {
  /** Product grid: 2 cols on phones (≈ 50vw − 36px), 3 on tablets, 4–5 on desktop. */
  grid: "(min-width:1280px) 216px, (min-width:1024px) 20vw, (min-width:640px) 28vw, calc(50vw - 36px)",
  /** Rail cards: ≈ 38vw on phones, 172px on tablets. */
  rail: "(min-width:1024px) 216px, (min-width:640px) 172px, 38vw",
  row: "72px",
  collage: "(min-width:1024px) 96px, 28vw",
  /** Small square thumbs (brand-row collage cells, ≈ 44px). */
  thumb: "44px",
  search: "48px",
} as const;
