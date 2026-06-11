import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Reveal from "@/components/Reveal";
import NightSky from "@/components/NightSky";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.submit" });
  return { title: t("title"), description: t("description") };
}

const DEMO_EMAIL = "magicstoriesrecords@gmail.com";

export default async function SubmitPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("submit");

  const mailto = `mailto:${DEMO_EMAIL}?subject=${encodeURIComponent(t("mailSubject"))}`;

  // What we ask for, kept short — three quiet rules rather than a form.
  const guidelines = [
    { title: t("rule1Title"), body: t("rule1Body") },
    { title: t("rule2Title"), body: t("rule2Body") },
    { title: t("rule3Title"), body: t("rule3Body") },
  ];

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
            {t("kicker")}
          </p>
          <h1 className="mt-4 font-serif text-3xl font-normal leading-[1.1] tracking-tight text-cream sm:text-4xl md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-6 font-sans text-base leading-relaxed text-cream/75">
            {t("lead")}
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
              href={mailto}
              className="liquid-glass inline-flex items-center justify-center whitespace-nowrap rounded-full px-12 py-[1.1rem] text-[0.95rem] text-cream focus-visible:outline-none"
            >
              {t("cta")}
            </a>
            <p className="mt-5 font-sans text-sm text-cream/65">
              {t("orWriteTo")}{" "}
              <a
                href={`mailto:${DEMO_EMAIL}`}
                className="text-twilight underline decoration-twilight/40 underline-offset-4 transition-colors hover:text-cream"
              >
                {DEMO_EMAIL}
              </a>
            </p>
            <p className="mt-8 font-sans text-xs leading-relaxed text-cream/50">
              {t("footnote")}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
