/** Exact `sizes` strings from DESIGN §7.8 (plain module: importable from server and client). */
export const PLATE_SIZES = {
  grid: "(min-width:1280px) 216px, (min-width:1024px) 22vw, (min-width:640px) 31vw, 46vw",
  rail: "(min-width:1024px) 216px, 42vw",
  row: "72px",
  collage: "(min-width:1024px) 96px, 28vw",
  search: "48px",
} as const;
