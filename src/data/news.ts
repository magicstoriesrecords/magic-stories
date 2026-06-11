// ── News ──────────────────────────────────────────────────────────────────────
// Label news shown in the homepage carousel under the Hero. Content is static
// and edited here (like releases.ts / podcasts.ts); likes & comments live in
// Supabase (news_likes / news_comments), keyed by `slug`.
//
// `slug` is the stable id used for engagement — DO NOT change a slug once a news
// item has likes/comments, or it loses them. Order: newest first.
export type News = {
  slug: string; // stable id, e.g. "erg-chebbi-out-now"
  date: string; // ISO date, e.g. "2026-06-09"
  title: string; // short headline (EN)
  titlePl: string; // Polish headline
  blurb: string; // 1-3 sentences (EN)
  blurbPl: string; // Polish version
  image?: string; // optional art, /images/news/<slug>.jpg (export ~3:2)
  link?: string; // optional "read more" / external link
  cta?: string; // optional label for the link button (default: "Read more")
  ctaPl?: string; // Polish label for the link button
};

export const news: News[] = [
  {
    slug: "erg-chebbi-out-now",
    date: "2026-06-09",
    title: "Erg Chebbi EP — out now",
    titlePl: "Erg Chebbi EP — już dostępna",
    blurb:
      "MSR016 has landed. A desert-night journey across melodic and organic house — stream it on your platform of choice.",
    blurbPl:
      "MSR016 wylądowała. Pustynna nocna podróż przez melodic i organic house — słuchaj na wybranej platformie.",
    image: "/images/releases/erg-chebbi-ep.jpg", // TODO: placeholder — replace with 3:2 news art
    link: "/stories",
    cta: "Listen",
    ctaPl: "Słuchaj",
  },
  {
    slug: "podcasts-series-live",
    date: "2026-06-09",
    title: "The MSR podcast series is live",
    titlePl: "Seria podcastów MSR wystartowała",
    blurb:
      "Twelve chapters, twelve mixes from the label's artists and friends. New sounds gathered from around the world.",
    blurbPl:
      "Dwanaście rozdziałów, dwanaście mixów od artystów i przyjaciół wytwórni. Nowe brzmienia zebrane z całego świata.",
    image: "/images/podcasts/msrp-012.jpg", // TODO: placeholder — replace with 3:2 news art
    link: "/podcasts",
    cta: "Open Podcasts",
    ctaPl: "Otwórz Podcasty",
  },
  {
    slug: "magic-library-open",
    date: "2026-06-08",
    title: "Magic Library is open",
    titlePl: "Magiczna Biblioteka otwarta",
    blurb:
      "Our community space — share a track, start a conversation, gather round the page. Sign in with Google and write your chapter.",
    blurbPl:
      "Nasza przestrzeń społeczności — podziel się utworem, zacznij rozmowę, usiądź przy wspólnej stronie. Zaloguj się przez Google i dopisz swój rozdział.",
    image: "/images/hero-msr.jpg", // TODO: placeholder — replace with 3:2 news art
    link: "/library",
    cta: "Enter the Library",
    ctaPl: "Wejdź do Biblioteki",
  },
];
