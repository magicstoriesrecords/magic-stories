import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import Parallax from "@/components/Parallax";
import {
  SpotifyIcon,
  SoundcloudIcon,
  BeatportIcon,
  InstagramIcon,
} from "@/components/PlatformIcons";

export const metadata: Metadata = {
  title: "Authors — Magic Stories Records",
  description: "Every artist writes their own chapter.",
};

// ── Authors ──────────────────────────────────────────────────────────────────
// Each artist is a long-form chapter rendered as an open-book spread.
// Portraits live in /public/images/artists/<slug>.jpg (clean portrait, no text).
// Links are placeholders ("#") until real URLs are added; "" hides a button.
// Add the rest of the roster below: Mazze, Slaqk, Peres, Mauro Masi, Rafa'EL,
// Manu Amon, Adrià Falcó, Our Spaces, Miqro.
type Author = {
  slug: string;
  name: string;
  origin: string;
  genres: string[];
  bio: string[];
  portrait: string;
  links: {
    instagram?: string;
    spotify?: string;
    soundcloud?: string;
    beatport?: string;
  };
};

const authors: Author[] = [
  {
    slug: "modern-walking",
    name: "Modern Walking",
    origin: "aka Greg Roslon · Warsaw",
    genres: ["Electronica", "Organic House", "Downtempo"],
    bio: [
      "Modern Walking — Greg Roslon from Warsaw — is a DJ and producer who blends electronica, organic house, downtempo, deep house, breaks and ambient, all carried by the warmth of classic synthesizers.",
      "His story began in the late 1990s, shaped by Warsaw's club culture and later by formative years in Leeds, where vinyl, parties and the underground helped define his sound.",
    ],
    portrait: "/images/artists/modern-walking.jpg",
    links: { instagram: "#", spotify: "#", soundcloud: "#", beatport: "#" },
  },
];

const platforms = [
  { key: "soundcloud", label: "SoundCloud", Icon: SoundcloudIcon },
  { key: "spotify", label: "Spotify", Icon: SpotifyIcon },
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "beatport", label: "Beatport", Icon: BeatportIcon },
] as const;

export default function AuthorsPage() {
  return (
    <section className="px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-20">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-xs uppercase tracking-[0.28em] text-ink/60 md:text-sm">
            Authors
          </p>
          <h1 className="mt-4 font-serif text-3xl font-normal leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
            Every artist writes their own.
          </h1>
          <p className="mt-6 font-sans text-base leading-relaxed text-ink/75">
            The voices behind the label — each one a chapter that keeps unfolding,
            release after release.
          </p>
        </header>

        {/* Author spreads */}
        <div className="mt-14 flex flex-col gap-14 md:mt-20 md:gap-20">
          {authors.map((author, i) => {
            const flip = i % 2 === 1; // zig-zag: portrait left / right alternately
            return (
              <Reveal key={author.slug}>
                <article
                  className="relative overflow-hidden rounded-3xl border border-ink/10 shadow-[0_20px_60px_-30px_rgba(28,31,82,0.5)]"
                  style={{
                    background:
                      "linear-gradient(135deg, #c4cae2 0%, #b1b2cb 55%, #a2a2bd 100%)",
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Portrait page (parallax) */}
                    <div
                      className={`relative aspect-[4/5] w-full overflow-hidden md:aspect-auto md:min-h-[30rem] ${
                        flip ? "md:order-2" : "md:order-1"
                      }`}
                      style={{ background: "#bfc4de" }}
                    >
                      <Parallax className="absolute inset-0" strength={20}>
                        <div className="relative h-full w-full scale-[1.12]">
                          <Image
                            src={author.portrait}
                            alt={author.name}
                            fill
                            sizes="(min-width: 768px) 50vw, 100vw"
                            className="object-cover"
                          />
                        </div>
                      </Parallax>
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-[#a2a2bd]/35 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#a8a8c0]/25"
                      />
                    </div>

                    {/* Text page */}
                    <div
                      className={`flex flex-col justify-center px-7 py-9 md:px-12 md:py-14 ${
                        flip ? "md:order-1" : "md:order-2"
                      }`}
                    >
                      <p className="font-serif text-xs uppercase tracking-[0.28em] text-ink/50">
                        Author
                      </p>
                      <h2 className="mt-3 font-serif text-3xl font-normal leading-[1.05] tracking-tight md:text-4xl">
                        {author.name}
                      </h2>
                      <p className="mt-2 font-sans text-sm italic text-ink/60">
                        {author.origin}
                      </p>

                      <p className="mt-5 font-serif text-[0.7rem] uppercase tracking-[0.22em] text-ink/55">
                        {author.genres.join("  ·  ")}
                      </p>

                      <div className="mt-6 space-y-4">
                        {author.bio.map((para, j) => (
                          <p
                            key={j}
                            className="font-sans text-sm leading-relaxed text-ink/80 md:text-base"
                          >
                            {para}
                          </p>
                        ))}
                      </div>

                      <div className="mt-8 flex flex-wrap gap-3">
                        {platforms.map(({ key, label, Icon }) => {
                          const href = author.links[key];
                          if (!href) return null;
                          return (
                            <a
                              key={key}
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${label} — ${author.name}`}
                              title={label}
                              className="liquid-glass glass-ink flex h-11 w-11 items-center justify-center"
                            >
                              <Icon />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
