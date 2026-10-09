import type { MetadataRoute } from "next";
import enMeta from "@/i18n/dictionaries/en/meta";

/** English-first (the default language); the Malay site lives under /ms inside the same scope. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: enMeta.siteTitle,
    short_name: "LokalLah!",
    description: enMeta.description,
    lang: "en-MY",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#FFF8F1",
    theme_color: "#FFF8F1",
    categories: ["shopping", "lifestyle"],
    icons: [
      { src: "/icon/192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon/512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
