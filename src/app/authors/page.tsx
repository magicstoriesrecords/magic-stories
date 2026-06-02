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
// portrait: "" renders a monogram placeholder until a real portrait is added.
// Portraits still needed: slaqk, peres, mauro-masi, rafael, manu-amon,
// adria-falco, our-spaces, miqro.
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
    slug: "mazze",
    name: "Mazze",
    origin: "Founder · Magic Stories Records",
    genres: ["Organic House", "Electronica"],
    bio: [
      "Mazze is the founder of Magic Stories Records and the steady hand behind its sound — organic house built from warm pianos, patient melodies and the quiet drama of a story still unfolding.",
      "His chapters return to the same idea again and again: a record is never a finish line, only a page in something longer. From the sun-drenched calm of ‘Sunset At Kamala’ to the velvet pull of ‘Velvet Abyss’, his music carries the emotion the label was founded on.",
    ],
    portrait: "/images/artists/mazze.jpg",
    links: { instagram: "#", spotify: "#", soundcloud: "#", beatport: "#" },
  },
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
  {
    slug: "slaqk",
    name: "Slaqk",
    origin: "aka Miguel Lessey · Venezuela",
    genres: ["Organic House", "House"],
    bio: [
      "Slaqk — Miguel Lessey from Venezuela — works in the space where house music meets something more organic and weightless.",
      "His Feathers EP brought a light, airy touch to the label: productions that balance a dancefloor pulse against soft, breathing textures.",
    ],
    portrait: "",
    links: { instagram: "#", spotify: "#", soundcloud: "#", beatport: "#" },
  },
  {
    slug: "peres",
    name: "Peres",
    origin: "",
    genres: ["Organic House"],
    bio: [
      "Peres writes in the label's most reflective register. The Mirra EP is a study in mirrored, introspective melodies — organic electronica turned inward.",
      "Quiet and patient, the music makes room for the listener to fill in the rest.",
    ],
    portrait: "",
    links: { instagram: "#", spotify: "#", soundcloud: "#", beatport: "#" },
  },
  {
    slug: "mauro-masi",
    name: "Mauro Masi",
    origin: "",
    genres: ["Organic House"],
    bio: [
      "Mauro Masi brings a sunlit, melodic strain of organic house to the label, across the Face EP and the single ‘Flames’.",
      "His tracks lean on warm chords and unhurried grooves — music made for the long, golden part of the day.",
    ],
    portrait: "",
    links: { instagram: "#", spotify: "#", soundcloud: "#", beatport: "#" },
  },
  {
    slug: "rafael",
    name: "Rafa'EL",
    origin: "Poland",
    genres: ["Organic House"],
    bio: [
      "Rafa'EL is a Polish electronic producer who debuted on Magic Stories with ‘Elderose’ — a world of deep, spatial melodies and refined, layered vocals.",
      "His writing favours atmosphere and detail, and his work threads through the label both solo and alongside Mazze.",
    ],
    portrait: "",
    links: { instagram: "#", spotify: "#", soundcloud: "#", beatport: "#" },
  },
  {
    slug: "manu-amon",
    name: "Manu Amon",
    origin: "",
    genres: ["Electronica"],
    bio: [
      "Manu Amon works in electronica — hypnotic melodies and meticulously arranged spaces, as on the Dot Circle EP.",
      "His sound is built for immersion, each track a small, emotional journey.",
    ],
    portrait: "",
    links: { instagram: "#", spotify: "#", soundcloud: "#", beatport: "#" },
  },
  {
    slug: "adria-falco",
    name: "Adrià Falcó",
    origin: "Spain",
    genres: ["Organic House"],
    bio: [
      "Adrià Falcó is a Spanish producer whose Sakura EP pairs organic, blossoming textures with a reflective, nostalgic undertow.",
      "His music feels seasonal and tender — a passing moment held just long enough to notice.",
    ],
    portrait: "",
    links: { instagram: "#", spotify: "#", soundcloud: "#", beatport: "#" },
  },
  {
    slug: "our-spaces",
    name: "Our Spaces",
    origin: "Rafa'EL & Marylin · Tricity, Poland",
    genres: ["Organic House"],
    bio: [
      "Our Spaces is a Polish duo from Tricity — Rafa'EL and Marylin — whose Ordinary Vision EP turns everyday moments into captivating, melodic organic house.",
      "Two voices writing one chapter, finding the extraordinary hiding inside the ordinary.",
    ],
    portrait: "",
    links: { instagram: "#", spotify: "#", soundcloud: "#", beatport: "#" },
  },
  {
    slug: "miqro",
    name: "Miqro",
    origin: "Poland",
    genres: ["House"],
    bio: [
      "Miqro is one of the legends of the Polish house scene, and ‘Sleep Alone’ is his sun-soaked chapter for Magic Stories.",
      "It's the most house-leaning, summer-facing side of the label — music built for beaches and late, warm nights.",
    ],
    portrait: "",
    links: { instagram: "#", spotify: "#", soundcloud: "#", beatport: "#" },
  },
];

// Initials for the placeholder shown when a portrait isn't available yet.
function monogram(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

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
                      {author.portrait ? (
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
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            aria-hidden
                            className="font-serif text-7xl font-normal tracking-tight text-ink/25 md:text-8xl"
                          >
                            {monogram(author.name)}
                          </span>
                        </div>
                      )}
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
                      {author.origin && (
                        <p className="mt-2 font-sans text-sm italic text-ink/60">
                          {author.origin}
                        </p>
                      )}

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
