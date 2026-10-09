import type { Locale } from "@/i18n/config";
import { fmt } from "@/i18n/format";
import { commonFor } from "@/i18n/shared";
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

/**
 * Screen-reader price sentence (DESIGN §6.7 / §10):
 * "Now RM29.90, was RM42.90, 30% off" / "Harga sekarang RM29.90, harga asal RM42.90, diskaun 30%".
 */
export function priceSentence({ price, compareAt, discount, currency }: PriceFields, locale: Locale): string {
  const t = commonFor(locale).product;
  const parts = [fmt(t.priceNow, { price: displayPrice(price, currency) })];
  if (compareAt != null && compareAt > price) parts.push(fmt(t.priceWas, { price: displayPrice(compareAt, currency) }));
  if (discount != null) parts.push(fmt(t.priceOff, { percent: String(Math.round(discount)) }));
  return parts.join(", ");
}

/** "RM13 off" / "Jimat RM13" — only for a real compare-at price. */
export function jimatText({ price, compareAt, currency }: PriceFields, locale: Locale): string | undefined {
  const saved = savedAmount(price, compareAt);
  return saved == null ? undefined : fmt(commonFor(locale).product.youSave, { amount: displayPrice(saved, currency) });
}
