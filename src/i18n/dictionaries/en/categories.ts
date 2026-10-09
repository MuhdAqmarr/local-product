/**
 * `categories` namespace (English source shape). Add keys here first; `ms/categories.ts` must then match
 * (tsc fails on a missing or extra key). Plain strings only: `{name}` placeholders for fmt(),
 * `{ one, other }` objects for plural(). No functions.
 *
 * Used by /categories/[slug]; the page wraps its client islands in `<MessagesProvider>` with it.
 */
const categories = {
  meta: {
    notFound: "Category not found",
    /** `{name}` is the full category name: "Skincare & Beauty". */
    title: "{name}: Malaysian brands & promos",
    socialTitle: "{name} · LokalLah!",
    /** `{label}` is the mid-sentence category label (`categoryInline`): "beauty", "home & living". */
    description: "{blurb} Live promos and new launches from Malaysian {label} brands, straight from their official stores.",
  },

  hero: {
    overline: "Category",
    stats: "{name} in numbers",
    brands: { one: "brand", other: "brands" },
    promos: { one: "promo", other: "promos" },
    new: { one: "new", other: "new" },
  },

  others: "Other categories",
  size: "Brand size",
  scopeAll: "All",
  /** Polite status after switching the brand-size scope. */
  scopeStatus: "Showing {promos} and {brands}",
  scopeStatusTier: "Showing {promos} and {brands}, size: {tier}",
  promoCount: { one: "{count} promo", other: "{count} promos" },
  brandCount: { one: "{count} brand", other: "{count} brands" },

  promo: {
    /** `{accent}` is the highlighted word below. */
    title: "Hot {accent} in {name}",
    titleAccent: "promos",
    sub: "Price drops, spotted straight from the official stores.",
    empty: "No promos in {name} right now. Oyen, our shop cat, is keeping watch: when prices drop, you'll see them here first.",
    emptyTier: "No {tier} promos in {name} right now. Oyen, our shop cat, is keeping watch: when prices drop, you'll see them here first.",
    seeNew: "See what's new",
    /** `{time}` is a live relative time. */
    checked: "Prices checked {time}. Double-check at the official store before you pay.",
  },

  fresh: {
    /** `{accent}` wraps the category name. */
    title: "New in {accent}",
    titleText: "New in {name}",
    sub: "Fresh out of the oven: just-launched products.",
    noun: { one: "new product", other: "new products" },
    railEmpty: "All quiet. No new products this month.",
    railEmptyTier: "All quiet. No new {tier} products this month.",
    empty: "All quiet this month. The brands are busy cooking up something new. Check back tomorrow!",
  },

  brands: {
    /** `{accent}` wraps the category name. */
    title: "{accent} brands",
    sub: "Stores we can sync come first, then A–Z.",
    emptyTier: "No {tier} brands in {name} yet. Know one? Suggest it!",
    empty: "This shelf is still empty. Know a local {label} brand? Suggest it!",
    suggest: "Suggest a brand",
    noun: { one: "brand", other: "brands" },
  },
};

export default categories;
export type CategoriesMessages = typeof categories;
