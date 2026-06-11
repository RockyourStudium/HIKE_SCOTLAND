import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private/funktionale Bereiche — nichts davon soll in den Index.
      disallow: ["/admin", "/account", "/api", "/auth", "/my-trip", "/unsubscribe"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
