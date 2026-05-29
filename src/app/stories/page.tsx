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
// Each release is a chapter. Edit this array to add/update releases.
// NOTE (Dave): catalog numbers map to the covers in /public/images.
// Titles, artists, dates and links below are PLACEHOLDERS — replace with real
// data. Set a links.* value to "" to hide that platform's button.
type Links = {
  beatport?: string;
  soundcloud?: string;
  youtube?: string;
  spotify?: string;
};

type Chapter = {
  catalog: string;
  title: string;
  artist: string;
  date: string; // display string, e.g. "May 2026"
  cover: string;
  tagline: string;
  links: Links;
};

const chapters: Chapter[] = [
  {
    catalog: "MSR015",
    title: "Title — placeholder",
    artist: "Artist — placeholder",
    date: "May 2026",
    cover: "/images/ch-015.jpg",
    tagline: "A short, evocative line about this release.",
    links: { beatport: "#", soundcloud: "#", youtube: "#", spotify: "#" },
  },
  {
    catalog: "MSR014",
    title: "Title — placeholder",
    artist: "Artist — placeholder",
    date: "Apr 2026",
    cover: "/images/ch-014.jpg",
    tagline: "A short, evocative line about this release.",
    links: { beatport: "#", soundcloud: "#", youtube: "#", spotify: "#" },
  },
  {
    catalog: "MSR013",
    title: "Title — placeholder",
    artist: "Artist — placeholder",
    date: "Mar 2026",
    cover: "/images/ch-013.jpg",
    tagline: "A short, evocative line about this release.",
    links: { beatport: "#", soundcloud: "#", youtube: "#", spotify: "#" },
  },
  {
    catalog: "MSR012",
    title: "Title — placeholder",
    artist: "Artist — placeholder",
    date: "Feb 2026",
    cover: "/images/ch-012.jpg",
    tagline: "A short, evocative line about this release.",
    links: { beatport: "#", soundcloud: "#", youtube: "#", spotify: "#" },
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
            <li key={chapter.catalog}>
              <article className="group flex flex-col">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
                  <Image
                    src={chapter.cover}
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

                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <span className="font-serif text-xs uppercase tracking-[0.22em] text-ink/50">
                    {chapter.catalog}
                  </span>
                  <span className="font-sans text-xs text-ink/50">
                    {chapter.date}
                  </span>
                </div>

                <h2 className="mt-2 font-serif text-xl font-normal leading-snug tracking-tight">
                  {chapter.title}
                </h2>
                <p className="mt-1 font-sans text-sm text-ink/70">
                  {chapter.artist}
                </p>
                <p className="mt-3 font-sans text-sm italic leading-relaxed text-ink/55">
                  {chapter.tagline}
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
