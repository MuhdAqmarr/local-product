/**
 * `saved`: the /saved page (DESIGN §8.7, §9.5, §9.8). English source shape: `ms/saved.ts` must
 * match (tsc fails on a missing or extra key). Plain strings only: `{name}` placeholders for
 * fmt(), `{ one, other }` objects for plural(). No functions.
 */
const saved = {
  meta: {
    title: "Your saved stuff",
    description: "The products and brands you've saved, with their latest prices.",
  },

  eyebrow: "Saved",
  title: "Your saved stuff",
  sub: "Kept on this device only. No login needed.",
  /** Screen-reader text for the count next to the title. */
  srCount: { one: "{count} item", other: "{count} items" },
  clearAll: "Clear all",

  /** Price-drop banner: "Psst! 3 of your saved items dropped in price." `{count}` is bold. */
  dropsLead: "Psst!",
  drops: { one: "{count} saved item dropped in price.", other: "{count} of your saved items dropped in price." },

  tabs: {
    label: "Saved items",
    products: "Products",
    brands: "Brands",
  },

  sort: {
    label: "Sort",
    newest: "Recently saved",
    drops: "Biggest price drops",
    discount: "Biggest discount",
  },

  status: {
    checked: "Prices checked against our last sync.",
    confirm: "Please confirm on the official store before you pay.",
    error: "Couldn't check the latest prices. These are the prices when you saved them.",
    checking: "Checking the latest prices…",
  },

  srProducts: "Saved products",
  srBrands: "Saved brands",

  emptyProducts: {
    title: "Nothing saved yet.",
    body: "Tap ♥ on any product and Oyen, our shop cat, will keep it here (on this device only).",
    primary: "Browse today's promos",
    secondary: "See what's new",
  },
  emptyBrands: {
    title: "No favourite brands yet.",
    body: "Save the brands you love, so it's easy to check their promos later.",
    primary: "Explore brands",
  },

  storageNote: "Your saved items live in this browser only. Clear your browser data and they're gone.",

  fresh: {
    drop: "Down another {amount} since you saved it!",
    up: "Up {amount} since you saved it",
    ended: "Promo has ended",
    /** `{price}` is the price when saved (bold numerals). */
    unknown: "Couldn't check the latest price. Price when saved: {price}.",
    view: "See it on the official store ↗",
    viewLabel: "See {title} on the official store (new tab)",
    savedAgo: "Saved {time}",
  },

  brandRow: {
    promos: { one: "{count} promo now", other: "{count} promos now" },
    noPromos: "No promos right now",
  },

  /** Fallback names when a saved product has no title. */
  thisProduct: "this product",
  brandName: "brand {name}",

  toast: {
    removed: "Removed {title}. Hit Undo in the notification to bring it back.",
    cleared: "Saved list cleared.",
    undo: "Undo",
  },

  confirm: {
    title: "Clear everything you've saved?",
    description: { one: "{count} saved item will be removed from this device.", other: "All {count} saved products and brands will be removed from this device." },
    body: "After clearing, you can still hit Undo for a short while.",
    cancel: "Cancel",
    confirm: "Clear all",
  },
};

export default saved;
export type SavedMessages = typeof saved;
