import { defineRouting } from "next-intl/routing";

// EN is the default and lives at the bare URLs (/, /stories, ...);
// Polish is served under /pl/... — existing links and SEO stay intact.
export const routing = defineRouting({
  locales: ["en", "pl"],
  defaultLocale: "en",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
