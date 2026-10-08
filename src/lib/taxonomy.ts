import type { CategorySlug, MalaysianState, TierSlug } from "./types";

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Malay name used in playful copy. */
  nameMs: string;
  emoji: string;
  blurb: string;
}

export const CATEGORIES: readonly Category[] = [
  { slug: "beauty", name: "Skincare & Beauty", nameMs: "Kecantikan", emoji: "💄", blurb: "Glow-up lokal: skincare, makeup, haircare & wangian." },
  { slug: "fashion", name: "Fashion", nameMs: "Fesyen", emoji: "👗", blurb: "Tudung, baju kurung, streetwear & everyday fits." },
  { slug: "accessories", name: "Shoes, Bags & Accessories", nameMs: "Aksesori", emoji: "👜", blurb: "Kasut, beg, barang kemas & jam tangan." },
  { slug: "food", name: "Food & Snacks", nameMs: "Makanan", emoji: "🌶️", blurb: "Sambal, kerepek, biskut & rempah ratus." },
  { slug: "drinks", name: "Coffee, Tea & Drinks", nameMs: "Minuman", emoji: "☕", blurb: "Kopi, teh & minuman segar buatan sini." },
  { slug: "home", name: "Home & Living", nameMs: "Rumah", emoji: "🏡", blurb: "Perabot, dapur, lilin wangi & deko comel." },
  { slug: "health", name: "Health & Wellness", nameMs: "Kesihatan", emoji: "🌿", blurb: "Supplement, jamu & self-care." },
  { slug: "kids", name: "Baby & Kids", nameMs: "Anak-anak", emoji: "🧸", blurb: "Untuk si kecil: baby care, mainan & baju budak." },
  { slug: "tech", name: "Tech & Gadgets", nameMs: "Teknologi", emoji: "🎧", blurb: "Gajet & aksesori tech buatan Malaysia." },
  { slug: "crafts", name: "Crafts & Gifts", nameMs: "Kraf & Hadiah", emoji: "🎁", blurb: "Batik, pewter, alat tulis & hadiah istimewa." },
  { slug: "lifestyle", name: "Sports & Lifestyle", nameMs: "Gaya Hidup", emoji: "🚲", blurb: "Sukan, outdoor, automotif & hobi." },
] as const;

export const CATEGORY_BY_SLUG = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c])) as Record<CategorySlug, Category>;

export function isCategorySlug(value: string): value is CategorySlug {
  return value in CATEGORY_BY_SLUG;
}

export interface Tier {
  slug: TierSlug;
  name: string;
  emoji: string;
  tagline: string;
  description: string;
}

/** Ordered small → big; the site tells this story left to right. */
export const TIERS: readonly Tier[] = [
  {
    slug: "cili-padi",
    name: "Cili Padi",
    emoji: "🌶️",
    tagline: "Kecil-kecil cili padi",
    description: "Small, indie & home-grown makers punching way above their weight.",
  },
  {
    slug: "naik-daun",
    name: "Naik Daun",
    emoji: "🌿",
    tagline: "Rising stars",
    description: "Modern local brands everyone's suddenly talking about.",
  },
  {
    slug: "ikon",
    name: "Jenama Ikon",
    emoji: "👑",
    tagline: "Household icons",
    description: "The names we grew up with — and still love.",
  },
] as const;

export const TIER_BY_SLUG = Object.fromEntries(TIERS.map((t) => [t.slug, t])) as Record<TierSlug, Tier>;

export const STATES: readonly MalaysianState[] = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Perak",
  "Perlis",
  "Pulau Pinang",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
  "Kuala Lumpur",
  "Putrajaya",
  "Labuan",
] as const;

/** Products published within this many days of the last sync count as "Baru". */
export const NEW_WINDOW_DAYS = 30;

/** Discounts outside this range are treated as data noise, not promos. */
export const MIN_PROMO_DISCOUNT = 5;
export const MAX_PROMO_DISCOUNT = 90;
