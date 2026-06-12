"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LikeButton from "@/components/campfire/LikeButton";
import NewsComments from "@/components/news/NewsComments";
import ShareStory from "@/components/news/ShareStory";
import type { FeedAuthor } from "@/components/campfire/types";
import type { News } from "@/data/news";
import type { NewsEngagement } from "@/components/news/types";

function prettyDate(iso: string, locale: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale === "pl" ? "pl-PL" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isExternal(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export default function NewsCard({
  item,
  eng,
  meId,
  meAuthor,
  onToggleLike,
  onCommentAdded,
  onCommentDeleted,
}: {
  item: News;
  eng: NewsEngagement;
  meId: string | null;
  meAuthor: FeedAuthor | null;
  onToggleLike: (slug: string) => void;
  onCommentAdded: (slug: string) => void;
  onCommentDeleted: (slug: string) => void;
}) {
  const t = useTranslations("news");
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <article className="glass-card overflow-hidden rounded-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Optional art — fixed 3:2 so any artwork fills the slot edge to edge. */}
        {item.image && (
          <div
            className="relative aspect-[3/2] w-full overflow-hidden md:order-1 md:aspect-auto md:h-full md:min-h-[20rem]"
            style={{ background: "#171633" }}
          >
            {/* Blurred copy fills any leftover panel height (desktop), the
                sharp copy stays fully visible via object-contain. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl brightness-[.55]"
              loading="lazy"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 h-full w-full object-contain"
              loading="lazy"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[#141230]/45 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#141230]/20"
            />
          </div>
        )}

        {/* Text page */}
        <div
          className={`flex flex-col justify-center px-7 py-9 text-left md:px-12 md:py-12 ${
            item.image ? "md:order-2" : "md:col-span-2 md:px-16"
          }`}
        >
          <p className="font-serif text-xs uppercase tracking-[0.28em] text-warm/85">
            {prettyDate(item.date, locale)}
          </p>
          <h3 className="mt-3 font-serif text-2xl font-normal leading-[1.1] tracking-tight text-cream md:text-3xl">
            {item.title}
          </h3>
          <p className="mt-4 font-sans text-sm leading-relaxed text-cream/80 md:text-base">
            {item.blurb}
          </p>

          {item.link && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {[
                { href: item.link, label: item.cta ?? t("readMore") },
                ...(item.link2 ? [{ href: item.link2, label: item.cta2 ?? t("readMore") }] : []),
              ].map(({ href, label }) =>
                isExternal(href) ? (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="liquid-glass inline-flex items-center rounded-full px-6 py-2.5 text-[0.85rem] text-cream"
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    key={href}
                    href={href}
                    className="liquid-glass inline-flex items-center rounded-full px-6 py-2.5 text-[0.85rem] text-cream"
                  >
                    {label}
                  </Link>
                ),
              )}
            </div>
          )}

          {/* Action row — like / comment / share */}
          <div className="mt-7 flex items-center gap-1 border-t border-cream/10 pt-3">
            <LikeButton
              liked={eng.liked_by_me}
              count={eng.like_count}
              disabled={!meId}
              onClick={() => onToggleLike(item.slug)}
            />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={t("commentsAria")}
              className={`group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                open ? "bg-cream/5 text-cream" : "text-cream/55 hover:bg-cream/5 hover:text-cream"
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="transition-transform duration-150 group-active:scale-90"
              >
                <path
                  d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinejoin="round"
                />
              </svg>
              {eng.comment_count > 0 && <span className="tabular-nums">{eng.comment_count}</span>}
            </button>
            <div className="ml-auto">
              <ShareStory item={item} />
            </div>
          </div>

        </div>
      </div>

      {/* Comments drawer — full card width BELOW the image/text spread, so an
          expanding thread never stretches the 3:2 artwork above it. */}
      {open && (
        <div className="border-t border-cream/10 bg-[#100e28]/35 px-7 py-6 md:px-12 md:py-7">
          <NewsComments
            slug={item.slug}
            meId={meId}
            meAuthor={meAuthor}
            onCommentAdded={() => onCommentAdded(item.slug)}
            onCommentDeleted={() => onCommentDeleted(item.slug)}
          />
        </div>
      )}
    </article>
  );
}
