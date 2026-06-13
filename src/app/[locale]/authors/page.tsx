import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import Parallax from "@/components/Parallax";
import {
  SpotifyIcon,
  SoundcloudIcon,
  BeatportIcon,
  InstagramIcon,
  FacebookIcon,
} from "@/components/PlatformIcons";
import MagicBackdrop from "@/components/MagicBackdrop";
import NightSky from "@/components/NightSky";
import { buildPageMeta } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.authors" });
  return buildPageMeta({
    locale,
    path: "/authors",
    title: t("title"),
    description: t("description"),
  });
}

// ── Authors ──────────────────────────────────────────────────────────────────
// Each artist is a long-form chapter rendered as an open-book spread.
// Portraits live in /public/images/artists/<slug>.jpg (clean portrait, no text).
// Links are real platform URLs; an omitted/empty key hides that button.
// portrait: "" renders a monogram placeholder until a real portrait is added.
// Bios sourced from each artist's Beatport profile, rewritten in MSR voice.
type Author = {
  slug: string;
  name: string;
  origin: string;
  originPl?: string; // Polish origin line (omit if identical)
  genres: string[];
  bio: string[];
  bioPl: string[]; // Polish version of the bio paragraphs
  portrait: string;
  cutout?: boolean; // transparent PNG cut-out (no background)
  links: {
    facebook?: string;
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
    originPl: "Założyciel · Szczecin",
    genres: ["Organic House", "Deep House", "Progressive"],
    bio: [
      "Mazze is a DJ and producer from Szczecin and the founder of Magic Stories Records, the steady hand behind its organic, deep and progressive sound.",
      "His productions have travelled far beyond Poland, landing on labels like Magician on Duty and Where The Heart Is and into sets at Burning Man and All Day I Dream, championed by the likes of Nick Warren and David Hohme. MSR is the home he built for that story to keep unfolding, release after release.",
    ],
    bioPl: [
      "Mazze to DJ i producent ze Szczecina, założyciel Magic Stories Records, pewna ręka stojąca za jej organicznym, głębokim i progresywnym brzmieniem.",
      "Jego produkcje zawędrowały daleko poza Polskę, na labele takie jak Magician on Duty i Where The Heart Is oraz do setów na Burning Man i All Day I Dream, wspierane przez Nicka Warrena czy Davida Hohme. MSR to dom, który zbudował, by ta historia rozwijała się dalej, wydanie po wydaniu.",
    ],
    portrait: "/images/artists/dj-mazze.png",
    cutout: true,
    links: {
      facebook: "https://www.facebook.com/Mazzemusic",
      instagram: "https://www.instagram.com/mazze9/",
      spotify: "https://open.spotify.com/artist/0NlHo4o0X08MfypPJxlm48",
      soundcloud: "https://soundcloud.com/mazzemusic",
      beatport: "https://www.beatport.com/artist/mazze/323552",
    },
  },
  {
    slug: "rafael",
    name: "Rafa'EL",
    origin: "Gdynia, Poland",
    originPl: "Gdynia",
    genres: ["Organic House", "Melodic House"],
    bio: [
      "Rafa'EL is a DJ, producer and live performer based in Gdynia, Poland, with fourteen years in the electronic scene.",
      "He blends organic textures with melodic house, chasing one thing above all, emotion. That heartfelt instinct runs through ‘Elderose’, his Magic Stories debut, and his ongoing work alongside Mazze.",
    ],
    bioPl: [
      "Rafa'EL to DJ, producent i artysta live z Gdyni, od czternastu lat obecny na scenie elektronicznej.",
      "Łączy organiczne faktury z melodic house, goniąc przede wszystkim jedno, emocje. Ten płynący z serca instynkt słychać w 'Elderose', jego debiucie dla Magic Stories, i w dalszej pracy u boku Mazze.",
    ],
    portrait: "/images/artists/rafa-el.png",
    cutout: true,
    links: {
      facebook: "https://www.facebook.com/raf.musicman",
      spotify: "https://open.spotify.com/artist/1UGSixfO4Tyh1HncCf2TlD",
      soundcloud: "https://soundcloud.com/rafael-music",
      beatport: "https://www.beatport.com/artist/rafael/329366",
    },
  },
  {
    slug: "miqro",
    name: "Miqro",
    origin: "Poland",
    originPl: "Polska",
    genres: ["House"],
    bio: [
      "Miqro is one of the legends of the Polish house scene, a vinyl specialist since the late ’90s who became one of the country's most in-demand house DJs.",
      "A resident and promoter at the legendary AfterParty of Sunrise Festival, with releases reaching as far as Sony BMG Poland, he co-founded the label RANDEWU in 2017. ‘Sleep Alone’ is his sun-soaked, summer-facing chapter for Magic Stories.",
    ],
    bioPl: [
      "Miqro to jedna z legend polskiej sceny house, winylowy specjalista od końca lat 90., który stał się jednym z najbardziej rozchwytywanych house'owych DJ-ów w kraju.",
      "Rezydent i promotor legendarnego AfterParty Sunrise Festival, z wydaniami sięgającymi Sony BMG Poland; w 2017 roku współzałożył label RANDEWU. 'Sleep Alone' to jego słoneczny, letni rozdział dla Magic Stories.",
    ],
    portrait: "/images/artists/dj-miqro.png",
    cutout: true,
    links: {
      facebook: "https://www.facebook.com/djMIQRO",
      instagram: "https://www.instagram.com/miqro.pl",
      spotify: "https://open.spotify.com/artist/5DrihC1Hr8u1gSi3AlGyqx",
      soundcloud: "https://soundcloud.com/miqro",
      beatport: "https://www.beatport.com/artist/miqro/129763",
    },
  },
  {
    slug: "peres",
    name: "Peres",
    origin: "Silesia / Warsaw, Poland",
    originPl: "Śląsk / Warszawa",
    genres: ["Progressive House", "Melodic House"],
    bio: [
      "Peres is a Silesian DJ and producer, now based in Warsaw, a veteran of progressive and melodic house whose career reaches back to the late 2000s.",
      "Across years on labels like LuPS Records and Mistique Music, and stages shared with Carl Cox, Hernán Cattaneo and John Digweed, he has kept an old-school, deeply melodic instinct. The Mirra EP is his reflective, mirrored chapter for Magic Stories.",
    ],
    bioPl: [
      "Peres to śląski DJ i producent, dziś mieszkający w Warszawie, weteran progressive i melodic house, którego kariera sięga końcówki pierwszej dekady XXI wieku.",
      "Przez lata na labelach takich jak LuPS Records i Mistique Music oraz na scenach dzielonych z Carlem Coxem, Hernánem Cattaneo i Johnem Digweedem zachował old-schoolowy, głęboko melodyjny instynkt. Mirra EP to jego refleksyjny, lustrzany rozdział dla Magic Stories.",
    ],
    portrait: "/images/artists/dj-peres.png",
    cutout: true,
    links: {
      facebook: "https://www.facebook.com/Peresdj",
      instagram: "https://www.instagram.com/peres_music",
      spotify: "https://open.spotify.com/artist/6RcGbsoD1gLadO1Vrhb8OK",
      soundcloud: "https://soundcloud.com/peres",
      beatport: "https://www.beatport.com/artist/peres/12763",
    },
  },
  {
    slug: "slaqk",
    name: "Slaqk",
    origin: "aka Miguel Lessey · Venezuela",
    originPl: "aka Miguel Lessey · Wenezuela",
    genres: ["Organic House", "House"],
    bio: [
      "Slaqk, Miguel Lessey from Venezuela, works in the space where house music meets something more organic and weightless.",
      "His Feathers EP brought a light, airy touch to the label: productions that balance a dancefloor pulse against soft, breathing textures.",
    ],
    bioPl: [
      "Slaqk, Miguel Lessey z Wenezueli, porusza się w przestrzeni, gdzie house spotyka coś bardziej organicznego i nieważkiego.",
      "Jego Feathers EP wniosła do wytwórni lekki, zwiewny dotyk: produkcje, które równoważą puls parkietu miękkimi, oddychającymi fakturami.",
    ],
    portrait: "/images/artists/dj-slaqk.png",
    cutout: true,
    links: {
      instagram: "https://www.instagram.com/slaqk",
      spotify: "https://open.spotify.com/artist/6dJawdKmaoNjzZgL99PhOy",
      soundcloud: "https://soundcloud.com/slaqk",
      beatport: "https://www.beatport.com/artist/slaqk/748229",
    },
  },
  {
    slug: "mauro-masi",
    name: "Mauro Masi",
    origin: "Argentina",
    originPl: "Argentyna",
    genres: ["Deep House", "Progressive House", "Organic House"],
    bio: [
      "Mauro Masi is a producer of deep and progressive house with a melodic, organic streak, a regular on labels like Consapevole, 3rd Avenue and The Purr.",
      "His work has drawn support from Hernán Cattaneo and Nick Warren, and he records as half of the duo Newcorp. For Magic Stories he turns that craft toward warm chords and unhurried, golden-hour grooves across the Face EP and ‘Flames’.",
    ],
    bioPl: [
      "Mauro Masi to producent deep i progressive house z melodyjną, organiczną żyłką, stały gość labeli takich jak Consapevole, 3rd Avenue i The Purr.",
      "Jego muzykę wspierali Hernán Cattaneo i Nick Warren; nagrywa też jako połowa duetu Newcorp. Dla Magic Stories kieruje to rzemiosło ku ciepłym akordom i niespiesznym groove'om złotej godziny, na Face EP i singlu 'Flames'.",
    ],
    portrait: "/images/artists/mauro-masi.png",
    cutout: true,
    links: {
      facebook: "https://www.facebook.com/mauromasi.Dj.producer",
      instagram: "https://www.instagram.com/mauro.masi.music/",
      soundcloud: "https://soundcloud.com/mauromasimusic",
      beatport: "https://www.beatport.com/artist/mauro-masi/792827",
    },
  },
  {
    slug: "modern-walking",
    name: "Modern Walking",
    origin: "aka Greg Roslon · Warsaw",
    originPl: "aka Greg Roslon · Warszawa",
    genres: ["Electronica", "Organic House", "Downtempo"],
    bio: [
      "Modern Walking, Greg Roslon from Warsaw, is a DJ and producer who blends electronica, organic house, downtempo, deep house, breaks and ambient, all carried by the warmth of classic synthesizers.",
      "His story began in the late 1990s, shaped by Warsaw's club culture and later by formative years in Leeds, where vinyl, parties and the underground helped define his sound.",
    ],
    bioPl: [
      "Modern Walking, Greg Roslon z Warszawy, to DJ i producent łączący electronikę, organic house, downtempo, deep house, breaki i ambient, niesione ciepłem klasycznych syntezatorów.",
      "Jego historia zaczęła się pod koniec lat 90., ukształtowana przez warszawską kulturę klubową, a później przez formacyjne lata w Leeds, gdzie winyle, imprezy i underground pomogły zdefiniować jego brzmienie.",
    ],
    portrait: "/images/artists/modern-walking.png",
    cutout: true,
    links: {
      facebook: "https://www.facebook.com/profile.php?id=100067740896015",
      spotify: "https://open.spotify.com/artist/3OVP0HzUg08EKbAYQJSe4p",
      soundcloud: "https://on.soundcloud.com/Fic7NTwa08DNgDFOwc",
      beatport: "https://www.beatport.com/artist/modern-walking-pl/1044338",
    },
  },
  {
    slug: "enigmatic",
    name: "Enigmatic",
    origin: "",
    genres: ["Melodic House", "Organic House"],
    bio: [
      "Enigmatic is a DJ, producer and promoter, a dreamy tastemaker with releases on labels like Bar25, Hoomidaas and Melody of the Soul, and a frequent collaborator of Rafa'EL.",
      "He brought his mesmerizing, melodic touch to Magic Stories with his remix of Mazze's ‘Sagala’.",
    ],
    bioPl: [
      "Enigmatic to DJ, producent i promotor, rozmarzony tastemaker z wydaniami na labelach takich jak Bar25, Hoomidaas i Melody of the Soul, częsty współpracownik Rafa'ELa.",
      "Swój hipnotyzujący, melodyjny dotyk wniósł do Magic Stories remiksem 'Sagali' Mazze.",
    ],
    portrait: "/images/artists/dj-enigmatic.png",
    cutout: true,
    links: {
      facebook: "https://www.facebook.com/EnigmaticMusic",
      instagram: "https://www.instagram.com/enigmati_c",
      spotify: "https://open.spotify.com/artist/7Dp0ZMnYTM3JJV5ccGLX4A",
      soundcloud: "https://soundcloud.com/enigmatictapes",
      beatport: "https://www.beatport.com/artist/enigmatic/28769",
    },
  },
  {
    slug: "our-spaces",
    name: "Our Spaces",
    origin: "Rafa'EL & Marylin · Tricity, Poland",
    originPl: "Rafa'EL & Marylin · Trójmiasto",
    genres: ["Organic House"],
    bio: [
      "Our Spaces is a duo from Tricity, Poland, Rafa'EL crafting intricate compositions, Marylin bringing voice, lyrics and violin.",
      "Together they weave captivating, emotive melodies inspired by the spirit of their coastal home, as on the Ordinary Vision EP, the extraordinary found inside the everyday.",
    ],
    bioPl: [
      "Our Spaces to duet z Trójmiasta, Rafa'EL tka misterne kompozycje, a Marylin wnosi głos, słowa i skrzypce.",
      "Razem snują urzekające, pełne emocji melodie inspirowane duchem ich nadmorskiego domu, jak na Ordinary Vision EP, gdzie niezwykłość kryje się w codzienności.",
    ],
    portrait: "/images/artists/our-spaces.png",
    cutout: true,
    links: {
      facebook: "https://www.facebook.com/ourspacesmusic",
      instagram: "https://www.instagram.com/Ourspaces.music",
      beatport: "https://www.beatport.com/artist/our-spaces/1215040",
    },
  },
  {
    slug: "adria-falco",
    name: "Adrià Falcó",
    origin: "Tarragona, Spain",
    originPl: "Tarragona, Hiszpania",
    genres: ["Organic House", "Melodic House", "Progressive"],
    bio: [
      "Adrià Falcó is a Spanish producer from Tarragona, classically trained on piano from the age of five at the Conservatori de Música de Tarragona.",
      "His sound moves between deep, ethnic, progressive and melodic, refined, groove-led and genre-defying, with releases on Déepalma and Café de Anatolia. The Sakura EP is his blossoming, nostalgic chapter for Magic Stories.",
    ],
    bioPl: [
      "Adrià Falcó to hiszpański producent z Tarragony, od piątego roku życia klasycznie kształcony na fortepianie w Conservatori de Música de Tarragona.",
      "Jego brzmienie porusza się między deep, ethnic, progressive i melodic, wyrafinowane, oparte na groovie i wymykające się gatunkom, z wydaniami na Déepalma i Café de Anatolia. Sakura EP to jego rozkwitający, nostalgiczny rozdział dla Magic Stories.",
    ],
    portrait: "/images/artists/adria-falco.png",
    cutout: true,
    links: {
      facebook: "https://www.facebook.com/adriafalcomusic/",
      spotify: "https://open.spotify.com/artist/1bwmUz4XLI9rdyvGyTs9Qp",
      soundcloud: "https://soundcloud.com/adriafalcomusic",
      beatport: "https://www.beatport.com/artist/adria-falco/961872",
    },
  },
  {
    slug: "robyn-balliet",
    name: "Robyn Balliet",
    origin: "Detroit / Los Angeles, USA",
    originPl: "Detroit / Los Angeles, USA",
    genres: ["Deep House", "Progressive"],
    bio: [
      "Robyn Balliet is a Detroit-born, Los Angeles-based producer and first-string violinist whose sound lives in deep house with progressive undertones, melodic, percussive and emotive.",
      "With releases on labels like 8Bit and Deepalma and stages shared with John Digweed, Sasha and Nora En Pure, she lent her groove to Magic Stories with her remix of Adrià Falcó's ‘Sakura’.",
    ],
    bioPl: [
      "Robyn Balliet to urodzona w Detroit, a mieszkająca w Los Angeles producentka i pierwsza skrzypaczka, jej brzmienie żyje w deep housie z progresywnymi podtekstami: melodyjne, perkusyjne i pełne emocji.",
      "Z wydaniami na labelach takich jak 8Bit i Deepalma oraz scenami dzielonymi z Johnem Digweedem, Sashą i Norą En Pure, swój groove podarowała Magic Stories remiksem 'Sakury' Adrià Falcó.",
    ],
    portrait: "/images/artists/robyn-balliet.png",
    cutout: true,
    links: {
      facebook: "https://www.facebook.com/robyn.balliet",
      spotify: "https://open.spotify.com/artist/1c2i1KUDT3ghnZUy0cKmS5",
      soundcloud: "https://soundcloud.com/robynballiet",
      beatport: "https://www.beatport.com/artist/robyn-balliet/1147425",
    },
  },
  {
    slug: "manu-amon",
    name: "Manu Amon",
    origin: "Nuremberg, Germany",
    originPl: "Norymberga, Niemcy",
    genres: ["Electronica"],
    bio: [
      "Manu Amon is a DJ, producer, drummer and pianist from Nuremberg, Germany.",
      "That musicianship shows in his electronica, hypnotic melodies and meticulously arranged spaces, as on the Dot Circle EP, each track built for immersion.",
    ],
    bioPl: [
      "Manu Amon to DJ, producent, perkusista i pianista z Norymbergi.",
      "Tę muzykalność słychać w jego electronice, hipnotyczne melodie i pieczołowicie zaaranżowane przestrzenie, jak na Dot Circle EP, gdzie każdy utwór zbudowany jest do pełnego zanurzenia.",
    ],
    portrait: "/images/artists/manu-amon.png",
    cutout: true,
    links: {
      facebook: "https://www.facebook.com/manuamonmusic",
      instagram: "https://www.instagram.com/manu_amon_music",
      soundcloud: "https://soundcloud.com/manu_amon",
    },
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
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
] as const;

export default async function AuthorsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("authors");
  return (
    <section
      className="relative isolate overflow-hidden px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-20"
      style={{ background: "linear-gradient(180deg,#15142f 0%,#1b1942 50%,#211d4f 100%)" }}
    >
      {/* Fixed viewport-sized sky backdrop: own compositor layer →
          crisp photo + smooth scroll (no background-attachment:fixed jank). */}
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
        <NightSky />
      {/* Real sky photo — drop the file at /public/images/authors-sky.jpg. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/authors-sky.png')" }}
      />
      {/* Gentle darkening for text contrast. */}
      <div aria-hidden className="absolute inset-0 -z-0 bg-[#141230]/25" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-xs uppercase tracking-[0.28em] text-cream/70 md:text-sm">
            {t("kicker")}
          </p>
          <h1 className="mt-4 font-serif text-3xl font-normal leading-[1.1] tracking-tight text-cream sm:text-4xl md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-6 font-sans text-base leading-relaxed text-cream/75">
            {t("lead")}
          </p>
        </header>

        {/* Author spreads */}
        <div className="mt-14 flex flex-col gap-14 md:mt-20 md:gap-20">
          {authors.map((author, i) => {
            const flip = i % 2 === 1; // zig-zag: portrait left / right alternately
            return (
              <Reveal key={author.slug}>
                <article id={author.slug} className="glass-card relative overflow-hidden rounded-3xl scroll-mt-28">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Portrait page (parallax) */}
                    <div
                      className={`relative w-full overflow-hidden md:aspect-auto md:min-h-[30rem] ${
                        author.cutout ? "aspect-[3/2]" : "aspect-[4/5]"
                      } ${flip ? "md:order-2" : "md:order-1"}`}
                      style={author.cutout ? undefined : { background: "#171633" }}
                    >
                      {author.portrait ? (
                        <Parallax className="absolute inset-0" strength={20}>
                          <div className={`relative h-full w-full ${author.cutout ? "" : "scale-[1.12]"}`}>
                            <Image
                              src={author.portrait}
                              alt={author.name}
                              fill
                              sizes="(min-width: 768px) 50vw, 100vw"
                              className={author.cutout ? "object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] [mask-image:linear-gradient(to_bottom,black_70%,transparent_99%)] [-webkit-mask-image:linear-gradient(to_bottom,black_70%,transparent_99%)] md:[mask-image:none] md:[-webkit-mask-image:none]" : "object-cover"}
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
                      {!author.cutout && (
                        <div
                          aria-hidden
                          className="absolute inset-0 bg-gradient-to-t from-[#141230]/55 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#141230]/35"
                        />
                      )}
                    </div>

                    {/* Text page */}
                    <div
                      className={`flex flex-col justify-center px-7 py-9 md:px-12 md:py-14 ${
                        flip ? "md:order-1" : "md:order-2"
                      }`}
                    >
                      <p className="font-serif text-xs uppercase tracking-[0.28em] text-cream/55">
                        {t("artistLabel")}
                      </p>
                      <h2 className="mt-3 font-serif text-3xl font-normal leading-[1.05] tracking-tight text-cream md:text-4xl">
                        {author.name}
                      </h2>
                      {author.origin && (
                        <p className="mt-2 font-sans text-sm italic text-cream/65">
                          {locale === "pl" ? author.originPl ?? author.origin : author.origin}
                        </p>
                      )}

                      <p className="mt-5 font-serif text-[0.7rem] uppercase tracking-[0.22em] text-warm/85">
                        {author.genres.join("  ·  ")}
                      </p>

                      <div className="mt-6 space-y-4">
                        {(locale === "pl" ? author.bioPl : author.bio).map((para, j) => (
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
