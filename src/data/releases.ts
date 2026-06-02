// Releases ("chapters"), newest first. Covers: /public/images/releases/<slug>.jpg
// Add soundcloud/youtube/spotify links per release ("" hides the button).
export type Links = {
  beatport?: string;
  soundcloud?: string;
  youtube?: string;
  spotify?: string;
};

export type Release = {
  slug: string;
  title: string;
  artist: string;
  date: string; // display
  released: string; // ISO, for sorting
  links: Links;
};

const BP = "https://www.beatport.com/release";

export const releases: Release[] = [
  { slug: "erg-chebbi-ep", title: "Erg Chebbi EP", artist: "Modern Walking (PL)", date: "May 2026", released: "2026-05-28", links: { beatport: `${BP}/erg-chebbi-ep/6972085` } },
  { slug: "sunset-at-kamala-ep", title: "Sunset At Kamala EP", artist: "Mazze", date: "Apr 2026", released: "2026-04-30", links: { beatport: `${BP}/sunset-at-kamala-ep/6800308` } },
  { slug: "feathers-ep", title: "Feathers EP", artist: "Slaqk", date: "Jan 2026", released: "2026-01-15", links: { beatport: `${BP}/feathers-ep/5761789` } },
  { slug: "mirra-ep", title: "Mirra EP", artist: "Peres", date: "Nov 2025", released: "2025-11-06", links: { beatport: `${BP}/mirra-ep/5529093` } },
  { slug: "face-ep", title: "Face EP", artist: "Mauro Masi", date: "Sep 2025", released: "2025-09-25", links: { beatport: `${BP}/face-ep/5380095` } },
  { slug: "liminal-glow-ep", title: "Liminal Glow EP", artist: "Mazze & Rafa'EL", date: "Aug 2025", released: "2025-08-28", links: { beatport: `${BP}/liminal-glow-ep/5271502` } },
  { slug: "velvet-abyss", title: "Velvet Abyss", artist: "Mazze", date: "Mar 2025", released: "2025-03-27", links: { beatport: `${BP}/velvet-abyss/4995007` } },
  { slug: "dot-circle-ep", title: "Dot Circle EP", artist: "Manu Amon", date: "Feb 2025", released: "2025-02-20", links: { beatport: `${BP}/dot-circle-ep/4934335` } },
  { slug: "sakura-ep", title: "Sakura EP", artist: "Adrià Falcó", date: "Jan 2025", released: "2025-01-23", links: { beatport: `${BP}/sakura-ep/4881336` } },
  { slug: "flames", title: "Flames", artist: "Mauro Masi", date: "Jul 2024", released: "2024-07-11", links: { beatport: `${BP}/flames/4633083` } },
  { slug: "ordinary-vision-ep", title: "Ordinary Vision EP", artist: "Our Spaces", date: "Jun 2024", released: "2024-06-20", links: { beatport: `${BP}/ordinary-vision-ep/4605780` } },
  { slug: "sleep-alone", title: "Sleep Alone", artist: "Miqro", date: "May 2024", released: "2024-05-23", links: { beatport: `${BP}/sleep-alone/4570957` } },
  { slug: "lunar-ep", title: "Lunar EP", artist: "Mazze", date: "Mar 2024", released: "2024-03-07", links: { beatport: `${BP}/lunar-ep/4460074` } },
  { slug: "elderose-ep", title: "Elderose EP", artist: "Rafa'EL", date: "Feb 2024", released: "2024-02-01", links: { beatport: `${BP}/elderose-ep/4412885` } },
  { slug: "tones-of-togetherness-ep", title: "Tones of Togetherness EP", artist: "Mazze", date: "Jan 2024", released: "2024-01-04", links: { beatport: `${BP}/tones-of-togetherness-ep/4364653` } },
  { slug: "sagala-ep", title: "Sagala EP", artist: "Mazze", date: "Nov 2022", released: "2022-11-04", links: { beatport: `${BP}/sagala-ep/3892199` } },
];
