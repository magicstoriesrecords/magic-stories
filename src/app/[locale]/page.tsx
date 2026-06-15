import Hero from "@/components/Hero";
import NewsSection from "@/components/news/NewsSection";
import { news } from "@/data/news";
import { loadNewsEngagement } from "@/lib/newsEngagement";
import { buildPageMeta } from "@/lib/seo";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.home" });
  return buildPageMeta({
    locale,
    path: "/",
    title: t("title"),
    description: t("description"),
  });
}

// Engagement is user-specific (my likes) and changes often → render at request
// time. If the news_* tables aren't set up yet, the queries simply return no
// rows and the carousel shows zero counts (graceful).
export const dynamic = "force-dynamic";

export default async function Home({ params }: Props) {
  const { locale } = await params;
  // Only the latest few items live in the homepage carousel; the full history
  // stays readable (with its likes/comments) on the /news archive.
  const featured = news.slice(0, 4);
  // Swap in the Polish headline/blurb/CTA before the items reach the
  // client components; engagement stays keyed by the locale-independent slug.
  const items = locale === "pl"
    ? featured.map((n) => ({ ...n, title: n.titlePl, blurb: n.blurbPl, cta: n.ctaPl ?? n.cta, cta2: n.cta2Pl ?? n.cta2, story: n.storyPl ?? n.story }))
    : featured;

  const { engagement, meId, meAuthor } = await loadNewsEngagement(featured.map((n) => n.slug));

  return (
    <>
      <Hero />
      <NewsSection
        items={items}
        engagement={engagement}
        meId={meId}
        meAuthor={meAuthor}
      />
    </>
  );
}
