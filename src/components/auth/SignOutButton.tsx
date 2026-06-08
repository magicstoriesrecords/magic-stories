"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={loading}
      className="font-sans text-sm text-cream/70 underline-offset-4 transition hover:text-cream hover:underline disabled:opacity-60"
    >
      {loading ? "Wylogowuję…" : "Wyloguj się"}
    </button>
  );
}
