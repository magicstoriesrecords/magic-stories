"use client";

import { useEffect, useRef } from "react";
import type { LinkType } from "@/lib/links";
import { youtubeId, hostnameOf } from "@/lib/links";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    twttr?: any;
  }
}

function loadTwitter(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.twttr?.widgets) return Promise.resolve();
  return new Promise((resolve) => {
    const existing = document.getElementById("twitter-wjs") as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.id = "twitter-wjs";
    s.src = "https://platform.twitter.com/widgets.js";
    s.async = true;
    s.onload = () => resolve();
    document.body.appendChild(s);
  });
}

function extractTweetId(url: string): string {
  const m = url.match(/status(?:es)?\/(\d+)/);
  return m ? m[1] : "";
}

export default function LinkEmbed({ url, type }: { url: string; type: LinkType }) {
  const tweetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (type !== "x") return;
    let cancelled = false;
    loadTwitter().then(() => {
      if (cancelled || !tweetRef.current || !window.twttr?.widgets) return;
      const id = extractTweetId(url);
      if (!id) return;
      tweetRef.current.innerHTML = "";
      window.twttr.widgets
        .createTweet(id, tweetRef.current, { theme: "dark", align: "center" })
        .catch(() => {});
    });
    return () => {
      cancelled = true;
    };
  }, [url, type]);

  if (type === "youtube") {
    const id = youtubeId(url);
    if (!id) return <LinkCard url={url} />;
    return (
      <div className="mt-3 overflow-hidden rounded-xl border border-cream/10">
        <iframe
          className="aspect-video w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title="YouTube"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (type === "soundcloud") {
    return (
      <div className="mt-3 overflow-hidden rounded-xl border border-cream/10">
        <iframe
          className="w-full"
          height="166"
          loading="lazy"
          allow="autoplay"
          src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
            url,
          )}&color=%23e8b890&inverse=false&auto_play=false&show_user=true`}
          title="SoundCloud"
        />
      </div>
    );
  }

  if (type === "x") {
    return <div ref={tweetRef} className="mt-3 flex justify-center" />;
  }

  return <LinkCard url={url} />;
}

function LinkCard({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="mt-3 flex items-center gap-3 rounded-xl border border-cream/15 bg-magic-navy/30 px-4 py-3 transition hover:border-cream/30"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cream/10 text-cream/70">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 1 0-7.07-7.07L11.5 4.5M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 1 0 7.07 7.07L12.5 19.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block truncate font-sans text-sm text-cream/90">{hostnameOf(url)}</span>
        <span className="block truncate font-sans text-xs text-cream/45">{url}</span>
      </span>
    </a>
  );
}
