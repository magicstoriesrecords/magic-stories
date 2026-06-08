"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { normalizeUrl, detectLinkType } from "@/lib/links";
import type { FeedAuthor, FeedPost } from "@/components/campfire/types";

export default function Composer({
  authorId,
  author,
  onPosted,
}: {
  authorId: string;
  author: FeedAuthor;
  onPosted: (post: FeedPost) => void;
}) {
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState<"idle" | "posting" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit() {
    const text = body.trim();
    if (!text) {
      setStatus("error");
      setMessage("Napisz coś, zanim wyślesz.");
      return;
    }
    let linkUrl: string | null = null;
    let linkType: FeedPost["link_type"] = null;
    if (link.trim()) {
      const norm = normalizeUrl(link);
      if (!norm) {
        setStatus("error");
        setMessage("Niepoprawny link.");
        return;
      }
      linkUrl = norm;
      linkType = detectLinkType(norm);
    }

    setStatus("posting");
    setMessage("");
    const supabase = createClient();
    const { data, error } = await supabase
      .from("posts")
      .insert({ author_id: authorId, body: text, link_url: linkUrl, link_type: linkType })
      .select("id, author_id, body, link_url, link_type, created_at")
      .single();

    if (error || !data) {
      setStatus("error");
      setMessage("Nie udało się wysłać. Spróbuj ponownie.");
      return;
    }

    onPosted({ ...data, author, like_count: 0, liked_by_me: false, reply_count: 0 } as FeedPost);
    setBody("");
    setLink("");
    setStatus("idle");
  }

  return (
    <div className="glass-card rounded-2xl p-5 md:p-6">
      <div className="flex items-start gap-3">
        {author.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={author.avatar_url}
            alt=""
            className="h-10 w-10 rounded-full border border-cream/20 object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 font-serif text-cream/80">
            {author.username.slice(0, 1).toUpperCase()}
          </span>
        )}

        <div className="flex-1">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="Co słychać przy ognisku?"
            className="w-full resize-none rounded-xl border border-cream/15 bg-magic-navy/30 px-4 py-3 font-sans text-[0.95rem] text-cream outline-none placeholder:text-cream/40 focus:border-cream/40"
          />
          <div className="mt-2 flex items-center rounded-xl border border-cream/15 bg-magic-navy/30 px-3 focus-within:border-cream/40">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-cream/40">
              <path
                d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 1 0-7.07-7.07L11.5 4.5M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 1 0 7.07 7.07L12.5 19.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Link (YouTube, SoundCloud, X) — opcjonalnie"
              className="w-full bg-transparent px-2 py-2.5 font-sans text-sm text-cream outline-none placeholder:text-cream/40"
            />
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="font-sans text-xs text-cream/40">{body.length}/2000</span>
            <div className="flex items-center gap-3">
              {status === "error" && (
                <span className="font-sans text-sm text-red-300">{message}</span>
              )}
              <button
                type="button"
                onClick={submit}
                disabled={status === "posting"}
                className="liquid-glass rounded-full px-7 py-2.5 text-sm disabled:opacity-60"
              >
                {status === "posting" ? "Wysyłam…" : "Opublikuj"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
