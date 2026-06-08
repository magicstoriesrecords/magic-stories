"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  role: "member" | "artist";
  author_slug: string | null;
};

const USERNAME_RE = /^[a-z0-9_]{3,20}$/;

export default function ProfileEditor({
  profile,
  email,
}: {
  profile: Profile;
  email: string | undefined;
}) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState(profile.username);
  const [displayName, setDisplayName] = useState(profile.display_name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  async function uploadAvatar(file: File) {
    setStatus("saving");
    setMessage("");
    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${profile.id}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, cacheControl: "3600" });

    if (uploadError) {
      setStatus("error");
      setMessage("Nie udało się wgrać zdjęcia.");
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);
    // Cache-bust so the new image shows immediately.
    const busted = `${publicUrl}?v=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: busted })
      .eq("id", profile.id);

    if (updateError) {
      setStatus("error");
      setMessage("Zdjęcie wgrane, ale nie zapisało się w profilu.");
      return;
    }

    setAvatarUrl(busted);
    window.dispatchEvent(new CustomEvent("msr:profile-updated", { detail: { avatar_url: busted } }));
    setStatus("saved");
    router.refresh();
  }

  async function save() {
    if (!USERNAME_RE.test(username)) {
      setStatus("error");
      setMessage("Nazwa: 3–20 znaków, małe litery, cyfry i podkreślenie.");
      return;
    }
    setStatus("saving");
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ username, display_name: displayName || null })
      .eq("id", profile.id);

    if (error) {
      setStatus("error");
      setMessage(
        error.code === "23505"
          ? "Ta nazwa użytkownika jest już zajęta."
          : "Nie udało się zapisać zmian.",
      );
      return;
    }
    window.dispatchEvent(new CustomEvent("msr:profile-updated", { detail: { username, avatar_url: avatarUrl } }));
    setStatus("saved");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="glass-card rounded-3xl p-8 md:p-10">
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-cream/25 bg-magic-navy/40">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="" fill sizes="80px" className="object-cover" unoptimized />
            ) : (
              <span className="flex h-full w-full items-center justify-center font-serif text-2xl text-cream/80">
                {username.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="font-sans text-sm text-cream underline-offset-4 transition hover:underline"
            >
              Zmień avatar
            </button>
            <p className="mt-1 font-sans text-xs text-cream/50">JPG lub PNG, do ~2&nbsp;MB.</p>
            <input
              ref={fileInput}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadAvatar(file);
              }}
            />
          </div>
          {profile.role === "artist" && (
            <span className="ml-auto rounded-full border border-warm/50 bg-warm/10 px-3 py-1 font-serif text-xs tracking-wide text-warm">
              Artysta
            </span>
          )}
        </div>

        {/* Fields */}
        <div className="mt-8 space-y-5">
          <label className="block">
            <span className="font-serif text-xs uppercase tracking-[0.18em] text-cream/60">
              Nazwa użytkownika
            </span>
            <div className="mt-2 flex items-center rounded-xl border border-cream/15 bg-magic-navy/30 px-3 focus-within:border-cream/40">
              <span className="font-sans text-cream/40">@</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                className="w-full bg-transparent px-1 py-2.5 font-sans text-cream outline-none"
                placeholder="twoja_nazwa"
              />
            </div>
          </label>

          <label className="block">
            <span className="font-serif text-xs uppercase tracking-[0.18em] text-cream/60">
              Nazwa wyświetlana <span className="normal-case text-cream/40">(opcjonalnie)</span>
            </span>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-cream/15 bg-magic-navy/30 px-4 py-2.5 font-sans text-cream outline-none focus:border-cream/40"
              placeholder="Jak chcesz być widoczny/a"
            />
          </label>

          <p className="font-sans text-xs text-cream/45">Zalogowano jako {email}</p>
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center gap-4">
          <button
            type="button"
            onClick={save}
            disabled={status === "saving"}
            className="liquid-glass rounded-full px-8 py-3 text-sm disabled:opacity-60"
          >
            {status === "saving" ? "Zapisuję…" : "Zapisz zmiany"}
          </button>
          {status === "saved" && <span className="font-sans text-sm text-warm">Zapisano ✓</span>}
          {status === "error" && <span className="font-sans text-sm text-red-300">{message}</span>}
        </div>
      </div>
    </div>
  );
}
