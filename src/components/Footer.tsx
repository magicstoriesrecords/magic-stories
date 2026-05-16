const socials = [
  { label: "Spotify", href: "#" },
  { label: "SoundCloud", href: "#" },
  { label: "Bandcamp", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "YouTube", href: "#" },
];

export default function Footer() {
  return (
    <footer className="px-8 py-16 opacity-70">
      <div className="mx-auto max-w-7xl text-center">
        <p className="font-serif text-sm tracking-wider md:text-base">
          MAGIC STORIES RECORDS
        </p>
        <p className="mt-3 italic opacity-60">
          Where music paints dreams
        </p>
        <p className="mt-6 text-sm">
          {socials.map((social, index) => (
            <span key={social.label}>
              {index > 0 && <span className="opacity-40"> · </span>}
              <a
                href={social.href}
                className="transition hover:opacity-60"
              >
                {social.label}
              </a>
            </span>
          ))}
        </p>
        <p className="mt-8 text-xs opacity-60">
          © 2026 Magic Stories Records. Szczecin, Poland.
        </p>
      </div>
    </footer>
  );
}
