import Link from "next/link";
import Button from "@/components/ui/Button";

const links = [
  { label: "Stories", href: "/stories" },
  { label: "Authors", href: "/authors" },
  { label: "Sessions", href: "/sessions" },
  { label: "Submit", href: "/submit" },
];

export default function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 px-6 py-6 md:px-12 md:py-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-center md:justify-between">
        <Link
          href="/"
          className="font-display text-sm tracking-widest text-cream md:text-base [text-shadow:_0_1px_12px_rgba(28,31,82,0.6)]"
        >
          MAGIC STORIES RECORDS
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-serif text-sm tracking-wide text-cream/80 transition hover:text-cream"
            >
              {link.label}
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
