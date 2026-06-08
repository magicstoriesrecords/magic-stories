"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type MiniProfile = { username: string; avatar_url: string | null };

// Compact auth indicator for the top navigation. Shows a "Sign in" link when
// logged out, or the user's avatar + handle linking to /account when logged in.
export default function AuthNav({ tone }: { tone: "cream" | "ink" }) {
  const [profile, setProfile] = useState<MiniProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function loadProfile(userId: string) {
      const { data } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", userId)
        .single();
      if (!active) return;
      setProfile(data ?? { username: "account", avatar_url: null });
      setReady(true);
    }

    // Initial fetch — safe here because we are NOT inside an auth callback.
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!active) return;
      if (user) {
        loadProfile(user.id);
      } else {
        setProfile(null);
        setReady(true);
      }
    });

    // IMPORTANT: never call Supabase methods synchronously inside this
    // callback — it runs while the auth lock is held and would deadlock every
    // other Supabase request on the page. Defer the work with setTimeout(0).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => {
        if (!active) return;
        if (session?.user) {
          loadProfile(session.user.id);
        } else {
          setProfile(null);
          setReady(true);
        }
      }, 0);
    });

    // Live-update the bar when the user edits their profile (ProfileEditor
    // dispatches this event), so the avatar/handle refresh without a reload.
    const onUpdated = (e: Event) => {
      if (!active) return;
      const detail = (e as CustomEvent<Partial<MiniProfile>>).detail ?? {};
      setProfile((prev) => ({
        username: detail.username ?? prev?.username ?? "account",
        avatar_url:
          detail.avatar_url !== undefined ? detail.avatar_url : prev?.avatar_url ?? null,
      }));
      setReady(true);
    };
    window.addEventListener("msr:profile-updated", onUpdated);

    return () => {
      active = false;
      subscription.unsubscribe();
      window.removeEventListener("msr:profile-updated", onUpdated);
    };
  }, []);

  const text = tone === "cream" ? "text-cream/80 hover:text-cream" : "text-ink/70 hover:text-ink";

  if (!ready) return <span className="h-9 w-9" aria-hidden />;

  if (!profile) {
    return (
      <Link href="/account" className={`font-serif text-sm tracking-wide transition ${text}`}>
        Sign in
      </Link>
    );
  }

  return (
    <Link href="/account" className={`group flex items-center gap-2 ${text}`} aria-label="Your account">
      {profile.avatar_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.avatar_url}
          alt=""
          className="h-8 w-8 rounded-full border border-cream/30 object-cover"
        />
      ) : (
        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-current text-xs uppercase">
          {profile.username.slice(0, 1)}
        </span>
      )}
      <span className="hidden font-serif text-sm tracking-wide lg:inline">{profile.username}</span>
    </Link>
  );
}
