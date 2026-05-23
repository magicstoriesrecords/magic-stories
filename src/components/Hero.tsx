"use client";

import { useEffect, useRef } from "react";
import Button from "@/components/ui/Button";

// Background video — our magic-hour material (Kling AI).
// File: public/hero-magic-hour.mp4 — seamless 10s loop, ~4 MB.
// Poster fallback: public/hero-poster.jpg.
const VIDEO_SRC = "/hero-magic-hour.mp4";

export default function Hero() {
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
    <section className="relative flex min-h-screen w-full flex-col items-center justify-end overflow-hidden px-6 pb-12 pt-28 text-center text-cream md:pb-20">
      {/* Fullscreen looping background video */}
      <video
        ref={videoRef}
        className="absolute inset-0 z-0 h-full w-full object-cover"
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
            "linear-gradient(180deg, rgba(28,31,82,0.28) 0%, rgba(28,31,82,0.20) 40%, rgba(28,31,82,0.30) 62%, rgba(28,31,82,0.62) 85%, rgba(28,31,82,0.78) 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <p className="animate-fade-rise mb-4 font-serif text-xs uppercase tracking-[0.28em] text-twilight md:mb-5 md:text-sm [text-shadow:_0_1px_12px_rgba(28,31,82,0.7)]">
          Magic Stories Records
        </p>

        <h1 className="animate-fade-rise-delay max-w-3xl font-serif text-4xl font-normal leading-[1.05] tracking-tight sm:text-5xl md:text-6xl [text-shadow:_0_2px_30px_rgba(28,31,82,0.6)]">
          Where music <span className="text-twilight">paints dreams.</span>
        </h1>

        <p className="animate-fade-rise-delay mt-6 max-w-xl font-sans text-base leading-relaxed text-twilight">
          A library of melodic &amp; organic house, where every release opens a
          chapter and every artist writes their own.
        </p>

        <Button
          href="/stories"
          size="lg"
          className="animate-fade-rise-delay-2 mt-9"
        >
          Enter the Story
        </Button>
      </div>
    </section>
  );
}
