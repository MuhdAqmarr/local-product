/**
 * `common`: the shared layer (header, tab bar, Kategori, footer, feedback, shared product / brand /
 * category / rail components). Provided to every client island by the root layout.
 * English is the source shape: every `ms/*.ts` file must satisfy the type exported here.
 */
const common = {
  skipLink: "Skip to content",

  nav: {
    /** Accessible names of the two nav landmarks. */
    main: "Main navigation",
    mainDesktop: "Main navigation (desktop)",
    home: "Home",
    promos: "Promos",
    new: "New",
    brands: "Brands",
    categories: "Categories",
    about: "About",
    saved: "Saved",
    logo: "LokalLah! home",
    /** Desktop header heart: "Saved, 3 items". */
    savedCount: { one: "Saved, {count} item", other: "Saved, {count} items" },
    /** Screen-reader suffix after a tab label with a count bubble. */
    itemCount: { one: ", {count} item", other: ", {count} items" },
  },

  searchTrigger: {
    label: "Search brands or products",
    placeholder: "Search brands, products…",
    tab: "Search",
  },

  lang: {
    /** Fixed bilingual name of the toggle group (docs/I18N.md). */
    label: "Language / Bahasa",
    /** Title on each option. */
    readIn: { en: "Read in English", ms: "Baca dalam Bahasa Melayu" },
  },

  kategori: {
    button: "Categories",
    panelTitle: "Category shelf",
    sheetTitle: "What are you shopping for today?",
    sheetDescription: "Pick a shelf, or browse by brand size.",
    brandSize: "Brand size",
    brandSizeLabel: "Brand size:",
    allBrands: "All brands",
    brandCount: { one: "{count} brand", other: "{count} brands" },
    aboutLink: "About LokalLah!",
    suggestLink: "Suggest a brand",
  },

  motion: {
    group: "Animation",
    footerLabel: "Animation:",
    full: "Full",
    reduced: "Less",
    switchLabel: "Reduce motion",
    switchOs: "Your device asked for less motion, so we're following that.",
    switchHelp: "Stops decorative movement across the whole site.",
    toastReduced: "Animations reduced.",
    toastFull: "Full animations are back on.",
  },

  backToTop: "Back to top",

  footer: {
    tagline: "A digital corner shop for local Malaysian brands. Support local, one tap away.",
    explore: "Explore",
    categories: "Categories",
    randomBrand: "Random brand",
    about: "About",
    howWeSync: "How we sync",
    suggest: "Suggest a brand",
    forOwners: "For brand owners",
    disclaimers: {
      source: "Prices, promos and products are pulled automatically from the brands' official online stores (where we can read them) and checked roughly every 3 hours.",
      prices: "Prices and stock can change at any time. Please confirm the final price on the official store before you buy.",
      independent:
        "LokalLah! is an independent directory. We don't sell anything, and we're not affiliated with, sponsored by or endorsed by any brand listed here.",
      trademarks: "Brand names, trademarks and product photos belong to their respective owners.",
      outbound: "Outbound links carry utm_source=lokallah so brands can see the traffic came from us. These are not affiliate links.",
      owners: "Own a brand listed here? Want to update your info or be removed?",
      contact: "Get in touch",
    },
    copyright: "© 2026 LokalLah! · Independent directory",
    madeWith: "Made with",
    flower: "hibiscus",
    by: "by",
    newTab: "(opens in a new tab)",
    lastSync: "Last sync:",
  },

  live: {
    tag: "LIVE",
    howWeSync: "How we sync",
    srHowWeSync: "(how we sync)",
    site: "We check the official stores of {count} brands roughly every 3 hours.",
    siteNoCount: "We check the brands' official stores roughly every 3 hours.",
    siteLast: "Last sync: {when}.",
    snapshot: "This data comes from our last saved copy, not a live read.",
    ratio: "{live} of {total} brands have a store we can read live.",
    brand: "We check {brand}'s official store roughly every 3 hours.",
    brandLast: "Last check: {when}.",
    brandError: "The last check didn't go through, so the data may be out of date.",
    brandNoFeed: "We can't sync this brand's store automatically yet. Check their official store directly.",
    newSync: { one: "Fresh sync: {count} new promo!", other: "Fresh sync: {count} new promos!" },
  },

  feedback: {
    loading: "Loading…",
    loadingLines: [
      "Oyen is stacking the shelves…",
      "Hang on, crunching the discounts…",
      "Checking the official stores…",
      "Just a sec, new stock arriving…",
      "Pulling a teh tarik… one moment.",
      "The tauke is writing price tags…",
    ],
    offline: "You're offline. The data may not be the latest.",
    online: "Back online!",
    close: "Close",
    error: "Oops, that didn't work. Try again?",
    retry: "Try again",
    loadMore: "Load more",
    /** Under a list: "You've seen 24 of 120 promos". `{noun}` is the plural noun. */
    seen: "You've seen {shown} of {total} {noun}",
    nounProducts: { one: "product", other: "products" },
  },

  save: {
    save: "Save {title}",
    unsave: "Remove {title} from Saved",
    saveBrand: "Save brand {name}",
    unsaveBrand: "Remove brand {name} from Saved",
    firstSave: "Saved! Everything's waiting in the Saved tab.",
    view: "View",
    saved: "Saved",
    removed: "Removed from Saved.",
    undo: "Undo",
    brandSaved: "Brand saved. Easy to check their promos later.",
  },

  product: {
    justIn: "Just in",
    new: "New",
    soldOut: "Sold out",
    /** Parts of a card's accessible name. */
    srNew: "just launched",
    srSoldOut: "sold out",
    srOpen: "opens {brand}'s official store (new tab)",
    photoAlt: "{brand} product",
    tier: "Tier: {name}",
    launched: "Launched {time}",
    priceNow: "Now {price}",
    priceWas: "was {price}",
    priceOff: "{percent}% off",
    /** Savings pill: "RM13 off". */
    youSave: "{amount} off",
    groupCount: { one: "{count} promo", other: "{count} promos" },
    today: "Today",
    yesterday: "Yesterday",
    dayCount: { one: "{count} product", other: "{count} products" },
  },

  brand: {
    promos: { one: "promo", other: "promos" },
    new: { one: "new", other: "new" },
    live: "Live",
    emptyShelf: "Online shelf is empty right now",
    noFeed: "This store can't sync yet",
    photoAlt: "{brand} product",
  },

  tier: {
    sr: "Tier: {name}",
    whatIs: "Tier: {name}. What does that mean?",
    size: "Brand size",
    learn: "Meet the tiers",
  },

  category: {
    allBrands: "All brands",
    all: "All",
    promos: { one: "{count} promo", other: "{count} promos" },
    brands: { one: "{count} brand", other: "{count} brands" },
  },

  rail: {
    seeAll: "See all",
    /** Accessible name of the scrolling track. */
    region: "{title}, scrolls sideways",
    left: "Scroll left",
    right: "Scroll right",
    nounProducts: { one: "product", other: "products" },
  },
};

export default common;
export type CommonMessages = typeof common;
