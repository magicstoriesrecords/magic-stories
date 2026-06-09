"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import TimeAgo from "@/components/campfire/TimeAgo";
import type { FeedAuthor } from "@/components/campfire/types";
import type { NewsComment } from "@/components/news/types";

const SELECT =
  "id, body, created_at, author:profiles(username, display_name, avatar_url, role, author_slug)";

// Comment thread for a single news item, keyed by `slug` (news_comments table).
// Mirrors campfire/ReplyThread but on a text slug rather than a post id.
export default function NewsComments({
  slug,
  meId,
  meAuthor,
  onCommentAdded,
}: {
  slug: string;
  meId: string | null;
  meAuthor: FeedAuthor | null;
  onCommentAdded: () => void;
}) {
  const [comments, setComments] = useState<NewsComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    (async () => {
      const { data } = await supabase
        .from("news_comments")
        .select(SELECT)
        .eq("news_slug", slug)
        .order("created_at", { ascending: true });
      if (!active) return;
      setComments((data ?? []) as unknown as NewsComment[]);
      setLoading(false);
    })();

    const channel = supabase
      .channel(`news-comments:${slug}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "news_comments",
          filter: `news_slug=eq.${slug}`,
        },
        async (payload) => {
          const row = payload.new as { id: string; author_id: string };
          if (meId && row.author_id === meId) return; // our own is already shown
          const { data } = await supabase
            .from("news_comments")
            .select(SELECT)
            .eq("id", row.id)
            .single();
          if (!active || !data) return;
          const c = data as unknown as NewsComment;
          setComments((prev) => (prev.some((x) => x.id === c.id) ? prev : [...prev, c]));
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [slug, meId]);

  async function submit() {
    if (!meId || !meAuthor) return;
    const text = body.trim();
    if (!text) return;
    setPosting(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("news_comments")
      .insert({ news_slug: slug, author_id: meId, body: text })
      .select("id, body, created_at")
      .single();
    setPosting(false);
    if (error || !data) return;
    setComments((prev) => [
      ...prev,
      { id: data.id, body: data.body, created_at: data.created_at, author: meAuthor },
    ]);
    setBody("");
    onCommentAdded();
  }

  return (
    <div className="mt-4 border-t border-cream/10 pt-4 text-left">
      {loading ? (
        <p className="font-sans text-xs text-cream/40">Wczytuję komentarze…</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => {
            const name = c.author?.display_name || (c.author ? `@${c.author.username}` : "Ktoś");
            return (
              <li key={c.id} className="flex gap-3">
                {c.author?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.author.avatar_url}
                    alt=""
                    className="h-8 w-8 shrink-0 rounded-full border border-cream/20 object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cream/20 font-serif text-xs text-cream/80">
                    {(c.author?.username ?? "?").slice(0, 1).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-sans text-xs text-cream/45">
                    <span className="font-serif text-sm text-cream/90">{name}</span>
                    {c.author?.role === "artist" && (
                      <Link
                        href="/authors"
                        className="rounded-full border border-warm/50 bg-warm/10 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wide text-warm"
                      >
                        Artysta
                      </Link>
                    )}
                    <TimeAgo iso={c.created_at} />
                  </div>
                  <p className="whitespace-pre-wrap break-words font-sans text-sm text-cream/85">
                    {c.body}
                  </p>
                </div>
              </li>
            );
          })}
          {comments.length === 0 && (
            <p className="font-sans text-xs text-cream/40">Brak komentarzy. Bądź pierwszy.</p>
          )}
        </ul>
      )}

      {meId && meAuthor ? (
        <div className="mt-4 flex items-end gap-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={1}
            maxLength={2000}
            placeholder="Skomentuj…"
            className="min-h-[42px] w-full resize-none rounded-xl border border-cream/15 bg-magic-navy/30 px-3 py-2.5 font-sans text-sm text-cream outline-none placeholder:text-cream/40 focus:border-cream/40"
          />
          <button
            type="button"
            onClick={submit}
            disabled={posting || !body.trim()}
            className="liquid-glass shrink-0 rounded-full px-5 py-2.5 text-sm disabled:opacity-50"
          >
            {posting ? "…" : "Wyślij"}
          </button>
        </div>
      ) : (
        <p className="mt-4 font-sans text-xs text-cream/40">
          <Link href="/account" className="underline underline-offset-2 hover:text-cream/70">
            Zaloguj się
          </Link>{" "}
          aby skomentować.
        </p>
      )}
    </div>
  );
}
