"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import TimeAgo from "@/components/campfire/TimeAgo";
import LikeButton from "@/components/campfire/LikeButton";
import type { FeedAuthor } from "@/components/campfire/types";
import type { NewsComment } from "@/components/news/types";

const SELECT =
  "id, author_id, body, created_at, author:profiles!news_comments_author_id_fkey(username, display_name, avatar_url, role, author_slug), likes:news_comment_likes(user_id)";

// Raw row: hearts arrive as an embedded array of user_ids; fold them into
// like_count / liked_by_me before they reach state.
type Row = Omit<NewsComment, "like_count" | "liked_by_me"> & {
  likes?: { user_id: string }[] | null;
};
function foldLikes(row: Row, meId: string | null): NewsComment {
  const { likes, ...rest } = row;
  return {
    ...rest,
    like_count: likes?.length ?? 0,
    liked_by_me: !!meId && (likes ?? []).some((l) => l.user_id === meId),
  };
}

// Comment thread for a single news item, keyed by `slug` (news_comments table).
// Mirrors campfire/ReplyThread but on a text slug rather than a post id.
export default function NewsComments({
  slug,
  meId,
  meAuthor,
  onCommentAdded,
  onCommentDeleted,
}: {
  slug: string;
  meId: string | null;
  meAuthor: FeedAuthor | null;
  onCommentAdded: () => void;
  onCommentDeleted: () => void;
}) {
  const t = useTranslations("news");
  const ta = useTranslations("auth");
  const tp = useTranslations("post");
  const [comments, setComments] = useState<NewsComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");
  const [confirmDelId, setConfirmDelId] = useState<string | null>(null);
  const [rowBusy, setRowBusy] = useState(false);

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
      setComments(((data ?? []) as unknown as Row[]).map((r) => foldLikes(r, meId)));
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
          const c = foldLikes(data as unknown as Row, meId);
          setComments((prev) => (prev.some((x) => x.id === c.id) ? prev : [...prev, c]));
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [slug, meId]);

  async function toggleLike(c: NewsComment) {
    if (!meId) return;
    const wasLiked = c.liked_by_me;
    // Optimistic flip; reverted if the write fails.
    const apply = (liked: boolean) => (prev: NewsComment[]) =>
      prev.map((x) =>
        x.id === c.id
          ? { ...x, liked_by_me: liked, like_count: x.like_count + (liked ? 1 : -1) }
          : x,
      );
    setComments(apply(!wasLiked));
    const supabase = createClient();
    const { error } = wasLiked
      ? await supabase
          .from("news_comment_likes")
          .delete()
          .eq("comment_id", c.id)
          .eq("user_id", meId)
      : await supabase
          .from("news_comment_likes")
          .insert({ comment_id: c.id, user_id: meId });
    if (error) setComments(apply(wasLiked));
  }

  async function saveEdit(c: NewsComment) {
    const text = editBody.trim();
    if (!text || rowBusy) return;
    setRowBusy(true);
    const supabase = createClient();
    const { error } = await supabase.from("news_comments").update({ body: text }).eq("id", c.id);
    setRowBusy(false);
    if (error) return;
    setComments((prev) => prev.map((x) => (x.id === c.id ? { ...x, body: text } : x)));
    setEditingId(null);
  }

  async function doDelete(c: NewsComment) {
    if (rowBusy) return;
    setRowBusy(true);
    const supabase = createClient();
    const { error } = await supabase.from("news_comments").delete().eq("id", c.id);
    setRowBusy(false);
    if (error) return;
    setComments((prev) => prev.filter((x) => x.id !== c.id));
    setConfirmDelId(null);
    onCommentDeleted();
  }

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
      {
        id: data.id,
        author_id: meId,
        body: data.body,
        created_at: data.created_at,
        author: meAuthor,
        like_count: 0,
        liked_by_me: false,
      },
    ]);
    setBody("");
    onCommentAdded();
  }

  return (
    <div className="text-left">
      {loading ? (
        <p className="font-sans text-xs text-cream/40">{t("loading")}</p>
      ) : (
        <ul className="divide-y divide-cream/10">
          {comments.map((c) => {
            const name = c.author?.display_name || (c.author ? `@${c.author.username}` : tp("someone"));
            return (
              <li key={c.id} className="flex gap-3 py-3.5 first:pt-0 last:pb-0">
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
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 font-sans text-xs text-cream/45">
                    <span className="font-serif text-sm text-cream/90">{name}</span>
                    {c.author?.role === "artist" && (
                      <Link
                        href="/authors"
                        className="rounded-full border border-warm/50 bg-warm/10 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wide text-warm"
                      >
                        {tp("artistBadge")}
                      </Link>
                    )}
                    <TimeAgo iso={c.created_at} />
                    {meId === c.author_id && editingId !== c.id && (
                      <span className="ml-auto flex items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(c.id);
                            setEditBody(c.body);
                            setConfirmDelId(null);
                          }}
                          aria-label={tp("editAria")}
                          title={tp("edit")}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-cream/40 transition hover:bg-cream/5 hover:text-cream"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDelId((v) => (v === c.id ? null : c.id))}
                          aria-label={tp("deleteAria")}
                          title={tp("delete")}
                          className="flex h-7 w-7 items-center justify-center rounded-full text-cream/40 transition hover:bg-cream/5 hover:text-red-300"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m5 5v6m4-6v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </span>
                    )}
                  </div>
                  {confirmDelId === c.id && editingId !== c.id && (
                    <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-red-400/30 bg-red-400/5 px-3 py-2">
                      <span className="font-sans text-xs text-cream/80">{t("confirmDelete")}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setConfirmDelId(null)}
                          disabled={rowBusy}
                          className="font-sans text-xs text-cream/60 transition hover:text-cream"
                        >
                          {tp("cancel")}
                        </button>
                        <button
                          type="button"
                          onClick={() => doDelete(c)}
                          disabled={rowBusy}
                          className="rounded-full bg-red-400/90 px-3 py-1 font-sans text-xs font-medium text-magic-navy transition hover:bg-red-300 disabled:opacity-60"
                        >
                          {rowBusy ? tp("deleting") : tp("delete")}
                        </button>
                      </div>
                    </div>
                  )}
                  {editingId === c.id ? (
                    <div className="mt-2">
                      <textarea
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        rows={2}
                        maxLength={2000}
                        className="w-full resize-none rounded-xl border border-cream/15 bg-magic-navy/30 px-3 py-2 font-sans text-sm text-cream outline-none focus:border-cream/40"
                      />
                      <div className="mt-2 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => saveEdit(c)}
                          disabled={rowBusy || !editBody.trim()}
                          className="liquid-glass rounded-full px-5 py-1.5 text-xs disabled:opacity-50"
                        >
                          {rowBusy ? tp("saving") : tp("save")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="font-sans text-xs text-cream/60 transition hover:text-cream"
                        >
                          {tp("cancel")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap break-words font-sans text-sm text-cream/85">
                      {c.body}
                    </p>
                  )}
                </div>
                <div className="shrink-0 self-center">
                  <LikeButton
                    size="sm"
                    liked={c.liked_by_me}
                    count={c.like_count}
                    disabled={!meId}
                    onClick={() => toggleLike(c)}
                  />
                </div>
              </li>
            );
          })}
          {comments.length === 0 && (
            <p className="font-sans text-xs text-cream/40">{t("empty")}</p>
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
            placeholder={t("commentPlaceholder")}
            className="min-h-[42px] w-full resize-none rounded-xl border border-cream/15 bg-magic-navy/30 px-3 py-2.5 font-sans text-sm text-cream outline-none placeholder:text-cream/40 focus:border-cream/40"
          />
          <button
            type="button"
            onClick={submit}
            disabled={posting || !body.trim()}
            className="liquid-glass shrink-0 rounded-full px-5 py-2.5 text-sm disabled:opacity-50"
          >
            {posting ? "…" : t("send")}
          </button>
        </div>
      ) : (
        <p className="mt-4 font-sans text-xs text-cream/40">
          <Link href="/account" className="underline underline-offset-2 hover:text-cream/70">
            {ta("signInShort")}
          </Link>{" "}
          {t("toComment")}
        </p>
      )}
    </div>
  );
}
