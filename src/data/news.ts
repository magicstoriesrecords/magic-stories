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
  title: string; // short headline (EN)
  titlePl: string; // Polish headline
  blurb: string; // 1-3 sentences (EN)
  blurbPl: string; // Polish version
  image?: string; // optional art, /images/news/<slug>.jpg (export ~3:2)
  link?: string; // optional "read more" / external link
  cta?: string; // optional label for the link button (default: "Read more")
  ctaPl?: string; // Polish label for the link button
  story?: string; // short text for the IG Stories graphic (1-2 sentences)
  storyPl?: string; // Polish version of the share text
  link2?: string; // optional secondary link (renders as a second button)
  cta2?: string; // label for the secondary button
  cta2Pl?: string; // Polish label for the secondary button
};

export const news: News[] = [
  {
    slug: "kolory-szczecin-2026",
    date: "2026-06-12",
    title: "MIQRO & MAZZE at KOLORY",
    titlePl: "MIQRO i MAZZE na KOLORACH",
    blurb:
      "On June 27, 2026, Magic Stories Records artists take over KOLORY at Zielone Patio in Szczecin. MIQRO and MAZZE play in the heart of the city, surrounded by light, summer air and electronic sounds. Milkwish and Jazzek join the lineup. Doors at 8:00 PM.",
    blurbPl:
      "Już 27 czerwca 2026 artyści Magic Stories Records wystąpią na wydarzeniu KOLORY w Zielonym Patio w Szczecinie. MIQRO i MAZZE zagrają w sercu miasta, w otoczeniu światła, letniego klimatu i elektronicznych brzmień. Na scenie pojawią się także Milkwish i Jazzek. Start o 20:00.",
    story:
      "On June 27, Magic Stories Records artists take over KOLORY at Zielone Patio in Szczecin. MIQRO and MAZZE play in the heart of the city, joined by Milkwish and Jazzek. Doors at 8:00 PM, tickets at evently.pl.",
    storyPl:
      "Już 27 czerwca artyści Magic Stories Records wystąpią na wydarzeniu KOLORY w Zielonym Patio w Szczecinie. MIQRO i MAZZE zagrają w sercu miasta, obok nich Milkwish i Jazzek. Start o 20:00, bilety na evently.pl.",
    image: "/images/news/kolory-szczecin-2026.jpg",
    link: "https://bit.ly/koloryxzielonepatio",
    cta: "Tickets",
    ctaPl: "Bilety online",
  },
  {
    slug: "rafael-white-city",
    date: "2026-06-12",
    title: "Rafa'EL announces a new release",
    titlePl: "Rafa'EL zapowiada nowe wydanie",
    blurb:
      "Rafa'EL returns with new music. On July 28, “White City” arrives via Ame Records, his latest release. It is another step in his musical story and a new chapter for an artist whose sound has always stayed close to the MSR world.",
    blurbPl:
      "Artysta związany z Magic Stories Records wraca z nową muzyką. Już 28 lipca ukaże się „White City”, najnowsze wydanie Rafa'ELa przygotowane dla Ame Records. To kolejny krok w jego muzycznej historii i następny rozdział dla artysty, którego brzmienie od początku pozostaje blisko świata MSR.",
    story:
      "Rafa'EL returns with new music. On July 28, “White City” arrives via Ame Records, his latest release. Another chapter for an artist whose sound stays close to the MSR world.",
    storyPl:
      "Rafa'EL wraca z nową muzyką. Już 28 lipca ukaże się „White City”, jego najnowsze wydanie przygotowane dla Ame Records. To kolejny rozdział artysty, którego brzmienie pozostaje blisko świata MSR.",
    image: "/images/news/rafael-white-city.jpg",
    link: "/authors#rafael",
    cta: "Meet the artist",
    ctaPl: "Poznaj artystę",
  },
  {
    slug: "peres-endless-again",
    date: "2026-06-12",
    title: "Peres presents “Endless Again”",
    titlePl: "Peres prezentuje „Endless Again”",
    blurb:
      "Peres is shaping his own home for music. His latest single, “Endless Again”, arrives June 22, 2026 on NURAO Records, the artist's own label. A deep house record with a focused, nocturnal character, showing a more personal side of his musical world beyond the Magic Stories catalogue.",
    blurbPl:
      "Peres rozwija własną przestrzeń wydawniczą. Jego najnowszy singiel „Endless Again” ukaże się 22 czerwca 2026 nakładem NURAO Records, autorskiego labelu artysty. To deep house'owe nagranie o skupionym, nocnym charakterze, pokazujące bardziej osobistą stronę jego muzycznego świata poza katalogiem Magic Stories Records.",
    story:
      "Peres is shaping his own home for music. “Endless Again” arrives June 22 on NURAO Records, the artist's own label. Deep house with a focused, nocturnal character.",
    storyPl:
      "Peres rozwija własną przestrzeń wydawniczą. Singiel „Endless Again” ukaże się 22 czerwca nakładem NURAO Records, autorskiego labelu artysty. Deep house o skupionym, nocnym charakterze.",
    image: "/images/news/peres-endless-again.jpg",
    link: "https://www.beatport.com/release/endless-again-oryginal/6984388",
    cta: "Pre-order on Beatport",
    ctaPl: "Pre-order na Beatport",
    link2: "/authors#peres",
    cta2: "Meet the artist",
    cta2Pl: "Poznaj artystę",
  },
  {
    slug: "msr-website-live",
    date: "2026-06-12",
    title: "The new Magic Stories Records website is live",
    titlePl: "Nowa strona Magic Stories Records jest już online",
    blurb:
      "The new MSR site has launched. You will find our releases, artists, podcasts, news and the Magic Library, a space for the label's community. Sign in to write your own post, share a track from YouTube, SoundCloud or X and trade musical discoveries with others. Come help write the world of Magic Stories Records.",
    blurbPl:
      "Nowa odsłona strony MSR właśnie wystartowała. Znajdziecie tam nasze wydania, artystów, podcasty, newsy oraz Magic Library, czyli przestrzeń dla społeczności labelu. Po zalogowaniu można dodać własny wpis, udostępnić utwór, wrzucić link z YouTube, SoundCloud albo X i podzielić się muzycznymi odkryciami z innymi. Zapraszamy do wspólnego tworzenia świata Magic Stories Records.",
    story:
      "The new Magic Stories Records website is live, with releases, artists, podcasts and news. Step into the Magic Library, share a track and join the label's community.",
    storyPl:
      "Nowa strona Magic Stories Records jest już online. Znajdziecie tam wydania, artystów, podcasty i newsy. Zajrzyjcie do Magic Library, podzielcie się muzyką i dołączcie do społeczności labelu.",
    image: "/images/news/msr-website-live.jpg",
    link: "/library",
    cta: "Enter the Library",
    ctaPl: "Wejdź do Biblioteki",
  },
];
