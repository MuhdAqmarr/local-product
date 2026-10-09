/**
 * Message helpers (docs/I18N.md). Client-safe, pure.
 *
 * Messages are plain strings with `{name}` placeholders. English plurals are `{ one, other }`
 * objects; Malay has no grammatical plural, so its dictionaries repeat the same string in both.
 */
export interface Plural {
  one: string;
  other: string;
}

/** A noun or label that may come as one string or as plural forms. */
export type MaybePlural = string | Plural;

const NUMBER = new Intl.NumberFormat("en-MY");

/**
 * Fill `{name}` placeholders. Numbers are formatted with thousands separators ("1,234").
 * Unknown placeholders are left as-is so a missing variable is visible, not silently blank.
 *
 *   fmt("{count} promos from {brand}", { count: 12, brand: "Christy Ng" }) → "12 promos from Christy Ng"
 */
export function fmt(template: string, vars?: Record<string, string | number | null | undefined>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (whole, key: string) => {
    const value = vars[key];
    if (value == null) return whole;
    return typeof value === "number" ? NUMBER.format(value) : value;
  });
}

/**
 * Pick the plural form for `n` and fill it (`{count}` = n, plus any `vars`).
 * A plain string is used for every count.
 *
 *   plural(1, { one: "{count} promo", other: "{count} promos" }) → "1 promo"
 *   plural(38, { one: "{count} promo", other: "{count} promos" }) → "38 promos"
 */
export function plural(n: number, forms: MaybePlural, vars?: Record<string, string | number | null | undefined>): string {
  const template = typeof forms === "string" ? forms : n === 1 ? forms.one : forms.other;
  return fmt(template, { count: n, ...vars });
}

/** The raw plural template for `n` (placeholders unfilled), e.g. to feed `rich()`. */
export function pluralForm(n: number, forms: MaybePlural): string {
  return typeof forms === "string" ? forms : n === 1 ? forms.one : forms.other;
}
