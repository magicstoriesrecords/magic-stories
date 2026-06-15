import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import NewsList from "@/components/news/NewsList";
import NightSky from "@/components/NightSky";
import { news } from "@/data/news";
import { loadNewsEngagement } from "@/lib/newsEngagement";
import { buildPageMeta } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.news" });
  return buildPageMeta({
    locale,
    path: "/news",
    title: t("title"),
    description: t("description"),
  });
}

// Engagement is per-viewer and changes often → render at request time.
export const dynamic = "force-dynamic";

export default async function NewsArchivePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");

  // Localize copy before it reaches the client; engagement stays keyed by slug.
  const items =
    locale === "pl"
      ? news.map((n) => ({
          ...n,
          title: n.titlePl,
          blurb: n.blurbPl,
          cta: n.ctaPl ?? n.cta,
          cta2: n.cta2Pl ?? n.cta2,
          story: n.storyPl ?? n.story,
        }))
      : news;

  const { engagement, meId, meAuthor } = await loadNewsEngagement(news.map((n) => n.slug));

  return (
    <section
      className="relative isolate overflow-hidden px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-20"
      style={{ background: "linear-gradient(180deg,#15142f 0%,#1b1942 50%,#211d4f 100%)" }}
    >
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
        <header className="mx-auto max-w-2xl text-center">
          <p className="animate-fade-rise font-serif text-xs uppercase tracking-[0.28em] text-cream/70 md:text-sm">
            {t("archiveKicker")}
          </p>
          <h1 className="animate-fade-rise-delay mt-4 font-serif text-3xl font-normal leading-[1.1] tracking-tight text-cream sm:text-4xl md:text-5xl">
            {t("archiveTitle")}
          </h1>
          <p className="animate-fade-rise-delay-2 mt-6 font-sans text-base leading-relaxed text-cream/75">
            {t("archiveLead")}
          </p>
        </header>

        <div className="mt-14 md:mt-16">
          <NewsList items={items} initialEngagement={engagement} meId={meId} meAuthor={meAuthor} />
        </div>
      </div>
    </section>
  );
}
