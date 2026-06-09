"use client";

import { useCallback, useEffect, useState } from "react";
import NewsCard from "@/components/news/NewsCard";
import { createClient } from "@/lib/supabase/client";
import type { FeedAuthor } from "@/components/campfire/types";
import type { News } from "@/data/news";
import type { EngagementMap } from "@/components/news/types";

const ADVANCE_MS = 7000;
const ZERO = { like_count: 0, liked_by_me: false, comment_count: 0 };

export default function NewsCarousel({
  items,
  initialEngagement,
  meId,
  meAuthor,
}: {
  items: News[];
  initialEngagement: EngagementMap;
  meId: string | null;
  meAuthor: FeedAuthor | null;
}) {
  const [eng, setEng] = useState<EngagementMap>(initialEngagement);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = items.length;

  const go = useCallback(
    (next: number) => setIndex(() => ((next % count) + count) % count),
    [count],
  );

  // Auto-advance — paused on hover/focus, disabled for reduced-motion or a
  // single item.
  useEffect(() => {
    if (count <= 1 || paused) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [count, paused, index]);

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

  if (count === 0) return null;

  const current = items[index];
  const curEng = eng[current.slug] ?? ZERO;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Slide */}
      <div key={current.slug} className="animate-fade-rise">
        <NewsCard
          item={current}
          eng={curEng}
          meId={meId}
          meAuthor={meAuthor}
          onToggleLike={toggleLike}
          onCommentAdded={bumpComment}
        />
      </div>

      {count > 1 && (
        <>
          {/* Arrows */}
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Poprzedni news"
            className="liquid-glass absolute -left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center md:flex lg:-left-5"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Następny news"
            className="liquid-glass absolute -right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center md:flex lg:-right-5"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Dots */}
          <div className="mt-7 flex items-center justify-center gap-2.5">
            {items.map((n, i) => (
              <button
                key={n.slug}
                type="button"
                onClick={() => go(i)}
                aria-label={`Przejdź do newsa ${i + 1}`}
                aria-current={i === index}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-7 bg-cream/90" : "w-2.5 bg-cream/35 hover:bg-cream/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
