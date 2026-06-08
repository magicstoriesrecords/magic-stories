"use client";

import { useState } from "react";
import Link from "next/link";
import LinkEmbed from "@/components/campfire/LinkEmbed";
import TimeAgo from "@/components/campfire/TimeAgo";
import LikeButton from "@/components/campfire/LikeButton";
import ReplyThread from "@/components/campfire/ReplyThread";
import { createClient } from "@/lib/supabase/client";
import { normalizeUrl, detectLinkType } from "@/lib/links";
import type { FeedAuthor, FeedPost } from "@/components/campfire/types";

export default function PostCard({
  post,
  meId,
  meAuthor,
  onToggleLike,
  onReplyAdded,
  onUpdated,
  onDeleted,
}: {
  post: FeedPost;
  meId: string | null;
  meAuthor: FeedAuthor | null;
  onToggleLike: (post: FeedPost) => void;
  onReplyAdded: (postId: string) => void;
  onUpdated: (post: FeedPost) => void;
  onDeleted: (postId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editBody, setEditBody] = useState(post.body);
  const [editLink, setEditLink] = useState(post.link_url ?? "");
  const [busy, setBusy] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [err, setErr] = useState("");

  const author = post.author;
  const name = author?.display_name || (author ? `@${author.username}` : "Ktoś");
  const isArtist = author?.role === "artist";
  const canManage = !!meId && post.author_id === meId;

  async function saveEdit() {
    const text = editBody.trim();
    if (!text) {
      setErr("Wpis nie może być pusty.");
      return;
    }
    let linkUrl: string | null = null;
    let linkType: FeedPost["link_type"] = null;
    if (editLink.trim()) {
      const norm = normalizeUrl(editLink);
      if (!norm) {
        setErr("Niepoprawny link.");
        return;
      }
      linkUrl = norm;
      linkType = detectLinkType(norm);
    }
    setBusy(true);
    setErr("");
    const supabase = createClient();
    const { error } = await supabase
      .from("posts")
      .update({ body: text, link_url: linkUrl, link_type: linkType })
      .eq("id", post.id);
    setBusy(false);
    if (error) {
      setErr("Nie udało się zapisać.");
      return;
    }
    onUpdated({ ...post, body: text, link_url: linkUrl, link_type: linkType });
    setEditing(false);
  }

  async function doDelete() {
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.from("posts").delete().eq("id", post.id);
    if (error) {
      setBusy(false);
      setErr("Nie udało się usunąć.");
      return;
    }
    onDeleted(post.id);
  }

  return (
    <article className="glass-card rounded-2xl p-5 md:p-6">
      <header className="flex items-center gap-3">
        {author?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={author.avatar_url}
            alt=""
            className="h-10 w-10 rounded-full border border-cream/20 object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 font-serif text-cream/80">
            {(author?.username ?? "?").slice(0, 1).toUpperCase()}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-serif text-sm text-cream">{name}</span>
            {isArtist && (
              <Link
                href="/authors"
                className="rounded-full border border-warm/50 bg-warm/10 px-2 py-0.5 font-serif text-[0.65rem] uppercase tracking-wide text-warm transition hover:bg-warm/20"
              >
                Artysta
              </Link>
            )}
          </div>
          <div className="font-sans text-xs text-cream/45">
            {author ? <>@{author.username} · </> : null}
            <TimeAgo iso={post.created_at} />
          </div>
        </div>

        {canManage && !editing && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setEditing(true);
                setConfirmDel(false);
                setErr("");
              }}
              aria-label="Edytuj wpis"
              title="Edytuj"
              className="flex h-8 w-8 items-center justify-center rounded-full text-cream/45 transition hover:bg-cream/5 hover:text-cream"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setConfirmDel((v) => !v)}
              aria-label="Usuń wpis"
              title="Usuń"
              className="flex h-8 w-8 items-center justify-center rounded-full text-cream/45 transition hover:bg-red-400/10 hover:text-red-300"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m5 5v6m4-6v6"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </header>

      {confirmDel && !editing && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-red-400/30 bg-red-400/5 px-4 py-2.5">
          <span className="font-sans text-sm text-cream/80">Usunąć ten wpis?</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setConfirmDel(false)}
              disabled={busy}
              className="font-sans text-sm text-cream/60 transition hover:text-cream"
            >
              Anuluj
            </button>
            <button
              type="button"
              onClick={doDelete}
              disabled={busy}
              className="rounded-full bg-red-400/90 px-4 py-1.5 font-sans text-sm font-medium text-magic-navy transition hover:bg-red-300 disabled:opacity-60"
            >
              {busy ? "Usuwam…" : "Usuń"}
            </button>
          </div>
        </div>
      )}

      {editing ? (
        <div className="mt-3">
          <textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            rows={3}
            maxLength={2000}
            className="w-full resize-none rounded-xl border border-cream/15 bg-magic-navy/30 px-4 py-3 font-sans text-[0.95rem] text-cream outline-none focus:border-cream/40"
          />
          <input
            value={editLink}
            onChange={(e) => setEditLink(e.target.value)}
            placeholder="Link (opcjonalnie)"
            className="mt-2 w-full rounded-xl border border-cream/15 bg-magic-navy/30 px-4 py-2.5 font-sans text-sm text-cream outline-none placeholder:text-cream/40 focus:border-cream/40"
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={saveEdit}
              disabled={busy}
              className="liquid-glass rounded-full px-6 py-2 text-sm disabled:opacity-60"
            >
              {busy ? "Zapisuję…" : "Zapisz"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setEditBody(post.body);
                setEditLink(post.link_url ?? "");
                setErr("");
              }}
              className="font-sans text-sm text-cream/60 transition hover:text-cream"
            >
              Anuluj
            </button>
            {err && <span className="font-sans text-sm text-red-300">{err}</span>}
          </div>
        </div>
      ) : (
        <>
          <p className="mt-3 whitespace-pre-wrap break-words font-sans text-[0.95rem] leading-relaxed text-cream/90">
            {post.body}
          </p>
          {post.link_url && post.link_type && <LinkEmbed url={post.link_url} type={post.link_type} />}
          {err && !confirmDel && <p className="mt-2 font-sans text-sm text-red-300">{err}</p>}
        </>
      )}

      <div className="mt-4 flex items-center gap-1 border-t border-cream/10 pt-3">
        <LikeButton
          liked={post.liked_by_me}
          count={post.like_count}
          disabled={!meId}
          onClick={() => onToggleLike(post)}
        />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Odpowiedzi"
          className={`group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
            open ? "bg-cream/5 text-cream" : "text-cream/55 hover:bg-cream/5 hover:text-cream"
          }`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="transition-transform duration-150 group-active:scale-90"
          >
            <path
              d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinejoin="round"
            />
          </svg>
          {post.reply_count > 0 && <span className="tabular-nums">{post.reply_count}</span>}
        </button>
      </div>

      {open && (
        <ReplyThread
          postId={post.id}
          meId={meId}
          meAuthor={meAuthor}
          onReplyAdded={() => onReplyAdded(post.id)}
        />
      )}
    </article>
  );
}
