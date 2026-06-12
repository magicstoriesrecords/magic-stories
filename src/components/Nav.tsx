"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import Button from "@/components/ui/Button";
import AuthNav from "@/components/auth/AuthNav";

const navLinks = [
  { key: "stories", href: "/stories" },
  { key: "artists", href: "/authors" },
  { key: "library", href: "/library" },
  { key: "podcasts", href: "/podcasts" },
  { key: "submit", href: "/submit" },
] as const;

// Pages whose hero sits on a dark night-sky background. The bar floats as a
// dark glass strip with cream text so it reads against the sky.
// NOTE: usePathname (from i18n/navigation) returns the path WITHOUT the
// locale prefix, so these checks work for both / and /pl/.
const darkPages = ["/authors", "/stories", "/library", "/podcasts", "/submit", "/account"];

// Inline EN | PL toggle. Switching locales keeps the current route; next-intl
// remembers the choice in the NEXT_LOCALE cookie.
function LocaleSwitch({
  tone,
  onPick,
  size = "sm",
}: {
  tone: "cream" | "ink";
  onPick?: () => void;
  size?: "sm" | "lg";
}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const base =
    size === "lg" ? "font-serif text-xl tracking-wide" : "font-serif text-sm tracking-wide";
  const active = tone === "cream" ? "text-cream" : "text-ink";
  const idle =
    tone === "cream" ? "text-cream/50 hover:text-cream" : "text-ink/45 hover:text-ink";
  const divider = tone === "cream" ? "text-cream/30" : "text-ink/25";

  return (
    <span className={`flex items-center gap-1.5 ${base}`}>
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          {i > 0 && <span className={divider}>|</span>}
          <button
            type="button"
            aria-current={l === locale ? "true" : undefined}
            onClick={() => {
              if (l !== locale) router.replace(pathname, { locale: l });
              onPick?.();
            }}
            className={`uppercase transition ${l === locale ? active : idle}`}
          >
            {l}
          </button>
        </span>
      ))}
    </span>
  );
}

export default function Nav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const onHome = pathname === "/";
  const onDark = darkPages.some((p) => pathname === p || pathname.startsWith(p + "/"));
  const lightOnDark = onHome || onDark; // cream text + light-on-dark treatment
  const [open, setOpen] = useState(false);

  // Lock background scroll + allow Escape to close while the sheet is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Home: transparent bar floating over the magic-hour video, cream text.
  // Dark pages (night-sky hero): sticky dark-glass strip with cream text.
  // Other inner pages: sticky soft-glass bar with ink text on lavender.
  const header = onHome
    ? "absolute inset-x-0 top-0 z-50 px-6 py-6 md:px-12 md:py-8"
    : onDark
      ? "sticky top-0 z-50 border-b border-cream/10 bg-[#15142f]/70 px-6 py-5 backdrop-blur-md md:px-12 md:py-6"
      : "sticky top-0 z-50 border-b border-ink/10 bg-twilight/70 px-6 py-5 backdrop-blur-md md:px-12 md:py-6";

  const link = lightOnDark
    ? "text-cream/80 hover:text-cream"
    : "text-ink/70 hover:text-ink";

  const logoTone = lightOnDark ? "text-cream" : "text-ink";

  // The menu/close toggle inherits the page-appropriate ink/cream tone.
  const toggle = lightOnDark ? "text-cream" : "text-ink";

  return (
    <>
      <header className={header}>
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            aria-label="Magic Stories Records"
            className={`flex items-center ${logoTone}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-mark.svg"
              alt="Magic Stories Records"
              className="h-9 w-auto drop-shadow-[0_1px_6px_rgba(8,7,24,0.6)] md:h-11"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`font-serif text-sm tracking-wide transition ${link}`}
              >
                {t(item.key)}
              </Link>
            ))}
            <Button href="/stories" size="sm">
              {t("browseReleases")}
            </Button>
            <AuthNav tone={lightOnDark ? "cream" : "ink"} />
            <LocaleSwitch tone={lightOnDark ? "cream" : "ink"} />
          </div>

          {/* Mobile toggle — subtle two-line mark */}
          <button
            type="button"
            aria-label={t("openMenu")}
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className={`flex h-11 w-11 items-center justify-center md:hidden ${toggle}`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 9h18M3 15h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </nav>
      </header>

      {/* Mobile full-screen sheet — rendered OUTSIDE <header> so the header's
          backdrop-filter doesn't trap this fixed element to the bar's box. */}
      {open && (
        <div
          className="fixed inset-0 z-[70] flex flex-col md:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(168,168,192,0.985) 0%, rgba(168,168,192,0.985) 55%, rgba(150,150,178,0.99) 100%)",
          }}
        >
          <div className="flex items-center justify-between px-6 py-6">
            <span className="font-display text-sm tracking-widest text-ink">
              MAGIC STORIES RECORDS
            </span>
            <button
              type="button"
              aria-label={t("closeMenu")}
              onClick={() => setOpen(false)}
              className="flex h-11 w-11 items-center justify-center text-ink"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col items-center justify-center gap-8">
            {navLinks.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-serif text-2xl tracking-wide text-ink transition hover:opacity-60"
              >
                {t(item.key)}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="font-serif text-2xl tracking-wide text-ink transition hover:opacity-60"
            >
              {t("account")}
            </Link>
            <LocaleSwitch tone="ink" size="lg" onPick={() => setOpen(false)} />
            <Link
              href="/stories"
              onClick={() => setOpen(false)}
              className="liquid-glass glass-ink mt-4 rounded-full px-12 py-[1.1rem] text-[0.95rem]"
            >
              {t("browseReleases")}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
