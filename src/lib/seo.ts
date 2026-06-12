import type { Metadata } from "next";

// ── SEO helpers ───────────────────────────────────────────────────────────────
// Canonical site origin (production). Used for metadataBase, canonical URLs,
// the sitemap and JSON-LD. Update here if we move to a custom domain.
export const SITE_URL = "https://magicstoriesrecords.com";

export const SITE_NAME = "Magic Stories Records";

// Default Open Graph image (1200×630, generated from the hero poster).
export const OG_IMAGE = "/images/og.jpg";

// EN lives at the bare path, Polish under /pl (localePrefix "as-needed").
function plPath(path: string) {
  return path === "/" ? "/pl" : `/pl${path}`;
}

type PageMetaInput = {
  locale: string;
  path: string; // locale-less route, e.g. "/" or "/stories"
  title: string;
  description: string;
  noindex?: boolean; // private pages (e.g. /account)
};

// Builds the full per-page metadata: title/description, canonical + hreflang
// alternates and Open Graph / Twitter cards. Next.js does NOT inherit a page's
// title into og:title from the layout, so each page passes its own.
export function buildPageMeta({
  locale,
  path,
  title,
  description,
  noindex,
}: PageMetaInput): Metadata {
  const canonical = locale === "pl" ? plPath(path) : path;
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { en: path, pl: plPath(path), "x-default": path },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      locale: locale === "pl" ? "pl_PL" : "en_US",
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
