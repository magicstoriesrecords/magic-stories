import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import NightSky from "@/components/NightSky";
import Feed from "@/components/campfire/Feed";
import type { FeedAuthor, FeedPost } from "@/components/campfire/types";
import { createClient } from "@/lib/supabase/server";
import { buildPageMeta } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.library" });
  return buildPageMeta({
    locale,
    path: "/library",
    title: t("title"),
    description: t("description"),
  });
}

// User-specific (composer + my likes) + fresh feed → render dynamically.
export const dynamic = "force-dynamic";

type Row = {
  id: string;
  author_id: string;
  body: string;
  link_url: string | null;
  link_type: FeedPost["link_type"];
  created_at: string;
  author: FeedAuthor | null;
  likes: { count: number }[] | null;
  replies: { count: number }[] | null;
};

export default async function LibraryPage() {
  const t = await getTranslations("library");
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let author: FeedAuthor | null = null;
  const likedSet = new Set<string>();
  if (user) {
    const [{ data: profile }, { data: myLikes }] = await Promise.all([
      supabase
        .from("profiles")
        .select("username, display_name, avatar_url, role, author_slug")
        .eq("id", user.id)
        .single(),
      supabase.from("likes").select("post_id").eq("user_id", user.id),
    ]);
    author = (profile as FeedAuthor) ?? null;
    for (const l of (myLikes ?? []) as { post_id: string }[]) likedSet.add(l.post_id);
  }

  const { data: postsData } = await supabase
    .from("posts")
    .select(
      "id, author_id, body, link_url, link_type, created_at, author:profiles!posts_author_id_fkey(username, display_name, avatar_url, role, author_slug), likes(count), replies(count)",
    )
    .order("created_at", { ascending: false })
    .limit(50);

  const posts: FeedPost[] = ((postsData ?? []) as unknown as Row[]).map((r) => ({
    id: r.id,
    author_id: r.author_id,
    body: r.body,
    link_url: r.link_url,
    link_type: r.link_type,
    created_at: r.created_at,
    author: r.author,
    like_count: r.likes?.[0]?.count ?? 0,
    reply_count: r.replies?.[0]?.count ?? 0,
    liked_by_me: likedSet.has(r.id),
  }));

  return (
    <section
      className="relative isolate flex flex-1 flex-col overflow-hidden px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-20"
      style={{ background: "linear-gradient(180deg,#15142f 0%,#1b1942 50%,#211d4f 100%)" }}
    >
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
        <NightSky />
        <div
          aria-hidden
          className="absolute inset-0 -z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/authors-sky.png')" }}
        />
        <div aria-hidden className="absolute inset-0 -z-0 bg-[#141230]/35" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
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

        <div className="mt-12">
          <Feed initialPosts={posts} authorId={user?.id ?? null} author={author} />
        </div>
      </div>
    </section>
  );
}
