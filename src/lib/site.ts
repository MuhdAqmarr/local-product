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
