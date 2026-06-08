"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import TimeAgo from "@/components/campfire/TimeAgo";
import type { FeedAuthor, Reply } from "@/components/campfire/types";

const SELECT =
  "id, body, created_at, author:profiles(username, display_name, avatar_url, role, author_slug)";

export default function ReplyThread({
  postId,
  meId,
  meAuthor,
  onReplyAdded,
}: {
  postId: string;
  meId: string | null;
  meAuthor: FeedAuthor | null;
  onReplyAdded: () => void;
}) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    (async () => {
      const { data } = await supabase
        .from("replies")
        .select(SELECT)
        .eq("post_id", postId)
        .order("created_at", { ascending: true });
      if (!active) return;
      setReplies((data ?? []) as unknown as Reply[]);
      setLoading(false);
    })();

    const channel = supabase
      .channel(`replies:${postId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "replies", filter: `post_id=eq.${postId}` },
        async (payload) => {
          const row = payload.new as { id: string; author_id: string };
          if (meId && row.author_id === meId) return; // our own reply is already shown
          const { data } = await supabase.from("replies").select(SELECT).eq("id", row.id).single();
          if (!active || !data) return;
          const reply = data as unknown as Reply;
          setReplies((prev) => (prev.some((r) => r.id === reply.id) ? prev : [...prev, reply]));
        },
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [postId, meId]);

  async function submit() {
    if (!meId || !meAuthor) return;
    const text = body.trim();
    if (!text) return;
    setPosting(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("replies")
      .insert({ post_id: postId, author_id: meId, body: text })
      .select("id, body, created_at")
      .single();
    setPosting(false);
    if (error || !data) return;
    setReplies((prev) => [
      ...prev,
      { id: data.id, body: data.body, created_at: data.created_at, author: meAuthor },
    ]);
    setBody("");
    onReplyAdded();
  }

  return (
    <div className="mt-4 border-t border-cream/10 pt-4">
      {loading ? (
        <p className="font-sans text-xs text-cream/40">Wczytuję odpowiedzi…</p>
      ) : (
        <ul className="space-y-3">
          {replies.map((r) => {
            const name = r.author?.display_name || (r.author ? `@${r.author.username}` : "Ktoś");
            return (
              <li key={r.id} className="flex gap-3">
                {r.author?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.author.avatar_url}
                    alt=""
                    className="h-8 w-8 shrink-0 rounded-full border border-cream/20 object-cover"
                  />
                ) : (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cream/20 font-serif text-xs text-cream/80">
                    {(r.author?.username ?? "?").slice(0, 1).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-sans text-xs text-cream/45">
                    <span className="font-serif text-sm text-cream/90">{name}</span>
                    {r.author?.role === "artist" && (
                      <Link
                        href="/authors"
                        className="rounded-full border border-warm/50 bg-warm/10 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wide text-warm"
                      >
                        Artysta
                      </Link>
                    )}
                    <TimeAgo iso={r.created_at} />
                  </div>
                  <p className="whitespace-pre-wrap break-words font-sans text-sm text-cream/85">
                    {r.body}
                  </p>
                </div>
              </li>
            );
          })}
          {replies.length === 0 && (
            <p className="font-sans text-xs text-cream/40">Brak odpowiedzi. Bądź pierwszy.</p>
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
            placeholder="Odpowiedz…"
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
          aby odpowiedzieć.
        </p>
      )}
    </div>
  );
}
