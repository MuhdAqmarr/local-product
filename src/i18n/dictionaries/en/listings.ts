/**
 * `listings` namespace (English source shape): /promos, /new, their filters (bar, sheet, sidebar,
 * active pills) and listing states. `ms/listings.ts` must match (tsc fails on a missing or extra key).
 * Plain strings only: `{name}` placeholders for fmt()/rich(), `{ one, other }` objects for plural().
 */
const listings = {
  /** Page metadata (pageMetadata()). */
  meta: {
    promos: {
      title: "Hot promos",
      description: "Products from Malaysian brands on promo right now, straight from their official stores. Prices checked roughly every 3 hours.",
      socialDescription: "Products from Malaysian brands on promo right now, straight from their official stores.",
    },
    new: {
      title: "Just landed",
      description: "Products freshly launched on Malaysian brands' official stores, grouped by day. Checked roughly every 3 hours.",
      socialDescription: "Products freshly launched on Malaysian brands' official stores.",
    },
  },

  /** /promos header band. `{accent}` is the highlighted word. */
  promos: {
    eyebrow: "Price drops",
    title: "Hot {accent}",
    titleAccent: "promos",
    /** Loading-state subline (no counts yet). */
    sub: "Products on promo right now, straight from the official stores.",
    /** "{products} on promo from {brands}." — both filled from `products` / `brands` below. */
    summary: "{products} on promo from {brands}. Straight from the official stores.",
    products: { one: "{count} product", other: "{count} products" },
    brands: { one: "{count} brand", other: "{count} brands" },
    /** `{time}` is the live relative time ("3 hours ago"). */
    checked: "Prices checked {time}. Please confirm on the official store before you pay.",
    /** Handwritten word above the max-discount burst: "up to −70%". */
    upTo: "up to",
    /** Results landmark. */
    region: "Promo list",
  },

  /** /new header band. */
  new: {
    eyebrow: "New launches",
    title: "Just {accent}",
    titleAccent: "landed",
    sub: "Products just launched on local brands' official stores.",
    summary: "{products} from {brands} in the last {days} days.",
    products: { one: "{count} product", other: "{count} products" },
    brands: { one: "{count} brand", other: "{count} brands" },
    /** Caption under the This week / This month switch. */
    windowDays: "Last {days} days",
    windowCount: { one: "{count} product", other: "{count} products" },
    region: "New products list",
    /** Banner from Home's "Since your last visit" chip. */
    sinceCounting: "Counting what's new since your last visit…",
    sinceCount: { one: "{count} new product since your last visit", other: "{count} new products since your last visit" },
    sinceClose: "Close and show everything",
  },

  /** Result count above the grid (aria-live). `{count}` is the animated number. */
  found: {
    promos: { one: "{count} promo found", other: "{count} promos found" },
    new: { one: "{count} product found", other: "{count} products found" },
  },
  /** Plural nouns for "Show {count} {noun}" and Load more's "You've seen 24 of 120 {noun}". */
  noun: {
    promos: { one: "promo", other: "promos" },
    new: { one: "product", other: "products" },
  },

  view: {
    label: "View",
    grid: "Grid",
    list: "List",
  },

  loadError: "Oops, the full list didn't load. Try again?",

  empty: {
    promosTitle: "No promos right now.",
    promosBody: "Oyen, our shop cat, is keeping watch. When prices drop, they show up here first.",
    promosAction: "See what's new",
    newTitle: "All quiet this week.",
    newBody: "Brands are busy cooking up new stuff. Check back tomorrow!",
    newAction: "See promos",
    filteredTitle: "Nothing matches all these filters.",
    filteredBody: "Drop a filter or two and you'll find something.",
    filteredAction: "Reset filters",
  },

  /** End of the list. */
  end: {
    filtered: { one: "That's it! That's the only {noun} that matches.", other: "That's it! You've seen all {count} {noun} that match." },
    promos: "That's it! You've seen every promo for today.",
    new: { one: "That's it! That's the only new product.", other: "That's it! You've seen all {count} new products." },
    toNew: "See what just landed",
    toPromos: "See hot promos",
  },

  /** Filter controls (mobile bar, Filter sheet, desktop sidebar, active pills). */
  filters: {
    filter: "Filter",
    /** Mobile Filter button's accessible name when filters are on. */
    filterActive: { one: "Filter, {count} filter on", other: "Filter, {count} filters on" },
    sidebar: "Filters",
    quick: "Quick filters",
    sort: "Sort",
    sortBy: "Sort by",
    /** Sort button's accessible name: "Sort: Biggest discount". */
    sortCurrent: "Sort: {label}",
    sortOptions: {
      diskaun: "Biggest discount",
      murah: "Lowest price",
      jimat: "Biggest savings",
      az: "Brand A–Z",
      baru: "Newest first",
    },
    sheetPromos: "Pick what you want to browse.",
    sheetNew: "Find launches that suit you.",
    reset: "Reset",
    resetAll: "Reset all",
    /** Sheet footer button: "Show {count} {noun}". */
    show: "Show {count} {noun}",
    searchSheet: "Filter products, brands…",
    searchSidebar: "Filter by name…",
    clearSearch: "Clear search",
    whenLaunched: "When launched",
    launchWindow: "Launch window",
    masa: { minggu: "This week", bulan: "This month" },
    categories: "Categories",
    brandSize: "Brand size",
    discount: "Discount",
    minDiscount: "Minimum discount",
    discountAll: "All",
    discountAny: "Any discount",
    discountStep: "{value}% off or more",
    /** Quick chip and active pill: "40%+ off". `{value}` is "40%+". */
    discountPill: "{value} off",
    price: "Price",
    priceAll: "All prices",
    priceUnder: "Under RM{max}",
    priceOver: "Over RM{min}",
    priceBetween: "RM{min}–{max}",
    /** Honesty note: RM bands never match US$ items. */
    nonMyr: {
      one: "{count} item priced in US$ isn't included in RM price filters.",
      other: "{count} items priced in US$ aren't included in RM price filters.",
    },
    /** Tier card count in the Filter sheet. */
    tierCount: { one: "{count} item", other: "{count} items" },
    active: "Active filters",
    since: "Since your last visit",
    remove: "Remove filter {label}",
  },
};

export default listings;
export type ListingsMessages = typeof listings;
