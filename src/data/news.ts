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
  title: string; // short headline
  blurb: string; // 1-3 sentences
  image?: string; // optional art, /images/news/<slug>.jpg (export ~3:2)
  link?: string; // optional "read more" / external link
  cta?: string; // optional label for the link button (default: "Read more")
};

export const news: News[] = [
  {
    slug: "erg-chebbi-out-now",
    date: "2026-06-09",
    title: "Erg Chebbi EP — out now",
    blurb:
      "MSR016 has landed. A desert-night journey across melodic and organic house — stream it on your platform of choice.",
    link: "/stories",
    cta: "Listen",
  },
  {
    slug: "podcasts-series-live",
    date: "2026-06-09",
    title: "The MSR podcast series is live",
    blurb:
      "Twelve chapters, twelve mixes from the label's artists and friends. New sounds gathered from around the world.",
    link: "/podcasts",
    cta: "Open Podcasts",
  },
  {
    slug: "magic-library-open",
    date: "2026-06-08",
    title: "Magic Library is open",
    blurb:
      "Our community space — share a track, start a conversation, gather round the page. Sign in with Google and write your chapter.",
    link: "/library",
    cta: "Enter the Library",
  },
];
