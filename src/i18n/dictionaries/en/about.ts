/**
 * `about`: the /about page (DESIGN §8.8, §9.3, §9.4, §9.10) and the suggest form. English source
 * shape: `ms/about.ts` must match (tsc fails on a missing or extra key). Plain strings only:
 * `{name}` placeholders for fmt() / rich(), `{ one, other }` objects for plural(). No functions.
 */
const about = {
  meta: {
    title: "About",
    description: "Why LokalLah! exists, how we sync data from official stores, what the brand tiers mean, and how to suggest a local brand.",
    socialDescription: "Why LokalLah! exists and how we sync data from official stores.",
  },

  hero: {
    eyebrow: "About LokalLah!",
    /** `{accent}` is the highlighted word. */
    title: "It all started with one {accent}.",
    accent: "question",
  },

  quote: {
    who: "a netizen on Threads",
    /** English gloss under the original Malay post (empty in Malay: the post needs no gloss). */
    glossLabel: "In English:",
    gloss:
      "“Could someone build a website that compiles every local brand's products, from skincare and fashion to food and everything else Malaysians make? And it MUST BE UP TO DATE on promotions and the new products they launch.”",
    answer: "Sure can.",
    answerSub: "Here it is, and we make sure it stays up to date.",
    chips: {
      sync: "Auto-sync",
      promos: "Promos tracked",
      launches: "New launches caught",
    },
  },

  sync: {
    eyebrow: "How we sync",
    title: "How do we stay {accent}?",
    accent: "up to date",
    steps: [
      {
        title: "Synced from official stores",
        body: "Our little robot makes the rounds of every brand store we can read, roughly every 3 hours, plus once more every morning around 6.",
      },
      {
        title: "Price drops & new products spotted",
        body: "Original price vs today's price? We work out the discount for you. New products go straight onto the shelf.",
      },
      {
        title: "Click straight through to the store",
        body: "We don't sell anything. You buy direct from the brand, and the money goes to them.",
      },
    ],
    /** `{live}`, `{total}` and `{when}` are rendered with markup. */
    stats: "Right now, {live} of {total} brands have an online store we can read directly. The rest are listed with their official links only. Last sync: {when}.",
  },

  tiers: {
    eyebrow: "Brand size",
    /** "From Cili Padi to Jenama Ikon": tier names stay in Malay in both languages. */
    title: "From Cili Padi to Jenama {accent}",
    accent: "Ikon",
    sub: "Every big brand started small. Cili Padi are the small-but-mighty newcomers, Naik Daun the rising stars, and Jenama Ikon the household names.",
    count: { one: "brand", other: "brands" },
    srCount: { one: "{count} brand", other: "{count} brands" },
    seeAll: "See all",
  },

  who: {
    title: "Who we are (and who we're not)",
    weAre: "We are…",
    weAreList: [
      "An independent directory of Malaysian brands, from Cili Padi indie makers to Jenama Ikon household names.",
      "Prices, promos and products read straight from the brands' official online stores (wherever we can read them).",
      "Outbound links tagged utm_source=lokallah, so brands can see the traffic came from us.",
    ],
    weAreNot: "We're not…",
    weAreNotList: [
      "A shop. We don't sell anything; you buy direct from the brand.",
      "An official partner, sponsor or representative of any brand.",
      "Affiliate links, commissions or paid placements.",
    ],
    prices: "Prices and stock can change at any time. Please confirm the final price on the official store before you buy.",
    trademarks: "Brand names, trademarks and product photos belong to their respective owners.",
    /** `{form}` is a link to the suggest form below. */
    owners: "Own a brand? Want to update your info or be taken off the list? {form}.",
    ownersForm: "Use the form below",
    /** `{maker}` links to the maker's site. */
    maker: "LokalLah! is designed and built by {maker}.",
    newTab: "(opens in a new tab)",
  },

  faq: {
    eyebrow: "FAQ",
    title: "Questions people often ask",
    source: {
      q: "Where do the prices and promos come from?",
      a: "Straight from the brands' official online stores. We read the store's product list, work out the discount from the original vs current price, and flag products that just launched. Brands whose stores we can't read automatically yet are still listed, with their official links.",
    },
    frequency: {
      q: "How often is the data updated?",
      /** `{when}` is the last sync time. */
      a: "Roughly every 3 hours behind the scenes, plus once more every day around 6am. Last sync: {when}. Every product card shows when its price was checked.",
    },
    prices: {
      q: "Are the prices here guaranteed to match the store?",
      a: "Prices and stock can change at any time, even between two syncs. Please confirm the final price on the brand's official store before you pay.",
    },
    affiliation: {
      q: "Is LokalLah! connected to these brands?",
      a: "Nope. LokalLah! is an independent directory. We're not affiliated with, sponsored by or endorsed by any brand listed here. We don't take commissions and there are no paid placements: the order of brands and products isn't for sale.",
    },
    utm: {
      q: "Why do outbound links have utm_source=lokallah?",
      a: "So brands can see in their analytics that the visit came from LokalLah!. These aren't affiliate links, and we get nothing when you buy.",
    },
    tiers: {
      q: "What's the difference between Cili Padi, Naik Daun and Jenama Ikon?",
      /** `{link}` jumps to the tier section. */
      a: "The tiers describe brand size. Cili Padi (the tiny but fiery bird's-eye chilli) is for small, home-grown makers; Naik Daun (literally \"on the rise\") is for brands fast becoming known; Jenama Ikon (\"icon brands\") is for the names all of Malaysia knows. {link}.",
      link: "Meet the tiers",
    },
    saved: {
      q: "Where are my saved items kept?",
      a: "Only in your browser (localStorage). No login needed, and we can't see what you save. Clear your browser data and they're gone.",
    },
    owners: {
      q: "I own a brand. Can I fix my info or be taken off the list?",
      /** `{link}` is the suggest form. */
      a: "Of course. Use the {link} below and tell us the brand name and what needs changing.",
      link: "suggestion form",
    },
  },

  suggest: {
    eyebrow: "Suggest a brand",
    title: "Know a great local brand?",
    sub: "Tell us! Oyen takes notes, we check them out.",
    emailNote: "Sending opens your email app with everything filled in; you just hit send.",
    /** No suggestion inbox configured yet: shown instead of the form. `{maker}` links to the maker's site. */
    closedTitle: "Suggestions open soon!",
    closedBody: "Oyen is still setting up the suggestion inbox. In the meantime, you can reach the team behind LokalLah! at {maker}.",
    handNote: "Oyen's got a pen ready!",
  },

  form: {
    name: "Brand name",
    link: "Store link / Instagram",
    linkPlaceholder: "brandstore.com or @brand",
    linkHelper: "The brand's official online store (Shopify, WooCommerce, website) or Instagram account.",
    category: "Category",
    state: "State",
    notSure: "Not sure",
    why: "Why is it great?",
    whyPlaceholder: "Their best-seller, why you love them, anything at all.",
    email: "Your email (optional)",
    emailHelper: "Only so we can get back to you about this suggestion.",
    honeypot: "Website (leave blank)",
    /** `{star}` is the red asterisk. */
    required: "Fields marked {star} are required.",
    noteEmail: "Your suggestion is sent from your own email app.",
    noteWebhook: "Oyen takes notes, we check them out.",
    submit: "Send suggestion",

    sentTitle: "Thank you! Oyen has noted your suggestion.",
    sentBody: "We'll check this brand out. If it's a fit, it goes up on the LokalLah! shelves.",
    emailTitle: "Almost there! Just one more tap.",
    emailBody: "Your email app will open with the suggestion already filled in. Just hit send.",
    emailCta: "Open email & send",
    another: "Suggest another",

    sendFailed: "Oops, that didn't go through. Try again, or send it by email instead.",
    failed: "Oops, that didn't work. Try again?",
    sendDirect: "Send by email",

    errors: {
      nameShort: "Enter the brand name (at least 2 letters).",
      linkMissing: "Add the brand's online store or Instagram link.",
      linkInvalid: "That link doesn't look right. Example: brandstore.com or @brand",
      category: "Pick a category from the list.",
      state: "Pick a state from the list.",
      email: "That email doesn't look right. You can leave it blank.",
    },
  },

  /** The pre-filled email (email mode), written in the visitor's language. */
  issue: {
    title: "Brand suggestion: {name}",
    name: "Brand name",
    link: "Store link / Instagram",
    category: "Category",
    state: "State",
    why: "Why is it great?",
    footer: "Sent from the LokalLah! Suggest a brand form.",
  },
};

export default about;
export type AboutMessages = typeof about;
