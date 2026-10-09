/**
 * `brands` namespace (English source shape). Add keys here first; `ms/brands.ts` must then match
 * (tsc fails on a missing or extra key). Plain strings only: `{name}` placeholders for fmt(),
 * `{ one, other }` objects for plural(). No functions.
 *
 * Used by /brands (directory), /brands/[slug] (profile) and the per-brand social card. The
 * directory and profile pages wrap their client islands in `<MessagesProvider>` with this namespace.
 */
const brands = {
  meta: {
    title: "Brand directory",
    description:
      "Malaysian brands from Cili Padi makers to Jenama Ikon household names. Filter by category, brand size, state and promos, then head straight to their official stores.",
    notFound: "Brand not found",
    /** Brand page title: "Christy Ng: Malaysian accessories brand". `{category}` is the short label, lowercased. */
    brandTitle: "{brand}: Malaysian {category} brand",
    socialTitle: "{brand} · LokalLah!",
    /** Appended to the brand description when we can read the store. */
    feedTail: "Promos and new launches from {brand}'s official store, checked roughly every 3 hours.",
  },

  directory: {
    eyebrow: "Brand shelf",
    /** `{accent}` is the highlighted word below. */
    title: "The {accent} brand directory",
    titleAccent: "local",
    /** `{count}` is an animated number. Tier names explained once (docs/I18N.md). */
    sub: "{count} Malaysian brands, from Cili Padi (small but mighty) to Jenama Ikon (household icons).",
    subLive: "{live} of them have an online store we check live.",
    /** Loading skeleton (no counts yet). */
    subLoading: "Malaysian brands, from Cili Padi (small but mighty) to Jenama Ikon (household icons).",

    searchLabel: "Search brand names",
    searchPlaceholder: "Search brand names…",
    clearSearch: "Clear search",
    filter: "Filter",
    filterActive: "Filter, {count} active",
    categories: "Categories",
    size: "Brand size",
    all: "All",
    allSizes: "All sizes",
    state: "State",
    allStates: "All states",
    sort: "Sort",
    sortAz: "Brands A–Z",
    sortPromo: "Most promos",
    sortNew: "Most new products",
    promoOnly: "Has promos",

    /** `{count}` is an animated number on screen. */
    showing: "Showing {count} of {total} brands",
    activeFilters: "Active filters",
    removeFilter: "Remove filter {label}",
    resetAll: "Reset all",
    list: "Brand list",
    noun: { one: "brand", other: "brands" },
    end: "That's the lot! You've seen all {count} brands.",

    emptyQueryTitle: "Oops, no luck with “{q}”.",
    emptyQueryBody: "Try another spelling, or browse by category. Is this brand missing from our shelf?",
    suggestThis: "Suggest this brand",
    emptyFiltersTitle: "Nothing matches all these filters.",
    emptyFiltersBody: "Drop a filter or two and you'll find something.",
    resetFilters: "Reset filters",

    jump: "Jump to letter",
    letter: "Letter {letter}",

    sheetTitle: "Filter brands",
    sheetDescription: "The list updates as soon as you pick.",
    reset: "Reset",
    /** Sheet button; `{count}` is an animated number. */
    show: { one: "Show {count} brand", other: "Show {count} brands" },
  },

  profile: {
    back: "All brands",
    share: "Share {name}",
    copied: "Link copied. Send it to your friends!",
    shareFailed: "Oops, that didn't work. Try again?",
    since: "Since {year}",
    tags: "Tags",
    /** Brand tags from brands.json (`#heritage`), shown under the description. Unknown tags render raw. */
    tagLabels: {
      heritage: "heritage",
      affordable: "affordable",
      gift: "gift",
      handmade: "handmade",
      premium: "premium",
      "small-batch": "small batch",
      kids: "kids",
      unisex: "unisex",
      "local-ingredients": "local ingredients",
      modest: "modest",
      halal: "halal",
      eco: "eco",
      "plant-based": "plant-based",
      men: "men",
      "cruelty-free": "cruelty-free",
      vegan: "vegan",
    },
    readMore: "Read more",
    readLess: "Show less",
    /** Live line under the identity card; `{count}` is wrapped in markup. */
    promoCount: { one: "{count} promo", other: "{count} promos" },
    newCount: { one: "{count} new", other: "{count} new" },

    statsLabel: "{brand} today",
    statsTitle: "The store today",
    statPromos: "On promo",
    statNew: "New ({days} days)",
    statMax: "Biggest discount",
    statsNote: "Based on {count} products in our last read of the official store. Prices can change, so double-check at the store.",

    noStockBadge: "No stock found",
    noSyncBadge: "Can't sync yet",
    noStockTitle: "The online shelf is empty right now",
    noSyncTitle: "{brand}'s store can't sync yet",
    noStockBody: "We checked their official store, but our last read didn't find anything on sale.",
    noSyncBody: "We can't sync this brand's store automatically yet, so we don't show prices or promos. We're working on it.",
    /** `{link}` = noFeedLink. */
    noFeedVisit: "Have a look at {link}.",
    noFeedLink: "their official store",
    newTab: "(new tab)",

    /** Outbound links (BrandLinks). */
    visit: "Visit official store",
    visitLabel: "Visit {brand}'s official store (new tab)",
    website: "Website",
    websiteLabel: "{brand} website (new tab)",
    socialLabel: "{brand} on {network} (new tab)",
    links: "{brand} links",

    tabsLabel: "Store products",
    tabPromo: "Promos",
    tabNew: "New",

    noPromoTitle: "{brand} has no promos right now.",
    noPromoBody: "Their products are still worth a look, though. Check out what's new!",
    noPromoCta: "See what's new",
    morePromos: "More promos",

    /** `{link}` = priceNoteLink. */
    priceNote: "Prices and stock can change at any time. Double-check at {link} before you pay.",
    priceNoteLink: "{brand}'s official store",

    noFresh: "No new launches from {brand} in the last {days} days.",
    noFreshLatest: "Here's the latest on their shelf:",
    noFreshLater: "Check back after the next sync!",

    disclaimer: "Disclaimer",
    disclaimerSource: "Prices, promos and products are pulled automatically from {brand}'s official online store and checked roughly every 3 hours.",
    disclaimerIndependent:
      "LokalLah! is an independent directory. We don't sell anything, and we're not affiliated with, sponsored by or endorsed by {brand}. Brand names, trademarks and product photos belong to their respective owners.",
    disclaimerOutbound: "Outbound links carry utm_source=lokallah so brands can see the traffic came from us. These are not affiliate links.",
    /** `{link}` = disclaimerContact. */
    disclaimerOwner: "Own {brand}? Want to update your info or be taken off the list? {link}.",
    disclaimerContact: "Get in touch",
  },

  bestDeal: {
    tag: "Best deal",
    overline: "Biggest discount",
    /** Parts of the card's accessible name. */
    srBest: "{brand}'s best deal right now",
    checked: "Price checked {time}",
    cta: "Buy at the official store",
  },

  similar: {
    title: "Similar brands you might like",
    sub: "Same shelf and similar size, shown first.",
  },

  /** Per-brand social card (1200 × 630 PNG). Tier names stay as they are. */
  og: {
    alt: "LokalLah! brand card: monogram, brand size, category and live promo counts from the official store.",
    promos: { one: "{count} promo", other: "{count} promos" },
    new: { one: "{count} new", other: "{count} new" },
    live: "Official store checked live",
    empty: "Online shelf is empty right now",
    directory: "Local brand directory",
  },
};

export default brands;
export type BrandsMessages = typeof brands;
