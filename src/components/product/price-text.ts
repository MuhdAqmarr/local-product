import { formatPrice } from "@/lib/format";
import { savedAmount } from "@/lib/deal";

const RM_INT = new Intl.NumberFormat("en-MY", { maximumFractionDigits: 0 });
const RM_DEC = new Intl.NumberFormat("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/**
 * `formatPrice()` with thousands separators for ringgit ("RM3,899", "RM1,299.90"), so big prices
 * scan at a glance. Other currencies (USD stores) go through `formatPrice()` unchanged.
 */
export function displayPrice(amount: number, currency = "MYR"): string {
  if (currency !== "MYR" || amount < 1000) return formatPrice(amount, currency);
  return `RM${Number.isInteger(amount) ? RM_INT.format(amount) : RM_DEC.format(amount)}`;
}

export interface PriceFields {
  price: number;
  compareAt?: number;
  discount?: number;
  currency: string;
}

/** "Harga sekarang RM29.90, harga asal RM42.90, diskaun 30%" (DESIGN §6.7 / §10). */
export function priceSentence({ price, compareAt, discount, currency }: PriceFields): string {
  const parts = [`Harga sekarang ${displayPrice(price, currency)}`];
  if (compareAt != null && compareAt > price) parts.push(`harga asal ${displayPrice(compareAt, currency)}`);
  if (discount != null) parts.push(`diskaun ${Math.round(discount)}%`);
  return parts.join(", ");
}

/** "Jimat RM13" — only for a real compare-at price. */
export function jimatText({ price, compareAt, currency }: PriceFields): string | undefined {
  const saved = savedAmount(price, compareAt);
  return saved == null ? undefined : `Jimat ${displayPrice(saved, currency)}`;
}
