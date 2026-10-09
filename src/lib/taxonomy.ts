import type { Locale } from "@/i18n/config";
import type { CategorySlug, MalaysianState, TierSlug } from "./types";

export interface Category {
  slug: CategorySlug;
  /** Full English name (headings, metadata): "Skincare & Beauty". */
  name: string;
  /** Short English label for tiles, chips and nav: "Beauty". */
  nameShort: string;
  /** Malay name (short enough for tiles everywhere): "Kecantikan". */
  nameMs: string;
  emoji: string;
  /** One-line English blurb. */
  blurb: string;
  /** One-line Malay blurb (Manglish voice). */
  blurbMs: string;
}

export const CATEGORIES: readonly Category[] = [
  { slug: "beauty", name: "Skincare & Beauty", nameShort: "Beauty", nameMs: "Kecantikan", emoji: "💄", blurb: "Local glow-ups: skincare, makeup, haircare and fragrance.", blurbMs: "Glow-up lokal: skincare, makeup, haircare & wangian." },
  { slug: "fashion", name: "Fashion", nameShort: "Fashion", nameMs: "Fesyen", emoji: "👗", blurb: "Tudung, baju kurung, streetwear and everyday fits.", blurbMs: "Tudung, baju kurung, streetwear & everyday fits." },
  { slug: "accessories", name: "Shoes, Bags & Accessories", nameShort: "Accessories", nameMs: "Aksesori", emoji: "👜", blurb: "Shoes, bags, jewellery and watches.", blurbMs: "Kasut, beg, barang kemas & jam tangan." },
  { slug: "food", name: "Food & Snacks", nameShort: "Food", nameMs: "Makanan", emoji: "🌶️", blurb: "Sambal, kerepek, biscuits and spices.", blurbMs: "Sambal, kerepek, biskut & rempah ratus." },
  { slug: "drinks", name: "Coffee, Tea & Drinks", nameShort: "Drinks", nameMs: "Minuman", emoji: "☕", blurb: "Coffee, tea and fresh drinks made right here.", blurbMs: "Kopi, teh & minuman segar buatan sini." },
  { slug: "home", name: "Home & Living", nameShort: "Home", nameMs: "Rumah", emoji: "🏡", blurb: "Furniture, kitchenware, scented candles and cute decor.", blurbMs: "Perabot, dapur, lilin wangi & deko comel." },
  { slug: "health", name: "Health & Wellness", nameShort: "Health", nameMs: "Kesihatan", emoji: "🌿", blurb: "Supplements, jamu and self-care.", blurbMs: "Supplement, jamu & self-care." },
  { slug: "kids", name: "Baby & Kids", nameShort: "Kids", nameMs: "Anak-anak", emoji: "🧸", blurb: "For the little ones: baby care, toys and kids' clothes.", blurbMs: "Untuk si kecil: baby care, mainan & baju budak." },
  { slug: "tech", name: "Tech & Gadgets", nameShort: "Tech", nameMs: "Teknologi", emoji: "🎧", blurb: "Gadgets and tech accessories made in Malaysia.", blurbMs: "Gajet & aksesori tech buatan Malaysia." },
  { slug: "crafts", name: "Crafts & Gifts", nameShort: "Crafts & Gifts", nameMs: "Kraf & Hadiah", emoji: "🎁", blurb: "Batik, pewter, stationery and special gifts.", blurbMs: "Batik, pewter, alat tulis & hadiah istimewa." },
  { slug: "lifestyle", name: "Sports & Lifestyle", nameShort: "Lifestyle", nameMs: "Gaya Hidup", emoji: "🚲", blurb: "Sports, outdoors, automotive and hobbies.", blurbMs: "Sukan, outdoor, automotif & hobi." },
] as const;

export const CATEGORY_BY_SLUG = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c])) as Record<CategorySlug, Category>;

export function isCategorySlug(value: string): value is CategorySlug {
  return value in CATEGORY_BY_SLUG;
}

type CategoryRef = CategorySlug | Pick<Category, "slug">;
const cat = (c: CategoryRef) => CATEGORY_BY_SLUG[typeof c === "string" ? c : c.slug];

/** Short label for tiles, chips, nav and meta lines: "Beauty" / "Kecantikan". */
export function categoryLabel(c: CategoryRef, locale: Locale): string {
  const x = cat(c);
  return locale === "ms" ? x.nameMs : x.nameShort;
}

