/** Deal size levels (DESIGN §5.4): L1 5–19 %, L2 20–39 %, L3 ≥ 40 %. */
export type DealLevel = 1 | 2 | 3;

export const DEAL_THRESHOLDS = { 1: 5, 2: 20, 3: 40 } as const satisfies Record<DealLevel, number>;

export function dealLevel(discount?: number | null): DealLevel | null {
  if (discount == null || !Number.isFinite(discount) || discount < DEAL_THRESHOLDS[1]) return null;
  if (discount >= DEAL_THRESHOLDS[3]) return 3;
  if (discount >= DEAL_THRESHOLDS[2]) return 2;
  return 1;
}

/** Group header copy for /promos (sorted by discount). */
export const DEAL_GROUPS: Record<DealLevel, { range: string; label: string }> = {
  3: { range: "≥ 40%", label: "Jimat gila" },
  2: { range: "20–39%", label: "Berbaloi" },
  1: { range: "5–19%", label: "Ada la sikit" },
};

/** "−30%" with a real minus sign (U+2212). */
export function formatDiscount(discount: number): string {
  return `−${Math.round(discount)}%`;
}

/** Ringgit saved, or undefined when there is no real compare-at price. */
export function savedAmount(price: number, compareAt?: number): number | undefined {
  if (compareAt == null || compareAt <= price) return undefined;
  return Math.round((compareAt - price) * 100) / 100;
}
