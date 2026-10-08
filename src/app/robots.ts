import type { MetadataRoute } from "next";
import { siteOrigin } from "./sitemap";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/saved"] }],
    sitemap: `${siteOrigin()}/sitemap.xml`,
    host: siteOrigin(),
  };
}
