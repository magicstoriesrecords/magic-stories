// Releases ("chapters"), newest first. Covers: /public/images/releases/<slug>.jpg
// links: omitted platform = button hidden. Verified sources:
//  - beatport: release pages (catalogue numbers)
//  - soundcloud: MSR account playlists (sets)
//  - youtube: MSR channel "Releases" (title-track video)
//  - spotify: artist discographies (album)
export type Links = {
  beatport?: string;
  soundcloud?: string;
  youtube?: string;
  spotify?: string;
};

export type Release = {
  slug: string;
  cat: string; // catalogue number e.g. MSR016
  title: string;
  artist: string;
  date: string; // display
  released: string; // ISO, for sorting
  blurb: string; // 1-2 sentence chapter note
  links: Links;
};

const BP = "https://www.beatport.com/release";
const SC = "https://soundcloud.com/magicstoriesrec/sets";
const YT = "https://www.youtube.com/watch?v=";
const SP = "https://open.spotify.com/album/";

export const releases: Release[] = [
  {
    slug: "erg-chebbi-ep",
    cat: "MSR016",
    title: "Erg Chebbi EP",
    artist: "Modern Walking (PL)",
    date: "May 2026",
    released: "2026-05-28",
    blurb:
      "Named for the great Saharan dunes, Modern Walking drifts through warm electronica and organic house — classic synths shaped into a slow, shifting desert mirage.",
    links: { beatport: `${BP}/erg-chebbi-ep/6972085`, soundcloud: `${SC}/modern-walking-erg-chebbi-ep`, youtube: `${YT}ZpusINlHBYg` },
  },
  {
    slug: "sunset-at-kamala-ep",
    cat: "MSR015",
    title: "Sunset At Kamala EP",
    artist: "Mazze",
    date: "Apr 2026",
    released: "2026-04-30",
    blurb:
      "Founder Mazze chases the last gold of an evening by the sea — deep, organic and progressive grooves caught at the moment the sun touches the water.",
    links: { beatport: `${BP}/sunset-at-kamala-ep/6800308`, soundcloud: `${SC}/mazze-sunset-at-kamala-ep`, youtube: `${YT}IWWBp0o-UtA`, spotify: `${SP}3CWn0RR9sU1FeNudH1WcNa` },
  },
  {
    slug: "feathers-ep",
    cat: "MSR014",
    title: "Feathers EP",
    artist: "Slaqk",
    date: "Jan 2026",
    released: "2026-01-15",
    blurb:
      "Slaqk works in the weightless space where house meets something more organic — a light, airy EP that drifts as much as it moves.",
    links: { beatport: `${BP}/feathers-ep/5761789`, soundcloud: `${SC}/slaqk-feathers-ep-magic`, youtube: `${YT}SjJU0GbuhK0`, spotify: `${SP}3oLvp4jS6mq46WNqRNhDxH` },
  },
  {
    slug: "mirra-ep",
    cat: "MSR013",
    title: "Mirra EP",
    artist: "Peres",
    date: "Nov 2025",
    released: "2025-11-06",
    blurb:
      "A mirror held up to the dancefloor — Peres returns to his old-school, deeply melodic progressive instinct across the reflective Mirra EP.",
    links: { beatport: `${BP}/mirra-ep/5529093`, soundcloud: `${SC}/peres-mirra-ep-magic-stories` },
  },
  {
    slug: "face-ep",
    cat: "MSR012",
    title: "Face EP",
    artist: "Mauro Masi",
    date: "Sep 2025",
    released: "2025-09-25",
    blurb:
      "Mauro Masi turns his deep, progressive craft toward warm chords and unhurried, golden-hour grooves.",
    links: { beatport: `${BP}/face-ep/5380095`, soundcloud: `${SC}/mauro-masi-face-ep-magic`, youtube: `${YT}Dm8YIgmwkPc` },
  },
  {
    slug: "liminal-glow-ep",
    cat: "MSR011",
    title: "Liminal Glow EP",
    artist: "Mazze & Rafa'EL",
    date: "Aug 2025",
    released: "2025-08-28",
    blurb:
      "Two Magic Stories voices meet at the threshold between dusk and night — a melodic, organic collaboration that glows in the in-between.",
    links: { beatport: `${BP}/liminal-glow-ep/5271502`, soundcloud: `${SC}/rafael-mazze-liminal-glow`, youtube: `${YT}98Qa3JCpSKw`, spotify: `${SP}1NQubTzNUKVZ5OxRJBinJ2` },
  },
  {
    slug: "velvet-abyss",
    cat: "MSR010",
    title: "Velvet Abyss",
    artist: "Mazze",
    date: "Mar 2025",
    released: "2025-03-27",
    blurb:
      "Mazze leans into the dark and immersive — a deep, velvet descent built for the small hours.",
    links: { beatport: `${BP}/velvet-abyss/4995007`, soundcloud: `${SC}/mazze-velvet-abyss-magic`, youtube: `${YT}S8K74HJNrzA`, spotify: `${SP}2KpNcOrxqc1qQkkVutoZS7` },
  },
  {
    slug: "dot-circle-ep",
    cat: "MSR009",
    title: "Dot Circle EP",
    artist: "Manu Amon",
    date: "Feb 2025",
    released: "2025-02-20",
    blurb:
      "Drummer and pianist Manu Amon builds hypnotic melodies into meticulously arranged spaces — electronica made for full immersion.",
    links: { beatport: `${BP}/dot-circle-ep/4934335`, soundcloud: `${SC}/manu-amon-dot-circle-ep-magic` },
  },
  {
    slug: "sakura-ep",
    cat: "MSR008",
    title: "Sakura EP",
    artist: "Adrià Falcó",
    date: "Jan 2025",
    released: "2025-01-23",
    blurb:
      "Classically trained Adrià Falcó writes a blossoming, nostalgic chapter — piano-led melodies poised between organic, progressive and deep.",
    links: { beatport: `${BP}/sakura-ep/4881336`, soundcloud: `${SC}/adria-falco-sakura-ep-magic`, youtube: `${YT}Psv_fNXd00o` },
  },
  {
    slug: "flames",
    cat: "MSR007",
    title: "Flames",
    artist: "Mauro Masi",
    date: "Jul 2024",
    released: "2024-07-11",
    blurb:
      "A single, slow-burning track — Mauro Masi's warm, melodic flame held against the evening.",
    links: { beatport: `${BP}/flames/4633083`, soundcloud: `${SC}/mauro-masi-flames-ep-magic`, youtube: `${YT}pk76GX2q8_Y` },
  },
  {
    slug: "ordinary-vision-ep",
    cat: "MSR006",
    title: "Ordinary Vision EP",
    artist: "Our Spaces",
    date: "Jun 2024",
    released: "2024-06-20",
    blurb:
      "Rafa'EL and Marylin weave voice, lyrics and violin into organic house — the extraordinary found inside an ordinary day on the coast.",
    links: { beatport: `${BP}/ordinary-vision-ep/4605780`, soundcloud: `${SC}/our-spaces-ordinary-vision-ep`, youtube: `${YT}kn4qkx4UKAA` },
  },
  {
    slug: "sleep-alone",
    cat: "MSR005",
    title: "Sleep Alone",
    artist: "Miqro",
    date: "May 2024",
    released: "2024-05-23",
    blurb:
      "Polish house veteran Miqro turns toward the sun — a warm, summer-facing groove for the long way home.",
    links: { beatport: `${BP}/sleep-alone/4570957`, youtube: `${YT}TvjQVXfmQgc` },
  },
  {
    slug: "lunar-ep",
    cat: "MSR004",
    title: "Lunar EP",
    artist: "Mazze",
    date: "Mar 2024",
    released: "2024-03-07",
    blurb:
      "A nocturnal chapter from Mazze — moonlit, melodic and made for the deepest part of the night.",
    links: { beatport: `${BP}/lunar-ep/4460074`, soundcloud: `${SC}/mazze-lunar-ep-magic-stories`, youtube: `${YT}ye-H2vqU1x8`, spotify: `${SP}5Ze3qzxS3Sa4OGzJUhaYR7` },
  },
  {
    slug: "elderose-ep",
    cat: "MSR003",
    title: "Elderose EP",
    artist: "Rafa'EL",
    date: "Feb 2024",
    released: "2024-02-01",
    blurb:
      "Rafa'EL's Magic Stories debut — warm, heartfelt organic house chasing one thing above all: emotion.",
    links: { beatport: `${BP}/elderose-ep/4412885`, soundcloud: `${SC}/rafael-elderose-ep-magic`, youtube: `${YT}bDMrWYwwB5s`, spotify: `${SP}69SdHgDXQb3yMA1yALo3lv` },
  },
  {
    slug: "tones-of-togetherness-ep",
    cat: "MSR002",
    title: "Tones of Togetherness EP",
    artist: "Mazze",
    date: "Jan 2024",
    released: "2024-01-04",
    blurb:
      "Mazze opens the year with warmth and communion — melodic, organic tones written for shared moments.",
    links: { beatport: `${BP}/tones-of-togetherness-ep/4364653`, soundcloud: `${SC}/mazze-tones-of-togetherness-ep`, youtube: `${YT}PMKvbQ3e7qg`, spotify: `${SP}6XSQSENxF6IP86XDBE1WaK` },
  },
  {
    slug: "sagala-ep",
    cat: "MSR001",
    title: "Sagala EP",
    artist: "Mazze",
    date: "Nov 2022",
    released: "2022-11-04",
    blurb:
      "Where the label's story begins — Mazze's early, melodic Sagala EP, later reimagined in Enigmatic's mesmerizing remix.",
    links: { beatport: `${BP}/sagala-ep/3892199`, soundcloud: `${SC}/mazze-sagala-ep-magic-stories`, youtube: `${YT}iBPUbh5uAjk`, spotify: `${SP}1RAnmuTHkvEHQr1LnaS86g` },
  },
];
