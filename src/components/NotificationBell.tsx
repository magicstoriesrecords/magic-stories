"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import TimeAgo from "@/components/campfire/TimeAgo";
import { news } from "@/data/news";

type Actor = { username: string; display_name: string | null; avatar_url: string | null };
type NotifType =
  | "post_like"
  | "reply_like"
  | "comment_like"
  | "post_reply"
  | "thread_reply"
  | "news";

type Notif = {
  id: string;
  type: NotifType;
  post_id: string | null;
  reply_id: string | null;
  news_slug: string | null;
  read: boolean;
  created_at: string;
  actor: Actor | null;
};

// Actor profile is embedded via the explicit FK (a junction to profiles creates
// a second relation path, so the FK MUST be named — otherwise PGRST201).
const SELECT =
  "id, type, post_id, reply_id, news_slug, read, created_at, actor:profiles!notifications_actor_id_fkey(username, display_name, avatar_url)";

const LIMIT = 20;

// Bell + dropdown for the top navigation. Self-hides when signed out. Opening
// the panel marks everything read (per the agreed behaviour).
export default function NotificationBell({ tone }: { tone: "cream" | "ink" }) {
  const t = useTranslations("notif");
  const locale = useLocale();
  const [meId, setMeId] = useState<string | null>(null);
  const [items, setItems] = useState<Notif[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Initial user + load.
  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function load(uid: string) {
      const { data } = await supabase
        .from("notifications")
        .select(SELECT)
        .eq("user_id", uid)
        .order("created_at", { ascending: false })
        .limit(LIMIT);
      if (!active) return;
      const rows = (data ?? []) as unknown as Notif[];
      setItems(rows);
      setUnread(rows.filter((r) => !r.read).length);
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!active) return;
      if (user) {
        setMeId(user.id);
        load(user.id);
      } else {
        setMeId(null);
      }
    });

    // Defer Supabase calls out of the auth callback (lock-held) with setTimeout.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => {
        if (!active) return;
        if (session?.user) {
          setMeId(session.user.id);
          load(session.user.id);
        } else {
          setMeId(null);
          setItems([]);
          setUnread(0);
        }
      }, 0);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Realtime — new notifications arrive live (RLS scopes them to me).
  useEffect(() => {
    if (!meId) return;
    const supabase = createClient();
    // Unique channel name per mount: the shared client keeps channels by name,
    // so reusing `notifications:<id>` across a Strict-Mode remount returns an
    // already-subscribed channel and throws "cannot add postgres_changes
    // callbacks ... after subscribe()". A fresh suffix avoids the collision.
    const channel = supabase
      .channel(`notifications:${meId}:${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${meId}`,
        },
        async (payload) => {
          const id = (payload.new as { id: string }).id;
          const { data } = await supabase.from("notifications").select(SELECT).eq("id", id).single();
          if (!data) return;
          const n = data as unknown as Notif;
          setItems((prev) => (prev.some((p) => p.id === n.id) ? prev : [n, ...prev].slice(0, LIMIT)));
          setUnread((u) => u + 1);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [meId]);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (next && unread > 0 && meId) {
      setUnread(0);
      setItems((prev) => prev.map((p) => ({ ...p, read: true })));
      const supabase = createClient();
      await supabase.from("notifications").update({ read: true }).eq("user_id", meId).eq("read", false);
    }
  }

  if (!meId) return null;

  const iconColor =
    tone === "cream" ? "text-cream/80 hover:text-cream" : "text-ink/70 hover:text-ink";

  const actorName = (n: Notif) =>
    n.actor?.display_name || (n.actor ? `@${n.actor.username}` : t("someone"));

  const newsTitle = (slug: string | null) => {
    const it = news.find((x) => x.slug === slug);
    if (!it) return "";
    return locale === "pl" ? it.titlePl : it.title;
  };

  function text(n: Notif): string {
    switch (n.type) {
      case "post_like":
        return t("postLike", { name: actorName(n) });
      case "reply_like":
        return t("replyLike", { name: actorName(n) });
      case "comment_like":
        return t("commentLike", { name: actorName(n) });
      case "post_reply":
        return t("postReply", { name: actorName(n) });
      case "thread_reply":
        return t("threadReply", { name: actorName(n) });
      case "news":
        return t("news", { title: newsTitle(n.news_slug) });
    }
  }

  function href(n: Notif): string {
    if (n.type === "news" || n.type === "comment_like") {
      return n.news_slug ? `/news/${n.news_slug}` : "/news";
    }
    return n.post_id ? `/library#post-${n.post_id}` : "/library";
  }

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={toggle}
        aria-label={t("title")}
        aria-expanded={open}
        className={`relative flex h-9 w-9 items-center justify-center transition ${iconColor}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-warm px-1 text-[0.6rem] font-semibold text-magic-navy">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-[80] mt-2 w-[min(360px,86vw)] overflow-hidden rounded-2xl border border-cream/15 bg-[#15142f]/95 shadow-2xl backdrop-blur-md">
          <div className="border-b border-cream/10 px-4 py-3 font-serif text-sm tracking-wide text-cream">
            {t("title")}
          </div>
          <div className="max-h-[60vh] overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-6 text-center font-sans text-sm text-cream/50">{t("empty")}</p>
            ) : (
              items.map((n) => (
                <Link
                  key={n.id}
                  href={href(n)}
                  onClick={() => setOpen(false)}
                  className={`flex items-start gap-3 px-4 py-3 transition hover:bg-cream/5 ${
                    !n.read ? "bg-cream/[0.07]" : ""
                  }`}
                >
                  {n.actor?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={n.actor.avatar_url}
                      alt=""
                      className="h-8 w-8 shrink-0 rounded-full border border-cream/20 object-cover"
                    />
                  ) : (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cream/20 font-serif text-xs text-cream/80">
                      {n.type === "news" ? "★" : (n.actor?.username ?? "?").slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block font-sans text-sm leading-snug text-cream/90">{text(n)}</span>
                    <span className="mt-0.5 block font-sans text-xs text-cream/45">
                      <TimeAgo iso={n.created_at} />
                    </span>
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
