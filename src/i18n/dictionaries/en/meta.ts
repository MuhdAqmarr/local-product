/**
 * `meta`: site-wide metadata defaults (root layout, default social card). Page translators add
 * their own page keys here (e.g. `promos: { title, description }`) and pass them to pageMetadata().
 */
const meta = {
  siteTitle: "LokalLah! — Every local brand, always up to date",
  description:
    "A directory of Malaysian brands, from Cili Padi makers to Jenama Ikon household names, with live promos and new launches straight from their official stores.",
  /** Default social card (opengraph-image / twitter-image) and its alt text. */
  og: {
    alt: "LokalLah! — Every local brand, always up to date. Live promos and new launches from Malaysian brands' official stores.",
    line1: ["Every ", "local", " brand,"],
    line2: ["always ", "up to date", "."],
    sub: "Live promos and new launches, straight from Malaysian brands' official stores. From Cili Padi to Jenama Ikon.",
    live: "LIVE!",
  },
};

export default meta;
export type MetaMessages = typeof meta;
