import type { Metadata } from "next";
import StoriesGrid from "@/components/StoriesGrid";

export const metadata: Metadata = {
  title: "Stories — Magic Stories Records",
  description:
    "Every release opens a chapter. A library of melodic & organic house.",
};

export default function StoriesPage() {
  return (
    <section className="px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-20">
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="animate-fade-rise font-serif text-xs uppercase tracking-[0.28em] text-ink/60 md:text-sm">
            Stories
          </p>
          <h1 className="animate-fade-rise-delay mt-4 font-serif text-3xl font-normal leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
            Every release opens a chapter.
          </h1>
          <p className="animate-fade-rise-delay-2 mt-6 font-sans text-base leading-relaxed text-ink/75">
            A growing library of melodic &amp; organic house — each record a page
            in the same evening, caught somewhere between dusk and dream.
          </p>
        </header>

        <StoriesGrid />
      </div>
    </section>
  );
}
