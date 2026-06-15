"use client";

import { useEffect, useState } from "react";
import NewsCard from "@/components/news/NewsCard";
import { createClient } from "@/lib/supabase/client";
import type { FeedAuthor } from "@/components/campfire/types";
import type { News } from "@/data/news";
import type { EngagementMap } from "@/components/news/types";

const ZERO = { like_count: 0, liked_by_me: false, comment_count: 0 };

// Vertical list of news cards for the /news archive and single /news/[slug]
// pages. Shares NewsCard and the same engagement machinery as NewsCarousel
// (optimistic likes, live counts), minus the carousel/auto-advance/touch.
export default function NewsList({
  items,
  initialEngagement,
  meId,
  meAuthor,
  defaultOpen = false,
}: {
  items: News[];
  initialEngagement: EngagementMap;
  meId: string | null;
  meAuthor: FeedAuthor | null;
  defaultOpen?: boolean;
}) {
  const [eng, setEng] = useState<EngagementMap>(initialEngagement);

  // Optimistic like toggle, persisted to news_likes.
  async function toggleLike(slug: string) {
    if (!meId) return;
    const cur = eng[slug] ?? ZERO;
    const next = !cur.liked_by_me;
    setEng((m) => ({
      ...m,
      [slug]: {
        ...(m[slug] ?? ZERO),
        liked_by_me: next,
        like_count: (m[slug] ?? ZERO).like_count + (next ? 1 : -1),
      },
    }));
    const supabase = createClient();
    const { error } = next
      ? await supabase.from("news_likes").insert({ news_slug: slug, user_id: meId })
      : await supabase
          .from("news_likes")
          .delete()
          .eq("news_slug", slug)
          .eq("user_id", meId);
    if (error) {
      setEng((m) => {
        const c = m[slug] ?? ZERO;
        return {
          ...m,
          [slug]: {
            ...c,
            liked_by_me: !next,
            like_count: c.like_count + (next ? -1 : 1),
          },
        };
      });
    }
  }

  function bumpComment(slug: string) {
    setEng((m) => {
      const c = m[slug] ?? ZERO;
      return { ...m, [slug]: { ...c, comment_count: c.comment_count + 1 } };
    });
  }

  function dropComment(slug: string) {
    setEng((m) => {
      const c = m[slug] ?? ZERO;
      return { ...m, [slug]: { ...c, comment_count: Math.max(0, c.comment_count - 1) } };
    });
  }

  // Realtime — reflect other people's likes and comments live.
  useEffect(() => {
    const slugs = new Set(items.map((n) => n.slug));
    const supabase = createClient();
    const channel = supabase
      .channel("news-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "news_likes" },
        (payload) => {
          const row = payload.new as { news_slug: string; user_id: string };
          if (!slugs.has(row.news_slug) || row.user_id === meId) return;
          setEng((m) => {
            const c = m[row.news_slug] ?? ZERO;
            return { ...m, [row.news_slug]: { ...c, like_count: c.like_count + 1 } };
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "news_likes" },
        (payload) => {
          const row = payload.old as { news_slug: string; user_id: string };
          if (!slugs.has(row.news_slug) || row.user_id === meId) return;
          setEng((m) => {
            const c = m[row.news_slug] ?? ZERO;
            return { ...m, [row.news_slug]: { ...c, like_count: Math.max(0, c.like_count - 1) } };
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "news_comments" },
        (payload) => {
          const row = payload.new as { news_slug: string; author_id: string };
          if (!slugs.has(row.news_slug) || row.author_id === meId) return;
          setEng((m) => {
            const c = m[row.news_slug] ?? ZERO;
            return { ...m, [row.news_slug]: { ...c, comment_count: c.comment_count + 1 } };
          });
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [items, meId]);

  if (items.length === 0) return null;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 md:gap-12">
      {items.map((item) => (
        <NewsCard
          key={item.slug}
          item={item}
          eng={eng[item.slug] ?? ZERO}
          meId={meId}
          meAuthor={meAuthor}
          defaultOpen={defaultOpen}
          onToggleLike={toggleLike}
          onCommentAdded={bumpComment}
          onCommentDeleted={dropComment}
        />
      ))}
    </div>
  );
}
