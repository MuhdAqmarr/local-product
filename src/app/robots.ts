import type { MetadataRoute } from "next";
import { LOCALES, localeHref } from "@/i18n/config";
import { siteOrigin } from "./sitemap";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", ...LOCALES.map((l) => localeHref(l, "/saved"))] }],
    sitemap: `${siteOrigin()}/sitemap.xml`,
    host: siteOrigin(),
  };
}
