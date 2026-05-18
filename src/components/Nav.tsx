import Link from "next/link";

const links = [
  { label: "Stories", href: "/stories" },
  { label: "Authors", href: "/authors" },
  { label: "Sessions", href: "/sessions" },
  { label: "Submit", href: "/submit" },
];

export default function Nav() {
  return (
    <header className="px-6 py-6 md:px-12 md:py-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <Link
          href="/"
          className="font-display text-sm tracking-widest md:text-base"
        >
          MAGIC STORIES RECORDS
        </Link>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="font-serif text-sm tracking-wide transition hover:opacity-60"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
