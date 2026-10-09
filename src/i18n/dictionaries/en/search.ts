/**
 * `search`: the search dialog (DESIGN §6.4 / §8.9). English source shape: `ms/search.ts` must match
 * (tsc fails on a missing or extra key). Plain strings only: `{name}` placeholders for fmt(),
 * `{ one, other }` objects for plural(). No functions.
 */
const search = {
  /** Accessible name of the dialog and the input. */
  label: "Search brands or products",
  placeholder: "Brands, products, categories…",
  clear: "Clear search",
  cancel: "Cancel",
  /** sr-only live region. */
  results: { one: "{count} result for {query}", other: "{count} results for {query}" },
  noResultsSr: "No results for {query}",
  loading: "Loading…",
  listbox: "Search results",

  error: {
    title: "Oops, search couldn't load.",
    body: "Looks like the internet is sulking. Not your fault.",
    retry: "Try again",
  },

  groups: {
    brands: "Brands",
    categories: "Categories",
    products: "Products",
  },
  showMore: "Show more products ({count})",
  priceNote: "Prices can change. Please confirm on the official store before you pay.",

  keys: {
    move: "move",
    open: "open",
    close: "close",
  },

  empty: {
    title: "What are you looking for?",
    body: "A brand, a product or a category. Just start typing.",
    recent: "Recent searches",
    forget: "Remove “{query}” from recent searches",
    hot: "Most promos right now",
    tryThese: "Try searching",
  },
  /**
   * Example queries for the empty box. Only those with 3+ product hits in the live catalogue are
   * shown, so keep words the store titles actually use (most titles are in English).
   */
  examples: ["baju kurung", "coffee", "sunscreen", "tudung", "serum", "candle", "batik", "tote bag"],

  noResults: {
    title: "Oops, no luck with “{query}”.",
    body: "Try another spelling, or browse by category. Is this brand missing from LokalLah?",
    suggest: "Suggest this brand",
  },

  row: {
    brand: "Brand",
    /** sr-only suffixes on result rows. */
    srDiscount: ", {percent}% off",
    srOpen: ", opens {brand}'s official store (new tab)",
    srCategory: ", category",
  },
};

export default search;
export type SearchMessages = typeof search;
