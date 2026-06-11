"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";

// Background video — wildflower magic-hour loop (Kling AI).
// File: public/hero-wildflower-v4.mp4 — seamless 10s loop, ~1.8 MB.
// Endpoints near-identical + duplicate last frame dropped → no visible cut.
// Poster fallback: public/hero-poster.jpg (first frame).
const VIDEO_SRC = "/hero-wildflower-v4.mp4";

export default function Hero() {
  const t = useTranslations("hero");
  const videoRef = useRef<HTMLVideoElement>(null);

  // iOS Safari can be picky about autoplay — nudge playback.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {
      /* poster stays visible; playback starts on first interaction */
    });
    const kick = () => v.play().catch(() => {});
    document.addEventListener("touchstart", kick, { once: true, passive: true });
    return () => document.removeEventListener("touchstart", kick);
  }, []);

  return (
    <section className="relative flex min-h-[100svh] w-full flex-col items-center justify-end overflow-hidden px-6 pb-12 pt-28 text-center text-cream md:pb-20">
      {/* Fullscreen looping background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 h-full w-full object-cover object-bottom"
        src={VIDEO_SRC}
        poster="/hero-poster.jpg"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      {/* Magic-hour veil — light at the top so the logo book breathes,
          denser at the bottom where the headline lands. */}
      <div
        aria-hidden
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(28,31,82,0.26) 0%, rgba(28,31,82,0.2) 40%, rgba(20,18,48,0.36) 62%, rgba(18,16,44,0.55) 82%, rgba(16,14,40,0.74) 100%)",
        }}
      />
      {/* Localized scrim — pools soft darkness directly behind the headline
          so the type stays legible over the bright cloud/flower centre. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-[2] h-[72%]"
        style={{
          background:
            "radial-gradient(58% 70% at 50% 78%, rgba(14,12,36,0.70) 0%, rgba(14,12,36,0.42) 42%, rgba(14,12,36,0.0) 74%)",
        }}
      />

      {/* Wordmark sits above the emblem (the glowing book in the video). */}
      <div className="absolute inset-x-0 top-24 z-10 flex justify-center px-6 md:top-28">
        <div className="animate-fade-rise flex items-center gap-2 sm:gap-4">
          <span
            aria-hidden
            className="h-px w-6 bg-gradient-to-r from-transparent to-warm/60 sm:w-10 md:w-16"
          />
          <p className="whitespace-nowrap font-serif text-[0.62rem] uppercase tracking-[0.2em] text-cream/85 sm:text-sm sm:tracking-[0.34em] md:text-base [text-shadow:_0_1px_3px_rgba(8,7,24,0.65),_0_1px_16px_rgba(8,7,24,0.6)]">
            Magic Stories Records
          </p>
          <span
            aria-hidden
            className="h-px w-6 bg-gradient-to-l from-transparent to-warm/60 sm:w-10 md:w-16"
          />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <h1 className="animate-fade-rise-delay max-w-3xl font-serif text-4xl font-normal leading-[1.05] tracking-tight sm:text-5xl md:text-6xl text-cream [text-shadow:_0_2px_4px_rgba(8,7,24,0.55),_0_4px_34px_rgba(8,7,24,0.75)]">
          {t("title1")} <span className="text-twilight">{t("title2")}</span>
        </h1>

        <Button
          href="/stories"
          size="lg"
          className="animate-fade-rise-delay-2 mt-9"
        >
          {t("cta")}
        </Button>
      </div>
    </section>
  );
}
