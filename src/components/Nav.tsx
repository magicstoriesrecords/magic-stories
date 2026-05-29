"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
    <header className={header}>
      <nav className="mx-auto flex max-w-7xl items-center justify-center md:justify-between">
        <Link
          href="/"
          className={`font-display text-sm tracking-widest md:text-base ${logo}`}
        >
          MAGIC STORIES RECORDS
        </Link>
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
      </nav>
    </header>
  );
}
