const links = [
  { label: "Stories", href: "#" },
  { label: "Artists", href: "#" },
  { label: "Reading Room", href: "#" },
  { label: "Sessions", href: "#" },
  { label: "Submit", href: "#" },
];

export default function Nav() {
  return (
    <header className="px-8 py-6">
      <nav className="mx-auto flex max-w-7xl items-center justify-between">
        <a
          href="/"
          className="font-serif text-sm tracking-wider md:text-base"
        >
          MAGIC STORIES RECORDS
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm transition hover:opacity-60"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