/** Full name for headings and metadata: "Skincare & Beauty" / "Kecantikan". */
export function categoryName(c: CategoryRef, locale: Locale): string {
  const x = cat(c);
  return locale === "ms" ? x.nameMs : x.name;
}

/** Mid-sentence labels where the lowercased short label reads wrong ("home brand", "jenama rumah"). */
const INLINE: Partial<Record<CategorySlug, Record<Locale, string>>> = {
  home: { en: "home & living", ms: "barangan rumah" },
  kids: { en: "baby & kids", ms: "bayi & kanak-kanak" },
};

/** Lowercase label for use inside a sentence: "Malaysian {beauty} brand" / "jenama {barangan rumah} lokal". */
export function categoryInline(c: CategoryRef, locale: Locale): string {
  const x = cat(c);
  return INLINE[x.slug]?.[locale] ?? categoryLabel(x, locale).toLowerCase();
}

/** One-line blurb in the page language. */
export function categoryBlurb(c: CategoryRef, locale: Locale): string {
  const x = cat(c);
  return locale === "ms" ? x.blurbMs : x.blurb;
}

export interface Tier {
  slug: TierSlug;
  /** Kept in both languages (docs/I18N.md): "Cili Padi", "Naik Daun", "Jenama Ikon". */
  name: string;
  emoji: string;
  /** Short line: "Small but mighty" / "Kecil-kecil cili padi". */
  tagline: string;
  taglineMs: string;
  /** Who belongs here (one sentence). */
  description: string;
  descriptionMs: string;
  /** Playful one-liner (DESIGN §9.10) for popovers, tier cards and filters. */
  line: string;
  lineMs: string;
  /** Rubber-stamp ring text (caps, ends with " •"). */
  ring: string;
  ringMs: string;
}

/** Ordered small → big; the site tells this story left to right. */
export const TIERS: readonly Tier[] = [
  {
    slug: "cili-padi",
    name: "Cili Padi",
    emoji: "🌶️",
    tagline: "Small but mighty",
    taglineMs: "Kecil-kecil cili padi",
    description: "Small, indie and home-grown makers punching way above their weight.",
    descriptionMs: "Pembuat kecil, indie dan home-grown yang berani lawan jenama besar.",
    line: "Small but mighty. Home-grown, just starting out, and full of fire!",
    lineMs: "Kecil-kecil cili padi. Home-grown, baru bertatih, tapi pedas!",
    ring: "CILI PADI • SMALL BUT MIGHTY •",
    ringMs: "KECIL-KECIL CILI PADI •",
  },
  {
    slug: "naik-daun",
    name: "Naik Daun",
    emoji: "🌿",
    tagline: "Rising stars",
    taglineMs: "Tengah naik daun",
    description: "Modern local brands everyone's suddenly talking about.",
    descriptionMs: "Jenama lokal moden yang tiba-tiba semua orang sebut.",
    line: "On the rise. More people know them every day, and they're picking up speed.",
    lineMs: "Tengah naik daun. Makin ramai kenal, makin laju jalan.",
    ring: "NAIK DAUN • RISING STARS •",
    ringMs: "TENGAH NAIK DAUN •",
  },
  {
    slug: "ikon",
    name: "Jenama Ikon",
    emoji: "👑",
    tagline: "Household icons",
    taglineMs: "Nama yang semua kenal",
    description: "The names we grew up with, and still love.",
    descriptionMs: "Nama yang kita membesar bersama, dan masih sayang sampai sekarang.",
    line: "Names all of Malaysia knows. We grew up together.",
    lineMs: "Nama yang satu Malaysia kenal. Kita membesar sama-sama.",
    ring: "JENAMA IKON • MALAYSIAN ICONS •",
    ringMs: "JENAMA IKON MALAYSIA •",
  },
] as const;

export const TIER_BY_SLUG = Object.fromEntries(TIERS.map((t) => [t.slug, t])) as Record<TierSlug, Tier>;

/** Tier copy in the page language: tagline, description, line and stamp ring. Names stay as-is. */
export function tierCopy(tier: TierSlug, locale: Locale): { name: string; tagline: string; description: string; line: string; ring: string } {
  const t = TIER_BY_SLUG[tier];
  return locale === "ms"
    ? { name: t.name, tagline: t.taglineMs, description: t.descriptionMs, line: t.lineMs, ring: t.ringMs }
    : { name: t.name, tagline: t.tagline, description: t.description, line: t.line, ring: t.ring };
}

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
