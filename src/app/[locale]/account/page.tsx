import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import NightSky from "@/components/NightSky";
import SignInButton from "@/components/auth/SignInButton";
import SignOutButton from "@/components/auth/SignOutButton";
import ProfileEditor, { type Profile } from "@/components/account/ProfileEditor";
import { createClient } from "@/lib/supabase/server";
import { buildPageMeta } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.account" });
  // Private, per-user page — keep it out of search results.
  return buildPageMeta({
    locale,
    path: "/account",
    title: t("title"),
    description: t("description"),
    noindex: true,
  });
}

// Profile is per-user and depends on the auth cookie, so render dynamically.
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const t = await getTranslations("account");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: Profile | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("id, username, display_name, avatar_url, role, author_slug")
      .eq("id", user.id)
      .single();
    profile = (data as Profile) ?? null;
  }

  return (
    <section
      className="relative isolate flex flex-1 flex-col overflow-hidden px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-20"
      style={{ background: "linear-gradient(180deg,#15142f 0%,#1b1942 50%,#211d4f 100%)" }}
    >
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
        <NightSky />
        <div
          aria-hidden
          className="absolute inset-0 -z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/authors-sky.png')" }}
        />
        <div aria-hidden className="absolute inset-0 -z-0 bg-[#141230]/30" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-xs uppercase tracking-[0.28em] text-cream/70 md:text-sm">
            {t("kicker")}
          </p>
          <h1 className="mt-4 font-serif text-3xl font-normal leading-[1.1] tracking-tight text-cream sm:text-4xl md:text-5xl">
            {user ? t("titleIn") : t("titleOut")}
          </h1>
          <p className="mt-6 font-sans text-base leading-relaxed text-cream/75">
            {user ? t("leadIn") : t("leadOut")}
          </p>
        </header>

        <div className="mt-12">
          {user && profile ? (
            <>
              <ProfileEditor profile={profile} email={user.email} />
              <div className="mt-8 text-center">
                <SignOutButton />
              </div>
            </>
          ) : (
            <div className="flex justify-center">
              <SignInButton next="/account" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
