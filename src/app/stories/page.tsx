import type { Metadata } from "next";
import Image from "next/image";
import {
  SpotifyIcon,
  SoundcloudIcon,
  YoutubeIcon,
  BeatportIcon,
} from "@/components/PlatformIcons";

export const metadata: Metadata = {
  title: "Stories — Magic Stories Records",
  description:
    "Every release opens a chapter. A library of melodic & organic house.",
};

// ── Chapters ────────────────────────────────────────────────────────────────
// Each release is a chapter, newest first. Covers live in
// /public/images/releases/<slug>.jpg (download script provided separately).
// Add soundcloud/youtube/spotify links per release as they become
// available ("" hides the button).
type Links = {
  beatport?: string;
  soundcloud?: string;
  youtube?: string;
  spotify?: string;
};

type Chapter = {
  slug: string;
  title: string;
  artist: string;
  date: string;
  links: Links;
};

const BP = "https://www.beatport.com/release";

const chapters: Chapter[] = [
  {
    slug: "erg-chebbi-ep",
    title: "Erg Chebbi EP",
    artist: "Modern Walking (PL)",
    date: "May 2026",
    links: { beatport: `${BP}/erg-chebbi-ep/6972085` },
  },
  {
    slug: "sunset-at-kamala-ep",
    title: "Sunset At Kamala EP",
    artist: "Mazze",
    date: "Apr 2026",
    links: { beatport: `${BP}/sunset-at-kamala-ep/6800308` },
  },
  {
    slug: "feathers-ep",
    title: "Feathers EP",
    artist: "Slaqk",
    date: "Jan 2026",
    links: { beatport: `${BP}/feathers-ep/5761789` },
  },
  {
    slug: "mirra-ep",
    title: "Mirra EP",
    artist: "Peres",
    date: "Nov 2025",
    links: { beatport: `${BP}/mirra-ep/5529093` },
  },
  {
    slug: "face-ep",
    title: "Face EP",
    artist: "Mauro Masi",
    date: "Sep 2025",
    links: { beatport: `${BP}/face-ep/5380095` },
  },
  {
    slug: "liminal-glow-ep",
    title: "Liminal Glow EP",
    artist: "Mazze & Rafa'EL",
    date: "Aug 2025",
    links: { beatport: `${BP}/liminal-glow-ep/5271502` },
  },
  {
    slug: "velvet-abyss",
    title: "Velvet Abyss",
    artist: "Mazze",
    date: "Mar 2025",
    links: { beatport: `${BP}/velvet-abyss/4995007` },
  },
  {
    slug: "dot-circle-ep",
    title: "Dot Circle EP",
    artist: "Manu Amon",
    date: "Feb 2025",
    links: { beatport: `${BP}/dot-circle-ep/4934335` },
  },
  {
    slug: "sakura-ep",
    title: "Sakura EP",
    artist: "Adrià Falcó",
    date: "Jan 2025",
    links: { beatport: `${BP}/sakura-ep/4881336` },
  },
  {
    slug: "flames",
    title: "Flames",
    artist: "Mauro Masi",
    date: "Jul 2024",
    links: { beatport: `${BP}/flames/4633083` },
  },
  {
    slug: "ordinary-vision-ep",
    title: "Ordinary Vision EP",
    artist: "Our Spaces",
    date: "Jun 2024",
    links: { beatport: `${BP}/ordinary-vision-ep/4605780` },
  },
  {
    slug: "sleep-alone",
    title: "Sleep Alone",
    artist: "Miqro",
    date: "May 2024",
    links: { beatport: `${BP}/sleep-alone/4570957` },
  },
  {
    slug: "lunar-ep",
    title: "Lunar EP",
    artist: "Mazze",
    date: "Mar 2024",
    links: { beatport: `${BP}/lunar-ep/4460074` },
  },
  {
    slug: "elderose-ep",
    title: "Elderose EP",
    artist: "Rafa'EL",
    date: "Feb 2024",
    links: { beatport: `${BP}/elderose-ep/4412885` },
  },
  {
    slug: "tones-of-togetherness-ep",
    title: "Tones of Togetherness EP",
    artist: "Mazze",
    date: "Jan 2024",
    links: { beatport: `${BP}/tones-of-togetherness-ep/4364653` },
  },
  {
    slug: "sagala-ep",
    title: "Sagala EP",
    artist: "Mazze",
    date: "Nov 2022",
    links: { beatport: `${BP}/sagala-ep/3892199` },
  },
];

const platforms = [
  { key: "beatport", label: "Beatport", Icon: BeatportIcon },
  { key: "soundcloud", label: "SoundCloud", Icon: SoundcloudIcon },
  { key: "youtube", label: "YouTube", Icon: YoutubeIcon },
  { key: "spotify", label: "Spotify", Icon: SpotifyIcon },
] as const;

export default function StoriesPage() {
  return (
    <section className="px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-xs uppercase tracking-[0.28em] text-ink/60 md:text-sm">
            Stories
          </p>
          <h1 className="mt-4 font-serif text-3xl font-normal leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
            Every release opens a chapter.
          </h1>
          <p className="mt-6 font-sans text-base leading-relaxed text-ink/75">
            A growing library of melodic &amp; organic house — each record a page
            in the same evening, caught somewhere between dusk and dream.
          </p>
        </header>

        {/* Chapters grid */}
        <ul className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-10 md:mt-20">
          {chapters.map((chapter) => (
            <li key={chapter.slug}>
              <article className="group flex flex-col">
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
                  <Image
                    src={`/images/releases/${chapter.slug}.jpg`}
                    alt={`${chapter.title} — ${chapter.artist}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  {/* Soft magic-hour veil at the foot of each cover */}
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-magic-navy/40 via-transparent to-transparent"
                  />
                </div>

                <p className="mt-5 text-center font-sans text-xs uppercase tracking-[0.22em] text-ink/50">
                  {chapter.date}
                </p>

                <h2 className="mt-2 text-center font-serif text-xl font-normal leading-snug tracking-tight">
                  {chapter.title}
                </h2>
                <p className="mt-1 text-center font-sans text-sm text-ink/70">
                  {chapter.artist}
                </p>

                {/* Listen on — glass platform buttons */}
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  {platforms.map(({ key, label, Icon }) => {
                    const href = chapter.links[key];
                    if (!href) return null;
                    return (
                      <a
                        key={key}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${label} — ${chapter.title}`}
                        title={label}
                        className="liquid-glass glass-ink flex h-11 w-11 items-center justify-center"
                      >
                        <Icon />
                      </a>
                    );
                  })}
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
