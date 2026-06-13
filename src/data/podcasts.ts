// ── Podcasts ──────────────────────────────────────────────────────────────────
// The Magic Stories Records podcast series (guest & founder mixes).
// Source: https://soundcloud.com/magicstoriesrec/sets/magic-stories-records-podcasts
// Covers are served straight from the SoundCloud CDN (t500x500). `artists` is the
// set's tracklist line-up, taken from each episode's SoundCloud description.
// Order: newest first.
export type Podcast = {
  code: string; // e.g. "MSRP 012"
  episode: number; // 12
  guest: string; // who mixed the episode
  cover: string; // local file in /public/images/podcasts (export at 3:2, e.g. 1500x1000)
  blurb: string; // 1-2 sentence summary (EN)
  blurbPl: string; // Polish version of the summary
  artists: string[]; // line-up heard in the set
  soundcloud: string; // link to the episode
};

export const podcasts: Podcast[] = [
  {
    code: "MSRP 012",
    episode: 12,
    guest: "Mazze",
    cover: "/images/podcasts/msrp-012.jpg",
    blurb:
      "The latest chapter of the series, mixed by founder Mazze, a fresh journey through the Magic Stories sound.",
    blurbPl:
      "Najnowszy rozdział serii w miksie założyciela, Mazze zabiera nas w świeżą podróż przez brzmienie Magic Stories.",
    artists: [
      "&Friends",
      "Joseph",
      "Shimza",
      "Ewerseen",
      "David Mackay",
      "Auguxt",
      "Dougwav",
      "Slaqk",
      "Miqro",
      "Milkwish",
      "Mazze",
      "Fernando Olaya",
      "Festa Bros",
      "Anhauser",
      "Modern Walking",
    ],
    soundcloud:
      "https://soundcloud.com/magicstoriesrec/magic-stories-podcast-mazze-1",
  },
  {
    code: "MSRP 011",
    episode: 11,
    guest: "Mazze",
    cover: "/images/podcasts/msrp-011.jpg",
    blurb:
      "Mazze returns with a brand-new journey, close your eyes, follow the melodies, and let the story unfold.",
    blurbPl:
      "Mazze wraca z zupełnie nową podróżą, zamknij oczy, podążaj za melodiami i pozwól historii się rozwinąć.",
    artists: [
      "Kontaktees",
      "Loui & Scibi",
      "Mauro Masi",
      "Rafa'EL & Mazze",
      "Erdi Irmak",
      "Melarmony",
      "Dulus & Obbie",
      "Pete Tong",
      "Nathan Katz",
      "Newman (I Love)",
      "Sébastien Léger & Roy Rosenfeld",
    ],
    soundcloud:
      "https://soundcloud.com/magicstoriesrec/magic-stories-podcast-mazze",
  },
  {
    code: "MSRP 010",
    episode: 10,
    guest: "Robyn Balliet",
    cover: "/images/podcasts/msrp-010.jpg",
    blurb:
      "US producer Robyn Balliet, who recently remixed an MSR release, leads a special tenth-episode journey of hypnotic grooves and warm melodies.",
    blurbPl:
      "Amerykańska producentka Robyn Balliet, autorka niedawnego remiksu dla MSR, prowadzi wyjątkowy dziesiąty odcinek, hipnotyczne groove'y i ciepłe melodie.",
    artists: [
      "Hardy Heller & Alex Connors",
      "Julian Millan",
      "Gus Jerez",
      "De' Saint",
      "Robyn Balliet",
      "Sebastian Bach",
      "Flowers On Monday",
      "Rick Stereo",
      "Miqro",
      "Nick Mits Kry (IT)",
      "Sebb Junior",
      "Mark Maxwell",
      "Lovless Youth",
      "Adrià Falcó",
    ],
    soundcloud:
      "https://soundcloud.com/magicstoriesrec/magic-stories-podcast-robyn",
  },
  {
    code: "MSRP 009",
    episode: 9,
    guest: "Adrià Falcó",
    cover: "/images/podcasts/msrp-009.jpg",
    blurb:
      "Spanish producer Adrià Falcó takes the reins, curating a breathtaking one-hour set of deep melodies and hypnotic rhythms.",
    blurbPl:
      "Hiszpański producent Adrià Falcó przejmuje stery, układając zapierający dech godzinny set głębokich melodii i hipnotycznych rytmów.",
    artists: [
      "Double Touch",
      "Adrià Falcó",
      "Pambouk",
      "Leo Lauretti & Cosmaks",
      "Greg Ochman",
      "Hermanez",
      "Monkey Safari",
      "Barbour",
      "Mass Digital",
      "Hammer",
      "Oliver Schories",
    ],
    soundcloud: "https://soundcloud.com/magicstoriesrec/magic-stories-podcast-adria",
  },
  {
    code: "MSRP 008",
    episode: 8,
    guest: "Mauro Masi",
    cover: "/images/podcasts/msrp-008.jpg",
    blurb:
      "Argentinian deep and progressive talent Mauro Masi takes over for episode eight, melodic, organic, golden-hour grooves.",
    blurbPl:
      "Argentyński talent deep i progressive Mauro Masi przejmuje ósmy odcinek, melodyjne, organiczne groove'y złotej godziny.",
    artists: [
      "Mauro Masi",
      "Ilias Katelanos",
      "Plecta",
      "Makebo",
      "Julian Liander",
      "Talemates",
      "Double Touch",
      "Maxxim",
      "Amonita",
      "Onen",
      "Fer Mora",
    ],
    soundcloud:
      "https://soundcloud.com/magicstoriesrec/magic-stories-podcast-mauro-masi-msrp-008",
  },
  {
    code: "MSRP 007",
    episode: 7,
    guest: "Mazze",
    cover: "/images/podcasts/msrp-007.jpg",
    blurb:
      "Founder Mazze returns with an expansive seventh chapter spanning organic, melodic and deep house.",
    blurbPl:
      "Założyciel Mazze wraca z rozległym siódmym rozdziałem, rozpiętym między organic, melodic i deep house.",
    artists: [
      "Christian Löffler",
      "Our Spaces",
      "Flowers On Monday",
      "Alley Sa",
      "Mauro Masi",
      "Anya Nova",
      "Adrià Falcó",
      "EMBRZ",
      "Erdi Irmak & Paul Losev",
      "Beije",
      "Bun Xapa",
      "Moojo",
      "Starving Yet Full",
      "Sparrow & Barbossa",
      "Francis Coletta",
      "Emanuele Esposito",
      "Gianni Romano",
      "Helen Tesfazghi",
      "Maz (BR)",
      "Antdot",
      "Djuma Soundsystem & Yann Coppier ft. King Ayisoba",
      "Nes Mburu",
      "Alex Wann",
      "Shermanology",
      "Rudimental",
      "Electronic Youth",
      "Matt Beazant",
    ],
    soundcloud:
      "https://soundcloud.com/magicstoriesrec/magic-stories-podcast-mazze-msrp-007",
  },
  {
    code: "MSRP 006",
    episode: 6,
    guest: "Pequeño",
    cover: "/images/podcasts/msrp-006.jpg",
    blurb:
      "A holiday special from Poznań's DJ Pequeño, organic house rhythms and beautiful melodies, by way of Ibiza Global Radio.",
    blurbPl:
      "Świąteczny odcinek specjalny od poznańskiego DJ-a Pequeño, rytmy organic house i piękne melodie, prosto z anteny Ibiza Global Radio.",
    artists: [
      "Mauro Masi",
      "Ootkeen",
      "Matías Delóngaro & M-Sol DEEP",
      "Soul Engineers",
      "Giovanny Aparicio & Yura Aparicio",
      "Maz (BR) & Antdot & Letícia Fialho",
      "AVÖ",
      "Syon",
      "QT-HIGH",
      "Cuneyt Cilingiroglu",
      "LevyM",
      "Kosa",
      "Adari",
    ],
    soundcloud:
      "https://soundcloud.com/magicstoriesrec/magic-stories-podcast-pequeno-msrp-006",
  },
  {
    code: "MSRP 005",
    episode: 5,
    guest: "Tommy Gustav",
    cover: "/images/podcasts/msrp-005.jpg",
    blurb:
      "Tommy Gustav (aka Groove Cocktail), co-founder of Taste The Music, brings an hour of distinctive electronic grooves.",
    blurbPl:
      "Tommy Gustav (aka Groove Cocktail), współzałożyciel Taste The Music, przynosi godzinę charakterystycznych elektronicznych groove'ów.",
    artists: [
      "Massh & Adam Port",
      "Kashovski",
      "Ajna",
      "Maz & Vxsion",
      "Baron",
      "Demaya",
      "Max Meraki",
    ],
    soundcloud:
      "https://soundcloud.com/magicstoriesrec/magic-stories-podcast-tommy-gustav-msrp-005",
  },
  {
    code: "MSRP 004",
    episode: 4,
    guest: "Milkwish",
    cover: "/images/podcasts/msrp-004.jpg",
    blurb:
      "Polish producer Milkwish, released on Anjunabeats, Armada and Colorize, explores the deeper, more organic side of his sound.",
    blurbPl:
      "Polski producent Milkwish, z wydaniami w Anjunabeats, Armadzie i Colorize, eksploruje głębszą, bardziej organiczną stronę swojego brzmienia.",
    artists: [
      "Missfeat",
      "Den Macklin",
      "Andromedha",
      "Wolfframm",
      "Namatjira",
      "Max Wexem",
      "Fuenka",
      "Das Pharaoh",
      "Tryger",
    ],
    soundcloud:
      "https://soundcloud.com/magicstoriesrec/magic-stories-podcast-milkwish-msrp-004",
  },
  {
    code: "MSRP 003",
    episode: 3,
    guest: "NeeVald",
    cover: "/images/podcasts/msrp-003.jpg",
    blurb:
      "A legend of the Polish club scene, DJ NeeVald delivers a set inspired by his iconic 'Sexy Sunday' series on Ibiza Global Radio.",
    blurbPl:
      "Legenda polskiej sceny klubowej, DJ NeeVald, dostarcza set inspirowany swoim kultowym cyklem 'Sexy Sunday' z Ibiza Global Radio.",
    artists: [
      "M.O.S",
      "Trilucid",
      "Kiko Navarro",
      "M.E.M.O",
      "Magneizm",
      "DJ Marika",
      "Jane Ryse",
      "Krasa Rosa",
      "Mars Monero",
      "Mazze",
    ],
    soundcloud:
      "https://soundcloud.com/magicstoriesrec/magic-stories-podcast-neevald",
  },
  {
    code: "MSRP 002",
    episode: 2,
    guest: "Rafa'EL",
    cover: "/images/podcasts/msrp-002.jpg",
    blurb:
      "The series returns with Rafa'EL, fresh off his 'Elderose' debut, a warm, melodic organic-house tale.",
    blurbPl:
      "Seria wraca z Rafa'ELem, świeżo po debiutanckiej 'Elderose', ciepła, melodyjna opowieść organic house.",
    artists: [
      "Sam Rose",
      "Eryc Karezza",
      "Alex Panchenco",
      "Coastlines",
      "Trilucid",
      "Return To Saturn",
      "Mazze",
      "Greg Ochman",
      "Awka",
      "GusGus",
      "Koelle",
      "Sam Martin",
      "Little Foot",
      "Rebel Of Sleep",
      "Jack Willard",
      "William Rizz",
      "Solanca",
      "Rafa'EL",
    ],
    soundcloud:
      "https://soundcloud.com/magicstoriesrec/magic-stories-podcast-rafael-msrp-002",
  },
  {
    code: "MSRP 001",
    episode: 1,
    guest: "Mazze",
    cover: "/images/podcasts/msrp-001.jpg",
    blurb:
      "The very first chapter. Label founder Mazze opens the series with an hour of unconventional, boundary-pushing sounds.",
    blurbPl:
      "Pierwszy rozdział. Założyciel wytwórni Mazze otwiera serię godziną niekonwencjonalnych, przekraczających granice brzmień.",
    artists: [
      "Joe Miller",
      "Ólafur Arnalds",
      "RY X",
      "WhoMadeWho",
      "Flowers On Monday",
      "Rafa'EL",
      "Powel",
      "Tim Green",
      "Pesos",
    ],
    soundcloud:
      "https://soundcloud.com/mazzemusic/magic-stories-podcast-mazze",
  },
];
