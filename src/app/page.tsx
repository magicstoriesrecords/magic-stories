import Hero from "@/components/Hero";
import NewsSection from "@/components/news/NewsSection";
import { news } from "@/data/news";
import type { FeedAuthor } from "@/components/campfire/types";
import type { EngagementMap } from "@/components/news/types";
import { createClient } from "@/lib/supabase/server";

// Engagement is user-specific (my likes) and changes often → render at request
// time. If the news_* tables aren't set up yet, the queries simply return no
// rows and the carousel shows zero counts (graceful).
export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const slugs = news.map((n) => n.slug);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let author: FeedAuthor | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, display_name, avatar_url, role, author_slug")
      .eq("id", user.id)
      .single();
    author = (profile as FeedAuthor) ?? null;
  }

  const engagement: EngagementMap = {};
  for (const s of slugs) {
    engagement[s] = { like_count: 0, liked_by_me: false, comment_count: 0 };
  }

  const [{ data: likeRows }, { data: commentRows }] = await Promise.all([
    supabase.from("news_likes").select("news_slug, user_id").in("news_slug", slugs),
    supabase.from("news_comments").select("news_slug").in("news_slug", slugs),
  ]);

  for (const r of (likeRows ?? []) as { news_slug: string; user_id: string }[]) {
    const e = engagement[r.news_slug];
    if (!e) continue;
    e.like_count += 1;
    if (user && r.user_id === user.id) e.liked_by_me = true;
  }
  for (const r of (commentRows ?? []) as { news_slug: string }[]) {
    const e = engagement[r.news_slug];
    if (!e) continue;
    e.comment_count += 1;
  }

  return (
    <>
      <Hero />
      <NewsSection
        items={news}
        engagement={engagement}
        meId={user?.id ?? null}
        meAuthor={author}
      />
    </>
  );
}
