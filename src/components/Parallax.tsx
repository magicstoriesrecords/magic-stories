"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  strength?: number; // px of travel across the viewport; keep small + subtle
};

// Subtle vertical parallax tied to scroll position. Only does work while the
// element is on screen (IntersectionObserver-gated) to avoid layout thrash from
// many instances scrolling at once. Disabled when the user prefers reduced motion.
export default function Parallax({
  children,
  className = "",
  strength = 24,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let inView = false;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress =
        (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);
      const clamped = Math.max(-1, Math.min(1, progress));
      el.style.transform = `translate3d(0, ${(-clamped * strength).toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (inView && !raf) raf = requestAnimationFrame(update);
    };

    // Only listen + promote to its own layer while visible.
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        el.style.willChange = inView ? "transform" : "auto";
        if (inView) update();
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(el);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
