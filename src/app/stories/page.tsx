import type { Metadata } from "next";
import StoriesGrid from "@/components/StoriesGrid";
import NightSky from "@/components/NightSky";

export const metadata: Metadata = {
  title: "Stories — Magic Stories Records",
  description:
    "Every release opens a chapter. A library of melodic & organic house.",
};

export default function StoriesPage() {
  return (
    <section
      className="relative isolate overflow-hidden px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-20"
      style={{ background: "linear-gradient(180deg,#15142f 0%,#1b1942 50%,#211d4f 100%)" }}
    >
      {/* Base fallback: procedural sky (shows if the photo is missing). */}
      <NightSky />
      {/* Real sky photo — shared with the Authors section. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/images/authors-sky.png')" }}
      />
      {/* Gentle darkening for text contrast. */}
      <div aria-hidden className="absolute inset-0 -z-0 bg-[#141230]/25" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="animate-fade-rise font-serif text-xs uppercase tracking-[0.28em] text-cream/70 md:text-sm">
            Stories
          </p>
          <h1 className="animate-fade-rise-delay mt-4 font-serif text-3xl font-normal leading-[1.1] tracking-tight text-cream sm:text-4xl md:text-5xl">
            Every release opens a chapter.
          </h1>
          <p className="animate-fade-rise-delay-2 mt-6 font-sans text-base leading-relaxed text-cream/75">
            A growing library of melodic &amp; organic house — each record a page
            in the same evening, caught somewhere between dusk and dream.
          </p>
        </header>

        <StoriesGrid />
      </div>
    </section>
  );
}
