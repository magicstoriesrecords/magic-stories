// Relative time (EN/PL), with an absolute fallback for older posts.
const STRINGS = {
  en: {
    justNow: "just now",
    min: (m: number) => `${m} min ago`,
    hr: (h: number) => `${h} h ago`,
    day: (d: number) => `${d} ${d === 1 ? "day" : "days"} ago`,
    dateLocale: "en-US",
  },
  pl: {
    justNow: "przed chwilą",
    min: (m: number) => `${m} min temu`,
    hr: (h: number) => `${h} godz. temu`,
    day: (d: number) => `${d} dni temu`,
    dateLocale: "pl-PL",
  },
} as const;

export function timeAgo(iso: string, locale: string = "pl"): string {
  const L = STRINGS[locale === "en" ? "en" : "pl"];
  const then = new Date(iso).getTime();
  const s = Math.floor((Date.now() - then) / 1000);
  if (s < 45) return L.justNow;
  const m = Math.floor(s / 60);
  if (m < 60) return L.min(m);
  const h = Math.floor(m / 60);
  if (h < 24) return L.hr(h);
  const d = Math.floor(h / 24);
  if (d < 7) return L.day(d);
  return new Date(iso).toLocaleDateString(L.dateLocale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
