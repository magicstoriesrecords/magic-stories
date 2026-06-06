"use client";

import Image from "next/image";
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

export default function StoriesGrid() {
  return (
    <ul className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 lg:gap-10 md:mt-20">
      {releases.map((release, i) => (
        <Reveal as="li" key={release.slug} delayMs={Math.min(i, 5) * 70}>
          <article className="group glass-card flex flex-col rounded-3xl p-4 transition-all duration-500 hover:-translate-y-1">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-[0_10px_30px_-18px_rgba(0,0,0,0.6)]">
              <Image
                src={`/images/releases/${release.slug}.jpg`}
                alt={`${release.title} — ${release.artist}`}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-magic-navy/55 via-transparent to-transparent"
              />
              {/* Quick-listen buttons — always tappable on touch, fade in on hover for pointers */}
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap justify-center gap-3 p-4 opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
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

            <p className="mt-5 text-center font-sans text-xs uppercase tracking-[0.22em] text-cream/55">
              {release.date}
            </p>
            <h2 className="mt-2 text-center font-serif text-xl font-normal leading-snug tracking-tight text-cream">
              {release.title}
            </h2>
            <p className="mb-1 mt-1 text-center font-sans text-sm text-cream/70">
              {release.artist}
            </p>
          </article>
        </Reveal>
      ))}
    </ul>
  );
}
