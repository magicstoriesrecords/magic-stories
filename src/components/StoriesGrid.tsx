import Image from "next/image";
import { useLocale } from "next-intl";
import Reveal from "@/components/Reveal";
import { releases } from "@/data/releases";
import {
  SpotifyIcon,
  SoundcloudIcon,
  YoutubeIcon,
  BeatportIcon,
} from "@/components/PlatformIcons";

const platforms = [
  { key: "beatport", label: "Beatport", Icon: BeatportIcon },
  { key: "soundcloud", label: "SoundCloud", Icon: SoundcloudIcon },
  { key: "youtube", label: "YouTube", Icon: YoutubeIcon },
  { key: "spotify", label: "Spotify", Icon: SpotifyIcon },
] as const;

// Release "chapters" rendered as open-book spreads (matching Artists & Podcasts):
// a square album cover on one side, the chapter note on the other, alternating.
export default function StoriesGrid() {
  const locale = useLocale();
  return (
    <div className="mt-14 flex flex-col gap-14 md:mt-20 md:gap-20">
      {releases.map((release, i) => {
        const flip = i % 2 === 1; // zig-zag: cover left / right alternately
        return (
          <Reveal key={release.slug}>
            <article className="glass-card relative overflow-hidden rounded-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 md:items-center">
                {/* Square album cover — framed, never cropped */}
                <div
                  className={`flex items-center justify-center p-7 md:p-12 ${
                    flip ? "md:order-2" : "md:order-1"
                  }`}
                >
                  <div className="relative aspect-square w-full max-w-[20rem] overflow-hidden rounded-2xl shadow-[0_22px_55px_rgba(8,7,24,0.6)]">
                    <Image
                      src={`/images/releases/${release.slug}.jpg`}
                      alt={`${release.title} — ${release.artist}`}
                      fill
                      sizes="(min-width: 768px) 20rem, 80vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Chapter note */}
                <div
                  className={`flex flex-col justify-center px-7 pb-9 pt-2 md:px-12 md:py-14 ${
                    flip ? "md:order-1" : "md:order-2"
                  }`}
                >
                  <p className="font-serif text-xs uppercase tracking-[0.28em] text-cream/55">
                    {release.cat}
                  </p>
                  <h2 className="mt-3 font-serif text-3xl font-normal leading-[1.05] tracking-tight text-cream md:text-4xl">
                    {release.title}
                  </h2>
                  <p className="mt-2 font-sans text-sm italic text-cream/65">
                    {release.artist}
                  </p>

                  <p className="mt-5 font-sans text-sm leading-relaxed text-cream/80 md:text-base">
                    {locale === "pl" ? release.blurbPl : release.blurb}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    {platforms.map(({ key, label, Icon }) => {
                      const href = release.links[key];
                      if (!href) return null;
                      return (
                        <a
                          key={key}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${label} — ${release.title}`}
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
  );
}
