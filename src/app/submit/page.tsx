import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import NightSky from "@/components/NightSky";

export const metadata: Metadata = {
  title: "Submit — Magic Stories Records",
  description:
    "Send your demo to Magic Stories Records — melodic and organic house with a story to tell.",
};

const DEMO_EMAIL = "magicstoriesrecords@gmail.com";
const MAILTO = `mailto:${DEMO_EMAIL}?subject=${encodeURIComponent("Demo — [your artist name]")}`;

// What we ask for, kept short — three quiet rules rather than a form.
const guidelines = [
  {
    title: "Two or three tracks",
    body: "Finished, or close to it. Private SoundCloud links work best — please, no attachments or zips.",
  },
  {
    title: "A line about you",
    body: "Who you are, where your sound comes from, and one link to wherever you live online.",
  },
  {
    title: "Your story, not a copy",
    body: "We listen for melodic and organic house with a heart — music that paints a place we haven't been yet.",
  },
];

export default function SubmitPage() {
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
            Submit
          </p>
          <h1 className="mt-4 font-serif text-3xl font-normal leading-[1.1] tracking-tight text-cream sm:text-4xl md:text-5xl">
            Send us your story.
          </h1>
          <p className="mt-6 font-sans text-base leading-relaxed text-cream/75">
            Every release here began as a demo in somebody&rsquo;s inbox. If your
            music belongs in the evening mist — melodic, organic, patient — we
            would love to hear it.
          </p>
        </header>

        {/* Guidelines */}
        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 md:mt-20 md:grid-cols-3">
          {guidelines.map((g, i) => (
            <Reveal key={g.title} delayMs={i * 120}>
              <article className="glass-card h-full rounded-3xl px-7 py-8 text-left">
                <p className="font-serif text-xs uppercase tracking-[0.24em] text-warm/85">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-3 font-serif text-xl font-normal leading-snug tracking-tight text-cream">
                  {g.title}
                </h2>
                <p className="mt-3 font-sans text-sm leading-relaxed text-cream/75">
                  {g.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal delayMs={360}>
          <div className="mx-auto mt-14 max-w-2xl text-center md:mt-20">
            <a
              href={MAILTO}
              className="liquid-glass inline-flex items-center justify-center whitespace-nowrap rounded-full px-12 py-[1.1rem] text-[0.95rem] text-cream focus-visible:outline-none"
            >
              Send your demo
            </a>
            <p className="mt-5 font-sans text-sm text-cream/65">
              or write to{" "}
              <a
                href={`mailto:${DEMO_EMAIL}`}
                className="text-twilight underline decoration-twilight/40 underline-offset-4 transition-colors hover:text-cream"
              >
                {DEMO_EMAIL}
              </a>
            </p>
            <p className="mt-8 font-sans text-xs leading-relaxed text-cream/50">
              We listen to everything that arrives. If your story resonates with
              ours, we&rsquo;ll write back — it can take a little while, and
              silence never means your music wasn&rsquo;t heard.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
