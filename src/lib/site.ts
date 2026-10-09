/**
 * Canonical site origin. NEXT_PUBLIC_SITE_URL wins when set; on Vercel we fall back to the
 * project's production domain (a system env var available at build and runtime).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://lokallah.vercel.app")
).replace(/\/+$/, "");

export const SITE_NAME = "LokalLah!";
export const REPO_URL = "https://github.com/MuhdAqmarr/local-product";

/* ---- Social metadata (QA F10) ----
 * A page's `openGraph` / `twitter` object REPLACES the layout's wholesale, so every page that sets
 * its own title/description must also carry the image and card again. Spread these bases (or use
 * `pageMetadata`) instead of writing bare objects. A route with its own opengraph-image.tsx /
 * twitter-image.tsx file should spread the bases WITHOUT `images` (`ogBaseNoImage`,
 * `twitterBaseNoImage`) so the file convention wins.
 */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = "LokalLah! — Semua jenama lokal, sentiasa up to date. Promo live dan launch baru dari kedai rasmi jenama Malaysia.";

const OG_DEFAULT_IMAGE = { url: "/opengraph-image", ...OG_SIZE, alt: OG_ALT, type: "image/png" };
const TWITTER_DEFAULT_IMAGE = { url: "/twitter-image", ...OG_SIZE, alt: OG_ALT, type: "image/png" };

export const ogBaseNoImage = { type: "website", siteName: SITE_NAME, locale: "ms_MY" } as const;
export const twitterBaseNoImage = { card: "summary_large_image" } as const;
export const ogBase = { ...ogBaseNoImage, images: [OG_DEFAULT_IMAGE] };
export const twitterBase = { ...twitterBaseNoImage, images: [TWITTER_DEFAULT_IMAGE] };

export interface PageMetadataInput {
  /** Page title (goes through the layout's "%s · LokalLah!" template unless `absolute`). */
  title: string;
  description: string;
  /** Canonical path, e.g. "/promos". */
  path: string;
  /** Shorter description for social cards (defaults to `description`). */
  socialDescription?: string;
  /** Use the title as-is (no template), e.g. for Home. */
  absolute?: boolean;
  /** false = the route has its own opengraph-image / twitter-image files; don't set images. */
  defaultImage?: boolean;
}

/** Title, description, canonical, Open Graph and Twitter for one page, always with an image + large card. */
export function pageMetadata({ title, description, path, socialDescription, absolute, defaultImage = true }: PageMetadataInput) {
  const social = absolute ? title : `${title} · ${SITE_NAME}`;
  const desc = socialDescription ?? description;
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { ...(defaultImage ? ogBase : ogBaseNoImage), title: social, description: desc, url: path },
    twitter: { ...(defaultImage ? twitterBase : twitterBaseNoImage), title: social, description: desc },
  };
}
