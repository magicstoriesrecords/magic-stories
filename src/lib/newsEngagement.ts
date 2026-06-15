import { createClient } from "@/lib/supabase/server";
import type { FeedAuthor } from "@/components/campfire/types";
import type { EngagementMap } from "@/components/news/types";

// Loads like/comment counts (and my-likes) for a set of news slugs, plus the
// signed-in viewer's profile. Shared by the homepage carousel, the /news
// archive and individual /news/[slug] pages so the counting stays identical.
// If the news_* tables aren't set up yet the queries return no rows and every
// slug gets a graceful zero count.
export async function loadNewsEngagement(slugs: string[]): Promise<{
  engagement: EngagementMap;
  meId: string | null;
  meAuthor: FeedAuthor | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let meAuthor: FeedAuthor | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, display_name, avatar_url, role, author_slug")
      .eq("id", user.id)
      .single();
    meAuthor = (profile as FeedAuthor) ?? null;
  }

  const engagement: EngagementMap = {};
  for (const s of slugs) {
    engagement[s] = { like_count: 0, liked_by_me: false, comment_count: 0 };
  }
  if (slugs.length === 0) return { engagement, meId: user?.id ?? null, meAuthor };

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

  return { engagement, meId: user?.id ?? null, meAuthor };
}
