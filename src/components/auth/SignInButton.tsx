"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

// Starts the Google OAuth flow. After Google authenticates the user they are
// returned to /auth/callback, which finishes the sign-in and lands on /account.
export default function SignInButton({ next = "/account" }: { next?: string }) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  // Send the user back to the locale they were browsing in (EN has no prefix).
  const localizedNext = locale === "en" ? next : `/${locale}${next}`;

  async function signIn() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(localizedNext)}`,
      },
    });
    if (error) setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={signIn}
      disabled={loading}
      className="liquid-glass inline-flex items-center gap-3 rounded-full px-8 py-[1.1rem] text-[0.95rem] disabled:opacity-60"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
        />
      </svg>
      {loading ? t("connecting") : t("signInGoogle")}
    </button>
  );
}
