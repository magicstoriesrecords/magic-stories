import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import NewsList from "@/components/news/NewsList";
import NightSky from "@/components/NightSky";
import { news } from "@/data/news";
import { loadNewsEngagement } from "@/lib/newsEngagement";
import { buildPageMeta } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = news.find((n) => n.slug === slug);
  if (!item) return {};
  return buildPageMeta({
    locale,
    path: `/news/${slug}`,
    title: locale === "pl" ? item.titlePl : item.title,
    description: locale === "pl" ? item.blurbPl : item.blurb,
    image: item.image,
  });
}

export const dynamic = "force-dynamic";

export default async function NewsItemPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const raw = news.find((n) => n.slug === slug);
  if (!raw) notFound();

  const t = await getTranslations("news");
  const item =
    locale === "pl"
      ? {
          ...raw,
          title: raw.titlePl,
          blurb: raw.blurbPl,
          cta: raw.ctaPl ?? raw.cta,
          cta2: raw.cta2Pl ?? raw.cta2,
          story: raw.storyPl ?? raw.story,
        }
      : raw;

  const { engagement, meId, meAuthor } = await loadNewsEngagement([slug]);

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

      <div className="relative z-10 mx-auto max-w-5xl">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 font-serif text-sm tracking-wide text-cream/70 transition hover:text-cream"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("back")}
        </Link>

        <div className="mt-8 md:mt-10">
          <NewsList
            items={[item]}
            initialEngagement={engagement}
            meId={meId}
            meAuthor={meAuthor}
            defaultOpen
          />
        </div>
      </div>
    </section>
  );
}
