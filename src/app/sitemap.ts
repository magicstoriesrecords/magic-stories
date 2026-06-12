import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// All public routes, both locales. EN at bare paths, PL under /pl
// (localePrefix "as-needed"). /account and /auth are intentionally absent.
const paths = ["/", "/stories", "/authors", "/podcasts", "/library", "/submit"];

function abs(path: string) {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

function absPl(path: string) {
  return path === "/" ? `${SITE_URL}/pl` : `${SITE_URL}/pl${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) => {
    const languages = { en: abs(path), pl: absPl(path) };
    return [
      {
        url: abs(path),
        changeFrequency: "weekly" as const,
        priority: path === "/" ? 1 : 0.7,
        alternates: { languages },
      },
      {
        url: absPl(path),
        changeFrequency: "weekly" as const,
        priority: path === "/" ? 0.9 : 0.6,
        alternates: { languages },
      },
    ];
  });
}
