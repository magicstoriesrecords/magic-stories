import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import StoriesGrid from "@/components/StoriesGrid";
import NightSky from "@/components/NightSky";
import { buildPageMeta } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.stories" });
  return buildPageMeta({
    locale,
    path: "/stories",
    title: t("title"),
    description: t("description"),
  });
}

export default async function StoriesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("stories");

  return (
    <section
      className="relative isolate overflow-hidden px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-20"
      style={{ background: "linear-gradient(180deg,#15142f 0%,#1b1942 50%,#211d4f 100%)" }}
    >
      {/* Fixed viewport-sized sky backdrop: own compositor layer →
          crisp photo + smooth scroll (no background-attachment:fixed jank). */}
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
        <NightSky />
      {/* Real sky photo — shared with the Authors section. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/authors-sky.png')" }}
      />
      {/* Gentle darkening for text contrast. */}
      <div aria-hidden className="absolute inset-0 -z-0 bg-[#141230]/25" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="animate-fade-rise font-serif text-xs uppercase tracking-[0.28em] text-cream/70 md:text-sm">
            {t("kicker")}
          </p>
          <h1 className="animate-fade-rise-delay mt-4 font-serif text-3xl font-normal leading-[1.1] tracking-tight text-cream sm:text-4xl md:text-5xl">
            {t("title")}
          </h1>
          <p className="animate-fade-rise-delay-2 mt-6 font-sans text-base leading-relaxed text-cream/75">
            {t("lead")}
          </p>
        </header>

        <StoriesGrid />
      </div>
    </section>
  );
}
