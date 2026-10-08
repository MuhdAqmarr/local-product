import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LokalLah! — Semua jenama lokal, sentiasa up to date",
    short_name: "LokalLah!",
    description: "Direktori jenama Malaysia dengan promo live dan launch baru terus dari kedai rasmi mereka.",
    lang: "ms-MY",
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
