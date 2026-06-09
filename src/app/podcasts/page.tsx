import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import NightSky from "@/components/NightSky";
import { SoundcloudIcon } from "@/components/PlatformIcons";
import { podcasts } from "@/data/podcasts";

export const metadata: Metadata = {
  title: "Podcasts — Magic Stories Records",
  description:
    "The Magic Stories Records podcast series — guest and founder mixes, chapter after chapter.",
};

export default function PodcastsPage() {
  return (
    <section
      className="relative isolate overflow-hidden px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-20"
      style={{ background: "linear-gradient(180deg,#15142f 0%,#1b1942 50%,#211d4f 100%)" }}
    >
      {/* Fixed viewport-sized sky backdrop (own layer → crisp photo + smooth scroll). */}
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
        <NightSky />
        <div
          aria-hidden
          className="absolute inset-0 -z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/authors-sky.png')" }}
        />
        <div aria-hidden className="absolute inset-0 -z-0 bg-[#141230]/25" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-xs uppercase tracking-[0.28em] text-cream/70 md:text-sm">
            Podcasts
          </p>
          <h1 className="mt-4 font-serif text-3xl font-normal leading-[1.1] tracking-tight text-cream sm:text-4xl md:text-5xl">
            Every chapter, a new mix.
          </h1>
          <p className="mt-6 font-sans text-base leading-relaxed text-cream/75">
            The Magic Stories podcast series — hour-long journeys mixed by the
            label&rsquo;s artists and friends, new sounds gathered from around the world.
          </p>
        </header>

        {/* Episode spreads */}
        <div className="mt-14 flex flex-col gap-14 md:mt-20 md:gap-20">
          {podcasts.map((ep, i) => {
            const flip = i % 2 === 1; // zig-zag: cover left / right alternately
            return (
              <Reveal key={ep.code}>
                <article className="glass-card relative overflow-hidden rounded-3xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 md:items-center">
                    {/* Cover slot — fixed 3:2, so one artwork size always fills it
                        edge to edge. Design covers at 3:2 (e.g. 1500×1000). */}
                    <div
                      className={`relative aspect-[3/2] w-full overflow-hidden ${
                        flip ? "md:order-2" : "md:order-1"
                      }`}
                      style={{ background: "#171633" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ep.cover}
                        alt={`${ep.code} — ${ep.guest}`}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                      {/* Gentle blend into the card edge */}
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-[#141230]/45 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#141230]/20"
                      />
                    </div>

                    {/* Text page */}
                    <div
                      className={`flex flex-col justify-center px-7 py-9 md:px-12 md:py-14 ${
                        flip ? "md:order-1" : "md:order-2"
                      }`}
                    >
                      <p className="font-serif text-xs uppercase tracking-[0.28em] text-cream/55">
                        {ep.code}
                      </p>
                      <h2 className="mt-3 font-serif text-3xl font-normal leading-[1.05] tracking-tight text-cream md:text-4xl">
                        {ep.guest}
                      </h2>

                      <p className="mt-5 font-sans text-sm leading-relaxed text-cream/80 md:text-base">
                        {ep.blurb}
                      </p>

                      <div className="mt-6">
                        <p className="font-serif text-[0.7rem] uppercase tracking-[0.22em] text-warm/85">
                          Featuring
                        </p>
                        <p className="mt-2 font-sans text-sm leading-relaxed text-cream/65">
                          {ep.artists.join("  ·  ")}
                        </p>
                      </div>

                      <div className="mt-8">
                        <a
                          href={ep.soundcloud}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Listen to ${ep.code} on SoundCloud`}
                          className="liquid-glass inline-flex items-center gap-3 rounded-full px-6 py-3 text-[0.9rem] text-cream"
                        >
                          <SoundcloudIcon />
                          Listen on SoundCloud
                        </a>
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
