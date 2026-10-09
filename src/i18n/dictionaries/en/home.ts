/**
 * `home` namespace (English source shape). Add keys here first; `ms/home.ts` must then match
 * (tsc fails on a missing or extra key). Plain strings only: `{name}` placeholders for fmt(),
 * `{ one, other }` objects for plural(). No functions.
 *
 * Home is all Server Components; its few client islands (search pill, ticker toggle, explainer
 * replay) get their strings as props, so this namespace never needs a MessagesProvider.
 */
const home = {
  meta: {
    title: "LokalLah! — Every local brand, always up to date",
    description:
      "A directory of Malaysian brands, from Cili Padi makers to Jenama Ikon household names, with live promos and new launches straight from their official stores. Auto-updates every few hours.",
  },

  hero: {
    /** `{local}` and `{fresh}` carry the swash and the highlighter. */
    title: "Every {local} brand, always {fresh}.",
    local: "local",
    fresh: "up to date",
    note: "psst… live prices!",
    /** Hand-written note beside the max-discount burst ("up to −60%"). */
    upTo: "up to",
    /** Burst link name; starts with its visible text "−60%" (label-in-name). */
    burstLabel: "{discount}, the biggest discount right now. See promos",
    sub: "The latest promos and products from {brands} Malaysian brands, from skincare to sambal: we check {liveBrands} official stores live. Auto-updates every few hours, so you never miss a thing.",
    ctaPromos: "See today's promos",
    ctaNew: "Discover new launches",
    quickLabel: "Quick filters",
    quick: {
      discount: "40%+ off",
      thisWeek: "New this week",
      ciliPadi: "Cili Padi",
      under30: "Under RM30",
    },
    stats: {
      brands: { one: "brand", other: "brands" },
      promos: { one: "live promo", other: "live promos" },
      new: { one: "new", other: "new" },
    },
    /** Desktop deal stack (right column). */
    stackPromo: "Live promo shelf",
    stackNew: "Just landed, live",
    stackPromoList: "Biggest promos right now",
    stackNewList: "Latest launches",
  },

  /** Hero search pill (DESIGN §9.1). Every example must return real results in the catalogue. */
  search: {
    placeholder: "Search brands, products, categories…",
    /** Phones (< 640 px): the full placeholder clips at 360 px. */
    placeholderShort: "Search brands…",
    /** Accessible name: contains every visible variant of the placeholder. */
    name: "Search brands, products, categories",
    button: "Search",
    examples: ["Try “kebaya”…", "Try “coffee”…", "Try “sunscreen”…", "Try “batik”…", "Try “serum”…", "Try “tote bag”…"],
  },

  ticker: {
    label: "Live board: latest promos and launches",
    tag: "Live",
    /** Between the product title and the discount: "Kurung Moden now −30%". */
    now: "now",
    /** Between the brand and the product title: "Brand launched Kurung Moden". */
    launched: "launched",
    pause: "Pause ticker",
  },

  categories: {
    eyebrow: "Category shelf",
    /** `{accent}` gets the pop accent. */
    title: "What are you {accent} for today?",
    accent: "shopping",
    sub: "{count} categories, from the kitchen to the wardrobe.",
    link: "All brands",
  },

  promoRail: {
    title: "{accent} promos right now",
    accent: "Hot",
    titleText: "Hot promos right now",
    sub: "Prices have dropped, tracked straight from the official stores.",
    noun: { one: "promo", other: "promos" },
  },

  newRail: {
    title: "Just {accent}",
    accent: "landed",
    titleText: "Just landed",
    eyebrowWeek: "This week",
    eyebrowLatest: "Latest launches",
    sub: "Fresh out of the oven: products that just launched.",
    noun: { one: "new product", other: "new products" },
  },

  explainer: {
    title: "How do we stay {accent}?",
    accent: "up to date",
    stepsLabel: "Three steps",
    step: "Step {n}",
    replay: "Play again",
    syncTitle: "Synced from official stores",
    syncBody: "Our little robot does the rounds of {liveBrands} brands' online stores, roughly every 3 hours.",
    trackTitle: "Price drops & new products, spotted",
    trackBody: "Original price vs today's price? We work out the discount for you. New products go straight onto the shelf.",
    example: "A real example: {brand}, as of the last sync.",
    buyTitle: "Click straight through to the store",
    buyBody: "We don't sell anything. You buy direct from the brand, so the money goes to them.",
  },

  origin: {
    /** The original post stays as written (Manglish), in both languages. */
    quote:
      "boleh tak ada sorang buat website yang compile all local brand products daripada skincare, fashion, food to all other things yang Malaysian buat? and MUST BE UP TO DATE dari segi promotion and new products they launched",
    /** Language of the quote above (screen readers switch voice). */
    quoteLang: "ms",
    source: "— a netizen on Threads",
    answer: "Sure can",
    answerSub: "Here it is, and we make sure it stays up to date.",
    promisesLabel: "Our promises",
    promises: {
      sync: "Auto-sync",
      promos: "Promos tracked",
      launches: "New launches caught",
    },
  },

  tiers: {
    title: "From Cili Padi to Jenama Ikon",
    sub: "Every big brand started small: from a fiery little chilli to a name all of Malaysia knows.",
    listLabel: "Three brand sizes",
    brands: { one: "brand", other: "brands" },
    seeAll: "See all {name}",
  },

  spotlight: {
    eyebrow: "This week's pick",
    title: "{accent} of the week",
    accent: "Cili Padi",
    sub: "Small but fiery, like the chilli. Let's cheer on the ones just starting out.",
    visit: "Explore {brand}",
    productsLabel: "Latest from {brand}",
  },

  states: {
    title: "Explore by state",
    sub: "From Perlis all the way to Sabah.",
    listLabel: "States",
    count: { one: ", {count} brand", other: ", {count} brands" },
    empty: "· None yet, suggest one!",
  },

  suggest: {
    title: "Know a great local brand?",
    sub: "Tell us! Oyen, our shop cat, writes it down and we check it out.",
    cta: "Suggest a brand",
  },
};

export default home;
export type HomeMessages = typeof home;
