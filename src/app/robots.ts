import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private/per-user and OAuth plumbing — not for search engines.
      disallow: ["/account", "/pl/account", "/auth/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
