"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

const links = [
  { label: "Stories", href: "/stories" },
  { label: "Authors", href: "/authors" },
  { label: "Sessions", href: "/sessions" },
  { label: "Submit", href: "/submit" },
];

export default function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
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
  // Inner pages: sticky bar with a soft glass backdrop and ink text so the
  // links stay readable on the lavender background.
  const header = onHome
    ? "absolute inset-x-0 top-0 z-50 px-6 py-6 md:px-12 md:py-8"
    : "sticky top-0 z-50 border-b border-ink/10 bg-twilight/70 px-6 py-5 backdrop-blur-md md:px-12 md:py-6";

  const logo = onHome
    ? "text-cream [text-shadow:_0_1px_12px_rgba(28,31,82,0.6)]"
    : "text-ink";

  const link = onHome
    ? "text-cream/80 hover:text-cream"
    : "text-ink/70 hover:text-ink";

  // The menu/close toggle inherits the page-appropriate ink/cream tone.
  const toggle = onHome ? "text-cream" : "text-ink";

  return (
    <header className={header}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link
          href="/"
          className={`font-display text-sm tracking-widest md:text-base ${logo}`}
        >
          MAGIC STORIES RECORDS
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`font-serif text-sm tracking-wide transition ${link}`}
            >
              {item.label}
            </Link>
          ))}
          <Button href="/stories" size="sm">
            Open the Library
          </Button>
        </div>

        {/* Mobile toggle — subtle two-line mark */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className={`flex h-11 w-11 items-center justify-center md:hidden ${toggle}`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 9h18M3 15h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

      {/* Mobile full-screen sheet */}
      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-twilight/95 backdrop-blur-xl md:hidden">
          <div className="flex items-center justify-between px-6 py-6">
            <span className="font-display text-sm tracking-widest text-ink">
              MAGIC STORIES RECORDS
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="flex h-11 w-11 items-center justify-center text-ink"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col items-center justify-center gap-8">
            {links.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-serif text-2xl tracking-wide text-ink transition hover:opacity-60"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/stories"
              onClick={() => setOpen(false)}
              className="liquid-glass glass-ink mt-4 rounded-full px-12 py-[1.1rem] text-[0.95rem]"
            >
              Open the Library
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
