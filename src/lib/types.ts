export type CategorySlug =
  | "beauty"
  | "fashion"
  | "accessories"
  | "food"
  | "drinks"
  | "home"
  | "health"
  | "kids"
  | "tech"
  | "crafts"
  | "lifestyle";

export type TierSlug = "cili-padi" | "naik-daun" | "ikon";

export type FeedType = "shopify" | "woocommerce";

export type MalaysianState =
  | "Johor"
  | "Kedah"
  | "Kelantan"
  | "Melaka"
  | "Negeri Sembilan"
  | "Pahang"
  | "Perak"
  | "Perlis"
  | "Pulau Pinang"
  | "Sabah"
  | "Sarawak"
  | "Selangor"
  | "Terengganu"
  | "Kuala Lumpur"
  | "Putrajaya"
  | "Labuan";

export interface Brand {
  slug: string;
  name: string;
  category: CategorySlug;
  subcategory: string;
  tier: TierSlug;
  /** One or two sentences, max ~160 chars. */
  description: string;
  founded?: number;
  /** Free text, e.g. "Petaling Jaya, Selangor". */
  origin?: string;
  state?: MalaysianState;
  website: string;
  instagram?: string;
  tiktok?: string;
  shopee?: string;
  tags: string[];
  /** Present when the brand runs a store we can read live. */
  feed?: { type: FeedType; origin: string };
}

export interface Product {
  /** `${brandSlug}:${sourceId}` */
  id: string;
  brand: string;
  title: string;
  url: string;
  image?: string;
  imageW?: number;
  imageH?: number;
  /** Lowest price of the variant we display. */
  price: number;
  /** Original price, only set when it is above `price`. */
  compareAt?: number;
  /** Whole-number percent off, only set for a real promo. */
  discount?: number;
  currency: string;
  /** ISO timestamp the product went live on the brand's store. */
  publishedAt?: string;
  available: boolean;
  type?: string;
}

export interface FeedStatus {
  status: "live" | "snapshot" | "error";
  platform: FeedType;
  currency: string;
  country?: string;
  totalProducts?: number;
  /** ISO timestamp of the last successful fetch. */
  fetchedAt?: string;
  error?: string;
}

export interface Snapshot {
  version: 1;
  syncedAt: string;
  feeds: Record<string, FeedStatus>;
  products: Product[];
}

export interface Catalog extends Snapshot {
  source: "live" | "snapshot";
}

/** A product joined with the brand fields a card needs, safe to send to the client. */
export interface ProductCardData extends Product {
  brandName: string;
  brandCategory: CategorySlug;
  brandTier: TierSlug;
}
