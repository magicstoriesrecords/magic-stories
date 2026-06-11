import { useTranslations } from "next-intl";

const socials = [
  { label: "Spotify", href: "#" },
  { label: "SoundCloud", href: "#" },
  { label: "Bandcamp", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "YouTube", href: "#" },
];

export default function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="px-6 py-16 md:px-12 md:py-20">
      <div className="mx-auto max-w-7xl text-center">
        <p className="font-display text-sm tracking-widest md:text-base">
          MAGIC STORIES RECORDS
        </p>
        <p className="mt-3 font-serif text-sm italic opacity-70">
          {t("tagline")}
        </p>
        <p className="mt-8 font-sans text-xs">
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
      </div>
    </footer>
  );
}
