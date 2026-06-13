import { defineRouting } from "next-intl/routing";

// EN is the default and lives at the bare URLs (/, /stories, ...);
// Polish is served under /pl/... — existing links and SEO stay intact.
export const routing = defineRouting({
  locales: ["en", "pl"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  // Always serve EN at the bare URLs; do NOT auto-redirect to /pl based on the
  // browser's Accept-Language. Polish stays reachable via the explicit /pl
  // paths and the language switcher.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
