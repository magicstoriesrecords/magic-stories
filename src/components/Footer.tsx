import { useTranslations } from "next-intl";

const socials = [
  { label: "SoundCloud", href: "https://soundcloud.com/magicstoriesrec" },
  { label: "Instagram", href: "https://www.instagram.com/magic_stories_records" },
  { label: "Facebook", href: "https://www.facebook.com/MagicStoriesRec" },
];

export default function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="px-6 py-16 md:px-12 md:py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
        {/* Full logo lock — positive (ink + gold) version for the light
            lavender background. next/image blocks SVG by default, so the mark
            is rendered through a plain <img>. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/logo-full-positive.svg"
          alt="Magic Stories Records"
          className="h-auto w-36 md:w-44"
        />
        <p className="mt-4 font-display text-[0.7rem] tracking-[0.42em] opacity-60">
          RECORDS
        </p>
        <p className="mt-5 font-serif text-sm italic opacity-70">
          {t("tagline")}
        </p>
        <nav
          aria-label="Social links"
          className="mt-8 flex flex-wrap items-center justify-center font-sans text-xs"
        >
          {socials.map((social, index) => (
            <span key={social.label} className="inline-flex items-center">
              {index > 0 && <span className="px-1 opacity-40">·</span>}
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center px-2 transition hover:opacity-60"
              >
                {social.label}
              </a>
            </span>
          ))}
        </nav>
      </div>
    </footer>
  );
}
