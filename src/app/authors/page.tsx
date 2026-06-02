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
import MagicBackdrop from "@/components/MagicBackdrop";
import NightSky from "@/components/NightSky";

export const metadata: Metadata = {
  title: "Authors — Magic Stories Records",
  description: "Every artist writes their own chapter.",
};

// ── Authors ──────────────────────────────────────────────────────────────────
// Each artist is a long-form chapter rendered as an open-book spread.
// Portraits live in /public/images/artists/<slug>.jpg (clean portrait, no text).
// Links are placeholders ("#") until real URLs are added; "" hides a button.
// portrait: "" renders a monogram placeholder until a real portrait is added.
// Bios sourced from each artist's Beatport profile, rewritten in MSR voice.
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
    origin: "Founder · Szczecin, Poland",
    genres: ["Organic House", "Deep House", "Progressive"],
    bio: [
      "Mazze is a DJ and producer from Szczecin and the founder of Magic Stories Records — the steady hand behind its organic, deep and progressive sound.",
      "His productions have travelled far beyond Poland, landing on labels like Magician on Duty and Where The Heart Is and into sets at Burning Man and All Day I Dream, championed by the likes of Nick Warren and David Hohme. MSR is the home he built for that story to keep unfolding, release after release.",
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
    origin: "Silesia / Warsaw, Poland",
    genres: ["Progressive House", "Melodic House"],
    bio: [
      "Peres is a Silesian DJ and producer, now based in Warsaw — a veteran of progressive and melodic house whose career reaches back to the late 2000s.",
      "Across years on labels like LuPS Records and Mistique Music, and stages shared with Carl Cox, Hernán Cattaneo and John Digweed, he has kept an old-school, deeply melodic instinct. The Mirra EP is his reflective, mirrored chapter for Magic Stories.",
    ],
    portrait: "",
    links: { instagram: "#", spotify: "#", soundcloud: "#", beatport: "#" },
  },
  {
    slug: "mauro-masi",
    name: "Mauro Masi",
    origin: "",
    genres: ["Deep House", "Progressive House", "Organic House"],
    bio: [
      "Mauro Masi is a producer of deep and progressive house with a melodic, organic streak — a regular on labels like Consapevole, 3rd Avenue and The Purr.",
      "His work has drawn support from Hernán Cattaneo and Nick Warren, and he records as half of the duo Newcorp. For Magic Stories he turns that craft toward warm chords and unhurried, golden-hour grooves across the Face EP and ‘Flames’.",
    ],
    portrait: "",
    links: { instagram: "#", spotify: "#", soundcloud: "#", beatport: "#" },
  },
  {
    slug: "rafael",
    name: "Rafa'EL",
    origin: "Gdynia, Poland",
    genres: ["Organic House", "Melodic House"],
    bio: [
      "Rafa'EL is a DJ, producer and live performer based in Gdynia, Poland, with fourteen years in the electronic scene.",
      "He blends organic textures with melodic house, chasing one thing above all — emotion. That heartfelt instinct runs through ‘Elderose’, his Magic Stories debut, and his ongoing work alongside Mazze.",
    ],
    portrait: "",
    links: { instagram: "#", spotify: "#", soundcloud: "#", beatport: "#" },
  },
  {
    slug: "manu-amon",
    name: "Manu Amon",
    origin: "Nuremberg, Germany",
    genres: ["Electronica"],
    bio: [
      "Manu Amon is a DJ, producer, drummer and pianist from Nuremberg, Germany.",
      "That musicianship shows in his electronica — hypnotic melodies and meticulously arranged spaces, as on the Dot Circle EP, each track built for immersion.",
    ],
    portrait: "",
    links: { instagram: "#", spotify: "#", soundcloud: "#", beatport: "#" },
  },
  {
    slug: "adria-falco",
    name: "Adrià Falcó",
    origin: "Tarragona, Spain",
    genres: ["Organic House", "Melodic House", "Progressive"],
    bio: [
      "Adrià Falcó is a Spanish producer from Tarragona, classically trained on piano from the age of five at the Conservatori de Música de Tarragona.",
      "His sound moves between deep, ethnic, progressive and melodic — refined, groove-led and genre-defying, with releases on Déepalma and Café de Anatolia. The Sakura EP is his blossoming, nostalgic chapter for Magic Stories.",
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
      "Our Spaces is a duo from Tricity, Poland — Rafa'EL crafting intricate compositions, Marylin bringing voice, lyrics and violin.",
      "Together they weave captivating, emotive melodies inspired by the spirit of their coastal home, as on the Ordinary Vision EP — the extraordinary found inside the everyday.",
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
      "Miqro is one of the legends of the Polish house scene — a vinyl specialist since the late ’90s who became one of the country's most in-demand house DJs.",
      "A resident and promoter at the legendary AfterParty of Sunrise Festival, with releases reaching as far as Sony BMG Poland, he co-founded the label RANDEWU in 2017. ‘Sleep Alone’ is his sun-soaked, summer-facing chapter for Magic Stories.",
    ],
    portrait: "",
    links: { instagram: "#", spotify: "#", soundcloud: "#", beatport: "#" },
  },
  {
    slug: "robyn-balliet",
    name: "Robyn Balliet",
    origin: "Detroit / Los Angeles, USA",
    genres: ["Deep House", "Progressive"],
    bio: [
      "Robyn Balliet is a Detroit-born, Los Angeles-based producer and first-string violinist whose sound lives in deep house with progressive undertones — melodic, percussive and emotive.",
      "With releases on labels like 8Bit and Deepalma and stages shared with John Digweed, Sasha and Nora En Pure, she lent her groove to Magic Stories with her remix of Adrià Falcó's ‘Sakura’.",
    ],
    portrait: "",
    links: { instagram: "#", spotify: "#", soundcloud: "#", beatport: "#" },
  },
  {
    slug: "enigmatic",
    name: "Enigmatic",
    origin: "",
    genres: ["Melodic House", "Organic House"],
    bio: [
      "Enigmatic is a DJ, producer and promoter — a dreamy tastemaker with releases on labels like Bar25, Hoomidaas and Melody of the Soul, and a frequent collaborator of Rafa'EL.",
      "He brought his mesmerizing, melodic touch to Magic Stories with his remix of Mazze's ‘Sagala’.",
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
    <section
      className="relative isolate overflow-hidden px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-20"
      style={{ background: "linear-gradient(180deg,#15142f 0%,#1b1942 50%,#211d4f 100%)" }}
    >
      {/* Base fallback: procedural sky (shows if the photo is missing). */}
      <NightSky />
      {/* Real sky photo — drop the file at /public/images/authors-sky.jpg. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/images/authors-sky.png')" }}
      />
      {/* Gentle darkening for text contrast. */}
      <div aria-hidden className="absolute inset-0 -z-0 bg-[#141230]/25" />
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-xs uppercase tracking-[0.28em] text-cream/70 md:text-sm">
            Authors
          </p>
          <h1 className="mt-4 font-serif text-3xl font-normal leading-[1.1] tracking-tight text-cream sm:text-4xl md:text-5xl">
            Every artist writes their own.
          </h1>
          <p className="mt-6 font-sans text-base leading-relaxed text-cream/75">
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
                <article className="glass-card relative overflow-hidden rounded-3xl">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Portrait page (parallax) */}
                    <div
                      className={`relative aspect-[4/5] w-full overflow-hidden md:aspect-auto md:min-h-[30rem] ${
                        flip ? "md:order-2" : "md:order-1"
                      }`}
                      style={{ background: "#171633" }}
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
                        <>
                          <MagicBackdrop seed={author.slug} />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span
                              aria-hidden
                              className="font-display text-7xl font-normal tracking-tight text-cream/85 md:text-8xl"
                              style={{ textShadow: "0 0 34px rgba(232,184,144,0.55)" }}
                            >
                              {monogram(author.name)}
                            </span>
                          </div>
                        </>
                      )}
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-[#141230]/55 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#141230]/35"
                      />
                    </div>

                    {/* Text page */}
                    <div
                      className={`flex flex-col justify-center px-7 py-9 md:px-12 md:py-14 ${
                        flip ? "md:order-1" : "md:order-2"
                      }`}
                    >
                      <p className="font-serif text-xs uppercase tracking-[0.28em] text-cream/55">
                        Author
                      </p>
                      <h2 className="mt-3 font-serif text-3xl font-normal leading-[1.05] tracking-tight text-cream md:text-4xl">
                        {author.name}
                      </h2>
                      {author.origin && (
                        <p className="mt-2 font-sans text-sm italic text-cream/65">
                          {author.origin}
                        </p>
                      )}

                      <p className="mt-5 font-serif text-[0.7rem] uppercase tracking-[0.22em] text-warm/85">
                        {author.genres.join("  ·  ")}
                      </p>

                      <div className="mt-6 space-y-4">
                        {author.bio.map((para, j) => (
                          <p
                            key={j}
                            className="font-sans text-sm leading-relaxed text-cream/80 md:text-base"
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
                              className="liquid-glass flex h-11 w-11 items-center justify-center"
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
